// pages/search/search.js
import request from "../../utils/requests";
let isSend = false; //函数节流使用

Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: "", //placeholder的内容
    hotList: [], //热搜榜数据
    searchContent: "", //用户输入的表单项数据
    searchList: [], //关键字模糊匹配
    historyList: [], //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取初始化的数据
    this.getInitData();

    //获取历史记录
    this.getSearchHistory();
  },

  // 获取初始化的数据
  async getInitData() {
    let placeholderData = await request("/search/default");
    let hotListData = await request("/search/hot/detail");
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data,
    });
  },

  //获取本地历史记录函数
  getSearchHistory() {
    let historyList = wx.getStorageSync("searchHistory");
    // console.log(historyList,11);
    if (historyList) {
      this.setData({
        historyList,
      });
    }
  },

  //表单项内容发生改变的回调
  handleInputChange(event) {
    //更新数据
    this.setData({
      searchContent: event.detail.value.trim(),
    });
    if (isSend) {
      return;
    }
    isSend = true;
    this.getSearchList();
    //函数节流
    setTimeout(async () => {
      isSend = false;
    }, 300);
  },

  //获取搜索数据的函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: [],
      });
      return;
    }
    let { searchContent, historyList } = this.data;
    //发请求获取关键字
    let searchListData = await request("/search", {
      keywords: this.data.searchContent,
      limit: 10,
    });
    this.setData({
      searchList: searchListData.result.songs,
    });

    //将搜索的关键字添加到搜索的历史记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1);
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList,
    });

    wx.setStorageSync("searchHistory", historyList);
  },

  //清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: "",
      searchList: [],
    });
  },

  // 删除搜索历史记录
  deleteSearchHistory() {
    wx.showModal({
      // title: '1',
      content: "确认删除搜索记录？",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000000",
      confirmText: "确定",
      confirmColor: "#3CC51F",
      success: (result) => {
        if (result.confirm) {
          //清空data中的数据，同时移除本地的历史
          this.setData({
            historyList: [],
          });
          wx.removeStorageSync("searchHistory");
        }
      },
      fail: () => {},
      complete: () => {},
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
