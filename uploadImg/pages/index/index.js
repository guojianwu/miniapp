//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    show:false,
    token:{},
    motto: 'Hello World',
    src: '',
    width: 240,//宽度
    height: 135,//高度
  },
  //事件处理函数
  
  onLoad: function () {
    this.getOssToken();
    //获取到image-cropper对象
    this.cropper = this.selectComponent("#image-cropper");
    // //开始裁剪
    // this.setData({
    //   src="https://app.edsmall.cn/vipcard/img_v2/groupBuyTab_1_v2.jpg"
    // });
    // wx.showLoading({
    //   title: '加载中'
    // })
  },
  getOssToken(){
    wx.request({
      url: 'https://sxy.edsmall.com/api/upload/getOssToken', 
      method:"post",
      success:(res)=> {
       
        var data = res.data.data;
        var token = {
          'policy': data.policy,
          'OSSAccessKeyId': data.accessKeyId,
          'success_action_status': '200', //让服务端返回200,不然，默认会返回204
          'signature': data.sign,
          'expire_time': data.expireTime,
          "host": data.host,
          "key":'resource/test/asdfghjklasdfghjk.png'
        };
        this.setData({
          token
        })
        console.log(token)
      }
    })
  },
  onChooseImg(){
    var self=this;
    var token=self.data.token;
    console.log(token)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        self.setData({
          src: tempFilePaths[0],
          show:true
        });
        // wx.uploadFile({
        //   url: token.host, //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: token,
        //   success(res) {
        //     const data = res.data
        //     console.log(res)
        //     //do something
        //   }
        // })
      }
    })
  },
  cropperload(e) {
    console.log("cropper初始化完成");
  },
  loadimage(e) {
    console.log("图片加载完成", e.detail);
    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  confirmEvent(res){
    var self = this;
    var token = self.data.token;
    console.log(res.detail.url)
     wx.uploadFile({
          url: token.host, //仅为示例，非真实的接口地址
          filePath: res.detail.url,
          name: 'file',
          formData: token,
          success(res) {
            const data = res.data
            console.log(res)
            //do something
          }
        })
    this.setData({
      show:false
    })
  },
  reCropper(){
    this.setData({
      show:true
    })
  }
})
