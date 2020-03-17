import Cookies from "js-cookie";
import config from "@/config";
import moment from "moment";
import { isSameObjTool } from "./tools";
const { cookieTokenName, cookieExpires, title } = config;
interface MapObjINF {
  [key: string]: MapObjINF | string | MapObjINF[] | undefined;
}
interface ObjBasicINF {
  [key: string]: string | number | undefined;
}
/**
 * 设置token
 * @param {string} token 登录信息的token
 */
function setToken(token: string) {
  Cookies.set(cookieTokenName, token, {
    expires: cookieExpires || 1
  });
}
/**
 * 获取token
 * @returns {string|boolean} 返回token或false
 */
function getToken(): boolean | string {
  const token = Cookies.get(cookieTokenName);
  if (token) return token;
  return false;
}
/**
 * 移除token
 */
function removeToken() {
  Cookies.remove(cookieTokenName);
}
/**
 * 动态设置页面title
 * @param {string|void} pageTitle 页面title
 */
function setTitle(pageTitle: string) {
  document.title = pageTitle ? `${title} - ${pageTitle}` : title;
}

/**
 * 判断是否有属性children
 * @param {JSON} item  对象
 * @return {boolean}
 */
function hasChildren(item: { children: MapObjINF[] | undefined }): boolean {
  return !!(item.children && item.children.length > 0);
}
/**
 * 键值对塞到浏览器缓存中
 * @param {string} name  对象名称
 * @param {number} day  相差天数
 */
function setLocalStorage(name: string, value: MapObjINF, day: number): void {
  if (day === void 0) {
    localStorage.setItem(
      name,
      typeof value === "object"
        ? JSON.stringify({
            value
          })
        : value
    );
    return;
  }
  const expires = moment
    .utc()
    .add(day, "days")
    .format();
  window.localStorage.setItem(
    name,
    JSON.stringify({
      value,
      expires
    })
  );
}
/**
 * 从缓存中获取name的值
 * @param {string} name  对象名称
 * @return {boolean|string|array|JSON}
 */
function getLocalStorage(name: string): boolean | MapObjINF | string {
  let item = window.localStorage.getItem(name);
  if (!item) return false;
  const { value, expires } = JSON.parse(item);
  if (!expires || moment().isBefore(expires)) {
    return value;
  }
  removeLocalStorage(name);
  return false;
}
/**
 * 从缓存中移除name的值
 * @param {string} name  对象
 * @return {boolean|string|array|JSON}
 */
function removeLocalStorage(name: string): void {
  window.localStorage.removeItem(name);
}
/**
 * 是否可以关闭当前路由 true可以关闭
 * @param {object} item  拥有meta的对象
 * @return {boolean}
 */
function isCloseRoute(item: {
  meta: undefined | { notClosed: undefined | boolean };
}): boolean {
  return !item.meta || !item.meta.notClosed;
}
/**
 * 判断路由是否相等
 * @param {object} item  拥有meta的对象
 * @return {boolean}
 */
function isSameRoute(
  comparedRoute: { query: ObjBasicINF; params: ObjBasicINF; name: string },
  compareRoute: { query: ObjBasicINF; params: ObjBasicINF; name: string }
): boolean {
  let param1 = comparedRoute.params || {};
  let query1 = comparedRoute.query || {};
  let name1 = comparedRoute.name;
  let param2 = compareRoute.params || {};
  let query2 = compareRoute.query || {};
  let name2 = compareRoute.name;
  // let openTab = !comparedRoute.meta || !comparedRoute.meta.notOpenTab // 判断可以打开标签页
  return (
    name1 === name2 &&
    isSameObjTool(param1, param2) &&
    isSameObjTool(query1, query2)
  );
}
/**
 * 选中那个标签页
 * @param {Array} list 标签页列表
 * @param {JSON} route 路由
 * @param {JSON|undefined} item 当前操作的标签页 不存在的时候为全部关闭
 * @returns {JSON} 返回路由对象
 */
function selectNavTab(
  list: { query: ObjBasicINF; params: ObjBasicINF; name: string }[],
  route: { query: ObjBasicINF; params: ObjBasicINF; name: string },
  item: { query: ObjBasicINF; params: ObjBasicINF; name: string }
) {
  if (item) {
    const routeIndex = list.findIndex(v => isSameRoute(route, v));
    if (~routeIndex) {
      return route;
    }
    const itemIndex = list.findIndex(v => isSameRoute(item, v));
    if (~itemIndex) {
      return item;
    }
  }
  const len = list.length;
  if (len > 0) {
    return list[len - 1];
  }
  return {
    path: "/"
  };
}

