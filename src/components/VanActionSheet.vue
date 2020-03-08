<!--  -->
<template>
  <div class>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      @cancel="onCancel"
      @close="onClose"
      @click-overlay="clickOverlay"
      cancel-text="确定"
      round
    />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: ["showActionSheet", "actions", "maxSelect"],
  computed: {
    show: {
      get() {
        return this.showActionSheet;
      },
      set() {
        return this.showActionSheet;
      }
    }
  },
  watch: {},
  methods: {
    onSelect(item, index) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      if (item.color != "#07c160") {
        let count = 0;
        this.actions.forEach(item => {
          if (item.color) {
            count++;
          }
        });
        if (count >= this.maxSelect) {
          this.$toast(`最多选择${this.maxSelect}项`);
          return;
        } else {
          item.color = "#07c160";
        }
      } else {
        delete item.color;
      }
      this.$set(this.actions, index, item);
    },
    onCancel() {
      this.$emit("close", false);
    },
    onClose() {
      this.$emit("close", false);
    },
    clickOverlay() {
      this.$emit("close", false);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
</style>