<template>
  <div id="app">
    <!-- <GetLocation></GetLocation> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <van-tabbar v-show="$route.meta.VanTabbar" :unread_num="unread_num"></van-tabbar>
  </div>
</template>

<script>
import VanTabbar from "@/components/VanTabbar";
import GetLocation from "@/components/GetLocation";
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    unread_num() {
      return this.$store.getters.unread_num == 0
        ? ""
        : this.$store.getters.unread_num;
    }
  },
  components: {
    "van-tabbar": VanTabbar,
    GetLocation
  },
  created() {
    //解决页面刷新vuex丢失

    let store = window.sessionStorage.getItem("store");
    if (store !== null) {
      this.$store.replaceState(
        Object.assign({}, this.$store.state, JSON.parse(store))
      );
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      this.$store.commit("socketStateChange", false);
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));

      window.localStorage.setItem(
        "chat_list",
        JSON.stringify(this.$store.state.socket.chat_list)
      );

      window.localStorage.setItem(
        "comment_list",
        JSON.stringify(this.$store.state.socket.comment_list)
      );

      //window.localStorage.removeItem('comment_list')
    });

    if (window.localStorage.token) {
      this.$store
        .dispatch("getUserInfo", window.localStorage.username)
        .then(res => {
          console.log(res);
        });
    }
  },
  mounted() {},
  sockets: {
    // connect(data) {
    //   //this.id = this.$socket.id;
    //   //this.$socket.emit("login", loginId); //监听connect事件
    //   console.log("连接成功" + data);
    // },
    // reconnect(data) {
    //   console.log("重新连接" + data);
    // },
    // disconnect() {
    //   console.log("断开连接");
    // }
    // res(data) {
    //   //监听message事件，方法是后台定义和提供的
    //   console.log("res啊" + data);
    // }
  },
  methods: {}
};
</script>

<style lang="less">
#app {
  background-color: white;
}
.van-hairline--bottom::after {
  border: none;
}
</style>
