import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";
import { DEVICE_TYPE, deviceEnquire } from "./device";
const App = namespace("app");
// 窗口判断设备
@Component
class DeviceMixin extends Vue {
  @App.State(state => state.device) device: string | undefined;
  get isMobile() {
    return this.device === DEVICE_TYPE.MOBILE;
  }
  get isTablet() {
    return this.device === DEVICE_TYPE.TABLET;
  }
  get isLaptop() {
    return this.device === DEVICE_TYPE.LAPTOP;
  }
  get isDesktop() {
    return this.device === DEVICE_TYPE.DESKTOP;
  }
}
// 全局使用的方法
@Component
class Mixin extends Vue {
  created() {
    const { $store } = this;
    deviceEnquire(deviceType => {
      $store.commit("app/APP_TOGGLEDEVICE_MUTATE", deviceType);
    });
  }
}
export { Mixin, DeviceMixin };
