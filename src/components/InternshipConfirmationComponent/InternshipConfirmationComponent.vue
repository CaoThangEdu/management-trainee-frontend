<template>
  <div class="row">
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
          Xác nhận thực tập
        </header>
        <div class="card-body">
          <div class="row mb-3"></div>
          <form @submit.prevent>
            <div class="form-row p-3">
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Mã số thuế</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.taxCode"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Tên công ty</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.title"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Giám đốc</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.owner"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.companyAddress"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Website</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.website"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Cán bộ hướng dẫn</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.manager"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Số điện thoại cán bộ hướng dẫn</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.phoneNumber"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label>Các công ty đã phỏng vấn</label>
                <textarea
                  name="name-companies"
                  cols="30"
                  class="w-100"
                  v-model="keyInternshipConfirmation.companiesInterviewed"
                ></textarea>
              </div>
            </div>
          </form>
          <div class="text-center ">
            <button
              type="button"
              @click="internshipConfirmation()"
              class="btn btn-success text-center mr-1"
            >
              Xác nhận
            </button>
          </div>
          <div class="form-inline form-group col-md-12 pr-0">
            <div class="col-form-label col-md-4 col-sm-4"></div>
            <div class="col-md-12 col-sm-12 pl-0 pr-0">
              <AlertMessages :messages="errorMessages" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import ComponentBase from "../common/component-base/ComponentBase";
import IntershipConfirmationViewModel from "../../view-model/intershipconfirmation/IntershipConfirmationViewModel";
import AlertMessages from "../common/alert/alert-messages/AlertMessages";
import { mapGetters } from "vuex";
import AppConfig from "../../../src/app.config.json";
export default {
  name: "InternshipConfirmationComponent",
  extends: ComponentBase,
  components: { AlertMessages },
  data() {
    return {
      keyInternshipConfirmation: {
        studentId: "",
        taxCode: "",
        title: "",
        companyAddress: "",
        website: "",
        owner: "",
        manager: "",
        companiesInterviewed: "",
        status: "practiced",
        phoneNumber: "",
        internshipCourseId: "",
      },
      errorMessages: [],
    };
  },
  async mounted() {
    this.keyInternshipConfirmation = await this.getInternshipConfirmationAsync();
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },
  methods: {
    async pressKeyEnter() {
      await this.internshipConfirmationAsync();
    },

    async internshipConfirmation() {
      if (this.confirmed === true) {
        await this.updateInternshipConfirmationAsync();
        return;
      }
      await this.internshipConfirmationAsync();
    },

    async internshipConfirmationAsync() {
      let viewModel = new IntershipConfirmationViewModel();
      viewModel.setFields(this.keyInternshipConfirmation);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }
      this.keyInternshipConfirmation.studentId = this.userProfile.mssv;
      this.keyInternshipConfirmation.internshipCourseId = this.userProfile.internshipCourseId;
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.internshipConfirmationAsync(this.keyInternshipConfirmation);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.confirmed = true;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },

    async updateInternshipConfirmationAsync() {
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.updateInternshipConfirmationAsync(
        this.keyInternshipConfirmation
      );
      this.showLoading(false);

      if (!response.isOK) {
        return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.keyInternshipConfirmation = response.data;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
    },

    async getInternshipConfirmationAsync() {
      let filter = {
        studentId: this.userProfile.mssv,
        status: "",
      };
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.fliterInternshipConfirmationAsync(filter);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data[0];
    },
  },
};
</script>

<style lang="scss">
.form-confirmation-infomation {
  margin: 30px 180px;
}
.btn-confirmation {
  float: right;
  width: 65%;
}
</style>
