// import Mask from '../mask'
import createNewInstance from "../popup-menu";
import Icon from "../icon";
// import initParams from '../uitls/initParams'
// import Vue from 'vue'
// let instance
// function createInstance (options) {
//   instance = instance || PopupMenu.createInstance(options)
//   return instance
// }
function confirm(options) {
  let newInstance = createNewInstance(options);
  // let newInstance = createInstance(options)
  if (options.type === "close") {
    newInstance.remove(options.message);
    return;
  }
  if (options.type === "clear") {
    newInstance.removeSimilar("confirm");
    return;
  }
  const {
    type,
    descrition,
    message,
    cancelName,
    cancelClasses,
    confirmClasses,
    confirmName,
    cancel
  } = options;
  let opt = {
    ...options,
    kind: "confirm",
    name: "plugins_confirm",
    Content: {
      props: {
        mask: {
          type: Boolean,
          default: false
        }
      },
      methods: {
        handleCancel() {
          this.$emit("trigger-cancel");
        },
        handleConfirm() {
          this.$emit("trigger-confirm");
        }
      },
      render(h, context) {
        const { handleCancel, handleConfirm } = this;
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
          <div class="size-30 hhf-plugins-confirm">
            <div class="hhf-plugins-confirm-container">
              <h5 class="hhf-plugins-confirm-first">
                <Icon
                  format={type}
                  color={color}
                  size={"23px"}
                  style={{ marginRight: "10px" }}
                />
                <span class="hhf-plugins-confirm-title">
                  {message || "免费玩"}
                </span>
              </h5>
              <p class="hhf-plugins-confirm-content">{descrition}</p>
              <div class="hhf-plugins-confirm-btn">
                {cancel ? (
                  <div
                    class={[
                      "hhf-plugins-confirm-btn-content hhf-plugins-confirm-default",
                      cancelClasses
                    ]}
                    onClick={handleCancel}
                  >
                    {cancelName || "取消"}
                  </div>
                ) : null}
                <div
                  class={[
                    "hhf-plugins-confirm-btn-content hhf-plugins-confirm-primary",
                    confirmClasses
                  ]}
                  onClick={handleConfirm}
                >
                  {confirmName || "确认"}
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  };
  opt.duration = opt.duration || 0;
  opt.transitionName = opt.transitionName || "scale";
  opt.transitionName = `hhf-plugins-${opt.transitionName}`;
  newInstance.add(opt);
}
["info", "success", "warning", "error", "close", "clear"].forEach(item => {
  confirm[item] = options => {
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
    confirm(opt);
  };
});
export default confirm;
