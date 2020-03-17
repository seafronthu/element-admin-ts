<!-- 路由祖级菜单的路由用来做keep-alive -->
<template>
  <!-- <keep-alive :include="cacheList"> -->
  <router-view></router-view>
  <!-- </keep-alive> -->
</template>

<script lang="ts">
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";
const App = namespace("App");
interface MapObjINF {
  [key: string]: string | number | undefined | MapObjINF;
}
@Component
export default class PageView extends Vue {
  @App.State(state => state.tabNavList) tabNavList: MapObjINF[] = [];
  get cacheList() {
    return [
      "ParentView",
      ...(this.tabNavList.length
        ? this.tabNavList
            .filter(item => !(item.meta && (item.meta as MapObjINF).notCache))
            .map(item => item.name)
        : [])
    ];
  }
}
</script>
