let app = getApp();
Page({
    data: {
        inputShowed: false,
        keyword: "",
        haveInput: false,
        searchResult: null,
        pageNum: 0,
        isLoading: false,
        noExtra: false
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            keyword: "",
            inputShowed: false,
            searchResult: null,
            haveInput:false,
            noExtra:false,
            isLoading:false,
            pageNum: 0
        });
    },
    clearInput: function () {
        this.setData({
            keyword: "",
            searchResult: null,
            haveInput:false,
            noExtra:false,
            isLoading:false,
            pageNum:0
        });
    },
    inputTyping: function (e) {
        this.setData({
            haveInput: e.detail.value == "" ? false:true
        });
    },
    inputConfirm: function(e){
        if(e.detail.value != ''){
            if(this.data.keyword != e.detail.value){
                this.setData({
                    keyword: e.detail.value,
                    searchResult: null,
                    noExtra:false,
                    isLoading:false,
                    pageNum:0
                });
                this.search(e.detail.value);
            }
        }
    },
    openLoading: function () {
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: 'true'
        });
    },
    closeLoading: function(){
        wx.hideToast();
    },
    onReachBottom: function(){
        if(this.data.isLoading || this.data.pageNum < 1 || this.data.noExtra){
            return;
        }
        this.setData(
            {
                isLoading: true
            }
        );
        this.search(this.data.keyword, this.data.pageNum+1);
    },
    search: function(keyword, page = 1){
        let that = this;
        this.data.keyword = keyword;
        if(page == 1){
            this.openLoading();
        }
        wx.request({
            url: 'https://www.bewithyou.me/music.php', 
            data: {
                k: keyword ,
                p: page
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let searchResult = [];
                res.data.data.forEach(function(e){
                    let tmp = e;
                    if(tmp.alias && tmp.alias.length > 0){
                        tmp.alias = tmp.alias.join('/');
                    }
                    if(tmp.transNames && tmp.transNames.length > 0){
                        tmp.transNames = tmp.transNames.join('/');
                    }
                    if(tmp.artists && tmp.artists.length > 0){
                        tmp.artists = tmp.artists.join('/');
                    }
                    searchResult.push(tmp);
                });
                if(that.data.searchResult != null){
                    searchResult = that.data.searchResult.concat(searchResult);
                }
                that.setData({
                    searchResult: searchResult,
                    isLoading: false,
                    pageNum: page,
                    keyword: keyword,
                    noExtra: res.data.data.length == 0? true:false
                });
                if(page == 1){
                    that.closeLoading();
                }
            }
        })
    },
    playMusic: function(e){
        let musicIndex = e.currentTarget.id;
        if(this.data.searchResult[musicIndex]){
            app.setMusic(this.data.searchResult[musicIndex]);
            app.setPlaying(true);
        }
        wx.switchTab({
            "url":"../play/index"
        });
    }
});