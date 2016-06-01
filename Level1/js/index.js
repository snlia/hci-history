var mid_text0 = new Array(14);
var mid_text1 = new Array(14);
var mid_text2 = new Array(14);
var mid_text3 = new Array(14);
var mid_text4 = new Array(14);
var mid_url1 = new Array(14);
var mid_url2 = new Array(14);
var mid_url3 = new Array(14);
var mid_url4 = new Array(14);
var base_height = new Array(14);

function filter_by_tm (s_y, s_m, s_d, e_y, e_m, e_d) {
    var sdate = new Date();
    console.log (s_y, s_m, s_d, e_y, e_m, e_d);
    sdate.setFullYear(s_y);
    sdate.setMonth(s_m - 1);
    sdate.setDate(s_d);
    var stime = sdate.getTime ();
    var tdate = new Date();
    tdate.setFullYear(e_y);
    tdate.setMonth(e_m - 1);
    tdate.setDate(e_d + 1);
    var ttime = tdate.getTime ();
    now_history = [];
    for (var i = 0, len = all_history.length; i < len; ++i) {
        if ((Math.ceil(all_history[i].lastVisitTime) >= stime) && (Math.ceil(all_history[i].lastVisitTime) <= ttime)) {
            now_history.push (all_history[i]);
        }
    }
}


function filter_by_kw (kw) {
    now_history = [];
    for (var i = 0, len = all_history.length; i < len; ++i) {
        if ((all_history[i].title).indexOf(kw) >= 0) {
            now_history.push (all_history[i]);
        }
    }
    console.log ('now!' + now_history.length);
}

function set_mid_text()                              //设置每一类中最常出现的4个url标题和链接
{
    for (i = 0; i < 14; i++) {
        mid_text0[i] = "";
        mid_text1[i] = "";
        mid_text2[i] = "";
        mid_text3[i] = "";
        mid_text4[i] = "";
    }
    for (i = 0; i < 12; i++) {
        mid_text0[i] = "最近浏览的" + domain_name[i] + "类网页：";
        if (cluster1[i] != null && cluster1[i][0] != null) {
            mid_text1[i] = cluster1[i][0].title;
            mid_url1[i] = cluster1[i][0].url;
        }
        else {
            mid_text1[i] = "无";
            mid_url1[i] = "#";
            continue;
        }
        if (cluster1[i] != null && cluster1[i][1] != null) {
            mid_text2[i] = cluster1[i][1].title;
            mid_url2[i] = cluster1[i][1].url;
        }
        else {
            mid_text2[i] = "无";
            mid_url2[i] = "#";
            continue;
        }
        if (cluster1[i] != null && cluster1[i][2] != null) {
            mid_text3[i] = cluster1[i][2].title;
            mid_url3[i] = cluster1[i][2].url;
        }
        else {
            mid_text3[i] = "无";
            mid_url3[i] = "#";
            continue;
        }
        if (cluster1[i] != null && cluster1[i][3] != null) {
            mid_text4[i] = cluster1[i][3].title;
            mid_url4[i] = cluster1[i][3].url;
        }
        else {
            mid_text4[i] = "无";
            mid_url4[i] = "#";
            continue;
        }
    }
    mid_text0[12] = "最近浏览的未分类网页：";
    if (cluster1[Others] != null && cluster1[Others][0] != null) {
        mid_text1[12] = cluster1[Others][0].title;
        mid_url1[12] = cluster1[Others][0].url;
    }
    else {
        mid_text1[12] = "无";
        mid_url1[12] = "#";
    }
    if (cluster1[Others] != null && cluster1[Others][1] != null) {
        mid_text2[12] = cluster1[Others][1].title;
        mid_url2[12] = cluster1[Others][1].url;
    }
    else {
        mid_text2[12] = "无";
        mid_url2[12] = "#";
    }
    if (cluster1[Others] != null && cluster1[Others][2] != null) {
        mid_text3[12] = cluster1[Others][2].title;
        mid_url3[12] = cluster1[Others][2].url;
    }
    else {
        mid_text3[12] = "无";
        mid_url3[12] = "#";
    }
    if (cluster1[Others] != null && cluster1[Others][3] != null) {
        mid_text4[12] = cluster1[Others][3].title;
        mid_url4[12] = cluster1[Others][3].url;
    }
    else {
        mid_text4[12] = "无";
        mid_url4[12] = "#";
    }
}

