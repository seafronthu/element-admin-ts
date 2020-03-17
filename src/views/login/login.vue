<!--  -->
<template>
  <div class="login">
    <div class="container">
      <h5 class="title">
        <i>L</i>
        <i>O</i>
        <i>G</i>
        <i>I</i>
        <i>N</i>
      </h5>
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
        <el-form-item prop="account">
          <el-input
            v-model="ruleForm.account"
            prefix-icon="el-icon-user"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            :type="pswType"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          >
            <template #suffix>
              <i
                :class="['hhf-iconfont', eyeCls]"
                @click="handleEyeClick"
                style="color: #333333;"
              ></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            @click="handleSubmit"
            class="login-btn"
            :loading="loading"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import getRouteAndAddRoute from "@l/routeMixin";
interface RuleFormINF {
  account: string;
  pass: string;
}
function validateAccount(rule: any, value: string, callback: Function) {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    callback();
  }
}
function validatePass(rule: any, value: string, callback: Function) {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
}
@Component
export default class Login extends Vue {
  $refs!: {
    ruleForm: any;
  };
  ruleForm: RuleFormINF = {
    account: "",
    pass: ""
  };
  rules = {
    account: [{ validator: validateAccount, trigger: "blur" }],
    pass: [{ validator: validatePass, trigger: "blur" }]
  };
  encryptStatus: boolean = false; // true为加密 false 不加密
  loading: boolean = false; // 加载
  get eyeCls() {
    // 密码框眼睛样式
    return this.encryptStatus ? "hhf-icon-close-eye" : "hhf-icon-open-eye";
  }
  get pswType() {
    // 密码框类型
    return this.encryptStatus ? "password" : "text";
  }
  handleEyeClick() {
    this.encryptStatus = !this.encryptStatus;
  }
  handleSubmit() {
    this.loading = true;
    this.$refs["ruleForm"]
      .validate()
      .then((boo: boolean) => {
        getRouteAndAddRoute().then(res => {
          this.loading = false;
          this.$routerPush({ name: "Home" });
        });
      })
      .catch((boo: boolean) => {
        this.loading = false;
      });
    // this.$routerPush({ name: "Home" });
  }
}
</script>
<style lang="stylus" scoped>
.login
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  overflow hidden
  background-image: linear-gradient(0deg, #29bdd9 0%, #276ace 100%)
  .container
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    background-color #ffffff
    width 300px
    border-radius 5px
    padding 0 20px
    box-shadow 0px 0px 10px 1px rgba(0, 0, 0, 0.3)
    .title
      text-align center
      font-size 40px
      height 40px
      line-height 40px
      font-weight bold
      margin 20px 0
      i
        display inline-block
        line-height 40px
      i:first-child
        color #08a678
      i:nth-child(2)
        color #f50
      i:nth-child(3)
        color #108ee9
      i:nth-child(4)
        color #fa8c16
      i:nth-child(5)
        color #722ed1
    .login-btn
      width 100%
</style>
