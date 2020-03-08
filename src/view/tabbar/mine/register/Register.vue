<!--  -->
<template>
  <div class="register">
    <van-nav-bar />
    <h3>注册</h3>
    <div class="form">
      <van-cell-group :border="false">
        <van-field
          v-model="username"
          clearable
          placeholder="请输入用户名"
          left-icon="manager"
          size="large"
          maxlength="16"
        />
        <van-field
          v-model="password"
          left-icon="lock"
          placeholder="请输入密码"
          size="large"
          :right-icon="rightIcon"
          :type="fieldType"
          @click-right-icon="fieldType = fieldType == 'password' ? 'text' : 'password'"
          maxlength="18"
        />
        <van-field
          v-model="phone"
          left-icon="phone"
          placeholder="请输入手机号码"
          size="large"
          maxlength="11"
          clearable
        />
      </van-cell-group>
      <div class="registerBtn">
        <van-button
          round
          :loading="loading"
          loading-type="spinner"
          type="primary"
          color="#fc8183"
          size="large"
          loading-text="注册中..."
          @click="register"
        >注册</van-button>
        <base-router
          :titleLeft="'去登录'"
          :leftTo="'/mine/login'"
          :titleRight="'忘记密码?'"
          :rigthTo="'/mine/retrievePassword'"
        ></base-router>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import BaseRouter from "@/components/BaseRouter";
import { isPoneAvailable } from "@/utils/index";
export default {
  components: {
    "van-nav-bar": VanNavBar,
    "base-router": BaseRouter
  },
  data() {
    return {
      username: "",
      phone: "",
      password: "",
      fieldType: "password",
      loading: false
    };
  },
  computed: {
    rightIcon() {
      return this.fieldType == "password" ? "closed-eye" : "eye-o";
    }
  },
  watch: {},
  methods: {
    register() {
      let msg = "";
      if (this.username == "") {
        msg = "用户名不能为空";
        this.$toast(msg);
        return;
      } else if (this.username.length < 6) {
        msg = "用户名不少于六位";
        this.$toast(msg);
        return;
      } else if (this.password == "") {
        msg = "请输入密码";
        this.$toast(msg);
        return;
      } else if (this.password.length < 6) {
        msg = "密码不少于六位";
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

      this.loading = true;

      this.$store
        .dispatch("register", {
          username: this.username,
          password: this.password,
          phone: this.phone
        })
        .then(res => {
          if (!res.data.code) {
            this.$toast(res.data.msg);
            this.loading = false;
          } else {
            this.$store
              .dispatch("getUserInfo", this.username)
              .then(res => {
                this.loading = false;
                let redirectUrl = decodeURIComponent(
                  this.$route.query.redirect || "/mine"
                );
                // 跳转到指定的路由
                this.$router.push({
                  path: redirectUrl
                });
              })
              .catch(res => {
                this.loading = false;
              });
          }
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
h3 {
  text-align: center;
}
.form {
  margin: 10px 30px;
}
.van-cell {
  padding: 20px 0px;
}
.register{
  margin-top: 46px;
}
.register /deep/ .van-field__control {
  margin: 0 15px !important;
}
.van-cell:not(:last-child)::after {
  border: none;
}
.register /deep/.van-field__control {
  font-size: 0.38rem;
}
.register /deep/.van-icon {
  font-size: 0.4rem !important;
  color: #ccc;
}
.register /deep/.van-icon-closed-eye {
  color: rgb(153, 153, 153) !important;
}
.register /deep/.van-icon-eye-o {
  color: rgb(153, 153, 153) !important;
}
.van-cell {
  border-bottom: 1px solid #ccc;
}
.registerBtn {
  margin-top: 0.5rem;
}
</style>