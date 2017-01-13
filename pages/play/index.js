let app = getApp();
Page({
  data: {
      music: null
  },
  onLoad:function(){
      console.log('load');
  },
  onReady: function (e) {
      console.log('ready');
  },
  onShow:function(){
      let appMusic = app.getMusic();
      let selfMusic = this.data.music;
      if(appMusic == null){
          return;
      }
      wx.setNavigationBarTitle({
          title: appMusic.name
      });
      //需要新播放
      if(selfMusic == null || selfMusic.id != appMusic.id){
          this.data.music = appMusic;
      }
      if(app.getPlaying()){
          this.audioPlay();
      }
  },
  audioPlay: function () {
    let music = this.data.music;
    wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.name,
        coverImgUrl: music.pic,
        success: function(){
          
        },
        fail: function(){
          //TODO 播放失败
        }
    })
  },
  audioPause: function () {
    wx.pauseBackgroundAudio({
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  audio14: function () {
    wx.seekBackgroundAudio({
      position: 14,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  audioStart: function () {
    wx.seekBackgroundAudio({
      position: 0,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})