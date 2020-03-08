<!--  -->
<template>
  <div class="vanNavBar">
    <van-nav-bar
      :title="title"
      left-arrow
      border
      @click-left="onClickLeft"
      fixed
      :z-index="3000"
      :style="{backgroundColor:bgColor?bgColor:'',borderBottom:bgColor?'1px solid #DBDBDB':''}"
      @click-right="onClickRight"
    >
      <van-icon v-if="showRight" name="weapp-nav" slot="right" />
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: ["title", "bgColor", "showRight", "username"],
  computed: {},
  watch: {},
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      this.$router.push({
        name: "MineConcernUserInfo",
        query: { username: this.username }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
.van-nav-bar .van-icon {
  color: #969799 !important;
  font-size: 0.5rem !important;
}
</style>