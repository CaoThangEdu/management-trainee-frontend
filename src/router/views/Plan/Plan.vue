<template>
<div class="row">
  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
    <PlanningStepsComponent :isActiveStep="isActiveStep" />
  </div>
  <div class="col-lg-4 col-md-4 col-sm-12 col-12">
    <TimeLineComponent :plans="plans" />
  </div>
  <div class="col-lg-8 col-md-8 col-sm-12 col-12">
    <ListPlanComponent :plans="plans"
      @change-data-plan-component="updateDataPlan"
      @change-page="changePage" />
  </div>
</div>
</template>

<script>
import ListPlanComponent from '../../../components/PlanComponent/ListPlanComponent/ListPlanComponent';
import TimeLineComponent from '../../../components/PlanComponent/TimeLineComponent/TimeLineComponent';
import ComponentBase from '../../../components/common/component-base/ComponentBase.vue';
import PlanService from '../../../services/plan/planServices';
import AppConfig from '../../../../src/app.config.json';
import PlanningStepsComponent from '../../../components/planningStepsComponent/planningStepsComponent.vue';

export default {
  name: 'Plan',
  extends: ComponentBase,
  components: {
    ListPlanComponent,
    PlanningStepsComponent,
    TimeLineComponent
  },

  data() {
    return {
      plans: [],
      filter: {
        status: "",
        isDelete: false
      },
      changeDataPlan: false,
      isActiveStep:"1",
    };
  },

  async mounted(){
    await this.getPlansAsync();
  },

  methods:{    
    async getPlansAsync(){
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync(this.filter)
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data
    },

    async updateDataPlan(id) {
      this.changeDataPlan = true;
      this.plans = this.plans.filter(
      plan => plan.id != id);
    },

    async changePage(currentPage) {
      await this.getPlansAsync(currentPage);
    },
  }
}
</script>

<style>

</style>
