import { appModule } from "@s/index";
import { VueConstructor } from "vue";
import { routerPushOptionsObjINF } from "vue/types/vue";
function install(vm: VueConstructor) {
  vm.prototype.$routerPush = function(options: routerPushOptionsObjINF) {
    let { APP_SETCACHEROUTES_MUTATE } = appModule;
    const {
      refresh = false,
      name,
      query,
      params,
      onComplete = function() {},
      onAbort = function() {}
    } = options;
    if (refresh) {
      let { cacheRoutesList } = appModule;
      // 刷新的时候清除当前跳转路由缓存
      APP_SETCACHEROUTES_MUTATE(
        cacheRoutesList.filter(items => items.name !== name)
      );
      // 用于清除缓存之后重新渲染
      setTimeout(() => {
        this.$router.push(
          {
            name,
            query,
            params
          },
          onComplete,
          onAbort
        );
      }, 5);
      return;
    }
    this.$router.push(
      {
        name,
        query,
        params
      },
      onComplete,
      onAbort
    );
  };
  vm.prototype.$routerReplace = function(options: routerPushOptionsObjINF) {
    let { APP_SETCACHEROUTES_MUTATE, cacheRoutesList } = appModule;
    const that = this;
    const routeName = that.$route.name;
    const {
      refresh = false,
      name = routeName,
      query = {},
      params = {},
      onComplete = function() {},
      onAbort = function() {}
    } = options;
    if (refresh) {
      // 刷新的时候清除当前跳转路由缓存
      APP_SETCACHEROUTES_MUTATE(
        cacheRoutesList.filter(items => items.name !== name)
      );
      let redirectParams = params;
      if (name) {
        redirectParams.redirect = name;
      } else {
        redirectParams.redirect = this.$route.name;
      }
      // 用于清除缓存之后重新渲染
      setTimeout(() => {
        this.$router.replace(
          {
            name: "ReplacePage",
            query,
            params: redirectParams
          },
          onComplete,
          onAbort
        );
      }, 5);
      return;
    }
    this.$router.replace(
      {
        name,
        query,
        params
      },
      onComplete,
      onAbort
    );
  };
}
export default install;
