<template src="./ListPlanComponent.html">
</template>

<script>
import PlanDetailComponent from "../PlanDetailComponent/PlanDetailComponent";
export default {
  name: "ListPlan",
  components: {
    PlanDetailComponent,
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