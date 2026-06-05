const {
  getMedicalDisclaimer,
  setMedicalDisclaimer,
  getDeliveryType,
  setDeliveryType,
  getPhase2Check,
  setPhase2Check,
  setCurrentPhase
} = require('../../utils/session.js');

Page({
  data: {
    showDisclaimer: false,
    showDelivery: false,
    showPhase2Confirm: false,
    phase2Unlocked: false,
    deliveryType: ''
  },

  onLoad() {
    this.syncState();
  },

  onShow() {
    this.syncState();
  },

  syncState() {
    var confirmed = getMedicalDisclaimer();
    var deliveryType = getDeliveryType();
    this.setData({
      showDisclaimer: !confirmed,
      showDelivery: confirmed && !deliveryType,
      phase2Unlocked: getPhase2Check(),
      deliveryType: deliveryType
    });
  },

  confirmDisclaimer() {
    setMedicalDisclaimer(true);
    this.syncState();
  },

  selectDelivery(e) {
    var type = e.currentTarget.dataset.type;
    if (!type) return;
    setDeliveryType(type);
    this.syncState();
  },

  goStage() {
    setCurrentPhase(1);
    wx.switchTab({ url: '/pages/stage/stage' });
  },

  onPhase2Tap() {
    if (this.data.phase2Unlocked) {
      setCurrentPhase(2);
      wx.switchTab({ url: '/pages/stage/stage' });
      return;
    }
    this.setData({ showPhase2Confirm: true });
  },

  confirmPhase2Check() {
    setPhase2Check(true);
    setCurrentPhase(2);
    this.setData({ showPhase2Confirm: false, phase2Unlocked: true });
    wx.switchTab({ url: '/pages/stage/stage' });
  },

  cancelPhase2Check() {
    this.setData({ showPhase2Confirm: false });
  },

  onLockedTap() {
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon: 'none',
      duration: 2500
    });
  }
});