function getKey(vm: Vue) {
  let key: string | number | undefined;
  if (vm.$vnode) {
    key = vm.$vnode.key;
  }
  return key;
}

interface ArrToObjINF {
  [key: string]: string | number | undefined;
  parentId: number;
}
interface ParentObjINF {
  [key: string]: any;
  parentId: number;
}
/**
 * 整理数组parentId为键名键值为该值下的数组
 * @param {Array<JSON>} arr 数组
 * @return {JSON} {0:[], 3:[]}
 */
// function arrageArrToObj<
//   V extends { [key: string]: string | number }[],
//   T extends { [key: string]: V }
// >(arr: V): T {
function arrageArrToObj<
  T extends ParentObjINF,
  V extends T[],
  K extends { [key: number]: T[] }
>(arr: V): K {
  let obj = <K>{};
  // obj['0'] = [{parentId: 2}]
  arr.forEach(items => {
    let parentId = items.parentId;
    if (obj[parentId]) {
      obj[parentId].push({ ...items });
    } else {
      obj[parentId] = [{ ...items }];
    }
  });
  return obj;
}
/**
 * 将数据根据父子级变成树结构
 * @param {JSON} obj 整理后的数据
 * @return {Array<JSON>} obj 整理后的数据
 */
function arrageObjToTree(
  obj: { [key: number]: ParentObjINF[] },
  parentId: number = 0
): ParentObjINF[] {
  let arr: ParentObjINF[] = [];
  let parentArr = obj[parentId];
  if (parentArr && parentArr.length > 0) {
    parentArr.forEach(v => {
      let id: number = v.id as number;
      let idArr = obj[id];
      if (idArr && idArr.length > 0) {
        v.children = arrageObjToTree(obj, id);
      }
      arr.push(v);
    });
  }
  return arr;
}
/**
 * 将数据变成树结构
 * @param {Array<JSON>} arr 数组数据[{parentId, id}]
 * @return {Array<JSON>} obj 整理后的数据 [{parentId, id, children}]
 */
function arrageDataToTree(
  arr: ParentObjINF[],
  parentId: number = 0
): ParentObjINF[] {
  return arrageObjToTree(arrageArrToObj(arr), parentId);
}
interface GradeChildrenObjINF {
  [key: string]:
    | string
    | number
    | undefined
    | GradeChildrenObjINF
    | GradeChildrenObjINF[];
  name: string;
  children?: GradeChildrenObjINF[];
}
/**
 * 将树级结构的数据分级成二维数组
 * @param {Array} list 数组数据
 */
function gradeChildren(list: GradeChildrenObjINF[]): string[][] {
  let nodes: string[][] = [];
  if (list) {
    let stack: GradeChildrenObjINF[] = list.map(v => v);
    // 广度优先遍历BFS
    let len = stack.length;
    let l = len;
    let lev = 0; // level
    let cur = 0; // 当前数组下标
    // 当前下标小于数组长度的时候
    while (cur < l) {
      let item = stack[cur];
      // 当前level小标下 未存在数组则增加一个小标数组，存在就添加一个数据
      let name = item.name as string;
      if (nodes[lev]) {
        nodes[lev].push(name);
      } else {
        nodes[lev] = [name];
      }
      ++cur;
      if (item.children && item.children.length > 0) {
        item.children.forEach(its => {
          // 核心 有子级就增加到栈中，并且长度加一
          stack.push(its);
          ++l;
        });
      }
      // 当前数组下标 超出上一个数组的长度即为认定下一个level 那么level加1 长度与当前数据长度相同
      if (cur >= len) {
        ++lev;
        len = l;
      }
    }
  }
  return nodes;
}
export {
  setToken, // 设置token
  getToken, // 获取token
  removeToken, // 移除token
  setTitle, // 设置title
  hasChildren, // 判断是否有属性children
  setLocalStorage, // 键值对塞到浏览器缓存中
  getLocalStorage, // 从缓存中获取name的值
  removeLocalStorage, // 从缓存中移除name的值
  isCloseRoute, // 是否可以关闭当前路由
  isSameRoute, // 判断路由是否相等
  selectNavTab, // 选中那个标签页
  getKey, // 得到子组件上的key值
  arrageArrToObj, // 整理数组parentId为键名键值为该值下的数组
  arrageObjToTree, // 将数据根据父子级变成树结构
  arrageDataToTree, // 将[{parentId, id}]数据转成树结构
  gradeChildren // 将树级结构的数据分级成二维数组
};
