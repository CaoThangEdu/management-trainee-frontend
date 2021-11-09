<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <header class="card-header">Đổi mật khẩu</header>
        <div class="card-body">
          <div class="form-group row"
            v-if="userProfile.user">
            <label class="col-form-label col-md-12 col-lg-3 col-xl-3 text-lg-right">
              Email:
            </label>
            <div class="col-md-12 col-lg-6 col-xl-6">
              <input type="text" class="form-control" id="email"
                v-model="userProfile.user.emailAddress"
                readonly>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-md-12 col-lg-3 col-xl-3 text-lg-right">
              Mật khẩu cũ (<span class="text--red">*</span>):
            </label>
            <div class="col-md-12 col-lg-6 col-xl-6">
              <input type="password" class="form-control" id="password"
                v-model="passwordInfo.oldPassword">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-md-12 col-lg-3 col-xl-3 text-lg-right">
              Mật khẩu mới (<span class="text--red">*</span>):
              </label>
            <div class="col-md-12 col-lg-6 col-xl-6">
              <input type="password" class="form-control" id="newPassword"
                v-model="passwordInfo.newPassword">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-md-12 col-lg-3 col-xl-3 text-lg-right">
              Xác nhận mật khẩu mới (<span class="text--red">*</span>):
              </label>
            <div class="col-md-12 col-lg-6 col-xl-6">
              <input type="password" class="form-control" id="confirmNewPassword"
                v-model="passwordInfo.confirmNewPassword">
            </div>
          </div>
          <div class="form-group form-row">
            <label for="" class="col-form-label col-md-12 col-lg-3 col-xl-3">&nbsp;</label>
            <div class="col-md-12 col-lg-6 col-xl-6">
              <button id="btn-cancel" class="btn btn-dark"
                @click="$router.go(-1)">Hủy</button>
              <button id="btn-reset" class="btn btn-primary ml-2 mr-2"
                @click="resetForm()">Làm lại</button>
              <button btn="btn-edit" class="btn btn-success"
                @click="changePassword()">Đổi mật khẩu</button>
            </div>
          </div>
          <div class="form-group form-row">
            <label for="" class="col-form-label col-md-12 col-lg-3 col-xl-3"
              >&nbsp;</label
            >
            <div class="col-md-12 col-lg-6 col-xl-6">
              <div class="show-messages" style="display: none">
                <div role="alert" class="alert alert-danger mt-2 text-left">
                  <button type="button" aria-label="Close" class="close">
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div class="col-12">
              <AlertMessages :messages="errorMessages"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ChangePasswordViewModel from "../../../view-model/user/changePasswordViewModel";
import UserService from "../../../services/user/userService";
import AppConfig from "../../../app.config.json";
import AlertMessages from "../../../components/common/alert/alert-messages/AlertMessages.vue";
import ComponentBase from "../../../components/common/component-base/ComponentBase.vue";

export default {
  name: "ChangePassword",
  extends: ComponentBase,
  components: {
    AlertMessages,
  },
  data() {
    return {
      passwordInfo: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      errorMessages: [],
    };
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },

  methods: {
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),

    resetForm() {
      this.passwordInfo.oldPassword = "";
      this.passwordInfo.newPassword = "";
      this.passwordInfo.confirmNewPassword = "";
    },

    async getUserProfile() {
      // Check: if has token => get profile else push to LoginPage
      if (this.tokenKey) {
        if (!this.userProfile || !this.userProfile.id) {
          await this.updateUserInfoDataAsync();
        }
      } else {
        if (this.$route.name !== "login") {
          this.$router.push({ name: "login" });
        }
      }
    },

    async changePassword() {
      let validateChangePass = new ChangePasswordViewModel();
      validateChangePass.setFields(this.passwordInfo);
      this.errorMessages = validateChangePass.isValid();

      // Call Api
      if (this.errorMessages.length > 0) {
        return;
      }

      this.showLoading();
      let profileApi = new UserService();
      let resultChangePass = await profileApi.changePasswordAsync({
        currentPassword: this.passwordInfo.oldPassword,
        newPassword: this.passwordInfo.newPassword,
      });
      this.showLoading(false);

      if (!resultChangePass.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          resultChangePass.errorMessages
        );
        return;
      }
      this.resetForm();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        "Đổi mật khẩu thành công"
      );
    },
  },

  async mounted() {
    if (this.userProfile) return;
    await this.getUserProfile();
  },
};
</script>

<style>
</style>