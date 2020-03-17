import { VueConstructor } from "vue";
import { appModule } from "@s/index";
import { urlJoin } from "@l/tools";
import { RouteGlobal } from "@/types/route";
// v-modified:[name]= boolean  (name: 路由名字，boolean 是否更改)
/**
 * 指令用来监听内容是否更改从而开启关闭之前一些操作
 * @param vm
 */
function install(vm: VueConstructor) {
  vm.directive("modified", {
    bind(el, binding, vnode) {
      console.log(el, binding.name);
    },
    inserted(el, binding, vnode) {
      console.log("inserted");
    },
    update(el, binding, vnode) {
      console.log("update");
    },
    componentUpdated(el, binding, vnode) {
      const { value, arg, oldValue } = binding;
      if (value === oldValue) {
        return;
      }
      let { tabList, APP_SETTABLIST_MUTATE } = appModule;
      let newTabList = [...tabList];
      // console.log(newTabList);
      for (var i = 0; i < newTabList.length; ++i) {
        let items = newTabList[i];
        if (items.name === arg) {
          items.modified = value;
          break;
        }
        // if (items.key === fullPath && items.notSingleTab) {
        //   items.modified = true;
        // } else if (items.name === name) {
        //   items.modified = true;
        // }
      }
      // console.log(newTabList);
      APP_SETTABLIST_MUTATE(newTabList);
    },
    unbind(el, binding, vnode) {}
  });
}
export default install;
