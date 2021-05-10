<template src='./TeacherManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
export default {
  name: 'PlanDetail',
  extends: ComponentBase,
  components: {
    BaseModal
  },
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
  methods: {
    closeModal(changeData) {
      this.isShow = false;
      this.objBrand = {};

      if (changeData) {
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

<style lang='scss'>
@import './TeacherManagementDetailComponent.scss';
.form-select-class{
  width: 100%;
  height: 35px;
}
.brith-day{
  width: 100%;
  height: 35px;
}
</style>
