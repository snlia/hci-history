/* 
 * 本文件包含了关于页面初始化的函数，相关全局变量定义请在data.js中查阅
 */
function setCookie(c_name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = c_name + "=" + value + ";expires=" + exp.toGMTString();
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return document.cookie.substring(c_start, c_end);
        }
    }
    return "";
}

$(document).ready(function () {
        chrome.storage.local.get('cluster',function (result) {
                cluster1 = result.cluster;
                chrome.storage.local.get('typeID',function (result) {
                        typeid = result.typeID;
                        second_filter(cluster1[typeid]);
                        init_page(typeid);
                });
        });
});

//返回a,b中较小值
function min (a, b) {
    if (a > b) return b;
    return a;
}

//为每个tooltips类设置hide行为，即一开始隐藏hint的信息
$(document).ready(function(){
        $(function () { $('.tooltips').tooltip('hide');})
})

//为数字补前导零
function fillzero (num) {
    var res = String (num);
    if (res.length == 1) return '0' + res;
    return res;
}

//将系统时间转为显示的string
function shijian_chuli(time) {
    var y = 2016;
    var yue;
    var ri;
    var h;
    var Min;
    time -= 1000*60*60*24*12;
    time %=1000*60*60*24*365;
    if(Math.ceil(time/(1000*60*60*24))<=31) {
        yue = 1;ri=Math.ceil(time/(1000*60*60*24));time%=(1000*60*60*24);
    }
    else if(Math.ceil(time/(1000*60*60*24))<=(31+28)) {
        yue = 2;ri=Math.ceil(time/(1000*60*60*24))-31;time%=(1000*60*60*24);
    }
    else if(Math.ceil(time/(1000*60*60*24))<=(31+28+31)) {
        yue = 3;ri=Math.ceil((time/(1000*60*60*24)))-31-28;time%=(1000*60*60*24);
    }
    else if(Math.ceil(time/(1000*60*60*24))<=(31+28+31+30)) {
        yue = 4;ri=Math.ceil(time/(1000*60*60*24))-31-28-31;time%=(1000*60*60*24);
    }
    else if(Math.ceil(time/(1000*60*60*24))<=(31+28+31+30+31)) {
        yue = 5;ri=Math.ceil(time/(1000*60*60*24))-31-28-31-30;time%=(1000*60*60*24);
    }
    else {
        yue =6;ri=Math.ceil(time/(1000*60*60*24))-31-28-31-30-31;time%=(1000*60*60*24);
    }
    h = Math.ceil(time/(1000*60*60));time %=(1000*60*60);
    Min = Math.ceil(time/(1000*60));
    return '<font size="2" color="grey">'+ y + '/'+ fillzero (yue) + '/' + fillzero (ri) + '  ' + fillzero (h) + ':' + fillzero (Min) + '</font>';
}

/*
 * 该函数为将url_list的信息转化为每个tag页面信息，并保存到info_list和maxpage里面的函数
 * 每个info_list的格式为：
 * <table class="table table-striped table-hover">
 * <tbody>
 * <tr><td> <a href='url'>title<a><span class="badge pull-right">time</span></td>
 * ...
 * <tr><td> <a href='url'>title<a><span class="badge pull-right">time</span></td>
 * </tbody>
 * </table>
 *
 * 其中url为网页网址，title为网页标题，time为访问次数
 */

function get_init () {
    var temp_time;
    if (url_list[0].length == 0) {
        info_list[0] = '<h4>次分类下并无网页！</h4>'
        return ;
    }
    for (var i = 0, len = url_list.length; i < len; ++i) {
        info_list[i] = '<table class=\"table table-striped table-hover\">';
        info_list[i] += '<tbody>'
        for (var j = 0, Len = url_list[i].length; j < Len; ++j) 
        if (url_list[i][j].title.length) {
            temp_time = shijian_chuli(url_list[i][j].lastVisitTime);
            info_list[i] += '<tr>';
            info_list[i] +='<td id="aaaaaa_' + i + '_'+ j + '"><a>' + url_list[i][j].title + '</a><span class="pull-right">'+ temp_time+ '</span></td>';
            info_list[i] += '</tr>';
        }
        info_list[i] += '</tbody>'
        info_list[i] += '</table>';
    }

}
var A = [];
/*
 * 显示页面的函数，传入参数tid(默认值为0)，显示导航栏最左边的tag为第tid个tag并打开的界面
 */
function show_page (tid) {
    var tid = arguments[0] ? arguments[0] : 0; //设置tid默认值为0
    //    second_filter (his); //调试用，效果为对../data/history.js里面的url信息进行二层聚类处理并输出聚类结果到console中。
    get_init (); //初始化info_list
    $('#' + nowhome).html (get_info (tid));
    if (nowhome.search ("tmp") == 0)
        $('#home').html ('');
    else 
        $('#tmphome').html ('');
    nowid = tid;
    nowpage = tid;
    add_tab_event ();
    set_page ();

}

/*
 * 初始化页面的函数，传入参数为第几类，默认值为0
 * init_page会根据cluster_list添加侧边栏，并且调用show_page进行后续初始化
 */
function init_page (tid) {
    var tid = arguments[0] ? arguments[0] : 0; //设置tid默认值为0
    var str = '';
    str += '<ul class="nav nav-list bs-docs-sidenav affix">';
    for (var i = 0, len = cluster_list.length; i < len; ++i) {
        str += '<li><a class="clustertab">'+cluster_list[i]+'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a></li>';
    }
    str += '<li><a href="../../Level1/index.html" id="returnback"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>返回<a>';//TODO:请在TOADD处填写返回地址
    str += '</ul>';
    $('#leftnav').html (str);
    $($('#leftnav').find('li')[tid]).attr ('class', 'active');
    show_page ();

    $('.clustertab').click ( function () {
            var nowtab = ($('.clustertab').index (this));
            console.log (nowtab);
            for (var i = 0, len = cluster_list.length; i < len; ++i) {
                if (i == nowtab)
                    $($('#leftnav').find('li')[i]).attr ('class', 'active');
                else 
                    $($('#leftnav').find('li')[i]).attr ('class', '');
            }
            second_filter(cluster1[nowtab]);
            show_page ();
    })

    $('#returnback').click ( function () {
            //TODO :添加点击返回后的操作
        }
    )
}
