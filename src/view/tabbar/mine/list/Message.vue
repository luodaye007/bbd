<!--  -->
<template>
  <div class="message">
    <van-nav-bar :title="'我的消息'" />
    <div
      class="message-item"
      :class="[item.unread?'unread':'']"
      v-for="(item,index) in comment_list"
      :key="index"
      @click="jump(item,index)"
    >
      <div class="left">
        <van-image round width="1.1rem" height="1.1rem" :src="item.rate_avatar" />
      </div>
      <div class="right">
        <div class="right-top">
          <span class="nickname">{{item.rate_nickname}}</span>
          <span class="time">{{item.rate_time}}</span>
        </div>
        <div class="right-bottom">给您评论了~</div>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {};
  },
  computed: {
    comment_list() {
      return this.$store.state.socket.comment_list;
    }
  },
  watch: {},
  methods: {
    jump(item, index) {
      this.$router.push({
        name: "CommentShow",
        query: {
          game_id: item.game_id,
          rate_id: item.rate_id,
          be_rate_id: item.be_rate_id
        }
      });
      this.$store.commit("clear_message_unread", index);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
.message {
  padding-top: 46px;
}
.message-item {
  padding: 0.15rem 0.3rem;
  display: flex;
  flex-direction: row;
}
.right {
  margin-left: 0.3rem;
  width: 100%;
}
.right-top {
  display: flex;
  justify-content: space-between;
}
.nickname {
  font-weight: bold;
  font-size: 0.333rem;
}
.time {
  color: #ccc;
}
.right-bottom {
  color: gray;
}
.unread {
  background-color: rgb(246, 246, 201);
}
</style>