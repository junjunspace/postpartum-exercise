// pages/stage/stage.js
const { EXERCISES } = require('../../utils/data.js');

Page({
  data: {
    exercises: []
  },

  onLoad() {
    const deliveryType = wx.getStorageSync('deliveryType');
    const lockedIds = deliveryType === 'csection' ? ['e03', 'e04'] : [];
    const exercises = EXERCISES.map(function(ex) {
      return Object.assign({}, ex, { locked: lockedIds.includes(ex.id) });
    });
    this.setData({ exercises: exercises });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    const ex = this.data.exercises.find(function(e) { return e.id === id; });
    if (ex && ex.locked) {
      wx.showToast({ title: '剖宫产术后2周内建议暂缓，请遵医嘱后开始', icon: 'none', duration: 2500 });
      return;
    }
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  startFull() {
    const ex = EXERCISES[0];
    wx.navigateTo({ url: '/pages/practice/practice?id=' + ex.id });
  }
});
