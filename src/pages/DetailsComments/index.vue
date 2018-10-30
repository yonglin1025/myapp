<template>
  <div class="listItem">
    <div class="detail_list">
      <div class="user_comments">
        <comments :comments='comments' @user_comment="user_comment" :shareShow='false'></comments>
      </div>
      <!-- 所有评论 -->
      <div v-for="(item,index) in listData" :key="index" class="list_container">
        <comments :comments='item' type=2></comments>
      </div>
    </div>
    <!-- 弹框 -->
    <div v-show="show_bounce">
      <bounce :comment="comments" @sucess="sucess" @cancelBounce="cancelBounce"></bounce>
    </div>
  </div>
</template>

<script>
import comments from 'components/common/Comment';
import bounce from 'components/bounced';
import {getStorage, request, formatDate} from 'utils/index';
export default {
  components: {comments, bounce},
  data() {
    return {
      comments: {},
      show_bounce: false, //评论弹框
      listData: [],
      param: '', //传递过来的参数
    };
  },
  onShow() {
    this.getData();
  },
  methods: {
    // 获取接口数据
    getData() {
      this.param = JSON.parse(this.$root.$mp.query.item); //传递的参数
      var _this = this;
      console.log(this.param);
      getStorage('user').then(data => {
        let params = {
          url: '/viewpoint/api/replay',
          data: {
            tid: _this.param.tid,
            vid: _this.param.Vid, //
            uid: _this.param.uid,
          },
        };
        request(params).then(obj => {
          this.comments = obj.userinfo; //获取用户评论信息
          // 评论转日期
          this.comments.CreatedAt = formatDate(this.comments.CreatedAt).time;
          this.comments.tid = this.param.tid; //话题ID
          this.listData = obj.result;
          // 评论转日期
          this.listData.forEach(item => {
            item.CreatedAt = formatDate(item.CreatedAt).time;
          });
        });
      });
    },
    // 评论
    user_comment(item) {
      this.show_bounce = true; //显示弹框
    },
    // 评论成功
    sucess(data) {
      console.log(data);
      wx.showToast({
        title: '评论成功',
        icon: 'success',
        duration: 1000,
      });
      this.show_bounce = false;
      this.listData = []; //清空数据
      this.getData();
    },
    cancelBounce() {
      this.show_bounce = false; //隐藏弹框
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/sass/public.scss';
.listItem {
  background-color: #f7f7f7;
  .detail_list {
    .user_comments {
      background-color: #fff;
      border-bottom: 1rpx solid #ddd;
    }
    .list_container {
      border-bottom: 1rpx solid #ddd;
      .userAndinfo {
        .content {
          font-size: 16px;
          display: flex;
          img {
            width: 80rpx !important;
            height: 80rpx !important;
          }
        }
      }
    }
  }
}
</style>
