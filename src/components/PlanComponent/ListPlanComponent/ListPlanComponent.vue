<template src="./ListPlanComponent.html">
</template>

<script>
import PlanDetailComponent from "../PlanDetailComponent/PlanDetailComponent";
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import PlanService from '../../../services/plan/planServices'
import AppConfig from '../../../../src/app.config.json'

export default {
  name: "ListPlan",
  extends: ComponentBase,
  components: {
    PlanDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      plans: [],
      editPlan: {},
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

    deletePlan(id) {
      this.confirmPlan = { id: id };
    },

    // Call api delete Plan
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new PlanService();
      let response = await api.deletePlanAsync(dataConfirm.id); // Gọi Api
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