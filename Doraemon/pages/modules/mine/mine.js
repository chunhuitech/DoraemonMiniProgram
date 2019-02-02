// pages/modules/mine/mine.js
const util = require('../../../utils/util.js')
import config from '../../../utils/config';
import request from '../../../utils/net/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showLogin:!wx.getStorageSync('login')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onGotUserInfo: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    //console.log(e.detail.rawData)
    console.log(e.detail)
    let self=this;
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
              self.setData({
                showLogin:false
              })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})