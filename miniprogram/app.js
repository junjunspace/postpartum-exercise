App({
  onLaunch() {
    console.log('产后修复小程序启动');
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-d1gp0f2s312426955',
        traceUser: true
      });
    }
  },
  globalData: {}
});
