let app = getApp();
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        haveInput: false,
        searchResult: null,
        pageNum: 1,
        isLoading: false,
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false,
            searchResult: null,
            haveInput:false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: "",
            searchResult: null,
        });
    },
    inputTyping: function (e) {
        this.setData({
            haveInput: e.detail.value == "" ? false:true
        });
    },
    inputConfirm: function(e){
        if(e.detail.value != ''){
            this.search(e.detail.value);
        }
    },
    search: function(keyword, page = 1){
        let that = this;
        wx.request({
        url: 'https://www.bewithyou.me/music.php', //仅为示例，并非真实的接口地址
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
            that.setData({
                searchResult: searchResult
            });
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