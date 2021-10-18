<template src='./UserManagementComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import JwPagination from "jw-vue-pagination";
import UserService from "../../../services/user/userService";
import AppConfig from "../../../app.config.json";
import { ROLE_ENUM } from "../../../config/constant";
import UserManagementDetailComponent from "../UserManagementDetailComponent/UserManagementDetailComponent.vue";
import crudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "UserManagementComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    BaseModal,
    AlertMessages,
    UserManagementDetailComponent,
  },
  mixins: [ crudMixin ],
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
      roleEnums: ROLE_ENUM,
      editUser: {},
    };
  },
  async mounted() {
    await this.getUserAsync();
  },
  methods: {
    createUser() {
      this.editUser = {};
    },

    async changeDataUser() {
      await this.getUserAsync();
    },

    async createUserAsync(user) {
      // Call Api
      this.showLoading();
      const api = new UserService();
      const response = await api.createUserAsync(user);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
    },

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
};
</script>