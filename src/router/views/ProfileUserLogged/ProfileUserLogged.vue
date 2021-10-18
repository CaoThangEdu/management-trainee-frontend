<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <header class="card-header">Thông tin cá nhân</header>
        <div class="card-body"
            v-if="userProfile.user">
            <div class="form-row">
                <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Email: </label>
                    {{userProfile.user.emailAddress}}                
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Họ và tên: </label>
                    {{userProfile.fullName}}                
                </div>
            </div>
            <div class="form-row"
                v-if="userProfile.className">
                <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Lớp: </label>
                    {{userProfile.className}}                
                </div>
            </div>
            <div class="form-row"
                v-if="userProfile.internshipCourseName">
                <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Đợt thực tập: </label>
                    {{userProfile.internshipCourseName}}                
                </div>
            </div>
            <div class="form-row"
                v-if="userProfile.instructorName">
                <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Giáo viên hướng dẫn thực tập: </label>
                    {{userProfile.instructorName}}                
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ComponentBase from "../../../components/common/component-base/ComponentBase.vue";

export default {
  name: "ProfileUserLogged",
  extends: ComponentBase,
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

  async mounted() {
    if (this.userProfile) return;
    await this.getUserProfile();
  },
};
</script>

<style>
</style>