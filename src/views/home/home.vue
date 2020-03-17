<!--  -->
<template>
  <div class="home">
    <img alt="Vue logo" :src="require('@a/img/logo.png')" />
    <el-link type="primary">主要链接</el-link>
    <p><input v-model="val" /></p>
    <AnimateNumber
      :start-num="1000"
      :end-num="100"
      :duration="10000"
      :autoplay="true"
      format="0.00"
      animate-type="ease-in"
    />
    <button @click="handleClick">点击</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AnimateNumber from "@h/animate-number";
import { RouteGlobal } from "@/types/route";
@Component({
  components: {
    AnimateNumber
  }
})
export default class Home extends Vue {
  num: number = 0;
  val: string = "0";
  handleClick() {
    console.log(this.$router);
    this.$routerPush({ name: "Default" });
  }
  created() {
    console.log(this.$route);
    console.log("home, created");
    // this.addNum();
  }
}
</script>
<style lang="stylus" scoped></style>
