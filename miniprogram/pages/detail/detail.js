// pages/detail/detail.js
const { EXERCISES } = require('../../utils/data.js');

Page({
  data: {
    ex: null
  },

  onLoad(options) {
    var id = options.id;
    var ex = EXERCISES.find(function(e) { return e.id === id; });
    if (!ex) {
      console.error('detail: exercise not found', id);
      return;
    }
    this.setData({ ex: ex });
    wx.setNavigationBarTitle({ title: ex.name });
  },

  startPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice?id=' + this.data.ex.id
    });
  }
});
