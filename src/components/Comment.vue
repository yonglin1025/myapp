<template>
  <div>
    <div v-for="(item,index) in listData" :key="index" class="listItem">
      <!-- 评论 -->
      <comments :comments="item" @user_comment="user_comment" :comentShow="comentShow"></comments>
      <!-- 展示评论 -->
      <div class=" past_comment" v-if="item.Message && item.Message.length>0">
        <p>{{item.Message[0].username}}:&nbsp;{{item.Message[0].rcontent}}</p>
        <div @tap="detailComments(item)">
         <p style="color:#149DFE">共{{item.rows}}条回复 ></p>  
        </div>
      </div>
      <!-- 辩题 -->
      <div class="past_comment" v-if="item.topic_title">
        <p>{{item.topic_title}}</p>
          <span style="display:inline-block;margin-top:16rpx;">
            <!-- 圆点 -->
            <div class="votes" v-if="item.support == 1">
              <span class="circle"></span>
               &nbsp;蓝方有错
            </div>
            <!--  -->
            <div class="votes" v-if="item.support == 0">
              <span class="circle red"></span>
               &nbsp;红方没错
            </div>
          </span>
      </div>
    </div>
    <!-- 弹框 -->
    <div v-show="show_bounce">
      <bounce :comment="currentReview" @sucess="sucess" @cancelBounce="cancelBounce"></bounce>
    </div>
  </div>
</template>
<script>
import comments from 'components/common/Comment';
import bounce from 'components/bounced';
import {getStorage} from 'utils/index';
export default {
  components: {comments, bounce},
  props: ['listData', 'comentShow'],
  data() {
    return {
      show_bounce: false, //评论弹框
      currentReview: '', //当前评论的用户信息
    };
  },
  created() {
    wx.showShareMenu();
  },
  methods: {
    // 评论
    user_comment(item) {
      this.currentReview = item;
      this.show_bounce = true; //显示弹框
      this.$emit('cuccess_ment');
    },
    // 隐藏弹框
    cancelBounce() {
      this.show_bounce = false;
    },
    // 评论成功
    sucess(comment) {
      this.show_bounce = false; //关闭弹框
      let id = comment.vid; //获取用户vid
      wx.showToast({
        title: '评论成功',
        icon: 'success',
        duration: 1000,
      });
      // 成功追加数据
      this.listData.forEach(element => {
        if (element.Vid == id) {
          element.rows++; //评论数加一
          element.Message.unshift({
            username: comment.name,
            rcontent: comment.content,
          });
        }
      });
    },
    // 跳转评论列表
    detailComments(item) {
      getStorage('user')
        .then(data => {
          wx.navigateTo({
            url: '../DetailsComments/main?item=' + JSON.stringify(item),
          });
        })
        .catch(e => {
          // 跳转欢迎页
          wx.navigateTo({
            url: '../welcome/main',
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';
.listItem {
  width: 92%;
  margin: 0 auto;
  padding-bottom: 10rpx;
  border-bottom: 1px solid $borderColor;
  color: black;
  .past_comment {
    padding: 20rpx;
    background-color: #eeeeee;
    font-size: 14px;
    border-radius: 12rpx;
    text-align: left;
  }
}
</style>
