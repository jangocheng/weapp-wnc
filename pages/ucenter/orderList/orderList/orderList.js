var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,                             // tab切换  
    windowHeight: 0,                           //获取屏幕高度  
    cliHeight: 0,                              //获取高度  
    orderList: [],                             //全部列表
    orderListf: [],                             //待付款列表
    orderLists: [],                            //待收货列表
    orderListw: [],                            //已完成列表
    start: 1,                       //当前页数
    perpage: 6,   //一页数量
    page: 0,//页码
    hidden: true,
    hidden1: true,
    hidden2: true,
    hidden3: true,
    currentTab: 0,
    loadMore: true,                //是否能够加载数据
    loadMore1: true,                //是否能够加载数据
    loadMore2: true,                //是否能够加载数据
    loadMore3: true,                //是否能够加载数据
    num: 0,
  },

  // 接收传递的订单状态链接参数
  onLoad: function (options) {
    var that = this;
    if (options.hasOwnProperty('currentTab')) {
      //重置数据
      that.setData({
        currentTab: options.currentTab
      })
    }
  },

  onShow: function () {
    var that = this;
    //重置数据
    that.setData({
      hidden: true,
      start: 1,
      perpage: 6,
    })
    var perpage = that.data.perpage;
    var start = that.data.start;
    var n = that.data.currentTab
    if (n == 0) {
      var type = 9;
    }
    else if (n == 1) {
      var type = 4;
    } else if (n == 2) {
      var type = 2;
    } else if (n == 3) {
      var type = 0;
    }
    //获取用户信息
    this.getinfo(type, start, perpage);
   
    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          cliHeight: res.windowHeight - 56 //48为额外的内容
        })
      }
    });
  },

  // 请求各状态订单数据
  getinfo: function (_type, _start, _perpage) {
    var that = this;
    var url = app.apiUrl + '/Market/OrderddList';
    if (_type == 9) {
      var paramsx = { start: _start, perpage: _perpage };
      app.request.requestGetApi(url, paramsx, this, this.successFun, this.failFun)  //全部数据请求
    }
    else if (_type == 4) {
      var params = { type: _type, start: _start, perpage: _perpage };
      app.request.requestGetApi(url, params, this, this.successFun_dzf, this.failFun)  //待支付数据请求
    }
    else if (_type == 2) {
      var params = { type: _type, start: _start, perpage: _perpage };
      app.request.requestGetApi(url, params, this, this.successFun_dsh, this.failFun)  //待付款数据请求
    }
    else {
      var params = { type: _type, start: _start, perpage: _perpage };
      app.request.requestGetApi(url, params, this, this.successFun_ywc, this.failFun)  //已完成数据请求
    }
  },

  /******** 全部数据 ********/
  successFun: function (res) {
    var that = this;
    var perpage = that.data.perpage;
    var orderList = res.result;
    console.log(orderList);
    if (res.status == 200) {
      if (res.total <= perpage) {
        that.setData({
          orderList: res.result,
          loadMore: false,
          hidden: false,
          page: 1
        })
      } else {
        that.setData({
          orderList: res.result,
          loadMore: true,
          hidden: true,
          page: 1
        })
      }
    } else {
      console.log(res);
    }
  },

  /******** 待付款数据 ********/
  successFun_dzf: function (res) {
    var that = this;
    var perpage = that.data.perpage;
    var orderListz = res.result;
    if (res.status == 200) {
      if (res.total <= perpage) {
        that.setData({
          orderListf: res.result,
          loadMore1: false,
          hidden1: false,
          page: 1
        })
      } else {
        that.setData({
          orderListf: res.result,
          loadMore1: true,
          hidden1: true,
          page: 1
        })
      }
    } else {
      console.log(res);
    }
  },

  /******** 待收货数据 *******/
  successFun_dsh: function (res) {
    var that = this;
    var perpage = that.data.perpage;

    if (res.status == 200) {
      if (res.total <= perpage) {
        that.setData({
          orderLists: res.result,
          loadMore2: false,
          hidden2: false,
          page: 1
        })
      } else {
        that.setData({
          orderLists: res.result,
          loadMore2: true,
          hidden2: true,
          page: 1
        })
      }
    } else {
      console.log(res);
    }
  },

  /******** 已完成数据 *******/
  successFun_ywc: function (res) {
    var that = this;
    var perpage = that.data.perpage;
    var orderListw = res.result

    if (res.status == 200) {
      if (res.total <= perpage) {
        that.setData({
          orderListw: res.result,
          loadMore3: false,
          hidden3: false,
          page: 1
        })
      } else {
        that.setData({
          orderListw: res.result,
          loadMore3: true,
          hidden3: true,
          page: 1
        })
      }
    } else {
      console.log(res);
    }
  },

  //滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

    //请求数据
    var perpage = that.data.perpage;
    var start = that.data.start;
    var n = e.detail.current;
    if (n == 0) {
      var type = 9;
    }
    else if (n == 1) {
      var type = 4;
    } else if (n == 2) {
      var type = 2;
    } else if (n == 3) {
      var type = 0;
    }
    // switch (n) {
    //   case 0: var type = 9; 
    //   case 1: var type = 4; 
    //   case 2: var type = 2; 
    //   case 3: var type = 0; break;
    // }
    console.log(type)
    that.getinfo(type, start, perpage);
  },
  //点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

    //请求数据
    that.setData({ start: 1 });
    var perpage = that.data.perpage;
    var start = that.data.start;
    var n = e.target.dataset.current;
    if (n == 0) {
      var type = 9;
    }
    else if (n == 1) {
      var type = 4;
    } else if (n == 2) {
      var type = 2;
    } else if (n == 3) {
      var type = 0;
    }
    // switch (n) {
    //   case 0: var type = 9; 
    //   case 1: var type = 4; 
    //   case 2: var type = 2; 
    //   case 3: var type = 0; break;
    // }
    console.log(type)
    that.getinfo(type, start, perpage);
  },

  //加载更多
  loadMore: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;            //获取数据类型
    var loadMore = that.data.loadMore;                  //是否进行加载的开关
    that.setData({ num: type });
    var str = "loadMore";

    that.FunMore(type, loadMore, str);
  },

  loadMore1: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;            //获取数据类型
    var loadMore1 = that.data.loadMore1;                  //是否进行加载的开关
    that.setData({ num: type });
    var str = "loadMore1";

    that.FunMore(type, loadMore1, str);
  },
  loadMore2: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;            //获取数据类型
    var loadMore2 = that.data.loadMore2;                  //是否进行加载的开关
    that.setData({ num: type });
    var str = "loadMore2";

    that.FunMore(type, loadMore2, str);
  },
  loadMore3: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;            //获取数据类型
    var loadMore3 = that.data.loadMore3;                  //是否进行加载的开关
    var str = "loadMore3";
    that.setData({ num: type });

    that.FunMore(type, loadMore3, str);
  },
  //加载更多（基本函数）
  FunMore: function (type, flag, str) {
    var that = this;
    var start = that.data.start;                        //开始页数
    var perpage = that.data.perpage;                    //数据条数
    console.log(flag);
    if (flag) {
      var start = start + 1;
      var page = that.data.page + 1;
      if (str == "loadMore") {
        that.setData({
          start: start,
          loadMore: false,
        });
      } else if (str == "loadMore1") {
        that.setData({
          start: start,
          loadMore1: false,
        });
      } else if (str == "loadMore2") {
        that.setData({
          start: start,
          loadMore2: false,
        });
      } else {
        that.setData({
          start: start,
          loadMore3: false,
        });
      }
      wx.showToast({
        title: '加载更多',
        icon: 'loading',
        duration: 500
      })

      console.log('第' + start + '页');
      var url = app.apiUrl + '/Market/OrderddList';
      var params = { type: type, start: start, perpage: perpage };
      app.request.requestGetApi(url, params, this, this.successFun_more, this.failFun)  //路径，参数，this，成功函数，失败函数
    }
  },


  /******* 加载更多接口 ******/
  successFun_more: function (res, num) {
    var that = this;
    var num = that.data.num;
    console.log("num========" + num);
    if (res.status == 200) {
      if (res.result.length < that.data.perpage) {
        if (num == 9) {
          that.setData({
            loadMore: false,
            orderList: that.data.orderList.concat(res.result),
            hidden: false
          })
        } else if (num == 4) {
          that.setData({
            loadMore1: false,
            orderListf: that.data.orderListf.concat(res.result),
            hidden1: false
          })
        } else if (num == 2) {
          that.setData({
            loadMore2: false,
            orderLists: that.data.orderLists.concat(res.result),
            hidden2: false
          })
        } else {
          that.setData({
            loadMore3: false,
            orderListw: that.data.orderListw.concat(res.result),
            hidden3: false
          })
        }
      } else {
        if (num == 9) {
          that.setData({
            loadMore: true,
            orderList: that.data.orderList.concat(res.result),
            hidden: true
          })
        } else if (num == 4) {
          that.setData({
            loadMore1: true,
            orderListf: that.data.orderListf.concat(res.result),
            hidden1: true
          })
        } else if (num == 2) {
          that.setData({
            loadMore2: true,
            orderLists: that.data.orderLists.concat(res.result),
            hidden2: true
          })
        } else {
          that.setData({
            loadMore3: true,
            orderListw: that.data.orderListw.concat(res.result),
            hidden3: true
          })
        }
      }
    } else {
      console.log(res);
    }
  },

  //去支付
  pay: function (e) {
    var identity = e.currentTarget.id;
    console.log(e);
    wx.navigateTo({
      url: '/pages/shopping/order/order?orderddId=' + identity,
    })
  },

  //确认收货
  receiving: function (e) {
    var that=this
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.showModal({
      content: '是否确认收货操作',
      success: function (res) {
        if (res.confirm) {
          var url = app.apiUrl + '/Market/OrderddReceipt';
          var params = {
            orderddId: id,
          };
          app.request.requestGetApi(url, params, this, function (res) {
            console.log(res);
            var perpage = that.data.perpage;
            var res = JSON.parse(decodeURIComponent(JSON.stringify(res)));     //解决乱码问题
            if (res.status == 200) {
              wx.showToast({
                title: "成功收货",
                duration:1000
              })
              var perpage = that.data.perpage;
              var start = 1;
              var type = 2;
              //获取用户信息
              that.getinfo(type, start, perpage);
            }
            else if (res.status == 4040) {
              wx.showToast({
                title:"订单不存在",
                duration: 1000
              })
            }
            else {
              console.log(res.msg);
            }
          }, this.failc)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //去评价
  review: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ucenter/orderList/orderComments/orderComments?orderddId=' + id,
    })
  },

  //收货情况详情
  detail: function(e){
    var that = this;
    var id = e.currentTarget.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/ucenter/orderList/orderDetail/orderDetail?orderddId=' + id,
    })
  },
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