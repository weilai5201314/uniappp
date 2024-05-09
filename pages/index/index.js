// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  // 添加登录按钮点击事件处理函数
  onLogin() {
    // 调用 wx.login 获取用户登录凭证 code
    wx.login({
      success: (res) => {
        if (res.code) {
          const code = res.code;
          console.log("登录凭证code是(0a3rUl):" + code);
          // 获取用户信息
          wx.getUserInfo({
            success: (info) => {
              const userInfo = info.userInfo;
              console.log('用户信息：', userInfo);
              
              // 将 code 和用户信息发送到后端服务器进行验证
              wx.request({
                url: 'http://localhost:12345/login',
                method: 'POST',
                data: {
                  code: code,
                  avatarUrl: userInfo.avatarUrl, // 将用户头像URL发送到后端
                  nickname: userInfo.nickName // 将用户昵称发送到后端
                },
                success: (res) => {
                  console.log('登录成功：', res.data);
                  // 可以在这里处理登录成功后的逻辑
                  wx.switchTab({  
                    url: '/pages/home/home'  
                  });

                },
                fail: (err) => {
                  console.error('登录失败：', err);
                }
              });
            },
            fail: (err) => {
              console.error('获取用户信息失败：', err);
            }
          });
        } else {
          console.error('获取用户登录凭证失败：', res.errMsg);
        }
      },
      fail: (err) => {
        console.error('wx.login 调用失败：', err);
      },
      complete: (e) => {
        console.log('wx.login 调用结束');
      }
    });
  },
});
