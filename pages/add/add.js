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
        isQuantityWarning: false, // 数量警告标志
        imagePath: []
    },
    // 页面加载时从 storage 中获取 openid
    onLoad: function () {
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

    chooseMedia: function () {
        if (this.data.files.length >= 3) {
            // 如果已选择的图片数量达到了限制，则不执行选择图片的操作
            wx.showToast({
                title: '最多只能上传3张图片',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        const remainingCount = 3 - this.data.files.length; // 计算剩余可选图片数量
        wx.chooseMedia({
            count: remainingCount, // 设置剩余可选图片数量
            sizeType: ['compressed'], // 压缩图片
            sourceType: ['album', 'camera'], // 从相册或相机中选择
            success: (res) => {
                const tempFilePaths = res.tempFiles.map((file) => file.tempFilePath); // 提取临时文件路径
                this.setData({
                    files: this.data.files.concat(tempFilePaths)
                });
            },
        });
    },


    // 删除图片
    removeImage: function (e) {
        const index = e.currentTarget.dataset.index;
        const files = this.data.files;
        files.splice(index, 1);
        this.setData({
            files: files
        });
    },


    // 上传多张图片函数
    uploadImages: function () {
        const openid = this.data.openid;
        const files = this.data.files;

        return new Promise((resolve, reject) => {
            if (!openid || files.length === 0) {
                wx.showToast({
                    title: '请先选择图片',
                    icon: 'none',
                    duration: 2000
                });
                reject('No openid or files selected');
                return;
            }

            wx.showLoading({
                title: '图片上传中...',
                mask: true
            });

            const uploadPromises = files.map((filePath) => {
                return new Promise((resolve, reject) => {
                    wx.uploadFile({
                        url: config.baseUrl + '/uploadImage',
                        filePath: filePath,
                        name: 'file',
                        formData: {
                            openid: openid
                        },
                        success: (res) => {
                            const data = JSON.parse(res.data);
                            if (res.statusCode === 200 && data && data.imagePath) {
                                console.log(data);
                                this.setData({
                                    imagePath: this.data.imagePath.concat(data.imagePath)
                                });
                                resolve(data.imagePath);
                            } else {
                                reject('Image upload failed');
                            }
                        },
                        fail: (err) => {
                            reject(err);
                        }
                    });
                });
            });

            Promise.all(uploadPromises)
                .then((imagePaths) => {
                    wx.hideLoading();
                    resolve(imagePaths);
                })
                .catch((err) => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '图片上传失败',
                        icon: 'none',
                        duration: 2000
                    });
                    reject(err);
                });
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

        // 先上传图片
        this.uploadImages()
            .then(() => {
                // 获取填写的商品信息
                const openid = this.data.openid;
                const productName = this.data.productName;
                const price = this.data.price;
                const description = this.data.description;
                const category = this.data.array3[this.data.value3]; // 获取选择的种类
                const quantity = this.data.quantity;
                const imagepath = this.data.imagePath;
                console.log("bb:" + imagepath)
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
                        imagePath: imagepath
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
            })
            .catch((err) => {
                console.log(err);
            });
    },


});