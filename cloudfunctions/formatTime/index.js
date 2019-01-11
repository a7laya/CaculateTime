// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
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
  let ts = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  return {
    d,
    ts,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}