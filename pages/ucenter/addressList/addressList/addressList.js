var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    windowHeight: 0,                           //获取屏幕高度  
    cliHeight: 0,                              //获取高度  
    addressList: [],                             //全部列表
    checked: false,    //判断是否是选中状态
    start: 1,           //开始数量
    perpage: 8,            //每页数量
    loadMore: true,    //能否加载能多
    hidden1: true,
    dataTotal: 0,      //请求回来的数据总数
    kind: "",          //区分显示订单来源还是个人中心
    orderddId: 0,      //存储订单id
  },

// 每次进入页面都加载一次地址列表
  onShow: function () {
    var that = this;
    that.setData({
      hidden1: true,
      start: 1,
      perpage: 8,
    });

    //获取初始数据
    var start = that.data.start;
    var perpage = that.data.perpage;

    that.getUserinfo(start, perpage);

    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight-60
        })
      }
    });
  },
  // 接收订单来源
  onLoad: function (options) {
    console.log(options);
    var that = this;
    if (options.hasOwnProperty("orderddId")) {
      var orderddId = options.orderddId;
    }
    else{
      var orderddId = 0;
    }
     console.log(options);
    that.setData({
      orderddId: orderddId
    })
  },
  //获取地址信息
  getUserinfo: function (_start, _perpage) {
    var url = app.apiUrl + '/Customer/ContactList';
    var params = {
      start: _start,
      perpage: _perpage
    };
    //@todo 网络请求API数据
    app.request.requestGetApi(url, params, this, this.successAdd, this.failAdd)  //路径，参数，this，成功函数，失败函数
  },
  //
  successAdd: function (res) {
    console.log(res);
    var that = this;
    var perpage = that.data.perpage;
    var res = JSON.parse(decodeURIComponent(JSON.stringify(res)));     //解决乱码问题
    if (res.status == 200) {
      if (res.result != null) {
        //将获取到的用户信息存放在数组datalist中
        if (res.total <= perpage) {
          that.setData({
            addressList: res.result,
            loadMore: false,
            dataTotal: res.total,
            hidden1: false,
          })
        } else {
          that.setData({
            addressList: res.result,
            loadMore: true,
            dataTotal: res.total,
            hidden1: true,
          })
        }      
      }
    }
    else {
      console.log(res.msg);
    }
  },

  // 加载更多
  loadMore: function (e) {
    var that = this;
    if (that.data.loadMore) {
      console.log(that.data.loadMore);
      var loadMore = that.data.loadMore;
      var start = that.data.start;
      var perpage = that.data.perpage;
      var url = app.apiUrl + '/Customer/ContactList';
      that.FunMore(that, url, start, perpage)
    }
  },

  // 调用函数
  FunMore: function (that, url, start, perpage) {
    var start = start + 1;

    that.setData({
      start: start,
      loadMore:false,
    })
    var params = {
      start: start,
      perpage: perpage,
    } // 请求的参数
    wx.showToast({
      title: '加载更多',
      icon: 'loading',
      duration: 500,
    })
    app.request.requestPostApi(url, params, this, this.giftSuccess, this.adventFail)
  },
  // FunMore 回调函数
  giftSuccess: function (res) {
    var that = this;
  
    if (res.status == 200) {
      console.log("页码" + that.data.start + "总页数:" + that.data.page);
      console.log(res.result);
      console.log(res.result.length);
      console.log(that.data.perpage);

      if (res.result.length < that.data.perpage) {
        that.setData({
          loadMore: true,
          addressList: that.data.addressList.concat(res.result),
          hidden1: true,
        })
      } else {
        that.setData({
          loadMore: false,
          addressList: that.data.addressList.concat(res.result),
          hidden1: false,
        })
      }

    }
  },
  // 跳转确认订单链接
  orderSelect: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var orderddId = that.data.orderddId;
    
    var url = app.apiUrl + '/Market/OrderddChange';
    var params = {
      orderddId: orderddId,
      "property[contact_identity]": id
    };
    //@todo 网络请求API数据
    app.request.requestPostApi(url, params, this, function (res) {
      if (res.status == 200) {
        console.log("订单修改成功")
        wx.reLaunch({
          url: '/pages/shopping/order/order?orderddId=' + orderddId,
        })
      }
      else if (res.status == 4040) {
        console.log("订单不存在")
      }
      else if (res.status == 4041) {
        console.log("键值格式错误")
      }
      else {
        console.log(res.msg)
      }
    }, this.fail)  //路径，参数，this，成功函数，失败函数

  },
  // 编辑地址
  addressedit: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ucenter/addressList/addressEdit/addressEdit?contactId=' + id,
    })
  },

  // 新增地址
  addnew: function () {
    wx.navigateTo({
      url: '/pages/ucenter/addressList/addressEdit/addressEdit',
    })
  }

})
//时间戳转换时间  
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
}