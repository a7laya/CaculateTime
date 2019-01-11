//index.js
const app = getApp()
const params = {
  data: {
    msg: 'hello！！', // 测试用的，可以忽略
    text: '', // 主屏幕字符串绑定到data.text
    result: '',
    screenClass: '',
  },

  onShareAppMessage() {
    return {
      title: '万能计算器',
      desc: '万能计算器',
      path: '/page/index/index'
    };
  },


  /* ***************************************************************************
   * function: 立即运算
   * author: lzb
   * date: 2019-1-7
   * description: 计算算式str并更新到屏幕结果;
   * ****************************************************************************/
  cal_promptly(str) {
    // console.log(str,' len:',str.length)
    // 根据str长度调整屏幕显示的字体大小
    if (str.length > 60) {
      this.setData({
        screenClass: 'screen-fontsize-s',
      });
    }
    if (str.length > 30 && str.length < 60) {
      this.setData({
        screenClass: 'screen-fontsize-m',
      });
    }
    if (str.length < 30) {
      this.setData({
        screenClass: 'screen-fontsize-l',
      });
    }
    // 对str进行预处理 start=========================================
    // case 1.如果str不是以数字或")"结尾，则砍掉最后一个字符
    if (/[^01234567890)]$/g.test(str))
      str = this.data.text.substring(0, this.data.text.length - 1);
    // case 2.如果在运算中出现单个整数与带":"数之间的运算 则进行相应转换，例如 3+3:50+4-7 => 3:00+3:50+4:00-7:00
    if (/:/g.test(str))
      // str = str.replace(/((?:\+|\-)\d+)(?!:)/g, '$1:00').replace(/^(\d+)(\+|\-)/g, '$1:00$2');
      str = str.replace(/((?:\+|\-)\d+)(?![.|:|\d:])/g, '$1:00').replace(/^(\d+)(\+|\-)/g, '$1:00$2');
    // case 3.如果str出现一位小数(eg:1+3.2+5.3)则解析为1+3.20+5.30
    if (/[\.\:](\d)(?!\d)/g.test(str))
      str = str.replace(/([\.\:]\d)(?!\d)/g, '$10');

    // case 4. 将 3(1+2) 解析成 3×(1+2)
    if (/\d(\()/g.test(str)) {
      str = str.replace(/(\d)(?:\()/g, '$1×(');
      this.setData({
        text: str,
      });
    };
    console.log(str, ' len:', str.length)


    // 对str进行预处理 end==========================================

    // 将处理好的str传入核心计算逻辑得到数组res res[0] 是表示=或≈，res[1]表示结果
    let res = CaculateTime.caculate_time(str);
    // 对结果进行判断
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
          result: '有点问题',
        })
    }
  },

  /*---------------------------------------------------------
  *--输出数字到主屏幕(这里需要考虑到一下几种情况)---------------
  * case 1. 判断不生效情况 直接return（str以.12或:12结尾 不生效 只保留两位小数） 
  * case 2. ":"后面输入6-9无效
  * case 3. str最后一个字符是'0'，且‘0’前面没有数字或者小数点（.:），则输入的数字直接覆盖0；（0，-0， +0）
  -----------------------------------------------------------*/
  input_num(event) {
    // console.log(event.currentTarget.dataset.num);
    // 获取绑定该方法dom的dataset数据num，也就是计算器上的按键
    let num = event.currentTarget.dataset.num;
    // 获取输入到主屏幕的字符串
    let str = this.data.text;
    // case 1.
    if (/(\.|:)\d{2}$/.test(str)) return;
    // case 2.
    if (/:$/.test(str) && /[6-9]/g.test(num)) return;
    // case 3.
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
    if (str == '' && cal !== '-') return; // 屏幕空 不生效 负数除外
    if (/\+$/g.test(str) && cal == '+') return; // 最后一个运算符和要输入的运算符一样 不生效
    if (/-$/g.test(str) && cal == '-') return; // 同上
    if (/×$/g.test(str) && cal == '×') return; // 同上
    if (/÷$/g.test(str) && cal == '÷') return; // 同上
    if (/(\+|-|×|÷)$/g.test(str)) { // 最后一个是运算符 覆盖之
      let str = this.data.text.substring(0, this.data.text.length - 1); // 删除最后一个字符
      this.setData({
        text: str + cal, // 将输入的运算符加上
      });
      return;
    };
    this.setData({
      text: str + cal,
    });
  },

  /*---------------------------------------------------------
  *--输出“:”到主屏幕(这里需要考虑到一下几种情况)---------------
  * case 1. 遇到不以类似于2:12形式结尾的str，才加“:”
  * case 2. 屏幕str为空，或“:”输入之前是运算符“+-×÷”，则“:”前补0
  * case 3. 屏幕str最后1位为"."，则“:”覆盖之
  -----------------------------------------------------------*/
  input_2dot(event) {
    let str = this.data.text;
    // case 1.
    if (!/\d*:\d*$/g.test(str) && !/\)$/g.test(str)) {
      // case 2. 
      if (str === '' || /(\+|\-|×|÷|\()$/g.test(str)) str = str + '0';
      // case 3.
      if (/\.$/g.test(str)) str = str.substring(0, str.length - 1);
      this.setData({
        text: str + ':',
      })

    }
  },
  input_dot(event) {
    let str = this.data.text;
    // case 1.
    if (!/\d*\.\d*$/g.test(str) && !/\)$/g.test(str)) {
      // case 2. 
      if (str === '' || /(\+|\-|×|÷|\()$/g.test(str)) str = str + '0';
      // case 3.
      if (/\:$/g.test(str)) str = str.substring(0, str.length - 1);
      this.setData({
        text: str + '.',
      })
    }
  },



  // 清除全部，并保存到历史记录 *************************************************
  func_all_clear(event) {
    // 清除全部
    this.setData({
      text: '',
      result: '',
    });

    // 保存到历史记录
    // TO DO........
  },

  // 左括号( *****************************************************************
  input_left(event) {
    let str = this.data.text;
    let cal = event.currentTarget.dataset.cal;
    this.setData({
      text: str + cal,
    });

  },

  // 右括号) *****************************************************************
  input_right(event) {
    let str = this.data.text;
    let cal = event.currentTarget.dataset.cal;
    // 失效情况====================================
    // case 1. str为空 -----
    if (str == '') return;
    // case 2. str中无左括号
    // case 3. str中左右括号的数量一样 ------
    let [l, r] = [str.match(/\(/g), str.match(/\)/g)];
    l ? l = l.length : l = 0;
    r ? r = r.length : r = 0;
    if (l === r) str = '(' + str;

    this.setData({
      text: str + cal,
    });
    // 右括号比左括号多了个即时运算的逻辑
    this.cal_promptly(str + cal);
  },

  // 退格键********************************************************************
  func_back_space(event) {
    let str = this.data.text;
    if (/^\([^\(]*\)$/g.test(str)) str = str.substring(1, str.length);
    str = str.substring(0, str.length - 1);
    this.setData({
      text: str,
    });
    // 即时运算
    this.cal_promptly(str);
  },


}
Page(params)



