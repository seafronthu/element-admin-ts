import routerHandle from "./routerHandle";
import modified from "./modified";
import { VueConstructor } from "vue";
export default function(vm: VueConstructor, options: object) {
  routerHandle(vm);
  modified(vm);
}
