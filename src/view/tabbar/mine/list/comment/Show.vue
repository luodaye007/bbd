<!--  -->
<template>
  <div class="comment">
    <van-nav-bar :title="'我的评价'" />
    <div
      class="card"
      :id="'comment_g'+item.game_id+'r'+item.rate_id+'b'+item.be_rate_id"
      v-for="(item,index) in comments"
      :key="index"
    >
      <div class="comment-item-header">
        <div class="comment-item-header-avatar">
          <van-image class="avatar" round width="0.9rem" height="0.9rem" :src="item.user.avatar" />
          <span class="nick">{{item.user.nickname}}</span>
        </div>
        <div class="grade">{{item.rate}}</div>
      </div>

      <div class="comment-item-content">{{item.content}}</div>
      <div class="comment-item-foot">{{item.rate_time}}</div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { commentRequest } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      comments: []
    };
  },
  computed: {},
  watch: {},
  methods: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    commentRequest.showComment(this.$store.state.user.userInfo.username)
      .then(res => {
        this.comments = res.data.comments;
        if (this.$route.query.game_id) {
          const { game_id, rate_id, be_rate_id } = this.$route.query;
          this.$nextTick(() => {
            document
              .querySelector(`#comment_g${game_id}r${rate_id}b${be_rate_id}`)
              .scrollIntoView({
                block: "start",
                behavior: "smooth"
              });
          });
        }
      })
      .catch(reason => {});
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>

<style scoped>
.comment {
  padding-top: 46px;
}
.card {
  padding: 0.1rem;
}
.comment-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem;
}

.comment-item-header-avatar {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 0.4rem;
}
.nick {
  margin-left: 0.2rem;
}

.grade {
  color: rgb(230, 7, 7);
  font-size: 0.42rem;
  padding: 0.25rem;
}
.comment-item-content {
  margin: -0.1rem 1.2rem;

  font-size: 0.35rem;
  color: black;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.comment-item-foot {
  margin: 0.2rem 1.2rem;
  padding-bottom: 0.15rem;
  font-size: 0.2rem;
  color: #5c5b5b;
  border-bottom: 1px solid rgb(179, 172, 172);
}
</style>