/**
 * app.js — 核心业务逻辑
 *
 * 包含：Nav 导航、UI 工具、PracticeTimer 计时器、Practice 控制器
 *
 * WeChat MP 迁移：
 *   - Nav.go/back → wx.navigateTo/wx.navigateBack
 *   - DOM 操作 → setData()
 *   - _build() / _startTick() 等纯逻辑方法可直接复用
 */

'use strict';

/* ----------------------------------------------------------------
   全局数据引用（由 API.load() 赋值）
   ---------------------------------------------------------------- */
let EXERCISES = [];
let ENCOURAGEMENTS = [];

/* ----------------------------------------------------------------
   导航系统
   WeChat MP: 替换为 wx.navigateTo / wx.navigateBack / wx.redirectTo
   ---------------------------------------------------------------- */
const Nav = {
  _stack: ['s-home'],

  go(id, isRoot = false) {
    const cur = document.querySelector('.screen.active');
    if (cur) {
      cur.classList.remove('active');
      if (!isRoot) cur.classList.add('leaving');
    }
    if (isRoot) {
      this._stack = [id];
      document.querySelectorAll('.screen.leaving').forEach(s => s.classList.remove('leaving'));
    } else {
      if (cur) this._stack.push(cur.id);
    }
    const next = document.getElementById(id);
    if (next) {
      void next.offsetWidth;
      next.classList.add('active');
    }
  },

  back() {
    if (this._stack.length <= 1) return;
    const cur = document.querySelector('.screen.active');
    if (cur) cur.classList.remove('active');

    const prevId = this._stack.pop();
    document.querySelectorAll('.screen.leaving').forEach(s => s.classList.remove('leaving'));
    const prev = document.getElementById(prevId);
    if (prev) prev.classList.add('active');
  }
};

/* ----------------------------------------------------------------
   UI 工具
   ---------------------------------------------------------------- */
const UI = {
  _toastTimer: null,

  toast(msg) {
    /* WeChat MP: wx.showToast({ title: msg, icon: 'none', duration: 2500 }) */
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  },

  showModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  },

  hideModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  },

  confirmDisclaimer() {
    localStorage.setItem('disclaimerConfirmed', '1');
    this.hideModal('disclaimerModal');
    if (!localStorage.getItem('deliveryType')) {
      this.showModal('deliveryModal');
    }
  },

  selectDelivery(type) {
    localStorage.setItem('deliveryType', type);
    this.hideModal('deliveryModal');
    // 更新动作列表中剖宫产锁定状态
    document.querySelectorAll('.ex-item[data-id="e03"], .ex-item[data-id="e04"]').forEach(el => {
      if (type === 'csection') {
        el.classList.add('ex-locked');
        el.querySelector('.ex-guide-badge') && el.querySelector('.ex-guide-badge').remove();
        if (!el.querySelector('.ex-lock-badge')) {
          const badge = document.createElement('span');
          badge.className = 'ex-lock-badge';
          badge.textContent = '🔒 暂缓';
          el.querySelector('.ex-name-row') && el.querySelector('.ex-name-row').appendChild(badge);
        }
      } else {
        el.classList.remove('ex-locked');
      }
    });
  },

  checkFirstLaunch() {
    if (!localStorage.getItem('disclaimerConfirmed')) {
      this.showModal('disclaimerModal');
    }
  },
};

/* ----------------------------------------------------------------
   跟练计时器引擎
   ---------------------------------------------------------------- */
class PracticeTimer {
  constructor() {
    this._seq = [];
    this._idx = 0;
    this._left = 0;
    this._total = 0;
    this._elapsed = 0;
    this._paused = false;
    this._tid = null;
    this._startTs = 0;
    this.exercise = null;
  }

  /* 将步骤展开为扁平序列，支持 repeatGroup（循环一组步骤 N 次）*/
  _build(exercise) {
    const seq = [];
    const { totalSets, steps, rest } = exercise.practice;
    const p = exercise.practice;

    for (let set = 1; set <= totalSets; set++) {
      const indices = [];
      let i = 0;
      while (i < steps.length) {
        const groups = [p.repeatGroup, p.repeatGroup2, p.repeatGroup3].filter(Boolean);
        let matched = false;
        for (const g of groups) {
          if (i === g.from) {
            for (let t = 0; t < g.times; t++) {
              for (let j = g.from; j <= g.to; j++) {
                indices.push({ stepIdx: j, rep: t + 1, totalRep: g.times });
              }
            }
            i = g.to + 1;
            matched = true;
            break;
          }
        }
        if (!matched) {
          indices.push({ stepIdx: i });
          i++;
        }
      }

      for (const item of indices) {
        const s = steps[item.stepIdx];
        const entry = { cue: s.cue, phase: s.phase, dur: s.dur, set };
        if (item.totalRep) {
          entry.rep = item.rep;
          entry.totalRep = item.totalRep;
        }
        seq.push(entry);
      }

      if (set < totalSets && rest > 0) {
        seq.push({
          cue: `很好！休息 ${rest} 秒`,
          phase: `第 ${set} 组完成 · 休息`,
          dur: rest, set, isRest: true
        });
      }
    }
    return seq;
  }

