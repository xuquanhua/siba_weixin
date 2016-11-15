//下拉刷新
function refreshItem(param) {
    var $parent = $(param.target);
    if ($parent.find(".pull-to-refresh-layer").length !== 0) {
        return;
    }
    $parent.addClass("content pull-to-refresh-content").prepend('<div class="pull-to-refresh-layer"><div class = "preloader"> </div><div class = "pull-to-refresh-arrow"></div></div>');
    $parent.attr("isLoading", "false");
    $parent.on('refresh', function(e) {
        // 如果正在加载，则退出
        if ($parent.attr("isLoading") === "true") return;
        $parent.attr("isLoading", "true");
        var resetRefresh = function() {
            // 重置加载flag
            $parent.attr("isLoading", "false");
            $.pullToRefreshDone($parent);
        }
        resetRefresh.prototype.type = "refresh";
        param.callBack(resetRefresh);
    });
};
//加载更多
function addMoreItem(param) {
    var $parent = $(param.target);
    if ($parent.find(".infinite-scroll-preloader").length !== 0) {
        return;
    }
    $parent.addClass("content infinite-scroll").append('<div class="infinite-scroll-preloader hidden"><div class = "preloader"></div></div>');
    $parent.attr("isLoading", "false");

    $parent.on('infinite', function() {
        // 如果正在加载，则退出
        if ($parent.attr("isLoading") === "true") return;
        // 设置flag
        $parent.attr("isLoading", "true");
        var resetLoading = function(noMore) {
            // 重置加载flag
            $parent.attr("isLoading", "false");
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
            if (noMore) {
                $.detachInfiniteScroll($parent);
                $parent.find(".infinite-scroll-preloader").addClass("hidden");
            }
        }
        resetLoading.prototype.type = "addMore";
        param.callBack(resetLoading);
    });
    if ($parent.find(".infinite-scroll-preloader").offset().top > $parent.offset().height) {
        $parent.find(".infinite-scroll-preloader").removeClass("hidden");
    }
};
//初始化更多内容提示
function initAddMoreItem(target) {
    $parent = $(target);
    $infiniteScroll = $parent.find(".infinite-scroll-preloader");
    if ($infiniteScroll.length === 0) {
        return;
    }
    setTimeout(function() {
        if ($infiniteScroll.length !== 0 && $infiniteScroll.offset().top < $parent.offset().height) {
            $infiniteScroll.addClass("hidden");
            $.detachInfiniteScroll && $.detachInfiniteScroll($parent);
        } else {
            $infiniteScroll.removeClass("hidden");
            $.attachInfiniteScroll && $.attachInfiniteScroll($parent);
        }
    }, 1000);
};
