// import Mask from '../mask'
import createNewInstance from "../popup-menu";
import Icon from "../icon";
// import initParams from '../uitls/initParams'
// import Vue from 'vue'
// let instance
// function createInstance () {
//   instance = instance || PopupMenu.createInstance()
//   return instance
// }
function tip(options = {}) {
  let newInstance = createNewInstance(options);
  if (options.type === "close") {
    newInstance.remove(options.message);
    return;
  }
  if (options.type === "clear") {
    newInstance.removeSimilar("tip");
    return;
  }
  const { type, message } = options;
  let opt = {
    ...options,
    kind: "tip",
    name: "plugins_tip",
    Content: {
      props: {
        mask: {
          type: Boolean,
          default: false
        }
      },
      methods: {},
      render(h, context) {
        let color;
        switch (type) {
          case "success":
            color = "#52c41a";
            break;
          case "info":
            color = "#1890ff";
            break;
          case "warning":
            color = "#e6a23c";
            break;
          case "error":
            color = "#f5222d";
            break;
        }
        return (
          <div class="size-30 hhf-plugins-tip">
            <Icon
              format={type}
              color={color}
              size={"20px"}
              style={{ marginRight: "10px" }}
            />
            {message}
          </div>
        );
      }
    }
  };
  // options.duration = 0
  opt.position = opt.position || "top";
  opt.transitionName = opt.transitionName || "slide";
  opt.transitionName = `hhf-plugins-${opt.transitionName}`;
  newInstance.add(opt);
}
["info", "success", "warning", "error", "close", "clear"].forEach(item => {
  tip[item] = options => {
    let opt = {};
    if (typeof options === "object") {
      opt = {
        type: item,
        ...options
      };
    } else {
      opt = {
        type: item,
        message: options
      };
    }
    tip(opt);
  };
});
export default tip;
