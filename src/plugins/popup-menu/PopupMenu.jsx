import Popup from "./Popup";
import Mask from "../mask";
import mixins from "../mixins";
import { initKeyAdd, initZIndexAdd } from "../utils/initParams";
// let defaultOptions = {}
function maxZindexFunc(arr) {
  let ar = arr.sort((a, b) => b.zIndex - a.zIndex);
  return ar.length > 0 ? ar[0] : {};
}
const PopupMenu = {
  name: "hhf-plugins-popup-menu",
  data() {
    return {
      popupArr: []
    };
  },
  mixins: [mixins],
  methods: {
    add(popupProp) {
      // popupProp.keyName = initKeyAdd('popup_menu')
      // this.popupArr = []
      this.popupArr.push(this.listNode(popupProp));
      if (this.popupArr.length > 0) {
        this.addOverflow();
      }
    },
    listNode(popupProp) {
      popupProp.keyName = popupProp.keyName || initKeyAdd(popupProp.name);
      let {
        Content,
        confirm,
        cancel,
        close,
        keyName,
        duration,
        transitionName,
        classes,
        styles,
        position,
        zIndex
      } = popupProp;
      popupProp.zIndex = zIndex || initZIndexAdd(2);
      const key = keyName;
      const popupProps = {
        key,
        props: {
          key,
          duration,
          transitionName,
          keyName,
          classes,
          styles,
          position,
          zIndex: popupProp.zIndex
        },
        on: {
          "trigger-close": close || (() => {}),
          "trigger-remove": () => this.remove(keyName)
        }
      };
      const contentProps = {
        on: {
          "trigger-confirm": () => this.handleConfirm(keyName, confirm),
          "trigger-cancel": () => this.handleCancel(keyName, cancel)
        }
      };
      return {
        passValue: popupProp,
        content: (
          <Popup {...popupProps}>
            <Content {...contentProps} />
          </Popup>
        )
      };
    },
    remove(keyName) {
      if (keyName) {
        this.popupArr = this.popupArr.filter(
          v => v.passValue.keyName !== keyName
        );
      } else {
        this.popupArr = [];
      }
      if (this.popupArr.length === 0) {
        this.removeOverflow();
      }
    },
    removeSimilar(kind) {
      this.popupArr = this.popupArr.filter(v => v.passValue.kind !== kind);
    },
    handleConfirm(keyName, callback = () => true) {
      !callback(keyName) || this.remove(keyName);
    },
    handleCancel(keyName, callback) {
      callback(keyName);
      this.remove(keyName);
    },
    showMask(obj) {
      if (Object.keys(obj).length === 0) {
        return false;
      }
      const {
        maskColor,
        maskOpacity,
        maskZIndex,
        zIndex,
        keyName,
        maskClose // 关闭遮罩层是否去除组件
      } = obj;
      const maskProps = {
        props: {
          maskColor,
          maskOpacity,
          maskZIndex: maskZIndex || zIndex - 1,
          maskClose // 关闭遮罩层是否去除组件
        },
        on: {
          "trigger-remove": () => {
            if (maskClose) {
              this.remove(keyName);
            }
          }
        },
        slot: "mask"
      };
      return maskProps;
    }
  },
  render(h) {
    const arr = [];
    const jsxDom = this.popupArr.map(v => {
      arr.push(v.passValue);
      return v.content;
    });
    const maxObj = maxZindexFunc(arr);
    const maskProps = this.showMask(maxObj);
    return (
      <div class="hhf-plugins-popup-menu">
        {maskProps && maxObj.mask ? <Mask {...maskProps} /> : null}
        {jsxDom}
      </div>
    );
  }
};
export default PopupMenu;
