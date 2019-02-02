//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success:res=>{
        this.globalData.client.w = res.windowWidth;
        this.globalData.client.h = res.windowHeight;
      }
    })
    if(wx.getStorageSync('login')){
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            //验证小程序 登录是否过期
            wx.checkSession({
              success: function () { //未过期
              
              },
              fail: function () { //已过期
                wx.setStorageSync('login',false);
                wx.switchTab({
                  url:'/pages/modules/mine/mine'
                })
              }
            })
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }else{
            wx.setStorageSync('login',false);
            wx.switchTab({
              url:'/pages/modules/mine/mine'
            })
          }
        }
      })
    }else{
      wx.switchTab({
        url:'/pages/modules/mine/mine'
      })
    }
  },
  globalData: {
    userInfo: null,
    client: {},
    audio: wx.createInnerAudioContext()
  }
})