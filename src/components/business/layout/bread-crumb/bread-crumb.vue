<!-- 面包屑 -->
<template>
  <div class="bread-crumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-if="$route.name !== 'Home'" :to="{ path: '/' }"
        >首页</el-breadcrumb-item
      >
      <template v-for="(items, index) of breadcrumbList">
        <el-breadcrumb-item
          :key="items.name"
          v-if="items.type === 'PAGE' && index < breadcrumbList.length - 1"
          :to="{ path: items.path }"
          >{{ items.title }}</el-breadcrumb-item
        >
        <el-breadcrumb-item :key="items.name" v-else>{{
          items.title
        }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive } from "vue-property-decorator";
import { RouteGlobal } from "@/types/route";
@Component
export default class BreadCrumb extends Vue {
  @InjectReactive("breadcrumbList")
  readonly breadcrumbList!: RouteGlobal.BreadcrumbINF[];
}
</script>
<style lang="stylus" scoped></style>
