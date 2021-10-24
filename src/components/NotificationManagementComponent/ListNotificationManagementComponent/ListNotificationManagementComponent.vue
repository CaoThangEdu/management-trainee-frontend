<template src='./ListNotificationManagementComponent.html'>
  
</template>

<script>
import NotificationManagementDetailComponent from "../NotificationManagementDetailComponent/NotificationManagementDetailComponent";
import NotificationService from "../../../services/notification/notificationServices";
import ComponentBase from "../../common/component-base/ComponentBase";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import PlanService from '../../../services/plan/planServices';
import SelectPlan from "../../common/form/select-plan/SelectPlan.vue";

export default {
  name: "ListNotificationManagementComponent",
  extends: ComponentBase,
  components: {
    NotificationManagementDetailComponent,
    JwPagination,
    SelectPlan,
  },
  data() {
    return {
      notifications: [],
      editNoti: {},
      pageOfItems: [],
      filterNotify: {
        internshipCourseId: "",
        isActive: true,
        title: "",
      },
      pageOfNotifications: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">"
      },
      plans: [],
    };
  },
  async mounted() {
    await this.getNotificationsAsync();
    await this.getPlansAsync();
  },
  methods:{
    getPlanName(id) {
      return this.plans.find(plan => plan.id == id).internshipCourseName;
    },

    async getPlansAsync(){
      let planFilter = {
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync(planFilter);
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

    createNotify() {
      this.editNoti = {};
    },

    onChangePage(pageOfNotifications) {
      // update page of items
      this.pageOfNotifications = pageOfNotifications;
    },
    // Get all notify
    async getNotificationsAsync(){
      // Call Api
      this.showLoading();
      const api = new NotificationService();
      const response = await api.getNotificationsAsync(this.filterNotify);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.notifications = response.data;
    },
  }
}
</script>

<style lang='scss'>
div.notifications {
  .select-plan {
    width: 100%;
    div {
      width: 100%;
    }
    .select2-container {
      width: 100%;
    }
  }
}
</style>