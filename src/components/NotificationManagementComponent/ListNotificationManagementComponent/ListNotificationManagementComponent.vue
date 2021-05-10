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
@import './ListNotificationManagementComponent.scss';
</style>