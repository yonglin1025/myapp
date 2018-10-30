<template>
  <div class="container">
   <img src="../../assets/img/welcome.png" class="welcome_image"/>
   <button open-type="getUserInfo"
          @getuserinfo="bindGetUserInfo" >授权登录</button>
  </div>
</template>
<script>
import {request, setStorage, getStorage} from 'utils/index';
export default {
  data() {
    return {
      user: {},
    };
  },
  methods: {
    // 发送用户信息
    sendUser() {
      // 传参数
      let param = {
        url: '/user/api/send',
        data: this.user,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
        },
      };
      // 发送用户信息
      request(param).then(res => {});
    },
    bindGetUserInfo(e) {
      var that = this;
      this.user = e.mp.detail.userInfo;
      // 请求数据
      wx.login({
        success(res) {
          if (res.code) {
            let obj = {
              url: '/user/api/search',
              data: {
                code: res.code,
              },
            };
            // 获取用户openid
            request(obj).then(data => {
              that.user.uid = data.data.openid;
              // 保存用户信息
              setStorage('user', that.user);
              // 跳转首页
              wx.navigateBack();
              that.sendUser();
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .welcome_image {
    height: 100%;
    width: 100%;
  }
  button {
    position: fixed;
    bottom: 50px;
    border: 4px solid #000;
    left: 50%;
    background-color: #fff;
    border-radius: 100px;
    width: 200px;
    transform: translate(-50%);
    margin: 0 auto;
  }
}
</style>
