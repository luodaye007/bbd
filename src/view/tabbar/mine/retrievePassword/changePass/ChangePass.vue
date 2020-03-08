<!--  -->
<template>
  <div class="changePass">
    <van-nav-bar />
    <h3>修改密码</h3>
    <div class="form">
      <van-cell-group :border="false">
        <van-field
          v-model="password"
          left-icon="lock"
          placeholder="请输入密码"
          size="large"
          type="password"
        />
        <van-field
          v-model="checkPass"
          left-icon="checked"
          placeholder="再次输入密码"
          size="large"
          type="password"
        />
      </van-cell-group>
      <div class="changePassBtn">
        <van-button round color="#fc8183" size="large" @click="edit">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import { reset } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar
  },
  data() {
    return {
      password: "",
      checkPass: ""
    };
  },
  computed: {},
  watch: {},
  methods: {
    edit() {
      let msg = "";
      if (this.password == "") {
        msg = "密码不能为空";
        this.$toast(msg);
        return;
      } else if (this.password.length < 6) {
        msg = "密码不少于六位";
        this.$toast(msg);
        return;
      } else if (this.checkPass == "") {
        msg = "请再次输入密码";
        this.$toast(msg);
        return;
      } else if (this.password != this.checkPass) {
        msg = "两次密码不一致";
        this.$toast(msg);
        return;
      }

      reset({
        username: this.$route.query.username,
        password: this.password
      })
        .then(res => {
          if (res.status == 201) {
            this.$toast({
              message: res.data.msg,
              duration: 1500
            });
            this.$router.go(-2);
          }
        })
        .catch(reason => {
          console.log(reason);
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
.changePass /deep/ .van-field__control {
  margin: 0 15px !important;
}
.van-cell:not(:last-child)::after {
  border: none;
}
.changePass /deep/.van-field__control {
  font-size: 0.33rem;
}
.changePass /deep/.van-icon {
  font-size: 0.4rem !important;
  color: #ccc;
}
.changePass /deep/.van-icon-closed-eye {
  color: rgb(153, 153, 153) !important;
}
.changePass /deep/.van-icon-eye-o {
  color: rgb(153, 153, 153) !important;
}
.van-cell {
  border-bottom: 1px solid #ccc;
}
.changePassBtn {
  margin-top: 0.5rem;
}
</style>