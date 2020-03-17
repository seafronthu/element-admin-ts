import { RouteGlobal } from "@/types/route";
import { routerPushOptionsObjINF } from "vue/types/vue";
interface CloseAllTabINF {
  vm: {
    tabNavList: RouteGlobal.TabObjINF[];
    APP_SETTABLIST_MUTATE: (tabNav: RouteGlobal.TabObjINF[]) => void;
    cacheRoutesList: RouteGlobal.RouteINF[];
    APP_SETCACHEROUTES_MUTATE: (
      cacheRoutesList: RouteGlobal.RouteINF[]
    ) => void;
    $routerPush: (options: routerPushOptionsObjINF) => void;
  };
  routeName: string;
}
interface CloseTabINF extends CloseAllTabINF {
  items: RouteGlobal.TabObjINF;
  index: number;
}
export function closeCurrentTab({ vm, items, index, routeName }: CloseTabINF) {
  const { tabNavList } = vm;
  let newTabNavList: RouteGlobal.TabObjINF[] = [];
  let route: {
    name: string;
    query?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
    params?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
  } = { name: "Home" };
  let { query, params, name } = items;
  // 判断当前关闭标签页是否已经修改并且有回调函数
  if (items.beforeClosedCallback && items.modified) {
    items.beforeClosedCallback(items);
    // 关闭的标签页与当前路由不一致
    if (items.name !== routeName) {
      vm.$routerPush({
        query,
        params,
        name
      });
    }
  } else {
    newTabNavList = tabNavList.filter((v, i) => i !== index);
    vm.APP_SETCACHEROUTES_MUTATE(
      vm.cacheRoutesList.filter(v => v.name !== items.name)
    );
    vm.APP_SETTABLIST_MUTATE(newTabNavList);
    if (items.name !== routeName) {
      return;
    }
    route = newTabNavList[index];
    if (!route) {
      route = newTabNavList[index - 1]; // 必然有一个默认页
    }
    vm.$routerPush(route);
  }
}
export function closeRightTab({ vm, items, index, routeName }: CloseTabINF) {
  const { tabNavList } = vm;
  let newTabNavList: RouteGlobal.TabObjINF[] = [];
  let route: {
    name: string;
    query?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
    params?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
  } = { name: "Home" };
  let leftTabNavList: RouteGlobal.TabObjINF[] = [];
  let rightTabNavList: RouteGlobal.TabObjINF[] = [];
  let modifiedArr: RouteGlobal.TabObjINF[] = [];
  let cacheRoutesNameList: string[] = [];
  for (let i = 0; i < tabNavList.length; ++i) {
    const tabNav = tabNavList[i];
    const { notClosed, beforeClosedCallback, modified, name } = tabNav;
    // 左边和当前标签页的筛选出来
    if (i <= index) {
      leftTabNavList.push(tabNav);
      cacheRoutesNameList.push(name);
    } else if (notClosed) {
      // 右边不能关闭的
      rightTabNavList.push(tabNav);
      cacheRoutesNameList.push(name);
    } else if (beforeClosedCallback && modified) {
      // 右边已经修改且有回调函数的过滤出来
      rightTabNavList.push(tabNav);
      cacheRoutesNameList.push(name);
      modifiedArr.push(tabNav);
    }
  }
  newTabNavList = [...leftTabNavList, ...rightTabNavList];
  vm.APP_SETCACHEROUTES_MUTATE(
    vm.cacheRoutesList.filter(v => cacheRoutesNameList.includes(v.name))
  );
  vm.APP_SETTABLIST_MUTATE(newTabNavList);
  // 已经有修改且有回调的页面
  if (modifiedArr.length > 0) {
    route = modifiedArr[0];
    vm.$routerPush(route);
    return;
  }
  // 操作的标签页当前路由不一致
  if (routeName !== items.name) {
    const to = newTabNavList[newTabNavList.length - 1];
    if (to) {
      vm.$routerPush(to);
      return;
    }
    vm.$routerPush(route);
    return;
  }
}
export function closeLeftTab({ vm, items, index, routeName }: CloseTabINF) {
  const { tabNavList } = vm;
  let newTabNavList: RouteGlobal.TabObjINF[] = [];
  let route: {
    name: string;
    query?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
    params?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
  } = { name: "Home" };
  let leftTabNavList: RouteGlobal.TabObjINF[] = [];
  let rightTabNavList: RouteGlobal.TabObjINF[] = [];
  let modifiedArr: RouteGlobal.TabObjINF[] = [];
  let cacheRoutesNameList: string[] = [];
  for (let i = 0; i < tabNavList.length; ++i) {
    const tabNav = tabNavList[i];
    const { notClosed, beforeClosedCallback, modified, name } = tabNav;
    // 右边和当前标签页的筛选出来
    if (i >= index) {
      rightTabNavList.push(tabNav);
      cacheRoutesNameList.push(name);
    } else if (notClosed) {
      // 左边不能关闭
      leftTabNavList.push(tabNav);
      cacheRoutesNameList.push(name);
    } else if (beforeClosedCallback && modified) {
      // 左边已经修改且有回调函数的过滤出来
      leftTabNavList.push(tabNav);
      modifiedArr.push(tabNav);
      cacheRoutesNameList.push(name);
    }
  }
  newTabNavList = [...leftTabNavList, ...rightTabNavList];
  vm.APP_SETCACHEROUTES_MUTATE(
    vm.cacheRoutesList.filter(v => cacheRoutesNameList.includes(v.name))
  );
  vm.APP_SETTABLIST_MUTATE(newTabNavList);

  // 已经有修改且有回调的页面
  if (modifiedArr.length > 0) {
    route = modifiedArr[0];
    vm.$routerPush(route);
    return;
  }
  // 操作的标签页当前路由不一致
  if (routeName !== items.name) {
    const to = items;
    const rightTabNav = rightTabNavList.filter(v => v.checked);
    if (rightTabNav.length === 0) {
      vm.$routerPush(to);
      return;
    }
  }
}
export function closeOtherTab({ vm, items, index, routeName }: CloseTabINF) {
  const { tabNavList } = vm;
  let newTabNavList: RouteGlobal.TabObjINF[] = [];
  let route: {
    name: string;
    query?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
    params?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
  } = { name: "Home" };
  let modifiedArr: RouteGlobal.TabObjINF[] = [];
  let cacheRoutesNameList: string[] = [];
  for (let i = 0; i < tabNavList.length; ++i) {
    const tabNav = tabNavList[i];
    const { notClosed, beforeClosedCallback, modified, name } = tabNav;
    if (i === index || notClosed) {
      newTabNavList.push(tabNav);
      cacheRoutesNameList.push(name);
    } else if (beforeClosedCallback && modified) {
      newTabNavList.push(tabNav);
      modifiedArr.push(tabNav);
      cacheRoutesNameList.push(name);
    }
  }
  vm.APP_SETCACHEROUTES_MUTATE(
    vm.cacheRoutesList.filter(v => cacheRoutesNameList.includes(v.name))
  );
  vm.APP_SETTABLIST_MUTATE(newTabNavList);
  if (modifiedArr.length > 0) {
    route = modifiedArr[0];
    vm.$routerPush(route);
    return;
  }
  // 操作的标签页当前路由不一致
  if (routeName !== items.name) {
    const to = items;
    vm.$routerPush(to);
    return;
  }
}
export function closeAllTab({ vm, routeName }: CloseAllTabINF) {
  const { tabNavList } = vm;
  let newTabNavList: RouteGlobal.TabObjINF[] = [];
  let route: {
    name: string;
    query?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
    params?: RouteGlobal.KeyValuePair<string | (string | null)[]>;
  } = { name: "Home" };
  let modifiedArr: RouteGlobal.TabObjINF[] = [];
  let cacheRoutesNameList: string[] = [];
  for (let i = 0; i < tabNavList.length; ++i) {
    const tabNav = tabNavList[i];
    const { notClosed, beforeClosedCallback, modified, name } = tabNav;
    if (notClosed) {
      newTabNavList.push(tabNav);
      cacheRoutesNameList.push(name);
    } else if (beforeClosedCallback && modified) {
      newTabNavList.push(tabNav);
      modifiedArr.push(tabNav);
      cacheRoutesNameList.push(name);
    }
    vm.APP_SETCACHEROUTES_MUTATE(
      vm.cacheRoutesList.filter(v => cacheRoutesNameList.includes(v.name))
    );
    vm.APP_SETTABLIST_MUTATE(newTabNavList);
    if (modifiedArr.length > 0) {
      route = modifiedArr[0];
      vm.$routerPush(route);
      return;
    }
    vm.$routerPush(newTabNavList[0]);
  }
}
