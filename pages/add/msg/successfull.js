// pages/add/msg/successfull.js
Page({
  mixins: [require('../../mixin/common')],
  data: {
    title: '',
    price: '',
    quantity: '',
    category: '',
    showTime: '',
  },
  onLoad(options) {
    this.setData({
      title: options.title,
      price: options.price,
      quantity: options.quantity,
      category: options.category,
      showTime: options.showTime
    });
  },
  //返回主页
  getBack() {
    wx.switchTab({
      url: '../../home/home',
    })
  }
});