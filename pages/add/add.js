const config = require("../../config")

Page({
  mixins: [require('../mixin/common')],
  data: {
    files: [],
    array3: ['电子产品', '家居用品', '服装鞋帽', '食品饮料', '图书音像', '学习文具', '化妆品个护', '运动健身', '玩具乐器', '其他'],
    value3: 0,
    productName: '', // 商品名称
    price: '', // 价格
    description: '', // 商品描述
    openid: '',
    quantity: '', // 商品数量
    isPriceWarning: false, // 价格警告标志
    isQuantityWarning: false // 数量警告标志
  },
  onLoad: function () {
    // 页面加载时从 storage 中获取 openid
    const openid = wx.getStorageSync('openid');
    this.setData({
      openid: openid
    });
  },

  bindDescription: function (e) {
    // console.log(e.detail.value)
    this.setData({
      description: e.detail.value,
    });
  },
  bindQuantity(e) {
    const quantity = e.detail.value;
    const isQuantityWarning = !/^\d+$/.test(quantity) || quantity === '';
    this.setData({
      quantity: quantity,
      isQuantityWarning: isQuantityWarning
    });
  },
  bindPrice(e) {
    const price = e.detail.value;
    const isPriceWarning = !/^\d+(\.\d{1,2})?$/.test(price) || price === '';
    this.setData({
      price: price,
      isPriceWarning: isPriceWarning
    });
  },
  bindproductname(e) {
    const productName = e.detail.value;
    const isProductNameWarning = productName === '';
    this.setData({
      productName: productName,
      isProductNameWarning: isProductNameWarning
    });
  },
  bindPicker3Change(e) {
    this.setData({
      value3: e.detail.value,
    });
  },

  // 事件处理函数，将填写的商品信息发送给后端
  addProduct() {
    const isProductNameWarning = this.data.productName === '';
    const isPriceWarning = !/^\d+(\.\d{1,2})?$/.test(this.data.price) || this.data.price === '';
    const isQuantityWarning = !/^\d+$/.test(this.data.quantity) || this.data.quantity === '';

    this.setData({
      isProductNameWarning: isProductNameWarning,
      isPriceWarning: isPriceWarning,
      isQuantityWarning: isQuantityWarning
    });

    if (isProductNameWarning || isPriceWarning || isQuantityWarning) {
      wx.showToast({
        title: '请检查输入的商品名称、价格和数量',
        icon: 'none',
        duration: 2000
      });
      return;
    }


    try {
      // 获取填写的商品信息
      const openid = this.data.openid;
      const productName = this.data.productName;
      const price = this.data.price;
      const description = this.data.description;
      const category = this.data.array3[this.data.value3]; // 获取选择的种类
      const quantity = this.data.quantity;
      // 发送 HTTP 请求给后端添加商品接口
      wx.request({
        url: config.baseUrl + '/addProduct',
        method: 'POST',
        data: {
          openid: openid,
          productName: productName,
          price: price,
          description: description,
          category: category,
          quantity: quantity,
          // 其他字段根据需要添加
        },
        success(res) {

          // 请求成功的处理逻辑
          if (res.statusCode === 201 && res.data && res.data.message === 'Product added successfully') {
            console.log('添加商品成功：', res.data);

            wx.redirectTo({
              url: `/pages/add/msg/successfull?title=${res.data.product.Title}&price=${res.data.product.Price}&quantity=${res.data.product.Quantity}&category=${res.data.product.Category}&showTime=${res.data.product.ShowTime}`
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
    } catch (err) {
      console.log(err)
    }

  },



});