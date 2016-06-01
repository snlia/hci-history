/*
 * 本文件包含了tag切换时候的改变相关函数
 */

//返回第x个tag的标题，可重定义，调试方便设为直接返回name_list
function get_name (x) {
    return name_list[x];
}

//返回第x个tag的页面内容，可重定义，调试方便设为直接返回info_list
function get_info (x) {
    return info_list[x];
}
//根据nowpage以及nowid的值更新导航栏状态
function set_page () {

    for (var i = 0; i < min (maxtag, maxpage - nowpage + 1); ++i) {
        $($('#navigate').find('a')[i + 1]).html (get_name (nowpage + i)); //更新tag显示的名字，这里用substr(0,4)设置最大长度，避免导航栏溢出
        $($('#navigate').find('a')[i + 1]).attr('title', get_name(nowpage + i));//更新tag的hint信息，显示完整的tag名字
    }

    for (var i = maxpage - nowpage + 1; i < maxtag; ++i) {
        $($('#navigate').find('li')[i + 1]).attr('class', "invisible"); //设置多余的tag为不可见
    }

    for (var i = 0; i < min (maxtag, maxpage - nowpage + 1); ++i) {
        if (i + nowpage != nowid) {
            $($('#navigate').find('li')[i + 1]).attr('class', "");
            $($('#navigate').find('a')[i + 1]).attr('href', '#' + nowhome);
        }
        else {
            $($('#navigate').find('li')[i + 1]).attr('class', "active");
            if (nowhome.search ("tmp") == 0)
                $($('#navigate').find('a')[i + 1]).attr('href', '#home');
            else
                $($('#navigate').find('a')[i + 1]).attr('href', '#tmphome');
        }
    }

    //判断当前是否允许向前，向后翻页
    $('#prebtk').attr ('class', 'pull-left');
    $('#nxtbtk').attr ('class', 'pull-right');
    console.log (nowpage);
    if (nowpage == 0) {
        $('#prebtk').attr ('class', 'pull-left disabled'); //导航栏最左边为第0个tag，无法向前翻页
    }
    if (nowpage + maxtag - 1 >= maxpage) {
        $('#nxtbtk').attr ('class', 'pull-right disabled');//导航栏已显示最后的所有tag，无法向后翻页
    }
}

function add_tab_event () {
    A = [];
    console.log ('add tab');
    for(var j = 0,Len = url_list[nowid].length; j < Len; ++j) {
        if(url_list[nowid][j].title.length) {
            var hhh = 'aaaaaa_' + nowid + '_' + j;

            A[hhh] = {url:url_list[nowid][j].url};
            document.getElementById(hhh).addEventListener('click', function (event) {
                    chrome.tabs.create({selected: true, url: A[this.getAttribute("id")].url});
                    return false;
            });
        }
    }

}

/*
 * 为每个tag设置单击后触发效果,包括:
 * 清除当前页内容
 * 设置切换页内容
 * 进行切换
 * 设置其他tag的href属性为nowhome
 * 更改nowhome
 */
$(document).ready(function(){
        $('.tooltips').click ( function () {
                var eid = ($('.tooltips').index (this)) + nowpage;
                if (nowid == eid) return ;
                nowid = eid;
                $('#' + nowhome).html (get_info (eid));
                if (nowhome.search ("tmp") == 0) {
                    nowhome = 'home';
                }
                else {
                    nowhome = 'tmphome';
                }
                $('#' + nowhome).html ('');
                add_tab_event ();
                set_page ();
            }
        )
})

//向前翻页，nowpage - 1并调用set_page
$(document).ready(function(){
        $('#prebtk a:first').click ( function () {
                if (nowpage == 0) return;
                nowpage -= 1;
                set_page ();
            }
        )
})

//向后翻页，nowpage + 1并调用set_page
$(document).ready(function(){
        $('#nxtbtk a:first').click ( function () {
                if (nowpage + maxtag - 1 >= maxpage) return ;
                nowpage += 1;
                set_page ();
            }
        )
})