  start(exercise) {
    this.stop();
    this.exercise = exercise;
    this._seq = this._build(exercise);
    this._idx = 0;
    this._elapsed = 0;
    this._total = this._seq.reduce((s, step) => s + step.dur, 0);
    this._paused = false;
    this._startTs = Date.now();

    document.getElementById('p-ex-name').textContent = exercise.name;
    this._setPauseIcon(false);

    this._playStep();
  }

  _playStep() {
    if (this._idx >= this._seq.length) { this._complete(); return; }
    const step = this._seq[this._idx];
    this._left = step.dur;
    this._render(step);
    this._startRingAnim(step);
    this._startTick();

    /* WeChat MP: 语音播报
    if (!step.isRest) {
      wx.textToSpeech({ lang:'zh_CN', speed:1, content: step.cue, success(res) {
        const a = wx.createInnerAudioContext(); a.src = res.filename; a.play();
      }});
    }
    */

    /* WeChat MP: 震动反馈
    wx.vibrateShort({ type:'light' });
    */
  }

  _startTick() {
    if (this._tid) clearInterval(this._tid);
    this._render(this._seq[this._idx]);
    this._tid = setInterval(() => {
      if (this._paused) return;
      this._left--;
      this._elapsed++;
      if (this._left < 0) this._left = 0;
      this._render(this._seq[this._idx]);
      if (this._left <= 0) {
        clearInterval(this._tid);
        this._idx++;
        this._playStep();
      }
    }, 1000);
  }

  _render(step) {
    if (!step) return;

    // 进度条
    const pct = Math.min(100, (this._idx / this._seq.length) * 100);
    document.getElementById('p-fill').style.width = pct + '%';

    // 组数
    const totalSets = this.exercise.practice.totalSets;
    document.getElementById('p-set-lbl').textContent = `第 ${step.set} 组 / 共 ${totalSets} 组`;

    // 重复次数标签
    const repTxt = (step.totalRep && step.totalRep > 1) ? `第 ${step.rep} / ${step.totalRep} 次` : '';
    document.getElementById('p-rep-lbl').textContent = repTxt;

    // 口令文字
    const cueEl = document.getElementById('p-cue');
    cueEl.textContent = step.cue;
    cueEl.className = 'cue-text' + (step.isRest ? ' rest' : '');

    // 阶段标签
    document.getElementById('p-phase').textContent = step.phase || '';

    // hint 提示文字
    const hintEl = document.getElementById('p-hint');
    if (hintEl) {
      if (step.hint) {
        hintEl.textContent = step.hint;
        hintEl.style.display = 'block';
      } else {
        hintEl.style.display = 'none';
      }
    }

    // 倒计时数字
    document.getElementById('p-num').textContent = String(this._left).padStart(2, '0');

    // 下一步提示
    const nextStep = this._seq[this._idx + 1];
    document.getElementById('p-next').textContent =
      nextStep ? `下一步：${nextStep.cue}` : '即将完成 ✨';
  }

  /* rAF 驱动圆环动画，跟随倒计时同步 */
  _startRingAnim(step) {
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }

    const ring = document.getElementById('p-ring');
    if (!ring) return;
    ring.setAttribute('class', 'ring-progress' + (step.isRest ? ' rest' : ''));
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = '0';

    this._ringDurMs = step.dur * 1000;
    this._ringStartMs = performance.now();

    const tick = () => {
      if (this._paused) {
        this._rafId = requestAnimationFrame(tick);
        return;
      }
      const elapsed = performance.now() - this._ringStartMs;
      const progress = Math.min(1, elapsed / this._ringDurMs);
      ring.style.strokeDashoffset = String(553 * progress);
      if (progress < 1) {
        this._rafId = requestAnimationFrame(tick);
      }
    };
    this._rafId = requestAnimationFrame(tick);
  }

  togglePause() {
    this._paused = !this._paused;
    this._setPauseIcon(this._paused);
  }

  _setPauseIcon(paused) {
    const icon = document.getElementById('p-pause-icon');
    icon.innerHTML = paused
      ? '<polygon points="5 3 19 12 5 21 5 3"/>'
      : '<line x1="6" y1="4" x2="6" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/>';
  }

  skip() {
    clearInterval(this._tid);
    this._idx++;
    setTimeout(() => this._playStep(), 80);
  }

  end() { Practice.askExit(); }

  stop() {
    clearInterval(this._tid);
    this._tid = null;
    this._paused = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    const ring = document.getElementById('p-ring');
    if (ring) {
      ring.style.transition = 'none';
      ring.style.strokeDashoffset = '0';
    }
  }

  _complete() {
    clearInterval(this._tid);
    const elapsed = Math.round((Date.now() - this._startTs) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const timeStr = mins > 0 ? `${mins} min ${secs > 0 ? secs + 's' : ''}` : `${secs} 秒`;

    const ex = this.exercise;
    const idx = EXERCISES.findIndex(e => e.id === ex.id);
    const nextEx = EXERCISES[idx + 1] || null;

    document.getElementById('done-sub').textContent = `${ex.name}已完成`;
    document.getElementById('done-sets').textContent = ex.practice.totalSets;
    document.getElementById('done-time').textContent = timeStr;
    document.getElementById('done-encourage').textContent =
      ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

    const nextBtn = document.getElementById('done-next-btn');
    if (nextEx) {
      nextBtn.onclick = () => Practice.openExercise(nextEx.id);
      nextBtn.querySelector('svg').style.display = '';
      nextBtn.childNodes[nextBtn.childNodes.length - 1].textContent = `继续：${nextEx.name}`;
    } else {
      nextBtn.onclick = () => Nav.go('s-home', true);
      nextBtn.querySelector('svg').style.display = 'none';
      nextBtn.childNodes[nextBtn.childNodes.length - 1].textContent = '全套动作完成！返回首页 🎉';
    }

    Practice._completeEx = ex;
    Nav.go('s-complete');
  }
}

