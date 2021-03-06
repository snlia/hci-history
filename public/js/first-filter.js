/*
 * 本文件包含关于第一层聚类的相关函数
 * 注：本文件内函数未经过调试
 */
//用正则表达式提取域名
function get_domain (str) {
    return str.match(".*?//.*?/");
}

/*
 * 传入一个chorme默认格式的his信息，返回一个cluster，类型为[[History_Object]]，
 * 每一项表示分出来的一个类，每个类用list表示包含的所有History_Object
 * 考虑到效率问题，这里用归并的方式进行分类，方法：
 * 将his根据domain字典序排序
 * TODO :将domain根据domain排序(这步这里并没有实现，请在接口处实现)
 * 每次比较两个头是否相等，更新domain的指针，如果找到相等的domain则加入对应的cluster中，否则加入Others类中
 * domain未给出，格式为[Domain_Object]
 * 其中Domain_Object需要包含两个属性： label：所属类的下标， title：该url的域名
 */

var Others = 12580; //表示Others类编号

function first_filter (his) {
    his.sort (function (a, b) {
            return get_domain (a['title']) < get_domain (b['title']);
    });
    var nowx = 0;
    cluster = [];
    for (var i = 0, len = his.length (); i < len; ++i) {
        while (domain[nowx]['title'] < get_domain (his[i]['title'])) ++nowx;
        if (match (domain[nowx]['title'], get_domain (his[i]['title']))) cluster[domain[nowx]['label']].push (his[i]);
        else cluster[Others].push (his[i]); //加入Others类
    }
}