/* ***************************************************************************
 * function: 计算器的主体逻辑
 * author: 老魏
 * date: 2019-1-7
 * params：string: str
 * description: 调用CaculateTime.caculate_time(str), 返回数组['=|~', ‘运算结果’];
 * ****************************************************************************/
let CaculateTime = {

  // 计算结果等于或者约等于，约等于是四舍五入保留两位小数的计算结果。
  equal_sign: "="
    // 错误提示信息
    ,
  error_string: "..."

    /**
     *包括括号的多个操作数计算，形如（1:20+2:20）x3.2...，先括号后乘除再加减
     *@param     {string}  val                   可以包含括号表达式,时间必须包含小时和分钟，
     *                                           数小数位不能超过3位，形如2，2.2，2.02
     * 
     *@return    {array}  [equal_sign,res]       等于或者约等于，计算结果
     */
    ,
  caculate_time: function(val) {
      val = val.replace(/\÷/g, '/');
      val = val.replace(/\×/g, 'x');

      let reg = /\([^(]*?\)/;
      let index = null;
      let l_part = null;
      let m_part = null;
      let r_part = null;
      let res = this.error_string;
      this.equal_sign = "=";


      let is_match = val.match(reg);
      // console.log("is_match:",is_match);
      // 先去括号
      while (is_match) {
        index = is_match["index"];
        l_part = val.substring(0, index);
        m_part = is_match[0];
        r_part = val.substring(index + m_part.length, val.length);
        m_part = m_part.substring(1, m_part.length - 1);

        m_part = this.some_actor(m_part);
        if (this.error_string == m_part) {
          return this.error_string;
        }
        val = l_part + m_part + r_part;
        is_match = val.match(reg);
      }

      // 最后计算
      val = this.some_actor(val);

      reg = /^(-?)(\d+)([:.]?)([0-9]?[0-9]?)$/g;
      if (reg.test(val)) {
        if (".00" == val.substring(val.length - 3, val.length)) {
          val = val.substring(0, val.length - 3)
        }
        return [this.equal_sign, val];
      } else {
        return [this.equal_sign, this.error_string];
      }

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
      let reg = /(\d+)([:.]?)([0-9]?[0-9]?)([x/]-?)(\d+)([:.]?)([0-9]?[0-9]?)/;
      // 需要考虑第一个数前就带有负号
      let reg2 = /^(-)(\d+)([:.]?)([0-9]?[0-9]?)([x/]-?)(\d+)([:.]?)([0-9]?[0-9]?)/;
      let index = null;
      let l_part = null;
      let m_part = null;
      let r_part = null;
      let res = this.error_string;

      let is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);

      while (is_match) {
        index = is_match["index"];
        l_part = val.substring(0, index);
        m_part = is_match[0];
        r_part = val.substring(index + m_part.length, val.length);

        m_part = this.two_actor(m_part);
        if (this.error_string == m_part) {
          return this.error_string;
        }

        val = l_part + m_part + r_part;
        val = val.replace("---", "-");
        val = val.replace("+--", "+");

        is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);
      }
      let is_match1 = is_match;

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
        if (this.error_string == m_part) {
          return this.error_string;
        }
        val = l_part + m_part + r_part;
        val = val.replace("---", "-");
        val = val.replace("+--", "+");

        is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);
      }


      reg = /^(-?)(\d+)([:.]?)([0-9]?[0-9]?)$/g;

      return (reg.test(val)) ? val : this.error_string;
    }

    /**
     *没有括号的两个操作数计算，形如1:20+2:20
     *@param     {string}  val     没有括号表达式
     *@return    {string}  res     计算结果
     */
    ,
  two_actor: function(val) {
      let regcolcol = /^(-?)(\d+)(:)([0-5][0-9])([+-/]-?)(\d+)(:)([0-5][0-9])$/g;
      // let reg2 = /^[\s\S]*:[6-9][\s\S]*/;
      let regcoldot = /^(-?)(\d+)(:)([0-5][0-9])([x/]-?)(\d+)([.]?)([0-9]?[0-9]?)$/g;
      let regdotcol = /^(-?)(\d+)([.]?)([0-9]?[0-9]?)([x/]-?)(\d+)(:)([0-5][0-9])$/g;
      let regdotdot = /^(-?)(\d+)([.]?)([0-9]?[0-9]?)([+-x/]-?)(\d+)([.]?)([0-9]?[0-9]?)$/g;

      let res = this.error_string;
      // ::
      let is_match_regcolcol = regcolcol.test(val);
      // :.
      let is_match_regcoldot = regcoldot.test(val);
      // .:
      let is_match_regdotcol = regdotcol.test(val);
      // ..
      let is_match_regdotdot = regdotdot.test(val);

      // 符号-或者无
      let prefix;
      // 操作符如+，+-..
      let operator;
      // 左边小时位置或整数
      let LH;
      // 右边小时位置或整数
      let RH;
      // 字符串形式左分钟数或小数
      let SLM;
      // 左分钟数或小数
      let LM;
      // 字符串形式右分钟数或小数               
      let SRM;
      // 右分钟数或小数
      let RM;
      // 结果小时数或整数
      let H;
      // 结果分钟数或小数
      let M;
      // 符号与操作符
      let sign_and_operator;

      if (is_match_regcolcol || is_match_regcoldot || is_match_regdotcol || is_match_regdotdot) {
        prefix = RegExp.$1;
        operator = RegExp.$5;

        LH = Number(RegExp.$2);
        RH = Number(RegExp.$6);

        SLM = RegExp.$4;
        LM = ('' == SLM) ? "00" : SLM;
        LM = (1 == SLM.length) ? (SLM + "0") : SLM;
        LM = Number(LM);

        SRM = RegExp.$8;
        RM = ('' == SRM) ? "00" : SRM;
        RM = (1 == SRM.length) ? (SRM + "0") : SRM;
        RM = Number(RM);

        H = 0;
        M = 0;

        sign_and_operator = ('' == prefix) ? operator : (prefix + "," + operator);
      }

      if (is_match_regcolcol) {
        switch (sign_and_operator) {
          // 加+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          case "+":
          case "--":
          case "-,-":
          case "-,+-":
            H = LH + RH;
            M = LM + RM;

            H = H + ((M > 59) ? 1 : 0);
            M = (M > 59) ? (M - 60) : M;
            M = (M > 9) ? M : ("0" + M);

            res = H + ":" + M;

            if ("-,-" == sign_and_operator || "-,+-" == sign_and_operator) {
              res = "-" + res;
            }

            break;
            // 减-------------------------------------------------------------------------
          case "-":
          case "+-":
          case "-,+":
          case "-,--":

            if ((LH * 60 + LM) >= (RH * 60 + RM)) {
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

            if ("-,+" == sign_and_operator || "-,--" == sign_and_operator) {
              // 正负反转
              res = ("-" == res[0]) ? res.substring(1, res.length) : ("-" + res);
            }

            break;
            // 乘xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

            // 除/////////////////////////////////////////////////////////////////////////////////////
          case "/-":
          case "/":
          case "-,/":
          case "-,/-":

            M = (LH * 60 + LM) / (RH * 60 + RM);
            H = this.get_round(M, true);
            res = H;

            if ("/-" == sign_and_operator || "-,/" == sign_and_operator) {
              res = '-' + res;
            }
            break;

          default:
            res = this.error_string;
            break;
        }

      } else if (is_match_regcoldot) {
        switch (sign_and_operator) {
          // 加+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

          // 减-------------------------------------------------------------------------

          // 乘xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          // 时间乘于数在这里认为是时间乘于速度
          case "x-":
          case "x":
          case "-,x":
          case "-,x-":

            M = ((LH * 60 + LM) * (Number(RH + "." + SRM) * 100)) / 100;
            M = this.get_round(M, false);

            H = (M - M % 60) / 60;
            M = this.get_round((M % 60) * 100 / 60, false);

            M = (M > 9) ? M : ("0" + M);
            res = H + "." + M;

            if ("x-" == sign_and_operator || "-,x" == sign_and_operator) {
              res = '-' + res;
            }
            break;
            // 除////////////////////////////////////////////////////////////////////////////
            // 时间除于数在这里认为是分割时间
          case "/-":
          case "/":
          case "-,/":
          case "-,/-":

            M = ((LH * 60 + LM) * 100) / (Number(RH + "." + SRM) * 100);
            M = this.get_round(M, false);
            H = M;
            M = M % 60;
            H = (H - M) / 60;
            M = (M > 9) ? M : ("0" + M);
            res = H + ":" + M;

            if ("/-" == sign_and_operator || "-,/" == sign_and_operator) {
              res = '-' + res;
            }
            break;

          default:
            res = this.error_string;
            break;
        }

      } else if (is_match_regdotcol) {
        switch (sign_and_operator) {
          // 加+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

          // 减-------------------------------------------------------------------------

          // 乘xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          // 数乘于时间在这里认为是速度乘于时间
          case "x-":
          case "x":
          case "-,x":
          case "-,x-":

            M = ((Number(LH + "." + SLM) * 100) * (RH * 60 + RM)) / 100;
            M = this.get_round(M, false);

            H = (M - M % 60) / 60;
            M = this.get_round((M % 60) * 100 / 60, false);

            M = (M > 9) ? M : ("0" + M);
            res = H + "." + M;

            if ("x-" == sign_and_operator || "-,x" == sign_and_operator) {
              res = '-' + res;
            }
            break;
            // 除//////////////////////////////////////////////////////////////////////////
            // 数除于时间这里认为是计算速度
          case "/-":
          case "/":
          case "-,/":
          case "-,/-":

            M = (Number(LH + "." + SLM) * 600) / (RH * 600 + RM * 10);
            H = this.get_round(M, true);
            res = H;

            if ("/-" == sign_and_operator || "-,/" == sign_and_operator) {
              res = '-' + res;
            }
            break;


          default:
            res = this.error_string;
            break;
        }

      } else if (is_match_regdotdot) {
        switch (sign_and_operator) {
          // 加+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          case "+":
          case "--":
          case "-,-":
          case "-,+-":
            H = LH + RH;
            M = LM + RM;

            H = H + ((M > 99) ? 1 : 0);
            M = (M > 99) ? (M - 100) : M;
            M = (M > 9) ? M : ("0" + M);

            res = H + "." + M;
            // res = (Number(LH + "." + SLM)*100 + Number(RH + "." + SRM)*100)/100                            

            if ("-,-" == sign_and_operator || "-,+-" == sign_and_operator) {
              res = "-" + res;
            }

            break;
            // 减-------------------------------------------------------------------------
          case "-":
          case "+-":
          case "-,+":
          case "-,--":

            if ((LH * 100 + LM) >= (RH * 100 + RM)) {
              H = (LM >= RM) ? (LH - RH) : (LH - RH - 1);
              M = (LM >= RM) ? (LM - RM) : (LM - RM + 100);
              M = (M > 9) ? M : ("0" + M);
              res = H + "." + M;
            } else {
              H = (RM >= LM) ? (RH - LH) : (RH - LH - 1);
              M = (RM >= LM) ? (RM - LM) : (RM - LM + 100);
              M = (M > 9) ? M : ("0" + M);
              res = "-" + H + "." + M;
            }
            // res = (Number(LH + "." + SLM)*100 - Number(RH + "." + SRM)*100)/100

            if ("-,+" == sign_and_operator || "-,--" == sign_and_operator) {
              // 正负反转
              res = ("-" == res[0]) ? res.substring(1, res.length) : ("-" + res);
            }

            break;
            // 乘xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          case "x-":
          case "x":
          case "-,x":
          case "-,x-":
            // 化成整数相乘，避免3.2x6≈19.2这样的情况
            M = ((Number(LH + "." + SLM) * 100) * (Number(RH + "." + SRM) * 100)) / 10000;
            res = this.get_round(M, true);

            if ("x-" == sign_and_operator || "-,x" == sign_and_operator) {
              res = '-' + res;
            }
            break;
            // 除/////////////////////////////////////////////////////////////////////////////////////
          case "/-":
          case "/":
          case "-,/":
          case "-,/-":

            M = (Number(LH + "." + SLM) * 100) / (Number(RH + "." + SRM) * 100);
            res = this.get_round(M, true);

            if ("/-" == sign_and_operator || "-,/" == sign_and_operator) {
              res = '-' + res;
            }
            break;


          default:
            res = this.error_string;
            break;
        }

      } else {
        // console.log("not match");
        res = this.error_string;
      }

      return res;
    }

    ,
  get_round(M, offset) {
    let T = offset ? Math.round(M * 100) / 100 : Math.round(M);

    if (T != M) {
      this.equal_sign = "≈";
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