//更新base_height
function update_base_height () {
    for (var i = 0; i < 13; i++) {
        base_height[i] = 30 * Math.log(cluster1[i].length + 2);
    }
}

var aLi;

//初始动画
function first_move () {
    for (i = 0; i < aLi.length; i++) {
        aLi[i].timer = null;
        aLi[i].speed = 0;
        if (base_height[i] < 200)
            startMove2(aLi[i], base_height[i]);
        else
            startMove(aLi[i], base_height[i]);
    }
}

function set_base_height()							//设置每一类的总记录数量
{
    update_base_height ();
    for (var i = 0; i < 12; i++) {
        base_height[i] = 30 * Math.log(cluster1[i].length + 2);
        tmp = $("." + "co" + (i + 1));
        if (i < 7)tmp.html("<b>" + domain_name[i] + "</b>");
        else tmp.html("<a>" + domain_name[i] + "</a>");
    }
    tmp = $("." + "co" + 13);
    tmp.html("<a>未分类</a>");
    base_height[13] = 0;

    var oUl = document.getElementById("nav");
    aLi = oUl.getElementsByTagName("li");
    var i = 0;
    aLi[0].onclick = function () {
        load_Level2(0);
    };
    aLi[1].onclick = function () {
        load_Level2(1);
    };
    aLi[2].onclick = function () {
        load_Level2(2);
    };
    aLi[3].onclick = function () {
        load_Level2(3);
    };
    aLi[4].onclick = function () {
        load_Level2(4);
    };
    aLi[5].onclick = function () {
        load_Level2(5);
    };
    aLi[6].onclick = function () {
        load_Level2(6);
    };
    aLi[7].onclick = function () {
        load_Level2(7);
    };
    aLi[8].onclick = function () {
        load_Level2(8);
    };
    aLi[9].onclick = function () {
        load_Level2(9);
    };
    aLi[10].onclick = function () {
        load_Level2(10);
    };
    aLi[11].onclick = function () {
        load_Level2(11);
    };
    aLi[12].onclick = function () {
        load_Level2(Others);
    };
    first_move ();
}

//set_mid_text();
//set_base_height();
var max = 0;
for (i = 0; i < 14; i++)
if (max < base_height[i]) {
    max = base_height[i];
}
for (i = 0; i < 14; i++)
    base_height[i] = base_height[i] / max * 150 + 100;

function fade_and_show(now) {
    var t0 = document.getElementById("text0");
    var t1 = document.getElementById("text1");
    var t2 = document.getElementById("text2");
    var t3 = document.getElementById("text3");
    var t4 = document.getElementById("text4");
    t0.innerHTML = mid_text0[now];
    t1.innerHTML = mid_text1[now];
    t2.innerHTML = mid_text2[now];
    t3.innerHTML = mid_text3[now];
    t4.innerHTML = mid_text4[now];
    t1.href = mid_url1[now];
    t2.href = mid_url2[now];
    t3.href = mid_url3[now];
    t4.href = mid_url4[now];
}


