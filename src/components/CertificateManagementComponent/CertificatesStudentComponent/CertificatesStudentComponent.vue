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
          <span>Đăng ký giấy giới thiệu thực tập</span>
        </header>
        <div class="card-body">
          <step-progress
            v-if="isCertificate"
            :steps="mySteps"
            :current-step="currentStep"
            active-color="green"
            icon-class="fa fa-check"></step-progress>
          <hr class="" style="margin:50px 0 50px 0;"
            v-if="isCertificate">
          <div class="">
            <div class="form-group row">
              <label class="col-md-2 col-sm-4 col-form-label">
                Mã số thuế (<span class="text--red">*</span>)
              </label>
              <div class="col-md-8 col-sm-8 pr-0">
                <input
                  type="text"
                  class="form-control"
                  v-model="certificate.taxCode"
                />
              </div>
              <div class="col-md-2 col-sm-8 pl-0">
                <button
                  @click="checkCompany()"
                  class="btn btn-primary float-right ml-2"
                >
                  Kiểm tra
                </button>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-2 col-sm-4 col-form-label"
                >Tên công ty
              </label>
              <div class="col-md-10 col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="certificate.companyName"
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-2 col-sm-4 col-form-label"
                >Chủ sở hữu
              </label>
              <div class="col-md-10 col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="certificate.owner"
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-2 col-sm-4 col-form-label">Địa chỉ</label>
              <div class="col-md-10 col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="certificate.companyAddress"
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-2 col-sm-4 col-form-label"
                >Số điện thoại công ty</label
              >
              <div class="col-md-10 col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="certificate.phoneNumberOfCompany"
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-2 col-sm-4 col-form-label">Ngành nghề</label>
              <div class="col-md-10 col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="certificate.career"
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-2 col-sm-4 col-form-label"
                >Số điện thoại sinh viên</label
              >
              <div class="col-md-10 col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="certificate.phoneNumberOfStudent"
                />
              </div>
            </div>
          </div>
          <hr />
          <div class="button text-center my-3">
            <button
              @click="save()"
              class="btn btn-success w-25"
            >
              {{ !isRegistered ? "Đăng ký" : "Cập nhật" }}
            </button>
          </div>
          <div class="col-md-12 col-sm-12">
            <AlertMessages :messages="errorMessages" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import AppConfig from "../../../../src/app.config.json";
