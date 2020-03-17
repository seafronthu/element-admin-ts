import PopupMenu from "./PopupMenu";
import Vue from "vue";

let instance;
PopupMenu.createInstance = (properties = {}) => {
  const Instance = new Vue({ ...PopupMenu });
  const component = Instance.$mount();
  const parentDom = properties.elem || document.body;
  parentDom.appendChild(component.$el);
  // const PpM = Instance.$children[0]
  // console.log(Instance, PpM)
  return {
    add(popupProp) {
      Instance.add(popupProp);
    },
    remove(keyName) {
      // 移除该名字类型的popup或者全部移除
      Instance.remove(keyName);
    },
    removeSimilar(kind) {
      // 移除该类型的popup
      Instance.removeSimilar(kind);
    },
    destroy() {
      this.remove();
      setTimeout(() => {
        parentDom.removeChild(component.$el);
      }, 500);
    }
  };
};
function createNewInstance(options) {
  instance = instance || PopupMenu.createInstance(options);
  return instance;
}
export default createNewInstance;
