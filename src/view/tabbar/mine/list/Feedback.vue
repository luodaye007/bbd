<!--  -->
<template>
  <div class="feedback">
    <van-nav-bar :title="'问题反馈'" />
    <van-cell-group>
      <van-field
        v-model="message"
        rows="8"
        autosize
        type="textarea"
        maxlength="400"
        placeholder="请输入遇到的问题或建议..."
        show-word-limit
      />
    </van-cell-group>
    <van-button
      color="#fc8183"
      size="large"
      loading-type="spinner"
      type="primary"
      style="margin-top:4rem;width:90%;border-radius:10px;"
      @click="send"
    >保存修改</van-button>
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
      message: ""
    };
  },
  computed: {},
  watch: {},
  methods: {
    send() {
      this.$toast("发表成功");
      setTimeout(() => {
        this.$router.back(-1);
      }, 1500);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
.feedback {
  padding-top: 46px;
  text-align: center;
}
</style>