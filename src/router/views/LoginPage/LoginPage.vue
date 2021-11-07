<template>
  <div class="d-flex content-center min-vh-100">
    <div class="row">
      <div class="col-12">
        <div class="card-group">
          <div color="primary" text-color="white" class="card text-left p-4 d-sm-down-none bg-primary text-white" body-wrapper >
            <div class="card-body">
              <h2 class="text-center">
                Đăng ký ngay
              </h2>
              <p>
                Đây là trang web để quản lý việc thực tập và tốt nghiệp của sinh viên trường cao đẳng kỹ thuật Cao Thắng
              </p>
              <p>
                <span class="font-weight-bold">
                  Liên hệ với chúng tôi qua:
                </span>
                <br />
                website chính thức:
                <a class="text-white" href="caothang.edu.vn"
                  >caothang.edu.vn</a
                >
                <br />
                Điện thoại:
                <a class="text-white" href="tel:+84949170012">0123456789</a>
              </p>
            </div>
          </div>
          <div class="card p-4">
            <div class="card-body">
              <form>
                <h1>Đăng nhập</h1>
                <p>
                  Đăng nhập tài khoản caothang.edu.vn của bạn
                </p>
                <div role="group" class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <CIcon name="cil-user" />
                      </span>
                    </div>
                    <input
                      id="username"
                      type="text"
                      placeholder="Tên đăng nhập"
                      autocomplete="username email"
                      class="form-control"
                      v-model.trim="requestInfo.username"
                    />
                  </div>
                </div>

                <div role="group" class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <CIcon name="cil-lock-locked" />
                      </span>
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Mật khẩu"
                      autocomplete="username password"
                      class="form-control"
                      v-model="requestInfo.password"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <button 
                      @click.prevent.stop="login" 
                      class="btn px-4 btn-primary">
                      Đăng nhập
                    </button>
                  </div>
                </div>
                <div class="col-12 pl-0 pr-0">
                  <AlertMessages :messages="errorMessages" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AuthenticateService from "../../../services/authentication/authenticationServices";
import ComponentBase from "../../../components/common/component-base/ComponentBase";
import AlertMessages from "../../../components/common/alert/alert-messages/AlertMessages";
import AppConfig from "../../../app.config.json";
import localStorageMixin from "../../../helpers/mixins/localStorageMixin";

export default {
  name: "LoginPage",
  extends: ComponentBase,
  components: {
    AlertMessages,
  },
  mixins: [ localStorageMixin ],
  data() {
    return {
      requestInfo: {
        username: "",
        password: "",
      },
      errorMessages: [],
    };
  },
  created() {
    let token = localStorage.getItem('AUTH_TOKEN');
    let tokenKey = JSON.parse(token);
    if (!tokenKey) return;
    this.$router.push({ name: 'them-ke-hoach'});
  },

  methods: {
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync", "setTokenInfoData"]),

    // Validate data login
    validateLogin () {
      this.errorMessages = [];

      if (!this.requestInfo.username) {
        this.errorMessages.push('Vui lòng nhập tên đăng nhập')
      }
      if (!this.requestInfo.password) {
        this.errorMessages.push('Vui lòng nhập mật khẩu')
      }
    },

    /**
     * Handle event click login
     */
    async login() {
      this.validateLogin();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.requestInfo.username !='admin'
        && !this.requestInfo.username.includes("@caothang.edu.vn")) {
        this.requestInfo.username = this.requestInfo.username + "@caothang.edu.vn";
      }

      this.showLoading();
      let _loginApi = new AuthenticateService();
      let response = await _loginApi.loginAsync(this.requestInfo);
      this.showLoading(false);
      // failed login
      if (!response || !response.isOK) {
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
        'Đăng nhập thành công'
      );
      let roles =
        localStorageMixin.methods.parseJwt(response.data.accessToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      // goto the next page
      if (roles) {
        if (roles.toUpperCase() == 'ADMIN') {
          this.$router.push({ name: 'them-ke-hoach'});
          return;
        }
        if (roles.toUpperCase() == 'STUDENT') {
          this.$router.push({ name: 'trang-chu-sinh-vien'});
          return;
        }
      }
      
      this.$router.push({ name: 'trang-chu'});
    },
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
  },
};
</script>

<style>
.content-center {
  width: 60%;
  margin: 0 auto;
}
</style>