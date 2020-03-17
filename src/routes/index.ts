import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import NProgress from "nprogress"; // progress bar
import config from "@/config";
import { userModule, appModule } from "@s/index";
import { setTitle } from "@l/utils";
import getRouteAndAddRoute from "@l/routeMixin";
import initials from "./initials";
let first: boolean = true;
function toRouter(to: Route): string {
  const path = to.path;
  const query = to.query;
  const params = to.params;
  const url = encodeURIComponent(
    JSON.stringify({
      path,
      query,
      params
    })
  );
  return url;
}
const { initialPageName, notLoginPageName } = config;
NProgress.configure({ showSpinner: false }); // NProgress Configuration
Vue.use(VueRouter);

const routes = [...initials];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to: Route, from: Route, next) => {
  NProgress.start();
  // console.log(userModule);
  const token = userModule.token;
  // 不用登录的页面
  if (notLoginPageName.includes(to.name as string)) {
    next();
    NProgress.done();
  } else if (!token) {
    // 需要登录的页面但是不存在token
    next({
      name: initialPageName, // 跳转到登录页
      query: {
        url: toRouter(to)
      }
    });
    NProgress.done();
  } else {
    if (!first) {
      next();
      return;
    }
    first = false;
    // 没有路由就去请求后台
    if (appModule.routesList.length === 0) {
      getRouteAndAddRoute().then(res => {
        const redirect = from.query.redirect
          ? decodeURIComponent(from.query.redirect as string)
          : null;
        if (redirect) {
          next({ path: redirect, replace: true });
        } else if (!to.name) {
          next({ ...to, replace: true });
        } else {
          next({ name: to.name, replace: true });
        }
        NProgress.done();
      });
    } else {
      next();
      NProgress.done();
    }
  }
});
router.afterEach(route => {
  setTitle(route.meta.title);
  // window.scrollTo(0, 0)
});
export default router;
