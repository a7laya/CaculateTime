//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}


    // 启用版本发现及通知更新--------------------------------
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('是否有更新:', res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '发现新版本，是否更新？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  },
  // 获取当前时间的函数 格式 2019-01-01 01:01:01
  currentTime: function () {
    let d = new Date();
    let year = d.getFullYear();
    let month = change(d.getMonth() + 1);
    let day = change(d.getDate());
    let hour = change(d.getHours());
    let minute = change(d.getMinutes());
    let second = change(d.getSeconds());
    function change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  },
  // 将毫秒数转换为XX前(2分钟前|3小时前|昨天|2天前)
  timePass: function (ms) {
    if (ms / 60000 >= 2880) return parseInt(ms/60000/1440) + '天前'
    if (ms / 60000 >= 1440 && ms / 60000 < 2880) return '昨天'
    if (ms / 60000 >= 60   && ms / 60000 < 1440) return parseInt(ms/60000/60)+'小时前'
    if (ms /  1000 >= 60   && ms / 60000 < 60) return parseInt(ms/60000)+'分钟前'
    if (ms / 1000 < 60) return '刚刚'
  },
  // 根据月份和日期计算所属星座
  getConstellation: function (month, day){
    var s = "摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯";
    var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + '座';
  },
  // 存储一条历史数据,用于'引用'功能
  globalData:{
    res_history:''
  }
})
