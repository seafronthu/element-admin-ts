const Mask = {
  props: {
    maskOpacity: {
      type: Number,
      default: 0
    },
    maskColor: {
      type: String
    },
    maskZIndex: {
      type: Number
    }
  },
  methods: {
    remove() {
      this.$emit("trigger-remove");
    }
  },
  render(h) {
    const styles = {
      opacity: this.maskOpacity,
      backgroundColor: this.maskColor,
      zIndex: this.maskZIndex
    };
    const { remove } = this;
    return <div class="hhf-plugins-mask" style={styles} onClick={remove}></div>;
  }
};
export default Mask;
