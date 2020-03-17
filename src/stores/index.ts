import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import { getModule } from "vuex-module-decorators";

Vue.use(Vuex);
const stores = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    user
  }
});
export default stores;
export const userModule = getModule(user, stores);
export const appModule = getModule(app, stores);
