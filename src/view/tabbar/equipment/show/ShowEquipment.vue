<!--  -->
<template>
  <div class="equipment" v-if="equipment">
    <van-nav-bar :title="'装备详情'" />
    <div class="header">
      <van-image width="1rem" height="1rem" :src="equipment.user.avatar" />
      <div class="right">
        <span class="nickname">{{equipment.user.nickname}}</span>
        <span class="rate">信用评分：{{equipment.user.credit}}</span>
        <div class="time">发布于{{ago(equipment.create_stamp)}}&nbsp;&nbsp;{{equipment.district}}</div>
      </div>
    </div>
    <div class="body">
      <div class="price">
        ¥
        <span style="font-size:0.45rem;">{{equipment.price}}</span>
      </div>
      <div class="tag" v-if="equipment.tag">{{equipment.tag}}</div>
      <div class="content">{{equipment.content}}</div>
      <div class="image">
        <van-image
          v-for="(item,index) in equipment.equipment_images"
          :key="index"
          width="100%"
          height="100%"
          :src="item.img_url"
          fit="contain"
        />
      </div>
    </div>
    <div class="pay" v-if="equipment.price">
      <van-submit-bar button-text="我想要" :price="equipment.price*100" @submit="onSubmit"></van-submit-bar>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { equipmentRequest } from "@/api";
import { ago } from "@/utils";
export default {
  components: { "van-nav-bar": VanNavBar },
  data() {
    return {
      equipment: null
    };
  },
  computed: {},
  watch: {},
  methods: {
    ago(timeStamp) {
      return ago(timeStamp);
    },
    onSubmit() {
      this.$store.commit("CHANGE_CHAT_LIST_TYPE", {
        type: "add",
        userInfo: this.equipment.user
      });
      this.$router.push({
        name: "SoloChat",
        query: { username: this.equipment.user.username }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    equipmentRequest.showEquipment(this.$route.query.equipment_id)
      .then(res => {
        this.equipment = res.data.equipment;
      })
      .catch(reason => {});
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.equipment {
  padding-top: 46px;
  padding-bottom: 46px;
  margin: 0.333rem 0.45rem;
}
.equipment/deep/.van-image__img {
  border-radius: 3px;
}
.header {
  display: flex;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #f2f2f2;
}
.right {
  margin-left: 0.2rem;
}
.nickname {
  font-weight: bold;
  font-size: 0.335rem;
}
.rate {
  color: rgb(35, 197, 144);
  margin-left: 0.1rem;
}
.time {
  color: rgb(151, 150, 150);
}
.body {
  margin-top: 0.45rem;
}
.price {
  color: rgb(248, 99, 12);
  margin-bottom: 0.45rem;
}
.tag {
  background-color: rgb(242, 249, 255);
  padding: 0.1rem;
  border-radius: 3px;
  color: rgb(100, 164, 199);
  font-size: 0.3rem;
  padding-left: 0.2rem;
}
.content {
  font-size: 0.43rem;
  margin-top: 0.4rem;
}
.image {
  margin-top: 0.3rem;
}
.van-submit-bar {
  border-top: 1px solid #ccc;
}
</style>