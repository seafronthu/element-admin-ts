<!--  -->
<template>
  <div>Introduce</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Introduce extends Vue {
  created() {
    console.log("Introduce, created");
  }
}
</script>
<style lang="stylus" scoped></style>
