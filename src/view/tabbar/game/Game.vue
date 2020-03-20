<!--  -->
<template>
  <div class="game">
    <div class="game-header">
      <div class="search-bar">
        <form action="/">
          <van-search
            v-model="keyword"
            placeholder="请输入人名"
            show-action
            @search="onSearch"
            @focus="searchFocus = true"
            @blur="searchFocus = false"
          >
            <div slot="action" v-show="searchFocus" @click="onCancel">取消</div>
          </van-search>
        </form>
      </div>
      <div class="game-header-select">
        <div class="game-header-select-item">
          <span
            @click="searchSelect('推荐')"
            :class="[game_part == '推荐'?'game-header-select-item-text':'']"
          >推荐</span>
          <span
            @click="searchSelect('最新')"
            :class="[game_part == '最新'?'game-header-select-item-text':'']"
          >最新</span>
        </div>
        <div class="game-header-select-item select-text">
          <span @click="show = true">筛选</span>
        </div>
      </div>
    </div>

    <div class="game-body" ref="wrapper">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="game-list">
            <div
              class="game-item"
              v-for="(item,index) in list"
              :key="index"
              @click="toDetail(item.game_id)"
            >
              <div class="game-item-header">
                <div class="game-item-header-publish">
                  <van-image round width="1rem" height="1rem" :src="item.user.avatar" />
                  <div class="game-item-header-publish-in">
                    <span class="game-item-header-nickname">{{item.user.nickname}}</span>
                    <div>
                      <van-rate v-model="item.user.rate" allow-half readonly size="12" />
                      <span class="credit">{{item.user.credit}}</span>
                    </div>
                  </div>
                </div>
                <div class="game-item-header-att">
                  <van-button
                    type="info"
                    size="small"
                    @click.stop="appreciate(item.user,index,item.concernState)"
                    :color="item.concernState?'#fc8183':'#6ba7f0'"
                  >{{item.concernState?'已关注':'关注'}}</van-button>
                </div>
              </div>
              <div class="game-item-container">
                <div class="game-item-container-left">
                  <!-- <div class="game-rate">
                <van-rate v-model="item.user.rate" allow-half readonly size="15px" />
                <van-tag round type="primary" style="margin-left:0.2rem;">{{item.user.credit}}</van-tag>
                  </div>-->
                  <span
                    style="font-size:0.4rem;font-weight:bold;margin:0.15rem 0.85rem;"
                  >{{item.game_time}}</span>
                  <div class="typeandduration">
                    <span style="font-size:0.7rem;font-weight:bold;">{{item.game_type}}</span>
                    <span
                      style="font-size:0.5rem;font-weight:bold;margin-top:0.1rem;"
                    >{{item.duration}}小时</span>
                  </div>
                  <span class="game-time" style="padding:0.05rem 0;margin:0.1rem 0;">
                    距离开始
                    <span
                      style="font-family:'Arail';color:#ffa200;font-size:0.54rem;"
                    >{{item.game_time_future}}</span>
                  </span>
                  <!-- <div class="game-rate">
                <van-tag round type="primary">{{item.district}}</van-tag>
                <van-tag round type="primary" style="margin-left:0.1rem;">{{item.duration}}小时</van-tag>
                  </div>-->
                </div>
                <div class="game-item-container-right">
                  <div>
                    <span class="game_type">{{item.district}}</span>
                    <span class="game_number">
                      come
                      <span style="color:#ffa200;margin-left:3px;">{{item.game_number}}</span>
                    </span>
                  </div>

                  <!-- <mu-button color="success" round small @click.stop="join(item.game_id)">立即加入</mu-button> -->
                  <img class="join-img" src="../../../assets/images/join.png" alt />
                </div>

                <div class="link-img">
                  <img src="../../../assets/images/link.png" alt />
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <div class="add" @click="add">
      <mu-button fab color="teal">
        <mu-icon value="add"></mu-icon>
      </mu-button>
    </div>

    <van-popup
      v-model="show"
      position="right"
      closeable
      close-icon-position="top-left"
      :style="{width:'100%', height: '100%',borderRadius:0 }"
    >
      <div class="popup">
        <div class="popup-title">筛选</div>
      </div>
      <div class="popup-container">
        <h2>地区</h2>
        <div class="popup-select">
          <div
            v-for="(item,index) in districtOption"
            :key="index"
            class="popup-select-item"
            @click="select(item.value,'district')"
          >
            <div :class="[district==item.value?'selected':'']">{{item.text}}</div>
          </div>
        </div>
        <h2>类型</h2>
        <div class="popup-select">
          <div
            v-for="(item,index) in typeOption"
            :key="index"
            class="popup-select-item"
            @click="select(item.value,'game_type')"
          >
            <div :class="[game_type==item.value?'selected':'']">{{item.text}}</div>
          </div>
        </div>
        <h2>时长</h2>
        <div class="popup-select">
          <div
            v-for="(item,index) in durationOption"
            :key="index"
            class="popup-select-item"
            @click="select(item.value,'duration')"
          >
            <div :class="[duration==item.value?'selected':'']">{{item.text}}</div>
          </div>
        </div>
        <!-- <h2>距离</h2>
        <div class="popup-select">
          <div
            v-for="(item,index) in distanceOption"
            :key="index"
            class="popup-select-item"
            @click="select(item.value,'distance')"
          >
            <div :class="[distance==item.value?'selected':'']">{{item.text}}</div>
          </div>
        </div>-->
        <h2>位置</h2>
        <div class="popup-select">
          <div
            v-for="(item,index) in orientationOption"
            :key="index"
            class="popup-select-item"
            @click="select(item.value,'orientation')"
          >
            <div :class="[orientation==item.value?'selected':'']">{{item.text}}</div>
          </div>
        </div>
        <h2>限定</h2>
        <div class="popup-select">
          <div
            v-for="(item,index) in rateOption"
            :key="index"
            class="popup-select-item"
            @click="select(item.value,'rate')"
          >
            <div :class="[rate==item.value?'selected':'']">{{item.text}}</div>
          </div>
        </div>
        <h2>费用</h2>
        <div class="popup-select">
          <div
            v-for="(item,index) in chargeableOption"
            :key="index"
            class="popup-select-item"
            @click="select(item.value,'chargeable')"
          >
            <div :class="[chargeable===item.value?'selected':'']">{{item.text}}</div>
          </div>
        </div>
      </div>

      <div class="search-btn">
        <van-button type="default" @click="clear">清除</van-button>
        <van-button type="info" @click="selectSearch">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { gameRequest } from "@/api";
