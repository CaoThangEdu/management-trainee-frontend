<template>
  <CModal
    :id="getModalName()"
    @update:show="mouseClickOutSideModal"
    :show="isShow"
    :size="size"
    tabindex="-1"
  >
    <template #header>
      <slot name="header"></slot>
    </template>

    <template #default>
      <slot name="default"></slot>
    </template>

    <template #footer>
      <slot name="footer"></slot>
    </template>
  </CModal>
</template>

<script>
export default {
  name: "BaseModal",
  props: {
    modalName: {
      type: String,
      default: "",
    },
    isShow: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      id: null,
    };
  },

  methods: {
    mouseClickOutSideModal(value) {
      this.$emit("mouse-click-outside", value);
    },

    escKeyEvent(evt) {
      if (this.isShow && evt.keyCode === 27) {
        this.$emit("key-esc");
      }
    },

    enterKeyEvent(evt) {
      if (this.isShow && evt.keyCode === 13) {
        if (evt.target.tagName != "INPUT" && evt.target.tagName != "TEXTAREA") {
          this.$emit("key-enter");
        }
      }
    },

    getModalName() {
      this.id = `modal-${this.modalName}-${Date.now().toString()}`;
      return this.id;
    },
  },

  mounted() {
    document
      .querySelector(`#${this.id}`)
      .addEventListener("keyup", this.escKeyEvent);
    document
      .querySelector(`#${this.id}`)
      .addEventListener("keyup", this.enterKeyEvent);
  },

  // beforeDestroy() {
  //   document
  //     .querySelector(`#${this.id}`)
  //     .removeEventListener("keyup", this.escKeyEvent);
  //   document
  //     .querySelector(`#${this.id}`)
  //     .removeEventListener("keyup", this.enterKeyEvent);
  // },

  watch: {
    isShow() {
      if (this.isShow) {
        document.getElementById(`${this.id}`).focus();
      }
    },
  },
};
</script>