<template src="./ListPlanComponent.html">
</template>

<script>
import PlanDetail from "../../../components/PlanDetail/PlanDetail";
export default {
  name: "ListPlan",
  components: {
    PlanDetail,
  },
  data() {
    return {
      listBrand: [],
      editData: {},
    };
  },
  methods:{
    show() {
      this.$modal.show("hello-world");
    },
    hide() {
      this.$modal.hide("hello-world");
    },
    createBrand() {
      this.editData = {};
      console.log('abc')
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListPlanComponent.scss'
</style>