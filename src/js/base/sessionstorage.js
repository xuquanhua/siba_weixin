function SessionStorageClient(){
    //添加键值对
    this.put = function(key,value){
        sessionStorage.setItem(key, value);
    };

    //添加json对象
    this.putJSON = function(key,json){
    	sessionStorage.setItem(key,JSON.stringify(json));
    };

    //根据key查找JSON对象
    this.getJSON = function(key){
        if(sessionStorage.getItem(key) == 'undefined')
            return	null;
        return JSON.parse(sessionStorage.getItem(key));
    };

    //根据key查找value
    this.get = function(key){
        if(sessionStorage.getItem(key) == 'undefined')
            return	null;
        return sessionStorage.getItem(key)
    };

    //移除key对应的元素
    this.remove = function(key){
    	sessionStorage.removeItem(key);
    };

    //清空localStorage
    this.clear = function(){
    	sessionStorage.clear();
    };

    //根据索引获得item，结果为一个json对象 {key,value}
    this.indexOf = function(index){
        var item = {};
        if(sessionStorage.length<=index){
            return null;
        }

        var key = sessionStorage.key(i);
        var value = sessionStorage.getItem(key);
        item.key = key;
        item.value = value;
        return item;
    };
}

var sessionStorageClient = new SessionStorageClient();