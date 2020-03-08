<!--  -->
<template>
  <div class="mine-equipment">
    <van-nav-bar :title="'我的装备'" />
    <div class="equipment-popup">
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
              <div class="equipment-inner-send" @click.stop="showEquipment(item.equipment_id)">
                <div>查看</div>
              </div>
              <div class="equipment-inner-show" @click="deleteEquipment(item.equipment_id)">
                <div>删除</div>
              </div>
            </div>
          </van-overlay>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { showEquipmentByUsers } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      equipment: [],
      selectEquipmentIndex: -1
    };
  },
  computed: {},
  watch: {},
  methods: {
    selectEquipment(item, index) {
      this.selectEquipmentIndex = index;
    },
    showEquipment(equipment_id) {
      this.$router.push({ name: "ShowEquipment", query: { equipment_id } });
    },
    deleteEquipment(equipment_id) {}
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    showEquipmentByUsers(this.$store.state.user.userInfo.username).then(res => {
      this.equipment = res.data.equipment;
    });
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.mine-equipment {
  margin-top: 46px;
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
.chat-equipment {
  display: flex;
  flex-direction: column;
  width: 4rem;
  text-align: left;
  background-color: white;
  border-radius: 6rem * 0.011rem;
}
.mine-equipment/deep/.van-image__img {
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
}
</style>