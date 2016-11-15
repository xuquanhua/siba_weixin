var App = {
    serverUrl: "#[serverUrl]#",
    isLogEnable: ("true" === "#[isLogEnable]#")
};

//初始化App
$(function () {
    $.init && $.init();
});


if (App.isLogEnable) {
    document.write("<script type='text/javascript' src='../../js/log/log.js'></script>");
    document.write("<script type='text/javascript' src='../../js/log/dom.js'></script>");
    document.write("<script type='text/javascript' src='../../js/log/console.js'></script>");
}

var log4JS = new Log4JS();

//日志对象
function Log4JS() {
    this.info = function (msg) {
        if (App.isLogEnable && LogJS) {
            LogJS.info(msg);
        }
    };

    this.warn = function (msg) {
        if (App.isLogEnable && LogJS) {
            LogJS.warn(msg);
        }
    };

    this.error = function (msg) {
        if (App.isLogEnable && LogJS) {
            LogJS.error(msg);
        }
    };
}


var CommonUtil = {
    /**
     * 显示元素(由于zepto的show在有些情况下有问题，所以我们统一使用控制css的方式来实现show的功能)
     * @param ele 元素的标识(id,className,...)
     *
     * <pre>
     * 调用方式如下：
     * showElement("#id");
     * showElement(".className");
     * ...
     * </pre>
     */
    showElement: function (ele) {
        $(ele).css("display", "block");
    },

    /**
     * 影藏元素(由于zepto的hide在有些情况下有问题，所以我们统一使用控制css的方式来实现show的功能)
     * @param ele 元素的标识(id,className,...)
     *
     * <pre>
     * 调用方式如下：
     * showElement("#id");
     * showElement(".className");
     * ...
     * </pre>
     */
    hideElement: function (ele) {
        $(ele).css("display", "none");
    },


    //常量：往sessionStorage中存放的paramObj的key
    CONSTANT_PARAMOBJ: "paramObj",

    /**
     * 注入页面之间跳转需要传递的参数
     * @paramObj 一个JSON对象，用来传递参数，其格式如下:
     *             {"articleId":"123456"}
     */
    injectParamObject: function (paramObj) {
        sessionStorageClient.putJSON(this.CONSTANT_PARAMOBJ, paramObj);
    },

    /**
     * 取出存在sessionStorage中的参数对象
     * @return 一个JSON对象，其格式如下:
     *  {"articleId":"123456"}
     */
    takeOutParamObject: function () {
        return sessionStorageClient.getJSON(this.CONSTANT_PARAMOBJ);
    },

    /**
     * 移除sessionStorage中的参数对象
     */
    removeParamObject: function () {
        sessionStorageClient.remove(this.CONSTANT_PARAMOBJ);
    },

    /**
     * 判断数组
     * @param o
     * @returns {boolean}
     */
    isArray: function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    },

    /**
     * 将对象参数转换成字符串参数a=b&c=d
     * @param obj
     * @returns {*}
     */
    parseObjtoParamStr: function (obj) {
        if (obj) {
            // 返回字符串，ajax请求参数为对象的时候会对key和value都encodeURIComponent
            var params = []
            for (var attr in obj) {
                if (obj[attr] === '') {
                    continue;
                } else {
                    var param = attr + "=" + obj[attr];
                    params.push(param);
                }
            }

            return params.join("&");
        }
        return ""
    },

    /**
     * ajax请求,成功回调方法和失败回调方法中有this操作慎用
     * @param sucFunc 请求成功回调
     * @param errorFunc 请求失败回调     
     */
    ajaxRequest:function(url,type,data,sucFunc,errorFunc){
        common.loading();
        $.ajax({
            url : url,
            type : type,
            data : data,
            dataType : 'json',
            contentType : 'application/json;charset=utf8',
            success: function (result) {
                common.closeLoading();
                // 服务端filter重定向
                if (result && result.code == 303) {// 用户未授权
                    DialogUtil.dialogWarn("登录失败，请重新登录");
                    return true;
                } else if(result && result.code == 444){// 限流
                    DialogUtil.dialogWarn("当前访问量过大，请稍后重试");
                    return true;
                }else{
                    sucFunc(result);
                }
            },
            error: function () {
                common.closeLoading();
                errorFunc();
            }
        });
    },

    /**
     * 渲染模板
     * @param $dom jquery 对象
     * @param templateId 模板ID
     * @param data 数据
     * @param isAppend 是否追加内容
     * @param func 执行html之前的钩子 函数
     */
    render: function ($dom, templateId, data, isAppend, func) {
        if (!$dom || !templateId || !data) {
            return;
        }
        var rd = template(templateId, data); // 模板渲染完html
        func && func(); // 执行钩子函数
        if (isAppend) {
            $dom.append(rd);
        } else {
            $dom.html(rd);
        }
    }
};

/*弹窗工具类*/
DialogUtil = {
    /**
     * 提示公共方法,警告提示信息;
     * @param func;回调函数;
     */
    dialogWarn: function (msg, func) {
        if (!msg) {
            msg = "网络连接失败,请检查您的网络!";
        }
        var jsonParam = {};
        jsonParam.text = msg;
        jsonParam.class = "dialog-warn";
        if (func) {
            jsonParam.callback = func;
        }
        common.dialog(jsonParam);
    },

    /**
     * 提示公共方法,成功信息提示;
     * @param msg
     * @param func;回调函数;
     */
    dialogSuccess: function (msg, func) {
        if (!msg) {
            msg = "处理成功!";
        }
        var jsonParam = {};
        jsonParam.text = msg;
        jsonParam.class = "dialog-success";
        if (func) {
            jsonParam.callback = func;
        }
        common.dialog(jsonParam);

    },

    /**
     * 确认弹窗;
     * @param jsonParam:必须json格式;
     */
    dialogConfirm: function (jsonParam) {
        common.confirm(jsonParam);
    }
};
