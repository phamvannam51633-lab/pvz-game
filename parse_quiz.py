import re, json, os, glob

TXT_DIR = r"E:\wenjian\frist cc\mianyi_txt"
OUT_JSON = r"E:\wenjian\frist cc\quiz-data.json"

def parse_chapter_num(filename):
    m = re.match(r'(\d+)', filename)
    if m: return int(m.group(1))
    # Handle "11、12" case
    m = re.match(r'(\d+)[、,]', filename)
    return int(m.group(1)) if m else 999

def parse_questions(text):
    """Find A-type questions in the QUESTIONS section (first [A型题])"""
    # Find first [A型题] - this is the questions section
    idx = text.find('[A型题]')
    if idx < 0:
        idx = text.find('[A 型题]')
    if idx < 0:
        return []

    # Get text from [A型题] to the next [B型题] or [C型题] or [X型题] or end of file
    section = text[idx:]
    end_markers = ['[B型题]', '[B 型题]', '[C型题]', '[C 型题]', '[X型题]', '[X 型题]']
    end = len(section)
    for marker in end_markers:
        pos = section.find(marker)
        if pos > 0 and pos < end:
            end = pos
    section = section[:end]

    questions = []
    # Split by question number pattern: number followed by ．or . or 、
    # Match patterns like "1．", "2.", "3、", "1 ." etc
    parts = re.split(r'\n\s*(\d+)\s*[．.、]\s*', '\n' + section)
    # parts[0] = before first question, parts[1] = num1, parts[2] = content1, parts[3] = num2, ...

    i = 1
    while i + 1 < len(parts):
        qnum = parts[i]
        content = parts[i + 1]
        i += 2

        # Parse title and options
        title = ''
        options = []
        lines = content.strip().split('\n')

        for line in lines:
            line = line.strip()
            if not line:
                continue
            # Check if line starts with an option letter (A-E) followed by ．or . or 、or space
            opt_match = re.match(r'^([A-E])\s*[．.、\s]\s*(.*)', line)
            if opt_match:
                options.append(opt_match.group(1) + '. ' + opt_match.group(2).strip())
            elif not options:
                # This is part of the title (before any option found)
                title += line
            else:
                # Could be continuation of last option text
                if options:
                    options[-1] += ' ' + line

        if title and len(options) == 5:
            # Clean title
            title = title.strip()
            questions.append({
                'id': int(qnum),
                'title': title,
                'options': options
            })
        elif title and len(options) > 0:
            # Some questions might have fewer/more options - include anyway
            questions.append({
                'id': int(qnum),
                'title': title.strip(),
                'options': options
            })

    return questions

def parse_answers(text):
    """Parse A-type answers from the answer section"""
    # Find answer section
    ans_section_start = -1
    for marker in ['参考答案', '参考 答案']:
        idx = text.find(marker)
        if idx >= 0:
            ans_section_start = idx
            break

    if ans_section_start < 0:
        return {}

    ans_text = text[ans_section_start:]

    # Find [A型题] or "A型题：" in answer section
    idx = ans_text.find('[A型题]')
    if idx < 0:
        idx = ans_text.find('[A 型题]')
    if idx < 0:
        idx = ans_text.find('A型题：')
    if idx < 0:
        idx = ans_text.find('A型题:')
    if idx < 0:
        return {}

    # Get the answer line(s) - from marker to the next section marker or end
    ans_block = ans_text[idx:]
    end_markers = ['[B型题]', '[B 型题]', '[C型题]', 'B型题：', 'C型题：',
                   '二、', '三、', '四、', '五、']
    end = len(ans_block)
    for marker in end_markers:
        pos = ans_block.find(marker)
        if pos > 0 and pos < end:
            end = pos
    ans_block = ans_block[:end]

    # Parse all "number letter" pairs
    # Match patterns like: 1．D, 2.B, 3 E, 1 D，2 B, 4.C, etc.
    pairs = re.findall(r'(\d+)\s*[．.、\s]*\s*([A-E])', ans_block)

    answers = {}
    for num_str, letter in pairs:
        num = int(num_str)
        answers[num] = ord(letter) - ord('A')

    return answers

def parse_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # Get chapter title from first non-empty line
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    title = lines[0] if lines else os.path.basename(filepath)
    # Clean title: remove leading numbers like "第一章  " or "第二章      "
    title = re.sub(r'^第[一二三四五六七八九十\d]+章\s*', '', title).strip()
    if not title:
        title = lines[1] if len(lines) > 1 else '未知章节'

    questions = parse_questions(text)
    answers = parse_answers(text)

    # Merge answers into questions
    for q in questions:
        if q['id'] in answers:
            q['answer'] = answers[q['id']]
        else:
            q['answer'] = -1  # unknown

    return {
        'title': title,
        'questions': questions
    }

def main():
    files = sorted(glob.glob(os.path.join(TXT_DIR, '*.txt')),
                   key=lambda f: parse_chapter_num(os.path.basename(f)))

    chapters = []
    total_questions = 0
    issues = []

    for f in files:
        fname = os.path.basename(f)
        ch_num = parse_chapter_num(fname)
        data = parse_file(f)

        q_with_answers = sum(1 for q in data['questions'] if q['answer'] >= 0)
        q_total = len(data['questions'])

        print(f"第{ch_num:2d}章 {data['title']}: {q_total} 题, {q_with_answers} 有答案")

        if q_total == 0:
            issues.append(f"第{ch_num}章: 未解析到题目")
        if q_with_answers < q_total:
            missing = [str(q['id']) for q in data['questions'] if q['answer'] < 0]
            issues.append(f"第{ch_num}章: 题目 {', '.join(missing)} 缺少答案")

        chapters.append({
            'num': ch_num,
            'title': data['title'],
            'filename': fname,
            'questions': data['questions']
        })
        total_questions += q_total

    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(chapters, f, ensure_ascii=False, indent=2)

    print(f"\n总计: {len(chapters)} 章, {total_questions} 题")
    if issues:
        print("\n⚠️ 问题:")
        for iss in issues:
            print(f"  - {iss}")

if __name__ == '__main__':
    main()
