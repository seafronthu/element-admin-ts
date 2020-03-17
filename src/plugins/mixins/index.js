export default {
  methods: {
    addOverflow(container) {
      container = container || document.body;
      container.classList.add("hhf-plugins-overflow");
    },
    removeOverflow(container) {
      container = container || document.body;
      container.classList.remove("hhf-plugins-overflow");
    }
  }
};
