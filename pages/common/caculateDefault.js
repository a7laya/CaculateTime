! function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.caculateDefault = factory();
    }
}(typeof window !== 'undefined' ? window : this, function () {
    // 计算结果等于或者约等于，约等于是四舍五入保留两位小数的计算结果。
    let equal_sign = "="
    // 错误提示信息
    let error_string = "..."


    /**
     *没有括号的多个操作数计算，形如1:20+2:20x3.2...
     *@param     {string}  val     没有括号表达式
     *@return    {string}  res     计算结果
     */
    let some_actor = function (val) {
        // 先乘除
        // 中间的操作不需要操作数前的符号，不然造成的结果可能3-3x-2 相乘后失去符号---> 36
        let reg = /(\d+)([.]?)(\d*)([x/]-?)(\d+)([.]?)(\d*)/;
        // 需要考虑第一个数前就带有负号
        let reg2 = /^(-)(\d+)([.]?)(\d*)([x/]-?)(\d+)([.]?)(\d*)/;
        let index = null;
        let l_part = null;
        let m_part = null;
        let r_part = null;
        let res = error_string;

        let is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);

        while (is_match) {
            index = is_match["index"];
            l_part = val.substring(0, index);
            m_part = is_match[0];
            r_part = val.substring(index + m_part.length, val.length);

            m_part = two_actor(m_part);
            if (error_string == m_part) {
                return error_string;
            }

            val = l_part + m_part + r_part;
            val = val.replace("---", "-");
            val = val.replace("+--", "+");

            is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);
        }
        let is_match1 = is_match;

        // 后加减
        reg = /(\d+)([.]?)(\d*)([+-]-?)(\d+)([.]?)(\d*)/;
        reg2 = /^(-)(\d+)([.]?)(\d*)([+-]-?)(\d+)([.]?)(\d*)/;
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
            m_part = two_actor(m_part);
            if (error_string == m_part) {
                return error_string;
            }
            val = l_part + m_part + r_part;
            val = val.replace("---", "-");
            val = val.replace("+--", "+");

            is_match = val.match(reg2) ? val.match(reg2) : val.match(reg);
        }


        reg = /^(-?)(\d+)([.]?)(\d*)$/g;

        return (reg.test(val)) ? val : error_string;
    };

    /**
     *没有括号的两个操作数计算，形如1:20+2:20
     *@param     {string}  val     没有括号表达式
     *@return    {string}  res     计算结果
     */
    let two_actor = function (val) {
        let regdotdot = /^(-?)(\d+)([.]?)(\d*)([+-x/]-?)(\d+)([.]?)(\d*)$/g;

        let res = error_string;
        // ..
        let is_match_regdotdot = regdotdot.test(val);

        let prefix;
        let operator;
        let LH;
        let RH;
        let SLM;
        let LM;
        let SRM;
        let RM;
        let H;
        let M;
        let LML;
        let RML;

        let sign_and_operator;

        if (is_match_regdotdot) {
            prefix = RegExp.$1;
            operator = RegExp.$5;

            LH = RegExp.$2;
            RH = RegExp.$6;

            SLM = RegExp.$4;
            LML = SLM.length;
            LM = Number("0." + SLM);

            SRM = RegExp.$8;
            RML = SRM.length;

            RM = Number("0." + SRM);

            H = 0;
            M = 0;

            sign_and_operator = ('' == prefix) ? operator : (prefix + "," + operator);
        }


        switch (sign_and_operator) {
            // 加+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            case "+":
            case "--":
            case "-,-":
            case "-,+-":

                res = (Number(LH + "." + SLM) * 1000000 + Number(RH + "." + SRM) * 1000000) / 1000000;

                if (("-,-" == sign_and_operator || "-,+-" == sign_and_operator) && "false" != res) {
                    res = "-" + res;
                }

                break;
                // 减-------------------------------------------------------------------------
            case "-":
            case "+-":
            case "-,+":
            case "-,--":

                res = (Number(LH + "." + SLM) * 1000000 - Number(RH + "." + SRM) * 1000000) / 1000000

                if (("-,+" == sign_and_operator || "-,--" == sign_and_operator) && "false" != res) {
                    // 正负反转
                    res = (0 > res) ? Math.abs(res) : ("-" + res);
                }

                break;
                // 乘xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            case "x-":
            case "x":
            case "-,x":
            case "-,x-":

                if (LML + RML < 15) {
                    res = (Number(LH + SLM) * Number(RH + SRM)) / Math.pow(10, LML + RML);
                } else {
                    res = ((Number(LH + "." + SLM) * 1000) * (Number(RH + "." + SRM) * 1000)) / 1000000;
                }

                if (("x-" == sign_and_operator || "-,x" == sign_and_operator) && error_string != res) {
                    res = '-' + res;
                }
                break;
                // 除/////////////////////////////////////////////////////////////////////////////////////
            case "/-":
            case "/":
            case "-,/":
            case "-,/-":

                res = (Number(LH + SLM) / Number(RH + SRM)) / Math.pow(10, LML - RML);
                // res = (Number(LH + "." + SLM)*1000000)/(Number(RH + "." + SRM)*1000000);                          

                if ("/-" == sign_and_operator || "-,/" == sign_and_operator) {
                    res = '-' + res;
                }
                break;


            default:
                res = error_string;
                break;
        }


        return res;
    }

    /**
     *包括括号的多个操作数计算，形如（1.20+2.205）x3.2...，先括号后乘除再加减
     *@param     {string}  val                   可以包含括号表达式
     *@return    {array}  [equal_sign,res]      等于或者约等于，计算结果
     */
    return (function (val) {
        val = val.replace(/\÷/g, '/');
        val = val.replace(/\×/g, 'x');

        let reg = /\([^(]*?\)/;
        let index = null;
        let l_part = null;
        let m_part = null;
        let r_part = null;
        let res = error_string;
        equal_sign = "=";


        let is_match = val.match(reg);
        // console.log("is_match:",is_match);
        // 先去括号
        while (is_match) {
            index = is_match["index"];
            l_part = val.substring(0, index);
            m_part = is_match[0];
            r_part = val.substring(index + m_part.length, val.length);
            m_part = m_part.substring(1, m_part.length - 1);

            m_part = some_actor(m_part);
            if (error_string == m_part) {
                return error_string;
            }
            val = l_part + m_part + r_part;
            is_match = val.match(reg);
        }

        // 最后计算
        val = some_actor(val);
        reg = /^(-?)(\d+)([:.]?)(\d*)$/g;
        return (reg.test(val)) ? [equal_sign, val] : [equal_sign, error_string];
    })
})