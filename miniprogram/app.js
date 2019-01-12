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
        content: '发现新版本了，是否马上更新？',
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
})
