// 第一种写法 对ts不友好
// import { Commit } from "vuex";
// import { RouteGlobal } from "@/types/route";
// interface UserStateINF {
//   /**
//    * @description 用户信息
//    */
//   userInfo: {
//     name: string;
//     headimg: string;
//   };
//   /**
//    * @description 用户的token
//    */
//   token: string;
//   /**
//    * @description 授权列表
//    */
//   authorizationList: RouteGlobal.BackStageRoutesObjINF[];
// }
// const state: UserStateINF = {
//   userInfo: {
//     name: "",
//     headimg: ""
//   },
//   token: "jiujiu",
//   authorizationList: []
// };
// const mutations = {
//   USER_SETUSERINFO_MUTATE(
//     state: UserStateINF,
//     userInfo: { name?: string; headimg?: string }
//   ) {
//     state.userInfo = {
//       ...state.userInfo,
//       ...userInfo
//     };
//   },
//   USER_GETAUTHORIZATIONLIST_MUTATE(
//     state: UserStateINF,
//     authorizationList: RouteGlobal.BackStageRoutesObjINF[]
//   ) {
//     state.authorizationList = authorizationList;
//   }
// };
// const actions = {
//   USER_GETUSERINFO_ACTION(context: { commit: Commit }) {
//     context.commit("USER_SETUSERINFO_MUTATE", { name: "胡哥" });
//   },
//   async USER_GETAUTHORIZATIONLIST_ACTION({ commit }: { commit: Commit }) {
//     await getRoutesApi().then(res => {
//       if (res.code === 1000) {
//         const list = res.data.list;
//         commit("USER_GETAUTHORIZATIONLIST_MUTATE", list);
//         return res;
//       }
//       return res;
//     });
//   }
// };
// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// };
import {
  Module,
  VuexModule,
  Mutation,
  Action
  // getModule
} from "vuex-module-decorators";
@Module({ name: "user", namespaced: true })
export default class User extends VuexModule {
  /**
   * @description 用户信息
   */
  public userInfo = {
    name: "",
    headimg: ""
  };
  /**
   * @description 用户的token
   */
  public token: string = "aa";
  @Mutation
  USER_SETUSERINFO_MUTATE(userInfo: { name?: string; headimg?: string }) {
    this.userInfo = {
      ...this.userInfo,
      ...userInfo
    };
  }
  @Action
  async USER_GETUSERINFO_ACTION() {
    this.USER_SETUSERINFO_MUTATE({ name: "胡哥" });
  }
}
// const userModule = getModule(User);
// export { userModule };
