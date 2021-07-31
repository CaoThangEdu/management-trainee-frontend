<template src="./ListPlanComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog" ;
import PlanService from "../../../services/plan/planServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";


export default {
  name: "ListPlan",
  extends: ComponentBase,
  components: {
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  props: {
    plans: {
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

    deletePlan(item) {
      this.confirmPlan = null;
      this.confirmPlan = { item: item };
    },

    // Call api delete Plan
    async deletePlanConfirm(planComfirm) {
      planComfirm.item.isDelete = true;
      this.showLoading();
      let api = new PlanService();
      let response = await api.updatePlanAsync(planComfirm.item); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.$emit("change-data-plan-component", planComfirm.item.id);
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