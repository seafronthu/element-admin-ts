import { RouteGlobal } from "@/types/route";

const Login = {
  path: "/login",
  name: "Login",
  component: () => import(/* webpackChunkName: "Login" */ "@v/login/login.vue"),
  meta: {
    title: "登录",
    hideMenu: true,
    notCache: true,
    hideTab: true
  }
};
const Error404 = {
  path: "*",
  name: "Error404",
  component: () =>
    import(/* webpackChunkName: "Error404" */ "@v/error-page/404.vue"),
  meta: {
    title: "404",
    hideMenu: true,
    notCache: true,
    hideTab: true
  }
};
const Layout: RouteGlobal.FrontStageRoutesObjINF = {
  path: "/home",
  name: "Default",
  alias: "/",
  component: () => import(/* webpackChunkName: "Layout" */ "@b/layout")
};
const ReplacePage = {
  path: "/replace-page/:redirect*",
  name: "ReplacePage",
  component: () =>
    import(/* webpackChunkName: "ReplacePage" */ "@v/other/replace-page.vue"),
  meta: {
    title: "刷新",
    hideMenu: true,
    notCache: true,
    hideTab: true
  }
};
export { Login, Error404, Layout, ReplacePage };
