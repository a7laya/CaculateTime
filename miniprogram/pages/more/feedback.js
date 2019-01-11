// pages/more/feedback.js

const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
  },

  /**
   * 返回上一页面
   */
  historyBack: function (e) {
    console.log(e);
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  // if (this.data.logged) return

  // util.showBusy('正在登录')

  // const session = qcloud.Session.get()

  // if (session) {
  //   // 第二次登录
  //   // 或者本地已经有登录态
  //   // 可使用本函数更新登录态
  //   qcloud.loginWithCode({
  //     success: res => {
  //       this.setData({ userInfo: res, logged: true })
  //       util.showSuccess('登录成功')
  //     },
  //     fail: err => {
  //       console.error(err)
  //       util.showModel('登录错误', err.message)
  //     }
  //   })
  // } else {
  //   // 首次登录
  //   qcloud.login({
  //     success: res => {
  //       this.setData({ userInfo: res, logged: true })
  //       util.showSuccess('登录成功')
  //     },
  //     fail: err => {
  //       console.error(err)
  //       util.showModel('登录错误', err.message)
  //     }
  //   })
  // }
  // },

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