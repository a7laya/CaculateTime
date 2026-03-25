// pages/relationship/relationship.js
const relationship = require('../common/relationship.js') // 引入计算的主体逻辑
const app = getApp()
const currentTime = app.currentTime
const getConstellation = app.getConstellation
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    msg: 'hello！！', // 测试用的，可以忽略
    text: '', // 主屏幕字符串
    result: '', // 结果屏字符串(我叫ta)
    result_reverse: '', // 结果屏字符串(ta叫我)
    ta: 'ta', //ta 他 她
    res_history: [], // 计算算式及结果历史记录(本地存储)
    screenClass: '', // str屏幕样式(动态控制字体大小,也可以在wxss里面增加其他功能)
    resClass: '', // res屏幕样式(动态控制字体大小,也可以在wxss里面增加其他功能)
    audioSwitch: true, // 音量开关
    sex: 1, // 本人性别
    sex_forbid: 0 // 控制"夫|妻"显示的变量
  },
  goPages: function(e) {
    let page = e.currentTarget.dataset.page
    console.log('/pages/' + page + '/' + page)
    wx.switchTab({
      url: '/pages/' + page + '/' + page
    })
  },
  setSex(e) {
    this.setData({
      sex: Number(!e.detail.value)
    })
    let str = this.data.text
    this.sex(str) // 判断对象性别
    this.cal_promptly(str)

  },

  /**
   * 通过传参type设置各个按键声音
   * */
  audioPlay: function(type = 'hit') {
    if (type == 'save') {
      innerAudioContext.src = 'audio/save.mp3'
    } else {
      innerAudioContext.src = 'audio/hit2.mp3'
    }
    innerAudioContext.play();
  },

  /**
   * 转发功能
   */
  onShareAppMessage(options) {
    if (options.from === 'menu') {
      console.log(options)
    }
    // return {
    //   title: '亲戚关系计算器',
    //   desc: '过年见到三姑六婆不知道叫什么,点这里可以教你',
    //   path: '/pages/relationship/relationship'
    // };
    let that = this;
    return {
      title: '亲戚关系计算器', // 转发后 所显示的title
      desc: '过年见到三姑六婆不知道叫什么,点这里可以教你',
      path: '/pages/relationship/relationship', // 相对的路径
      success: (res) => { // 成功后要做的事情
        console.log(res)
        console.log(res.shareTickets[0])
        // console.log

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function(res) {
            console.log(res)
          },
          complete: function(res) {
            console.log(res)
          }
        })
      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },



  /*---------------------------------------------------------
  *--输出称呼到主屏幕(这里需要考虑到一下几种情况)---------------
  -----------------------------------------------------------*/
  input_num(event) {
    // 播放按键声音
    let audioSwitch = this.data.audioSwitch
    audioSwitch && this.audioPlay()
    // console.log(event.currentTarget.dataset.num);
    // 获取绑定该方法dom的dataset数据num，也就是计算器上的按键
    let num = event.currentTarget.dataset.num;
    // 获取输入到主屏幕的字符串
    let str = this.data.text + num;
    // 判断str前面是不是有"的"有的话 去掉
    str = str.replace(/^的/g, '')

    this.setData({
      text: str,
    });
    // 即时运算
    this.cal_promptly(str);
  },
  cal_promptly(str) {
    let sex = this.data.sex
    let result = relationship({
      text: str,
      sex: sex,
      reverse: false,
      type: 'default'
    })
    let result_reverse = relationship({
      text: str,
      sex: sex,
      reverse: true,
      type: 'default'
    })
    // 判断对象的性别
    this.sex(str)
    this.setData({
      result,
      result_reverse,
    })
  },

  sex(str) { // 判断对象的性别
    let sex = this.data.sex
    let ta = /(?:爸|子|弟|哥|公)$/g.test(str) ? '他' : '她'
    let sex_forbid
    if (str == '') {
      sex == 0 ? sex_forbid = 0 : sex_forbid = 1
    } else {
      ta == '他' ? sex_forbid = 1 : sex_forbid = 0
    }
    this.setData({
      ta,
      sex_forbid
    })
  },

  // 退格键********************************************************************
  func_back_space(event) {
    // 播放按键声音
    let audioSwitch = this.data.audioSwitch
    audioSwitch && this.audioPlay()
    let str = this.data.text;
    if (str.length >= 3) {
      str = str.substring(0, str.length - 3);
    } else {
      str = ''
    }

    this.setData({
      text: str,
    });
    // 即时运算
    this.cal_promptly(str);
  },

  // 清除全部，并保存到历史记录 *************************************************
  func_all_clear(event) {
    // 播放按键声音
    let audioSwitch = this.data.audioSwitch
    audioSwitch && this.audioPlay()
    // 清除全部
    this.setData({
      text: '',
      result: '',
      result_reverse: '',
      num_tip: '',
      constellation: '',
      constellation_analysis: ''
    });
    this.sex(this.data.text)

    // 保存到历史记录
    // TO DO........
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
    let str = this.data.text
    this.sex(str)

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
})