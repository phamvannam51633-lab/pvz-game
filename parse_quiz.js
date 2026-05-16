const fs = require('fs');
const path = require('path');

const TXT_DIR = 'E:/wenjian/frist cc/mianyi_txt';
const OUT_JSON = 'E:/wenjian/frist cc/quiz-data.json';

function parseChapterNum(filename) {
  const m = filename.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 999;
}

function splitOptionsInLine(line) {
  const normalized = line.replace(/\s*([A-E])\s*[．.、\s]\s*/g, '\n$1. ');
  return normalized.split('\n')
    .map(s => s.trim())
    .filter(s => /^[A-E]\.\s/.test(s));
}

// ── 通用题目解析 ──
function parseQuestionBlock(text, qLabel, endLabels) {
  const idx = text.indexOf(qLabel);
  if (idx < 0) return [];

  const section = text.slice(idx);
  let end = section.length;
  for (const m of endLabels) {
    const p = section.indexOf(m);
    if (p > 0 && p < end) end = p;
  }

  const block = section.slice(0, end);
  const parts = block.split(/\n\s*(\d+)\s*[．.、]\s*/);
  const questions = [];

  for (let i = 1; i + 1 < parts.length; i += 2) {
    const qnum = parseInt(parts[i]);
    const content = parts[i + 1];
    const lines = content.split('\n');

    let title = '';
    const options = [];

    for (const rawLine of lines) {
      let line = rawLine.trim();
      if (!line) continue;

      if (/^[A-E]\s*[．.、\s]/.test(line)) {
        const splitOpts = splitOptionsInLine(line);
        for (const opt of splitOpts) {
          if (options.length < 5) options.push(opt);
        }
      } else if (options.length === 0) {
        title += line;
      } else if (/[A-E]\s*[．.、\s]/.test(line)) {
        const splitOpts = splitOptionsInLine(line);
        for (const opt of splitOpts) {
          if (options.length < 5) options.push(opt);
        }
      } else {
        if (options.length > 0) {
          options[options.length - 1] += ' ' + line;
        }
      }
    }

    if (title.trim() && options.length >= 3) {
      questions.push({ id: qnum, title: title.trim(), options });
    }
  }
  return questions;
}

// ── A 型答案解析（单选） ──
function parseAAnswersFromBlock(ansBlock) {
  const pairs = [...ansBlock.matchAll(/(\d+)\s*[．.\s、，,]*\s*([A-E])(?![A-E])/g)];
  const answers = {};
  for (const [, numStr, letter] of pairs) {
    answers[parseInt(numStr)] = letter.charCodeAt(0) - 'A'.charCodeAt(0);
  }
  return answers;
}

// ── X 型答案解析（多选） ──
function parseXAnswersFromBlock(ansBlock) {
  // Match patterns like: "1 ABCDE" or "1.ABCDE" or "1．ABCDE" or "1 AB, 2 BC"
  const answers = {};
  // match "number" followed by "multiple letters"
  const re = /(\d+)\s*[．.\s、，:：]*\s*([A-E]{2,5})/gi;
  let match;
  while ((match = re.exec(ansBlock)) !== null) {
    const num = parseInt(match[1]);
    const letters = match[2].toUpperCase().split('');
    const indices = letters.map(l => l.charCodeAt(0) - 'A'.charCodeAt(0));
    if (!answers[num]) answers[num] = [];
    answers[num] = [...new Set([...answers[num], ...indices])].sort();
  }
  return answers;
}

// ── 查找答案区块 ──
function findAnswerSection(text) {
  for (const m of ['参考答案', '题解']) {
    const p = text.indexOf(m);
    if (p >= 0) return text.slice(p);
  }
  return null;
}

function findAnswerBlock(ansText, label, altLabel, endLabels) {
  let idx = ansText.indexOf(label);
  if (idx < 0 && altLabel) idx = ansText.indexOf(altLabel);
  if (idx < 0) return null;

  let block = ansText.slice(idx);
  let end = block.length;
  for (const m of endLabels) {
    const p = block.indexOf(m);
    if (p > 0 && p < end) end = p;
  }
  return block.slice(0, end);
}

