<template>
    <div>
      <div class="background_cover" @tap="cancelBounce"></div>
      <div class="bounce_container">
        <!-- 文本域 -->
        <div class="textareaSty">
            <textarea placeholder="请输入自己的观点，字数不超过150个字" 
                      maxlength="150" v-model.lazy="content"/>
        </div>
        <button @tap="submitMotion"  class="submitBut">确认</button>
      </div>
    </div>
</template>

<script>
import {getStorage, request} from 'utils/index';
export default {
  props: ['comment'],
  data() {
    return {
      content: '',
    };
  },
  methods: {
    // 取消弹框
    cancelBounce() {
      this.$emit('cancelBounce');
    },
    // 提交
    submitMotion() {
      if (this.content == '') {
        wx.showToast({
          title: '请填写留言',
          icon: 'none',
          duration: 1000,
        });
      } else {
        getStorage('user').then(data => {
          // 提交信息
          let obj = {
            url: '/viewpoint/api/speak',
            data: {
              uid: this.comment.uid, //被评论者
              vid: this.comment.Vid,
              content: this.content, //内容
              rid: data.uid, //评论者
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded', // 默认值
            },
            method: 'POST',
          };
          request(obj).then(res => {
            if (res.code == 200) {
              let obj = {
                vid: this.comment.Vid,
                content: this.content,
                name: data.nickName,
              };
              this.$emit('sucess', obj);
              this.content = '';
            }
          });
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/assets/sass/public.scss';
.background_cover {
  @include background_cover(0.5);
}
</style>
