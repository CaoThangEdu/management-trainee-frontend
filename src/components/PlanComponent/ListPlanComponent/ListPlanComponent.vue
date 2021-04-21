<template src="./ListPlanComponent.html">
</template>

<script>
import PlanDetail from "../PlanDetailComponent/PlanDetailComponent";
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
    createBrand() {
      this.editData = {};
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