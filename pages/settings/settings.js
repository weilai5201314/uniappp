Page({
  mixins: [require('../mixin/common')],



  goToOrder(e) {
    // const product = e.currentTarget.dataset.product;
    wx.navigateTo({
      url: `/pages/settings/order/order`
    });
  }

});
