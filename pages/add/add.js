Page({
  mixins: [require('../mixin/common')],
  data: {
    files: [],
    array3: ['电子产品', '家居用品', '服装鞋帽', '食品饮料', '图书音像', '化妆品个护', '运动健身', '玩具乐器', '其他'],
    value3: 0,
    productName: '', // 商品名称
    price: '', // 价格
    description: '', // 商品描述
    openid: '',
    quantity: '' // 商品数量
  },
  onLoad: function () {
    // 页面加载时从 storage 中获取 openid
    const openid = wx.getStorageSync('openid');
    this.setData({
      openid: openid
    });
  },
  bindQuantity(e) {
    this.setData({
      quantity: e.detail.value
    })
  },
  bindDescription: function (e) {
    // console.log(e.detail.value)
    this.setData({
      description: e.detail.value,
    });
  },
  bindPrice(e) {
    this.setData({
      price: e.detail.value,
    })
  },
  bindproductname(e) {
    this.setData({
      productName: e.detail.value,
    })
  },
  bindPicker3Change(e) {
    this.setData({
      value3: e.detail.value,
    });
  },

  // 事件处理函数，将填写的商品信息发送给后端
  addProduct() {
    // 获取填写的商品信息
    const openid = this.data.openid;
    const productName = this.data.productName;
    const price = this.data.price;
    const description = this.data.description;
    const category = this.data.array3[this.data.value3]; // 获取选择的种类
    const quantity=this.data.quantity;
    // 发送 HTTP 请求给后端
    wx.request({
      url: 'http://localhost:12345/addProduct',
      method: 'POST',
      data: {
        openid: openid,
        productName: productName,
        price: price,
        description: description,
        category: category,
        quantity:quantity,
        // 其他字段根据需要添加
      },
      success(res) {
        // 请求成功的处理逻辑
        if (res.statusCode === 201 && res.data && res.data.message === 'Product added successfully') {
          wx.showToast({
            title: '商品添加成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '商品添加失败',
            icon: 'none',
            duration: 2000
          });
          console.error('添加商品失败：', res.data);
        }
      },
      fail(err) {
        // 请求失败的处理逻辑
        console.error('添加商品失败：', err);
        wx.showToast({
          title: '商品添加失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },



});