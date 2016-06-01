/*
 * 本文件包含关于第一层聚类的相关函数
 * 注：本文件内函数未经过调试
 */

var all_history;
var now_history;

//用正则表达式提取域名
function get_domain_tmp(url){
    var host = "null";
    if(typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if(typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}
function get_domain(url) {
    var tmp = url.split('/');
    return tmp[2];
}

function get_domain2(url) {
    var host = get_domain(url);
    ppos = host.indexOf('.')
    return host.substring(ppos+1);
}
/*
 * 传入一个chorme默认格式的his信息，返回一个cluster，类型为[[History_Object]]，
 * 每一项表示分出来的一个类，每个类用list表示包含的所有History_Object
 * 考虑到效率问题，这里用归并的方式进行分类，方法：
 * 将his根据domain字典序排序
 * TODO :将domain根据domain排序(这步这里并没有实现，请在接口处实现)
 * 每次比较两个头是否相等，更新domain的指针，如果找到相等的domain则加入对应的cluster中，否则加入Others类中
 * domain未给出，格式为[Domain_Object]
 * 其中Domain_Object需要包含两个属性： label：所属类的下标， url：该url的域名
 */

var Others = 12; //表示Others类编号

var domain_name = [];
var domain = [];
var cluster1 = [];

function load_Level2(typeID) {
    console.log(typeID);
    chrome.storage.local.set({'typeID' : typeID});

    window.location.href = "../Level2/html/home_leve2.html";
}

function load_domain() {
    var i, len;

    for (i = 0; i < 12; i++)
        cluster1[i] = [];
    cluster1[Others] = [];

    domain_name[0] = t1.title;
    for (i = 0, len = t1.data.length; i < len; i++)
        domain.push({'label': 0, 'url': t1.data[i].link});
    domain_name[1] = t2.title;
    for (i = 0, len = t2.data.length; i < len; i++)
        domain.push({'label': 1, 'url': t2.data[i].link});
    domain_name[2] = t3.title;
    for (i = 0, len = t3.data.length; i < len; i++)
        domain.push({'label': 2, 'url': t3.data[i].link});
    domain_name[3] = t4.title;
    for (i = 0, len = t4.data.length; i < len; i++)
        domain.push({'label': 3, 'url': t4.data[i].link});
    domain_name[4] = t5.title;
    for (i = 0, len = t5.data.length; i < len; i++)
        domain.push({'label': 4, 'url': t5.data[i].link});
    domain_name[5] = t6.title;
    for (i = 0, len = t6.data.length; i < len; i++)
        domain.push({'label': 5, 'url': t6.data[i].link});
    domain_name[6] = t7.title;
    for (i = 0, len = t7.data.length; i < len; i++)
        domain.push({'label': 6, 'url': t7.data[i].link});
    domain_name[7] = t8.title;
    for (i = 0, len = t8.data.length; i < len; i++)
        domain.push({'label': 7, 'url': t8.data[i].link});
    domain_name[8] = t9.title;
    for (i = 0, len = t9.data.length; i < len; i++)
        domain.push({'label': 8, 'url': t9.data[i].link});
    domain_name[9] = t10.title;
    for (i = 0, len = t10.data.length; i < len; i++)
        domain.push({'label': 9, 'url': t10.data[i].link});
    domain_name[10] = t11.title;
    for (i = 0, len = t11.data.length; i < len; i++)
        domain.push({'label': 10, 'url': t11.data[i].link});
    domain_name[11] = t12.title;
    for (i = 0, len = t12.data.length; i < len; i++)
        domain.push({'label': 11, 'url': t12.data[i].link});


    //console.log(domain.length);
    domain.sort(function (a, b) {
        if (a.url < b.url)return -1;
        if (a.url == b.url)return 0;
        if (a.url > b.url)return 1;
    });

}

/*
 var history_info = [];
 var visits_info = [];

 function load_visits(hisItem) {
 chrome.history.getVisits({
 "url": hisItem.url
 }, function (visits) {
 for (var i = 0, len = visits.length; i < len; i++)
 visits_info[visits[i].visitId] = visits[i];
 })
 }
 */

function init_by_history () {
    console.log (now_history.length + '!!!');
    first_filter(now_history);

    for (var i = 0; i < 12; i++)
    cluster1[i].sort(function (a, b) {
            if (a.lastVisitTime > b.lastVisitTime)return -1;
            if (a.lastVisitTime == b.lastVisitTime)return 0;
            if (a.lastVisitTime < b.lastVisitTime)return 1;
    });
    cluster1[Others].sort(function (a, b) {
            if (a.lastVisitTime > b.lastVisitTime)return -1;
            if (a.lastVisitTime == b.lastVisitTime)return 0;
            if (a.lastVisitTime < b.lastVisitTime)return 1;
    });
    for (var i = 0; i < 13; ++i) console.log (cluster1[i].length);
    set_base_height();
    set_mid_text();
    chrome.storage.local.set({'cluster' : cluster1});

}

function load_history() {
    load_domain();

    var microsecondspermonth = 1000 * 60 * 60 * 24 * 30;
    var threeMonthAgo = (new Date).getTime() - microsecondspermonth * 3;

    chrome.history.search({
            "text": '',
            "startTime": threeMonthAgo,
            "maxResults": 20000
        }, function (history) {
            all_history = history;
            now_history = all_history;
            console.log (all_history.length);
            init_by_history ();
    });

}

var cnt = [];

function first_filter(his) {
    his.sort(function (a, b) {
            if (get_domain(a.url) < get_domain(b.url))return -1;
            if (get_domain(a.url) == get_domain(b.url))return 0;
            if (get_domain(a.url) > get_domain(b.url))return 1;
    });
    var nowx = 0;
    var tmp0 = [];
    for (var i = 0; i < 13; ++i) cluster1[i] = [];
    for (var i = 0, len = his.length; i < len; ++i) {
        //console.log(i,nowx);
        while (nowx < domain.length && domain[nowx]['url'] < get_domain(his[i]['url'])) ++nowx;
        if (domain[nowx]['url'] == get_domain(his[i]['url']))
            cluster1[domain[nowx]['label']].push(his[i]);
        else tmp0.push(his[i]);//加入Others类
    }
    tmp0.sort(function (a, b) {
            if (get_domain2(a.url) < get_domain2(b.url))return -1;
            if (get_domain2(a.url) == get_domain2(b.url))return 0;
            if (get_domain2(a.url) > get_domain2(b.url))return 1;
    });
    nowx = 0;
    for (var i = 0, len = tmp0.length; i < len; ++i) {
        //console.log(i,nowx);
        while (nowx < domain.length && domain[nowx]['url'] < get_domain2(tmp0[i]['url'])) ++nowx;
        if (domain[nowx]['url'] == get_domain2(tmp0[i]['url']))
            cluster1[domain[nowx]['label']].push(tmp0[i]);
        else cluster1[Others].push(tmp0[i]);//加入Others类
    }
    /*
     console.log("其他");
     for (var j = 0, len = cluster1[Others].length; j < len; j++)
         console.log(cluster1[Others][j].lastVisitTime, cluster1[Others][j].url);
     */
}

/*
 document.addEventListener('DOMContentLoaded', function () {

 });
 */
