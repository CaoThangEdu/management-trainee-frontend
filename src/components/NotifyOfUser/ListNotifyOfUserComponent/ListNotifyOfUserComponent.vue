<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <header class="card-header">Danh sách thông báo</header>
        <div class="card-body notify-component"
          v-if="userProfile.user">
          <div class="notice"
            v-for="(notify, index) in notificationsOfUser"
            :key="index + 'noti'"
            :class="{'info': notify.watched, 'warning': !notify.watched}">
            <router-link
              :to="{name:'thong-bao-cua-tai-khoan', params: { guid: notify.id } }"
              title="Chi tiết thông báo">
              {{ notify.title }}
            </router-link>
            <p>
              Được gửi từ {{ notify.userCreate }}
            </p>
            <p>
              <em class="far fa-clock"></em> {{ convertTime(notify.creationTime, "HH:mm DD/MM/YYYY") }}
            </p>
            <p>
              Trạng thái: {{ notify.watched?'Đã xem':'Chưa xem' }}
            </p>
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
import crudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "NotifyOfUser",
  extends: ComponentBase,
  data() {
    return {
      notificationsOfUser: [],
    }
  },
  mixins: [crudMixin],
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
  },

  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }
    await this.getNotifyByEmail();
  },
};
</script>