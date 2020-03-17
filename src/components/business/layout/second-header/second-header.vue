<!-- 二级头 -->
<template>
  <div class="second-header flex-row-start-center flex-nowrap">
    <span class="trigger" @click="handleCollapse">
      <i :class="collapseCls"></i>
    </span>
    <BreadCrumb />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Inject } from "vue-property-decorator";
import BreadCrumb from "../bread-crumb";
@Component({
  components: {
    BreadCrumb
  }
})
export default class SecondHeader extends Vue {
  @Model("trigger-collapse") collapse: boolean = false;
  get collapseCls() {
    return this.collapse ? "el-icon-s-unfold" : "el-icon-s-fold";
  }
  public handleCollapse() {
    this.$emit("trigger-collapse", !this.collapse);
  }
}
</script>
<style lang="stylus" scoped>
.second-header
  background-color #ffffff
  .trigger
    font-size 30px
    line-height 48px
    padding 0 20px
    cursor pointer
</style>
