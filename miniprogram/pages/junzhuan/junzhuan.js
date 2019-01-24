// pages/junzhuan/junzhuan.js
const accumulatePoints = require('../common/accumulatePoints.js') // 引入计算的主体逻辑
const app = getApp()
const currentTime = app.currentTime
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrRank: ['排职', '副连职', '正连职', '副营职', '正营职', '副团职', '正团职', '副师职','正师职'],
    arrRankIndex: 0,
    rankPoints: 4,
    yearPoints: 0,
    totalPoints: 0,

  },

  bindKeyInput(e) {
    let year = e.detail.value
    console.log(year)
    this.setData(
      accumulatePoints({ year })
    )
  },
  rankChange(e) {
    let arrRankIndex = e.detail.value
    let rankPoints = arrRankIndex * 0.5 + 4
    this.setData({
      rankPoints,
      arrRankIndex
    })
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