// pages/more/feedback.js
const util = require('../../utils/util.js');
const app = getApp()
const currentTime = app.currentTime // 获取当前时间的函数 精确到秒
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showInput: true,
  },
  feedbackInput: function (e) {
    this.setData({
      feedback: e.detail.value
    })
  },
  insertDatabase_feedback: function () {
    const db = wx.cloud.database()
    let that = this
    let ts = currentTime()
    console.log('ts', ts)

    db.collection('feedback').add({
      data: {
        nickName: that.data.userInfo.nickName,
        avatarUrl: that.data.userInfo.avatarUrl,
        feedback: that.data.feedback,
        ts
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '问题反馈成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        that.setData({
          showInput:false
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '反馈失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    

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
    let that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log('用户已经授权过:', res.userInfo)
              //用户已经授权过
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
              console.log(that.data)
            }
          })
        }
      }
    })
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