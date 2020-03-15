<!--  -->
<template>
  <div class="game">
    <van-nav-bar :title="'我的赛事'" />
    <van-tabs @click="onClick" animated swipeable>
      <van-tab title="全部">
        <div class="card" v-for="(item,index) in games" :key="item.game_id">
          <div class="game-item-header">
            <div class="game-item-header-avatar">
              <van-image
                class="avatar"
                round
                cover
                width="1.2rem"
                height="1.2rem"
                :src="item.user.avatar"
              />
              <span class="nickname">{{item.user.nickname}}</span>
            </div>
            <van-tag
              plain
              type="danger"
              v-if="new Date().getTime()>item.game_time+item.duration*60*60*1000"
            >已结束</van-tag>
            <van-tag plain type="success" v-else>未开赛</van-tag>
          </div>
          <div class="game-item-content">
            <p>类型：{{item.game_type}}</p>
            <p>时间：{{sillyDay(item.game_time)}}</p>
            <p>地址：{{item.poiaddress}}</p>
          </div>
          <div class="game-item-button">
            <van-tag plain type="primary" @click="showGame(item.game_id)">查看赛事</van-tag>
            <van-tag
              plain
              type="primary"
              @click="comment(item.game_id)"
              v-if="new Date().getTime()>item.game_time+item.duration*60*60*1000"
            >去评价</van-tag>
            <van-tag plain type="warning" v-else @click="exit(item,index)">退出赛事</van-tag>
          </div>
        </div>
      </van-tab>

      <van-tab title="待开赛">
        <div
          class="card"
          v-for="item in games"
          :key="item.game_id"
          v-show="new Date().getTime()<item.game_time+item.duration*60*60*1000"
        >
          <div class="game-item-header">
            <div class="game-item-header-avatar">
              <van-image
                class="avatar"
                roundZ
                cover
                width="1.2rem"
                height="1.2rem"
                :src="item.user.avatar"
              />
              <span class="nickname">{{item.user.nickname}}</span>
            </div>
            <van-tag plain type="success">未开赛</van-tag>
          </div>
          <div class="game-item-content">
            <p>类型：{{item.game_type}}</p>
            <p>时间：{{sillyDay(item.game_time)}}</p>
            <p>地址：{{item.poiaddress}}</p>
          </div>
          <div class="game-item-button">
            <van-tag plain type="primary" @click="showGame(item.game_id)">查看赛事</van-tag>
            <van-tag plain type="warning" @click="exit(item,index)">退出赛事</van-tag>
          </div>
        </div>
      </van-tab>

      <van-tab title="待评价">
        <div
          class="card"
          v-for="item in games"
          :key="item.game_id"
          v-show="new Date().getTime()>item.game_time+item.duration*60*60*1000&&!item.isComment"
        >
          <div class="game-item-header">
            <div class="game-item-header-avatar">
              <van-image
                class="avatar"
                roundZ
                cover
                width="1.2rem"
                height="1.2rem"
                :src="item.user.avatar"
              />
              <span class="nickname">{{item.user.nickname}}</span>
            </div>
            <van-tag plain type="danger">已结束</van-tag>
          </div>
          <div class="game-item-content">
            <p>类型：{{item.game_type}}</p>
            <p>时间：{{sillyDay(item.game_time)}}</p>
            <p>地址：{{item.poiaddress}}</p>
          </div>
          <div class="game-item-button">
            <van-tag plain type="primary" @click="showGame(item.game_id)">查看赛事</van-tag>
            <van-tag plain type="primary" @click="comment(item.game_id)">去评价</van-tag>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { gameRequest } from "@/api";
import { sillyDay } from "@/utils";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      games: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    onClick(name, title) {
      //this.$toast(title);
    },
    sillyDay(time) {
      return sillyDay(time);
    },
    showGame(game_id) {
      this.$router.push({ name: "ShowGame", query: { game_id: game_id } });
    },
    comment(game_id) {
      this.$router.push({ name: "GameComment", query: { game_id: game_id } });
    },
    exit(game, index) {
      if (game.username == this.$store.state.user.userInfo.username) {
        //为赛事队长
        //如果存在队员 则无法结束比赛
        gameRequest.showGame(game.game_id).then(res => {
          if (
            res.data.game.game_athletes.length <= 1 &&
            res.data.game.game_athletes[0].username ==
              this.$store.state.user.userInfo.username
          ) {
            //只有自己一个队员 可以结束比赛
            this.$dialog
              .confirm({
                title: "提示",
                message: "确定结束并删除这场赛事吗？"
              })
              .then(() => {
                const toast = this.$toast.loading({
                  duration: 0, // 持续展示 toast
                  forbidClick: true,
                  message: "退出中"
                });
                gameRequest
                  .deleteGame(game.game_id)
                  .then(res => {
                    if (res.status == 204) {
                      toast.clear();
                      this.games.splice(index, 1);
                      this.$toast("赛事成功删除并退出");
                    }
                  })
                  .catch(reason => {
                    console.log(reason);
                  });
              })
              .catch(() => {
                // on cancel
              });
          } else {
            this.$dialog
              .alert({
                title: "无法退出",
                message: "因您是赛事队长且已有队员加入"
              })
              .then(() => {
                // on close
              });
          }
        });
      } else {
        this.$dialog
          .confirm({
            title: "提示",
            message: "是否退出这场赛事吗？"
          })
          .then(() => {
            const toast = this.$toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true,
              message: "退出中"
            });
            gameRequest
              .exitGame(game.game_id, this.$store.state.user.userInfo.username)
              .then(res => {
                if (res.status == 204) {
                  toast.clear();
                  this.games.splice(index, 1);
                  this.$toast("赛事成功删除并退出");
                }
              });
          })
          .catch(() => {
            // on cancel
          });
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    gameRequest.getUserGame(this.$store.state.user.userInfo.username).then(res => {
      let data = res.data.games;
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        data[i].isComment = false;
        for (var j = 0; j < data[i].game_comments.length; j++) {
          if (
            this.$store.state.user.userInfo.username ==
            data[i].game_comments[j].rate_id
          ) {
            data[i].isComment = true;
            break;
          }
        }
      }
      this.games = data;
    });
  }
};
</script>
<style scoped lang="less">
.game {
  // background-color: rgb(250, 237, 219);
  width: 100%;
  height: 100%;
  padding-top: 46px;
  background-color: #f2f2f2;
}
.card {
  width: 95%;
  margin: 0.25rem auto;
  // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19);
  padding: 0.05rem;
  background-color: white;
  border-radius: 0.11rem;
}
.avatar {
  padding: 0.1rem;
}
.game-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem;
}
.game-item-header-avatar {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 0.4rem;
}
.game-item-content {
  padding: 0.2rem;
  margin: 0.1rem 0.25rem;
}
.game-item-content p {
  margin: 0.05rem auto;
  color: rgb(133, 133, 133);
}
.game-item-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  //  font-size: 0.2rem;
}

.van-tag {
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  margin-bottom: 0.2rem;
}
.nickname {
  margin-left: 0.1rem;
}
</style>