import CertificateViewModel from "../../../view-model/Certificate/CertificateViewModel";
import CertificateService from "../../../services/certificate/CertificateServices";
import CompanyService from "../../../services/company/companyServices";
import { mapGetters, mapActions } from "vuex";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import StepProgress from 'vue-step-progress';
import 'vue-step-progress/dist/main.css';
export default {
  name: "CertificateComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    'step-progress': StepProgress
  },
  mixins: [CrudMixin],
  data() {
    return {
      isShow: false,
      errorMessages: [],
      companiesByTaxCode: {},
      certificate: {
        taxCode: "",
        companyName: "",
        companyAddress: "",
        owner: "",
        phoneNumberOfCompany: "",
        phoneNumberOfStudent: "",
        career: "",
        status: "unconfirmed", //confirmed, unconfirmed, complete
        mssv: "",
        classId: "",
      },
      company: {},
      isCompanyConfirmation: false,
      isRegistered: false,
      mySteps:['Đang chờ duyệt', 'Đã duyệt', 'Hoàn thành'],
      currentStep:1,
      isCertificate: false,
    };
  },

  async mounted() {
    await this.getCompaniesAsync();
    let certificate = await this.getCertificateAsync(this.userProfile);
    if (certificate.length !== 0) {
      this.isCertificate = true;
      this.certificate = certificate[0];
      this.isRegistered = true;
      if(this.certificate.status === "confirmed"){
         this.currentStep = 2;
      }
      if(this.certificate.status === "complete"){
        this.currentStep = 3;
      }
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
    async getCertificateAsync(user) {
      let filterCerticate = {
        internshipCourseId: user.internshipCourseId,
        status: "",
        studentCode: user.mssv,
        classId: user.classId,
      };
      // Call Api
      this.showLoading();
      const api = new CertificateService();

      const response = await api.getCertificatesAsync(filterCerticate);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data;
    },
    // },
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),
    async pressKeyEnter() {
      await this.save();
    },

    async createCertificateAsync() {
      if (this.isCompanyConfirmation === true) {
        this.company.taxCode = this.certificate.taxCode;
        this.company.title = this.certificate.companyName;
        this.company.companyAddress = this.certificate.companyAddress;
        this.company.owner = this.certificate.owner;
        this.company.phoneNumber = this.certificate.phoneNumberOfCompany;
        this.company.career = this.certificate.career;
        this.company.status = "active";
        await this.createCompanyAsync(this.company);
      }
      this.certificate.classId = this.userProfile.classId;
      this.certificate.mssv = this.userProfile.mssv;
      this.showLoading();
      let api = new CertificateService();
      let response = await api.createCertificateAsync(this.certificate);
      this.showLoading(false);
      if (!response.isOK) {
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
        `${AppConfig.notification.content_created_success_default}`
      );
      this.isCompanyConfirmation = false;
      this.isRegistered = true;
    },

    async updateCertificateAsync() {
      this.showLoading();
      let api = new CertificateService();
      let response = await api.updateCertificateAsync(this.certificate);
      this.showLoading(false);

      if (!response.isOK) {
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
        `${AppConfig.notification.content_updated_success_default}`
      );
    },

    async save() {
      // validate
      let viewModel = new CertificateViewModel();
      viewModel.setFields(this.certificate);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (!this.isRegistered) {
        //create
        await this.createCertificateAsync(this.userProfile);
      } else {
        //update
        await this.updateCertificateAsync();
      }
    },

    async getCompaniesAsync() {
      // Call Api
      this.showLoading();
      const api = new CompanyService();

      const response = await api.getAllCompaniesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      if (response.data !== undefined || response.data.items.length !== 0) {
        let companies = CrudMixin.methods.convertArrayToObject(
          response.data.items,
          "taxCode"
        );
        this.companiesByTaxCode = companies;
      }
    },

    async getCompanieByTaxCodeAsync(taxCode) {
      // Call Api
      this.showLoading();
      const api = new CompanyService();
      const response = await api.getCompanieByTaxCodeAsync(taxCode);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data;
    },

    async checkCompany() {
      if (this.companiesByTaxCode[this.certificate.taxCode] !== undefined) {
        this.certificate.companyName =
          this.companiesByTaxCode[this.certificate.taxCode].title;
        this.certificate.owner =
          this.companiesByTaxCode[this.certificate.taxCode].owner;
        this.certificate.companyAddress =
          this.companiesByTaxCode[this.certificate.taxCode].companyAddress;
        this.certificate.phoneNumberOfCompany =
          this.companiesByTaxCode[this.certificate.taxCode].phoneNumber;
        this.certificate.career =
          this.companiesByTaxCode[this.certificate.taxCode].career;
        return;
      }

      let company = await this.getCompanieByTaxCodeAsync(
        this.certificate.taxCode
      );
      if (
        company.taxCode !== null ||
        company.title !== null ||
        company.owner !== null ||
        company.companyAddress !== null
      ) {
        this.certificate.companyName = company.title;
        this.certificate.owner = company.owner;
        this.certificate.companyAddress = company.companyAddress;
        this.certificate.phoneNumberOfCompany = company.phoneNumber;
        this.certificate.career = company.career;
        this.isCompanyConfirmation = true;
        return;
      }

      return this.showNotifications(
        "error",
        `${AppConfig.notification.title_default}`,
        "Không tìm thấy công ty vui lòng nhập thông tin công ty!"
      );
    },

    async createCompanyAsync(company) {
      if (this.companiesByTaxCode[company.taxCode] !== undefined) {
        return;
      }
      this.showLoading();
      let api = new CompanyService();
      let response = await api.createCompanyAsync(company);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.$emit("changeCompanies", response.data);
    },
  },
};
</script>

<style lang="scss">
.not-active {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
}
.form-select-class-size {
  width: 100%;
  height: 28px;
  padding: 0px 5px;
}

</style>
