<template src='./CertificateDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import AppConfig from '../../../../src/app.config.json'
import CertificateViewModel from "../../../view-model/Certificate/CertificateViewModel"
import CertificateService from '../../../services/certificate/CertificateServices'
import CompanyService from '../../../services/company/companyServices';
import { mapGetters, mapActions } from "vuex";
import CrudMixin from "../../../helpers/mixins/crudMixin"

export default {
  name: 'CertificateDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins:[CrudMixin],
  data() {
    return {
      isShow: false,
      errorMessages: [],
      companiesByTaxCode:{},
      certificate:{
        taxCode: "",
        companyName: "",
        companyAddress:"",
        owner:"",
        phoneNumberOfCompany: "",
        phoneNumberOfStudent: "",
        career:"",
        status: 'unconfirmed', //confirmed, unconfirmed, complete
        mssv: "",
        classId:"",
      },
      company:{},
      isCompanyConfirmation: false,
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  async mounted(){
    await this.getCompaniesAsync();
    if (!this.userProfile) {
      await this.getUserProfile();
    }
    this.certificate.mssv = this.userProfile.mssv;
    this.certificate.classId = this.userProfile.classId;
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },

  methods: {
    async getUserProfile() {
      if (this.tokenKey) {
        if (!this.userProfile || !this.userProfile.id) {
          await this.updateUserInfoDataAsync();
        }
      }
    },
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData, certificate, action) {
      this.isShow = false;
      if (changeData) {
        this.$emit("change-data", certificate, action);
      }
    },

    async createCertificateAsync() {
      if(this.isCompanyConfirmation === true){
        this.company.taxCode = this.certificate.taxCode;
        this.company.title = this.certificate.companyName;
        this.company.companyAddress = this.certificate.companyAddress;
        this.company.owner = this.certificate.owner;
        this.company.phoneNumber = this.certificate.phoneNumberOfCompany;
        this.company.career = this.certificate.career;
        this.company.status = "active";
        await this.createCompanyAsync(this.company);
      }
      this.showLoading();
      let api = new CertificateService();
      let response = await api.createCertificateAsync(this.certificate);
      this.showLoading(false);
      if(!response.isOK){
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
      this.closeModal(true, response.data, 'create');
    },

    async updateCertificateAsync() {
      this.showLoading();
      let api = new CertificateService();
      let response = await api.updateCertificateAsync(this.certificate);
      this.showLoading(false);

      if(!response.isOK){
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

        this.closeModal(true, response.data, 'update');
    },

    async save() {
      // validate
      let viewModel = new CertificateViewModel();
      viewModel.setFields(this.certificate);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.certificate.id === undefined) {
        //create
        await this.createCertificateAsync();
      } else {        
        //update
        await this.updateCertificateAsync();
      }
    },

    async getCompaniesAsync(){
      // Call Api
      this.showLoading();
      const api = new CompanyService()

      const response = await api.getAllCompaniesAsync();
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      if(response.data !== undefined || response.data.items.length !== 0){
        let companies = CrudMixin.methods.convertArrayToObject(response.data.items, "taxCode");
        this.companiesByTaxCode = companies;
      }
    },

    async getCompanieByTaxCodeAsync(taxCode){
      // Call Api
      this.showLoading();
      const api = new CompanyService()
      const response = await api.getCompanieByTaxCodeAsync(taxCode)
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
     return response.data;
    },

    async checkCompany(){
      if(this.companiesByTaxCode[this.certificate.taxCode] !== undefined){
        this.certificate.companyName = this.companiesByTaxCode[this.certificate.taxCode].title;
        this.certificate.owner = this.companiesByTaxCode[this.certificate.taxCode].owner;
        this.certificate.companyAddress = this.companiesByTaxCode[this.certificate.taxCode].companyAddress;
        this.certificate.phoneNumberOfCompany = this.companiesByTaxCode[this.certificate.taxCode].phoneNumber;
        this.certificate.career = this.companiesByTaxCode[this.certificate.taxCode].career;
        return ;
      }
      
      let company = await this.getCompanieByTaxCodeAsync(this.certificate.taxCode);
      if(company.taxCode !== null || company.title !== null 
      || company.owner !== null || company.companyAddress !== null){
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
      if(this.companiesByTaxCode[company.taxCode] !== undefined){
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
      this.$emit("changeCompanies",response.data );
    },
  },
  watch: {
    data() {
      this.isShow = true;
      if(Object.keys(this.data).length !== 0){
        this.certificate = this.data;
        return;
      }
      this.certificate = {
        taxCode: "",
        companyName: "",
        companyAddress:"",
        owner:"",
        phoneNumberOfCompany: "",
        phoneNumberOfStudent: "",
        status: 'unconfirmed', //confirmed, unconfirmed, complete
        mssv : this.userProfile.mssv,
        classId : this.userProfile.classId
        };
    }
  }
}
</script>

<style lang='scss'>
@import './CertificateDetailComponent.scss';
</style>
