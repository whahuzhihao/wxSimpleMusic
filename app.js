//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var music = wx.getStorageSync('music') || null;
    this.setMusic(music);
  },
  setMusic: function(m){
    this.globalData.music = m;
    wx.setStorageSync('music', m);
  },
  getMusic: function(){
    return this.globalData.music;
  },
  setPlaying: function(p){
    this.globalData.playing = p;
  },
  getPlaying: function(){
    return this.globalData.playing;
  },
  globalData:{
    music:null,
    playing:false
  }
})