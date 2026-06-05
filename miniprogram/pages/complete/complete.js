const { setCurrentPhase } = require('../../utils/session.js');

Page({
  data: {
    exName: '',
    sets: '',
    time: '',
    encourage: '',
    nextId: '',
    phaseId: 1
  },

  onLoad(options) {
    this.setData({
      exName: decodeURIComponent(options.name || ''),
      sets: options.sets || '',
      time: decodeURIComponent(options.time || ''),
      encourage: decodeURIComponent(options.enc || ''),
      nextId: options.nextId || '',
      phaseId: Number(options.phase) || 1
    });
  },

  goNext() {
    if (!this.data.nextId) return;
    wx.redirectTo({
      url: '/pages/practice/practice?id=' + this.data.nextId
    });
  },

  goList() {
    setCurrentPhase(this.data.phaseId);
    wx.switchTab({ url: '/pages/stage/stage' });
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  }
});
