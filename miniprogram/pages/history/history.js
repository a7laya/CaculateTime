// pages/history/history.js
const app = getApp()
const currentTime = app.currentTime // 计算当前时间 2019-01-01 01:01:01
const timePass = app.timePass // 将毫秒数转换为XX前(2分钟前|3小时前|昨天|2天前)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res_history: [], // 计算算式及结果历史记录(本地存储)
    current_ts: '', // 切入这个页面时,将当前时间赋值到这里
    has_data: true,
  },

  /**
   * 引用历史记录
   * 1.直接加在计算界面的str后面
   */
  useIt: function (e) {
    let res_history = e.currentTarget.dataset.res_history;
    app.globalData.res_history = res_history;
    wx.switchTab({
      url: '/pages/index/index',
      success: function (e) {
        console.log('跳转成功')
        let page =  getCurrentPages().pop()
        if(!page) return
        page.onLoad()
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
   * Step 0.判断页面跳转来源
   * Step 1.加载该模式下的历史信息
   */
  onLoad: function (options) {
    let that = this
    //Step 0.
    // let pages = getCurrentPages();
    // let prevpage = pages[pages.length - 2];
    // if (prevpage) console.log('页面来源:', prevpage.route)

    //Step 1.
    wx.getStorage({
      key: 'res_history',
      success: function (res) {
        let data = res.data
        data.length == 0 ? that.setData({ has_data: false }) : that.setData({ has_data: true })
        data.forEach(function (val, key) {
          val.time_pass = timePass(that.data.current_ts - val.ts)
        });

        that.setData({
          res_history: data
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
    let current_ts = Date.parse(new Date());
    this.setData({
      current_ts
    })
    console.log(this.data.res_history)
    let that = this
    //Step 1.
    wx.getStorage({
      key: 'res_history',
      success: function (res) {
        let data = res.data
        data.length == 0 ? that.setData({ has_data: false }) : that.setData({ has_data: true })
        console.log(that.data)
        data.forEach(function (val, key) {
          val.time_pass = timePass(that.data.current_ts - val.ts)
        });
        that.setData({
          res_history: data.reverse()
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