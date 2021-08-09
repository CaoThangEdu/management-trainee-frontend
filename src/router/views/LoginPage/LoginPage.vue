<template>
  <div class="d-flex content-center min-vh-100">
    <div class="row">
      <div class="col-12">
        <div class="card-group">
          <div class="card p-4">
            <div class="card-body">
              <form>
                <h1>Đăng nhập</h1>
                <p>
                  Đăng nhập tài khoản CaoThang.edu.vn của bạn
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
                      placeholder="Têm đăng nhập"
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
                  <div class="col-md-12 text-left">
                    <button 
                      @click.prevent.stop="login" 
                      class="btn px-4 btn-primary">
                      Đăng nhập
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AuthenticateService from "../../../services/authentication/authenticationServices";
import ComponentBase from "../../../components/common/component-base/ComponentBase";
// import AlertMessages from "../../components/common/alert/alert-messages/AlertMessages";
import AppConfig from "../../../app.config.json";

export default {
  name: "LoginPage",
  extends: ComponentBase,
  components: {
    // AlertMessages,
  },
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

    /**
     * Validate data login
     */
    validateLogin: function () {
      this.errorMessages = [];

      if (!this.requestInfo.username) {
        // display err
      }
      if (!this.requestInfo.password) {
        // display err
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
      } else {
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          'Đăng nhập thành công'
        );
      }

      // goto the next page
      this.$router.push({ name: 'them-ke-hoach'});
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