<!--  -->
<template>
  <div class="equipment">
    <van-tabs swipeable animated @change="tagChange">
      <van-tab title="全城">
        <van-notice-bar
          v-show="part=='全城'"
          text="球友们,此处仅作为交易信息的发布平台,不作担保,不提供交易途径,具体交易方式请买家自行斟酌,在交易时一定要注意财产安全问题！"
          left-icon="volume-o"
        />
        <vue-waterfall-easy
          :mobileGap="12"
          :imgsArr="equipmentAll"
          @scrollReachBottom="getEquipment"
          isRouterLink
          ref="waterfallAll"
        >
          <div class="img-info" slot-scope="props">
            <div class="img-info-content">{{props.value.content}}</div>
            <div class="img-info-price">
              <div style="color:#f8630c">
                <span style="font-size:0.2rem;">¥</span>
                {{props.value.price}}
                <span class="img-info-tag">{{props.value.tag}}</span>
              </div>
              <van-divider />
              <div class="img-info-footer">
                <div>
                  <van-image width="0.6rem" height="0.6rem" :src="props.value.user.avatar" />
                  <span class="img-info-tag" style="margin-left:0.2rem;">{{props.value.district}}</span>
                </div>
                <div class="img-info-tag" style="color:#23c590;">信用评分：{{props.value.user.credit}}</div>
              </div>
            </div>
          </div>
          <div slot="waterfall-over">waterfall-over</div>
        </vue-waterfall-easy>
      </van-tab>

      <van-tab title="同区">
        <van-notice-bar
          v-show="part=='同区'"
          text="球友们,此处仅作为交易信息的发布平台,不作担保,不提供交易途径,具体交易方式请买家自行斟酌,在交易时一定要注意财产安全问题！"
          left-icon="volume-o"
        />
        <vue-waterfall-easy
          :mobileGap="12"
          :imgsArr="equipmentPart"
          @scrollReachBottom="getEquipment"
          isRouterLink
          ref="waterfallPart"
        >
          <div class="img-info" slot-scope="props">
            <div class="img-info-content">{{props.value.content}}</div>
            <div class="img-info-price">
              <div style="color:#f8630c">
                <span style="font-size:0.2rem;">¥</span>
                {{props.value.price}}
                <span class="img-info-tag">{{props.value.tag}}</span>
              </div>
              <van-divider />
              <div class="img-info-footer">
                <div>
                  <van-image width="0.6rem" height="0.6rem" :src="props.value.user.avatar" />
                  <span class="img-info-tag" style="margin-left:0.2rem;">{{props.value.district}}</span>
                </div>
                <div class="img-info-tag" style="color:#23c590;">信用评分：{{props.value.user.credit}}</div>
              </div>
            </div>
          </div>
          <div slot="waterfall-over">waterfall-over</div>
        </vue-waterfall-easy>
      </van-tab>
    </van-tabs>

    <div class="add" @click="add">
      <mu-button fab color="teal">
        <mu-icon value="add"></mu-icon>
      </mu-button>
    </div>
  </div>
</template>

<script>
import { getEquipment } from "@/api";
import { ago } from "@/utils";
import vueWaterfallEasy from "vue-waterfall-easy";
export default {
  components: { vueWaterfallEasy },
  data() {
    return {
      equipmentAll: [],
      equipmentPart: [],
      pageAll: 1,
      pagePart: 1,
      part: "全城",
      countAll: 0,
      countPart: 0
    };
  },
  computed: {},
  watch: {},
  methods: {
    tagChange(name, title) {
      this.part = title;
      if (this.equipmentPart.length == 0) {
        this.getEquipment();
      }
    },
    ago(time) {
      return ago(time);
    },
    add() {
      this.$router.push({ name: "AddEquipment" });
    },
    getEquipment() {
      getEquipment(
        this.part == "全城" ? this.pageAll : this.pagePart,
        this.part == "全城"
          ? this.part
          : this.$store.state.user.location.district
      )
        .then(res => {
          console.log(res);

          res.data.equipment.forEach(item => {
            item.src = item.equipment_images[0].img_url;
            item.href = "/equipment/show?equipment_id=" + item.equipment_id;
          });

          if (this.part == "全城") {
            this.equipmentAll = this.equipmentAll.concat(res.data.equipment);
            this.pageAll++;
            if (this.countAll != res.data.count) {
              this.countAll = res.data.count;
            }
            if (this.countAll == this.equipmentAll.length) {
              this.$refs.waterfallAll.waterfallOver();
            }
          } else {
            this.equipmentPart = this.equipmentPart.concat(res.data.equipment);
            this.pagePart++;
            if (this.countPart != res.data.count) {
              this.countPart = res.data.count;
            }
            if (this.countPart == this.equipmentPart.length) {
              this.$refs.waterfallPart.waterfallOver();
            }
          }
        })
        .catch(reason => {});
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getEquipment();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.equipment {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.equipment/deep/.van-tabs {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
}
.equipment/deep/.van-tabs__content {
  flex: 1;
  overflow: auto;
}
.equipment/deep/.van-tabs__line {
  width: 1.2rem !important;
}
.equipment/deep/.van-tab {
  font-size: 0.45rem !important;
  font-weight: bold;
}

.icon-tubiao {
  font-size: 0.8rem;
  margin: 0.2rem;
  color: rgb(245, 173, 17);
}

.equip-tip {
  font-size: 0.4rem;
  color: rgb(156, 156, 156);
  display: flex;
  align-items: center;
}

.icon-xinzeng {
  font-size: 1.5rem;
  color: #23c590;
}

.add {
  position: fixed;
  right: 30px;
  bottom: 70px;
}

.card {
  width: 95%;
  border-radius: 5px;
  margin: 0.25rem auto;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19);
  // text-align: center;
  padding: 0.1rem;
  background-color: white;
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
  // padding: 0.1rem;
}
.game-item-header-time {
  font-size: 0.25rem;
  color: rgb(179, 177, 175);
  font-weight: normal;
}
.game-item-header-price {
  font-size: 0.55rem;
  color: rgb(248, 99, 12);
}
.game-item-button {
  display: flex;
}

.game-item-content-text {
  font-size: 0.3rem;
  padding: 0.1rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.van-button {
  margin: 0.05rem;
  font-size: 0.4rem;
}
.van-button--large {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
}

.game-item-content-photo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.game-item-content-photo-item {
  width: 2.2rem;
  height: 2.2rem;
  margin: 0 0.1rem 0.1rem 0;
}
.van-tab__pane .card:last-child {
  margin-bottom: 1.5rem;
}
.equipment/deep/.van-tab__pane {
  height: 100%;
  overflow: scroll;
}
.img-info {
  display: flex;
  flex-direction: column;
  padding: 0 0.15rem;
}
.img-info-content {
  color: black;
  word-break: break-all;
  font-size: 0.36rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 0.32rem;
  margin-top: 0.1rem;
}
.img-info-price {
  font-size: 0.4rem;
}
.img-info-tag {
  font-size: 0.11rem;
  color: grey;
}
.equipment/deep/.van-divider {
  margin: 5px 0;
}
.equipment/deep/.van-image__img {
  border-radius: 2px;
}
.img-info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.15rem;
}
.img-info-footer div:first-child {
  display: flex;
  align-items: center;
}
.equipment/deep/.over {
  display: none;
}
.equipment/deep/.vue-waterfall-easy-container {
  height: calc(100% - 50px) !important;
}
</style>