Page({
  mixins: [require('../mixin/common')],
  data: {
    inputShowed: false,
    inputVal: '',
    isFocus: false,
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
