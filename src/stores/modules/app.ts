import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
import { getRoutesApi } from "@/api/app";
import { arrageRoutes, arrageMenu } from "@l/manage";
import { RouteGlobal } from "@/types/route";

@Module({ name: "app", namespaced: true })
export default class App extends VuexModule {
  /**
   * @description 当前设备大小
   */
  public device = "";
  /**
   * @description 标签列表
   */
  public tabList: RouteGlobal.TabObjINF[] = [];
  /**
   * @description 路由缓存列表
   */
  public cacheRoutesList: RouteGlobal.RouteINF[] = [];
  /**
   * @description 授权列表
   */
  public authorizationList: RouteGlobal.BackStageRoutesObjINF[] = [];
  /**
   * @description 前台路由
   */
  public frontRoutesList: {
    [key: string]: RouteGlobal.FrontStageRoutesObjINF;
  } = {};
  /**
   * @description 路由列表
   */
  public routesList: RouteGlobal.FrontStageRoutesObjINF[] = [];
  /**
   * @description 菜单列表
   */
  public menuList: RouteGlobal.ArrageMenuObjINF[] = [];
  /**
   * @description 缓存名字
   */
  get cacheNameList(): string[] {
    return this.cacheRoutesList.map(v => v.name);
  }
  @Mutation
  APP_SETAUTHORIZATIONLIST_MUTATE({
    backstageRoutes,
    frontstageRoutes,
    initialRoutes
  }: {
    backstageRoutes: RouteGlobal.BackStageRoutesObjINF[];
    frontstageRoutes: { [key: string]: RouteGlobal.FrontStageRoutesObjINF };
    initialRoutes: RouteGlobal.FrontStageRoutesObjINF[];
  }) {
    this.authorizationList = backstageRoutes;
    this.frontRoutesList = frontstageRoutes;
    this.routesList = [
      ...initialRoutes,
      ...arrageRoutes({
        backstageRoutes: this.authorizationList,
        frontstageRoutes: frontstageRoutes,
        parentId: 0
      })
    ];
    this.menuList = arrageMenu({
      backstageRoutes: this.authorizationList,
      frontstageRoutes: frontstageRoutes,
      parentId: 0
    });
  }
  /**
   * 储存当前设备大小值
   * @param device 设备大小
   */
  @Mutation
  public APP_TOGGLEDEVICE_MUTATE(device: string) {
    // console.log(this.state);
    this.device = device;
  }
  /**
   * 设置缓存路由
   * @param cacheRoutesList 路由列表
   */
  @Mutation
  public APP_SETCACHEROUTES_MUTATE(cacheRoutesList: RouteGlobal.RouteINF[]) {
    // console.log(this.state);
    this.cacheRoutesList = cacheRoutesList;
  }
  /**
   * 设置tab标签页
   * @param cacheRoutesList 路由列表
   */
  @Mutation
  public APP_SETTABLIST_MUTATE(tabList: RouteGlobal.TabObjINF[]) {
    // console.log(this.state);
    this.tabList = tabList;
  }
  /**
   * 整理路由和菜单
   * @param frontstageRoutes 前台路由
   */
  @Action //({ rawError: true })
  public async APP_GETAUTHORIZATIONLIST_ACTION({
    frontstageRoutes,
    initialRoutes
  }: {
    frontstageRoutes: {
      [key: string]: RouteGlobal.FrontStageRoutesObjINF;
    };
    initialRoutes: RouteGlobal.FrontStageRoutesObjINF[];
  }) {
    const res = await getRoutesApi(); // Cannot read property 'getters' of undefined  What?
    if (res.code === 1000) {
      const list = res.data.list as RouteGlobal.BackStageRoutesObjINF[];
      this.APP_SETAUTHORIZATIONLIST_MUTATE({
        backstageRoutes: list,
        frontstageRoutes,
        initialRoutes
      });
      let tabList: RouteGlobal.TabObjINF[] = [];
      for (let i = 0; i < this.routesList.length; ++i) {
        let items = this.routesList[i];
        if (items.meta && items.meta.showInitialTab) {
          let {
            name,
            path,
            meta: {
              title,
              redirect,
              notClosed,
              hideTab,
              notCache,
              // notSingleTab,
              beforeClosedCallback
            }
          } = items;
          tabList.push({
            name,
            key: path,
            redirect,
            title,
            beforeClosedCallback,
            notClosed,
            checked: true,
            hideTab,
            notCache,
            // notSingleTab,
            createTime: +new Date()
          });
          this.APP_SETTABLIST_MUTATE(tabList);
        }
      }
      return res;
    }
    return res;
  }
}
// const myMod = getModule(App)
// myMod.device //works
// myMod.someOtherField //Typescript will error, as field doesn't exist
