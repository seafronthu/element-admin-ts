<!--  -->
<template>
  <div class="tag-button" :style="{ height: height }">
    <el-dropdown :trigger="trigger" @command="handleCommand">
      <div ref="clickEle">
        <div @click.stop="handleClick" ref="contextmenuEle">
          <el-tag
            :type="type"
            :color="color"
            :effect="effect"
            :closable="closable"
            class="tag-button-flex"
          >
            <IconFont
              v-if="dot"
              icon="dot"
              :style="{ color: color, paddingRight: '10px' }"
            />
            <slot></slot>
          </el-tag>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <slot name="menu"></slot>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IconFont from "@h/icon-font";
@Component({
  components: {
    IconFont
  }
})
export default class TagButton extends Vue {
  @Prop({ type: String, default: "hover" })
  trigger?: "hover" | "click";
  @Prop({ type: String, default: "" })
  type?: "" | "success" | "info" | "warning" | "danger";
  @Prop({ type: String }) color?: string;
  @Prop({
    type: String,
    default: "light"
  })
  effect?: "dark" | "light" | "plain";
  @Prop({
    type: Boolean,
    default: false
  })
  dot?: boolean;
  @Prop({
    type: String
  })
  height?: string;
  @Prop({
    type: Boolean
  })
  closable?: boolean;
  get dotStyles() {
    return this.dot
      ? {
          paddingRight: "10px",
          color: this.effect === "dark" ? "#ffffff" : this.color
        }
      : null;
  }
  get dotCls() {
    if (this.dot) {
      return this.type ? `tag-button-${this.type}` : "tag-button-brand";
    }
    return null;
  }
  handleClick() {
    this.$emit("trigger-click");
  }
  handleContextmenu(e: Event) {}
  handleCommand(command: string) {
    this.$emit("trigger-command", command);
  }
  mounted() {
    let contextmenuEle = this.$refs["contextmenuEle"] as HTMLSpanElement;
    let clickEle = this.$refs["clickEle"] as HTMLSpanElement;
    contextmenuEle.oncontextmenu = function(e: Event) {
      e.preventDefault();
      clickEle.click();
    };
  }
  created() {}
}
</script>
<style lang="stylus">
.tag-button
  .tag-button-flex
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    cursor pointer
    user-select none
</style>
