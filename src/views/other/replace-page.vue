<!--  -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class extends Vue {
  beforeCreate() {
    const {
      query,
      params,
      params: { redirect }
    } = this.$route;
    delete params.redirect;
    // this.$router.push({ path: decodeURIComponent(redirect) })
    this.$routerReplace({
      refresh: false,
      name: redirect,
      query,
      params
    });
  }
  render() {
    return {};
  }
}
</script>
