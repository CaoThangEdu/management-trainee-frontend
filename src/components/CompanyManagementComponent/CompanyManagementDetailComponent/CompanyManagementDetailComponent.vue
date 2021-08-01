<template src='./CompanyManagementDetailComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import CompanyService from "../../../services/company/companyServices";
import AppConfig from "../../../../src/app.config.json";
import CompanyViewModel from "../../../view-model/company/companyViewModel";
export default {
  name: "CompanyDetail",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
 data() {
    return {
      isShow: false,
      company: {},
      errorMessages: [],
      isConfirmed:true,
      companiesByTaxCode:{}
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  mounted(){
    this.getCompaniesAsync();
  },

  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.company = {};

      if (changeData) {
        this.$emit("change-data");
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
      let companies = response.data.items
      companies = companies.reduce((map, obj) => (map[obj.taxCode] = obj, map), {});
      this.companiesByTaxCode = companies;
    },

    async getCompanieByTaxCodeAsync(){
      // Call Api
      this.showLoading();
      const api = new CompanyService()

      const response = await api.getCompanieByTaxCodeAsync(this.company.taxCode);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data
    },

    async checkCompany(){

      let company = await this.getCompanieByTaxCodeAsync();
      if(!company){
        this.isConfirmed = false;
         return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Không tìm thấy công ty vui lòng nhập thông tin công ty!"
        );
       
      }
        return this.company = company;
      
    },

    async createCompanyAsync() {
      if(this.companiesByTaxCode[this.company.taxCode]){
          return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Công ty đã tồn tại trong danh sách!"
        );
      }
      this.showLoading();
      let api = new CompanyService();
      let response = await api.createCompanyAsync(this.company);
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

      this.closeModal(true);
    },

    async updateCompanyAsync() {
      this.showLoading();
      let api = new CompanyService();
      let response = await api.updateCompanyAsync(this.company);
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

      this.closeModal(true);
    },

    async save() {
      //validate
      let viewModel = new CompanyViewModel();
      viewModel.setFields(this.company);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.company.id === undefined) {
        await this.createCompanyAsync();
      } else {
        await this.updateCompanyAsync();
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.company = this.data;
    },
  },
};
</script>

<style lang='scss'>
@import "./CompanyManagementDetailComponent.scss";
</style>
