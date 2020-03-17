<!-- 布局容器菜单 -->
<template>
  <div class="menu-list user-select-none">
    <el-menu
      :default-active="defaultActive"
      :default-openeds="defaultOpeneds"
      class="menu-list-container"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
      :collapse="collapse"
      unique-opened
    >
      <template v-for="items of menuList">
        <el-submenu v-if="items.children" :key="items.name" :index="items.name">
          <template #title>
            <i :class="items.icon"></i>
            <span>{{ items.title }}</span>
          </template>
          <submenu-item :menu-list="items.children" />
        </el-submenu>
        <el-menu-item v-else :key="items.name" :index="items.name">
          <template>
            <i :class="items.icon"></i>
            <span>{{ items.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from "vue-property-decorator";
import SubmenuItem from "./submenu-item.vue";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import { RouteGlobal } from "@/types/route";
import { arrageMenu } from "@l/manage";
const App = namespace("app");
interface ToRoutes {
  name: string;
  meta: RouteGlobal.BackMetaINF;
}
@Component({
  components: {
    SubmenuItem
  }
})
// 最好写类名 否则递归报错
export default class MenuList extends Vue {
  @App.State(state => state.menuList)
  public menuList!: RouteGlobal.ArrageMenuObjINF[];
  @App.State(state => state.frontRoutesList)
  public frontRoutesList!: {
    [key: string]: RouteGlobal.FrontStageRoutesObjINF;
  };
  @App.State(state => state.authorizationList)
  public authorizationList!: RouteGlobal.BackStageRoutesObjINF[];
  public newMenuList: RouteGlobal.ArrageMenuObjINF[] = [];
  public defaultActive: string | undefined = "";
  public defaultOpeneds: string[] = [];
  @Model("trigger-collapse") collapse: boolean = false;
  @Watch("collapse")
  setMenuOpen(currVal: boolean, beforeVal: boolean) {
    if (!currVal) {
      this.defaultOpeneds = this.openMenu(this.defaultOpeneds);
    }
  }
  // 修复el-menu组件开启unique-opened之后menu不能记录原始展开菜单栏和闪动问题
  private openMenu(menuArr: string[]): string[] {
    let nodes = [];
    let index = 0;
    let stack = this.newMenuList.filter(v => v.name === menuArr[index]);
    // 得到当前打开的menu
    while (stack.length && index < menuArr.length) {
      let items = stack.pop() as RouteGlobal.ArrageMenuObjINF;
      let menuName = menuArr[index];
      if (items.name === menuName) {
        ++index;
        let children = items.children;
        items.open = true;
        nodes.push(items);
        if (children && children.length > 0) {
          for (let i = 0; i < children.length; ++i) {
            stack.push(children[i]);
          }
        }
      }
    }
    let nodesOpen = nodes.map(v => v.name);
    let nodesPop = nodes.pop();
    let stackOpen = [...((nodesPop && nodesPop.children) || [])]; // 防止浅拷贝影响原始数据的children（会使原数据children越来越少）
    // 取得当前打开的menu下的所有打开的子menu（属性unique-opened 所以只有一个是打开的）
    while (stackOpen.length) {
      let items = stackOpen.pop();
      if (items && items.type === "MENU" && items.open) {
        nodesOpen.push(items.name);
        let children = items.children || [];
        for (let i = 0; i < children.length; ++i) {
          stackOpen.push(children[i]);
        }
      }
    }
    return nodesOpen;
  }
  // 修改this.newMenuList 对应的菜单open为false
  private closeMenu(menuArr: string[]) {
    let nodes = [];
    let len = menuArr.length;
    let index = 0;
    let stack = this.newMenuList.filter(v => v.name === menuArr[index]);
    while (index < len) {
      let items = stack.pop() as RouteGlobal.ArrageMenuObjINF;
      if (items.name === menuArr[index]) {
        ++index;
        if (index === len) {
          items.open = false;
        }
        let children = items.children || [];
        for (let i = 0; i < children.length; ++i) {
          stack.push(children[i]);
        }
      }
    }
  }
  private changeMenu(to: ToRoutes) {
    if (!to.meta.hideMenu) {
      this.defaultActive = to.name;
      const matched = to.meta.matched || [];
      const currOpenMenu = matched
        .filter(v => v.meta.type === "MENU" && !v.meta.hideMenu)
        .map(v => v.name);
      this.openMenu(currOpenMenu);
    }
  }
  public handleOpen(key: string, keyPath: string[]) {
    this.defaultOpeneds = this.openMenu(keyPath);
    // console.log(keyPath);
  }
  public handleClose(key: string, keyPath: string[]) {
    console.log(keyPath);
    this.closeMenu(keyPath);
  }
  public handleSelect(key: string, keyPath: string[]) {
    this.defaultActive = key;
    this.$routerPush({ name: key });
  }
  created() {
    const { meta, name } = this.$route;
    this.newMenuList = arrageMenu({
      backstageRoutes: this.authorizationList,
      frontstageRoutes: this.frontRoutesList,
      parentId: 0
    });
    this.changeMenu({
      meta,
      name: name as string
    });
  }
}
</script>
<style lang="stylus">
.menu-list
  height 100%
  background-color $menu-bgcolor
  .menu-list-container
    background-color $menu-bgcolor
    border-right none
    .el-submenu__title,.el-menu-item
      color $menu-text-color
      &:hover
        color $menu-active-text-color
        background transparent
    .el-menu-item
      &.is-active
        color $menu-active-text-color
        background-color $brand!important
    &:not(.el-menu--collapse)
      width size(256)
      box-sizing border-box // 有多出来1px边框（防止横向滚动）
      min-height size(400)
    &>.el-submenu
      &>.el-menu
        background-color $submenu-bgcolor !important
        .el-menu, .el-submenu__title
          background-color $submenu-bgcolor !important
    &.el-menu--collapse
      &>.is-active
        &>.el-submenu__title
          &>i
            color $brand!important
.el-menu--vertical
  .el-menu
    background-color $submenu-bgcolor
  .el-submenu__title,.el-menu-item
      color $menu-text-color
      &:hover
        color $menu-active-text-color
        background transparent
      &.is-active
        color $menu-active-text-color
</style>
