<!--  -->
<template>
  <div class="map">
    <van-nav-bar
      title="位置"
      left-text="取消"
      right-text="确定"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <iframe
      v-if="showmap"
      id="mapPage"
      width="100%"
      height="100%"
      frameborder="0"
      src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=RCDBZ-ALJKJ-HNIFV-KB4ZJ-CJOW6-2XFEX&referer=约个球球-点位服务"
    ></iframe>
  </div>
</template>

<script>
import { locationRequest } from "@/api";
export default {
  props: ["showmap"],
  components: {},
  data() {
    return {
      locationSelect: {}
    };
  },
  computed: {},
  watch: {},
  methods: {
    onClickLeft() {
      this.$emit("update:showmap", false);
    },
    async onClickRight() {
      //Toast("按钮");
      if (Object.keys(this.locationSelect).length == 0) {
        this.$toast("请选择地址");
        return;
      }

      if (this.locationSelect.poiname === "我的位置") {
        //选择了我的位置需要特殊处理
        locationRequest
          .changeLocation(
            this.locationSelect.latlng.lat,
            this.locationSelect.latlng.lng
          )
          .then(res => {
            console.log(res);
          });

        let result = (
          await locationRequest.changeLocation(
            this.locationSelect.latlng.lat,
            this.locationSelect.latlng.lng
          )
        ).data.result.data.result;
        this.locationSelect.poiaddress = result.address;

        this.locationSelect.poiname = result.formatted_addresses.recommend;
      }

      this.$emit("location", this.locationSelect);
      this.$emit("update:showmap", false);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    var that = this;
    window.addEventListener(
      "message",
      function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == "locationPicker") {
          //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          console.log(loc);
          that.locationSelect = loc;
          //console.log(loc);
        }
      },
      false
    );
  }
};
</script>
<style scoped>
.map {
  width: 100%;
  height: calc(100% - 51px);
  margin: 0;
  padding: 0;
}
.van-nav-bar__left span {
  color: black;
}
.van-nav-bar__right span {
  background-color: #fc8183;
  color: white;
  border-radius: 5px;
  margin: 0;
  line-height: 1;
  padding: 8px;
}
</style>