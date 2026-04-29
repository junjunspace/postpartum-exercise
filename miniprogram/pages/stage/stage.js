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
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    var ex = this.data.exercises.find(function(item) { return item.id === id; });
    if (ex && ex.locked) {
      wx.showToast({ title: '剖宫产术后2周内建议暂缓，请遵医嘱后开始', icon: 'none', duration: 2500 });
      return;
    }
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
      fail: function(err) { console.error('goDetail fail', err); }
    });
  },

  startFull() {
    var ex = EXERCISES[0];
    wx.navigateTo({
      url: '/pages/practice/practice?id=' + ex.id,
      fail: function(err) { console.error('startFull fail', err); }
    });
  }
});
