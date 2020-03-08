<!--  -->
<template>
  <div class="add" v-if="gameData!=null">
    <van-nav-bar :title="'评价'" />
    <div class="game-end">比赛已结束</div>
    <div class="static">请对此场赛事进行评价</div>
    <div class="line"></div>
    <div class="static" v-if="!isCampus">评价队长</div>
    <div class="cap" v-if="!isCampus">
      <van-image width="0.8rem" height="0.8rem" fit="cover" :src="gameData.user.avatar" round />
      <div>{{gameData.user.nickname}}</div>
    </div>
    <div class="rate" v-if="!isCampus">
      <van-rate v-model="captain.rate" void-color="#eee" size="22" allow-half void-icon="star" />
    </div>
    <div class="textarea" v-if="!isCampus">
      <van-field
        v-model="captain.content"
        type="textarea"
        placeholder="请输入对于队长的评价内容"
        rows="4"
        autosize
      />
    </div>
    <div class="else" v-if="member.length!=0">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="队员评价" name="1">
          <div class="teanmate" v-for="(item,index) in gameData.game_athletes" :key="index">
            <div class="teanmate-item">
              <van-image width="0.8rem" height="0.8rem" fit="cover" :src="item.user.avatar" round />
              <div>{{item.user.nickname}}</div>
            </div>
            <div class="rate member-rate">
              <van-rate
                v-model="captain.rate"
                void-color="#eee"
                size="20"
                allow-half
                void-icon="star"
              />
            </div>

            <van-field
              v-model="member[index].content"
              type="textarea"
              placeholder="请输入您的评价内容"
              rows="2"
              autosize
            />
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <van-button
      type="info"
      color="rgb(252, 129, 131)"
      size="normal"
      @click="save"
      :disabled="gameData.game_comments.some(item=> item.rate_id==userInfo.username)"
    >提交</van-button>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { showGame, createComment } from "@/api";
import { sillyDay1 } from "@/utils";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      rate: 2.5,
      message: "",
      activeNames: ["1"],
      gameData: null,
      captain: {
        content: "",
        rate: 2.5
      },
      member: []
    };
  },
  computed: {
    userInfo: function() {
      return this.$store.state.user.userInfo;
    },
    isCampus: function() {
      return (
        this.$store.state.user.userInfo.username == this.gameData.user.username
      );
    }
  },
  watch: {},
  methods: {
    save() {
      if (this.isCampus) {
        if (this.member.some(item => item.content == "")) {
          this.$toast("请完成队员评价");
          return;
        }
      } else {
        if (this.captain.content == "") {
          this.$toast("请完成队长评价");
          return;
        } else if (this.member.some(item => item.content == "")) {
          this.$toast("请完成队员评价");
          return;
        }
      }

      const toast = this.$toast.loading({
        message: "发表中...",
        forbidClick: true,
        duration: 0 // 持续展示 toast
      });

      if (!this.isCampus) {
        this.captain.rate_id = this.userInfo.username;
        this.captain.be_rate_id = this.gameData.user.username;
        this.captain.game_id = this.gameData.game_id;
        this.captain.rate_time = sillyDay1(new Date().getTime());
        this.member.push(this.captain);
      }

      createComment(this.member)
        .then(res => {
          toast.clear();
          this.$toast("发表成功");
          //推送消息

          this.$socket.emit("comment", this.member);
          setTimeout(() => {
            this.$router.back(-1);
          }, 1500);
        })
        .catch(reason => {
          console.log(reason);
          if (reason.data.error.name == "SequelizeUniqueConstraintError") {
            this.$toast("已经评论过了");
          }
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    showGame(this.$route.query.game_id)
      .then(res => {
        console.log(res);
        this.gameData = res.data.game;

        for (var i = 0; i < this.gameData.game_athletes.length; i++) {
          if (
            this.gameData.game_athletes[i].username ==
              this.gameData.user.username ||
            this.gameData.game_athletes[i].username == this.userInfo.username
          ) {
            //过滤自己和队长
            this.gameData.game_athletes.splice(i, 1);
          } else {
            this.member.push({
              game_id: this.gameData.game_id,
              rate_id: this.userInfo.username,
              be_rate_id: this.gameData.game_athletes[i].username,
              content: "",
              rate: 2.5,
              rate_time: sillyDay1(new Date().getTime())
            });
          }
        }
      })
      .catch(reason => {
        console.log(reason);
      });
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.add {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 46px;
  background-color: white;
  padding-bottom: 0.5rem;
}
.add > div {
  margin: 0.2rem;
}
.line {
  width: 40%;
  height: 1px;
  background-color: #f2f2f2;
}
.game-end {
  font-size: 0.4rem;
  font-weight: bold;
}
.static {
  color: gray;
}
.textarea {
  width: 80%;
}
.add/deep/.van-field__body {
  background-color: rgb(244, 244, 244);
  padding: 0.222rem;
  border-radius: 0.1rem;
}
.else {
  width: 100%;
}
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border: none;
}
.add/deep/.van-cell {
  display: flex;
  justify-content: center;
}
.add/deep/.van-cell__title {
  flex: none;
  color: gray;
}
.add/deep/.van-cell__title > span {
  color: gray;
}
.van-button {
  width: 90%;
}
.cap {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.cap > div {
  font-size: 0.355rem;
  margin-left: 0.1rem;
}
.add/deep/.van-cell:not(:last-child)::after {
  border: none;
}
.add/deep/.van-collapse-item__wrapper {
  width: 80%;
  margin: 0 auto;
}
.teanmate-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.4rem;
}
.teanmate-item > div:last-child {
  margin-left: 0.2rem;
}
.member-rate {
  padding: 0.2rem 0 0 0.4rem;
}
</style>