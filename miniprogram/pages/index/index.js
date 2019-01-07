//index.js

Page({
  data: {
    msg: 'hello！！', // 测试用的，可以忽略
    text: '', // 主屏幕字符串绑定到data.text
    result: '',
  },

  /*---------------------------------------------------------
  *--输出数字到主屏幕(这里需要考虑到一下几种情况)---------------
  * case 1. str最后一个字符是'0'，且‘0’前面没有数字或者小数点（.:），则输入的数字直接覆盖0；（0，-0， +0）
  * 
  -----------------------------------------------------------*/
  input_num(event) {
    // console.log(event.currentTarget.dataset.num);
    // 获取绑定该方法dom的dataset数据num，也就是计算器上的按键
    let num = event.currentTarget.dataset.num;
    // 获取输入到主屏幕的字符串
    let str = this.data.text;
    // case 1.
    if (/[^.:1234567890]0$/g.test(str) || str === '0') {
      str = str.substring(0, str.length - 1);
    }
    this.setData({
      text: str + num,
    });

    // 即时运算
    this.cal_promptly(str + num); // 注意这里的str是还未按下去的状态，所以要加上num
  },

  // 输出运算符号+-×÷()
  input_cal(event) {
    // 获取绑定该方法dom的dataset数据cal，也就是计算器上的按键
    let cal = event.currentTarget.dataset.cal;
    // 获取输入到主屏幕的字符串
    let str = this.data.text;
    // 判断按键生效时机
    if (str == '') return;
    if (/\+$/.test(str) && cal == '+') return;
    if (/-$/.test(str) && cal == '-') return;
    if (/x$/.test(str) && cal == 'x') return;
    if (/÷$/.test(str) && cal == '÷') return;
    if (/\+|-|x|÷$/.test(str)) {
      let str2 = this.data.text.substring(0, this.data.text.length-1);
      console.log(str2)
      this.setData({
        text: str2 + cal,
      });
      return
    };
    this.setData({
      text: str + cal,
    });
  },

  // =号逻辑，计算出结果并在结果屏幕显示
  input_eval(event) {
    // 获取输入到主屏幕的字符串
    let str = this.data.text;
    let res = CaculateTime.caculate_time(str);
    this.setData({
      result: res[0] + res[1],
    })
  },

  /*---------------------------------------------------------
  *--输出“:”到主屏幕(这里需要考虑到一下几种情况)---------------
  * case 1. 遇到不以类似于2:12形式结尾的str，才加“:”
  * case 2. 屏幕str为空，或“:”输入之前是运算符“+-×÷”，则“:”前补0
  * 
  -----------------------------------------------------------*/
  input_2dot(event) {
    let str = this.data.text;
    // case 1.
    if (!/\d*:\d*$/g.test(str) && !/\)$/g.test(str)) {
      // case 2. 
      if (str === '' || /(\+|\-|\*|\\|\()$/g.test(str)) str = str + '0';
      this.setData({
        text: str + ':',
      })
    }
  },
  input_dot(event) {
    this.setData({
      text: this.data.text + '.'
    })
  },
  input_plus(event) {
    let str = this.data.text;
    if (str[str.length - 1] == '-') {
      str = str.substring(0, str.length - 1);
    };
    if (str[str.length - 1] != '+') {
      this.setData({
        text: str + '+'
      });
    }
  },
  input_minus(event) {
    let str = this.data.text;
    if (str[str.length - 1] == '+') {
      str = str.substring(0, str.length - 1);
    };
    if (str[str.length - 1] != '-') {
      this.setData({
        text: str + '-'
      });
    }
  },


  // 清除全部，并保存到历史记录
  func_all_clear(event) {
    // 清除全部
    this.setData({
      text: '',
      result: '',
    });

    // 保存到历史记录
    // TO DO........
  },

  // 退格键
  func_back_space(event) {
    let str = this.data.text.substring(0, this.data.text.length - 1);
    this.setData({
      text: str,
    });
    // 即时运算
    this.cal_promptly(str);
  },
  /* ***************************************************************************
   * function: 运算
   * author: lzb
   * date: 2019-1-7
   * description: 计算算式str并更新到屏幕结果;
   * ****************************************************************************/
  cal_promptly(str) {
    if (/[^01234567890]$/.test(str)) str = this.data.text.substring(0, this.data.text.length - 1);
    let res = CaculateTime.caculate_time(str);
    if (res[1] != 'false') {
      this.setData({
        result: res[0] + res[1],
      })
    } else { // 如果计算结果返回 ‘false’
      str.length == 0 ?
        this.setData({
          result: '',
        }) :
        this.setData({
          result: '小的不才，算不出来',
        })
    }
  }

})



