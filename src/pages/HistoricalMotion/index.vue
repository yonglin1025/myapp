<template>
  <div>
    <div v-for="motion in past_list" :key='motion.Id'>
      <div class="container" @tap="jumpIndex(motion.Id)">
        <div class="content">
          <!-- 标题 -->
          <div class="conten_title">
            <div class="title">{{motion.title}}</div>
            <div class="date">
              <span>{{motion.CreatedAt}}</span>
              <i class="iconfont icon-youjiantou"></i>
            </div>
          </div>
          <!-- 头部组件 -->
          <indexTop :motion="motion"></indexTop>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {request, formatDate} from 'utils/index';
import indexTop from 'components/card';
export default {
  components: {indexTop},
  data() {
    return {
      offset: 0,
      limit: 10,
      past_list: [],
    };
  },
  // 小程序加载会执行
  onShow() {
    // 传参数
    let obj = {
      url: '/topic/api/hislist?offset=' + this.offset + '&limit=' + this.limit,
    };
    // 请求数据
    request(obj).then(res => {
      res.data.forEach(item => {
        item.CreatedAt = formatDate(item.CreatedAt).data;
        let percent;
        if (item.opposite != 0) {
          percent =
            item.opposite /
            (item.opposite + item.square) *
            100; //百分比
        } else {
          percent = 0;
        }
        this.$set(item, 'percent', percent);
      });
      this.past_list = res.data;
    });
  },
  methods: {
    jumpIndex(Id) {
      wx.navigateTo({
        url: '../past_detail/main?Id=' + Id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';
.container {
  padding-top: 26rpx;
  .conten_title {
    @include content_flex;
    width: 94%;
    margin: 0 auto;
    padding-top: 24rpx;
    .title {
      @include singLine;
      width: 80%;
      font-size: 16px;
    }
    .date {
      font-size: 28rpx;
      @include content_flex;
      .iconfont {
        margin-left: 12rpx;
        font-size: 10px;
        margin-top: 5px;
      }
    }
  }
  .content {
    width: 96%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 12rpx;
  }
}
</style>
