const util = require('../../../utils/util.js')
import config from '../../../utils/config';
import request from '../../../utils/net/request';

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    unLogin:!wx.getStorageSync('login')
  },
  onLoad: function () {
    // 查看是否授权
    
  },
  onGotUserInfo: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    //console.log(e.detail.rawData)
    console.log(e.detail)

    wx.login({
      success: function (res) {
        if (res.code) {
          //要把加密串转成URI编码
          var encryptedData = encodeURIComponent(e.detail.encryptedData);
          var iv = e.detail.iv;

          wx.showLoading({ 'title': '提交中...', mask: true });


          request.post({ url: '/api/admin/weixin/user/login', data: { code: res.code, encryptedData: encryptedData, iv: iv } }).then((res2) => {
            wx.hideLoading();
            if (res2.data.code == 0) {
              wx.setStorageSync('token', res2.data.data.token);
              wx.setStorageSync('userId', res2.data.data.userId);
              wx.setStorageSync('authorStatus', true);
              wx.setStorageSync('login', true);
            } else {
              wx.showToast({
                title: res2.data.result,
              })
            }
          })
        }
      }
    });
  },
  getClassInfo: function (e) {
    request.get({ url: '/api/admin/weixin/class/children', data: { id: 1000 } }).then((res2) => {
      if (res2.data.code == 0) {
        console.log(res2.data.data.dataList)
      } else {
        console.log(res2.data.code)
        console.log(res2.data.result)
      }
    })
  },

  getResourceInfo: function (e) {
    request.get({ url: '/api/admin/weixin/resource/get', data: { id: 1232 } }).then((res2) => {
      if (res2.data.code == 0) {
        console.log(res2.data.data.dataList)
      } else {
        console.log(res2.data.code)
        console.log(res2.data.result)
      }
    })
  },

  getPageReadInfo: function (e) {
    request.get({ url: '/api/admin/weixin/readpoint/get', data: { pageId: 10001 } }).then((res2) => {
      if (res2.data.code == 0) {
        console.log(res2.data.data.dataList)
      } else {
        console.log(res2.data.code)
        console.log(res2.data.result)
      }
    })
  },

  getPageInfo: function (e) {
    request.get({ url: '/api/admin/weixin/page/get', data: { classId: 1232, page: 1, limit: 100 } }).then((res2) => {
      if (res2.data.code == 0) {
        console.log(res2.data.data.dataList)
      } else {
        console.log(res2.data.code)
        console.log(res2.data.result)
      }
    })
  },

  getCatalogInfo: function (e) {
    request.get({ url: '/api/admin/weixin/catalog/get', data: { classId: 1232 } }).then((res2) => {
      if (res2.data.code == 0) {
        console.log(res2.data.data.dataList)
      } else {
        console.log(res2.data.code)
        console.log(res2.data.result)
      }
    })
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
                  wx.setStorageSync('login', true);
                } else {
                  wx.showToast({
                    title: res2.data.result,
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