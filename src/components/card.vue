<template>
  <div>
    <div style="width:92%;margin:0 auto;padding:12px 0;">
      <div class="progress_n" v-if="motion.flag_red == 0&&motion.flag_green == 0"></div>
      <!-- 进度条 -->
       <i-progress :percent="motion.percent" status="active" v-else
                    stroke-width="20" hide-info></i-progress>
      <!-- 投票  -->
      <div class="team">
        <span style="color:#149DFE">没错 {{motion.flag_green}}票</span>
        <span style="color:red">有错 {{motion.flag_red}}票</span> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['motion'],
    data() {
    return {
     
    };
  },
};
</script>

<style lang="scss">
@import '@/assets/sass/public.scss';
  .team {
    @include content_flex;
    margin-top: 8px;
    font-size: 30rpx;
  }
  .progress_n{
    width: 100%;
    height: 44rpx;
    background-color: #ddd;
    border-radius: 22px;
  }
</style>
