const fs = require('fs');

function escAttr(s) { return s.replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

const DATA = JSON.parse(fs.readFileSync('E:/wenjian/frist cc/quiz-data.json', 'utf-8'));
const chapters = DATA.filter(c => c.aquestions.length > 0 || c.xquestions.length > 0);
const totalA = chapters.reduce((s, c) => s + c.aquestions.length, 0);
const totalX = chapters.reduce((s, c) => s + c.xquestions.length, 0);

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100dvh;height:100vh;overflow:hidden}
body{font-family:'Microsoft YaHei',Arial,sans-serif;background:#1a1a2e;color:#ccc;display:flex;flex-direction:column}

/* ── 首页 ── */
#home{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;flex:1;gap:20px}
#home h1{color:#e8d5b7;font-size:28px;letter-spacing:2px;margin-bottom:8px}
#home .sub{color:#889;font-size:14px;margin-bottom:24px;text-align:center;padding:0 16px}
.mode-btn{display:block;width:320px;max-width:90vw;padding:20px 32px;border-radius:14px;cursor:pointer;text-align:center;transition:all .2s;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#ddd;font-size:17px;font-family:inherit;letter-spacing:1px}
.mode-btn:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.25);transform:translateY(-2px)}
.mode-btn strong{display:block;font-size:20px;margin-bottom:4px;color:#fff}
.mode-btn span{font-size:13px;color:#999}

/* ── 顶部导航栏（手机端章节选择器） ── */
#top-nav{display:none;flex-shrink:0;align-items:center;gap:8px;padding:8px 12px;background:rgba(0,0,0,0.4);border-bottom:1px solid rgba(255,255,255,0.08)}
#top-nav select{flex:1;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);font-size:14px;font-family:inherit;min-width:0;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23aaa' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
#top-nav .btn-back{flex-shrink:0;padding:8px 14px;border-radius:8px;background:rgba(255,255,255,0.06);color:#ccc;border:none;font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap}
#top-nav .btn-back:hover{background:rgba(255,255,255,0.12)}

/* ── 桌面端侧边栏 ── */
#sidebar{width:210px;min-width:210px;background:rgba(0,0,0,0.3);overflow-y:auto;border-right:1px solid rgba(255,255,255,0.08);padding-bottom:20px;flex-shrink:0;display:none}
#sidebar h3{color:#e8d5b7;padding:14px 14px 8px;font-size:14px;letter-spacing:1px}
.ch-link{display:block;padding:8px 14px;cursor:pointer;font-size:13px;color:#999;transition:all .15s;border-left:3px solid transparent;user-select:none}
.ch-link:hover{background:rgba(255,255,255,0.05);color:#ddd}
.ch-link.active{background:rgba(92,107,192,0.2);color:#fff;border-left-color:#5c6bc0}
.ch-link .badge{float:right;font-size:11px;color:#777}
.ch-link.active .badge{color:#aaa}
#back-home{display:block;padding:10px 14px;cursor:pointer;font-size:13px;color:#5c6bc0;margin-bottom:4px;border:none;background:none;width:100%;text-align:left;font-family:inherit}
#back-home:hover{color:#7986cb}

/* ── 主区域 ── */
#content-wrap{display:none;flex:1;min-height:0;overflow:hidden}
#main{flex:1;display:none;flex-direction:column;min-height:0;overflow:hidden}
#header{padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:12px;flex-shrink:0;flex-wrap:wrap}
#header h2{color:#e8d5b7;font-size:19px}
#stats-bar{display:flex;gap:12px;font-size:13px;margin-left:auto}
#stats-bar span{color:#FFD54F;font-weight:bold}
#progress-wrap{flex-shrink:0;height:3px;background:rgba(255,255,255,0.06)}
#progress-fill{height:100%;background:linear-gradient(90deg,#4CAF50,#8BC34A);transition:width .3s}
#scroll{flex:1;overflow-y:auto;padding:16px 24px;-webkit-overflow-scrolling:touch}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 22px;margin-bottom:12px}
.q-num{display:inline-block;background:#3f51b5;color:#fff;font-size:11px;font-weight:bold;padding:2px 9px;border-radius:10px;margin-bottom:8px}
.q-num.x-type{background:#e65100}
.q-type-tag{font-size:11px;margin-left:6px;padding:1px 6px;border-radius:6px}
.q-type-tag.single{background:rgba(63,81,181,0.3);color:#9fa8da}
.q-type-tag.multi{background:rgba(230,81,0,0.3);color:#ffab91}
.section-label{color:#e8d5b7;font-size:15px;margin:18px 0 10px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.08)}
.q-title{color:#e0e0e0;font-size:15px;line-height:1.6;margin-bottom:10px}
.options{display:flex;flex-direction:column;gap:4px}
.opt{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;border:2px solid transparent;background:rgba(255,255,255,0.03);font-size:14px;transition:all .15s;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.opt:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.1)}
.opt.selected{border-color:#5c6bc0;background:rgba(92,107,192,0.16);color:#fff}
.opt.correct{border-color:#4CAF50!important;background:rgba(76,175,80,0.18)!important;color:#A5D6A7!important}
.opt.wrong{border-color:#f44336!important;background:rgba(244,67,54,0.16)!important;color:#EF9A9A!important}
.opt.disabled{pointer-events:none}
.opt.disabled.correct,.opt.disabled.wrong{opacity:1}
.opt-label{display:flex;align-items:center;justify-content:center;width:27px;height:27px;border-radius:50%;background:rgba(255,255,255,0.08);font-weight:bold;font-size:13px;flex-shrink:0}
.x-type .opt-label{border-radius:6px}
.opt.selected .opt-label{background:#5c6bc0}
.opt.correct .opt-label{background:#4CAF50}
.opt.wrong .opt-label{background:#f44336}
.result-tag{margin-left:auto;font-size:16px;display:none}
.opt.correct .result-tag,.opt.wrong .result-tag{display:inline}

#btn-row{padding:12px 24px 16px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:10px;flex-shrink:0;align-items:center;flex-wrap:wrap}
.btn{padding:10px 24px;border-radius:8px;font-size:14px;font-weight:bold;border:none;cursor:pointer;font-family:inherit;letter-spacing:.5px;transition:all .2s}
.btn-submit{background:#3f51b5;color:#fff}
.btn-submit:hover{background:#5c6bc0}
.btn-reset{background:rgba(255,255,255,0.06);color:#999}
.btn-reset:hover{background:rgba(255,255,255,0.12);color:#ddd}
#feedback{font-size:14px;color:#FFD54F;margin-left:8px}

/* ── 桌面端：侧边栏 + 主区域 横向排列 ── */
@media(min-width:769px){
  #content-wrap{flex-direction:row}
  #sidebar{display:none}
  #sidebar.visible{display:block}
}

/* ── 手机/小平板布局 ── */
@media(max-width:768px){
  #home h1{font-size:22px}
  #top-nav{display:flex}
  #sidebar{display:none!important}
  #content-wrap{flex-direction:column}
  #main{min-height:0;flex:1 1 auto}
  #header{padding:8px 12px;gap:8px}
  #header h2{font-size:15px}
  #stats-bar{font-size:12px}
  #scroll{padding:8px;-webkit-overflow-scrolling:touch}
  #btn-row{padding:8px 12px;gap:6px}
  .btn{padding:10px 16px;font-size:13px}
  .card{padding:14px 12px}
  .opt{padding:10px 12px;font-size:13px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
  .q-title{font-size:14px}
}
`;

// ── 构建 JS 数据 ──
function buildChaptersJS() {
  return JSON.stringify(chapters.map(c => ({
    num: c.num,
    title: c.title,
    aquestions: c.aquestions,
    xquestions: c.xquestions
  })));
}

// ── 构建章节下拉选项 ──
function buildChapterOptions() {
  return chapters.map(c => '<option value="' + c.num + '">第' + c.num + '章 ' + escAttr(c.title) + '（A' + c.aquestions.length + '+X' + c.xquestions.length + '）</option>').join('\n');
}

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>免疫学题库 — A型 + X型</title>
<style>${CSS}</style>
</head>
<body>

<!-- ── 首页 ── -->
<div id="home">
  <h1>免疫学题库</h1>
  <p class="sub">A 型单选题 ${totalA} 道 · X 型多选题 ${totalX} 道 · 共 ${chapters.length} 章</p>
  <button class="mode-btn" onclick="startChapterMode()">
    <strong>按章节练习</strong>
    <span>逐章刷题，系统复习</span>
  </button>
  <button class="mode-btn" onclick="startRandomMode()">
    <strong>随机抽题</strong>
    <span>30 道单选 + 10 道多选，顺序打乱</span>
  </button>
</div>

<!-- ── 手机端顶部章节选择器 ── -->
<div id="top-nav">
  <button class="btn-back" onclick="goHome()">← 首页</button>
  <select id="ch-select" onchange="onChSelectChange()">
    ${buildChapterOptions()}
  </select>
</div>

<!-- ── 桌面端侧边栏 + 主区域 ── -->
<div id="content-wrap">
  <div id="sidebar">
    <button id="back-home" onclick="goHome()">← 返回首页</button>
    <h3>章节列表</h3>
    ${chapters.map(c => '<div class="ch-link" data-ch="' + c.num + '">第' + c.num + '章 ' + escAttr(c.title) + '<span class="badge">A' + c.aquestions.length + '+X' + c.xquestions.length + '</span></div>').join('\n')}
  </div>

  <!-- ── 答题区域 ── -->
  <div id="main">
    <div id="header"><h2 id="ch-title"></h2><div id="stats-bar"></div></div>
    <div id="progress-wrap"><div id="progress-fill"></div></div>
    <div id="scroll"><div id="questions"></div></div>
    <div id="btn-row">
      <button class="btn btn-submit" onclick="submitAll()">提交答案</button>
      <button class="btn btn-reset" onclick="resetAll()">重新作答</button>
      <span id="feedback"></span>
    </div>
  </div>
</div>

<script>
const CHAPTERS = ${buildChaptersJS()};

// ── 状态 ──
let mode = 'home';        // 'home' | 'chapter' | 'random'
let currentCh = null;     // chapter num (for chapter mode)
let randomQuestions = []; // [{type:'a'|'x', data:q, chTitle, chNum}]
let answers = {};         // key -> optionIndex (single) or [indices] (multi)
let submitted = false;

// ── 首页 ──
function showHome() {
  mode='home';
  document.getElementById('home').style.display='flex';
  document.getElementById('top-nav').style.display='none';
  document.getElementById('content-wrap').style.display='none';
  document.getElementById('sidebar').classList.remove('visible');
  document.getElementById('sidebar').style.display='none';
  document.getElementById('main').style.display='none';
}
function goHome() { showHome(); }

function startChapterMode() {
  mode = 'chapter';
  document.getElementById('home').style.display='none';
  document.getElementById('content-wrap').style.display='flex';
  document.getElementById('main').style.display='flex';

  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    document.getElementById('top-nav').style.display='flex';
    document.getElementById('sidebar').classList.remove('visible');
    document.getElementById('sidebar').style.display='none';
  } else {
    document.getElementById('top-nav').style.display='none';
    document.getElementById('sidebar').style.display='block';
    document.getElementById('sidebar').classList.add('visible');
    document.querySelectorAll('.ch-link').forEach(el => el.classList.remove('active'));
  }

  if (!currentCh) currentCh = CHAPTERS[0].num;
  switchChapter(currentCh);
}

function startRandomMode() {
  mode = 'random';
  document.getElementById('home').style.display='none';
  document.getElementById('content-wrap').style.display='flex';
  document.getElementById('top-nav').style.display='none';
  document.getElementById('sidebar').classList.remove('visible');
  document.getElementById('sidebar').style.display='none';
  document.getElementById('main').style.display='flex';
  generateRandomQuestions();
}

// ── 随机抽题 ──
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function generateRandomQuestions() {
  const aPool = [], xPool = [];
  for (const ch of CHAPTERS) {
    for (const q of ch.aquestions) aPool.push({ type: 'a', data: q, chTitle: ch.title, chNum: ch.num });
    for (const q of ch.xquestions) xPool.push({ type: 'x', data: q, chTitle: ch.title, chNum: ch.num });
  }
  const aPicked = shuffle(aPool).slice(0, 30);
  const xPicked = shuffle(xPool).slice(0, 10);
  randomQuestions = [...aPicked, ...xPicked];
  currentCh = null;
  answers = {};
  submitted = false;
  document.getElementById('ch-title').textContent = '随机抽题 — 30 单选 + 10 多选';
  document.getElementById('feedback').textContent = '';
  renderQuestions(randomQuestions);
}

// ── 章节切换 ──
function switchChapter(chNum) {
  currentCh = chNum;
  const isMobile = window.innerWidth <= 768;

  // 更新桌面端侧边栏高亮
  document.querySelectorAll('.ch-link').forEach(el => el.classList.toggle('active', +el.dataset.ch === chNum));
  // 更新手机端下拉框
  document.getElementById('ch-select').value = chNum;

  const ch = CHAPTERS.find(c => c.num === chNum);
  answers = {};
  submitted = false;
  document.getElementById('ch-title').textContent = '第' + ch.num + '章 ' + ch.title;
  document.getElementById('feedback').textContent = '';

  // 构建题目列表：先 A 型再 X 型
  const qs = [];
  for (const q of ch.aquestions) qs.push({ type: 'a', data: q, chTitle: ch.title, chNum: ch.num });
  for (const q of ch.xquestions) qs.push({ type: 'x', data: q, chTitle: ch.title, chNum: ch.num });
  renderQuestions(qs);
  document.getElementById('scroll').scrollTop = 0;
}

// ── 手机端下拉选择章节 ──
function onChSelectChange() {
  const val = +document.getElementById('ch-select').value;
  if (val && val !== currentCh) switchChapter(val);
}

// ── 渲染题目列表 ──
function renderQuestions(qs) {
  const container = document.getElementById('questions');

  let html = '';
  let aCount = 0, xCount = 0;
  let aSection = false, xSection = false;

  for (const q of qs) {
    const key = q.type + '-' + (q.chNum || 'r') + '-' + q.data.id;
    if (q.type === 'a' && !aSection) {
      if (xCount > 0) html += '<div class="section-label">第二部分：X 型题（多选题）</div>';
      else html += '<div class="section-label">A 型题（单选题）</div>';
      aSection = true;
    }
    if (q.type === 'x' && !xSection && aCount > 0) {
      if (aSection) html += '<div class="section-label" style="margin-top:8px">X 型题（多选题 · 多选才得分）</div>';
      else html += '<div class="section-label">X 型题（多选题 · 多选才得分）</div>';
      xSection = true;
    }

    const isX = q.type === 'x';
    const sel = answers[key];
    const ans = q.data.answer;
    const isSub = submitted;
    let optStatus = [];

    if (isSub && isX) {
      const selSet = new Set(Array.isArray(sel) ? sel : []);
      const ansSet = new Set(ans);
      for (let oi = 0; oi < q.data.options.length; oi++) {
        if (ansSet.has(oi) && selSet.has(oi)) optStatus.push('correct');
        else if (!ansSet.has(oi) && selSet.has(oi)) optStatus.push('wrong');
        else if (ansSet.has(oi) && !selSet.has(oi)) optStatus.push('correct');
        else optStatus.push('');
      }
    } else if (isSub && !isX) {
      for (let oi = 0; oi < q.data.options.length; oi++) {
        if (oi === ans) optStatus.push('correct');
        else if (oi === sel && sel !== ans) optStatus.push('wrong');
        else optStatus.push('');
      }
    } else {
      optStatus = q.data.options.map(() => '');
    }

    const qNumLabel = isX ? (++xCount) : (++aCount);

    html += '<div class="card' + (isX ? ' x-type' : '') + '">';
    html += '<span class="q-num' + (isX ? ' x-type' : '') + '">' + (isX ? '多选 ' : '单选 ') + qNumLabel + '</span>';
    html += '<span class="q-type-tag' + (isX ? ' multi' : ' single') + '">' + (isX ? '多选' : '单选') + '</span>';
    if (q.chTitle) html += ' <span style="font-size:11px;color:#666">[' + q.chTitle + ' #' + q.data.id + ']</span>';
    html += '<div class="q-title">' + esc(q.data.title) + '</div><div class="options">';

    for (let oi = 0; oi < q.data.options.length; oi++) {
      const opt = q.data.options[oi];
      let cls = 'opt';
      if (!isSub) {
        if (isX) cls += (Array.isArray(sel) && sel.includes(oi)) ? ' selected' : '';
        else cls += (sel === oi) ? ' selected' : '';
      }
      if (isSub && optStatus[oi]) cls += ' ' + optStatus[oi];
      if (isSub) cls += ' disabled';
      const tag = optStatus[oi] === 'correct' ? '✅' : optStatus[oi] === 'wrong' ? '❌' : '';
      const letter = String.fromCharCode(65 + oi);
      html += '<div class="' + cls + '" data-key="' + key + '" data-o="' + oi + '" data-x="' + (isX ? '1' : '0') + '">';
      html += '<span class="opt-label">' + letter + '</span>';
      html += '<span>' + esc(opt.slice(3)) + '</span>';
      html += '<span class="result-tag">' + tag + '</span></div>';
    }
    html += '</div></div>';
  }

  container.innerHTML = html;

  // 事件绑定
  container.querySelectorAll('.opt:not(.disabled)').forEach(el => {
    el.addEventListener('click', function() {
      const key = this.dataset.key;
      const oi = parseInt(this.dataset.o);
      const isX = this.dataset.x === '1';
      if (isX) {
        if (!Array.isArray(answers[key])) answers[key] = [];
        const idx = answers[key].indexOf(oi);
        if (idx >= 0) answers[key].splice(idx, 1);
        else answers[key].push(oi);
        answers[key].sort();
      } else {
        answers[key] = oi;
      }
      renderQuestions(qs);
      updateProgress(qs);
    });
  });

  updateProgress(qs);
}

// ── 进度 ──
function updateProgress(qs) {
  const answered = qs.filter(q => {
    const key = q.type + '-' + (q.chNum || 'r') + '-' + q.data.id;
    const s = answers[key];
    return (q.type === 'x') ? (Array.isArray(s) && s.length > 0) : (s >= 0);
  }).length;
  const pct = Math.round((answered / qs.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('stats-bar').innerHTML = '<span>' + answered + '</span> / ' + qs.length + ' 已答';
}

// ── 提交 ──
function submitAll() {
  submitted = true;
  let qs;
  if (mode === 'chapter') {
    const ch = CHAPTERS.find(c => c.num === currentCh);
    qs = [];
    for (const q of ch.aquestions) qs.push({ type: 'a', data: q, chTitle: ch.title, chNum: ch.num });
    for (const q of ch.xquestions) qs.push({ type: 'x', data: q, chTitle: ch.title, chNum: ch.num });
  } else {
    qs = randomQuestions;
  }

  let correct = 0;
  for (const q of qs) {
    const key = q.type + '-' + (q.chNum || 'r') + '-' + q.data.id;
    const sel = answers[key];
    const ans = q.data.answer;
    if (q.type === 'x') {
      const selSet = new Set(Array.isArray(sel) ? sel : []);
      const ansSet = new Set(ans);
      if (selSet.size === ansSet.size && [...selSet].every(v => ansSet.has(v))) correct++;
    } else {
      if (sel === ans) correct++;
    }
  }

  renderQuestions(qs);

  const pct = Math.round((correct / qs.length) * 100);
  const fb = document.getElementById('feedback');
  if (pct === 100) fb.textContent = '🎉 全部正确！';
  else if (pct >= 80) fb.textContent = '👍 正确率 ' + pct + '%（' + correct + '/' + qs.length + '）';
  else if (pct >= 60) fb.textContent = '📚 正确率 ' + pct + '%（' + correct + '/' + qs.length + '），还需复习';
  else fb.textContent = '💪 正确率 ' + pct + '%（' + correct + '/' + qs.length + '），加油！';
}

// ── 重置 ──
function resetAll() {
  submitted = false;
  answers = {};
  document.getElementById('feedback').textContent = '';
  let qs;
  if (mode === 'chapter') {
    const ch = CHAPTERS.find(c => c.num === currentCh);
    qs = [];
    for (const q of ch.aquestions) qs.push({ type: 'a', data: q, chTitle: ch.title, chNum: ch.num });
    for (const q of ch.xquestions) qs.push({ type: 'x', data: q, chTitle: ch.title, chNum: ch.num });
  } else {
    qs = randomQuestions;
  }
  renderQuestions(qs);
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ── 桌面端章节导航事件 ──
document.querySelectorAll('.ch-link').forEach(el => {
  el.addEventListener('click', () => switchChapter(+el.dataset.ch));
});

// ── 窗口大小变化时调整 ──
window.addEventListener('resize', () => {
  if (mode === 'chapter') {
    const isMobile = window.innerWidth <= 768;
    const sidebar = document.getElementById('sidebar');
    const topNav = document.getElementById('top-nav');
    if (isMobile) {
      topNav.style.display = 'flex';
      sidebar.classList.remove('visible');
      sidebar.style.display = 'none';
    } else {
      topNav.style.display = 'none';
      sidebar.style.display = 'block';
      sidebar.classList.add('visible');
    }
  }
});

showHome();
</script>
</body>
</html>`;

fs.writeFileSync('E:/wenjian/frist cc/mianyi-quiz.html', HTML, 'utf-8');
console.log('Generated: mianyi-quiz.html');
console.log('Chapters:', chapters.length, '| A-type:', totalA, '| X-type:', totalX, '| Total:', totalA + totalX);
