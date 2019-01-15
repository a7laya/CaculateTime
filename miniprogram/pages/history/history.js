// pages/history/history.js
const app = getApp()
const currentTime = app.currentTime // 计算当前时间 2019-01-01 01:01:01
const timePass = app.timePass // 将毫秒数转换为XX前(2分钟前|3小时前|昨天|2天前)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 180, // 删除按钮宽度单位（rpx）
    res_history: [], // 计算算式及结果历史记录(本地存储)
    current_ts: '', // 切入这个页面时,将当前时间赋值到这里
    has_data: true,
  },

  /**
   * 引用历史记录
   * 1.直接加在计算界面的str后面
   */
  useIt: function (e) {
    let res_history = e.currentTarget.dataset.res_history
    // 将当前选中的结果传到全局变量,跳转到index时可以直接调用
    app.globalData.res_history = res_history
    wx.switchTab({
      url: '/pages/index/index',
      success: function (e) {
        console.log('跳转成功')
        let page = getCurrentPages().pop()
        if (!page) return
        page.onLoad()
        wx.showToast({
          title: '引入' + app.globalData.res_history,
        })

      }
    })
  },
  /**
   * 清除历史记录
   * ps. 这边清除完成后,还得去把主页中的data里面的res_history
   * 在onShow里面进行更新,以为tabBar切换时是不会更新数据的
   */
  clear_history: function (e) {
    let that = this
    let model = e.currentTarget.dataset.model
    if (model == 'normal') {
      wx.showModal({
        title: '提示',
        content: '确定要删除当前页面所有记录吗？',
        success: function (sm) {
          if (sm.confirm) {
            wx.setStorage({
              key: 'res_history',
              data: [],
              success: function (res) {
                wx.showToast({
                  title: '清除成功',
                })
                that.onLoad()
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataFromStorage()
  },


  /**
   * 生命周期函数--监听页面显示
   * ps 这个函数在tabBar切换的时候很好用,可以刷新页面数据,以为tabBar切换
   * 不会触发onLaod函数
   */
  onShow: function () {
    let current_ts = Date.parse(new Date());
    this.setData({
      current_ts
    })
    console.log(this.data.res_history)
    // 获取当页显示所需的res_history,并更新到数据绑定data
    this.getDataFromStorage()

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

  /**
   * 获取当页显示所需的res_history,并更新到数据绑定data
   */
  getDataFromStorage: function () {
    let that = this
    //Step 1.
    wx.getStorage({
      key: 'res_history',
      success: function (res) {
        let data = res.data
        // 判断本地Storage有没有res_history, 通过改变data.has_data来设置当前页面显示逻辑
        data.length == 0 ? that.setData({ has_data: false }) : that.setData({ has_data: true })
        // 对取到的数组item进行遍历, 设置各个item距当前的时间差
        data.forEach(function (val, key) {
          val.time_pass = timePass(that.data.current_ts - val.ts)
        });
        // 由于时间差是动态变化的,无需再写入本地Storage,直接更新到数据绑定中就行了
        that.setData({
          res_history: data.reverse()
        })
        console.log('that.data.res_history', that.data.res_history)
      }
    })
  },


  //点击删除按钮事件
  delItem: function (e) {
    let that = this
    //获取列表中要删除项的下标
    let index = e.currentTarget.dataset.index;
    let res = e.currentTarget.dataset.res;
    let res_history = that.data.res_history;
    wx.showModal({
      title: '提示',
      content: '是否删除"' + res + '"？',
      success: function (res) {
        if (res.confirm) {
          //移除列表中下标为index的项
          res_history.splice(index, 1);
          //更新列表的状态
          that.setData({ res_history });

          // 写入本地
          wx.setStorage({
            key: 'res_history',
            data: res_history.reverse(),
          })
          res_history.reverse()
        } else {
          // do nothing
        }
      }
    })

  }



})

