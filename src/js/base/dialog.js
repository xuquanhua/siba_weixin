/**
 * common.dialog({class:"dialog-success",text:"操作成功"});
 * common.dialog({class:"dialog-warn",text:"非法操作"});
 * common.confirm({btnLeft:"单按钮",text:"操作成功"});
 * common.confirm({btnLeft:"左按钮",btnRight:"右按钮",title:"标题",content:"提示内容",callback1:function () {},callback2:function () {}});
 * common.loading();
 * common.loading("带文字的加载中");
 * common.closeLoading();
 **/
var common = {
    dialog: function (param) {
        if ($("." + param.class).length === 0) {
            var template = '<div class="' + param.class + '"><i class="icon-activity_ico_select"></i><span>' + param.text + '</span></div>';
            $("body").append(template);
        } else {
            $("." + param.class).find("span").text(param.text);
        }
        if ($("." + param.class).css("visibility") != "hidden") {
            return;
        }
        ;
        var $this = $("." + param.class);
        $this.css("visibility", "visible");
        var timerId = setTimeout(function () {
            $this.css("visibility", "hidden");
            param.callback && param.callback();
            clearTimeout(timerId);
        }, 2000);
    },
    confirm: function (param) {
        param.btnLeft = (param.btnLeft == undefined ? "" : param.btnLeft);
        param.content = (param.content == undefined ? "提示内容" : param.content);
        param.title = (param.title == undefined ? "标题" : param.title);
        param.layer = (param.layer == false ? '' : '<div id="layer"></div>');

        var form = (param.form == undefined ? "" : " "+param.form);
        if ($(".dialog-confirm").length === 0) {
            var btnStr = '<span class="confirm-cancel">' + param.btnLeft + '</span><span class="confirm-sure">' + param.btnRight + '</span>';
            if (param.btnRight == undefined) {
                btnStr = '<span class="confirm-sure2">' + param.btnLeft + '</span>';
            }
            var template = param.layer +
                '<div class="dialog-confirm' + form + '">' +
                '<div class="confirm-content"><span class="confirm-title">' + param.title + '</span>' + param.content + '</div>' +
                '<p class="confirm-operate clearfix">' + btnStr + '</p>'
            '</div>';
            $("body").append(template);
        } else {
            $(".dialog-confirm .confirm-content").html('<span class="confirm-title">' + param.title + '</span>' + param.content + '</p>');
        }
        var $this = $(".dialog-confirm");
        var layer = $("#layer");
        if (layer.length != 0) {
            layer.css("display", "block");
        }
        $this.css("visibility", "visible");

        $(".dialog-confirm .confirm-cancel,.dialog-confirm .confirm-sure2").on("click", function (e) {
            param.callback1 && param.callback1();
            $this.off();
            $(".dialog-confirm .confirm-sure").off();
            if (layer.length != 0) {
                layer.remove();
            }
            $this.css("visibility", "hidden").remove();
            e.preventDefault();
        });
        $(".dialog-confirm .confirm-sure").on("click", function (e) {
            param.callback2 && param.callback2();
            $this.off();
            $(".dialog-confirm .confirm-sure").off();
            if (layer.length != 0) {
                layer.remove();
            }
            $this.css("visibility", "hidden").remove();
            e.preventDefault();
        });
    },
    loading: function (text) {
        $(".loading-wrap").remove();
        if (text !== undefined) {
            var template = '<div class="loading-wrap"><div class="layer-opcity"></div><div class="loading contain-text">'
                + '<div class="continer"><div class="loading-icon">'
                + '<div class="text">' + text + '</div></div></div></div></div>';
            $("body").append(template);
        } else {
            var template = '<div class="loading-wrap"><div class="loading">'
                + '<div class="continer"><div class="loading-icon"></div></div></div></div>'
            $("body").append(template);
        }
    },
    closeLoading: function () {
        $(".loading-wrap").remove();
    }
}
