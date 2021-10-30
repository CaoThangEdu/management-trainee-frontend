<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <header class="card-header">Chi tiết thông báo</header>
        <div class="card-body"
          v-if="userProfile.user">
          <div class="form-row">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <label>Tiêu đề thông báo: </label>
              {{notify.title}}                
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12">
              <label>Nội dung thông báo: </label>
              {{notify.content}}                
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ComponentBase from "../../common/component-base/ComponentBase.vue";
import AppConfig from "../../../app.config.json";
import NotificationService from "../../../services/notification/notificationServices";
import ReceiverService from "../../../services/receiver/receiverService";

export default {
  name: "NotifyOfUser",
  extends: ComponentBase,
  props: {
    guid: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      notificationsOfUser: [],
      notify: {},
    }
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
    async getUserProfile() {
      // Check: if has token => get profile else push to LoginPage
      if (this.tokenKey) {
        if (!this.userProfile || !this.userProfile.user) {
          await this.updateUserInfoDataAsync();
        }
      } else {
        if (this.$route.name !== "login") {
          this.$router.push({ name: "login" });
        }
      }
    },
    async getNotifyByEmail() {
      // Call Api
      this.showLoading();
      const api = new NotificationService();

      const response = await api.getNotifyByEmail(this.userProfile?.user?.emailAddress);
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

    async sendNotify() {
      // Call Api
      this.showLoading();
      const api = new ReceiverService();

      const response = await api.updateStatusWatchedWhenUserClickView({
        notificationId: this.guid,
        email: this.userProfile?.user?.emailAddress,
      });
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
    },
  },

  async beforeRouteUpdate(to, from, next) {
    this.$route.params.name = to.params.name
    next();
    await this.sendNotify();
    this.notify = this.notificationsOfUser.find(noti => noti.id == this.guid);
  },

  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }
    await this.sendNotify();
    await this.getNotifyByEmail();
    this.notify = this.notificationsOfUser.find(noti => noti.id == this.guid);
  },
};
</script>

<style>
</style>