/* ***************************************************************************
 * function: 计算器的主体逻辑
 * author: 老魏
 * date: 2019-1-7
 * description: 调用CaculateTime.caculate_time(str), 返回数组['=|~', ‘运算结果’];
 * ****************************************************************************/
const CaculateTime = {

  // 计算结果等于或者约等于，约等于是四舍五入保留两位小数的计算结果。
  equal_sign: "="

    /**
     *包括括号的多个操作数计算，形如（1:20+2:20）x3.2...，先括号后乘除再加减
     *@param     {string}  val                   可以包含括号表达式,时间必须包含小时和分钟，
     *                                           数小数位不能超过3位，形如2，2.2，2.02
     *@return    {array}  [equal_sign,res]      等于或者约等于，计算结果
     */
    ,
  caculate_time: function(val) {
      var reg = /\([^(]*?\)/;
      var index = null;
      var l_part = null;
      var m_part = null;
      var r_part = null;
      var res = 'false';
      this.equal_sign = "=";

      var is_match = val.match(reg);
      // console.log("is_match:",is_match);
      // 先去括号
      while (is_match) {
        index = is_match["index"];
        l_part = val.substring(0, index);
        m_part = is_match[0];
        r_part = val.substring(index + m_part.length, val.length);
        m_part = m_part.substring(1, m_part.length - 1);

        m_part = this.some_actor(m_part);
        if ('false' == m_part) {
          return 'false';
        }
        val = l_part + m_part + r_part;
        is_match = val.match(reg);
      }

      // 最后计算
      val = this.some_actor(val);

      reg = /^(-?)(\d+)([:.]?)([0-9]?[0-9]?)$/g;
      return (reg.test(val)) ? [this.equal_sign, val] : [this.equal_sign, 'false'];

    }

    /**
     *没有括号的多个操作数计算，形如1:20+2:20x3.2...
     *@param     {string}  val     没有括号表达式
     *@return    {string}  res     计算结果
     */
    ,
  some_actor: function(val) {
      // 先乘除
      // 中间的操作不需要操作数前的符号，不然造成的结果可能3-3x-2 相乘后失去符号---> 36
      var reg = /(\d+)([:.]?)([0-9]?[0-9]?)([x/]-?)(\d+)([:.]?)([0-9]?[0-9]?)/;
      // 需要考虑第一个数前就带有负号
      var reg2 = /^(-)(\d+)([:.]?)([0-9]?[0-9]?)([x/]-?)(\d+)([:.]?)([0-9]?[0-9]?)/;
      var index = null;
      var l_part = null;
      var m_part = null;
      var r_part = null;
      var res = 'false';

      var is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);

      while (is_match) {
        index = is_match["index"];
        l_part = val.substring(0, index);
        m_part = is_match[0];
        r_part = val.substring(index + m_part.length, val.length);

        m_part = this.two_actor(m_part);
        if ('false' == m_part) {
          return 'false';
        }

        val = l_part + m_part + r_part;
        val = val.replace("---", "-");
        val = val.replace("+--", "+");

        is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);
      }
      var is_match1 = is_match;

      // 后加减
      reg = /(\d+)([:.]?)([0-9]?[0-9]?)([+-]-?)(\d+)([:.]?)([0-9]?[0-9]?)/;
      reg2 = /^(-)(\d+)([:.]?)([0-9]?[0-9]?)([+-]-?)(\d+)([:.]?)([0-9]?[0-9]?)/;
      index = null;
      l_part = null;
      m_part = null;
      r_part = null;
      is_match = null;

      is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);
      while (is_match) {

        index = is_match["index"];
        l_part = val.substring(0, index);
        m_part = is_match[0];
        r_part = val.substring(index + m_part.length, val.length);
        m_part = this.two_actor(m_part);
        if ('false' == m_part) {
          return 'false';
        }
        val = l_part + m_part + r_part;
        val = val.replace("---", "-");
        val = val.replace("+--", "+");

        is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);
      }


      reg = /^(-?)(\d+)([:.]?)([0-9]?[0-9]?)$/g;

      return (reg.test(val)) ? val : 'false';
    }

    /**
     *没有括号的两个操作数计算，形如1:20+2:20
     *@param     {string}  val     没有括号表达式
     *@return    {string}  res     计算结果
     */
    ,
  two_actor: function(val) {
      var reg1 = /^(-?)(\d+)([:.]?)([0-9]?[0-9]?)([+-x/]-?)(\d+)([:.]?)([0-9]?[0-9]?)$/g;
      var reg2 = /^[\s\S]*:[6-9][\s\S]*/;

      var res = 'false';

      var is_match_reg1 = reg1.test(val);
      var is_match_reg2 = reg2.test(val);

      console.log("is_match_reg1:", is_match_reg1);

      if (is_match_reg1 && !is_match_reg2) {
        var prefix = RegExp.$1;
        var operator = RegExp.$5;
        var LK = RegExp.$3;
        var RK = RegExp.$7;

        LK = ('' == LK) ? "." : LK;
        RK = ('' == RK) ? "." : RK;

        var LH = Number(RegExp.$2);
        var RH = Number(RegExp.$6);

        var SLM = RegExp.$4;
        var LM = ('' == SLM) ? "00" : SLM;
        LM = Number(LM);

        var SRM = RegExp.$8;
        var RM = ('' == SRM) ? "00" : SRM;
        RM = Number(RM);

        var H = 0;
        var M = 0;

        var sign_and_operator = ('' == prefix) ? operator : (prefix + "," + operator);

        switch (sign_and_operator) {
          // 加+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          case "+":
          case "--":
          case "-,-":
          case "-,+-":
            if (":" == LK && ":" == RK) {
              H = LH + RH;
              M = LM + RM;

              H = H + ((M > 59) ? 1 : 0);
              M = (M > 59) ? (M - 60) : M;
              M = (M > 9) ? M : ("0" + M);

              res = H + ":" + M;

            } else if ("." == LK && "." == RK) {
              res = Number(LH + "." + SLM) + Number(RH + "." + SRM)
            } else {
              res = 'false';
            }


            if (("-,-" == sign_and_operator || "-,+-" == sign_and_operator) && "false" != res) {
              res = "-" + res;
            }

            break;
            // 减-------------------------------------------------------------------------
          case "-":
          case "+-":
          case "-,+":
          case "-,--":
            if (":" == LK && ":" == RK) {
              var flag = ((LH * 64 + LM) > (RH * 64 + RM)) ? true : 'false';
              if (true == flag) {
                H = (LM >= RM) ? (LH - RH) : (LH - RH - 1);
                M = (LM >= RM) ? (LM - RM) : (LM - RM + 60);
                M = (M > 9) ? M : ("0" + M);
                res = H + ":" + M;
              } else {
                H = (RM >= LM) ? (RH - LH) : (RH - LH - 1);
                M = (RM >= LM) ? (RM - LM) : (RM - LM + 60);
                M = (M > 9) ? M : ("0" + M);
                res = "-" + H + ":" + M;
              }
            } else if ("." == LK && "." == RK) {
              res = Number(LH + "." + SLM) - Number(RH + "." + SRM)
            } else {
              res = 'false';
            }

            if (("-,+" == sign_and_operator || "-,--" == sign_and_operator) && "false" != res) {
              // 正负反转
              res = ("-" == res[0]) ? res.substring(1, res.length) : ("-" + res);
            }

            break;
            // 乘xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          case "x-":
          case "x":
          case "-,x":
          case "-,x-":
            if (':' == LK && "." == RK) {
              M = (LH * 60 + LM) * Number(RH + "." + SRM);
              M = this.get_round(M, false);
              H = M;
              M = M % 60;
              H = (H - M) / 60;
              M = (M > 9) ? M : ("0" + M);
              res = H + ":" + M;
            } else if ('.' == LK && ":" == RK) {
              M = Number(LH + "." + SLM) * Number(RH * 60 + RM);
              M = this.get_round(M, false);
              H = M;
              M = M % 60;
              H = (H - M) / 60;
              M = (M > 9) ? M : ("0" + M);
              res = H + ":" + M;
            } else if ('.' == LK && "." == RK) {
              M = Number(LH + "." + SLM) * Number(RH + "." + SRM);
              H = this.get_round(M, true);
              res = H;
            } else if (':' == LK && ":" == RK) {
              res = 'false';
            }

            if (("x-" == sign_and_operator || "-,x" == sign_and_operator) && 'false' != res) {
              res = '-' + res;
            }
            break;
            // 除/////////////////////////////////////////////////////////////////////////////////////
          case "/-":
          case "/":
          case "-,/":
          case "-,/-":
            if (':' == LK && "." == RK) {
              M = (LH * 60 + LM) / Number(RH + "." + SRM);
              M = this.get_round(M, false);
              H = M;
              M = M % 60;
              H = (H - M) / 60;
              M = (M > 9) ? M : ("0" + M);
              res = H + ":" + M;
            } else if ('.' == LK && ":" == RK) {
              M = Number(LH + "." + SLM) / (RH + RM / 60);
              H = this.get_round(M, true);
              res = H;
            } else if (':' == LK && ":" == RK) {
              M = (LH * 60 + LM) / (RH * 60 + RM);
              H = this.get_round(M, true);
              res = H;
            } else if ('.' == LK && "." == RK) {
              M = Number(LH + "." + SLM) / Number(RH + "." + SRM);
              H = this.get_round(M, true);
              res = H;
            }

            if ("/-" == sign_and_operator || "-,/" == sign_and_operator) {
              res = '-' + res;
            }
            break;


          default:
            res = 'false';
            break;
        }

      } else {
        console.log("not match");
        res = 'false';
      }

      return res;
    }

    ,
  get_round(M, offset) {
    var T = offset ? Math.round(M * 100) / 100 : Math.round(M);

    if (T != M) {
      this.equal_sign = "~=";
    }

    return T
  }

}







