<!--  -->
<template>
  <div class="solo-chat">
    <van-nav-bar
      :title="chat_item.nickname"
      :bgColor="'#EDEDED'"
      v-show="!showmap"
      :showRight="true"
      :username="chat_item.username"
    />
    <scroll
      :style="scrollHeight"
      class="wrapper"
      :data="chat_item.chat_list"
      :pulldown="pulldown"
      @pulldown="handlePulldown"
      ref="wrapper"
    >
      <div class="cu-chat" v-for="(item,index) in chat_item.chat_list" :key="index">
        <div class="cu-item self" v-if="selfUserInfo.username==item.send_info.username">
          <div class="main">
            <div class="content bg-green shadow" v-if="item.type=='text'">
              <span>{{item.msg}}</span>
            </div>
            <div class="content-location bg-white shadow" v-if="item.type=='location'">
              <div style="map-txt">
                <div class="map-poiname">{{item.location.poiname}}</div>
                <div class="map-address">{{item.location.poiaddress}}</div>
                <div :id="item.id" style="width:5.8rem;height:3rem;margin: 0 auto;"></div>
              </div>
            </div>
            <div
              class="main"
              v-if="item.type=='equipment'"
              @click="jumpToEquipment(item.equipment.equipment_id)"
            >
              <div class="chat-equipment">
                <van-image
                  class="radius"
                  width="4rem"
                  height="3.8rem"
                  :src="item.equipment.equipment_images[0].img_url"
                />
                <div
                  class="equipment-item-content"
                  style="margin-top:0.1rem;"
                >{{item.equipment.content}}</div>
                <div class="equipment-item-price">¥{{item.equipment.price}}</div>
              </div>
            </div>

            <div class="main" v-if="item.type=='game'" @click="jumpToGame(item.game.game_id)">
              <div class="chat-equipment">
                <van-image
                  class="radius"
                  width="4rem"
                  height="3.8rem"
                  :src="item.game.user.avatar"
                />
                <div class="game-item" style="margin-top:0.1rem;">队长：{{item.game.user.nickname}}</div>
                <div class="game-item">类型：{{item.game.game_type}}</div>
                <div class="game-item">时间：{{sillyDay(item.game.game_time)}}</div>
                <div class="game-item game-item-last">地址：{{item.game.poiaddress}}</div>
              </div>
            </div>
          </div>

          <div
            class="cu-avatar radius"
            :style="{backgroundImage: 'url(' + selfUserInfo.avatar + ')'}"
          ></div>
          <div class="date">{{sillyDay(item.time)}}</div>
        </div>
        <div class="cu-item" v-else>
          <div class="cu-avatar radius" :style="{backgroundImage: 'url(' + chat_item.avatar + ')'}"></div>
          <div class="main">
            <div class="content shadow" v-if="item.type=='text'">
              <span>{{item.msg}}</span>
            </div>
            <div class="content-location bg-white shadow" v-if="item.type=='location'">
              <div style="map-txt">
                <div class="map-poiname">{{item.location.poiname}}</div>
                <div class="map-address">{{item.location.poiaddress}}</div>
                <div :id="item.id" style="width:5.8rem;height:3rem;margin: 0 auto;"></div>
              </div>
            </div>
            <div
              class="main"
              v-if="item.type=='equipment'"
              @click="jumpToEquipment(item.equipment.equipment_id)"
            >
              <div class="chat-equipment">
                <van-image
                  class="radius"
                  width="4rem"
                  height="3.8rem"
                  :src="item.equipment.equipment_images[0].img_url"
                />
                <div
                  class="equipment-item-content"
                  style="margin-top:0.1rem;"
                >{{item.equipment.content}}</div>
                <div class="equipment-item-price">¥{{item.equipment.price}}</div>
              </div>
            </div>

            <div class="main" v-if="item.type=='game'" @click="jumpToGame(item.game.game_id)">
              <div class="chat-equipment">
                <van-image
                  class="radius"
                  width="4rem"
                  height="3.8rem"
                  :src="item.game.user.avatar"
                />
                <div class="game-item" style="margin-top:0.1rem;">队长：{{item.game.user.nickname}}</div>
                <div class="game-item">类型：{{item.game.game_type}}</div>
                <div class="game-item">时间：{{sillyDay(item.game.game_time)}}</div>
                <div class="game-item game-item-last">地址：{{item.game.poiaddress}}</div>
              </div>
            </div>
          </div>
          <div class="date">{{sillyDay(item.time)}}</div>
        </div>
      </div>
    </scroll>
    <div class="chat-util" ref="chatUtil">
      <div class="cu-bar input" ref="input">
        <div
          class="cu-avatar round"
          style="background-image:url(https://image.weilanwl.com/img/square-3.jpg);margin-left:.2rem;"
        ></div>
        <div class="action">
          <span class="icon-roundaddfill span-grey"></span>
        </div>
        <input
          class="solid-bottom"
          maxlength="300"
          cursor-spacing="10"
          v-model="inputValue"
          @keyup.enter="sendTxt"
          @blur="fixScroll"
        />
        <van-icon name="plus" @click="toggleUtil" />
        <div class="action">
          <van-button type="primary" size="small" @click="sendTxt">发送</van-button>
        </div>
      </div>
      <div class="chat-util-grid">
        <van-grid :column-num="3" clickable>
          <van-grid-item icon="envelop-o" text="赛事" @click="gameShow" />
          <van-grid-item icon="location-o" text="发送位置" @click="showmap = true;" />
          <van-grid-item icon="goods-collect-o" text="装备" @click="equipmentShow" />
          <van-grid-item icon="photo-o" text="图片" />
          <van-grid-item icon="photo-o" text="图片" />
          <van-grid-item icon="photo-o" text="图片" />
        </van-grid>
      </div>
    </div>

    <van-popup v-model="showmap" :style="{ width:'100%', height: '100%' }">
      <TencentMapChooseLocation v-bind:showmap.sync="showmap" @location="backLocation"></TencentMapChooseLocation>
    </van-popup>

    <van-popup
      v-model="showEquipment"
      position="bottom"
      closeable
      round
      :style="{ width:'100%', height: '80%' }"
    >
      <div class="equipment-popup">
        <div class="equipment-title">我的装备</div>
        <div class="equipment-content">
          <div
            class="equipment-item"
            v-for="(item,index) in equipment"
            :key="index"
            @click="selectEquipment(item,index)"
          >
            <div class="equipment-item-image">
              <van-image width="100%" height="3.8rem" :src="item.equipment_images[0].img_url" />
            </div>
            <div class="equipment-item-content">{{item.content}}</div>
            <div class="equipment-item-price">¥{{item.price}}</div>
            <van-overlay :show="selectEquipmentIndex==index">
              <div class="equipment-inner">
                <div class="equipment-inner-send" @click.stop="sendEquipment(item)">
                  <div>发送</div>
                </div>
                <div class="equipment-inner-show" @click="jumpToEquipment(item.equipment_id)">
                  <div>查看</div>
                </div>
              </div>
            </van-overlay>
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="showGame"
      position="bottom"
      closeable
      round
      :style="{ width:'100%', height: '80%' }"
    >
      <div class="equipment-popup">
        <div class="equipment-title">我的比赛</div>
        <div class="equipment-content">
          <div
            class="equipment-item"
            v-for="(item,index) in game"
            :key="index"
            @click="selectGameIndex = index"
          >
            <div class="equipment-item-image">
              <van-image width="100%" height="3.8rem" :src="item.user.avatar" />
            </div>
            <div class="game-item">队长：{{item.user.nickname}}</div>
            <div class="game-item">类型：{{item.game_type}}</div>
            <div class="game-item">时间：{{sillyDay(item.game_time)}}</div>
            <div class="game-item game-item-last">地址：{{item.poiaddress}}</div>
            <van-overlay :show="selectGameIndex==index">
              <div class="equipment-inner">
                <div class="equipment-inner-send" @click.stop="sendGame(item)">
                  <div>发送</div>
                </div>
                <div class="equipment-inner-show" @click="jumpToGame(item.game_id)">
                  <div>查看</div>
                </div>
              </div>
            </van-overlay>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- <div id="map" style="width:100%;height:6rem;margin: 0 auto;"></div> -->
  </div>
