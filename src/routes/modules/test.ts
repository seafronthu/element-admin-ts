const Home = {
  path: "home",
  name: "Home",
  component: () => import(/* webpackChunkName: "Home" */ "@v/home/home.vue"),
  meta: {
    notClosed: true,
    title: "首页",
    icon: "el-icon-location",
    showInitialTab: true
  }
};
const About = {
  path: "about",
  name: "About",
  meta: {
    title: "关于",
    icon: "el-icon-location"
  },
  component: () => import(/* webpackChunkName: "About" */ "@v/about/about.vue")
};
const Concat = {
  path: "concat",
  name: "Concat",
  component: () =>
    import(/* webpackChunkName: "Concat" */ "@v/concat/concat.vue")
};
const Introduce = {
  path: "introduce",
  name: "Introduce",
  component: () =>
    import(/* webpackChunkName: "Introduce" */ "@v/introduce/introduce.vue")
};
const Other = {
  path: "other",
  name: "Other",
  component: () => import(/* webpackChunkName: "Other" */ "@v/other/other.vue")
};
const Setting = {
  path: "setting",
  name: "Setting",
  component: () =>
    import(/* webpackChunkName: "Setting" */ "@v/setting/setting.vue")
};
export default { Home, About, Concat, Introduce, Other, Setting };
