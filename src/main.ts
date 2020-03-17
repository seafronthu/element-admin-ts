import Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./stores";
import Element from "element-ui";
import plugins from "@/plugins";
import "@a/css/init.styl";
import "@a/css/common.styl";
import "@a/css/animate.styl";
import "element-ui/lib/theme-chalk/index.css";
import "@/mocks/index.js";
import "@a/js/global.js";
Vue.use(Element);
Vue.use(plugins);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
