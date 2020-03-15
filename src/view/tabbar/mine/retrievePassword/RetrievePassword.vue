<!--  -->
<template>
  <div class="retrievePassword">
    <van-nav-bar />
    <h3>忘记密码</h3>
    <div class="form">
      <van-cell-group :border="false">
        <van-field
          v-model.trim="username"
          clearable
          placeholder="用户名"
          left-icon="manager"
          size="large"
          maxlength="16"
        />
        <van-field
          v-model.trim="phone"
          left-icon="phone"
          placeholder="请输入手机号码"
          size="large"
          maxlength="11"
        />
      </van-cell-group>
      <div class="retrievePasswordBtn">
        <van-button round color="#fc8183" size="large" @click="next">下一步</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { isPoneAvailable } from "@/utils/index";
import { baseRequest } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      username: "",
      phone: ""
    };
  },
  computed: {},
  watch: {},
  methods: {
    next() {
      let msg = "";
      if (this.username == "") {
        msg = "用户名不能为空";
        this.$toast(msg);
        return;
      } else if (this.username.length < 6) {
        msg = "用户名不合法";
        this.$toast(msg);
        return;
      } else if (this.phone.length < 11) {
        msg = "手机号码必须是11位";
        this.$toast(msg);
        return;
      } else if (!isPoneAvailable(this.phone)) {
        msg = "手机号码不合法";
        this.$toast(msg);
        return;
      }

      baseRequest
        .checkReset({ username: this.username, phone: this.phone })
        .then(res => {
          if (res.data.msg == "ok") {
            this.$router.push({
              name: "ChangePass",
              query: { username: this.username }
            });
          } else {
            this.$toast(res.data.msg);
          }
        });
      // this.$router.push({ name: "ChangePass" });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
h3 {
  text-align: center;
}
.form {
  margin: 10px 30px;
}
.van-cell {
  padding: 20px 0px;
}
.retrievePassword /deep/ .van-field__control {
  margin: 0 15px !important;
}
.van-cell:not(:last-child)::after {
  border: none;
}
.retrievePassword /deep/.van-field__control {
  font-size: 0.33rem;
}
.retrievePassword /deep/.van-icon {
  font-size: 0.4rem !important;
  color: #ccc;
}
.retrievePassword /deep/.van-icon-closed-eye {
  color: rgb(153, 153, 153) !important;
}
.retrievePassword /deep/.van-icon-eye-o {
  color: rgb(153, 153, 153) !important;
}
.van-cell {
  border-bottom: 1px solid #ccc;
}
.retrievePasswordBtn {
  margin-top: 0.5rem;
}
</style>