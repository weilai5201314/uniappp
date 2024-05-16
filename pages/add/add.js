Page({
  mixins: [require('../mixin/common')],
  data: {
    files: [],
    array3: ['电子产品', '家居用品', '服装鞋帽','食品饮料','图书音像','化妆品个护','运动健身','玩具乐器','其他'],
    value3: 0,
  },
  bindPicker1Change(e) {
    this.setData({
      value1: e.detail.value,
    });
  },
  bindPicker2Change(e) {
    this.setData({
      value2: e.detail.value,
    });
  },
  bindPicker3Change(e) {
    this.setData({
      value3: e.detail.value,
    });
  },
});
