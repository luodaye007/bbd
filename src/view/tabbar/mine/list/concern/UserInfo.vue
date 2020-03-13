<!--  -->
<template>
  <div class="userInfo" v-if="userInfo">
    <van-nav-bar :title="userInfo.nickname" />
    <div class="top">
      <van-image round width="2rem" height="2rem" :src="userInfo.avatar" />
      <div class="nickname">{{userInfo.nickname}}</div>
      <div class="motto" v-if="userInfo.motto">{{userInfo.motto}}</div>
      <div class="motto" v-else>该主人很懒，没有留下座右铭~</div>
      <div class="btn">
        <van-button
          plain
          hairline
          size="small"
          round
          style="color: rgb(25, 137, 250);margin-right:0.1rem;"
          icon="envelop-o"
          @click="chat"
        >私信</van-button>
        <van-button
          color="linear-gradient(to right, #4bb0ff, #6149f6)"
          size="small"
          round
          style="margin-left:0.1rem;"
          @click="concern(true)"
          v-if="selfConcern.some(item=>item.concern_id == userInfo.username)"
        >已关注</van-button>
        <van-button
          color="linear-gradient(to right, #4bb0ff, #6149f6)"
          size="small"
          round
          style="margin-left:0.1rem;"
          @click="concern(false)"
          icon="plus"
          v-else
        >关注</van-button>
      </div>
      <div class="num">
        <div class="num-item">
          <span class="num-num">{{userInfo.game_number}}</span>
          <span class="gray">动态</span>
        </div>
        <div class="num-item">
          <span class="num-num">{{userInfo.concern_number}}</span>
          <span class="gray">关注</span>
        </div>
        <div class="num-item">
          <span class="num-num">{{userInfo.fan_number}}</span>
          <span class="gray">粉丝</span>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="bottom">
      <div class="title">他的资料</div>
      <div class="info">
        <div class="self-info">
          <div class="half">
            <span class="static">技术评分：</span>
            {{userInfo.rate}}
          </div>
          <div class="half">
            <span class="static">信用评分：</span>
            {{userInfo.credit}}
          </div>
        </div>
        <div class="self-info">
          <div class="half">
            <span class="static">身高：</span>
            {{userInfo.stature}}
          </div>
          <div class="half">
            <span class="static">体重：</span>
            {{userInfo.weight}}
          </div>
        </div>
        <div>
          <span class="static">位置：</span>
          {{userInfo.orientation}}
        </div>
        <div>
          <span class="static">电话：</span>
          {{userInfo.phone}}
        </div>
      </div>
      <div class="title">他的关注</div>
      <div class="item" v-for="(item,index) in userInfo.concerns" :key="index">
        <div class="left">
          <van-image round width="1rem" height="1rem" :src="item.user.avatar" />
          <div class="right">
            <div class="right-top">{{item.user.nickname}}</div>
            <div class="right-bottom">
              信用
              <span>{{item.user.credit}}</span>
              评分
              <span>{{calculatRate(item.user.game_comments)}}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <van-button round type="primary" size="small" @click="show(item.concern_id)">查看</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { getUserInfo } from "@/api";
import { calculatRate } from "@/utils";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      userInfo: null
    };
  },
  computed: {
    selfConcern() {
      return this.$store.state.user.concern;
    }
  },
  watch: {},
  methods: {
    show(username) {
      this.$router.replace({
        name: "MineConcernUserInfo",
        query: { username }
      });
      this.getUserInfo();
    },
    calculatRate(data) {
      return calculatRate(data);
    },
    chat() {
      this.$store.commit("CHANGE_CHAT_LIST_TYPE", {
        type: "add",
        userInfo: {
          username: this.userInfo.username,
          nickname: this.userInfo.nickname,
          avatar: this.userInfo.avatar
        }
      });
      this.$router.push({
        name: "SoloChat",
        query: { username: this.userInfo.username }
      });
    },
    concern(concernState) {
      if (this.$store.state.user.userInfo.username == this.userInfo.username) {
        this.$toast("不能关注自己");
        return;
      }

      let data = {};
      data.username = this.$store.state.user.userInfo.username;
      data.concern_id = this.userInfo.username;
      //关注
      this.$toast.loading({
        mask: true,
        message: "操作中...",
        duration: 0
      });
      if (!concernState) {
        this.$store
          .dispatch("addConcern", data)
          .then(res => {
            this.$toast.clear();
            this.$toast("关注成功");
            this.userInfo.fan_number++;
          })
          .catch(reason => {
            console.log(reason);
          });
      } else {
        //取消关注
        this.$store
          .dispatch("delConcern", data)
          .then(res => {
            this.$toast.clear();
            this.$toast("操作成功");
            this.userInfo.fan_number--;
          })
          .catch(reason => {
            console.log(reason);
          });
      }
    },
    getUserInfo() {
      getUserInfo(this.$route.query.username).then(res => {
        console.log(res);
        this.userInfo = res.data.userInfo;
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getUserInfo();
  }
};
</script>
<style scoped>
.userInfo {
  margin-top: 46px;
  height: 100vh;
  background-color: white;
}
.top {
  text-align: center;
  padding-top: 0.5rem;
}
.nickname {
  font-weight: bold;
  font-size: 0.35rem;
}
.motto {
  color: #ccc;
  margin: 0 2rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.btn {
  margin-top: 0.2rem;
}
.van-button__text {
  margin-left: 3px;
}
.van-button__icon {
  font-size: 0.28rem;
}
.num {
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
}
.num-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.gray {
  color: gray;
}
.num-num {
  font-weight: bold;
  font-size: 0.35rem;
}
.num-item:first-child {
  border-right: 1px solid #f2f2f2;
}
.num-item:last-child {
  border-left: 1px solid #f2f2f2;
}
.bottom {
  padding: 0.5rem;
}
.title {
  font-weight: bold;
  font-size: 0.38rem;
  margin-bottom: 0.2rem;
}
.item {
  display: flex;
  padding: 0.2rem;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.1rem;
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
.self-info {
  display: flex;
}
.half {
  width: 50%;
}
.static {
  color: #ccc;
}
.info {
  padding: 0.2rem;
  margin-bottom: 0.2rem;
}
.info > div {
  margin-bottom: .2rem;
}
.line {
  background-color: #fbfafa;
  height: 10px;
}
</style>