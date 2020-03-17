import Vue from "vue";
import { RedirectOption } from "vue-router";

declare module "vue/types/vue" {
  // 可以使用 `VueConstructor` 接口
  // 来声明全局属性

  interface routerPushOptionsObjINF {
    refresh?: boolean;
    name?: string;
    query?: GLOBAL.MapINF<string | (string | null)[] | null | undefined>;
    params?: GLOBAL.MapINF<string | (string | null)[] | null | undefined>;
    path?: string;
    // fullPath?: string;
    redirect?: RedirectOption;
    onComplete?: () => void;
    onAbort?: () => void;
  }
  interface VueConstructor {
    $myGlobal: string;
  }
  interface Vue {
    $myProperty: string;
    $routerReplace: (options: routerPushOptionsObjINF) => void;
    $routerPush: (options: routerPushOptionsObjINF) => void;
  }
}
