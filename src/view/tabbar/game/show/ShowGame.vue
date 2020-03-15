<!--  -->

<template>
  <div class="show">
    <van-nav-bar :title="'赛事详情'" />
    <div class="show-header" v-if="game">
      <div class="show-header-left">
        <van-image
          round
          width="1.2rem"
          height="1.2rem"
          :src="game.user.avatar"
          @click="showUser(game.user.username)"
        />
        <div class="show-header-left-inner">
          <span class="nickname">{{game.user.nickname}}</span>
          <div>
            <van-rate v-model="game.user.rate" allow-half readonly size="18" />
            <span class="credit">{{game.user.credit}}</span>
          </div>
        </div>
      </div>
      <div class="show-header-right" @click="chat">
        <van-icon name="chat-o" style="font-size:0.8rem;" />
      </div>
    </div>
    <div class="invitation" :style="backgroundDiv" v-if="game">
      <div class="invitation-name" v-if="userInfo">尊敬的{{userInfo.nickname}}：</div>
      <div class="invitation-name" v-else>尊敬的用户：</div>
      <div class="invitation-content">
        我们将于
        <span>{{game.game_time_ch}}</span>
        开启一场大概
        <span>{{game.duration}}小时</span>的
        <span>{{game.game_type}}</span>篮球赛，现在离满员还差
        <span>{{game.game_number}}人</span>，距离球赛开始还有
        <van-count-down :time="game.game_time-new Date().getTime()" format="DD 天 HH 时 mm 分 ss 秒" />，诚邀加入！
      </div>
      <div class="invitation-publish">
        <i class="iconfont icon-qianming" style="font-size:0.6rem"></i>
        {{game.user.nickname}}
      </div>
      <div class="invitation-location">
        <img src="@/assets/images/address.png" alt />
        <span>{{game.poiaddress}}</span>
      </div>
      <div class="invitation-phone">
        <img src="@/assets/images/phone.png" alt />
        <a
          :href="'tel:' + game.user.phone"
          style="color:black;margin-left:0.1rem;"
        >{{game.user.phone}}</a>
      </div>
      <div class="join" @click="joinBefor">立即加入</div>
    </div>

    <div class="game-athletes" v-if="game">
      <span class="game-athletes-static">队友信息</span>
      <table>
        <tr>
          <th>昵称</th>
          <th>位置</th>
        </tr>
        <tr v-for="(item,index) in game.game_athletes" :key="index">
          <td>{{item.user.nickname}}</td>
          <td>{{item.user.orientation}}</td>
        </tr>
      </table>
      <span class="game-athletes-static">招募位置</span>
      <div class="else">
        <span>{{game.orientation}}</span>
      </div>
      <span class="game-athletes-static" v-if="game.rate">等级限定</span>
      <div class="else" v-if="game.rate">
        评分
        <span style="color:red;">{{game.rate}}</span>及以上
      </div>
      <span class="game-athletes-static" v-if="game.chargeable">费用</span>
      <div
        class="else"
        v-if="game.chargeable"
      >{{game.cost}}元(预期{{game.game_number+game.game_athletes.length}}人支付，个人需支付{{(game.cost/game.game_number+game.game_athletes.length).toFixed(2)}})</div>
      <span v-if="game.remarks" class="game-athletes-static">备注</span>
      <div v-if="game.remarks" class="remarks">{{game.remarks}}</div>
    </div>
    <span class="game-athletes-static" style="margin-left:0.45rem">位置信息</span>
    <div class="map">
      <div class="map-address" v-if="game">{{game.poiaddress}}</div>
      <div class="map-distance" v-if="game">距离我直线{{game.distance/1000}}公里</div>
      <div id="container" style="width:100%;height:6rem;margin: 0 auto;"></div>
    </div>
    <br />

    <!-- <iframe width="100%" height="400" frameborder="0" scrolling="auto" :src="src"></iframe> -->
    <!-- src="https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:23.132888,113.264715;&tonav=0&key=RCDBZ-ALJKJ-HNIFV-KB4ZJ-CJOW6-2XFEX&referer=myapp" -->
  </div>
</template>

