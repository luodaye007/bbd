<!--  -->
<template>
  <div class="login">
    <van-nav-bar />
    <img class="logo" src="@/assets/images/logo.png" alt />
    <div class="form">
      <van-cell-group :border="false">
        <van-field
          v-model="username"
          clearable
          placeholder="请输入用户名"
          left-icon="manager"
          size="large"
        />
        <van-field
          v-model="password"
          :type="fieldType"
          left-icon="lock"
          placeholder="请输入密码"
          size="large"
          :right-icon="rightIcon"
          @click-right-icon="fieldType = fieldType == 'password' ? 'text' : 'password'"
        />
      </van-cell-group>
      <div class="loginBtn">
        <van-button
          round
          color="#fc8183"
          size="large"
          @click="login"
          :loading="loading"
          loading-type="spinner"
          type="primary"
          loading-text="登录中..."
        >登陆</van-button>
        <base-router
          :titleLeft="'立即注册'"
          :leftTo="'/mine/register'"
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
export default {
  components: {},
  data() {
    return {
      username: "",
      password: "",
      fieldType: "password",
      loading: false
    };
  },
  components: {
    "van-nav-bar": VanNavBar,
    "base-router": BaseRouter
  },
  computed: {
    rightIcon() {
      return this.fieldType == "password" ? "closed-eye" : "eye-o";
    }
  },
  watch: {},
  methods: {
    login() {
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
      }

      this.loading = true;

      this.$store
        .dispatch("doLogin", {
          username: this.username,
          password: this.password,
          phone: this.phone
        })
        .then(res => {
          this.loading = false;
          if (res.data.code) {
            this.$toast.success(res.data.msg);
            this.$store
              .dispatch("getUserInfo", this.username)
              .then(res => {
                let redirectUrl = decodeURIComponent(
                  this.$route.query.redirect || "/mine"
                );
                // 跳转到指定的路由
                this.$router.push({
                  path: redirectUrl
                });
              })
              .catch(res => {});
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch(res => {
          this.loading = false;
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.$route.query.logOutMsg && this.$socket) {
      this.$socket.disconnect();
    }
  }
};
</script>
<style scoped lang="less">
.login {
  display: flex;
  flex-direction: column;
  margin-top: 46px;
}
.logo {
  width: 4.5rem;
  height: 4.5rem;
  margin: 0.2rem auto 0.1rem;
}
.form {
  //margin-top: 3rem;
  // margin: 20px 30px;
  margin: 10px 30px;
}
.van-cell {
  padding: 20px 0px;
}
.login /deep/ .van-field__control {
  margin: 0 15px !important;
}
.van-cell:not(:last-child)::after {
  border: none;
}
.login /deep/.van-field__control {
  font-size: 0.37rem;
}
.login /deep/.van-icon {
  font-size: 0.4rem !important;
  color: #ccc;
}
.login /deep/.van-icon-closed-eye {
  color: rgb(153, 153, 153) !important;
}
.login /deep/.van-icon-eye-o {
  color: rgb(153, 153, 153) !important;
}
.loginBtn {
  margin-top: 0.3rem;
}
.van-cell {
  border-bottom: 1px solid #ccc;
}
</style>