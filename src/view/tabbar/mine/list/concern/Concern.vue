<!--  -->
<template>
  <div class="concern">
    <van-nav-bar :title="'我的关注'" />
    <div
      class="item"
      v-for="(item,index) in concern"
      :key="index"
      @click="showUser(item.concern_id)"
    >
      <div class="left">
        <van-image round width="1rem" height="1rem" :src="item.user.avatar" />
        <div class="right">
          <div class="right-top">{{item.user.nickname}}</div>
          <div class="right-bottom">
            信用
            <span>{{item.user.credit}}</span>
            评分
            <span>{{item.rate}}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <van-button round type="primary" size="small" @click.stop="chat(item)">沟通</van-button>
        <van-button round type="info" size="small" @click.stop="deConcern(item,index)">取关</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { showConcern } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      concern: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    deConcern(item, index) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定取消关注吗？"
        })
        .then(() => {
          // on confirm
          this.$store.dispatch("delConcern", item).then(res => {
            this.concern.splice(index, 1);
            this.$toast({
              message: "成功",
              forbidClick: true
            });
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    showUser(username) {
      //console.log(username);
      this.$router.push({ name: "MineConcernUserInfo", query: { username } });
    },
    chat(item) {
      this.$store.commit("CHANGE_CHAT_LIST_TYPE", {
        type: "add",
        userInfo: {
          username: item.concern_id,
          nickname: item.user.nickname,
          avatar: item.user.avatar
        }
      });
      this.$router.push({
        name: "SoloChat",
        query: { username: item.concern_id }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    showConcern(this.$store.state.user.userInfo.username)
      .then(res => {
        //console.log(res);
        this.concern = res.data.concern;
      })
      .catch(reason => {});
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.concern {
  display: flex;
  flex-direction: column;
  margin: 46px 0.25rem 0.25rem;
}
.item {
  display: flex;
  padding: 0.2rem;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.1rem;
  border-bottom: 1px solid #f2f2f2;
}
.left {
  display: flex;
  align-items: center;
}
.right {
  margin-left: 0.2rem;
}
.right-top {
  font-weight: bold;
  font-size: 0.35rem;
}
.right-bottom {
  color: #ccc;
}
.right-bottom span {
  color: gray;
}
.right-bottom span:first-child {
  margin-right: 0.2rem;
}
</style>