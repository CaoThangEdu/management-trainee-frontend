<template>
  <BaseModal
    @mouse-click-outside="closeModal(false)"
    :modalName="`ResetPasswordComponent`"
    :isShow="isShowResetPassword"
    size="lg"
  >
    <div class="">
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label"> Email: </label>
        <div class="col-md-8 col-sm-8">
          <input
            disabled
            type="text"
            class="form-control"
            id="email"
            v-model="user.emailAddress"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Nhập mật khẩu mới
        </label>
        <div class="col-md-8 col-sm-8">
          <input
            type="password"
            class="form-control"
            id="new-password"
            v-model="newPassword"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Nhập mật khẩu Admin
        </label>
        <div class="col-md-8 col-sm-8">
          <input
            type="password"
            class="form-control"
            id="password-admin"
            v-model="passwordAdmin"
          />
        </div>
      </div>
    </div>

    <template #header>
      <h5>Reset password</h5>
      <button class="close" style="color: red" @click="closeModal(false)">
        &times;
      </button>
    </template>

    <template #footer>
      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <AlertMessages :messages="errorMessages" />
        </div>
      </div>

      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <button
            @click="resetPassword()"
            class="btn btn-primary float-right ml-2"
          >
            Reset password
          </button>
          <button class="btn btn-dark float-right" @click="closeModal(false)">
            Hủy
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import UserService from "../../../services/user/userService";
import crudMixin from "../../../helpers/mixins/crudMixin";
import createUserMixin from "../../../helpers/mixins/createUserMixin";
import ResetPasswordViewModel from "../../../view-model/user/resetPasswordViewModel";
import AppConfig from "../../../app.config.json";

export default {
  name: "ResetPassword",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [crudMixin, createUserMixin],
  data() {
    return {
      errorMessages: [],
      passwordAdmin: "",
      newPassword: "",
      isShow: false,
      user: {},
    };
  },
  props: {
    dataUser: {
      type: Object,
      default: null,
    },
    isShowResetPassword: {
      type: Boolean,
      default: null,
    },
  },
  methods: {
    async pressKeyEnter() {
      await this.resetPassword();
    },

    closeModal(changeData) {
      this.newPassword = "";
      this.adminPassword = "";
      this.$emit("close-reset-password", changeData);
    },

    async resetPasswordAsync() {
      let keyResetPassword = {
        adminPassword: this.passwordAdmin,
        userId: this.user.id,
        newPassword: this.newPassword,
      };
      this.showLoading();
      const api = new UserService();
      const response = await api.resetPasswordAsync(keyResetPassword);
      this.showLoading(false);
      if (!response.isOK) {
        return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `Resset password thành công`
      );
      return this.closeModal(false);
    },

    async resetPassword() {
      //validate
      let checkPassword = {
        adminPassword: this.passwordAdmin,
        newPassword: this.newPassword,
      };
      let viewModel = new ResetPasswordViewModel();
      viewModel.setFields(checkPassword);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }
      await this.resetPasswordAsync();
    },
  },
  watch: {
    dataUser() {
      this.passwordAdmin = "";
      this.newPassword ="";
      this.user = this.dataUser;
    },
  },
};
</script>
