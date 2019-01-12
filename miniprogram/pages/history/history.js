// pages/history/history.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res_history_normal: [], // 计算算式及结果历史记录(本地存储)
  },

  
  /**
   * 清除历史记录
   * ps. 这边清除完成后,还得去把主页中的data里面的res_history_normal
   * 在onShow里面进行更新,以为tabBar切换时是不会更新数据的
   */
  clear_history: function (e) {
    let that = this
    let model = e.currentTarget.dataset.model
    model == 'normal' && wx.setStorage({
      key: 'cal_res_normal',
      data: [],
      success: function (res) {
        wx.showToast({
          title: '清除成功',
        })
        that.onLoad()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * Step 0.判断页面跳转来源
   * Step 1.加载该模式下的历史信息
   */
  onLoad: function (options) {
    let that = this
    //Step 0.
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) console.log('页面来源:', prevpage.route)

    //Step 1.
    wx.getStorageInfo({
      success: function (res) {
        console.log('getStorageInfo:', res)
      }
    })
    wx.getStorage({
      key: 'cal_res_normal',
      success: function (res) {
        console.log("提取到cal_res_normal:", res)
        that.setData({
          res_history_normal: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * ps 这个函数在tabBar切换的时候很好用,可以刷新页面数据,以为tabBar切换
   * 不会触发onLaod函数
   */
  onShow: function () { 
    let that = this
    //Step 1.
    wx.getStorageInfo({
      success: function (res) {
        console.log('getStorageInfo:', res)
      }
    })
    wx.getStorage({
      key: 'cal_res_normal',
      success: function (res) {
        console.log("提取到cal_res_normal:", res)
        that.setData({
          res_history_normal: res.data.reverse()
        })
      }
    })

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