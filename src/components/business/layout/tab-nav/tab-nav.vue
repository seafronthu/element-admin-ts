<!-- 标签页导航 -->
<template>
  <div class="tab-nav">
    <!-- 清除所有按钮 -->
    <div class="btn close-btn">
      <el-dropdown @command="handleCloseAll">
        <div class="close-link flex-row-center">
          <IconFont icon="clear" width="1.5em" height="1.5em" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="CLOSE_All">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 选项卡 -->
    <div class="main">
      <el-button
        class="btn left-btn flex-row-center"
        @click="scrollFunc(200)"
        icon="el-icon-caret-left"
      ></el-button>
      <el-button
        icon="el-icon-caret-right"
        class="btn right-btn flex-row-center"
        @click="scrollFunc(-200)"
      >
        <!-- <a-icon type="caret-right" /> -->
      </el-button>
      <!-- 选项卡容器 -->
      <div
        class="wrap"
        ref="scrollWrap"
        @DOMMouseScroll.stop.prevent="handleScroll"
        @mousewheel.stop.prevent="handleScroll"
      >
        <div
          class="container"
          ref="scrollContainer"
          :style="{ transform: translates }"
        >
          <transition-group
            name="tab-nav-anim"
            tag="div"
            class="flex-row-start-center height-full"
          >
            <!-- <transition-group name="list-complete-demo" tag="div"> -->
            <TagButton
              v-for="(item, index) of newTabNavList"
              ref="tabNavRef"
              class="tab-nav-anim"
              :key="item.key"
              height="100%"
              :effect="item.effect"
              :type="item.type"
              :closable="!item.notClosed"
              @trigger-click="handleClick(item)"
              trigger="click"
              @trigger-command="command => handleCommand(item, command, index)"
              dot
            >
              {{ item.title }}
              <template #menu>
                <el-dropdown-item
                  v-for="its of dropdownItemList"
                  :command="its.type"
                  :key="its.type"
                  :disabled="!isCloseFunc(item, its, index)"
                >
                  {{ its.title }}
                </el-dropdown-item>
              </template>
            </TagButton>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IconFont from "@h/icon-font";
import TagButton from "@b/tag-button";
import {
  closeCurrentTab,
  closeRightTab,
  closeLeftTab,
  closeOtherTab,
  closeAllTab
} from "./utils";
import { RouteGlobal } from "@/types/route";
import { Mutation, State } from "vuex-class";
type DropdownType =
  | "CLOSE_All"
  | "CLOSE_OTHER"
  | "CLOSE_CURRENT"
  | "CLOSE_LEFT"
  | "CLOSE_RIGHT"
  | "REFRESH";