import { getFlatternDistance, quickSort, calculatRate } from "@/utils";
export default {
  components: {},
  data() {
    return {
      show: false,
      searchFocus: false,
      district: "全部",
      game_type: "全部",
      orientation: "全部",
      duration: 0,
      rate: 0,
      chargeable: "全部",
      game_part: "推荐",
      distance: 0,
      keyword: "",
      lng: this.$store.state.user.location.lng,
      lat: this.$store.state.user.location.lat,
      districtOption: [
        { text: "全部", value: "全部" },
        { text: "越秀区", value: "越秀区" },
        { text: "海珠区", value: "海珠区" },
        { text: "荔湾区", value: "荔湾区" },
        { text: "天河区", value: "天河区" },
        { text: "白云区", value: "白云区" },
        { text: "黄埔区", value: "黄埔区" },
        { text: "南沙区", value: "南沙区" },
        { text: "番禺区", value: "番禺区" },
        { text: "花都区", value: "花都区" },
        { text: "增城区", value: "增城区" },
        { text: "从化区", value: "从化区" }
      ],
      typeOption: [
        { text: "全部", value: "全部" },
        { text: "5v5", value: "5v5" },
        { text: "4v4", value: "4v4" },
        { text: "3v3", value: "3v3" }
      ],
      durationOption: [
        { text: "全部", value: 0 },
        { text: "1小时", value: 1 },
        { text: "1.5小时", value: 1.5 },
        { text: "2小时", value: 2 },
        { text: "2.5小时", value: 2.5 },
        { text: "3小时", value: 3 }
      ],
      orientationOption: [
        { text: "全部", value: "全部" },
        { text: "控球后卫", value: "控球后卫" },
        { text: "得分后卫", value: "得分后卫" },
        { text: "小前锋", value: "小前锋" },
        { text: "大前锋", value: "大前锋" },
        { text: "中锋", value: "中锋" }
      ],
      rateOption: [
        { text: "全部", value: 0 },
        { text: "2.5以上", value: 2.5 },
        { text: "3.5以上", value: 3.5 },
        { text: "4.5以上", value: 4.5 }
      ],
      chargeableOption: [
        { text: "全部", value: "全部" },
        { text: "免费", value: false },
        { text: "收费", value: true }
      ],
      distanceOption: [
        { text: "无限定", value: 0 },
        { text: "10公里内", value: 10 },
        { text: "20公里内", value: 20 },
        { text: "30公里内", value: 30 },
        { text: "40公里内", value: 40 }
      ],
      list: [],
      loading: false,
      finished: false,
      count: 0,
      page: 1,
      isLoading: false,
      scrollTop: 0
    };
  },
  computed: {
    concern() {
      return this.$store.state.user.concern;
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  watch: {
    concern: function(val) {
      if (val.length == 0) {
        this.list.forEach((item, index) => {
          item.concernState = false;
          this.$set(this.list, index, item);
        });
      } else {
        this.list.forEach((item, index) => {
          val.forEach(element => {
            if (item.user.username == element.concern_id) {
              item.concernState = true;
            }
          });
        });
      }
    },
    deep: true
  },
  methods: {
    select(value, type) {
      this[type] = value;
    },
    clear() {
      this.district = this.game_type = this.orientation = this.chargeable =
        "全部";
      this.duration = this.rate = this.distance = 0;
    },
    selectSearch() {
      this.show = false;
      this.onRefresh();
    },
    searchSelect(val) {
      this.game_part = val;
      this.onRefresh();
    },
    add() {
      this.$router.push({ name: "AddGame" });
    },
    onSearch(value) {
      this.keyword = value;
      this.$nextTick(() => {
        this.onRefresh();
      });
    },
    onCancel() {
      this.searchFocus = false;
    },
    onLoad() {
      this.loading = true;
      this.getGame();
    },
    onRefresh() {
      this.list.length = 0;
      this.page = 1;
      this.count = 0;
      this.getGame();
    },
    getGame() {
      this.$toast.loading({
        mask: true,
        message: "加载中...",
        duration: 0
      });

      gameRequest
        .getGame(
          this.page,
          this.district,
          this.game_type,
          this.duration,
          this.game_part,
          this.orientation,
          this.rate,
          this.chargeable,
          this.keyword
        )
        .then(res => {
          console.log(res);
          // 加载状态结束
          this.$toast.clear();
          this.loading = false;
          this.count = res.data.count;
          if (this.isLoading) {
            this.isLoading = false;
          }
          this.page++;

          res.data.rows.forEach(element1 => {
            //计算评分
            element1.user.rate = calculatRate(element1.user.game_comments);
            this.concern.forEach(element2 => {
              if (element1.user.username == element2.concern_id) {
                element1.concernState = true;
              }
            });
          });

          //计算距离
          if (this.game_part == "推荐") {
            res.data.rows.forEach(item => {
              item.distance = getFlatternDistance(
                this.lng,
                this.lat,
                item.lng,
                item.lat
              );
            });
          }

          this.list = this.list.concat(res.data.rows);

          //排序
          // if (this.game_part == "推荐") {
          //   this.list = quickSort(this.list);
          // }

          this.finished = this.list.length == this.count ? true : false;
        });
    },
    toDetail(game_id) {
      this.$router.push({ name: "ShowGame", query: { game_id: game_id } });
    },

    appreciate(item, index, concernState) {
      if (!this.$store.state.user.loginStatus) {
        this.$toast("请先登录");
        return;
      } else {
        if (this.$store.state.user.userInfo.username == item.username) {
          this.$toast("不能关注自己");
          return;
        }
        let data = {};
        data.username = this.$store.state.user.userInfo.username;
        data.concern_id = item.username;
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
              this.list.forEach((element, index) => {
                if (element.user.username == data.concern_id) {
                  element.concernState = true;
                  this.$set(this.list, index, element);
                }
              });
              this.$toast.clear();
              this.$toast("关注成功");
            })
            .catch(reason => {
              console.log(reason);
            });
        } else {
          //取消关注
          this.$store
            .dispatch("delConcern", data)
            .then(res => {
              this.list.forEach((element, index) => {
                if (element.user.username == data.concern_id) {
                  element.concernState = false;
                  this.$set(this.list, index, element);
                }
              });
              this.$toast.clear();
              this.$toast("操作成功");
            })
            .catch(reason => {
              console.log(reason);
            });
        }
      }
    },
    recordScrollPosition(e) {
      //console.log(e.target)
      this.scrollTop = e.target.scrollTop;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  activated() {
    this.$refs.wrapper.scrollTop = this.scrollTop;
    this.$refs.wrapper.addEventListener("scroll", this.recordScrollPosition);
  },
  deactivated() {
    //keep-alive 的页面跳转时，移除scroll事件
    this.$refs.wrapper.removeEventListener("scroll", this.recordScrollPosition); //清除绑定的scroll事件
  }
};
</script>
<style scoped lang="less">
.game {
  display: flex;
  flex-direction: column;
  background-color: #e6e6e6;
  height: calc(100vh - 50px);
}
.game-header {
  background-color: white;
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
.add {
  position: fixed;
  right: 30px;
  bottom: 70px;
}
.van-icon-add-o {
  font-size: 1rem;
  border-radius: 50%;
  padding: 5px;
  color: gray;
}
.van-popup {
  padding: 20px;
  width: 70%;
  border-radius: 5px;
}
.add-popup {
  display: flex;
  flex-direction: column;
}
.add-header {
  display: flex;
}
.add-header-name {
  font-size: 1.3rem;
  color: #2e2e2e;
  margin-left: 10px;
  //font-family: Arial, Helvetica, sans-serif;
}
.van-list {
  padding-bottom: 50px;
}
.game-list {
  //margin: 0.3rem;
}
.game-item {
  padding: 0.3rem;
  margin-bottom: 0.15rem;
  background-color: white;
}
.game-item-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.game-item-header-publish {
  display: flex;
  flex-direction: row;
  align-items: center;
}
@font-face {
  font-family: "Arail";
  src: url("../../../assets/font/Arial.ttf");
}
.game-item-header-nickname {
  //font-family: "test";
  font-size: 0.4rem;
  margin-left: 0.2rem;
  font-weight: bold;
}
.game-item-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #454343;
  position: relative;
}
.game-item-container-left {
  margin: 0.2rem;
  display: flex;
  flex-direction: column;
  //border-right: 2px solid #d3d2d2;
  //padding-right: 0.5rem;
}
.game-rate {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.1rem 0;
}
.game-item-container-right {
  display: flex;
  color: #454343;
  flex-direction: column;
  // margin-top: 0.3rem;
  padding: 0.1rem;
  align-items: center;
  justify-content: center;
}
.game-item-header-publish-in {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.1rem;
}
.game-item-header-publish-in div {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 0.1rem;
}
.credit {
  color: #00df77;
  font-size: 0.3rem;
  margin-left: 0.1rem;
}
.game /deep/ .mu-button-round {
  min-width: 0px;
  padding: 3px;
}
.game_type {
  font-size: 0.6rem;
  font-weight: bold;
  text-align: center;
}
.typeandduration {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-family: "黑体";
}
.game-time {
  font-size: 0.38rem;
  color: #6ba7f0;
  font-weight: bold;
  //margin-left: 0.55rem;
  position: relative;
  text-align: center;
  top: -0.3rem;
}
.game_number {
  font-family: "Arail";
  font-weight: bold;
  font-size: 0.55rem;
}
.join-img {
  width: 2.2rem;
  height: 1rem;
  margin-left: 0.7rem;
}
.game-item-container-right > div {
  display: flex;
  flex-direction: column;
  border-left: 2px solid #ccc;
  padding-left: 0.6rem;
}
.link-img {
  position: absolute;
  bottom: 0.3rem;
  left: 55%;
}
.link-img img {
  width: 1.7rem;
  height: 0.85rem;
}
.game-body {
  flex: 1;
  overflow: auto;
}
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.popup-title {
  font-size: 0.4rem;
  font-weight: bold;
}
.popup-select {
  display: flex;
  flex-wrap: wrap;
}
.popup-select-item {
  width: 33%;
  text-align: center;
}
.popup-select-item div {
  margin: 0.1rem;
  font-size: 0.35rem;
  background-color: rgb(246, 243, 243);
  padding: 0.1rem;
  border: 1px solid rgb(246, 243, 243);
}
.selected {
  border: 1px solid #1989fa !important;
  color: #1989fa;
}
.search-btn {
  display: flex;
}
.search-btn/deep/.van-button--normal:last-child {
  flex: 1;
  margin-left: 0.5rem;
}
.search-btn/deep/.van-button--normal:first-child {
  width: 3rem;
}
.popup-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-bottom: 0.3rem;
}

.van-popup {
  display: flex;
  flex-direction: column;
}
.game-header-select {
  display: flex;
  justify-content: space-between;
  margin: 0.1rem 0.3rem 0rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.15rem;
}
.game-header-select-item {
  font-size: 0.35rem;
}
.select-text {
  background-color: #e6e6e6;
  padding: 0.05rem 0.1rem;
  border-radius: 3px;
}
.game-header-select-item-text {
  font-weight: bold;
}
</style>