<script>
import {
  sillyDay,
  getFlatternDistance,
  calculatRate,
  sillyDay1
} from "@/utils";
import { showGame } from "@/api";
import { ip } from "@/config";
import VanNavBar from "@/components/VanNavBar";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      game: null,
      backgroundDiv: {
        backgroundImage:
          "url(" + require("../../../../assets/images/invitation.png") + ")"
      }
    };
  },
  computed: {
    userInfo: function() {
      return this.$store.state.user.userInfo;
    }
  },
  watch: {},
  methods: {
    init(Lat, Lng) {
      var that = this;
      //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      //设置地图中心点
      var myLatlng = new qq.maps.LatLng(Lat, Lng);
      //定义工厂模式函数
      var myOptions = {
        zoom: 20, //设置地图缩放级别
        center: myLatlng, //设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP, //设置地图样式详情参见MapType
        disableDefaultUI: true //禁止所有控件
      };
      //获取dom元素添加地图信息
      var map = new qq.maps.Map(
        document.getElementById("container"),
        myOptions
      );

      //添加监听事件
      qq.maps.event.addListener(map, "click", function() {
        that.toNavigation();
      });

      var marker = new qq.maps.Marker({
        position: myLatlng,
        map: map
      });
      var anchor = new qq.maps.Point(0, 39),
        size = new qq.maps.Size(42, 68),
        origin = new qq.maps.Point(0, 0),
        markerIcon = new qq.maps.MarkerImage(
          ip + "/public/images/marker.png",
          size,
          origin,
          anchor
        );
      marker.setIcon(markerIcon);

      //获取标记的点击事件
      qq.maps.event.addListener(marker, "click", function() {
        that.toNavigation();
      });
    },
    toNavigation() {
      this.$router.push({
        name: "Navigation",
        query: {
          eword: this.game.poiaddress,
          lat: this.game.lat,
          lng: this.game.lng
        }
      });
    },
    joinBefor() {
      if (!this.$store.state.user.loginStatus) {
        this.$toast("请先登录");
        return;
      } else if (
        this.game.game_athletes.some(
          item => item.username == this.userInfo.username
        )
      ) {
        this.$toast("您本是此赛事一员");
      } else if (this.game.game_number == 0) {
        this.$toast("该比赛需求人数已满");
        return;
      } else if (this.userInfo.rate < this.game.rate) {
        this.$toast("您的评分未达到该比赛限定评分");
        return;
      } else if (!this.userInfo.orientation) {
        this.$dialog
          .confirm({
            title: "提示",
            message:
              "系统检测到您个人信息中的位置信息未完善，请先完善系统再为您分配赛事位置"
          })
          .then(() => {
            // on confirm
            this.$router.push({ name: "UserInfo" });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        const orientationArr = [
          ...this.userInfo.orientation.split(" "),
          ...this.game.orientation.split(" ")
        ];
        // 数组去重
        const newArr = [...new Set(orientationArr)];
        // 根据数组长度对比返回结果
        if (orientationArr.length === newArr.length) {
          //位置不符合需求
          this.$dialog
            .confirm({
              title: "提示",
              message:
                "系统检测到您的职业位置与该比赛招募的位置信息不符，是否确定加入比赛？（可能存在补位情况）"
            })
            .then(() => {
              // on confirm
              this.join();
            })
            .catch(() => {
              // on cancel
            });
        } else {
          this.join();
        }
      }
    },
    join() {
      let data = {};
      data.game_id = this.game.game_id;
      data.username = this.userInfo.username;
      if (!this.game.verify) {
        this.$store
          .dispatch("joinGame", data)
          .then(res => {
            //console.log(res);
            if (res.data.code) {
              this.$toast("加入成功");
              this.game.game_athletes.push({
                username: this.userInfo,
                user: this.userInfo,
                game_id: this.game.game_id
              });
            } else {
              if (res.data.msg == "SequelizeUniqueConstraintError") {
                this.$toast("您本是此赛事一员");
              } else {
                this.$toast.fail(res.data.msg);
              }
            }
          })
          .catch(reason => {});
      } else {
        //开启了加入审核
        //先去判断有没有申请过这个比赛了
        if (
          this.$store.state.socket.has_apply_game.some(
            item => item === this.game.game_id
          )
        ) {
          this.$dialog
            .confirm({
              title: "提示",
              message: "您已经申请过这场赛事了，请耐心等候审批",
              confirmButtonText: "去通知",
              cancelButtonText: "继续等待"
            })
            .then(() => {
              // on confirm
              this.chat();
            })
            .catch(() => {
              // on cancel
            });
        } else {
          data.receive_id = this.game.username;
          data.type = "game_verify";
          data.apply_time = sillyDay1(new Date().getTime());
          data.apply_id = this.userInfo.username;
          data.be_apply_id = this.game.username;
          data.apply_nickname = this.userInfo.nickname;
          data.apply_avatar = this.userInfo.avatar;
          this.$socket.emit("verify", data);
          this.$store.commit("change_has_apply_game", this.game.game_id);
          this.$toast("申请成功");
        }
      }
    },
    chat() {
      this.$store.commit("CHANGE_CHAT_LIST_TYPE", {
        type: "add",
        userInfo: this.game.user
      });
      this.$router.push({
        name: "SoloChat",
        query: { username: this.game.user.username }
      });
    },
    showUser(username) {
      //console.log(username);
      this.$router.push({ name: "MineConcernUserInfo", query: { username } });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const game_id = this.$route.query.game_id;
    this.$toast.loading({
      mask: true,
      message: "加载中...",
      duration: 0
    });
    showGame(game_id)
      .then(res => {
        console.log(res);
        this.game = res.data.game;
        this.game.distance = getFlatternDistance(
          this.$store.state.user.location.lng,
          this.$store.state.user.location.lat,
          res.data.game.lng,
          res.data.game.lat
        );
        this.game.game_time_ch = sillyDay(this.game.game_time);
        this.game.user.rate = calculatRate(this.game.user.game_comments);
        this.init(res.data.game.lat, res.data.game.lng);
        this.$toast.clear();
        //this.src = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${res.data.game.lat},${res.data.game.lng};title:超好吃冰激凌;addr:手帕口桥北铁路道口&key=RCDBZ-ALJKJ-HNIFV-KB4ZJ-CJOW6-2XFEX&referer=myapp`;
      })
      .catch(reason => {
        console.log(reason);
        this.$toast.fail("获取失败");
      });
  }
};
</script>
<style scoped lang="less">
.show {
  background-color: white;
  padding-top: 46px;
}
.invitation {
  //width: 100%;
  width: 10rem;
  height: 10rem;
  margin: 0 auto;
  background: no-repeat center top;
  background-size: contain;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  font-weight: bold;
  position: relative;
}

.join {
  position: absolute;
  bottom: 0.6rem;
  font-size: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: #4e44ed;
}

.invitation-name {
  font-size: 0.38rem;
}
.invitation-content {
  font-size: 0.37rem;
  text-indent: 0.8rem;
  margin-top: 0.1rem;
}
.invitation-content span,
.van-count-down {
  color: #ff9c00;
}
.invitation-publish {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  font-size: 0.38rem;
  position: relative;
  margin-top: -0.2rem;
}
.invitation-location,
.invitation-phone {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.36rem;
}
.invitation-location {
  margin-top: -0.2rem;
}
.invitation-location span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.invitation-location img {
  width: 0.7rem;
  height: 0.7rem;
}
.invitation-phone img {
  width: 0.5rem;
  height: 0.5rem;
  margin-left: 0.1rem;
}
.invitation-phone span {
  font-size: 0.34rem;
  margin-left: 0.1rem;
}
.show-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0.8rem;
}
.show-header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nickname {
  font-size: 0.4rem;
  font-weight: bold;
  margin-bottom: 0.1rem;
}
.show-header-left-inner {
  display: flex;
  flex-direction: column;
  margin-left: 0.3rem;
}
.show /deep/.van-rate__icon {
  font-size: 0.5rem;
}
.credit {
  font-size: 0.375rem;
  color: #00df77;
  position: relative;
  top: -0.05rem;
  margin-left: 0.2rem;
}
.map {
  border: 1px solid rgb(223, 223, 223);
  margin: 0.05rem 0.5rem 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
}
.map-address {
  padding: 0.2rem 0 0 0.2rem;
  font-weight: bold;
  font-size: 0.35rem;
}
.map-distance {
  padding-left: 0.2rem;
  padding-bottom: 0.1rem;
  color: grey;
  font-size: 0.3rem;
}
.else {
  padding-left: 0.3rem;
  padding-top: 0.1rem;
  font-size: 0.38rem;
}
.remarks {
  padding-left: 0.3rem;
  padding-top: 0.1rem;
  font-weight: bold;
  font-size: 0.38rem;
}
table {
  border-collapse: collapse;
  margin-bottom: 10px;
  width: 94%;
  text-align: center;
  margin: 0 auto;
}

table,
td,
th {
  border: 1px solid black;
  border-radius: 10px;
  font-size: 0.39rem;
  padding: 0.1rem;
}

td .van-icon-delete {
  font-size: 0.5rem;
}
.game-athletes {
  padding: 0.2rem 0.3rem;
}
.game-athletes-static {
  background-color: gray;
  color: white;
  padding: 0.13rem 0.2rem;
  margin: 0.2rem;
  display: inline-block;
  font-size: 0.33rem;
  font-weight: bold;
  letter-spacing: 0.2em;
  border-radius: 5px;
}
.van-count-down {
  display: inline;
}
.van-icon-chat-o {
  font-size: 0.8rem;
}
</style>