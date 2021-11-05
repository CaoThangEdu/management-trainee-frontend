<template>
  <div class="row notify-component">
    <div class="col-12">
      <div class="card">
        <header class="card-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            role="img"
            class="c-icon"
          >
            <path
              fill="var(--ci-primary-color, currentColor)"
              d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
              class="ci-primary"
            ></path>
          </svg>
          Thông báo
        </header>
        <div class="card-body">
          <div class="wrapper">
            <div class="steps" id="steps">
              <div class="font-weight-bolder">
                Không có dữ liệu được tìm thấy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import AppConfig from "../../../app.config.json";
import NotificationService from "../../../services/notification/notificationServices";

export default {
  name: "NotifyComponent",
  extends: ComponentBase,
  props: {
    userInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      userInfoProp: {},
      notificationsOfUser: [],
    };
  },

  methods: {
    async getNotifyByEmail() {
      // Call Api
      this.showLoading();
      const api = new NotificationService();

      const response = await api.getNotifyByEmail(this.userInfoProp?.user?.emailAddress);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.notificationsOfUser = response.data;
    },
  },

  watch: {
    async userInfo() {
      this.userInfoProp = this.userInfo;
      await this.getNotifyByEmail();
    },
  },
};
</script>

<style>
</style>