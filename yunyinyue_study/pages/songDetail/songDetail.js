// pages/songDetail/songDetail.js
import request from "../../utils/requests";
import PubSub from "pubsub-js";
import moment from "moment";

const appInstance = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //标识音乐是否在播放
    song: {},
    musicId: "",
    musicLink: "", //音乐的链接
    currentTime: "00:00", //实时时间
    durationTime: "3:00", //总时长
    currentWidth: 0, //实时进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options 接受路由传参的query参数
    // console.log(options)
    // 原生小程序路由传参参数过长会被截取掉
    let musicId = options.musicId;
    // console.log(musicId)
    this.setData({
      musicId,
    });
    this.getMusicInfo(musicId);

    // 用户通过外面的按钮修改音乐状态，播放表现状态并没有发生改变
    //解决方案：1.通过控制音频实例去监视播放和暂停和停止

    //判断当前界面音乐是否在播放
    if (
      appInstance.globalData.isMusicPlay &&
      appInstance.globalData.musicId === musicId
    ) {
      //修改当前音乐播放状态为true
      this.setData({
        isPlay: true,
      });
    }

    //创建控制音乐播放的实例对象
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      //  console.log("play()")
      this.changePlayState(true);

      //修改修改全局音乐播放状态
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      //  console.log("pause()")
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    //监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      //自动切换至下一首音乐,并且自动播放
      //将实时进度条长度还原成零
      // PubSub.publish("switchType", "next");
      this.handleSwitch();
      this.setData({
        currentWidth: 0,
        currentTime: "00:00",
      });
    });
    // 监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      //格式化实时的播放时间
      let currentTime = moment(
        this.backgroundAudioManager.currentTime * 1000
      ).format("mm:ss");
      let currentWidth =
        (this.backgroundAudioManager.currentTime /
          this.backgroundAudioManager.duration) *
        450;
      this.setData({
        currentTime,
        currentWidth,
      });
    });
  },

  //修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay: isPlay,
    });
    appInstance.globalData.isMusicPlay = isPlay;
  },

  //获取音乐详情的功能函数
  async getMusicInfo(musicId) {
    let songData = await request("/song/detail", { ids: musicId });

    let durationTime = moment(songData.songs[0].dt).format("mm:ss");

    this.setData({
      song: songData.songs[0],
      durationTime,
    });
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    });
  },

  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // })
    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  //控制音乐播放和暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        let musicLinkData = await request("/song/url", { id: musicId });
        musicLink = musicLinkData.data[0].url;

        this.setData({
          musicLink,
        });
      }
      //音乐播放
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    } else {
      //暂停音乐
      this.backgroundAudioManager.pause();
    }
  },

  //切换歌曲点击事件的回调
  handleSwitch(event) {
    let type="";
    //获取切歌的类型
    if (!event) {
      type = "next";
    } else {
      type = event.currentTarget.id;
      // console.log(type);
    }

    //关闭当前播放的音乐
    this.backgroundAudioManager.stop();

    //发布消息数据给recommendSong界面
    PubSub.publish("switchType", type);

    //订阅来自recommendSong界面发布的musicId信息
    PubSub.subscribe("musicId", (msg, musicId) => {
      // console.log(msg,musicId);

      //获取音乐详情信息
      this.getMusicInfo(musicId);

      //自动播放当前音乐
      this.musicControl(true, musicId);

      //取消订阅
      PubSub.unsubscribe("musicId");
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
