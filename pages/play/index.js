 /**
  * 这里不记录页面状态了，重新启动程序以后只记得当前在播的歌曲，不记录播放进度
  * 本来打算把所有状态都放到一个对象里，但是很难维护，还是做简单的业务逻辑流转吧
  */
let app = getApp();
let util = require("../../utils/util.js");
Page({
  data: {
      music: null,
      totalTime: "00:00",
      totalSeconds: 0,
      currentTime: "00:00",
      currentSeconds: 0,
      option:'播放',
      intervalId: null,
      animationState:'paused',
      playingNeedle:'',
      playing:false,
  },
  onLoad:function(){
      console.log('load');
      let that = this;
      wx.onBackgroundAudioPlay(function(){
          that.setData({
            animationState: 'running',
            playingNeedle: 'playing_needle',
            playing: true,
            option: '暂停',
            totalTime: util.formatMinute(that.data.music.duration/1000),
            totalSeconds: that.data.music.duration/1000
          });
          that.data.intervalId = setInterval(function(){
              wx.getBackgroundAudioPlayerState({
                success: function(res) {
                    var status = res.status;
                    var dataUrl = res.dataUrl;
                    var currentPosition = res.currentPosition;
                    var duration = res.duration;
                    var downloadPercent = res.downloadPercent;
                    //如果是没音乐或者暂停了 则停止
                    if((status == 2 || status == 0) && that.data.intervalId != null){
                      clearInterval(that.data.intervalId);
                      that.data.intervalId = null;
                      return;
                    }
                    //如果正在播
                    if(status == 1){
                      that.setData({
                        currentTime: util.formatMinute(currentPosition),
                        currentSeconds: currentPosition,
                        totalTime: util.formatMinute(duration),
                        totalSeconds: duration
                      });
                    }

                }
            })
          }, 1000);
      });
      wx.onBackgroundAudioPause(function(){
        if(that.data.intervalId != null){
          clearInterval(that.data.intervalId);
        }
        that.setData({
          animationState: 'paused',
          playingNeedle: '',
          playing: false,
          intervalId: null,
          option: '播放'
        });
      });
      wx.onBackgroundAudioStop(function(){
        if(that.data.intervalId != null){
          clearInterval(that.data.intervalId);
        }
        that.setData({
          animationState: 'paused',
          playingNeedle: '',
          playing: false,
          intervalId: null,
          option: '播放'
        });
      });
  },
  onReady: function (e) {
      console.log('ready');
  },
  onShow:function(){
    console.log('show');
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
          // this.data.music = appMusic;
          this.setData({
            music: appMusic,
            totalTime: util.formatMinute(appMusic.duration/1000),
            totalSeconds: appMusic.duration/1000,
            currentTime: "00:00",
            currentSeconds: 0,
          });
          if(app.getPlaying()){
              this.audioPlay();
          }
      }
  },
  //播放或者暂停
  audioOption: function(){
    let that = this;
    wx.getBackgroundAudioPlayerState({
      success: function(res) {
          var status = res.status;
          var dataUrl = res.dataUrl;
          var currentPosition = res.currentPosition;
          var duration = res.duration;
          var downloadPercent = res.downloadPercent;
          //如果是不在播 则播放
          if(status == 2 && that.data.music != null){
            that.audioPlay();
            return;
          }
          //如果正在播 不管了
          if(status == 1){
            that.audioPause();
            return;
          }
          //如果是暂停 则继续播
          if(status == 0 && that.data.music != null){
            that.audioPlay(false);
            return;
          }
      }
    });
  },
  audioPlay: function (ifRestart= true) {
    let that = this;
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
    let that = this;
    wx.pauseBackgroundAudio({
      success: function(res){
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  seekMusic: function(e){
    let seek = e.detail.value;
    let that = this;
    wx.seekBackgroundAudio({
      position: seek,
      success: function(res){
        that.setData({
          currentTime:util.formatMinute(seek)
        });
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