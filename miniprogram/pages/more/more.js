// pages/more/more.js
const more = {

  /**
   * 页面的初始数据
   */
  data: {
    feedbackURL: '../feedback/feedback'
  },
  goPages: function(e){
    let page = e.currentTarget.dataset.page
    wx.navigateTo({ url: '/pages/'+ page +'/'+ page })
  },

  /**
   * 跳转--问题反馈
   */
  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      let user = e.detail.userInfo
      console.log('用户按了允许授权按钮', user)
      wx.navigateTo({
        url: this.data.feedbackURL + '?nickName=' + user.nickName + '&avataUrl=' + user.avataUrl
      })
    } else {
      //用户按了拒绝按钮
    }


  },
  clear() {
    this.setData({
      hasUserInfo: false,
      userInfo: {}
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
}
Page(more)