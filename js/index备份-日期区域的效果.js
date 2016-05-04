//->�����ǵ�MATCH��������ù̶��ĸ߶�
var $match = $(".match"),
    $matchTop = $match.children(".matchTop"),
    $matchInner = $matchTop.find(".inner"),
    $calendarList = null;

var $winH = document.documentElement.clientHeight || document.body.clientHeight;
$match.css("height", $winH - 40);

//->��ʽ��ʱ���ַ���:��"2016-4-28"->"04-28"
function formatTime(time) {
    time = time.replace(/^(\d{4})-(\d{1,2})-(\d{1,2})$/g, function () {
        var month = arguments[2].length < 2 ? "0" + arguments[2] : arguments[2];
        var day = arguments[3].length < 2 ? "0" + arguments[3] : arguments[3];
        return month + "-" + day;
    });
    return time;
}

//->������������ݰ󶨺���ز���Ч����ʵ��
$.ajax({
    url: "http://matchweb.sports.qq.com/kbs/calendar?columnId=100000&_=" + Math.random(),
    type: "get",
    dataType: "jsonp",
    success: function (data) {
        calendarBind(data);
        posToday(data);
        bindLink();
    }
});

//->�����������ݰ�
function calendarBind(calendarData) {
    if (calendarData) {
        var data = calendarData["data"]["data"];
        var str = "";
        for (var i = 0, len = data.length; i < len; i++) {
            var curData = data[i];
            str += "<li date='" + curData["date"] + "'>";
            str += "<span class='week'>" + curData["weekday"] + "</span>";
            str += "<span class='date'>" + formatTime(curData["date"]) + "</span>";
            str += "</li>";
        }
        $matchInner.html(str).css("width", len * 105);
        $calendarList = $matchInner.children("li");
    }
}

//->��ʼ��ʱ��λ��ָ������������
function posToday(calendarData) {
    if (calendarData) {
        var today = calendarData["data"]["today"];
        $calendarList.each(function (index, item) {
            //$(item)<==>$(this) ÿһ��ѭ����ʱ��ǰ����һ��LIԪ�ر�ǩ
            $(this).attr("date") === today ? $(this).addClass("bg") : $(this).removeClass("bg");

            //->��λ�������λ��
            if ($(this).attr("date") === today) {
                $matchInner.css("left", 105 * (3 - index));
            }
        });
    }
}

//->�����Ұ�ť�ĵ������:�¼�ί��������
function bindLink() {
    $matchTop.on("click", function (e) {
        var $tar = $(e.target), tar = e.target;
        var tarTagName = tar.tagName.toUpperCase();

        //->����¼�Դ�����ҵ�A��ǩ
        if (tarTagName === "A" && /^link(Left|Right)$/.test(tar.className)) {
            var oldLeft = parseFloat($matchInner.css("left")), curL = null;
            if ($tar.hasClass("linkLeft")) {
                //->����İ�ť
                curL = oldLeft + 735;
                curL = curL >= 0 ? 0 : curL;
            } else {
                //->���ҵİ�ť
                curL = oldLeft - 735;
                var maxL = $matchInner.width() - (105 * 7);
                curL = Math.abs(curL) >= maxL ? -maxL : curL;
            }
            $matchInner.stop().animate({left: curL}, 300, function () {
                //->�õ�ǰ�л���һ����ĵ�һ��ѡ��:
                //��ǰ$matchInner��LEFTֵ����105��ȡ���Ľ����ʵ���ǵ�ǰ�����һ��LI������
                $calendarList.eq(Math.abs(curL) / 105).addClass("bg").siblings().removeClass("bg");
            });

            return;
        }

        //->����¼�Դ��ÿһ��LI������ÿһ��LI�µ�SPAN
        if (/^(LI|SPAN)$/.test(tarTagName)) {
            var $curLi = $tar;
            if (tarTagName === "SPAN") {
                $curLi = $tar.parent();
            }
            $curLi.addClass("bg").siblings().removeClass("bg");
        }
    });
}
















































