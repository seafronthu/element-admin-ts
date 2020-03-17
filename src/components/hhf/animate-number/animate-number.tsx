import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { VNode, CreateElement } from "vue/types/umd";
import { formatNumber } from "@l/tools";
type AnimateType = "ease-out" | "linear" | "ease-in"; // | "ease" | "linear" | "ease-in-out" | "ease-in";
@Component
export default class AnimateNumber extends Vue {
  @Prop({
    type: Number,
    default: 0
  })
  startNum!: number;
  @Prop({
    type: Number,
    default: 0
  })
  endNum!: number;
  @Prop({
    type: Number,
    default: 0
  })
  duration!: number;
  @Prop({
    type: Boolean,
    default: false
  })
  autoplay?: boolean;
  @Prop({
    type: String
  })
  format?: string; // #,##0.0
  @Prop({
    type: Function
  })
  animatFunc?: (
    currentTime: number,
    startVal: number,
    endVal: number,
    duration: number
  ) => number; // 传入动画方法
  @Prop({
    type: String,
    default: "ease-out",
    validator(val) {
      return ["ease", "linear", "ease-in-out", "ease-out", "ease-in"].includes(
        val
      );
    }
  })
  animateType!: AnimateType; // 动画类型
  get formatNum() {
    // 格式化之后的数字（当前显示的数字
    return formatNumber(this.currentNum, this.format);
  }
  frequencyCount: number = 0; // 执行频率
  currentTime: number = 0; // 当前时间戳
  separator: string = "";
  reqId: number = 0;
  currentNum: number = 0; // 当前数字
  startInit() {
    this.currentNum = this.startNum;
    this.frequencyCount = this.duration / (1000 / 60); // 1s执行60次当前可以执行几次
    this.currentTime = 0;
    if (this.autoplay) {
      this.reqId = window.requestAnimationFrame(this.changeNum);
    }
  }
  changeNum() {
    if (this.currentNum === this.endNum) {
      return;
    }
    if (this.startNum < this.endNum) {
      this.currentTime++;
      if (this.currentTime >= this.frequencyCount) {
        this.currentTime = this.frequencyCount;
      }
      this.currentNum =
        (this.animatFunc &&
          this.animatFunc(
            this.currentTime,
            this.startNum,
            this.endNum,
            this.frequencyCount
          )) ||
        this[this.animateType](
          this.currentTime,
          this.startNum,
          this.endNum,
          this.frequencyCount
        );
      this.reqId = window.requestAnimationFrame(this.changeNum);
    } else if (this.startNum > this.endNum) {
      this.currentTime++;
      if (this.currentTime >= this.frequencyCount) {
        this.currentTime = this.frequencyCount;
      }
      this.currentNum =
        (this.animatFunc &&
          this.animatFunc(
            this.currentTime,
            this.startNum,
            this.endNum,
            this.frequencyCount
          )) ||
        this[this.animateType](
          this.currentTime,
          this.startNum,
          this.endNum,
          this.frequencyCount
        );
      this.reqId = window.requestAnimationFrame(this.changeNum);
    }
  }
  // 先快后慢
  ["ease-out"](
    currentTime: number,
    startVal: number,
    endVal: number,
    count: number
  ): number {
    let remainVal = endVal - startVal;
    let start = remainVal < 0 ? startVal : endVal;
    return (
      remainVal *
        ((currentTime = currentTime / count - 1) * currentTime * currentTime +
          1) +
      start
    );
  }
  // 先慢后快
  ["ease-in"](
    currentTime: number,
    startVal: number,
    endVal: number,
    count: number
  ): number {
    let remainVal = endVal - startVal;
    let start = remainVal < 0 ? startVal : endVal;
    return (
      remainVal *
        ((currentTime = currentTime / count) * currentTime * currentTime) +
      start
    );
  }
  // 匀速
  ["linear"](
    currentTime: number,
    startVal: number,
    endVal: number,
    count: number
  ): number {
    let remainVal = endVal - startVal;
    let start = remainVal < 0 ? startVal : endVal;
    return start + remainVal * (currentTime / count);
  }
  @Watch("startNum")
  watchStartNum(currVal: number, oldVal: number) {
    if (this.autoplay) {
      this.startInit();
    }
  }
  @Watch("endNum")
  watchEndNum(currVal: number, oldVal: number) {
    if (this.autoplay) {
      this.startInit();
    }
  }
  created() {
    if (this.autoplay) {
      this.startInit();
    }
  }
  mounted() {}
  render(h: CreateElement): VNode {
    const prefix = this.$scopedSlots["prefix"];
    const suffix = this.$scopedSlots["suffix"];

    return (
      <span>
        {prefix}
        <span>{this.formatNum}</span>
        {suffix}
      </span>
    );
  }
  beforeDestroy() {
    window.cancelAnimationFrame(this.reqId);
    this.reqId = 0;
  }
}
