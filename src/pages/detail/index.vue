<template>
  <div class="motion_container">
      <img src="../../assets/img/indexTopImg.png" class="indexTopImg" mode="widthFix"/>
      <!-- 辩题题目 -->
      <div class="motion_title">
        {{title}}
      </div>
      <!-- radio 组 -->
      <div class="radio_group">
          <!--  -->
          <div class="radio" v-for="(item,index) in items" :key="index">
              <label @tap="radioChange(item)">
                <!-- 默认radio gray_radio -->
                <div class="gray_radio"
                    :class="{'comments_radio':selectedRadio == 1&&index ==1,
                    'red_radio':selectedRadio == 0&&index ==0}"
                   ></div>
                <p>{{item.name}}</p>
              </label>
              <!-- 文本域 -->
              <div class="textareaSty" v-show="selectedRadio == item.value">
                  <textarea placeholder="请输入自己的观点，字数不超过150个字" 
                            maxlength="150" v-model.lazy="params.title"/>
              </div>
          </div>
          <button @tap="submitMotion" class="submitBut">确认</button>
      </div>
  </div>
</template>

<script>
import {request, getStorage} from 'utils/index';
export default {
  data() {
    return {
      selectedRadio: 3,
      isRadio: false,
      title: '',
      params: {
        support: '',
        tid: 0,
        uid: '',
        title: '',
      },
      items: [{name: '有错', value: '0'}, {name: '没错', value: '1'}],
    };
  },
  beforeMount() {
    this.isRadio = false;
    let params = JSON.parse(this.$root.$mp.query.params);
    this.title = params.title; //标题
    this.params.tid = params.tid; //标题id
    console.log(params);
    // 判断是否加入战队
    if (params.support == 0 || params.support == 1) {
      this.selectedRadio = params.support; //支持方
      this.params.support = params.support;
      this.isRadio = true;
    }else{
      this.selectedRadio = 3;
    }
  },
  methods: {
    // 改变radio
    radioChange(item) {
      console.log(item)
      if (this.isRadio) {
        wx.showToast({
          title: '不能更改战队',
          icon: 'none',
          duration: 1000,
        });
        return;
      }
      this.selectedRadio = item.value;
      this.params.support = item.value; //0-红方  1-蓝方
    },
    // 提交
    submitMotion() {
      var _this = this;
      if (this.params.title == '') {
        wx.showToast({
          title: '请填写留言',
          icon: 'none',
          duration: 1000,
        });
        return;
      }
      // 获取用户的uid
      getStorage('user').then(user => {
        this.params.uid = user.uid;
        let obj = {
          url: '/viewpoint/api/support',
          data: this.params,
          header: {
            'content-type': 'application/x-www-form-urlencoded', // 默认值
          },
          method: 'POST',
        };
        request(obj).then(res => {
          this.params.title = ''; //清空评论内容
          if (res.code == 200) {
            // 成功跳转 位置是否位于TabBar中，如果是的话，要使用wx.switchTab 来跳转界面
            wx.navigateBack({
              url: '../index/main',
            });
          }
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/assets/sass/public.scss';
.motion_container {
  color: #fff;
  .motion_title {
    text-align: center;
    font-size: 40rpx;
    font-weight: 600;
  }
  .radio_group {
    width: 90%;
    margin: 8px auto;
    border: 1px solid $borderColor;
    border-radius: 4px;
    background-color: #fff;
    .radio {
      padding: 24rpx;
      padding-bottom: 0;
      padding-top: 8px;
      .gray_radio {
        @include circle(14px, #dbd9d5);
        margin-top: 17px;
        margin-right: 8px;
      }
      .comments_radio {
        @include circle(14px, blue);
        margin-top: 17px;
        margin-right: 8px;
      }
      .red_radio {
        @include circle(14px, red);
      }
      label {
        display: flex;
        color: #706e69;
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
</style>