// ── 解析单个文件 ──
function parseFile(filepath) {
  const text = fs.readFileSync(filepath, 'utf-8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let title = lines[0] || path.basename(filepath);
  title = title.replace(/^第[一二三四五六七八九十\d]+章\s*/, '').trim();
  if (!title) title = lines[1] || '未知章节';

  // 题目
  const allEndLabels = ['[B型题]', '[B 型题]', '[C型题]', '[C 型题]', '[X型题]', '[X 型题]',
    '三、', '四、', '五、', '一、'];
  const aquestions = parseQuestionBlock(text, '[A型题]', allEndLabels);
  const xquestions = parseQuestionBlock(text, '[X型题]', ['[B型题]', '[B 型题]', '[C型题]', '[C 型题]',
    '三、', '四、', '五、', '一、', '二、']);

  // 答案
  const ansText = findAnswerSection(text);
  const aanswers = {};
  const xanswers = {};
  if (ansText) {
    const ansEndLabels = ['[B型题]', '[B 型题]', '[C型题]', 'B型题：', 'C型题：',
      '三、', '四、', '五、', '二、'];
    const aBlock = findAnswerBlock(ansText, '[A型题]', 'A型题：', ansEndLabels);
    if (aBlock) Object.assign(aanswers, parseAAnswersFromBlock(aBlock));

    const xEndLabels = ['[B型题]', '[B 型题]', '[C型题]', 'B型题：', 'C型题：',
      '三、', '四、', '五、', '二、', '一、'];
    const xBlock = findAnswerBlock(ansText, '[X型题]', 'X型题：', xEndLabels);
    if (xBlock) {
      const xParsed = parseXAnswersFromBlock(xBlock);
      // If nothing found after [X型题], also look before it (some docs put X answers before the label)
      if (Object.keys(xParsed).length === 0) {
        const xIdx = ansText.indexOf('[X型题]');
        if (xIdx > 0) {
          // Search up to 500 chars before [X型题] for X-type answer patterns
          const preBlock = ansText.slice(Math.max(0, xIdx - 500), xIdx);
          Object.assign(xParsed, parseXAnswersFromBlock(preBlock));
        }
      }
      Object.assign(xanswers, xParsed);
    }
  }

  for (const q of aquestions) {
    q.answer = aanswers[q.id] !== undefined ? aanswers[q.id] : -1;
  }
  for (const q of xquestions) {
    q.answer = xanswers[q.id] !== undefined ? xanswers[q.id] : [];
  }

  return { title, aquestions, xquestions };
}

// ── 主程序 ──
function main() {
  const files = fs.readdirSync(TXT_DIR)
    .filter(f => f.endsWith('.txt'))
    .map(f => ({ name: f, num: parseChapterNum(f) }))
    .sort((a, b) => a.num - b.num);

  const chapters = [];
  let totalA = 0, totalX = 0;
  const issues = [];

  for (const { name, num } of files) {
    const data = parseFile(path.join(TXT_DIR, name));
    const aWithAns = data.aquestions.filter(q => q.answer >= 0).length;
    const xWithAns = data.xquestions.filter(q => q.answer.length > 0).length;

    console.log(`第${String(num).padStart(2)}章 ${data.title}: A型${data.aquestions.length}题(${aWithAns}有答案) X型${data.xquestions.length}题(${xWithAns}有答案)`);

    if (data.aquestions.length === 0 && data.xquestions.length === 0) {
      issues.push(`第${num}章: 未解析到任何题目`);
    }
    const aMissing = data.aquestions.filter(q => q.answer < 0).map(q => q.id);
    if (aMissing.length > 0) issues.push(`第${num}章 A型: 题目 ${aMissing.join(', ')} 缺少答案`);
    const xMissing = data.xquestions.filter(q => q.answer.length === 0).map(q => q.id);
    if (xMissing.length > 0) issues.push(`第${num}章 X型: 题目 ${xMissing.join(', ')} 缺少答案`);

    chapters.push({ num, title: data.title, filename: name, aquestions: data.aquestions, xquestions: data.xquestions });
    totalA += data.aquestions.length;
    totalX += data.xquestions.length;
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(chapters, null, 2), 'utf-8');

  console.log(`\n总计: ${chapters.length} 章, A型 ${totalA} 题, X型 ${totalX} 题, 共 ${totalA + totalX} 题`);
  if (issues.length > 0) {
    console.log('\n⚠️ 问题:');
    issues.forEach(i => console.log('  - ' + i));
  }
}

main();
