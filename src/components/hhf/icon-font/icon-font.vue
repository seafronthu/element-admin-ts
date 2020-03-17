<!-- 图标 -->
<template>
  <i class="hhf-icon-font">
    <SvgIcon
      :type="icon"
      :class="clsMerge"
      :style="stlsMerge"
      :width="width"
      :height="height"
    />
    <!-- <svg
    :class="clsMerge"
    :style="stlsMerge"
      class="hhf-icon-font-svg"
      aria-hidden="true"
    >
      <use :xlink:href="iconName"></use>
    </svg> -->
  </i>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SvgIcon from "./svg/index";
@Component({
  components: {
    SvgIcon
  }
})
export default class IconFont extends Vue {
  @Prop({
    type: String || Array
  })
  classes?: string | string[];
  @Prop({
    type: String
  })
  icon?: string;
  @Prop({
    type: String
  })
  color?: string;
  @Prop({
    type: String
  })
  size?: string;
  @Prop({
    type: Boolean
  })
  spin?: boolean;
  @Prop({
    type: String
  })
  width?: string;
  @Prop({
    type: String
  })
  height?: string;
  get clsMerge() {
    const { classes } = this;
    const iCls = "hhf-icon-font-svg";
    let cls;
    if (typeof classes === "string") {
      cls = `${classes} ${iCls}`;
    } else if (Array.isArray(classes)) {
      cls = [iCls, ...classes];
    }
    return cls;
  }
  get stlsMerge() {
    const { color, size } = this;
    return {
      color,
      fontSize: size
    };
  }
}
</script>
<style lang="stylus" scope>
.hhf-icon-font
  display: inline-block
  font-style italic
  line-height 0
</style>
