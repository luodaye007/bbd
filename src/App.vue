<template>
  <div id="app">
    <!-- <GetLocation></GetLocation> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <van-tabbar v-show="$route.meta.VanTabbar" :unread_num="unread_num" :newMessage="newMessage"></van-tabbar>
  </div>
</template>

<script>
import VanTabbar from "@/components/VanTabbar";
import GetLocation from "@/components/GetLocation";
import { syncChatList } from "@/utils";
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
    },
    newMessage: function() {
      return this.$store.getters.unread_comment_num == 0
        ? ""
        : this.$store.getters.unread_comment_num;
    }
  },
  components: {
    "van-tabbar": VanTabbar,
    GetLocation
  },
  created() {
    //解决页面刷新vuex丢失
    //syncChatList(this.$store.state.socket.chat_list);
    let store = window.sessionStorage.getItem("store");
    if (store !== null) {
      this.$store.replaceState(
        Object.assign({}, this.$store.state, JSON.parse(store))
      );
    }

    window.addEventListener("beforeunload", () => {
      this.$store.commit("socketStateChange", false);
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));

      //因为初始化中vuex默认只保存十条记录 因此这里需要同步一下可能变化的聊天内容
      //syncChatList(this.$store.state.socket.chat_list);

      window.localStorage.setItem(
        "chat_list",
        JSON.stringify(syncChatList(this.$store.state.socket.chat_list))
      );

      window.localStorage.setItem(
        "comment_list",
        JSON.stringify(this.$store.state.socket.comment_list)
      );

      window.localStorage.setItem(
        "has_apply_game",
        JSON.stringify(this.$store.state.socket.has_apply_game)
      );

      //window.localStorage.removeItem("has_apply_game");
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
