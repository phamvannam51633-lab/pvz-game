# 免疫学题库 UI 升级实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 mianyi-quiz.html 从基础暗色主题升级为毛玻璃暗紫风格，优化首页和题目卡片 UI。

**Architecture:** 仅修改 `gen_html.js`（生成脚本），重新运行生成 `mianyi-quiz.html`。CSS 完整重写为毛玻璃暗紫主题，HTML 首页改为卡片式双栏布局，JS 新增 localStorage 统计和动画。

**Tech Stack:** 纯 HTML/CSS/JS，Node.js 运行生成脚本

---

### Task 1: 重写 CSS — 全局变量与基色

**Files:**
- Modify: `E:/wenjian/frist cc/gen_html.js` (CSS 变量区)

- [ ] **Step 1: 替换 CSS 开头的 reset 和基色**

找到 CSS 模板字符串中以 `*{margin:0...` 开头、`body{font-family...` 紧随的部分，替换为：

```css
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
```

- [ ] **Step 2: 运行 node gen_html.js 确认无语法错误**

```bash
node "E:/wenjian/frist cc/gen_html.js"
```

Expected: 输出 "Generated: mianyi-quiz.html" 无报错

- [ ] **Step 3: Commit**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "feat: add CSS variables and glass morphism base colors"
```

---

### Task 2: 重写 CSS — 首页样式

**Files:**
- Modify: `E:/wenjian/frist cc/gen_html.js` (首页 CSS 部分)

- [ ] **Step 1: 替换首页 CSS**

找到 `/* ── 首页 ── */` 到下一个 `/* ──` 注释之间的 CSS，替换为：

```css
/* ── 首页 ── */
#home{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;flex:1;gap:20px}
#home .logo{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--primary),#448aff);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:4px;box-shadow:0 4px 20px rgba(124,77,255,0.35)}
#home h1{color:#e8d5b7;font-size:26px;letter-spacing:2px;margin-bottom:4px}
#home .sub{color:var(--text-secondary);font-size:14px;margin-bottom:20px;text-align:center;padding:0 16px}
.mode-cards{display:flex;gap:14px;width:100%;max-width:440px;padding:0 16px}
.mode-card{flex:1;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px 16px;cursor:pointer;text-align:center;transition:all .25s;font-family:inherit;color:var(--text-primary)}
.mode-card:hover{background:var(--surface-hover);border-color:var(--border-hover);transform:translateY(-3px);box-shadow:var(--shadow-card)}
.mode-card.primary{border-color:rgba(124,77,255,0.35);background:rgba(124,77,255,0.08)}
.mode-card.primary:hover{border-color:var(--primary);box-shadow:var(--shadow-btn)}
.mode-card .icon{font-size:32px;margin-bottom:8px;display:block}
.mode-card strong{display:block;font-size:16px;margin-bottom:4px;color:#fff}
.mode-card span{font-size:12px;color:var(--text-secondary)}
#home-stats{display:flex;gap:20px;margin-top:8px;font-size:12px;color:var(--text-muted)}
#home-stats .stat-val{color:var(--primary-light);font-weight:bold}
@media(max-width:768px){
  .mode-cards{flex-direction:column;max-width:320px}
  #home h1{font-size:22px}
  #home .logo{width:48px;height:48px;font-size:24px}
}
```

- [ ] **Step 2: 运行 node gen_html.js 确认无语法错误**

- [ ] **Step 3: Commit**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "feat: redesign homepage CSS with card-based layout"
```

---

### Task 3: 重写 CSS — 侧边栏、主区域、题目卡片

**Files:**
- Modify: `E:/wenjian/frist cc/gen_html.js` (侧边栏/主区域/卡片 CSS)

- [ ] **Step 1: 替换导航栏 CSS**

找到 `/* ── 顶部导航栏` 区域，替换为：

```css
/* ── 顶部导航栏（手机端章节选择器） ── */
#top-nav{display:none;flex-shrink:0;align-items:center;gap:8px;padding:10px 12px;background:rgba(0,0,0,0.45);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
#top-nav select{flex:1;padding:10px 12px;border-radius:var(--radius-sm);background:var(--surface);color:#fff;border:1px solid var(--border);font-size:14px;font-family:inherit;min-width:0;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23b388ff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
#top-nav .btn-back{flex-shrink:0;padding:8px 14px;border-radius:var(--radius-sm);background:var(--surface);color:var(--primary-light);border:1px solid var(--border);font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap;transition:all .15s}
#top-nav .btn-back:hover{background:var(--surface-hover);border-color:var(--border-hover)}
```

- [ ] **Step 2: 替换侧边栏 CSS**

```css
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
```

- [ ] **Step 3: 替换主区域和卡片 CSS**

```css
/* ── 主区域 ── */
#content-wrap{display:none;flex:1;min-height:0;overflow:hidden}
#main{flex:1;display:none;flex-direction:column;min-height:0;overflow:hidden}
#header{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;flex-shrink:0;flex-wrap:wrap;backdrop-filter:blur(8px)}
#header h2{color:#e8d5b7;font-size:18px}
#stats-bar{display:flex;gap:12px;font-size:13px;margin-left:auto;color:var(--text-secondary)}
#stats-bar span{color:#FFD54F;font-weight:bold}
#progress-wrap{flex-shrink:0;height:4px;background:rgba(255,255,255,0.05)}
#progress-fill{height:100%;background:linear-gradient(90deg,var(--primary),#448aff);transition:width .4s ease;box-shadow:0 0 10px rgba(124,77,255,0.5)}
#scroll{flex:1;overflow-y:auto;padding:20px 24px;-webkit-overflow-scrolling:touch}
.card{background:var(--surface);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px 24px;margin-bottom:14px;box-shadow:var(--shadow-card);transition:opacity .3s ease}
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
```

- [ ] **Step 4: 替换按钮和反馈 CSS**

```css
#btn-row{padding:14px 24px 18px;border-top:1px solid var(--border);display:flex;gap:12px;flex-shrink:0;align-items:center;flex-wrap:wrap;backdrop-filter:blur(8px)}
.btn{padding:10px 28px;border-radius:var(--radius-sm);font-size:14px;font-weight:bold;border:none;cursor:pointer;font-family:inherit;letter-spacing:.5px;transition:all .2s}
.btn-submit{background:var(--primary);color:#fff;box-shadow:var(--shadow-btn)}
.btn-submit:hover{background:#651fff;transform:translateY(-1px);box-shadow:0 4px 18px rgba(124,77,255,0.45)}
.btn-reset{background:var(--surface);color:var(--text-secondary);border:1px solid var(--border)}
.btn-reset:hover{background:var(--surface-hover);color:var(--text-primary)}
#feedback{font-size:14px;color:#FFD54F;margin-left:8px;font-weight:bold;transition:all .3s ease}
```

- [ ] **Step 5: 替换响应式 CSS**

```css
/* ── 桌面端：侧边栏 + 主区域 横向排列 ── */
@media(min-width:769px){
  #content-wrap{flex-direction:row}
  #sidebar{display:none}
  #sidebar.visible{display:block}
}

/* ── 手机/小平板布局 ── */
@media(max-width:768px){
  #home h1{font-size:20px}
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
  .mode-cards{padding:0 20px}
}
```

- [ ] **Step 6: 运行 node gen_html.js 确认无语法错误**

- [ ] **Step 7: Commit**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "feat: redesign sidebar, cards, buttons with glass morphism style"
```

---

### Task 4: 更新 HTML 结构 — 首页

**Files:**
- Modify: `E:/wenjian/frist cc/gen_html.js` (首页 HTML 模板)

- [ ] **Step 1: 替换首页 HTML**

找到 `<!-- ── 首页 ── -->` 到 `</div>` (home 闭合) 之间的 HTML，替换为：

```html
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
```

- [ ] **Step 2: 运行 node gen_html.js 确认无语法错误**

- [ ] **Step 3: Commit**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "feat: update homepage HTML to card-based layout with stats"
```

---

### Task 5: 新增 localStorage 统计功能

**Files:**
- Modify: `E:/wenjian/frist cc/gen_html.js` (JS 部分，showHome 之前)

- [ ] **Step 1: 添加统计数据管理函数**

在 `showHome()` 函数之前，插入：

```javascript
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
```

- [ ] **Step 2: 在 showHome() 中调用 updateHomeStats**

找到 `showHome` 函数，在设置 `mode='home'` 之后添加 `updateHomeStats();`：

```javascript
function showHome() {
  mode='home';
  updateHomeStats();
  document.getElementById('home').style.display='flex';
  // ... 其余不变
}
```

- [ ] **Step 3: 在 submitAll() 中记录统计**

找到 `submitAll()` 函数，在 `renderQuestions(qs);` 之前插入统计保存逻辑。找到计算 correct 的代码，在 `renderQuestions(qs);` 之前添加：

```javascript
  // 保存统计
  const stats = loadStats();
  stats.total += qs.length;
  stats.correct += correct;
  saveStats(stats);
```

- [ ] **Step 4: 运行 node gen_html.js 确认无语法错误**

- [ ] **Step 5: Commit**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "feat: add localStorage stats tracking for homepage"
```

---

### Task 6: 新增提交后分数滚动动画

**Files:**
- Modify: `E:/wenjian/frist cc/gen_html.js` (submitAll 函数)

- [ ] **Step 1: 添加数字滚动动画函数**

在 `submitAll()` 之前插入：

```javascript
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
```

- [ ] **Step 2: 替换 submitAll 中的反馈文本为动画**

找到 `submitAll()` 中设置 `fb.textContent` 的部分（`const fb = document.getElementById('feedback');` 开始的 if/else 块），替换为：

```javascript
  const fb = document.getElementById('feedback');
  fb.innerHTML = '';
  const pctSpan = document.createElement('span');
  pctSpan.style.color = '#FFD54F';
  pctSpan.style.fontWeight = 'bold';
  fb.appendChild(pctSpan);
  animateScore(pctSpan, pct);
  if (pct === 100) fb.appendChild(document.createTextNode('% 🎉 全部正确！'));
  else if (pct >= 80) fb.appendChild(document.createTextNode('% 👍 正确率（' + correct + '/' + qs.length + '）'));
  else if (pct >= 60) fb.appendChild(document.createTextNode('% 📚（' + correct + '/' + qs.length + '），还需复习'));
  else fb.appendChild(document.createTextNode('% 💪（' + correct + '/' + qs.length + '），加油！'));
```

- [ ] **Step 3: 运行 node gen_html.js 确认无语法错误**

- [ ] **Step 4: Commit**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "feat: add animated score counter on submit"
```

---

### Task 7: 新增章节切换淡入过渡

**Files:**
- Modify: `E:/wenjian/frist cc/gen_html.js` (renderQuestions / switchChapter)

- [ ] **Step 1: 在 switchChapter 调用 renderQuestions 前添加过渡**

找到 `switchChapter` 函数中的 `renderQuestions(qs);` 行，替换为：

```javascript
  const scroll = document.getElementById('scroll');
  scroll.style.opacity = '0';
  scroll.style.transition = 'opacity .15s ease';
  setTimeout(() => {
    renderQuestions(qs);
    scroll.style.opacity = '1';
  }, 150);
```

- [ ] **Step 2: 在 startRandomMode 和 generateRandomQuestions 也添加过渡**

找到 `generateRandomQuestions` 中调用 `renderQuestions(randomQuestions);` 的行，同样包裹过渡：

```javascript
  const scroll = document.getElementById('scroll');
  scroll.style.opacity = '0';
  scroll.style.transition = 'opacity .15s ease';
  setTimeout(() => {
    renderQuestions(randomQuestions);
    scroll.style.opacity = '1';
  }, 150);
```

- [ ] **Step 3: 运行 node gen_html.js 确认无语法错误**

- [ ] **Step 4: Commit**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "feat: add fade transition on chapter/random mode switch"
```

---

### Task 8: 端到端验证

**Files:**
- Verify: `E:/wenjian/frist cc/mianyi-quiz.html`

- [ ] **Step 1: 桌面端验证**

用 Playwright 打开文件，测试首页显示、章节模式进入、选项点击、提交、重置：

```bash
playwright-cli open "E:/wenjian/frist cc/mianyi-quiz.html"
playwright-cli snapshot  # 确认首页卡片式布局和统计条
playwright-cli click "getByText('按章节练习')"  # 进入章节模式
playwright-cli snapshot  # 确认侧边栏和题目卡片样式
playwright-cli click ":text('A. 机体排除病原微生物的功能')"  # 选中选项
playwright-cli click ":text('提交答案')"  # 提交
playwright-cli snapshot  # 确认正确/错误显示和分数动画
playwright-cli resize 375 812  # 切手机尺寸
playwright-cli reload
playwright-cli snapshot  # 确认手机端下拉布局
playwright-cli close
```

- [ ] **Step 2: 检查 localStorage 统计**

验证首页 stats 在提交后更新：刷新首页，已刷题数和正确率应保持。

- [ ] **Step 3: 如有问题修复后重新生成并提交**

```bash
git add gen_html.js mianyi-quiz.html
git commit -m "fix: [具体修复内容]"
```

---

### Task 9: 推送到远程仓库

- [ ] **Step 1: 推送所有提交**

```bash
git push origin master
```
