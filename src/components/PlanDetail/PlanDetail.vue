<template src="./PlanDetail.html">
</template>

<script>
import ComponentBase from "../../components/common/component-base/ComponentBase"
import BaseModal from '../../components/common/base-modal/BaseModal'
export default {
  name: 'PlanDetail',
  extends: ComponentBase,
  components: { BaseModal },
  data() {
    return {
      isShow: false,
      objBrand: {},

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
      this.objBrand = {};

      if(changeData) {
        this.$emit("change-data");
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.objBrand = this.data;
    }
  }
}
</script>

<style>

</style>