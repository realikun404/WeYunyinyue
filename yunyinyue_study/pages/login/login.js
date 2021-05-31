import request from "../../utils/requests"


/*
登录流程
1.收集表单项数据
2.前端验证
信息是否合法
3.后端验证
用户是否存在，密码是否正确
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",//手机号
    password:""//用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //表单项内容发生改变回调
  handleInput(event){
    // console.log(event);
    let type=event.currentTarget.id;
    // console.log(type,event.detail.value);
    this.setData({
      [type]:event.detail.value
    })
  },

async login(){
    //1.收集表单项数据
    let {phone,password}=this.data;
    /*
    手机号验证
    */
   if(!phone){
     //提示用户
     wx.showToast({
       title:"手机号不能为空",
       icon:"none"
     })
     return;
   }
   //定义正则表达式
     let phoneReg=/^1[3-9]\d{9}/;
     if(!phoneReg.test(phone)){
      wx.showToast({
        title:"请输入正确的手机号",
        icon:"none"
      })
      return;
     }
     if(!password){
      wx.showToast({
        title:"密码不能为空",
        icon:"none"
      })
      return;
     }
    //  wx.showToast({
    //   title:"前端验证通过",
    //   icon:"none"
    // })
    console.log("aaa");
    let result=await request("/login/cellphone",{"phone":phone,"password":password,isLogin:true});
    if(result.code===200){
      wx.showToast({
        title:"登录成功",
      })
      //将用户信息存储在本地
      wx.setStorageSync("userInfo", JSON.stringify(result.profile));
      //跳转到个人中心personal界面
      wx.reLaunch({
        url:"/pages/personal/personal"
      })
    }
    else if(result.code===400){
      wx.showToast({
        title:"手机号错误",
        icon:"none"
      })
    }
    else if(result.code===502){
      wx.showToast({
        title:"密码错误",
        icon:"none"
      })
    }
    else{
      wx.showToast({
        title:"登录失败",
        icon:"none"
      })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})