<template src="./ListPlanComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog" ;
import PlanService from "../../../services/plan/planServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";

export default {
  name: "ListPlan",
  extends: ComponentBase,
  components: {
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
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
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
  }
}
</script>

<style lang="scss">
@import "./ListPlanComponent.scss"
</style>