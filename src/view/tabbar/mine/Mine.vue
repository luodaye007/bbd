<!--  -->
<template>
  <div class="mine" v-if="userInfo">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="mine-header">
        <div class="mine-header-left">
          <div class="nickname">{{userInfo.nickname}}</div>
          <div class="motto">{{userInfo.motto||'去设置你的座右铭吧~'}}</div>
        </div>
        <div class="mine-heade-right" @click="toMine">
          <van-image round width="1.8rem" height="1.8rem" :src="userInfo.avatar" />
        </div>
      </div>
      <div class="mine-tag-rate">
        <div class="mine-tag">
          <van-tag
            type="primary"
            size="large"
            v-for="(item,index) in tag"
            :key="index"
            v-show="item"
          >{{item}}</van-tag>
          <van-icon name="arrow" />
        </div>
        <div class="rate">
          <span class="credit">{{userInfo.credit}}</span>
          <van-rate size="0.4rem" v-model="userInfo.rate" allow-half readonly />
        </div>
      </div>
      <van-divider />
      <div class="mine-tips">
        <div>
          <span class="mine-tips-span">{{userInfo.game_number}}</span>
          <span>动态</span>
        </div>
        <div>
          <span class="mine-tips-span">{{userInfo.concern_number}}</span>
          <span>关注</span>
        </div>
        <div>
          <span class="mine-tips-span">{{userInfo.fan_number}}</span>
          <span>粉丝</span>
        </div>
      </div>

      <div class="mine-line"></div>

      <div class="mine-more">
        <van-cell title="我的消息" size="large" icon="volume" url="/#/mine/message" clickable is-link>
          <template slot="title">
            <span class="custom-title">我的消息</span>
            <span class="info">{{newMessage}}</span>
          </template>
        </van-cell>
        <van-cell
          title="个人信息"
          size="large"
          icon="friends"
          url="/#/mine/userInfo"
          clickable
          is-link
        />
        <van-cell title="我的赛事" size="large" icon="award" url="/#/mine/game" clickable is-link />
        <van-cell
          title="我的装备"
          size="large"
          icon="goods-collect"
          url="/#/mine/equipment"
          clickable
          is-link
        />
        <van-cell title="我的关注" size="large" icon="star" url="/#/mine/concern" clickable is-link />
        <van-cell title="我的评价" size="large" icon="comment" url="/#/mine/comment" clickable is-link />
        <van-cell
          title="问题反馈"
          size="large"
          icon="question"
          url="/#/mine/feedback"
          clickable
          is-link
        />
        <van-cell title="退出登录" size="large" icon="setting" clickable is-link @click="exit" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      rate: 5
    };
  },
  computed: {
    loginStatus: function() {
      return this.$store.state.user.loginStatus;
    },
    userInfo: function() {
      return this.$store.state.user.userInfo;
    },
    tag() {
      if (this.$store.state.user.userInfo.tag) {
        return this.$store.state.user.userInfo.tag.split(" ");
      } else {
        return ["暂无"];
      }
    },
    newMessage: function() {
      return this.$store.getters.unread_comment_num == 0
        ? ""
        : this.$store.getters.unread_comment_num;
    }
  },
  watch: {},
  methods: {
    onRefresh() {
      this.$store.dispatch("getUserInfo", this.userInfo.username).then(res => {
        this.$toast("刷新成功");
        this.isLoading = false;
      });
    },
    toMine() {
      this.$router.push({ name: "UserInfo" });
    },
    exit() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否退出登录呢？"
        })
        .then(() => {
          this.$store.dispatch("logOut").then(() => {
            this.$router.push({ name: "Game" });
            this.$socket.disconnect();
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang='less'>
@text-color: #c7c7c7;
.mine {
  height: calc(100vh - 50px);
}
.van-pull-refresh {
  width: 100%;
  height: 100%;
}
// .mine /deep/ .van-pull-refresh__track {
//   width: 100%;
//   height: 100%;
// }
.nickname {
  font-weight: bold;
  font-size: 0.5rem;
  padding: 10px 0;
}
.mine-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.6rem 0.8rem 0 0.6rem;
  align-items: center;
}
.mine-header-left,
.mine-header-right {
  display: flex;
  flex-direction: column;
  padding: 0.2rem;
}
.motto {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  width: 100%;
  overflow: hidden;
  font-size: 0.3rem;
  padding-left: 0.1rem;
  color: @text-color;
}
.van-tag {
  padding: 0.2em 0.5em;
  border-radius: 1em;
}
.mine-tag-rate {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  //padding: 0.2rem 0.9rem;
  padding: 0 0.5rem 0.1rem 0.9rem;
  align-items: center;
}
.mine-tag,
.rate {
  display: flex;
  align-items: center;
}
.mine-tag > .van-tag {
  margin: 0.2rem 0.2rem 0.2rem 0;
  //font-size: 0.4rem;
}
.van-icon-arrow {
  color: #999999;
}
.rate {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.credit {
  color: #00df77;
}
.van-divider {
  margin: 0;
}
.mine-tips {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0.4rem 0;
}
.mine-tips div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mine-tips div :first-child {
  font-weight: bold;
  font-size: 0.4rem;
}
.mine-tips div :last-child {
  font-size: 0.3rem;
  color: @text-color;
}
.mine-line {
  height: 0.4rem;
  background-color: #eeeeee;
}
.van-cell__left-icon {
  font-size: 0.45rem;
  margin-right: 0.3rem;
}
.van-icon-volume,
.van-icon-star {
  color: rgb(255, 198, 112);
}
.van-icon-friends {
  color: rgb(161, 231, 246);
}
.van-icon-award {
  color: rgb(255, 137, 191);
}
.van-icon-comment {
  color: rgb(104, 202, 254);
}
.van-icon-question {
  color: rgb(107, 116, 173);
}
.van-icon-setting,
.van-icon-goods-collect {
  color: #fc8183;
}
.van-cell__title {
  font-size: 0.36rem;
}
.info {
  position: absolute;
  top: 50%;
  box-sizing: border-box;
  min-width: 16px;
  padding: 0 3px;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
  line-height: 14px;
  text-align: center;
  background-color: #ee0a24;
  border: 1px solid #fff;
  border-radius: 16px;
  -webkit-transform: translate(20%, -50%);
  transform: translate(20%, -50%);
  -webkit-transform-origin: 100%;
  transform-origin: 100%;
}
</style>