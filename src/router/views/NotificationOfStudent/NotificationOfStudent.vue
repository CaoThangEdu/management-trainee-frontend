<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <TimeLineComponent
            :userInfo="userInfo" />
        </div>
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <NotifyComponent
            :userInfo="userInfo" />
        </div>
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <SearchInternshipCompany/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeLineComponent from "../../../components/NotificationOfStudentComponent/TimeLineComponent/TimeLineComponent.vue";
import NotifyComponent from "../../../components/NotificationOfStudentComponent/NotifyComponent/NotifyComponent.vue";
import SearchInternshipCompany from "../../../components/SearchInternshipCompany/SearchInternshipCompany.vue"
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NotificationOfStudent",
  components: {
    TimeLineComponent,
    NotifyComponent,
    SearchInternshipCompany
  },
  data() {
    return {
      userInfo: {},
    }
  },

  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }    
    this.userInfo = this.userProfile;
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
  },
};
</script>

<style>
</style>