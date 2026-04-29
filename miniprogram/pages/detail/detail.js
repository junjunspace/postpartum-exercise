// pages/detail/detail.js
const { EXERCISES } = require('../../utils/data.js');

Page({
  data: {
    ex: null
  },

  onLoad(options) {
    const id = options.id;
    const ex = EXERCISES.find(e => e.id === id);
    if (ex) {
      this.setData({ ex });
      wx.setNavigationBarTitle({ title: ex.name });
    }
  },

  startPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice?id=' + this.data.ex.id
    });
  }
});
