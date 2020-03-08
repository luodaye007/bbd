<!--  -->
<template>
  <div class="userInfo">
    <van-nav-bar :title="'个人信息'" />
    <div class="userInfo-content">
      <div class="head_img" @click="uploadHeadImg">
        <img :src="userInfo.avatar" />
        <!-- <van-icon name="photograph" /> -->
      </div>

      <img-cut @callback="callback" :width="130" :height="130"></img-cut>

      <van-cell-group :border="false">
        <van-field v-model="userInfo.nickname" label="昵称" placeholder="请输入昵称" size="large" />
        <van-cell
          class="showAction"
          title="位置"
          :value="userInfo.orientation"
          size="large"
          is-link
          @click="selectOrientation"
        />
        <van-field
          v-model="userInfo.stature"
          label="身高(cm)"
          placeholder="请输入身高"
          size="large"
          type="number"
        />
        <van-field
          v-model="userInfo.weight"
          label="体重(kg)"
          placeholder="请输入体重"
          size="large"
          type="number"
        />
        <van-cell
          class="showAction"
          title="标签"
          :value="userInfo.tag"
          size="large"
          is-link
          @click="selectTag"
        />
        <van-field
          v-model="userInfo.motto"
          label="座右铭"
          type="textarea"
          placeholder="请输入座右铭"
          rows="1"
          autosize
        />

        <van-button
          color="#fc8183"
          size="large"
          :loading="saveing"
          @click="save"
          loading-type="spinner"
          type="primary"
          loading-text="保持中..."
          style="margin-top:1rem;"
        >保存修改</van-button>
      </van-cell-group>

      <!-- 弹出选择位置 -->
      <van-action-sheet
        :showActionSheet="showActionOrientation"
        :actions="orientationActions"
        :maxSelect="3"
        @close="closeActionOrientation"
      ></van-action-sheet>

      <!-- 弹出选择标签 -->
      <van-action-sheet
        :showActionSheet="showActionTag"
        :actions="tag"
        :maxSelect="3"
        @close="closeActionTag"
      ></van-action-sheet>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import VanActionSheet from "@/components/VanActionSheet";
import { imgCut } from "vue-imgcut";
import { uploadAvatar } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar,
    "img-cut": imgCut,
    "van-action-sheet": VanActionSheet
  },
  data() {
    return {
      userInfo: Object.assign({}, this.$store.state.user.userInfo),
      showActionOrientation: false,
      showActionTag: false,
      saveing: false,
      orientationActions: [
        //selectColor:#07c160
        { name: "控球后卫" },
        { name: "得分后卫" },
        { name: "小前锋" },
        { name: "大前锋" },
        { name: "中锋" }
      ],
      tag: [
        { name: "组织" },
        { name: "防守" },
        { name: "投射" },
        { name: "篮板" },
        { name: "突破" },
        { name: "盖帽" }
      ]
    };
  },
  computed: {
    // userInfo: function() {
    //   return JSON.parse(JSON.stringify(this.$store.state.user.userInfo));
    // }
  },
  watch: {
    orientationActions: {
      //深度监听，可监听到对象、数组的变化
      handler: function(val) {
        //如果颜色高亮的就是被选中的项目
        //重置
        this.userInfo.orientation = "";
        val.forEach(element => {
          if (element.color) {
            if (this.userInfo.orientation == "") {
              this.userInfo.orientation += element.name;
            } else {
              this.userInfo.orientation += " " + element.name;
            }
          }
        });
      },
      deep: true
    },
    tag: {
      //深度监听，可监听到对象、数组的变化
      handler: function(val) {
        //如果颜色高亮的就是被选中的项目
        //重置
        this.userInfo.tag = "";
        val.forEach(element => {
          if (element.color) {
            this.userInfo.tag += element.name + " ";
          }
        });
      },
      deep: true
    }
  },
  methods: {
    // 打开图片上传
    uploadHeadImg: function() {
      this.$el.querySelector(".file").click();
    },
    callback(img) {
      this.$toast.loading({
        mask: false,
        message: "上传中..."
      });
      var formData = new FormData();
      formData.append("avatar", this.base64toFile(img));
      uploadAvatar(formData)
        .then(res => {
          this.userInfo.avatar = res.data.avatar;
          this.$toast.clear();
        })
        .catch(reason => {
          this.$toast.clear();
          this.$toast.fail("出现错误");
        });
    },
    selectOrientation() {
      this.showActionOrientation = true;
    },
    selectTag() {
      this.showActionTag = true;
    },
    closeActionOrientation(bol) {
      this.showActionOrientation = bol;
    },
    closeActionTag(bol) {
      this.showActionTag = bol;
    },
    save() {
      let obj = {};
      obj.username = this.userInfo.username;
      obj.nickname = this.userInfo.nickname;
      obj.avatar = this.userInfo.avatar;
      obj.orientation = this.userInfo.orientation;
      if (this.userInfo.stature) obj.stature = this.userInfo.stature;
      if (this.userInfo.weight) obj.weight = this.userInfo.weight;
      obj.tag = this.userInfo.tag;
      obj.motto = this.userInfo.motto;

      this.$toast.loading({
        mask: false,
        message: "保存中..."
      });

      this.$store.dispatch("updateUserInfo", obj).then(res => {
        this.$toast.clear();
        this.$toast.success({
          forbidClick: true,
          message: res.data.msg,
          duration: 1500
        });
        setTimeout(() => {
          this.$router.back(-1);
        }, 1800);
      });
    },
    base64toFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.orientationActions.forEach(item => {
      if (this.userInfo.orientation) {
        if (this.userInfo.orientation.includes(item.name)) {
          item.color = "#07c160";
        }
      }
    });
    this.tag.forEach(item => {
      if (this.userInfo.tag) {
        if (this.userInfo.tag.includes(item.name)) {
          item.color = "#07c160";
        }
      }
    });
  }
};
</script>
<style scoped lang="less">
.userInfo {
  padding-top: 46px;
}
.userInfo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.head_img img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin: 0.5rem 0;
}
.userInfo /deep/ #uppic {
  width: 0px !important;
  height: 0px !important;
  min-height: 0px !important;
}
.userInfo /deep/ .van-field__control {
  text-align: right;
  width: 100%;
  // font-size: 0.3rem;
}
.van-cell-group {
  width: 80%;
}
.userInfo /deep/ .van-cell__title span {
  color: gray;
  font-size: 13px;
}
.van-cell__value {
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.van-cell__value span {
  font-size: 16px;
  color: #323233;
}
.van-cell__right-icon {
  margin-right: -10px;
  font-size: 10px;
}
.showAction > .van-cell__value span {
  font-size: 14px;
  color: #323233;
}
.van-cell:last-child::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 16px;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>