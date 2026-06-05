// pages/practice/practice.js
const {
  EXERCISES,
  ENCOURAGEMENTS,
  getExerciseById,
  getExercisesByPhase
} = require('../../utils/data.js');
const { setCurrentPhase } = require('../../utils/session.js');

const CIRC = 2 * Math.PI * 88; // ≈553

function attachLocalAudio(exercise) {
  if (!exercise || !exercise.practice || !exercise.practice.steps) {
    return exercise;
  }

  var steps = exercise.practice.steps.map(function(step, index) {
    if (step.audio) {
      return Object.assign({}, step);
    }

    var num = index + 1 < 10 ? '0' + (index + 1) : String(index + 1);
    return Object.assign({}, step, {
      audio: '/audio/' + exercise.id + '/' + num + '.m4a'
    });
  });

  return Object.assign({}, exercise, {
    practice: Object.assign({}, exercise.practice, {
      steps: steps
    })
  });
}

// cloud:// URL → 本地音频路径映射（云存储不可用时的兜底）
var CLOUD_TO_LOCAL = {};
(function() {
  var envPrefix = 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/';
  var exercises = ['e01','e02','e03','e04','e05','e06','e07'];
  var counts = { e01:5, e02:3, e03:4, e04:4, e05:5, e06:7, e07:4 };
  exercises.forEach(function(ex) {
    for (var i = 1; i <= counts[ex]; i++) {
      var num = (i < 10 ? '0' : '') + i;
      CLOUD_TO_LOCAL[envPrefix + ex + '/' + num + '.m4a'] = ex + '/' + num;
    }
  });
  CLOUD_TO_LOCAL[envPrefix + 'common/rest.m4a'] = 'common/rest';
})();

Page({
  data: {
    exName: '',
    isPhase1: true,
    phaseTag: '',
    cue: '准备开始',
    phase: '准备',
    num: '--',
    progressPct: 0,
    overallPct: 0,
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
    voiceOn: true,
    restSeconds: 0
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
  _audioSrc: null,
  _exercise: null,
  _nextExId: null,

  onLoad(options) {
    const id = options.id;
    const ex = attachLocalAudio(getExerciseById(id));
    if (!ex) return;
    this._exercise = ex;
    setCurrentPhase(ex.phase);

    // find next exercise in the same phase
    const arr = getExercisesByPhase(ex.phase);
    const ci = arr.findIndex(e => e.id === id);
    this._nextExId = ci < arr.length - 1 ? arr[ci + 1].id : null;

    this.setData({
      exName: ex.name,
      isPhase1: ex.phase === 1,
      phaseTag: 'PHASE ' + ex.phase + ' · ' + ex.id.toUpperCase(),
      voiceOn: wx.getStorageSync('voiceOn') !== false,
      restSeconds: ex.practice.rest || 0
    });
    this._build(ex);

    // 获取云音频临时 URL
    this._resolveAudio(ex);
  },

  _resolveAudio(ex, retry) {
    var self = this;
    retry = retry || 0;

    // 为每个步骤附加本地音频路径（兜底）
    this._seq.forEach(function(step) {
      if (step.audio && CLOUD_TO_LOCAL[step.audio]) {
        step._localAudio = CLOUD_TO_LOCAL[step.audio];
      }
    });

    // 收集所有 cloud:// 开头的音频 ID
    var fileIDs = [];
    ex.practice.steps.forEach(function(st) {
      if (st.audio && st.audio.indexOf('cloud://') === 0 && fileIDs.indexOf(st.audio) === -1) {
        fileIDs.push(st.audio);
      }
    });

    if (fileIDs.length === 0 || !wx.cloud || !wx.cloud.getTempFileURL) {
      this._playStep();
      return;
    }

    wx.cloud.getTempFileURL({
      fileList: fileIDs,
      success: function(res) {
        var urlMap = {};
        var allValid = true;
        res.fileList.forEach(function(f) {
          if (f.tempFileURL) {
            urlMap[f.fileID] = f.tempFileURL;
          } else {
            allValid = false;
          }
        });
        if (allValid) {
          self._seq.forEach(function(step) {
            if (step.audio && urlMap[step.audio]) {
              step.audio = urlMap[step.audio];
            }
          });
        }
        self._playStep();
      },
      fail: function(err) {
        console.error('[音频] 云URL获取失败:', JSON.stringify(err));
        if (retry < 2) {
          setTimeout(function() {
            self._resolveAudio(ex, retry + 1);
          }, 1000);
          return;
        }
        self._playStep();
      }
    });
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
    if (this._audio) { this._audio.stop(); this._audio.destroy(); this._audio = null; this._audioSrc = null; }
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
    const overallPct = this._total > 0 ? Math.round(this._elapsed / this._total * 100) : 0;
    const setPct = this._setTotal > 0 ? Math.round(this._setElapsed / this._setTotal * 100) : 0;
    var setsArr = [];
    for (var i = 1; i <= step.totalSets; i++) setsArr.push(i);
    this.setData({
      cue: step.cue,
      phase: step.phase || (step.isRest ? '休息' : ''),
      num: step.dur,
      isRest: !!step.isRest,
      ringOffset: 553,
      progressPct: setPct,
      overallPct: overallPct,
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

      const overallPct = this._total > 0 ? Math.min(Math.round(this._elapsed / this._total * 100), 100) : 0;
      const setPct = this._setTotal > 0 ? Math.min(Math.round(this._setElapsed / this._setTotal * 100), 100) : 0;
      // ring: fraction elapsed within this step
      const ringP = Math.min(tickCount / totalDur, 1);
      const ringOffset = CIRC * (1 - ringP);
      this.setData({ num: this._left, progressPct: setPct, overallPct: overallPct, ringOffset: ringOffset });

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
      if (this._audio) this._audio.pause();
      this._clearTimers();
      this.setData({ paused: true });
    }
  },

  askSkip() {
    if (this._audio) this._audio.pause();
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
    if (this._audio) this._audio.pause();
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
    const timeStr = mins > 0 ? (mins + '分' + (secs ? secs + '秒' : '')) : (secs + '秒');
    const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

    wx.navigateTo({
      url: '/pages/complete/complete?id=' + ex.id +
        '&phase=' + ex.phase +
        '&mode=' + ex.mode +
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
      this._audioSrc = null;
    }
  },

  // ---- audio ----
  _playAudio(step) {
    if (!this.data.voiceOn || !step || !step.audio) {
      if (this._audio) { this._audio.stop(); this._audio.destroy(); this._audio = null; this._audioSrc = null; }
      return;
    }
    // 暂停状态恢复时，同一条音频续播（但已播完的不重复）
    if (this._audio && this._audioSrc === step.audio) {
      if (!this._audioEnd) this._audio.play();
      return;
    }
    if (this._audio) { this._audio.stop(); this._audio.destroy(); this._audio = null; this._audioSrc = null; }
    var self = this;
    var audio = wx.createInnerAudioContext();
    audio.src = step.audio;
    audio.onEnded(function() { self._audioEnd = true; });
    audio.onError(function(err) {
      console.error('[音频] 播放失败:', JSON.stringify(err), 'src:', step.audio);
      // 云 URL 失败时，尝试本地音频兜底
      if (step._localAudio && audio.src !== '/audio/' + step._localAudio + '.m4a') {
        audio.src = '/audio/' + step._localAudio + '.m4a';
        audio.play();
      }
    });
    audio.play();
    this._audio = audio;
    this._audioSrc = step.audio;
    this._audioEnd = false;
  },

  // ---- helpers ----
  _clearTimers() {
    if (this._tick) { clearInterval(this._tick); this._tick = null; }
  }
});
