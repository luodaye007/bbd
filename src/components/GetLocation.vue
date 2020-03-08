<!--  -->
<template>
  <div class>
    <iframe
      id="geoPage"
      width="0"
      height="0"
      frameborder="0"
      style="display:none;"
      scrolling="no"
      src="https://apis.map.qq.com/tools/geolocation?key=RCDBZ-ALJKJ-HNIFV-KB4ZJ-CJOW6-2XFEX&referer=myapp"
    ></iframe>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    window.addEventListener(
      "message",
      function(event) {
        // 接收位置信息
        var loc = event.data;
        if (loc && loc.lat) {
          window.sessionStorage.setItem(
            "location",
            JSON.stringify({
              lat: loc.lat,
              lng: loc.lng
            })
          );
        }
      },
      false
    );
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
</style>