</template>

<script>
import TencentMapChooseLocation from "@/components/TencentMapChooseLocation";
import VanNavBar from "@/components/VanNavBar";
import Scroll from "@/components/Scroll";
import { ip } from "@/config";
import { equipmentRequest, gameRequest } from "@/api";
import { sillyDay1 } from "@/utils";
export default {
  components: {
    "van-nav-bar": VanNavBar,
    scroll: Scroll,
    TencentMapChooseLocation
  },
  data() {
    return {
      pulldown: true,
      pullup: true,
      scrollHeight: null,
      showUtil: false,
      inputValue: "",
      chat_item: null,
      showmap: false,
      showEquipment: false,
      showGame: false,
      equipment: [],
      game: [],
      hasGetEquipment: false,
      hasGetGame: false,
      selectEquipmentIndex: -1,
      selectGameIndex: -1
    };
  },
  computed: {
    selfUserInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  watch: {
    "chat_item.chat_list": {
      handler: function(val) {
        if (val.length != 0) {
          let data = val[val.length - 1];
          if (
            //如果接受的类型是地址 初始化
            data.type == "location" &&
            data.send_info.username != this.selfUserInfo.username
          ) {
            //先取到页面元素
            this.$nextTick(() => {
              this.init(
                data.id,
                data.location.latlng.lat,
                data.location.latlng.lng
              );
            });
          }
          setTimeout(() => {
            this.$refs.wrapper.refresh();
            this.$refs.wrapper.scrollToEnd();
          }, 20);
          //this.$forceUpdate();
        }
      },
      deep: true
    }
  },
  methods: {
    sillyDay(timeStamp) {
      return sillyDay1(timeStamp);
    },
    jumpToGame(game_id) {
      this.$router.push({ name: "ShowGame", query: { game_id } });
    },
    sendGame(item) {
      let data = {
        send_info: {
          username: this.selfUserInfo.username,
          avatar: this.selfUserInfo.avatar,
          tag: this.selfUserInfo.tag,
          nickname: this.selfUserInfo.nickname
        },
        receive_id: this.chat_item.username,
        game: item,
        time: new Date().getTime(),
        type: "game"
      };

      this.send(data, "game");
    },
    equipmentShow() {
      this.showEquipment = true;
      if (!this.hasGetEquipment) {
        equipmentRequest
          .showEquipmentByUsers(this.selfUserInfo.username)
          .then(res => {
            this.hasGetEquipment = true;
            this.equipment = res.data.equipment;
          });
      }
    },
    gameShow() {
      this.showGame = true;
      if (!this.hasGetGame) {
        gameRequest.getGames(this.selfUserInfo.username).then(res => {
          this.hasGetGame = true;
          this.game = res.data.games;
        });
      }
    },
    selectEquipment(item, index) {
      //console.log(item);
      this.selectEquipmentIndex = index;
    },
    sendEquipment(item) {
      let data = {
        send_info: {
          username: this.selfUserInfo.username,
          avatar: this.selfUserInfo.avatar,
          tag: this.selfUserInfo.tag,
          nickname: this.selfUserInfo.nickname
        },
        receive_id: this.chat_item.username,
        equipment: item,
        time: new Date().getTime(),
        type: "equipment"
      };

      this.send(data, "equipment");
    },
    jumpToEquipment(equipment_id) {
      this.$router.push({ name: "ShowEquipment", query: { equipment_id } });
    },
    handlePulldown() {
      //this.data.unshift(1);
      console.log("下拉刷新");
    },
    toggleUtil() {
      this.showUtil ? (this.showUtil = false) : (this.showUtil = true);
      this.setScrollHeight();
      this.$nextTick(() => {
        this.$refs.wrapper.refresh();
        this.$refs.wrapper.scrollToEnd();
      });
    },
    setScrollHeight() {
      if (this.showUtil) {
        this.scrollHeight = {
          height:
            document.documentElement.clientHeight -
            48 -
            this.$refs.chatUtil.clientHeight +
            "px"
        };
      } else {
        this.scrollHeight = {
          height:
            document.documentElement.clientHeight -
            48 -
            this.$refs.input.clientHeight +
            "px"
        };
      }
    },
    send(data, type) {
      this.$socket.emit("chat", data);
      this.chat_item.chat_list.push(data);
      if (type == "text") {
        this.inputValue = "";
      } else if (type == "equipment") {
        this.showEquipment = false;
      } else if (type == "game") {
        this.showGame = false;
      }

      this.$nextTick(() => {
        this.$refs.wrapper.refresh();
        this.$refs.wrapper.scrollToEnd();
      });
    },
    sendTxt() {
      let data = {
        send_info: {
          username: this.selfUserInfo.username,
          avatar: this.selfUserInfo.avatar,
          tag: this.selfUserInfo.tag,
          nickname: this.selfUserInfo.nickname
        },
        receive_id: this.chat_item.username,
        msg: this.inputValue,
        time: new Date(),
        type: "text"
      };

      this.send(data, "text");
    },
    backLocation(location) {
      //发送地址
      let time = new Date();
      let id = "mapid" + time.getTime();
      let data = {
        send_info: {
          username: this.selfUserInfo.username,
          avatar: this.selfUserInfo.avatar,
          tag: this.selfUserInfo.tag,
          nickname: this.selfUserInfo.nickname
        },
        receive_id: this.chat_item.username,
        time: new Date(),
        time: time,
        type: "location",
        location: location,
        id: id
      };
      this.$socket.emit("chat", data);

      this.chat_item.chat_list.push(data);

      this.showmap = false;
      this.$refs.wrapper.refresh();
      this.$refs.wrapper.scrollToEnd();
      this.$nextTick(() => {
        this.init(id, location.latlng.lat, location.latlng.lng);
      });
    },
    toNavigation(item) {
      console.log(item);
      return;
      this.$router.push({
        name: "Navigation",
        query: {
          eword: this.game.poiaddress,
          lat: this.game.lat,
          lng: this.game.lng
        }
      });
    },
    init(id, Lat, Lng) {
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
      var map = new qq.maps.Map(document.getElementById(id), myOptions);

      //添加监听事件
      //添加监听事件
      qq.maps.event.addListener(map, "click", function() {
        alert("您点击了地图.");
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
        console.log(marker);
      });
    },
    fixScroll() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        window.scrollTo(0, 0);
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    let username = this.$route.query.username;
    this.$store.state.socket.chat_list.forEach((element, index) => {
      if (element.username == username) {
        this.chat_item = element;
        this.$store.commit("clear_unread_num", index);
        //置顶
        this.$store.commit("chat_list_to_top", index);
        //this.chatRecord = element.chat_list;
      }
    });
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    //渲染历史聊天记录中的地址
    this.chat_item.chat_list.forEach(item => {
      if (item.type == "location") {
        this.init(item.id, item.location.latlng.lat, item.location.latlng.lng);
      }
    });
    this.setScrollHeight();
  }
};
</script>
<style scoped lang="less">
.solo-chat {
  padding-top: 46px;
  height: 100vh;
  overflow: hidden;
}
.wrapper {
  overflow: hidden;
}
// .wrapper {
//   transition: all 0.2s;
//   -webkit-transition: all 0.2s; /* Safari */
// }
.cu-chat {
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  //padding-bottom: 100 * 0.011rem;
}

.van-button--small {
  min-width: 0;
}

.round {
  border-radius: 50%;
}

.cu-chat .cu-item {
  display: flex;
  padding: 30 * 0.011rem 30 * 0.011rem 70 * 0.011rem;
  position: relative;
}

.cu-chat .cu-item > .cu-avatar {
  width: 80 * 0.011rem;
  height: 80 * 0.011rem;
}

.cu-chat .cu-item > .main {
  max-width: calc(100% - 260 * 0.011rem);
  margin: 0 40 * 0.011rem;
  display: flex;
  align-items: center;
}

.cu-chat .cu-item > image {
  height: 320 * 0.011rem;
}

.cu-chat .cu-item > .main .content {
  padding: 20 * 0.011rem;
  border-radius: 6 * 0.011rem;
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  font-size: 30 * 0.011rem;
  position: relative;
  min-height: 80 * 0.011rem;
  line-height: 40 * 0.011rem;
  text-align: left;
  word-break: break-all;
}

.cu-chat .cu-item > .main .content-location {
  padding: 1px;
  border-radius: 6 * 0.011rem;
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  font-size: 30 * 0.011rem;
  position: relative;
  min-height: 80 * 0.011rem;
  line-height: 40 * 0.011rem;
  text-align: left;
  word-break: break-all;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.cu-chat .cu-item > .main .content:not([class*="bg-"]) {
  background-color: #ffffff;
  color: #333333;
}

.cu-chat .cu-item .date {
  position: absolute;
  font-size: 24 * 0.011rem;
  //color: black;
  //width: calc(100% - 320 * 0.011rem);
  bottom: 20 * 0.011rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.011rem 0.11rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6 * 0.011rem;
  color: #ffffff;
}

.cu-chat .cu-item .action {
  padding: 0 30 * 0.011rem;
  display: flex;
  align-items: center;
}

.cu-chat .cu-item > .main .content::after {
  content: "";
  top: 27 * 0.011rem;
  transform: rotate(45deg);
  position: absolute;
  z-index: 100;
  display: inline-block;
  overflow: hidden;
  width: 24 * 0.011rem;
  height: 24 * 0.011rem;
  left: -12 * 0.011rem;
  right: initial;
  background-color: inherit;
}

.cu-chat .cu-item > .main .content-location::after {
  content: "";
  top: 27 * 0.011rem;
  transform: rotate(45deg);
  position: absolute;
  z-index: 100;
  display: inline-block;
  overflow: hidden;
  width: 24 * 0.011rem;
  height: 24 * 0.011rem;
  left: -12 * 0.011rem;
  right: initial;
  background-color: inherit;
}

.cu-chat .cu-item.self > .main .content-location::after {
  left: auto;
  right: -12 * 0.011rem;
}

.cu-chat .cu-item.self > .main .content::after {
  left: auto;
  right: -12 * 0.011rem;
}

.cu-chat .cu-item > .main .content::before {
  content: "";
  top: 30 * 0.011rem;
  transform: rotate(45deg);
  position: absolute;
  z-index: -1;
  display: inline-block;
  overflow: hidden;
  width: 24 * 0.011rem;
  height: 24 * 0.011rem;
  left: -12 * 0.011rem;
  right: initial;
  background-color: inherit;
  filter: blur(5 * 0.011rem);
  opacity: 0.3;
}

.cu-chat .cu-item > .main .content:not([class*="bg-"])::before {
  background-color: #333333;
  opacity: 0.1;
}

.cu-chat .cu-item.self > .main .content::before {
  left: auto;
  right: -12 * 0.011rem;
}

.cu-chat .cu-item.self {
  justify-content: flex-end;
  text-align: right;
}

.cu-chat .cu-info {
  display: inline-block;
  margin: 20 * 0.011rem auto;
  font-size: 24 * 0.011rem;
  padding: 8 * 0.011rem 12 * 0.011rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6 * 0.011rem;
  color: #ffffff;
  max-width: 400 * 0.011rem;
  line-height: 1.4;
}
.bg-green {
  background-color: #39b54a;
  color: #ffffff;
}
.cu-avatar {
  font-variant: small-caps;
  margin: 0;
  padding: 0;
  display: inline-flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  color: #ffffff;
  white-space: nowrap;
  position: relative;
  width: 64 * 0.011rem;
  height: 64 * 0.011rem;
  background-size: cover;
  background-position: center;
  vertical-align: middle;
  font-size: 1.5em;
}

.cu-avatar.sm {
  width: 48 * 0.011rem;
  height: 48 * 0.011rem;
  font-size: 1em;
}

.cu-avatar.lg {
  width: 96 * 0.011rem;
  height: 96 * 0.011rem;
  font-size: 2em;
}

.cu-avatar.xl {
  width: 128 * 0.011rem;
  height: 128 * 0.011rem;
  font-size: 2.5em;
}

.cu-avatar .avatar-span {
  font-size: 0.4em;
}

.cu-avatar-group {
  direction: rtl;
  unicode-bidi: bidi-override;
  padding: 0 10 * 0.011rem 0 40 * 0.011rem;
  display: inline-block;
}

.cu-avatar-group .cu-avatar {
  margin-left: -30 * 0.011rem;
  border: 4 * 0.011rem solid #f1f1f1;
  vertical-align: middle;
}

.cu-avatar-group .cu-avatar.sm {
  margin-left: -20 * 0.011rem;
  border: 1 * 0.011rem solid #f1f1f1;
}
.cu-chat .cu-item.self > .main .content::after {
  left: auto;
  right: -12 * 0.011rem;
}
.cu-chat .cu-item.self > .main .content::before {
  left: auto;
  right: -12 * 0.011rem;
}

.cu-chat .cu-item.self {
  justify-content: flex-end;
  text-align: right;
}
.radius {
  border-radius: 6rem * 0.011rem;
}
img {
  max-width: 100%;
  display: inline-block;
  position: relative;
  z-index: 0;
}
.cu-bar {
  display: flex;
  position: relative;
  align-items: center;
  min-height: 100 * 0.011rem;
  justify-content: space-between;
}
.solid-bottom {
  position: relative;
  border: none;
  border-bottom: 1 * 0.011rem solid rgba(0, 0, 0, 0.1);
}
.solid-bottom::after {
  content: " ";
  width: 200%;
  height: 200%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: inherit;
  transform: scale(0.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
  border-bottom: 1 * 0.011rem solid rgba(0, 0, 0, 0.1);
}
.cu-bar .action {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  max-width: 100%;
}
.cu-bar.input {
  padding-right: 20 * 0.011rem;
  background-color: #ffffff;
}

.cu-bar.input input {
  overflow: initial;
  line-height: 64 * 0.011rem;
  height: 64 * 0.011rem;
  min-height: 64 * 0.011rem;
  flex: 1;
  font-size: 30 * 0.011rem;
  margin: 0 20 * 0.011rem;
}

.cu-bar.input .action {
  margin-left: 20 * 0.011rem;
}

.cu-bar.input .action [class*="cuIcon-"] {
  font-size: 48 * 0.011rem;
}

.cu-bar.input input + .action {
  margin-right: 20 * 0.011rem;
  margin-left: 0 * 0.011rem;
}

.cu-bar.input .action:first-child [class*="cuIcon-"] {
  margin-left: 0 * 0.011rem;
}
.van-icon-smile-o,
.van-icon-plus {
  color: gray;
  font-size: 0.6rem;
}
.map {
  border: 1px solid rgb(223, 223, 223);
  margin: 0.05rem 0.5rem 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
}
.map-poiname {
  padding: 0.05rem 0.2rem;
  font-weight: bold;
  font-size: 0.355rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 5.7rem;
}
.map-address {
  padding: 0 0.2rem 0.05rem;
  color: gray;
  font-size: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 5.7rem;
}
.remarks {
  padding-left: 0.3rem;
  padding-top: 0.1rem;
  font-weight: bold;
  font-size: 0.38rem;
}
.bg-white {
  background-color: white;
}
.solo-chat/deep/.van-popup--bottom {
  z-index: 200000 !important;
}
// .solo-chat/deep/.csssprite{
//   display: none;
// }
.equipment-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.equipment-title {
  text-align: center;
  font-size: 0.35rem;
  padding: 0.345rem 0.345rem 0;
}
.equipment-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0.2rem;
  overflow: scroll;
  flex: 1;
  background-color: #f2f2f2;
  padding: 0.345rem;
}

.equipment-item {
  width: 48.5%;
  margin-bottom: 0.2rem;
  border-radius: 0.1rem;
  background-color: white;
  position: relative;
}
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
.solo-chat/deep/.van-image__img {
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
}
.equipment-item-content {
  padding: 0.05rem 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.33rem;
}
.equipment-item-price {
  padding: 0 0.2rem 0.1rem;
  color: rgb(248, 99, 12);
  font-size: 0.35rem;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: red;
  z-index: 2001;
}

.van-overlay {
  position: absolute;
  border-radius: 0.1rem;
  background-color: rgba(0, 0, 0, 0.6);
}
.equipment-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.equipment-inner-send {
  width: 1.2rem;
  height: 1.2rem;
  //margin-top: 180rpx;
  border-radius: 50%;
  background-color: #1e90ff;
  margin-bottom: 0.1rem;
}

.equipment-inner-send div {
  width: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.34rem;
}
.equipment-inner-show {
  color: white;
  border-radius: 50%;
  background-color: rgba(184, 183, 183, 0.6);
  margin-top: 0.1rem;
}
.equipment-inner-show div {
  width: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.34rem;
}
.chat-equipment {
  display: flex;
  flex-direction: column;
  width: 4rem;
  text-align: left;
  background-color: white;
  border-radius: 6rem * 0.011rem;
}
.game-item {
  padding-left: 0.15rem;
  color: gray;
}
.game-item-last {
  padding-bottom: 0.15rem;
}
</style>