interface DropdownItemObjINF {
  type: DropdownType;
  title: string;
}
const dropdownType: DropdownType[] = [
  "REFRESH",
  "CLOSE_CURRENT",
  "CLOSE_RIGHT",
  "CLOSE_LEFT",
  "CLOSE_OTHER",
  "CLOSE_All"
];
@Component({
  components: {
    IconFont,
    TagButton
  }
})
export default class extends Vue {
  $refs!: {
    scrollWrap: HTMLDivElement;
    scrollContainer: HTMLDivElement;
  };
  dropdownItemList: DropdownItemObjINF[] = [
    {
      type: "REFRESH",
      title: "刷新"
    },
    {
      type: "CLOSE_CURRENT",
      title: "关闭当前"
    },
    {
      type: "CLOSE_RIGHT",
      title: "关闭右边"
    },
    {
      type: "CLOSE_LEFT",
      title: "关闭左边"
    },
    {
      type: "CLOSE_OTHER",
      title: "关闭其它"
    },
    {
      type: "CLOSE_All",
      title: "关闭所有"
    }
  ];
  diverge: number = 0;
  @Prop()
  tabNavList!: RouteGlobal.TabObjINF[];
  get newTabNavList() {
    return this.tabNavList.map(v => {
      let effect: string = "plain";
      let type: string = "info";
      if (v.checked) {
        effect = "dark";
        type = v.modified && v.beforeClosedCallback ? "warning" : "";
      } else if (v.modified && v.beforeClosedCallback) {
        type = "warning";
      }
      return {
        ...v,
        type,
        effect
      };
    });
  }
  get translates() {
    const diverge = this.diverge;
    return `translateX(${diverge}px)`;
  }
  @State(state => state.app.cacheRoutesList)
  cacheRoutesList!: RouteGlobal.RouteINF[];
  @Mutation("app/APP_SETTABLIST_MUTATE") APP_SETTABLIST_MUTATE!: (
    tabList: RouteGlobal.TabObjINF[]
  ) => void;
  @Mutation("app/APP_SETCACHEROUTES_MUTATE") APP_SETCACHEROUTES_MUTATE!: (
    cacheRoutesList: RouteGlobal.RouteINF[]
  ) => void;
  public handleCloseAll() {
    this.handleClose({
      command: "CLOSE_All"
    });
  }
  isCloseFunc(
    item: RouteGlobal.TabObjINF,
    its: { type: DropdownType; title: string },
    index: number
  ): boolean {
    switch (its.type) {
      case "CLOSE_CURRENT":
        return !item.notClosed;
      case "CLOSE_RIGHT":
        return this.tabNavList.slice(index + 1).some(v => !v.notClosed);
      case "CLOSE_LEFT":
        return this.tabNavList.slice(0, index).some(v => !v.notClosed);
      case "CLOSE_OTHER":
        return this.tabNavList.some((v, i) =>
          i === index ? false : !v.notClosed
        );
      case "CLOSE_All":
        return this.tabNavList.some(v => !v.notClosed);
      default:
        return true;
    }
  }
  // 关闭标签页
  handleClose({
    item,
    command,
    index
  }: {
    item?: RouteGlobal.TabObjINF;
    command: DropdownType;
    index?: number;
  }) {
    switch (command) {
      case "CLOSE_CURRENT":
        closeCurrentTab({
          vm: this,
          items: item as RouteGlobal.TabObjINF,
          index: index as number,
          routeName: this.$route.name as string
        });
        return;
      case "CLOSE_RIGHT":
        closeRightTab({
          vm: this,
          items: item as RouteGlobal.TabObjINF,
          index: index as number,
          routeName: this.$route.name as string
        });
        return;
      case "CLOSE_LEFT":
        closeLeftTab({
          vm: this,
          items: item as RouteGlobal.TabObjINF,
          index: index as number,
          routeName: this.$route.name as string
        });
        return;
      case "CLOSE_OTHER":
        closeOtherTab({
          vm: this,
          items: item as RouteGlobal.TabObjINF,
          index: index as number,
          routeName: this.$route.name as string
        });
        return;
      case "CLOSE_All":
        closeAllTab({
          vm: this,
          routeName: this.$route.name as string
        });
        return;
    }
  }
  handleRouter() {}
  // 滚轮事件(禁止触发原生事件，mac上左滑会返回上一页)
  handleScroll(e: WheelEvent) {
    var type = e.type;
    let detail = 0;
    if (type === "DOMMouseScroll" || type === "mousewheel") {
      if (e.detail) {
        detail = e.deltaX ? e.deltaX : e.deltaY || e.detail;
      } else {
        detail = -(e.detail || 0) * 40;
      }
    }
    this.scrollFunc(detail);
  }
  // 滚动距离
  scrollFunc(offset: number) {
    let wrapWidth = this.$refs.scrollWrap.offsetWidth;
    let containerWidth = this.$refs.scrollContainer.offsetWidth;
    if (offset > 0) {
      // 往左偏移
      this.diverge = Math.min(0, this.diverge + offset); // 内容在右边的时候往左偏移累加偏移量
    } else {
      if (wrapWidth < containerWidth) {
        // 内容超出容器宽度
        if (this.diverge < wrapWidth - containerWidth) {
          // 在最左边的时候
          this.diverge = this.diverge; // 不偏移
        } else {
          this.diverge = Math.max(
            this.diverge + offset,
            wrapWidth - containerWidth
          ); // 当到达最右边的时候取祖级容器和父级容器的差值
        }
      } else {
        this.diverge = 0; // 没有超出容器不偏移
      }
    }
  }
  handleClick(item: RouteGlobal.TabObjINF) {
    const { name, query, params } = item;
    this.$routerPush({ name, query, params });
  }
  handleCommand(
    item: RouteGlobal.TabObjINF,
    command: DropdownType,
    index: number
  ) {
    if (command === "REFRESH") {
      this.$routerReplace({
        name: item.name,
        refresh: true,
        query: item.query || {},
        params: item.params || {}
      });
      return;
    }
    this.handleClose({ item, command, index });
  }
  mounted() {}
}
</script>
<style lang="stylus" scoped>
.tab-nav
  position relative
  box-sizing border-box
  border-top 1px solid #f0f0f0
  border-bottom 1px solid #f0f0f0
  padding 0
  height 40px
  background #F0F0F0
  .el-dropdown
    width 100%
    height 100%
  .btn
    position absolute
    background-color #ffffff
    top 0
    height 100%
    cursor pointer
    &.close-btn
      right 0
      width 32px
      .close-link
        width 100%
        height 100%
        transition color 0.2s ease-in-out
        &:hover
          color $brand
    &.left-btn
      left 0
    &.right-btn
      right 32px
  .main
    > .btn
      padding 0 6px
    .wrap
      position absolute
      left 28px
      right 61px
      top 0
      bottom 0
      overflow hidden
      box-shadow 0px 0 3px 2px rgba(100, 100, 100, 0.1) inset
      .container
        position absolute
        height 100%
        box-sizing border-box
        padding 2px 0 2px 8px
        overflow visible
        transition transform 0.3s ease-out
        .tab-nav-anim
          transition all 0.5s
          margin-right 8px
</style>
