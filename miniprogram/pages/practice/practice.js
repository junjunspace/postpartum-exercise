// pages/practice/practice.js
const { EXERCISES, ENCOURAGEMENTS } = require('../../utils/data.js');

const CIRC = 2 * Math.PI * 88; // ≈553

Page({
  data: {
    exName: '',
    cue: '准备开始',
    phase: '准备',
    num: '--',
    progressPct: 0,
    setLabel: '',
    currentSet: 0,
    totalSets: 0,
    setsArr: [],
    nextCue: '',
    isRest: false,
    ringOffset: 553,
    paused: false,
    showExitModal: false,
    showSkipModal: false,
    hint: '',
    voiceOn: true
  },

  // ---- timer state (non-data) ----
  _seq: [],
  _idx: 0,
  _left: 0,
  _elapsed: 0,
  _total: 0,
  _setElapsed: 0,
  _setTotal: 0,
  _currentSet: 0,
  _tick: null,
  _audio: null,
  _exercise: null,
  _nextExId: null,

  onLoad(options) {
    const id = options.id;
    const ex = EXERCISES.find(e => e.id === id);
    if (!ex) return;
    this._exercise = ex;

    // find next exercise
    const arr = EXERCISES;
    const ci = arr.findIndex(e => e.id === id);
    this._nextExId = ci < arr.length - 1 ? arr[ci + 1].id : null;

    this.setData({ exName: ex.name, voiceOn: wx.getStorageSync('voiceOn') !== false });
    this._build(ex);
    this._playStep();
  },

  onHide() {
    // page hidden — pause
    if (!this.data.paused && this._tick) {
      this._clearTimers();
      this._pausedHidden = true;
    } else if (this._audio) {
      this._audio.stop();
    }
  },

  onShow() {
    if (this._pausedHidden) {
      this._pausedHidden = false;
      this._startTick();
      this._startRingAnim(this._seq[this._idx]);
      this._playAudio(this._seq[this._idx]);
    }
  },

  onUnload() {
    this._clearTimers();
  },

  // ---- build sequence ----
  _build(ex) {
    const pr = ex.practice;
    const seq = [];
    for (let s = 0; s < pr.totalSets; s++) {
      const steps = pr.steps.slice();
      // collect repeatGroups and sort by 'from' descending (apply right-to-left to avoid index shifting)
      var rgs = [];
      if (pr.repeatGroup) rgs.push(pr.repeatGroup);
      if (pr.repeatGroup2) rgs.push(pr.repeatGroup2);
      if (pr.repeatGroup3) rgs.push(pr.repeatGroup3);
      rgs.sort(function(a, b) { return b.from - a.from; });
      rgs.forEach(function(rg) { this._expand(steps, rg); }.bind(this));
      steps.forEach(st => seq.push(Object.assign({}, st, { set: s + 1, totalSets: pr.totalSets })));
      if (s < pr.totalSets - 1 && pr.rest) {
        const restDur = typeof pr.rest === 'number' ? pr.rest : (pr.rest.dur || 10);
        const restCue = typeof pr.rest === 'object' ? (pr.rest.cue || '休息') : '休息';
        seq.push({ cue: restCue, phase: '休息', dur: restDur, set: s + 1, totalSets: pr.totalSets, isRest: true });
      }
    }
    this._seq = seq;
    this._total = seq.reduce((a, s) => a + s.dur, 0);
  },

  _expand(steps, rg) {
    const part = steps.slice(rg.from, rg.to + 1);
    for (let r = 0; r < rg.times - 1; r++) {
      // insert after rg.to
      let insertPos = rg.to + 1 + r * part.length;
      part.forEach((st, i) => steps.splice(insertPos + i, 0, Object.assign({}, st)));
    }
  },

  // ---- play step ----
  _playStep() {
    if (this._idx >= this._seq.length) {
      this._complete();
      return;
    }
    const step = this._seq[this._idx];
    this._left = step.dur;

    // per-set progress: reset when entering a new set
    if (step.set !== this._currentSet) {
      this._currentSet = step.set;
      this._setElapsed = 0;
      this._setTotal = this._seq
        .filter(function(s) { return s.set === step.set; })
        .reduce(function(a, s) { return a + s.dur; }, 0);
    }

    // render
    const nextStep = this._seq[this._idx + 1];
    const pct = this._setTotal > 0 ? Math.round(this._setElapsed / this._setTotal * 100) : 0;
    var setsArr = [];
    for (var i = 1; i <= step.totalSets; i++) setsArr.push(i);
    this.setData({
      cue: step.cue,
      phase: step.phase || (step.isRest ? '休息' : ''),
      num: step.dur,
      isRest: !!step.isRest,
      ringOffset: 553,
      progressPct: pct,
      setLabel: '第 ' + step.set + ' 组 / 共 ' + step.totalSets + ' 组',
      currentSet: step.set,
      totalSets: step.totalSets,
      setsArr: setsArr,
      nextCue: nextStep ? '下一个：' + nextStep.cue : '',
      hint: step.hint || ''
    });

    this._startTick();
    this._startRingAnim(step);
    this._playAudio(step);
  },

  // ---- tick ----
  _startTick() {
    this._clearTimers();
    const totalDur = this._seq[this._idx] ? this._seq[this._idx].dur : 1;
    let tickCount = 0;
    this._tick = setInterval(() => {
      this._left--;
      this._elapsed++;
      this._setElapsed++;
      tickCount++;

      const pct = this._setTotal > 0 ? Math.round(this._setElapsed / this._setTotal * 100) : 0;
      // ring: fraction elapsed within this step
      const ringP = Math.min(tickCount / totalDur, 1);
      const ringOffset = CIRC * (1 - ringP);
      this.setData({ num: this._left, progressPct: pct, ringOffset: ringOffset });

      if (this._left <= 0) {
        this._clearTimers();
        // show 0 briefly so user has time to prepare for next action
        setTimeout(() => {
          this._idx++;
          this._playStep();
        }, 600);
      }
    }, 1000);
  },

  // ---- ring animation (initial render only, driven by tick thereafter) ----
  _startRingAnim(step) {
    // ring starts full (offset=553) and drains via _startTick; nothing to do here
  },

  // ---- controls ----
  togglePause() {
    if (this.data.paused) {
      // resume
      this.setData({ paused: false });
      this._startTick();
      this._startRingAnim(this._seq[this._idx]);
      this._playAudio(this._seq[this._idx]);
    } else {
      // pause
      this._clearTimers();
      this.setData({ paused: true });
    }
  },

  askSkip() {
    this._clearTimers();
    this.setData({ showSkipModal: true });
  },

  hideSkip() {
    this.setData({ showSkipModal: false });
    if (!this.data.paused) {
      this._startTick();
      this._startRingAnim(this._seq[this._idx]);
      this._playAudio(this._seq[this._idx]);
    }
  },

  confirmSkip() {
    this.setData({ showSkipModal: false });
    this._clearTimers();
    // 跳到当前组的下一个休息步骤或下一组
    const currentSet = this._seq[this._idx] ? this._seq[this._idx].set : 1;
    let nextIdx = this._idx + 1;
    while (nextIdx < this._seq.length) {
      const s = this._seq[nextIdx];
      if (s.isRest || s.set > currentSet) break;
      nextIdx++;
    }
    this._idx = nextIdx;
    this._playStep();
  },

  askExit() {
    this._clearTimers();
    this.setData({ showExitModal: true });
  },

  hideExit() {
    this.setData({ showExitModal: false });
    if (!this.data.paused) {
      this._startTick();
      this._startRingAnim(this._seq[this._idx]);
      this._playAudio(this._seq[this._idx]);
    }
  },

  confirmExit() {
    this._clearTimers();
    wx.navigateBack();
  },

  // ---- complete ----
  _complete() {
    this._clearTimers();
    const ex = this._exercise;
    const elapsed = this._elapsed;
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const timeStr = mins > 0 ? mins + ' min' : secs + ' s';
    const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

    wx.navigateTo({
      url: '/pages/complete/complete?id=' + ex.id +
        '&name=' + encodeURIComponent(ex.name) +
        '&sets=' + ex.practice.totalSets +
        '&time=' + encodeURIComponent(timeStr) +
        '&enc=' + encodeURIComponent(enc) +
        '&nextId=' + (this._nextExId || '')
    });
  },

  toggleVoice() {
    var on = !this.data.voiceOn;
    this.setData({ voiceOn: on });
    wx.setStorageSync('voiceOn', on);
    if (!on && this._audio) {
      this._audio.stop();
      this._audio.destroy();
      this._audio = null;
    }
  },

  // ---- audio ----
  _playAudio(step) {
    if (this._audio) { this._audio.stop(); this._audio.destroy(); this._audio = null; }
    if (!this.data.voiceOn || !step || !step.audio) return;
    var audio = wx.createInnerAudioContext();
    audio.src = step.audio;
    audio.play();
    this._audio = audio;
  },

  // ---- helpers ----
  _clearTimers() {
    if (this._tick) { clearInterval(this._tick); this._tick = null; }
    if (this._audio) { this._audio.stop(); this._audio.destroy(); this._audio = null; }
  }
});
