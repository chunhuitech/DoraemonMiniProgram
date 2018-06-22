const util = require('../../../utils/util.js')
import config from '../../../utils/config';
import request from '../../../utils/net/request';

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              // console.log(res.userInfo)
              // console.log("uuid:" + util.genUUid())
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    // console.log(e.detail.userInfo)
  },

  startUpHandle: function (e) {
    request.post({ url: '/api/admin/weixin/prodactivity/report', data: { userId: wx.getStorageSync('userId'), procId: config.productId, procName: config.productName, procVersion: config.productVersion, eventName: "start-up" } }).then((res2) => {
      if (res2.data.code == 0) {
      }
    })
  },

  getUserInfoByHandle: function (e) {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success: function (resUserInfo) {
              console.log(resUserInfo)
              //要把加密串转成URI编码
              var encryptedData = encodeURIComponent(resUserInfo.encryptedData);
              var iv = resUserInfo.iv;

              wx.showLoading({ 'title': '提交中...', mask: true });


              request.post({ url: '/api/admin/weixin/user/login', data: { code: res.code, encryptedData: encryptedData, iv: iv } }).then((res2) => {
                wx.hideLoading();
                if (res2.data.code == 0) {
                  wx.setStorageSync('token', res2.data.data.token);
                  wx.setStorageSync('userId', res2.data.data.userId);
                  wx.setStorageSync('authorStatus', true);

                } else {
                  wx.showToast({
                    title: res2.data.data.result,
                  })
                }
              })
            }
          });
        }
      }
    });
    
  }
})