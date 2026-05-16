const fs = require('fs');

function escAttr(s) { return s.replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

const DATA = JSON.parse(fs.readFileSync('E:/wenjian/frist cc/quiz-data.json', 'utf-8'));
const chapters = DATA.filter(c => c.aquestions.length > 0 || c.xquestions.length > 0);
const totalA = chapters.reduce((s, c) => s + c.aquestions.length, 0);
const totalX = chapters.reduce((s, c) => s + c.xquestions.length, 0);

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100dvh;height:100vh;overflow:hidden}
:root{
  --bg-start:#0f0c29;--bg-mid:#302b63;--bg-end:#24243e;
  --primary:#7c4dff;--primary-light:#b388ff;--primary-dim:rgba(124,77,255,0.2);
  --accent:#e65100;--accent-light:#ffab91;--accent-dim:rgba(230,81,0,0.2);
  --surface:rgba(255,255,255,0.04);--surface-hover:rgba(255,255,255,0.08);
  --border:rgba(255,255,255,0.08);--border-hover:rgba(255,255,255,0.18);
  --text-primary:#e0e0e0;--text-secondary:#999;--text-muted:#666;
  --correct:#4CAF50;--wrong:#f44336;
  --radius-sm:8px;--radius-md:12px;--radius-lg:16px;
  --shadow-card:0 4px 24px rgba(0,0,0,0.3);
  --shadow-btn:0 2px 12px rgba(124,77,255,0.3);
}
body{
  font-family:'Microsoft YaHei',-apple-system,Arial,sans-serif;
  background:linear-gradient(135deg,var(--bg-start),var(--bg-mid),var(--bg-end));
  color:var(--text-primary);display:flex;flex-direction:column;
}

