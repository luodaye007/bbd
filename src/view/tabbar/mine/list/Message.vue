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
        <van-image
          round
          width="1.1rem"
          height="1.1rem"
          :src="item.rate_avatar||item.apply_avatar||item.approve_avatar"
          @click.stop="showUserInfo(item)"
        />
      </div>
      <div class="right">
        <div class="right-top">
          <span class="nickname">{{item.rate_nickname||item.apply_nickname||item.approve_nickname}}</span>
          <span class="time">{{item.rate_time||item.apply_time||item.approve_time}}</span>
        </div>
        <div class="right-bottom" v-if="item.type=='comment'">给您评论了~</div>
        <div class="right-bottom" v-else-if="item.type=='game_verify'">
          <div>申请加入比赛</div>
          <div class="game_verify_btn">
            <van-tag
              type="success"
              :class="[item.approve?'disable':'']"
              size="large"
              @click.stop="agree(item,index)"
            >同意</van-tag>
            <van-tag
              type="danger"
              :class="[item.approve?'disable':'']"
              size="large"
              @click.stop="reject(item,index)"
            >拒绝</van-tag>
          </div>
        </div>
        <div class="right-bottom" v-else-if="item.type=='game_notiy'">
          加入赛事
          <template v-if="item.result">成功</template>
          <template v-if="!item.result">失败</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { sillyDay1 } from "@/utils";
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
      if (item.type === "comment") {
        this.$router.push({
          name: "CommentShow",
          query: {
            game_id: item.game_id,
            rate_id: item.rate_id,
            be_rate_id: item.be_rate_id
          }
        });
      } else if (item.type === "game_verify" || item.type === "game_notiy") {
        //跳转到相应的赛事中
        this.$router.push({
          name: "ShowGame",
          query: { game_id: item.game_id }
        });
      }

      this.$store.commit("clear_message_unread", index);
    },
    agree(item, index) {
      if (item.approve) return;
      let data = {};
      data.game_id = item.game_id;
      data.username = item.username;
      this.$store
        .dispatch("joinGame", data)
        .then(res => {
          //console.log(res);
          if (res.data.code) {
            this.$toast("加入成功");
          } else {
            if (res.data.msg == "SequelizeUniqueConstraintError") {
              this.$toast("无需重复审批");
            } else {
              this.$toast.fail(res.data.msg);
            }
          }
          this.$store.commit("clear_message_unread", index);
          this.$store.commit("clear_message_approve", index);
          //通知加入成功了
          this.notiy(item.username, item.game_id, true);
        })
        .catch(reason => {});
    },
    reject(item, index) {
      //拒绝后需要通知，把申请人的申请过的数组删除了相应的项，方可继续申请
      if (item.approve) return;
      this.$store.commit("clear_message_unread", index);
      this.$store.commit("clear_message_approve", index);
      this.$toast("已拒绝");
      this.notiy(item.username, item.game_id, false);
    },
    showUserInfo(item) {
      //console.log(item);
      this.$router.push({
        name: "MineConcernUserInfo",
        query: { username: item.apply_id || item.rate_id || item.approve_id }
      });
    },
    notiy(username, game_id, result) {
      let notiyData = {};
      notiyData.approve_id = this.$store.state.user.userInfo.username;
      notiyData.approve_avatar = this.$store.state.user.userInfo.avatar;
      notiyData.approve_nickname = this.$store.state.user.userInfo.nickname;
      notiyData.receive_id = username;
      notiyData.game_id = game_id;
      notiyData.type = "game_notiy";
      notiyData.result = result;
      notiyData.approve_time = sillyDay1(new Date().getTime());
      this.$socket.emit("gameNotiy", notiyData);
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
  position: relative;
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
  display: flex;
  justify-content: space-between;
}
.unread {
  background-color: rgb(246, 246, 201);
}
.disable {
  opacity: 0.5;
}
</style>