// const app = getApp()
// Page({
//   data: {
//     msg: 'Hello, world!!',
// avatarUrl: './user-unlogin.png',
// userInfo: {},
// logged: false,
// takeSession: false,
// requestResult: ''
// },

// onLoad: function() {
//   if (!wx.cloud) {
//     wx.redirectTo({
//       url: '../chooseLib/chooseLib',
//     })
//     return
//   }

//   // 获取用户信息
//   wx.getSetting({
//     success: res => {
//       if (res.authSetting['scope.userInfo']) {
//         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//         wx.getUserInfo({
//           success: res => {
//             this.setData({
//               avatarUrl: res.userInfo.avatarUrl,
//               userInfo: res.userInfo
//             })
//           }
//         })
//       }
//     }
//   })
// },

// onGetUserInfo: function(e) {
//   if (!this.logged && e.detail.userInfo) {
//     this.setData({
//       logged: true,
//       avatarUrl: e.detail.userInfo.avatarUrl,
//       userInfo: e.detail.userInfo
//     })
//   }
// },

// onGetOpenid: function() {
//   // 调用云函数
//   wx.cloud.callFunction({
//     name: 'login',
//     data: {},
//     success: res => {
//       console.log('[云函数] [login] user openid: ', res.result.openid)
//       app.globalData.openid = res.result.openid
//       wx.navigateTo({
//         url: '../userConsole/userConsole',
//       })
//     },
//     fail: err => {
//       console.error('[云函数] [login] 调用失败', err)
//       wx.navigateTo({
//         url: '../deployFunctions/deployFunctions',
//       })
//     }
//   })
// },

// // 上传图片
// doUpload: function () {
//   // 选择图片
//   wx.chooseImage({
//     count: 1,
//     sizeType: ['compressed'],
//     sourceType: ['album', 'camera'],
//     success: function (res) {

//       wx.showLoading({
//         title: '上传中',
//       })

//       const filePath = res.tempFilePaths[0]

//       // 上传图片
//       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
//       wx.cloud.uploadFile({
//         cloudPath,
//         filePath,
//         success: res => {
//           console.log('[上传文件] 成功：', res)

//           app.globalData.fileID = res.fileID
//           app.globalData.cloudPath = cloudPath
//           app.globalData.imagePath = filePath

//           wx.navigateTo({
//             url: '../storageConsole/storageConsole'
//           })
//         },
//         fail: e => {
//           console.error('[上传文件] 失败：', e)
//           wx.showToast({
//             icon: 'none',
//             title: '上传失败',
//           })
//         },
//         complete: () => {
//           wx.hideLoading()
//         }
//       })

//     },
//     fail: e => {
//       console.error(e)
//     }
//   })
// },

// })