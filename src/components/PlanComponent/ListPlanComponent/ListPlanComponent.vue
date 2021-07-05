<template src="./ListPlanComponent.html">
</template>

<script>
import PlanDetailComponent from "../PlanDetailComponent/PlanDetailComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog" ;
import PlanService from "../../../services/plan/planServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";

export default {
  name: "ListPlan",
  extends: ComponentBase,
  components: {
    PlanDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  props: {
    plans: {
      type: Array,
      default: null,
    },
    courses: {
      type: Array,
      default: null,
    },
    trainingSystems: {
      type: Array,
      default: null,
    },
    careers: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      editPlan: {},
      detailPlan: {},
      confirmPlan: null,
      renderPlanDetail: true,
      renderPlanInfo: true,
      showDetail: null,
      filter: {
        status: "",
        isDelete: false
      },
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
    };
  },

  methods:{
    changeDataCareer() {
      this.$emit("change-data-career");
    },

    changeDataCourse() {
      this.$emit("change-data-course");
    },

    changeDataTrainingSystem() {
      this.$emit("change-data-training-system");
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },

    createPlan() {
      this.showDetail = "edit";
      this.editPlan = {};
    },

    updatePlan(index, detail) {
      this.showDetail = detail;
      this.renderPlanDetail = false;
      this.$nextTick(() => {
        this.renderPlanDetail = true;
        this.editPlan = Object.assign({}, this.plans[index]);
      });
    },

    showdetailPlan(index) {
      this.renderPlanInfo = false;
      this.$nextTick(() => {
        this.renderPlanInfo = true;
      });
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
      this.$emit("change-data-plan-component");
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      this.$emit("change-data-plan-component");
    },
  }
}
</script>

<style lang="scss">
@import "./ListPlanComponent.scss"
</style>