<template>
  <div class="progress" >
      <div class="topFixed" :style="{'opacity':number}">
        <p>{{motion.title}}</p>
        <!-- 进度条 -->
        <i-progress :percent="motion.percent" status="active" 
                    stroke-width="6" hide-info></i-progress>
      </div>
      <!-- 头部图片 -->
      <img src="../../assets/img/indexTopImg.png" class="indexTopImg" mode="widthFix"/>
      <!-- 标题 -->
      <p class="titleSty">{{motion.title}}</p>
      <!-- 参与 -->
      <p class="participatSty">共有{{motion.count}}人参与讨论</p>
      <div class="container">
      <!-- 头部组件 -->
      <indexTop :motion="motion"></indexTop>
      <!--  -->
      <div class="line"></div>
      <!-- 标头 -->
      <div class="allViews">
        <div>
          <span>{{array[index]}}</span>
          <!-- 选择框 -->
          <picker @change="bindPickerChange" :value="index" :range="array" style="display:inline-block">
            <view class="picker">
              <img src="../../assets/img/ranking.png" mode="widthFix"/>
            </view>
          </picker>
        </div>
        <!-- 正反方 -->
        <div>
          <span style="display:inline-block">
            <!-- 圆点 -->
            <div class="votes">
              <span class="circle"></span>
               {{motion.opposite}}条
            </div>
            <!--  -->
            <div class="votes">
              <span class="circle red"></span>
               {{motion.square}}条
            </div>
          </span>
        </div>
      </div>
      <!-- 评论 -->
      <comment :listData = "listData" @comments="user_comment"></comment>
      <!-- 杠图标 -->
      <div class="fixedIcon" @tap="push_comments(motion)">
          <img src="../../assets/img/publishedIcon.png" />
      </div>
  </div>
</div>
</template>

<script>
import indexTop from 'components/card';
import comment from 'components/Comment';
import {
  request,
  formatDate,
  userPermissions,
  getStorage,
  Toast,
} from 'utils/index';

