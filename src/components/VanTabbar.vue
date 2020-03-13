<!--  -->
<template>
  <div class="tab">
    <van-tabbar route active-color="#1989fa" inactive-color="#000">
      <van-tabbar-item replace to="/" icon="wap-home-o">赛事</van-tabbar-item>
      <van-tabbar-item replace to="/equipment" icon="hot-o">装备</van-tabbar-item>
      <!-- <van-tabbar-item icon="add-square" class="add" @click="add">发布</van-tabbar-item> -->
      <van-tabbar-item replace to="/communicate" icon="chat-o" :info="unread_num">交流</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="manager-o" :info="newMessage">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  props: ["unread_num", "newMessage"],
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    add() {
      //console.log(1);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.tab/deep/.add {
  color: #1989fa !important;
  position: absolute;
  //top: -0.3rem;
  width: 50px;
  height: 50px;
  border: 5px solid yellow;
  border-bottom: none;
  border-radius: 50%;
  background-color: red;
}
</style>