/* 
 * 本文件包含了关于页面初始化的函数，相关全局变量定义请在data.js中查阅
 */

//返回a,b中较小值
function min (a, b) {
    if (a > b) return b;
    return a;
}

//为每个tooltips类设置hide行为，即一开始隐藏hint的信息
$(document).ready(function(){
        $(function () { $('.tooltips').tooltip('hide');})
})

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
    for (var i = 0, len = url_list.length; i < len; ++i) {
        info_list[i] = '<table class=\"table table-striped table-hover\">';
        info_list[i] += '<tbody>'
        for (var j = 0, Len = url_list[i].length; j < Len; ++j) 
            if (url_list[i][j].title.length) {
            info_list[i] += '<tr>';
            info_list[i] += '<td> <a href=\"' + url_list[i][j].url + '\">' + url_list[i][j].title + '<span class="badge pull-right">1</span></td>';
            info_list[i] += '</tr>';
        }
        info_list[i] += '</tbody>'
        info_list[i] += '</table>';
    }
    maxpage = url_list.length - 1;
}

/*
 * 显示页面的函数，传入参数tid(默认值为0)，显示导航栏最左边的tag为第tid个tag并打开的界面
 */
function show_page (tid) {
    var tid = arguments[0] ? arguments[0] : 0; //设置tid默认值为0
//    second_filter (his); //调试用，效果为对../data/history.js里面的url信息进行二层聚类处理并输出聚类结果到console中。
    get_init (); //初始化info_list
    nowhome = "home";
    $('#' + nowhome).html (get_info (tid));
    nowhome = "tmphome";
    nowid = tid;
    nowpage = tid;
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
    str += '<li><a href="TOADD" id="returnback"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>返回<a>';//TODO:请在TOADD处填写返回地址
    str += '</ul>';
    $('#leftnav').html (str);
    $($('#leftnav').find('li')[0]).attr ('class', 'active');
    show_page ();

    $('.clustertab').click ( function () {
            var nowtab = ($('.clustertab').index (this)) + nowpage;
            console.log (nowtab);
            for (var i = 0, len = cluster_list.length; i < len; ++i) {
                if (i == nowtab)
                    $($('#leftnav').find('li')[i]).attr ('class', 'active');
                else 
                    $($('#leftnav').find('li')[i]).attr ('class', '');
            }
            //TODO :添加切换第一层类之后需要进行的操作
            alert ('请实现切换一层类操作');
    })

    $('#returnback').click ( function () {
            //TODO :添加点击返回后的操作
            alert ('请实现返回操作');
        }
    )
}
