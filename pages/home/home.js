Page({
  mixins: [require('../mixin/common')],
  data: {
    inputShowed: false,
    inputVal: '',
    isFocus: false,
    products: [] // 用于存放商品数据
  },
  onLoad() {
    this.fetchProducts();
  },
  onShow(){
    this.fetchProducts();
  }
  ,
  fetchProducts() {
    wx.request({
      url: 'http://127.0.0.1:12345/getAllProducts',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            products: res.data.products
          });
        } else {
          wx.showToast({
            title: '获取商品失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('请求失败：', err);
        wx.showToast({
          title: '获取商品失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
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
});