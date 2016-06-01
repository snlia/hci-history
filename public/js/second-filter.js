/*
 * 该文件包含了二层聚类相关的所有函数
 */

//求abs
function abs (x) {if (x < 0) return -x; return x;}

//his信息的去重以及去掉所有title为空的信息
function nub (data) {
    data.sort (function (a, b) {
            return a['title'] < b['title'];
    });
    var tmp;
    if (data[0]['title'] == "") tmp = [];
    else tmp = [data[0]];
    for (var i = 1, len = data.length; i < len; ++i) if (data[i]['title'] != ""){
        if (data[i] != data[i - 1]) {
            tmp.push (data[i]);
        }
    }
    return tmp;
}

//对标题信息进行修正，去掉后缀信息以及开头信息
function get_body (str) {
    str = str.replace(/(.*)- Powered by .*$/, '$1'); // remove the ending such like Powered by discuz! 
    str = str.replace(/(.*)_.*$/, '$1'); // remove the ending info such like '_百度搜索'
    str = str.replace(/(.*) - .*$/, '$1'); // remove the ending info such like ' - 必应'
    str = str.replace(/^【.*?】(.*?)/, '$1'); // remove the leading info such like 【图】
    str = str.replace(/ +$/, ''); // remove all ending space
    return str;
}

function isSpace (ch) {return ch == ' ';} // 判断是否为空格
function isNum (ch) {return (ch <= '9') && (ch >= '0');} // 判断是否为数字
function isChar (ch) {return ((ch <= 'z') && (ch >= 'a')) || ((ch <= 'Z') && (ch >= 'A'));} // 判断是否为字母

//从str中的index开始获得num个word，一个word为一串数字，一串字母或者一个中文或者一个标点，空格不计入word
function get_words (str, index, num) {
    var now = index;
    var len = str.length;
    var res = '';
    var i;
    for (i = 0; i < num; ++i) {
        //贪心读取所有前导空格
        if (isSpace (str[now])) {
            for (; (now < len) && (isSpace(str[now])); ++now) res += str[now];
        }
        if (now == len) break;
        //如果当前位为数字，则读取一串数字
        if (isNum (str[now])) {
            for (; (now < len) && (isNum(str[now])); ++now) res += str[now];
        }
        //如果当前位为字母，则读取一串字母
        else if (isChar (str[now])) {
            for (; (now < len) && (isChar(str[now])); ++now) res += str[now];
        }
        //其他情况，为中文或者标点，读取一位
        else {
            res += str[now];
            ++now;
        }
        if (now == len) break;
    }
    return res;
}

//计算下一个word的起始位置
function next_word (str, index) {
    var now = index;
    var len = str.length;
    if (isSpace (str[now])) {
        for (; (now < len) && (isSpace(str[now])); ++now);
    }

    if (isNum (str[now])) {
        for (; (now < len) && (isNum(str[now])); ++now);
    }
    else if (isChar (str[now])) {
        for (; (now < len) && (isChar(str[now])); ++now);
    }
    else {
        ++now;
    }
    return now;
}

//计算str从index位开始还有多少个words
function max_words (str, index) {
    var now = index;
    var len = str.length;
    var i;
    for (i = 0; i < 1000; ++i) {
        if (isSpace (str[now])) {
            for (; (now < len) && (isSpace(str[now])); ++now);
        }
        if (isNum (str[now])) {
            for (; (now < len) && (isNum(str[now])); ++now);
        }
        else if (isChar (str[now])) {
            for (; (now < len) && (isChar(str[now])); ++now);
        }
        else {
            ++now;
        }
        if (now == len) break;
    }
    return i + 1;
}

function second_filter (data) {
    data = nub (data)
    T = {};
    for (var i = 0, len = data.length; i < len; ++i) {
        var str = get_body (data[i]['title']);
        for (var j = 0, Len = str.length; j < Len; j = next_word (str, j)) {
            for (var k = max_words (str, j); k > 2; --k) {
                var stt = get_words (str, j, k);
                if (T.hasOwnProperty (stt))
                    T[stt] += 1;
                else T[stt] = 1;
            }
        }
    }
    var prex = 0;
    var prestr = '';
    var all = 0;
    var tmp = [];
    for (var str in T) {
        if (T[str] >= 5 && T[str] <= 30) {
            if (abs(T[str] - prex) > 5 || (prestr.indexOf (str) == -1)){
                prestr = str;
                prex = T[str]; 
                tmp.push ({'title' : prestr, 'x' : prex});
            }
        }
    }
    cluster2 = [];
    for (var i = 0, len = tmp.length; i < len; ++i) {
        var flag = 1;
        var str = tmp[i]['title'];
        for (var j = 0; j < len; ++j) if (i != j) {
            if (abs (tmp[j]['x'] - tmp[i]['x'] <= 5) && tmp[j]['title'].indexOf(str) != -1) {
                flag = 0; break;
            }
        }
        if (flag) cluster2.push (tmp[i]);
    }
    for (var i = 0, len = cluster2.length; i < len; ++i) {
        console.log (cluster2[i]['title'], cluster2[i]['x']);
    }
    console.log (cluster2.length);
}
