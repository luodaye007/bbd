<template>
  <div class="add-equipment">
    <van-nav-bar :title="'发布装备'" />

    <!-- 文本描述 -->
    <van-cell-group>
      <van-field
        v-model="message"
        type="textarea"
        placeholder="描述一下宝贝的细节或故事"
        rows="5"
        autosize
        maxlength="200"
      />
    </van-cell-group>

    <!-- 图片描述 -->
    <van-uploader v-model="fileList" multiple :max-count="6" :after-read="afterRead" />

    <!-- 价格 -->
    <van-cell-group>
      <van-field
        v-model="price"
        placeholder="最多保留两位小数"
        label="价格"
        left-icon="balance-o"
        onkeyup="this.value=/^[0-9]*\.?[0-9]{0,2}$/.test(this.value) ? this.value : this.value.substring(0,this.value.length-1)"
      />
    </van-cell-group>

    <!-- 优惠选择 复选框 -->
    <van-checkbox-group v-model="result">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in tags"
          clickable
          :key="item"
          :title="`${item}`"
          @click="toggle(index)"
        >
          <van-checkbox :name="item" ref="checkboxes" slot="right-icon" />
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>

    <van-button color="#FC8183" size="large" class="addBtn" @click="publish">确定</van-button>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { addEquipment } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      message: "", //文字描述
      price: "", //价格
      fileList: [
        // { url: "https://img.yzcdn.cn/vant/cat.jpeg" }
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        // { url: "https://cloud-image", isImage: true }
      ], //上传后的图片链接
      tags: ["可详谈", "可小刀", "包邮"],
      result: ["可详谈"] //复选框选中的内容
    };
  },
  computed: {},
  watch: {},
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    publish() {
      if (this.message == "") {
        this.$toast("内容不能为空");
        return;
      } else if (this.fileList.length == 0) {
        this.$toast("有图片更好出售哦");
        return;
      } else if (this.price == "") {
        this.$toast("价格不能为空");
        return;
      } else if (
        !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
          this.price
        )
      ) {
        this.$toast("价格不合法");
        return;
      } else if (this.result.length == 0) {
        this.$toast("标签不能为空");
        return;
      }

      var formData = new FormData();
      this.fileList.forEach((item, index) => {
        formData.append("img", item.file);
      });

      formData.append("content", this.message);
      formData.append("price", this.price);
      formData.append("tag", this.result.join(" "));
      formData.append("username", this.$store.state.user.userInfo.username);
      formData.append("district", this.$store.state.user.location.district);

      this.$toast.loading({
        message: "发布中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0
      });

      addEquipment(formData)
        .then(res => {
          console.log(res);
          if (res.status == 201) {
            this.$toast.clear();
            this.$toast.success("发布成功");
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
          }
        })
        .catch(reason => {
          console.log(res);
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.van-field {
  font-size: 0.4rem;
}
.van-uploader {
  padding: 0.2rem;
}
.add-equipment {
  margin-top: 46px;
}
.add-equipment/deep/.van-uploader__preview-image  {
  width: 3rem;
  height: 3rem;
}
.add-equipment/deep/.van-uploader__preview {
  margin: 0 0.1rem 0.1rem 0.1rem;
}
.add-equipment/deep/.van-uploader__upload {
  width: 3rem;
  height: 3rem;
  margin: 0 0.1rem 0.1rem 0.1rem;
}

.add-equipment/deep/.van-field__left-icon .van-icon,
.van-field__right-icon .van-icon {
  font-size: 0.55rem;
}

.addBtn {
  display: block;
  width: 94%;
  margin: 0.333333rem auto;
}
</style>