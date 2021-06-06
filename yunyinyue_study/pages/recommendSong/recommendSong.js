// pages/recommendSong/recommendSong.js
import request from "../../utils/requests";
import PubSub from "pubsub-js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendList: [],
    index:0  //点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        success: () => {
          //跳转至登录界面
          wx.reLaunch({
            //跳转至登录界面
            url: "/pages/login/login",
          });
        },
      });
    }

    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });

    //获取每日推荐的数据
    this.getRecommendListData();

    //订阅来自songDetail发布的消息,订阅是会累加的
    PubSub.subscribe("switchType",(msg,type)=>{
      let {recommendList,index}=this.data;
      let length=this.data.recommendList.length;
      // console.log(msg,type);
      if(type==="pre"){
        index=(index+length-1)%length;
      }else{
        index=(index+length+1)%length;
      }

      //更新下标

      
      this.setData({
        index
      })

      let musicId=recommendList[index].id;
      //将musicId传给songDetail 界面

      PubSub.publish("musicId",musicId)
    })
  },

  //获取用户每日推荐
  async getRecommendListData() {
    let recommendListData = await request("/recommend/songs");
    this.setData({
      recommendList: recommendListData.recommend,
    });
  },

  //跳转到songdetai
  toSongDetail(event) {
    // console.log(event.currentTarget.dataset);
    let {song,index}=event.currentTarget.dataset;
    this.setData({
      index
    })
    // console.log(event);

    //路由跳转传参：query参数
    wx.navigateTo({
      // url: "/pages/songDetail/songDetail?song="+JSON.stringify(song),
      url: "/pages/songDetail/songDetail?musicId="+song.id
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
