const config = require("../../config")

Page({
  data: {
    inputShowed: false,
    inputVal: '',
    isFocus: false,
    cartItems: [] // 用于存放购物车数据
  },
  onLoad() {
    this.fetchCartItems();
  },
  onShow() {
    this.fetchCartItems();
  },
  showInput() {
    this.setData({
      inputShowed: true,
    });
  },
  blurInput() {
    this.setData({
      isFocus: false,
    });
  },
  hideInput() {
    this.setData({
      inputVal: '',
      inputShowed: false,
    });
  },
  clearInput() {
    this.setData({
      inputVal: '',
    });
  },
  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value,
      isFocus: true,
    });
  },
  search() {
    // 在这里编写搜索逻辑，可以根据 inputVal 的值执行相应的搜索操作
    console.log('执行搜索：', this.data.inputVal);
  },
  fetchCartItems() {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: config.baseUrl + '/getShoppingCart',
      method: 'POST',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log(res)
          this.setData({
            cartItems: res.data.cartItems
          });
          console.log(this.data.cartItems)
        } else {
          wx.showToast({
            title: '获取购物车失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('请求失败：', err);
        wx.showToast({
          title: '获取购物车失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  goToDetail(e) {
    const product = e.currentTarget.dataset.product;
    wx.navigateTo({
      url: `/pages/shoppingcart/info/info?product=${JSON.stringify(product)}`
    });
  }
});
