<template src='./ClassManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
export default {
  name: 'ClassManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal
  },
  data() {
    return {
      isShow: false,
      class: {},

      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  methods: {
    closeModal(changeData) {
      this.isShow = false;
      this.class = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.class = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './ClassManagementDetailComponent.scss';
</style>
