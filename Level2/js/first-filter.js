/*
 * 本文件包含关于第一层聚类的相关函数
 * 注：本文件内函数未经过调试
 */
//用正则表达式提取域名

function get_domain(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
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

var Others = 12580; //表示Others类编号

var domain_name = [];
var domain;
var cluster1 = [];

function load_domain() {
    var i, len;
    domain_name[0] = ("图书");
    for (i = 0, len = books.length; i < len; i++)
        domain.push({'label': 0, 'url': get_domain(books[i].url)});

    domain_name[1] = ("游戏");
    for (i = 0, len = game.length; i < len; i++)
        domain.push({'label': 1, 'url': get_domain(game[i].url)});

    domain_name[2] = ("经济");
    for (i = 0, len = eco.length; i < len; i++)
        domain.push({'label': 2, 'url': get_domain(eco[i].url)});

    domain_name[3] = ("科技");
    for (i = 0, len = tech.length; i < len; i++)
        domain.push({'label': 3, 'url': get_domain(tech[i].url)});

    domain_name[4] = ("新闻");
    for (i = 0, len = news.length; i < len; i++)
        domain.push({'label': 4, 'url': get_domain(news[i].url)});

    domain_name[5] = ("社区");
    for (i = 0, len = comm.length; i < len; i++)
        domain.push({'label': 5, 'url': get_domain(comm[i].url)});

    domain_name[6] = ("购物");
    for (i = 0, len = shopping.length; i < len; i++)
        domain.push({'label': 6, 'url': get_domain(shopping[i].url)});

    domain_name[7] = ("运动");
    for (i = 0, len = sports.length; i < len; i++)
        domain.push({'label': 7, 'url': get_domain(sports[i].url)});

    domain_name[8] = ("视频");
    for (i = 0, len = video.length; i < len; i++)
        domain.push({'label': 8, 'url': get_domain(video[i].url)});

    domain.sort(function (a, b) {
        return get_domain(a.url) < get_domain(b.url);
    })
}

function load_history() {
    load_domain();
    chrome.history.search({
        "startTime": 0,
        "maxResults": 10000
    }, function (history) {
        first_filter(history);
    });
}

function first_filter(his) {
    his.sort(function (a, b) {
        return get_domain(a['url']) < get_domain(b['url']);
    });
    var nowx = 0;
    for (var i = 0, len = his.length(); i < len; ++i) {
        while (domain[nowx]['url'] < get_domain(his[i]['url'])) ++nowx;
        if (match(domain[nowx]['url'], get_domain(his[i]['url']))) {
            cluster1[domain[nowx]['label']].push(his[i]);
            type = domain[nowx]['label'];
            console.log(domain_name[type],his[i].title);
        }
        else {
            cluster1[Others].push(his[i]);
        } //加入Others类
    }
}
