<template>
  <div class="counter-warp">
    <!-- 用户信息 -->
    <div class="userAvatarUrl">
      <img :src="user.avatarUrl"/>
    </div>
    <!--  点击登录-->
    <button open-type="getUserInfo" plain='true' 
            v-if="user.nickName == ''"
            @getuserinfo="bindGetUserInfo">点击登录</button>
    <!-- 用户名字 -->
    <p v-else>{{user.nickName}}</p>
    <!-- 获赞数 -->
    <div class="user_info" v-if="user.nickName !=''">
      <span style="border-right:1px solid #ddd">
        {{comment.count_houzhan}}怼评
        </span>
      <span>
        {{comment.count_duipin}}获赞
      </span>
    </div>
    <!-- 用户评论辩题 -->
    <div class="comment_detail">
      <comment :listData = "listData" :comentShow="false"></comment>
    </div>
  </div>
</template>

<script>
import comment from 'components/Comment';
import {request, getStorage, formatDate, setStorage} from 'utils/index';
export default {
  components: {comment},
  data() {
    return {
      limit: 10,
      offset: 0,
      comments: 20,
      totalPage: 0,
      user: {
        nickName: '',
      },
      comment: {},
     listData:[],
    };
  },
  onShow() {
    this.listData = [];//清空数据
    this.getData();
  },
  // 下拉加载
  onReachBottom() {
    if (this.offset > this.totalPage) {
      // 传页数
      this.offset++;
      this.getData();
    } else {
      wx.showToast({
        title: '数据加载完毕',
        icon: 'none',
        duration: 1000,
      });
    }
  },
  methods: {
    // 获取用户权限
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
              that.getData();//获取数据
            });
          }
        },
      });
    },
    // 获取数据
    getData() {
      // 获取用户信息
      getStorage('user').then(data => {
        this.user = data;
        // 传参数
        let obj = {
          url: '/user/api/mylist',
          data: {
            limit: this.limit,
            offset: this.offset,
            uid: this.user.uid,
          },
        };
        // 请求用户数据
        request(obj).then(res => {
          this.comment = res.data;
          this.totalPage = Math.ceil(res.data.rows / 10); //获取页数
          this.comment.Result.forEach(element => {
            element.CreatedAt = formatDate(element.CreatedAt).data; //格式化日期
          });
          this.listData.push(... this.comment.Result);//追加数据
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';
.counter-warp {
  padding-top: 40rpx;
  text-align: center;
  height: 100%;
  color: #fff;
  .userAvatarUrl {
    width: 164rpx;
    height: 164rpx;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .user_info {
    @include content_flex;
    width: 50%;
    margin: 40rpx auto;
    span {
      display: block;
      width: 50%;
      font-size: 34rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
    }
  }
  button {
    padding: 0;
    border: 0;
    color: #fff;
  }
  .comment_detail {
    background-color: #fff;
    border-radius: 12rpx;
  }
}
</style>
