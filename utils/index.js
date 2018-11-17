
    function jiexi(str, id) {
        var newStr = str.split(',');
        var arr = [];
        for (var i in newStr) {
            var myObj = newStr[i].split('-');
            arr.push(myObj);
        }
        for (var j in arr) {
            if (arr[j].indexOf(id) != -1) {
                return arr[j][1];
            }
        }
    };
    function minMax (str){
        return str = str.split('-').sort();
    };
    function qishu(str){
        var newStr = str.split(',');
        var arr = [];
        for (var i in newStr) {
            arr.push(newStr[i].split('-'));
        }
        for (var i in arr) {
            arr[i].splice(1, 1);
        }
        return [].concat.apply([], arr);
    };
    //加法  function
    function accAdd(num1, num2){
        var baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    };
    // 乘法运算
    function numMulti(num1, num2) {
        var baseNum = 0;
        try {
            baseNum += num1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            baseNum += num2.toString().split(".")[1].length;
        } catch (e) {
        }
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
    };
    function accDivCoupon(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }
    module.exports = { jiexi, minMax, qishu,accAdd,numMulti,accDivCoupon}