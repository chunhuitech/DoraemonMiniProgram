// pages/modules/course/courseList.js
import request from '../../../utils/net/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    classId:1200
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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

  },

  initData: function () {
    return this.getCourse();
  },

  getCourse() {
    // 我创建的日历列表
    let jsonStr = {
      url: `/api/admin/weixin/class/children`,
      data: { id: this.data.classId}
    };
    let self = this;
    wx.showLoading({ title: '加载中...', mask: true }); //在标题栏中显示加载
    return request.get(jsonStr).then((res) => {
      const { code, data } = res.data;
      if (code === 0) {
        self.setData({ courseList: data.dataList, isWarningShow: false });
      } else {
      }
    });
  },
  clickHandle(e) {
    const { course } = e.currentTarget.dataset;
    console.log(course)
    if (course.leaf == 1){
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/modules/reading/read?classId=${course.id}`,
          complete: () => {
          }
        })
      }, 100)
    } else {
      this.data.classId = course.id;
      return this.getCourse();
    }
    

  },
})