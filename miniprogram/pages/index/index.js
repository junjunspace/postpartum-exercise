// pages/index/index.js
Page({
  data: {
    showDisclaimer: false,
    showDelivery: false
  },

  onLoad() {
    const confirmed = wx.getStorageSync('disclaimerConfirmed');
    if (!confirmed) {
      this.setData({ showDisclaimer: true });
    }
  },

  confirmDisclaimer() {
    wx.setStorageSync('disclaimerConfirmed', true);
    const deliveryType = wx.getStorageSync('deliveryType');
    if (!deliveryType) {
      this.setData({ showDisclaimer: false, showDelivery: true });
    } else {
      this.setData({ showDisclaimer: false });
    }
  },

  selectDelivery(e) {
    const type = e.currentTarget.dataset.type;
    wx.setStorageSync('deliveryType', type);
    this.setData({ showDelivery: false });
  },

  goStage() {
    wx.switchTab({ url: '/pages/stage/stage' });
  },

  onLockedTap() {
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon: 'none',
      duration: 2500
    });
  }
});
