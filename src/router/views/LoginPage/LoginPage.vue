<template>
  <div class="min-vh-100">
    <div class="row">
      <div class="col-12">
        <div class="card-group">
          <div class="card p-4">
            <div class="card-body">
              <form>
                <h1>Đăng nhập</h1>

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
                      placeholder="username"
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
                      placeholder="Password"
                      autocomplete="username password"
                      class="form-control"
                      v-model="requestInfo.password"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12 text-left">
                    <button @click.prevent.stop="login" class="btn px-4 btn-primary">
                      Đăng nhập
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div color="primary" text-color="white" class="card text-left p-4 d-sm-down-none bg-primary text-white" body-wrapper >
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

      // // UserName and Password valid
      // // Call api login
      // this.showLoading();
      let _loginApi = new AuthenticateService();
      let response = await _loginApi.loginAsync(this.requestInfo);

      // failed login
      if (!response || !response.isOK) {
        this.showLoading(false);
        return;
      }

      // goto the next page
      this.$router.push({ name: 'len-ke-hoach'});
    },
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
  },
};
</script>
