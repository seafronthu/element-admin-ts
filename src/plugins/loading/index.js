// import Mask from '../mask'
import createNewInstance from "../popup-menu";
// import initParams from '../uitls/initParams'
// import Vue from 'vue'
// let instance
// function createInstance () {
//   instance = instance || PopupMenu.createInstance()
//   return instance
// }
function GearLoading(h) {
  return (
    <div class="gear-loader">
      <div class="loader_overlay"></div>
      <div class="loader_cogs">
        <div class="loader_cogs__top">
          <div class="top_part"></div>
          <div class="top_part"></div>
          <div class="top_part"></div>
          <div class="top_hole"></div>
        </div>
        <div class="loader_cogs__left">
          <div class="left_part"></div>
          <div class="left_part"></div>
          <div class="left_part"></div>
          <div class="left_hole"></div>
        </div>
        <div class="loader_cogs__bottom">
          <div class="bottom_part"></div>
          <div class="bottom_part"></div>
          <div class="bottom_part"></div>
          <div class="bottom_hole"></div>
        </div>
      </div>
    </div>
  );
}
function WellLoading(h, props) {
  return (
    <div class="loader">
      <div class="well-loading"></div>
    </div>
  );
}

function loading(options = {}) {
  let newInstance = createNewInstance(options);
  if (options.type === "close") {
    newInstance.remove(options.message);
    return;
  }
  if (options.type === "clear") {
    newInstance.removeSimilar("loading");
    return;
  }
  let { message, loadingType } = options;
  if (typeof options === "string") {
    message = options;
    options = {};
  }
  let opt = {
    ...options,
    kind: "loading",
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
        let LoadEle;
        switch (loadingType) {
          case "gear":
            LoadEle = GearLoading(h);
            break;
          default:
            LoadEle = WellLoading(h);
            break;
        }
        return (
          <div class="size-30 hhf-plugins-loading">
            {LoadEle}
            <p class="hhf-plugins-loading-text">{message}</p>
          </div>
        );
      }
    }
  };
  opt.duration = opt.duration || 0;
  opt.position = opt.position || "center";
  opt.transitionName = opt.transitionName || "fade";
  opt.transitionName = `hhf-plugins-${opt.transitionName}`;
  newInstance.add(opt);
}
["close", "clear"].forEach(item => {
  loading[item] = options => {
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
    loading(opt);
  };
});
export default loading;
