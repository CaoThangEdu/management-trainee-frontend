<template src="./TimeLineDetailComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
export default {
  name: 'TimeLineDetailComponent',
  extends: ComponentBase,
  components: { BaseModal },
  data() {
    return {
      isShow: false,
      brand: {},

      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  methods:{
     closeModal(changeData) {
      this.isShow = false;
      this.brand = {};

      if(changeData) {
        this.$emit("change-data");
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.brand = this.data;
    }
  }
}
</script>

<style lang="scss">
@import './TimeLineDetailComponent.scss';
</style>