/* ── 首页 ── */
#home{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;flex:1;gap:18px}
#home .logo{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--primary),#448aff);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:2px;box-shadow:0 4px 20px rgba(124,77,255,0.35)}
#home h1{color:#e8d5b7;font-size:26px;letter-spacing:2px;margin-bottom:2px}
#home .sub{color:var(--text-secondary);font-size:14px;margin-bottom:18px;text-align:center;padding:0 16px}
.mode-cards{display:flex;gap:14px;width:100%;max-width:440px;padding:0 16px}
.mode-card{flex:1;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px 16px;cursor:pointer;text-align:center;transition:all .25s;font-family:inherit;color:var(--text-primary)}
.mode-card:hover{background:var(--surface-hover);border-color:var(--border-hover);transform:translateY(-3px);box-shadow:var(--shadow-card)}
.mode-card.primary{border-color:rgba(124,77,255,0.35);background:rgba(124,77,255,0.08)}
.mode-card.primary:hover{border-color:var(--primary);box-shadow:var(--shadow-btn)}
.mode-card .icon{font-size:32px;margin-bottom:8px;display:block}
.mode-card strong{display:block;font-size:16px;margin-bottom:4px;color:#fff}
.mode-card span{font-size:12px;color:var(--text-secondary)}
#home-stats{display:flex;gap:20px;margin-top:6px;font-size:12px;color:var(--text-muted)}
#home-stats .stat-val{color:var(--primary-light);font-weight:bold}

/* ── 顶部导航栏（手机端章节选择器） ── */
#top-nav{display:none;flex-shrink:0;align-items:center;gap:8px;padding:10px 12px;background:rgba(0,0,0,0.45);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
#top-nav select{flex:1;padding:10px 12px;border-radius:var(--radius-sm);background:var(--surface);color:#fff;border:1px solid var(--border);font-size:14px;font-family:inherit;min-width:0;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23b388ff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
#top-nav .btn-back{flex-shrink:0;padding:8px 14px;border-radius:var(--radius-sm);background:var(--surface);color:var(--primary-light);border:1px solid var(--border);font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap;transition:all .15s}
#top-nav .btn-back:hover{background:var(--surface-hover);border-color:var(--border-hover)}

/* ── 桌面端侧边栏 ── */
#sidebar{width:220px;min-width:220px;background:rgba(0,0,0,0.35);backdrop-filter:blur(8px);overflow-y:auto;border-right:1px solid var(--border);padding-bottom:20px;flex-shrink:0;display:none}
#sidebar h3{color:#e8d5b7;padding:16px 14px 8px;font-size:13px;letter-spacing:1px;text-transform:uppercase}
.ch-link{display:block;padding:9px 16px;cursor:pointer;font-size:13px;color:var(--text-secondary);transition:all .15s;border-left:3px solid transparent;user-select:none;border-radius:0 6px 6px 0;margin-right:8px;margin-bottom:1px}
.ch-link:hover{background:var(--surface-hover);color:var(--text-primary)}
.ch-link.active{background:var(--primary-dim);color:#fff;border-left-color:var(--primary)}
.ch-link .badge{float:right;font-size:10px;color:var(--text-muted);background:var(--surface);padding:2px 7px;border-radius:8px}
.ch-link.active .badge{color:var(--primary-light);background:rgba(124,77,255,0.2)}
#back-home{display:block;padding:10px 16px;cursor:pointer;font-size:13px;color:var(--primary-light);margin:4px 8px 2px;border:none;background:var(--surface);border-radius:var(--radius-sm);width:calc(100% - 16px);text-align:left;font-family:inherit;transition:all .15s}
#back-home:hover{background:var(--surface-hover);color:#fff}

/* ── 主区域 ── */
#content-wrap{display:none;flex:1;min-height:0;overflow:hidden}
#main{flex:1;display:none;flex-direction:column;min-height:0;overflow:hidden}
#header{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;flex-shrink:0;flex-wrap:wrap;backdrop-filter:blur(8px)}
#header h2{color:#e8d5b7;font-size:18px}
#stats-bar{display:flex;gap:12px;font-size:13px;margin-left:auto;color:var(--text-secondary)}
#stats-bar span{color:#FFD54F;font-weight:bold}
#progress-wrap{flex-shrink:0;height:4px;background:rgba(255,255,255,0.05)}
#progress-fill{height:100%;background:linear-gradient(90deg,var(--primary),#448aff);transition:width .4s ease;box-shadow:0 0 10px rgba(124,77,255,0.5)}
#scroll{flex:1;overflow-y:auto;padding:20px 24px;-webkit-overflow-scrolling:touch;transition:opacity .15s ease}
.card{background:var(--surface);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px 24px;margin-bottom:14px;box-shadow:var(--shadow-card)}
.q-num{display:inline-block;background:var(--primary);color:#fff;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(124,77,255,0.4)}
.q-num.x-type{background:var(--accent);box-shadow:0 2px 8px rgba(230,81,0,0.4)}
.q-type-tag{font-size:10px;margin-left:6px;padding:2px 7px;border-radius:6px;font-weight:bold}
.q-type-tag.single{background:var(--primary-dim);color:var(--primary-light)}
.q-type-tag.multi{background:var(--accent-dim);color:var(--accent-light)}
.section-label{color:#e8d5b7;font-size:15px;margin:20px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border);letter-spacing:.5px}
.q-title{color:var(--text-primary);font-size:15px;line-height:1.7;margin-bottom:12px;font-weight:500}
.options{display:flex;flex-direction:column;gap:5px}
.opt{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--radius-sm);cursor:pointer;border:2px solid transparent;background:var(--surface);font-size:14px;transition:all .18s ease;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.opt:hover{background:var(--surface-hover);border-color:var(--border-hover);transform:translateY(-1px)}
.opt.selected{border-color:var(--primary);background:var(--primary-dim);color:#fff}
.opt.correct{border-color:var(--correct)!important;background:rgba(76,175,80,0.15)!important;color:#A5D6A7!important}
.opt.wrong{border-color:var(--wrong)!important;background:rgba(244,67,54,0.15)!important;color:#EF9A9A!important}
.opt.disabled{pointer-events:none}
.opt.disabled.correct,.opt.disabled.wrong{opacity:1}
.opt-label{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.1);font-weight:bold;font-size:13px;flex-shrink:0;transition:all .18s ease}
.x-type .opt-label{border-radius:var(--radius-sm)}
.opt.selected .opt-label{background:var(--primary);box-shadow:0 0 12px rgba(124,77,255,0.5)}
.opt.correct .opt-label{background:var(--correct)}
.opt.wrong .opt-label{background:var(--wrong)}
.result-tag{margin-left:auto;font-size:16px;display:none}
.opt.correct .result-tag,.opt.wrong .result-tag{display:inline}

#btn-row{padding:14px 24px 18px;border-top:1px solid var(--border);display:flex;gap:12px;flex-shrink:0;align-items:center;flex-wrap:wrap;backdrop-filter:blur(8px)}
.btn{padding:10px 28px;border-radius:var(--radius-sm);font-size:14px;font-weight:bold;border:none;cursor:pointer;font-family:inherit;letter-spacing:.5px;transition:all .2s}
.btn-submit{background:var(--primary);color:#fff;box-shadow:var(--shadow-btn)}
.btn-submit:hover{background:#651fff;transform:translateY(-1px);box-shadow:0 4px 18px rgba(124,77,255,0.45)}
.btn-reset{background:var(--surface);color:var(--text-secondary);border:1px solid var(--border)}
.btn-reset:hover{background:var(--surface-hover);color:var(--text-primary)}
#feedback{font-size:14px;color:#FFD54F;margin-left:8px;font-weight:bold;transition:all .3s ease}

/* ── 桌面端：侧边栏 + 主区域 横向排列 ── */
@media(min-width:769px){
  #content-wrap{flex-direction:row}
  #sidebar{display:none}
  #sidebar.visible{display:block}
}

/* ── 手机/小平板布局 ── */
@media(max-width:768px){
  #home h1{font-size:20px}
  #home .logo{width:48px;height:48px;font-size:24px}
  .mode-cards{flex-direction:column;max-width:320px}
  #top-nav{display:flex}
  #sidebar{display:none!important}
  #content-wrap{flex-direction:column}
  #main{min-height:0;flex:1 1 auto}
  #header{padding:10px 12px;gap:8px}
  #header h2{font-size:15px}
  #stats-bar{font-size:12px}
  #scroll{padding:10px 8px;-webkit-overflow-scrolling:touch}
  #btn-row{padding:8px 12px;gap:8px}
  .btn{padding:10px 18px;font-size:13px}
  .card{padding:16px 14px}
  .opt{padding:12px 14px;font-size:13px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
  .opt:hover{transform:none}
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
  <div class="logo">🛡️</div>
  <h1>免疫学题库</h1>
  <p class="sub">A 型单选题 ${totalA} 道 · X 型多选题 ${totalX} 道 · 共 ${chapters.length} 章</p>
  <div class="mode-cards">
    <div class="mode-card primary" onclick="startChapterMode()">
      <span class="icon">📖</span>
      <strong>按章节练习</strong>
      <span>逐章刷题，系统复习</span>
    </div>
    <div class="mode-card" onclick="startRandomMode()">
      <span class="icon">🎲</span>
      <strong>随机抽题</strong>
      <span>30 道单选 + 10 道多选</span>
    </div>
  </div>
  <div id="home-stats">
    <div>📊 已刷 <span class="stat-val" id="stat-total">0</span> 题</div>
    <div>🎯 正确率 <span class="stat-val" id="stat-rate">--</span>%</div>
  </div>
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

// ── localStorage 统计 ──
const STATS_KEY = 'mianyi_quiz_stats';
function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { total: 0, correct: 0 }; }
  catch(e) { return { total: 0, correct: 0 }; }
}
function saveStats(s) { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }
function updateHomeStats() {
  const s = loadStats();
  document.getElementById('stat-total').textContent = s.total;
  document.getElementById('stat-rate').textContent = s.total > 0 ? Math.round((s.correct / s.total) * 100) : '--';
}

// ── 数字滚动动画 ──
function animateScore(el, target) {
  let current = 0;
  const duration = 800;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(current + (target - current) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── 状态 ──
let mode = 'home';        // 'home' | 'chapter' | 'random'
let currentCh = null;     // chapter num (for chapter mode)
let randomQuestions = []; // [{type:'a'|'x', data:q, chTitle, chNum}]
let answers = {};         // key -> optionIndex (single) or [indices] (multi)
let submitted = false;

// ── 首页 ──
function showHome() {
  mode='home';
  updateHomeStats();
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
  const scroll = document.getElementById('scroll');
  scroll.style.opacity = '0';
  setTimeout(() => {
    renderQuestions(randomQuestions);
    scroll.style.opacity = '1';
  }, 150);
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
  const scroll = document.getElementById('scroll');
  scroll.style.opacity = '0';
  setTimeout(() => {
    renderQuestions(qs);
    scroll.style.opacity = '1';
  }, 150);
  scroll.scrollTop = 0;
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

  // 保存统计
  const stats = loadStats();
  stats.total += qs.length;
  stats.correct += correct;
  saveStats(stats);

  renderQuestions(qs);

  const pct = Math.round((correct / qs.length) * 100);
  const fb = document.getElementById('feedback');
  fb.innerHTML = '';
  const pctSpan = document.createElement('span');
  pctSpan.style.cssText = 'color:#FFD54F;font-weight:bold';
  fb.appendChild(pctSpan);
  animateScore(pctSpan, pct);
  if (pct === 100) fb.appendChild(document.createTextNode('% 🎉 全部正确！'));
  else if (pct >= 80) fb.appendChild(document.createTextNode('% 👍 正确率（' + correct + '/' + qs.length + '）'));
  else if (pct >= 60) fb.appendChild(document.createTextNode('% 📚（' + correct + '/' + qs.length + '），还需复习'));
  else fb.appendChild(document.createTextNode('% 💪（' + correct + '/' + qs.length + '），加油！'));
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
