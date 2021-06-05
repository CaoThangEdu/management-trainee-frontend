<template src="./ListPlanComponent.html">
</template>

<script>
import PlanDetailComponent from "../PlanDetailComponent/PlanDetailComponent";
import PlanInformationComponent from "../PlanInformationComponent/PlanInformationComponent";
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog" 
import PlanService from '../../../services/plan/planServices'
import AppConfig from '../../../../src/app.config.json'

export default {
  name: "ListPlan",
  extends: ComponentBase,
  components: {
    PlanDetailComponent,
    ConfirmDialog,
    PlanInformationComponent,
  },
  data() {
    return {
      plans: [],
      editPlan: {},
      detailPlan: {},
      confirmPlan: null,
    };
  },

  async mounted(){
    await this.getPlansAsync()
  },


  methods:{
    createPlan() {
      this.editPlan = {};
    },

    // showDetailPlan() {
    //   this.detailPlan = {};
    // },
    
    async getPlansAsync(){
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data.items
    },

    async changePage(currentPage) {
      await this.getPlansAsync(currentPage);
    },

    updatePlan(index) {
      this.editPlan = Object.assign({}, this.plans[index]);
    },

    showdetailPlan(index) {
      this.detailPlan = Object.assign({}, this.plans[index]);
    },

    deletePlan(id) {
      this.confirmPlan = { id: id };
    },

    // Call api delete Plan
    async deletePlanConfirm(planComfirm) {
      this.showLoading();
      let api = new PlanService();
      let response = await api.deletePlanAsync(planComfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getPlansAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getPlansAsync();
    },

    showNotification() {
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },
  }
}
</script>

<style lang='scss'>
@import './ListPlanComponent.scss'
</style>