$(document).ready(function () {
        load_history();
        var odiv = document.getElementById('divleft');
        odiv.onmouseover = function () {
            startmove_left(0, 40);
        }
        odiv.onmouseout = function () {
            startmove_left(-200, -40);
        }

        var se = document.getElementById("search");					//关键字搜索
        se.onclick = function () {
            var kw = document.getElementById("keyword");
            filter_by_kw (kw.value);
            init_by_history ();
        }

        var fl = document.getElementById("filter");					//时间筛选
        fl.onclick = function () {
            var s_y = document.getElementById("s_y").value;
            var s_m = document.getElementById("s_m").value;
            var s_d = document.getElementById("s_d").value;
            var e_y = document.getElementById("e_y").value;
            var e_m = document.getElementById("e_m").value;
            var e_d = document.getElementById("e_d").value;
            filter_by_tm (s_y, s_m, s_d, e_y, e_m, e_d);
            init_by_history ();
            first_move ();

        }

        var oUl = document.getElementById("nav");
        var aLi = oUl.getElementsByTagName("li");

        aLi[0].onmouseover = function () {
            var wh = window.innerHeight;
            for (i = 0; i < 7; i ++)
            {
                var target = wh * (0.35 - (0.05 * Math.abs(i - 0)));
                if (target < 200) {startMove2(aLi[i],target);}
                else {startMove(aLi[i],target);}
            }
        fade_and_show(0);
    };
    aLi[0].onmouseout = function () {
        for (i = 0; i < 7; i ++)
        {
            var target = base_height[i];
            if (target < 200) {startMove2(aLi[i],target);}
            else {startMove(aLi[i],target);}
        }
};

aLi[1].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 0; i < 7; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 1)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(1);
};
aLi[1].onmouseout = function () {
    for (i = 0; i < 7; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[2].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 0; i < 7; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 2)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(2);
};
aLi[2].onmouseout = function () {
    for (i = 0; i < 7; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[3].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 0; i < 7; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 3)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(3);
};
aLi[3].onmouseout = function () {
    for (i = 0; i < 7; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[4].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 0; i < 7; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 4)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(4);
};
aLi[4].onmouseout = function () {
    for (i = 0; i < 7; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[5].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 0; i < 7; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 5)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(5);
};
aLi[5].onmouseout = function () {
    for (i = 0; i < 7; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[6].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 0; i < 7; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 6)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(6);
};
aLi[6].onmouseout = function () {
    for (i = 0; i < 7; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[7].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 7; i < 13; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 7)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(7);
};
aLi[7].onmouseout = function () {
    for (i = 7; i < 13; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[8].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 7; i < 13; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 8)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(8);
};
aLi[8].onmouseout = function () {
    for (i = 7; i < 13; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};   

aLi[9].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 7; i < 13; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 9)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(9);
};
aLi[9].onmouseout = function () {
    for (i = 7; i < 13; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[10].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 7; i < 13; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 10)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(10);
};
aLi[10].onmouseout = function () {
    for (i = 7; i < 13; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[11].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 7; i < 13; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 11)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(11);
};
aLi[11].onmouseout = function () {
    for (i = 7; i < 13; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[12].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 7; i < 13; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 12)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(12);
};
aLi[12].onmouseout = function () {
    for (i = 7; i < 13; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

aLi[13].onmouseover = function () {
    var wh = window.innerHeight;
    for (i = 7; i < 13; i ++)
    {
        var target = wh * (0.35 - (0.05 * Math.abs(i - 13)));
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
fade_and_show(13);
};
aLi[13].onmouseout = function () {
    for (i = 7; i < 13; i ++)
    {
        var target = base_height[i];
        if (target < 200) {startMove2(aLi[i],target);}
        else {startMove(aLi[i],target);}
    }
};

});
function startMove(obj, iTarget) {
    if (obj.timer) {
        clearInterval(obj.timer);
    }
    obj.timer = setInterval(function () {
            doMove(obj, iTarget);
    }, 5)
};
function doMove(obj, iTarget) {
    obj.speed += 0.7;
    if (Math.abs(iTarget - obj.offsetHeight) < 1 && Math.abs(obj.speed) < 1) {
        clearInterval(obj.timer);
        obj.timer = null;
    }
    else {
        if (obj.offsetHeight + obj.speed >= iTarget) {
            obj.speed *= -0.001;
            obj.style.height = iTarget + "px";
        }
        else {
            obj.style.height = obj.offsetHeight + obj.speed + "px";
        }
    }
};
function startMove2(obj, iTarget) {
    if (obj.timer) {
        clearInterval(obj.timer);
    }
    obj.timer = setInterval(function () {
            doMove2(obj, iTarget);
    }, 5)
};
function doMove2(obj, iTarget) {
    obj.speed -= 1;
    if (Math.abs(iTarget - obj.offsetHeight) < 1 && Math.abs(obj.speed) < 1) {
        clearInterval(obj.timer);
        obj.timer = null;
    }
    else {
        if (obj.offsetHeight + obj.speed <= iTarget) {
            obj.speed *= -0.001;
            obj.style.height = iTarget + "px";
        }
        else {
            obj.style.height = obj.offsetHeight + obj.speed + "px";
        }
    }
};
var timer = null;
function startmove_left(target, speed) {

    var odiv = document.getElementById('divleft');
    clearInterval(timer);
    timer = setInterval(function () {

            if (odiv.offsetLeft == target) {
                clearInterval(timer);
            }
            else {
                odiv.style.left = odiv.offsetLeft + speed + 'px';
            }

    }, 30);

};

