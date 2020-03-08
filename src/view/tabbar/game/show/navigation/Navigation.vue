<!--  -->
<template>
  <div class="navigation">
    <van-nav-bar :title="'导航'" />
    <iframe width="100%" :height="height-50" frameborder="0" scrolling="auto" :src="src"></iframe>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      src: "",
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    };
  },
  computed: {},
  watch: {},
  methods: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.src = `https://apis.map.qq.com/tools/routeplan/eword=${this.$route.query.eword}&epointx=${this.$route.query.lat}&epointy=${this.$route.query.lng}?referer=myapp&key=RCDBZ-ALJKJ-HNIFV-KB4ZJ-CJOW6-2XFEX`;
  }
};
</script>
<style scoped>
</style>