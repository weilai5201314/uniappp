const config = require("../../config");

Page({
  data: {
    product: {},
    productImages: []
  },
  onLoad: function (options) {
    const product = JSON.parse(options.product);
    const productImages = [];
    if (product.Image1) productImages.push(product.Image1);
    if (product.Image2) productImages.push(product.Image2);
    if (product.Image3) productImages.push(product.Image3);

    this.setData({
      product: product,
      productImages: productImages
    });
  },
  previewImage: function (e) {
    const currentUrl = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.productImages // 需要预览的图片http链接列表
    });
  },
  // 点击按钮触发添加到购物车事件
  addToCart: function () {
    const openid = wx.getStorageSync('openid');
    const product = this.data.product;
    const productid = product.ProductID;

    wx.request({
      url: config.baseUrl + '/addShoppingCart',
      method: 'POST',
      data: {
        openid: openid,
        productID: productid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode === 201) {
          wx.showToast({
            title: '商品已成功添加到购物车',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '添加到购物车失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function (error) {
        console.error('Error adding product to shopping cart:', error);
        wx.showToast({
          title: '添加到购物车失败，请检查网络',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
