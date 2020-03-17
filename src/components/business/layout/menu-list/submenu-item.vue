<!-- 多级菜单 -->
<template>
  <div>
    <template v-for="items of menuList">
      <el-submenu
        v-if="items.children"
        :index="items.name"
        :key="items.name"
        class="abctest"
      >
        <template #title>
          <span>{{ items.title }}</span>
        </template>
        <submenu-item :menuList="items.children" />
      </el-submenu>
      <el-menu-item v-else :index="items.name" :key="items.name">{{
        items.title
      }}</el-menu-item>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { RouteGlobal } from "@/types/route";
@Component
export default class SubmenuItem extends Vue {
  @Prop({ required: true, type: Array })
  menuList!: RouteGlobal.ArrageMenuObjINF[];
}
</script>
<style lang="stylus"></style>
