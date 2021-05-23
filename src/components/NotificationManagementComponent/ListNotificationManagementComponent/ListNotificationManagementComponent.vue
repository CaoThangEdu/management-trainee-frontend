<template src='./ListNotificationManagementComponent.html'>
  
</template>

<script>
import NotificationManagementDetailComponent from "../NotificationManagementDetailComponent/NotificationManagementDetailComponent";
export default {
  name: "ListNotificationManagementComponent",
  components: {
    NotificationManagementDetailComponent,
  },
  data() {
    return {
      notifications: [],
      editNoti: {},
    };
  },
  methods:{
    createBrand() {
      this.editNoti = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListNotificationManagementComponent.scss';
</style>