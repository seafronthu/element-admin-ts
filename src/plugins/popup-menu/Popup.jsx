import { initZIndexAdd } from "../utils/initParams";
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    duration: {
      type: Number,
      default: 3
    },
    transitionName: {
      type: String,
      default: "fade"
    },
    zIndex: {
      type: Number,
      default: initZIndexAdd(2)
    },
    keyName: {
      type: String,
      required: true
    },
    classes: {
      type: String
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    position: {
      type: String,
      default: "center"
    }
  },
  methods: {
    // 去除当前组件
    remove() {
      this.clearTimer();
      this.$emit("trigger-remove", this.keyName);
    },
    // 清除计时器
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.clearTimer);
        this.timer = null;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.show = true; // 为了动画
    });
    // setTimeout(() => {
    //   this.show = true
    // }, 1000)
    this.clearTimer();
    if (this.duration !== 0) {
      this.timer = setTimeout(() => {
        this.remove();
      }, this.duration * 1000);
    }
  },
  beforeDestroy() {
    this.clearTimer();
    this.$emit("trigger-close"); // 销毁组件之前的回调
  },
  destoryed() {
    this.$emit("trigger-after-close"); // 销毁组件之后的回调
  },
  render(h) {
    const {
      $slots,
      transitionName,
      show,
      classes,
      styles,
      zIndex,
      position
    } = this;
    let parentStyles = {
      "z-index": zIndex
    };
    let parentClasses = ["hhf-plugins-popup"];
    let wrapClasses = [
      "hhf-plugins-popup-container",
      `hhf-plugins-popup-${position}`
    ];
    let childStyles = {
      "z-index": zIndex + 1,
      ...styles
    };
    if (Object.prototype.toString.call(classes) === "[object Array]") {
      wrapClasses = wrapClasses.concat(classes);
    } else if (typeof classes === "string") {
      wrapClasses = wrapClasses.concat(classes.split(" "));
    }
    return (
      <transition name={transitionName}>
        {show ? (
          <div class={parentClasses} style={parentStyles}>
            {$slots.mask}
            <div class={wrapClasses} style={childStyles}>
              {$slots.default}
            </div>
          </div>
        ) : null}
      </transition>
    );
  }
};
