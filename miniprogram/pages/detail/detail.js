const { getExerciseById } = require('../../utils/data.js');
const { setCurrentPhase } = require('../../utils/session.js');

Page({
  data: {
    ex: null
  },

  onLoad(options) {
    var id = options.id;
    var ex = getExerciseById(id);
    if (!ex) {
      console.error('detail: exercise not found', id);
      return;
    }

    setCurrentPhase(ex.phase);
    this.setData({ ex: ex });
    wx.setNavigationBarTitle({ title: ex.name });
  },

  startPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice?id=' + this.data.ex.id
    });
  }
});
