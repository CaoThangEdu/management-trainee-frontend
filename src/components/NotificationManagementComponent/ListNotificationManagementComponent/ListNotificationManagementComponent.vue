<template src='./ListNotificationManagementComponent.html'>
  
</template>

<script>
import NotificationManagementDetailComponent from "../NotificationManagementDetailComponent/NotificationManagementDetailComponent";
import NotificationServices from "../../../services/notification/notificationServices";
import ComponentBase from "../../common/component-base/ComponentBase";
import AppConfig from "../../../../src/app.config.json";

export default {
  name: "ListNotificationManagementComponent",
  extends: ComponentBase,
  components: {
    NotificationManagementDetailComponent,
  },
  data() {
    return {
      notifications: [],
      editNoti: {},
      pageOfItems: [],
    };
  },
  async mounted() {
    await this.getNotificationsAsync();
  },
  methods:{
    createBrand() {
      this.editNoti = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },

    // Get all notify
    async getNotificationsAsync(){
      // Call Api
      this.showLoading();
      const api = new NotificationServices()

      const response = await api.getNotificationsAsync();
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.notifications = response.data.items;
    },
  }
}
</script>

<style lang='scss'>
@import './ListNotificationManagementComponent.scss';
</style>