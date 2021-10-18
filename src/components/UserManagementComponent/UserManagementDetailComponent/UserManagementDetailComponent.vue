<template src='./UserManagementDetailComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import UserService from "../../../services/user/userService";
import AppConfig from "../../../../src/app.config.json";
import UserViewModel from "../../../view-model/user/userViewModel";
import crudMixin from "../../../helpers/mixins/crudMixin";
import createUserMixin from "../../../helpers/mixins/createUserMixin";
import { ROLE_ENUM } from "../../../config/constant";

export default {
  name: "UserDetail",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ crudMixin, createUserMixin ],
  data() {
    return {
      isShow: false,
      user: {},
      errorMessages: [],
      dataForCreateUser: {
        username: "",
        name: "",
        surname: "",
        emailAddress: "",
      },
      roleEnum: ROLE_ENUM,
    };
  },
  props: {
    dataUser: {
      type: Object,
      default: null,
    },
    faculties: {
      type: Array,
      default: null,
    }
  },
  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.user = {};
      if (changeData) {
        this.$emit("change-data-user");
      }
    },
    
    async createUserAsync() {
      this.user.isActive = true;
      this.showLoading();
      let api = new UserService();
      let response = await api.createUserAsync(this.user);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
      this.closeModal(true);
    },

    async updateUserAsync() {
      this.showLoading();
      let api = new UserService();
      let response = await api.updateUserAsync(this.user);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
      this.closeModal(true);
    },

    async save() {
      //validate
      this.user.userName = this.user.emailAddress;
      let viewModel = new UserViewModel();
      viewModel.setFields(this.user);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }
      this.user.roleNames = [this.user.roleNames];

      if (this.user.id === undefined) {
        await this.createUserAsync();
        return;
      }
      await this.updateUserAsync();
    },
  },
  watch: {
    dataUser() {
      this.isShow = true;
      this.user = this.dataUser;
    },
  },
};
</script>
