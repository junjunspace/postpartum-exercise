const { getPhaseById, getExercisesByPhase } = require('../../utils/data.js');
const {
  getCurrentPhase,
  getDeliveryType,
  getPhase2Check,
  setCurrentPhase
} = require('../../utils/session.js');

function getBanner(phaseId) {
  if (phaseId === 2) {
    return {
      title: '产后 6—12 周',
      sub: '功能重建期 · 完成产后 6 周医学检查后开始'
    };
  }

  return {
    title: '产后 0—6 周',
    sub: '急性修复期 · 顺产24h后 / 剖宫产48-72h后开始'
  };
}

Page({
  data: {
    phaseId: 1,
    phase: null,
    exercises: [],
    bannerTitle: '',
    bannerSub: ''
  },

  onLoad(options) {
    if (options && options.phase) {
      setCurrentPhase(options.phase);
    }
  },

  onShow() {
    this.loadPhase();
  },

  loadPhase() {
    var phaseId = getCurrentPhase();
    if (phaseId === 2 && !getPhase2Check()) {
      phaseId = 1;
      setCurrentPhase(1);
    }

    var deliveryType = getDeliveryType();
    var exercises = getExercisesByPhase(phaseId).map(function(item) {
      var locked = phaseId === 1 && deliveryType === 'cs' && (item.id === 'e03' || item.id === 'e04');
      return Object.assign({}, item, { locked: locked });
    });
    var banner = getBanner(phaseId);

    this.setData({
      phaseId: phaseId,
      phase: getPhaseById(phaseId),
      exercises: exercises,
      bannerTitle: banner.title,
      bannerSub: banner.sub
    });
  },

  goDetail(e) {
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    var ex = this.data.exercises.find(function(item) { return item.id === id; });
    if (ex && ex.locked) {
      wx.showToast({
        title: '剖宫产术后2周内建议暂缓，请遵医嘱后开始',
        icon: 'none',
        duration: 2500
      });
      return;
    }
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  startFull() {
    var first = this.data.exercises.find(function(item) { return !item.locked; });
    if (!first) return;
    wx.navigateTo({ url: '/pages/practice/practice?id=' + first.id });
  }
});