/* ----------------------------------------------------------------
   跟练控制器
   ---------------------------------------------------------------- */
const Practice = {
  timer: new PracticeTimer(),
  _curId: 'e01',
  _completeEx: null,

  /* 渲染动作列表 */
  renderList() {
    const ICON_STUB = (path) =>
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BAF9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

    document.getElementById('ex-list').innerHTML = EXERCISES.map(ex => `
      <div class="ex-item" onclick="Practice.openExercise('${ex.id}')">
        <div class="ex-icon">${ICON_STUB(ex.icon)}</div>
        <div class="ex-info">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-freq">${ex.freq}</div>
        </div>
        <div class="ex-chevron">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    `).join('');
  },

  /* 打开动作详情 */
  openExercise(id) {
    const ex = EXERCISES.find(e => e.id === id);
    if (!ex) return;
    this._curId = id;

    document.getElementById('d-title').textContent = ex.name;
    document.getElementById('d-icon').innerHTML = ex.icon;
    document.getElementById('d-name').textContent = ex.name;
    document.getElementById('d-purpose').textContent = ex.purpose;

    document.getElementById('d-tags').innerHTML =
      ex.tags.map(t => `<span class="tag ${t.cls}">${t.label}</span>`).join('');

    document.getElementById('d-steps').innerHTML =
      ex.steps.map((s, i) => `
        <div class="step-item">
          <div class="step-num">${i + 1}</div>
          <div class="step-txt">${s}</div>
        </div>`).join('');

    document.getElementById('d-notes').innerHTML =
      ex.notes.map(n => `
        <div class="note-item">
          <div class="note-dot"></div>
          <div class="note-txt">${n}</div>
        </div>`).join('');

    Nav.go('s-detail');
  },

  /* 从详情页开始单个动作 */
  startSingle() {
    const ex = EXERCISES.find(e => e.id === this._curId);
    if (ex) this._launch(ex);
  },

  /* 从列表页开始全套 */
  startFull() {
    this._launch(EXERCISES[0]);
  },

  _launch(ex) {
    this._curId = ex.id;
    document.getElementById('p-fill').style.width = '0%';
    this.timer._setPauseIcon(false);

    Nav.go('s-practice');
    setTimeout(() => this.timer.start(ex), 350);
  },

  /* 退出确认弹窗 */
  askExit() {
    this.timer._paused = true;
    this.timer._setPauseIcon(true);
    document.getElementById('exit-modal').classList.add('show');
  },
  hideExit() {
    document.getElementById('exit-modal').classList.remove('show');
    this.timer._paused = false;
    this.timer._setPauseIcon(false);
  },
  confirmExit() {
    this.timer.stop();
    document.getElementById('exit-modal').classList.remove('show');
    Nav.go('s-stage', true);
  },

  askSkip() {
    this.timer._paused = true;
    this.timer._setPauseIcon(true);
    document.getElementById('skipModal').style.display = 'flex';
  },

  hideSkip() {
    document.getElementById('skipModal').style.display = 'none';
    this.timer._paused = false;
    this.timer._setPauseIcon(false);
  },

  confirmSkip() {
    document.getElementById('skipModal').style.display = 'none';
    const timer = this.timer;
    if (!timer) return;
    const seq = timer._seq;
    const idx = timer._idx;
    const currentSet = seq[idx] ? seq[idx].set : 1;
    let nextIdx = idx + 1;
    while (nextIdx < seq.length) {
      const s = seq[nextIdx];
      if (s.isRest || s.set > currentSet) break;
      nextIdx++;
    }
    timer._idx = nextIdx;
    timer._playStep();
  },
};

/* ----------------------------------------------------------------
   初始化
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  const data = await API.load();
  EXERCISES = data.exercises;
  ENCOURAGEMENTS = data.encouragements;
  Practice.renderList();
  UI.checkFirstLaunch();
});
