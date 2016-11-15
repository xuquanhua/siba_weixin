function LocalStorageClient() {
    //添加键值对
    this.put = function (key, value) {
        localStorage.setItem(key, value);
    };

    //添加json对象
    this.putJSON = function (key, json) {
        localStorage.setItem(key, JSON.stringify(json));
    };

    //根据key查找JSON对象
    this.getJSON = function (key) {
        if (localStorage.getItem(key) == 'undefined')
            return null;
        return JSON.parse(localStorage.getItem(key));
    };

    //根据key查找value
    this.get = function (key) {
        if (localStorage.getItem(key) == 'undefined')
            return null;
        return localStorage.getItem(key)
    };

    //移除key对应的元素
    this.remove = function (key) {
        localStorage.removeItem(key);
    };

    //清空localStorage
    this.clear = function () {
        localStorage.clear();
    };

    //根据索引获得item，结果为一个json对象 {key,value}
    this.indexOf = function (index) {
        var item = {};
        if (localStorage.length <= index) {
            return null;
        }

        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        item.key = key;
        item.value = value;
        return item;
    };

}

var localStorageClient = new LocalStorageClient();