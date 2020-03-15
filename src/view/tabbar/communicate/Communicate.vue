<!--  -->
<template>
  <div class="communicate" v-if="userInfo">
    <div class="search-bar">
      <van-search placeholder="请输入搜索关键词" v-model="search" />
    </div>
    <div class="line"></div>
    <div class="chat">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-swipe-cell v-for="(item1,index) in chat_list" :key="index" :on-close="onDelete(item1)">
          <div class="chat-item" @click="toSolo(item1)">
            <div class="chat-item-left">
              <div class="chat-item-avatar">
                <van-image fit="fill" round width="1.5rem" height="1.5rem" :src="item1.avatar" />
                <div class="van-info" v-show="item1.unread_num!=0">{{item1.unread_num}}</div>
              </div>
            </div>
            <div class="chat-item-middle">
              <div class="chat-item-nickname">{{item1.nickname}}</div>
              <div
                class="chat-item-content-msg"
                v-if="item1.chat_list.length!=0&&item1.chat_list[item1.chat_list.length-1].type=='text'"
              >{{item1.chat_list[item1.chat_list.length-1].msg}}</div>
              <div
                class="chat-item-content-msg"
                v-if="item1.chat_list.length!=0&&item1.chat_list[item1.chat_list.length-1].type=='location'"
              >[位置]</div>
              <div
                class="chat-item-content-msg"
                v-if="item1.chat_list.length!=0&&item1.chat_list[item1.chat_list.length-1].type=='equipment'"
              >[装备]</div>
              <div
                class="chat-item-content-msg"
                v-if="item1.chat_list.length!=0&&item1.chat_list[item1.chat_list.length-1].type=='game'"
              >[赛事]</div>
              <div class="chat-item-content-tag" v-if="item1.tag">
                <van-tag
                  type="primary"
                  size="medium"
                  v-for="(item2,index) in item1.tag.split(' ')"
                  :key="index"
                  v-show="item2"
                >{{item2}}</van-tag>
              </div>
            </div>
            <div class="chat-item-right">
              <div class="chat-item-time">
                <van-icon v-if="item1.chat_list.length!=0" name="clock-o" />
                <span
                  class="ago"
                  v-if="item1.chat_list.length!=0"
                >{{ago(item1.chat_list[item1.chat_list.length-1].time)}}</span>
              </div>
            </div>
          </div>
          <template slot="right">
            <van-button square type="danger" text="删除" />
          </template>
        </van-swipe-cell>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { ago } from "@/utils";
import { baseRequest } from "@/api";
export default {
  components: {},
  data() {
    return {
      search: "",
      isLoading: false
    };
  },
  computed: {
    userInfo: function() {
      return this.$store.state.user.userInfo;
    },
    chat_list() {
      return this.$store.state.socket.chat_list;
    }
  },
  watch: {},
  methods: {
    onRefresh() {
      let users = [];
      this.chat_list.forEach(item => {
        users.push(item.username);
      });
      if (users.length > 0) {
        baseRequest.updateChatListUser(users.join(",")).then(res => {
          this.$store.commit("update_chat_list_user", res.data.usersInfo);
          this.$toast("刷新成功");
          this.isLoading = false;
        });
      }
    },
    // clickPosition 表示关闭时点击的位置
    onDelete(item) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "left":
          case "cell":
          case "outside":
            instance.close();
            break;
          case "right":
            this.$dialog
              .confirm({
                message: "确定删除吗？"
              })
              .then(() => {
                this.$store.commit("CHANGE_CHAT_LIST_TYPE", {
                  type: "delete",
                  userInfo: item
                });
                instance.close();
              });
            break;
        }
      };
    },
    toSolo(item) {
      this.$router.push({
        name: "SoloChat",
        query: { username: item.username }
      });
    },
    ago(time) {
      return ago(time);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    //console.log(ago(new Date().getTime() - 2000));
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
// .van-pull-refresh {
//   height: 100vh;
// }
.communicate {
  margin-bottom: 50px;
}
.van-search__content {
  border-radius: 5px;
  background-color: rgb(238, 238, 238);
}
.line {
  height: 12px;
  background-color: rgb(242, 242, 242);
  border-top: 1px solid rgb(230, 230, 230);
}
/* .van-pull-refresh {
  height: calc(100vh - 50px);
} */
/* .van-pull-refresh {
  width: 100%;
  height: 100vh;
} */
.chat-item {
  margin-left: 10px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  //justify-content: space-between;
  border-bottom: 1px solid rgb(230, 230, 230);
  //align-items: center;
  //width: 100%;
}
.van-info {
  margin-top: 2px;
}
.chat-item-content {
  display: flex;
  flex-direction: column;
}
.chat-item-avatar {
  float: left;
  position: relative;
}
.chat-item-content {
  width: 55%;
}
.chat-item-time {
  //float: right;
  font-size: 0.33rem;
  color: #676767;
}

.chat-item-avatar,
.chat-item-content {
  margin-right: 10px;
}
.chat-item-nickname {
  font-size: 0.38rem;
  color: #2e2e2e;
}
.van-tag--medium {
  margin-right: 5px;
}
.chat-item-content-msg {
  color: #676767;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.3rem;
}
.van-button--normal {
  height: 100%;
}
.chat-item-left {
  width: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.chat-item-middle {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.chat-item-right {
  width: 3rem;
  min-width: 60px;
}
.ago {
  position: relative;
  top: -0.04rem;
}
.van-image--round {
  border-radius: 0.1rem;
}
</style>