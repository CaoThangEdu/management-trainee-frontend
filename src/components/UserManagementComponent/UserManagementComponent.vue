<template src='./UserManagementComponent.html'></template>

<script>
import ComponentBase from "../common/component-base/ComponentBase";
import BaseModal from "../common/base-modal/BaseModal";
import AlertMessages from "../common/alert/alert-messages/AlertMessages";
import JwPagination from "jw-vue-pagination";

// import TeacherService from "../../../services/teacher/teacherServices";
import UserService from "../../services/user/userService";
import AppConfig from "../../../src/app.config.json";

export default {
  name: "UserManagementComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      users: [],
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
    };
  },
  props: {},
  async mounted() {
    await this.getUserAsync();
  },
  methods: {
    async getUserAsync() {
      // Call Api
      this.showLoading();
      const api = new UserService();
      const response = await api.getAllUserAsync(null);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.users = response.data.items;
    },

     onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },
  },
  watch: {},
};
</script>

<style lang='scss'>
@import "./UserManagementComponent.scss";
</style>
