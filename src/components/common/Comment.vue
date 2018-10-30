<template>
  <div style="padding:12px">
      <!-- 头像和信息 -->
      <div class="userAndinfo">
        <div class="content">
          <div style="position:relative">
            <img :src="comments.image" />
            <span class="circle" :class="comments.support == 1 ?'':'red_circle'">怼</span>
          </div>
          <!-- 时间和信息 -->
          <div class="user_right">
            <p>{{comments.username}}</p>
            <p class="user_date" v-if="type != 1">{{comments.CreatedAt}}</p>
          </div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="MultipleLine">{{comments.title}}</div>
      <div class="content_bottom" v-if="type == 1">
        <p class="c_date">{{comments.CreatedAt}}</p>
         <!-- 分享 -->
        <div class="shareIcon">
          <!-- 评论 -->
           <img src="../../assets/img/message.png" @tap="user_comment(comments)" v-if="comentShow"/>
           <p></p>
          <!-- 点赞 -->
           <img src="../../assets/img/like.png" v-if="comments.is_appreciate == 0" @tap="user_like(comments)"/>
           <img src="../../assets/img/likeSelected.png" v-else @tap="user_like(comments)"/>
           <p>{{comments.point_count}}</p>
           <button open-type="share" plain='true' v-if="shareShow">
              <img src="../../assets/img/share.png"/></button>
        </div>
      </div>
  </div>
</template>
<script>
import {getStorage, request} from 'utils/index';
export default {
  props: {
    comments: Array,
    type: {
      // 可选字段，有默认值
      default: 1,
    },
    shareShow: {
      // 可选字段，有默认值
      default: true,
    },
    comentShow: {
      // 可选字段，有默认值
      default: true,
    },
  },
  data() {
    return {
      type: 1,
    };
  },
  methods: {
    // 评论
    user_comment(item) {
      // 获取用户信息 用户权限
      getStorage('user')
        .then(data => {
          this.$emit('user_comment', item);
        })
        .catch(e => {
          // 跳转欢迎页
          wx.navigateTo({
            url: '../welcome/main',
          });
        });
    },
    // 点赞
    user_like(item) {
      console.log(item);
      // 获取用户信息 用户权限
      getStorage('user')
        .then(data => {
          let param = {
            url: '/viewpoint/api/ispoint',
            data: {
              tid: item.tid,
              vid: item.Vid, //
              uid: data.uid,
            },
          };
          // 已经点赞过
          request(param)
            .then(res => {
              if (res.code == 200) {
                wx.showToast({
                  title: '你已经点赞过了！',
                  icon: 'none',
                  duration: 1000,
                });
              }
            })
            .then(() => {
              let obj = {
                url: '/viewpoint/api/point',
                method: 'POST',
                data: {
                  tid: item.tid,
                  vid: item.Vid, //
                  uid: item.uid,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded', // 默认值
                },
              };
              // 请求点赞
              request(obj).then(res => {
                if (res.code == 200) {
                  item.is_appreciate = 1; //成功点赞
                  item.point_count += 1; //成功点赞
                  wx.showToast({
                    title: '+1',
                    icon: 'sucess',
                    duration: 1000,
                  });
                }
              });
            });
        })
        .catch(e => {
          // 跳转欢迎页
          wx.navigateTo({
            url: '../welcome/main',
          });
        });
    },
    // 分享用户的话题
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target);
      }
      return {
        title: this.comments.title,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';
.MultipleLine {
  @include MultipleLine(2);
  text-align: left;
  font-size: 14px;
}
// 按钮
.shareIcon {
  img {
    width: 34rpx;
    height: 34rpx;
    vertical-align: middle;
  }
  button {
    line-height: 0;
    border: 0;
  }
}
.userAndinfo {
  height: 120rpx;
  @include content_flex;
  .content {
    display: flex;
    .circle {
      @include circle(32rpx, blue);
      font-size: 10px;
      position: absolute;
      color: #fff;
      text-align: center;
      right: -2px;
      top: 2px;
    }
    .red_circle {
      @include circle(32rpx, red);
    }
    .user_right {
      .user_date {
        font-size: 12px;
        color: #444b55;
      }
    }
    img {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      overflow: hidden;
    }
    p {
      margin-left: 10px;
    }
  }
}
.content_bottom {
  @include content_flex;
  margin-top: 10px;
  .shareIcon {
    font-size: 24rpx;
    @include content_flex;
    p {
      margin: 6rpx 16rpx 0 12rpx;
    }
  }
  .c_date {
    font-size: 26rpx;
    color: #c1c1c1;
  }
}
</style>
