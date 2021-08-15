<template src='./CertificateDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import AppConfig from '../../../../src/app.config.json'
import CertificateViewModel from "../../../view-model/Certificate/CertificateViewModel"
import CertificateService from '../../../services/certificate/CertificateServices'
import CompanyService from '../../../services/company/companyServices'

export default {
  name: 'CertificateDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      errorMessages: [],
      companiesByTaxCode:{},
      certificate:{
        taxCode: "0313041477",
        companyName: "Công Ty TNHH Một Thành Viên Phần Mềm Ebk",
        companyAddress:"L11 - L12 Miếu Nổi - Quận Bình Thạnh - TP Hồ Chí Minh",
        owner:"Ngô Đình Minh Đức",
        phoneNumberOfCompany: "094552446",
        phoneNumberOfStudent: "01234567890",
        status: 'unconfirmed', //confirmed, unconfirmed, complete
        studentId: "c41ed77c-10e5-4aef-1e78-08d95f740042",
        isDelete: false
      },
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
  },

  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData, certificate) {
      this.isShow = false;
      this.certificate = {};

      if (changeData) {
        this.$emit("change-data", certificate);
      }
    },

    async createCertificateAsync() {
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
      this.closeModal(true, response.data);
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

        this.closeModal(true, response.data);
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

      const response = await api.getCompaniesAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      let companies = response.data.items;
      if(companies.length !== 0 || companies !== undefined){
        companies = companies.reduce((map, obj) => (map[obj.taxCode] = obj, map), {});
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
        return ;
      }
      

      let company = await this.getCompanieByTaxCodeAsync(this.certificate.taxCode);
      if(Object.keys(company).length !== 0){
      this.certificate.companyName = company.title;
      this.certificate.owner = company.owner;
      this.certificate.companyAddress = company.companyAddress;
      this.certificate.phoneNumberOfCompany = company.phoneNumber;
      return;
      }
      return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Không tìm thấy công ty vui lòng nhập thông tin công ty!"
        );
    }
  },
  watch: {
    data() {
      this.isShow = true;
      if(Object.keys(this.data).length !== 0)
      this.certificate = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './CertificateDetailComponent.scss';
</style>
