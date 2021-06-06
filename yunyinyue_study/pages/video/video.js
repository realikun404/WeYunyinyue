import request from "../../utils/requests";

// pages/video/video.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //导航标签数据
    navId: "", //导航的标识
    videoList: [],
    videoId: "", //视频id标识
    videoUpdateTime: [], //记录video播放时长
    isTriggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.getStorageSync("cookies"))
    {
      wx.navigateTo({
        url:"/pages/login/login"
      })
    }
    //获取导航数据
    this.getVideoGroupListData();

    // console.log(wx.getStorageSync("cookies"),"aaa")
  },

  async getVideoGroupListData() {
    let videoGroupData = await request("/video/group/list");
    this.setData({
      videoGroupList: videoGroupData.data.slice(0, 14),
      navId: videoGroupData.data[0].id,
    });
    this.getVideoList(this.data.navId); //获取视频列表数据
  },

  //获取视频列表数据
  async getVideoList(navId) {
    let videoListData = await request("/video/group", { id: navId });
    wx.hideLoading();
    // console.log(videoListData)
    //关闭下拉刷新
    let index = 0;
    let videoList = videoListData.datas.map((item) => {
      item.id = index++;
      return item;
    });
    this.setData({
      videoList: videoList,
      isTriggered:false
    });
  },

  //点击切换导航的回调
  changeNav(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId >>> 0,
      videoList: [],
    });
    // console.log(this.data.navId);
    wx.showLoading({
      title: "正在加载",
    });
    //动态获取当前导航对应的数据
    this.getVideoList(this.data.navId);
  },

  //点击播放，继续播放都会触发
  handlePlay(event) {
    // console.log("play()")
    //播放时找到上一个播放视频
    //播放新的视频关闭上一个视频
    /*
    单例模式：
    1.需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个变量
    2.节省存储空间
     */

    //获取当前id
    let vid = event.currentTarget.id;

    // //关闭上一个播放视频
    // this.videoContext&&this.vid&&this.vid!=vid&&this.videoContext.stop();

    // //设置id
    // this.vid=vid;

    // console.log(this);

    //更新data中的videoId的状态数据
    this.setData({
      videoId: vid,
    });

    //创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);

    //判断当前视频是否有播放记录；如果有，跳转至指定位置
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find((item) => item.vid === vid);
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    } else {
      this.videoContext.play();
    }
  },

  //监听视频播放进度的回调
  handleTimeUpdate(event) {
    // console.log(event)
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime,
    };
    // console.log(videoTime)
    let { videoUpdateTime } = this.data;
    //判断记录播放时长的videoUpdateTime是否有当前id
    let videoItem = videoUpdateTime.find(
      (item) => item.vid === videoTimeObj.vid
    );
    if (videoItem) {
      //找到了就更新
      videoItem.currentTime = videoTimeObj.currentTime;
    } else videoUpdateTime.push(videoTimeObj);
    //统一更新
    this.setData({
      videoUpdateTime,
    });
  },

  //视频播放结束调用
  handleEnd(event){
    // console.log("结束")
    //移除播放时长数组当前的视频对象
    let {videoUpdateTime}=this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id),1);
    this.setData({
      videoUpdateTime
    })
  },

  //自定义下拉刷新回调
  handleRefresher(){
    //再次发送请求，获取最新的视频列表数据
    this.getVideoList(this.data.navId);
  },

  //定义拉到底部的回调
  handleTolower(){
    // console.log("上拉")
    /*
    数据分页：
    1.后端分页。 2.前端分页
    //懒得弄了
    */
  },

  //跳转至搜索界面
  toSearch(){
    wx.navigateTo({
      url:"/pages/search/search"
    })
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
  onShareAppMessage: function ({from}) {
    // console.log(from)
    if(from==='button'){
      return {
        title:"来自button的转发",
        page:'/pages/video/video',
        imageUrl:"/static/images/nvsheng.jpg"
      }
    }
    else{
      return {
        title:"来自menu的转发",
        page:'/pages/video/video',
        imageUrl:"/static/images/nvsheng.jpg"
      }
    }
  },
});
