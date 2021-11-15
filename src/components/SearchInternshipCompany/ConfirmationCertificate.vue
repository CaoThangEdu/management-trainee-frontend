<template>
  <BaseModal
    @mouse-click-outside="closeModal()"
    :modalName="`ConfirmationCertificate`"
    :isShow="isShow"
    size="lg"
  >
    <div class="">
      <div class="form-group px-5">
        <h5>
          Bạn chắc chắn muốn đăng ký giấy giới thiệu thực tập công ty:
          {{ keyCompany.title }} - Mã số thuế: {{ keyCompany.taxCode }} ?<br />
        </h5>
        Vui lòng nhập số điện thoại của bạn nếu đồng ý:
        <input type="text" v-model="certificate.phoneNumberOfStudent" />
      </div>
    </div>
    <template #header>
      <h5>Xác nhận đăng ký giấy giới thiệu thực tập</h5>
      <button class="close" style="color: red" @click="closeModal()">
        &times;
      </button>
    </template>
    <template #footer>
      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-md-12 col-sm-12 pl-0 pr-0">
          <AlertMessages :messages="errorMessages" />
        </div>
      </div>
      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <button
            @click="save()"
            class="btn btn-primary float-right ml-2"
          >
            Đăng ký
          </button>
          <button class="btn btn-dark float-right" @click="closeModal()">
            Hủy
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
<script>
import ComponentBase from "../common/component-base/ComponentBase";
import BaseModal from "../../components/common/base-modal/BaseModal.vue";
import CertificateService from "../../services/certificate/CertificateServices";
import AppConfig from "../../../src/app.config.json";
import CompanyService from "../../services/company/companyServices";
import CrudMixin from "../../helpers/mixins/crudMixin";
import AlertMessages from "../common/alert/alert-messages/AlertMessages";
export default {
  name: "ConfirmationCertificate",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [CrudMixin],
  props: {
    isShow: Boolean,
    keyCompany: Object,
    student: Object,
  },
  data() {
    return {
      errorMessages: [],
      certificate: {
        taxCode: "",
        companyName: "",
        companyAddress: "",
        owner: "",
        phoneNumberOfCompany: "",
        phoneNumberOfStudent: "",
        career: "",
        status: "unconfirmed",
        mssv: "",
        classId: "",
      },
      companiesByTaxCode: {},
      isRegistered:false
    };
  },
  async mounted() {
    this.companiesByTaxCode = await this.getCompaniesAsync();
     let certificate = await this.getCertificateAsync(this.student);
      if (certificate.length !== 0) {
      this.certificate = certificate[0];
      this.isRegistered = true;
    }
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

    closeModal() {
      this.$emit("closeModal", false);
    },
    async createCertificateAsync() {
      if (this.certificate.phoneNumberOfStudent === "") {
        return this.errorMessages.push(
          "Vui lòng nhập <span>Số điện thoại của bạn</span>."
        );
      }
      this.certificate.mssv = this.student.mssv;
      this.certificate.classId = this.student.classId;
      this.certificate.taxCode = this.keyCompany.taxCode;
      this.certificate.companyName = this.keyCompany.title;
      this.certificate.companyAddress = this.keyCompany.companyAddress;
      this.certificate.owner = this.keyCompany.owner;
      this.certificate.phoneNumberOfCompany = this.keyCompany.phoneNumber;
      this.certificate.career = this.keyCompany.career;
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
        `Đăng ký thành công`
      );
      this.errorMessages = [];
      await this.createCompanyAsync();
      this.closeModal();
    },

    async updateCertificateAsync() {
      this.certificate.mssv = this.student.mssv;
      this.certificate.classId = this.student.classId;
      this.certificate.taxCode = this.keyCompany.taxCode;
      this.certificate.companyName = this.keyCompany.title;
      this.certificate.companyAddress = this.keyCompany.companyAddress;
      this.certificate.owner = this.keyCompany.owner;
      this.certificate.phoneNumberOfCompany = this.keyCompany.phoneNumber;
      this.certificate.career = this.keyCompany.career;
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
      this.closeModal();
    },

    async save() {
      if (!this.isRegistered) {
        //create
        await this.createCertificateAsync(this.student);
      } else {
        //update
        await this.updateCertificateAsync();
      }
    },

    async getCompaniesAsync() {
      const filterCompany = {
        keyword: "",
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new CompanyService();

      const response = await api.getCompaniesAsync(filterCompany);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return CrudMixin.methods.convertArrayToObject(response.data, "taxCode");
    },

    async getCompanieByTaxCodeAsync() {
      // Call Api
      this.showLoading();
      const api = new CompanyService();

      const response = await api.getCompanieByTaxCodeAsync(
        this.keyCompany.taxCode
      );
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      return response.data;
    },

    async createCompanyAsync() {
      let company = await this.getCompanieByTaxCodeAsync();
      if (
        company == null ||
        this.companiesByTaxCode[company.taxCode] !== undefined
      )
        return;
      company.status = "active";
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
      }
    },
  },
};
</script>
