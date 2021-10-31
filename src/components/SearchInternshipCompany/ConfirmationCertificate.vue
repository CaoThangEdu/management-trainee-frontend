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
          {{ keyCompany.title }} - Mã số thuế: {{ keyCompany.taxCode }} ?
        </h5>
      </div>
    </div>
    <template #header>
      <h5>Xác nhận đăng ký giấy giới thiệu thực tập</h5>
      <button class="close" style="color: red;" @click="closeModal()">
        &times;
      </button>
    </template>
    <template #footer>
      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0"></div>
      </div>

      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <button
            @click="createCertificateAsync()"
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
import CrudMixin from "../../helpers/mixins/crudMixin"
export default {
  name: "ConfirmationCertificate",
  extends: ComponentBase,
  components: {
    BaseModal,
  },
  mixins:[CrudMixin],
  props: {
    isShow: Boolean,
    keyCompany: Object,
    userProfile: Object,
  },
  data() {
    return {
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
      companiesByTaxCode:{}
    };
  },
  async mounted(){
    this.companiesByTaxCode = await this.getCompaniesAsync();
  },

  methods: {
    closeModal() {
      this.$emit("closeModal", false);
    },
    async createCertificateAsync() {
      this.certificate.mssv = this.userProfile.mssv;
      this.certificate.classId = this.userProfile.classId;
      this.certificate.taxCode = this.keyCompany.taxCode;
      this.certificate.companyName = this.keyCompany.title;
      this.certificate.companyAddress = this.keyCompany.companyAddress;
      this.certificate.owner = this.keyCompany.owner;
      this.certificate.phoneNumber = this.keyCompany.phoneNumberOfCompany;
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
        `${AppConfig.notification.content_created_success_default}`
      );
      await this.createCompanyAsync();
      this.closeModal();
    },

    async getCompaniesAsync(){
      const filterCompany = {
        keyword:"",
        status:""
      };
      // Call Api
      this.showLoading();
      const api = new CompanyService()

      const response = await api.getCompaniesAsync(filterCompany)
      this.showLoading(false);

      if(!response.isOK){
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

      const response = await api.getCompanieByTaxCodeAsync(this.keyCompany.taxCode);
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
      if(this.companiesByTaxCode[company.taxCode] !== undefined) return;
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
