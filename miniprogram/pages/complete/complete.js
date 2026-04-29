// pages/complete/complete.js
Page({
  data: {
    exName: '',
    sets: '',
    time: '',
    encourage: '',
    nextId: ''
  },

  onLoad(options) {
    this.setData({
      exName: decodeURIComponent(options.name || ''),
      sets: options.sets || '',
      time: decodeURIComponent(options.time || ''),
      encourage: decodeURIComponent(options.enc || ''),
      nextId: options.nextId || ''
    });
  },

  goNext() {
    wx.redirectTo({
      url: '/pages/practice/practice?id=' + this.data.nextId
    });
  },

  goList() {
    wx.navigateBack({ delta: 2 });
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  }
});