export default {
  components: {indexTop, comment},
  data() {
    return {
      titleId: '',
      limit: 10,
      totalPage: 0,
      offset: 0,
      number: 0, //渐变
      index: 0, //选择框序列号
      array: ['全部观点', '红方观点', '蓝方观点'],
      motion: {
        Support: '',
      }, //辩题信息
      listData: [],
    };
  },
  onShow() {
    //Toast('eeee','sucess')
    this.listData = []; //清空
    if (this.$root.$mp.query.Id) {
      let Id = this.$root.$mp.query.Id;
      this.titleId = Id; //标题
    }
    this.getIndexData();
  },
  // 页面滚动
  onPageScroll(e) {
    if (80 < e.scrollTop <= 180) {
      this.number = (e.scrollTop - 80) / 100;
    } else if (e.scrollTop > 180) {
      this.number = 1;
    } else {
      this.number = 0;
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.offset = 0; //页数重置为0
    this.listData = []; //清空
    // 获取数据
    this.getIndexData();
    wx.stopPullDownRefresh();
  },
  // 下拉加载
  onReachBottom() {
    // 传页数
    if (this.offset > this.totalPage) {
      this.offset++;
      this.getIndexData();
    } else {
      wx.showToast({
        title: '数据加载完毕',
        icon: 'none',
        duration: 1000,
      });
    }
  },
  methods: {
    // 请求首页数据
    getIndexData() {
      var _this = this;
      let uid = '';
      let Support = this.motion.Support == -1 ? '' : this.motion.Support;
      // 传参数
      let obj = {
        url: '/topic/api/list?',
        data: {
          limit: this.limit,
          offset: this.offset,
          tid: this.titleId,
          uid: wx.getStorageSync('user').uid,
          support: Support,
        },
      };
      // 请求首页数据
      request(obj).then(res => {
        this.totalPage = Math.ceil(res.data.rows / 10); //获取页数
        _this.motion = res.data; //列表数据
        let percent;
        if (_this.motion.opposite != 0) {
          percent =
            _this.motion.opposite /
            (this.motion.opposite + this.motion.square) *
            100; //百分比
        } else {
          percent = 0;
        }
        _this.$set(_this.motion, 'percent', percent); //设置百分比
        // 转日期
        _this.motion.Result.forEach(item => {
          item.CreatedAt =
            formatDate(item.CreatedAt).data +
            ' ' +
            formatDate(item.CreatedAt).time;
          if (item.Message != null && item.Message.length > 0) {
            // 评论下的评论转日期
            item.Message.forEach(item => {
              item.CreatedAt = formatDate(item.CreatedAt).time;
            });
          } else {
            item.Message = []; //后台的值为null
          }
        });
        this.listData.push(...this.motion.Result); //追加
      });
    },
    // 没有权限时候跳到登录
    // 跳转发表
    push_comments(motton) {
      let params = {
        support: motton.Support,
        tid: motton.Id,
        title: motton.title,
      };
      let url = '../detail/main?params=' + JSON.stringify(params);
      userPermissions(url); //判断是否有权限
    },
    //
    bindPickerChange(e) {
      this.listData = [];
      this.index = e.mp.detail.value;
      this.motion.Support = e.mp.detail.value - 1;
      this.getIndexData();
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/sass/public.scss';
.progress {
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #ddd;
  margin: 0 auto;
  width: 100%;
  background-color: $mainColor;
  .container {
    width: 94%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 6rpx;
  }
  .titleSty {
    font-size: 26px;
    font-weight: 800;
    text-align: center;
    color: #fff;
  }
  .participatSty {
    text-align: center;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    color: #fff;
  }
}

.allViews {
  @include content_flex;
  font-size: 15px;
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1rpx solid $borderColor;
  border-top: 1rpx solid $borderColor;
  padding: 0 2%;
  .picker {
    margin-left: 20rpx;
    img {
      width: 26rpx;
    }
  }
}
</style>
<template>
  <div class="progress" >
      <div class="topFixed" :style="{'opacity':number}">
        <p>{{motion.title}}</p>
        <!-- 进度条 -->
        <i-progress :percent="motion.percent" status="active" 
                    stroke-width="6" hide-info></i-progress>
      </div>
      <!-- 头部图片 -->
      <img src="../../assets/img/indexTopImg.png" class="indexTopImg" mode="widthFix"/>
      <!-- 标题 -->
      <p class="titleSty">{{motion.title}}</p>
      <!-- 参与 -->
      <p class="participatSty">共有{{motion.count}}人参与讨论</p>
      <div class="container">
      <!-- 头部组件 -->
      <indexTop :motion="motion"></indexTop>
      <!--  -->
      <div class="line"></div>
      <!-- 标头 -->
      <div class="allViews">
        <div>
          <span>{{array[index]}}</span>
          <!-- 选择框 -->
          <picker @change="bindPickerChange" :value="index" :range="array" style="display:inline-block">
            <view class="picker">
              <img src="../../assets/img/ranking.png" mode="widthFix"/>
            </view>
          </picker>
        </div>
        <!-- 正反方 -->
        <div>
          <span style="display:inline-block">
            <!-- 圆点 -->
            <div class="votes">
              <span class="circle"></span>
               {{motion.opposite}}条
            </div>
            <!--  -->
            <div class="votes">
              <span class="circle red"></span>
               {{motion.square}}条
            </div>
          </span>
        </div>
      </div>
      <!-- 评论 -->
      <comment :listData = "listData" @comments="user_comment"></comment>
      <!-- 杠图标 -->
      <div class="fixedIcon" @tap="push_comments(motion)">
          <img src="../../assets/img/publishedIcon.png" />
      </div>
  </div>
</div>
</template>

<script>
import indexTop from 'components/card';
import comment from 'components/Comment';
import {
  request,
  formatDate,
  userPermissions,
  getStorage,
  Toast,
} from 'utils/index';

export default {
  components: {indexTop, comment},
  data() {
    return {
      titleId: '',
      limit: 10,
      totalPage: 0,
      offset: 0,
      number: 0, //渐变
      index: 0, //选择框序列号
      array: ['全部观点', '红方观点', '蓝方观点'],
      motion: {
        Support: '',
      }, //辩题信息
      listData: [],
    };
  },
  onShow() {
    //Toast('eeee','sucess')
    this.listData = []; //清空
    if (this.$root.$mp.query.Id) {
      let Id = this.$root.$mp.query.Id;
      this.titleId = Id; //标题
    }
    this.getIndexData();
  },
  // 页面滚动
  onPageScroll(e) {
    if (80 < e.scrollTop <= 180) {
      this.number = (e.scrollTop - 80) / 100;
    } else if (e.scrollTop > 180) {
      this.number = 1;
    } else {
      this.number = 0;
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.offset = 0; //页数重置为0
    this.listData = []; //清空
    // 获取数据
    this.getIndexData();
    wx.stopPullDownRefresh();
  },
  // 下拉加载
  onReachBottom() {
    // 传页数
    if (this.offset > this.totalPage) {
      this.offset++;
      this.getIndexData();
    } else {
      wx.showToast({
        title: '数据加载完毕',
        icon: 'none',
        duration: 1000,
      });
    }
  },
  methods: {
    // 请求首页数据
    getIndexData() {
      var _this = this;
      let uid = '';
      let Support = this.motion.Support == -1 ? '' : this.motion.Support;
      // 传参数
      let obj = {
        url: '/topic/api/list?',
        data: {
          limit: this.limit,
          offset: this.offset,
          tid: this.titleId,
          uid: wx.getStorageSync('user').uid,
          support: Support,
        },
      };
      // 请求首页数据
      request(obj).then(res => {
        this.totalPage = Math.ceil(res.data.rows / 10); //获取页数
        _this.motion = res.data; //列表数据
        let percent;
        if (_this.motion.opposite != 0) {
          percent =
            _this.motion.opposite /
            (this.motion.opposite + this.motion.square) *
            100; //百分比
        } else {
          percent = 0;
        }
        _this.$set(_this.motion, 'percent', percent); //设置百分比
        // 转日期
        _this.motion.Result.forEach(item => {
          item.CreatedAt =
            formatDate(item.CreatedAt).data +
            ' ' +
            formatDate(item.CreatedAt).time;
          if (item.Message != null && item.Message.length > 0) {
            // 评论下的评论转日期
            item.Message.forEach(item => {
              item.CreatedAt = formatDate(item.CreatedAt).time;
            });
          } else {
            item.Message = []; //后台的值为null
          }
        });
        this.listData.push(...this.motion.Result); //追加
      });
    },
    // 没有权限时候跳到登录
    // 跳转发表
    push_comments(motton) {
      let params = {
        support: motton.Support,
        tid: motton.Id,
        title: motton.title,
      };
      let url = '../detail/main?params=' + JSON.stringify(params);
      userPermissions(url); //判断是否有权限
    },
    //
    bindPickerChange(e) {
      this.listData = [];
      this.index = e.mp.detail.value;
      this.motion.Support = e.mp.detail.value - 1;
      this.getIndexData();
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/sass/public.scss';
.progress {
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #ddd;
  margin: 0 auto;
  width: 100%;
  background-color: $mainColor;
  .container {
    width: 94%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 6rpx;
  }
  .titleSty {
    font-size: 26px;
    font-weight: 800;
    text-align: center;
    color: #fff;
  }
  .participatSty {
    text-align: center;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    color: #fff;
  }
}

.allViews {
  @include content_flex;
  font-size: 15px;
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1rpx solid $borderColor;
  border-top: 1rpx solid $borderColor;
  padding: 0 2%;
  .picker {
    margin-left: 20rpx;
    img {
      width: 26rpx;
    }
  }
}
</style>
<template>
  <div class="progress" >
      <div class="topFixed" :style="{'opacity':number}">
        <p>{{motion.title}}</p>
        <!-- 进度条 -->
        <i-progress :percent="motion.percent" status="active" 
                    stroke-width="6" hide-info></i-progress>
      </div>
      <!-- 头部图片 -->
      <img src="../../assets/img/indexTopImg.png" class="indexTopImg" mode="widthFix"/>
      <!-- 标题 -->
      <p class="titleSty">{{motion.title}}</p>
      <!-- 参与 -->
      <p class="participatSty">共有{{motion.count}}人参与讨论</p>
      <div class="container">
      <!-- 头部组件 -->
      <indexTop :motion="motion"></indexTop>
      <!--  -->
      <div class="line"></div>
      <!-- 标头 -->
      <div class="allViews">
        <div>
          <span>{{array[index]}}</span>
          <!-- 选择框 -->
          <picker @change="bindPickerChange" :value="index" :range="array" style="display:inline-block">
            <view class="picker">
              <img src="../../assets/img/ranking.png" mode="widthFix"/>
            </view>
          </picker>
        </div>
        <!-- 正反方 -->
        <div>
          <span style="display:inline-block">
            <!-- 圆点 -->
            <div class="votes">
              <span class="circle"></span>
               {{motion.opposite}}条
            </div>
            <!--  -->
            <div class="votes">
              <span class="circle red"></span>
               {{motion.square}}条
            </div>
          </span>
        </div>
      </div>
      <!-- 评论 -->
      <comment :listData = "listData" @comments="user_comment"></comment>
      <!-- 杠图标 -->
      <div class="fixedIcon" @tap="push_comments(motion)">
          <img src="../../assets/img/publishedIcon.png" />
      </div>
  </div>
</div>
</template>

<script>
import indexTop from 'components/card';
import comment from 'components/Comment';
import {
  request,
  formatDate,
  userPermissions,
  getStorage,
  Toast,
} from 'utils/index';

export default {
  components: {indexTop, comment},
  data() {
    return {
      titleId: '',
      limit: 10,
      totalPage: 0,
      offset: 0,
      number: 0, //渐变
      index: 0, //选择框序列号
      array: ['全部观点', '红方观点', '蓝方观点'],
      motion: {
        Support: '',
      }, //辩题信息
      listData: [],
    };
  },
  onShow() {
    //Toast('eeee','sucess')
    this.listData = []; //清空
    if (this.$root.$mp.query.Id) {
      let Id = this.$root.$mp.query.Id;
      this.titleId = Id; //标题
    }
    this.getIndexData();
  },
  // 页面滚动
  onPageScroll(e) {
    if (80 < e.scrollTop <= 180) {
      this.number = (e.scrollTop - 80) / 100;
    } else if (e.scrollTop > 180) {
      this.number = 1;
    } else {
      this.number = 0;
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.offset = 0; //页数重置为0
    this.listData = []; //清空
    // 获取数据
    this.getIndexData();
    wx.stopPullDownRefresh();
  },
  // 下拉加载
  onReachBottom() {
    // 传页数
    if (this.offset > this.totalPage) {
      this.offset++;
      this.getIndexData();
    } else {
      wx.showToast({
        title: '数据加载完毕',
        icon: 'none',
        duration: 1000,
      });
    }
  },
  methods: {
    // 请求首页数据
    getIndexData() {
      var _this = this;
      let uid = '';
      let Support = this.motion.Support == -1 ? '' : this.motion.Support;
      // 传参数
      let obj = {
        url: '/topic/api/list?',
        data: {
          limit: this.limit,
          offset: this.offset,
          tid: this.titleId,
          uid: wx.getStorageSync('user').uid,
          support: Support,
        },
      };
      // 请求首页数据
      request(obj).then(res => {
        this.totalPage = Math.ceil(res.data.rows / 10); //获取页数
        _this.motion = res.data; //列表数据
        let percent;
        if (_this.motion.opposite != 0) {
          percent =
            _this.motion.opposite /
            (this.motion.opposite + this.motion.square) *
            100; //百分比
        } else {
          percent = 0;
        }
        _this.$set(_this.motion, 'percent', percent); //设置百分比
        // 转日期
        _this.motion.Result.forEach(item => {
          item.CreatedAt =
            formatDate(item.CreatedAt).data +
            ' ' +
            formatDate(item.CreatedAt).time;
          if (item.Message != null && item.Message.length > 0) {
            // 评论下的评论转日期
            item.Message.forEach(item => {
              item.CreatedAt = formatDate(item.CreatedAt).time;
            });
          } else {
            item.Message = []; //后台的值为null
          }
        });
        this.listData.push(...this.motion.Result); //追加
      });
    },
    // 没有权限时候跳到登录
    // 跳转发表
    push_comments(motton) {
      let params = {
        support: motton.Support,
        tid: motton.Id,
        title: motton.title,
      };
      let url = '../detail/main?params=' + JSON.stringify(params);
      userPermissions(url); //判断是否有权限
    },
    //
    bindPickerChange(e) {
      this.listData = [];
      this.index = e.mp.detail.value;
      this.motion.Support = e.mp.detail.value - 1;
      this.getIndexData();
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/sass/public.scss';
.progress {
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #ddd;
  margin: 0 auto;
  width: 100%;
  background-color: $mainColor;
  .container {
    width: 94%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 6rpx;
  }
  .titleSty {
    font-size: 26px;
    font-weight: 800;
    text-align: center;
    color: #fff;
  }
  .participatSty {
    text-align: center;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    color: #fff;
  }
}

.allViews {
  @include content_flex;
  font-size: 15px;
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1rpx solid $borderColor;
  border-top: 1rpx solid $borderColor;
  padding: 0 2%;
  .picker {
    margin-left: 20rpx;
    img {
      width: 26rpx;
    }
  }
}
</style>
