<!--  -->
<template>
  <div class="BaseRouter">
    <div>
      <van-cell :title="titleLeft" :to="leftTo" replace />
    </div>
    <div>
      <van-cell :title="titleRight" :to="rigthTo" replace />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["titleLeft", "leftTo", "titleRight", "rigthTo"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.BaseRouter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.BaseRouter /deep/.van-icon {
  font-size: 1rem !important;
}
.van-cell {
  padding: 0;
  margin: 10px 0;
  color: gray;
}
.van-cell__right-icon:first-child {
  border-right: 1px solid;
}
</style>