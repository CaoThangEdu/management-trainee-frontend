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

    closeModal(changeData, company, action) {
      this.isShow = false;
      this.company = {};
      if (changeData) {
        this.$emit("change-data", company, action);
      }
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
      let companies = response.data;
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
      }
      if(response.data.taxCode === null && response.data.title === null 
        && response.data.companyAddress === null && response.data.owner === null
        && response.data.career === null && response.data.phoneNumber === null){
         return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Không tìm thấy công ty vui lòng nhập thông tin công ty!"
        );
        }
      return this.company = response.data
    },

    async createCompanyAsync() {
      if(this.companiesByTaxCode[this.company.taxCode]){
          return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Công ty đã tồn tại trong danh sách!"
        );
      }
      this.company.status =  "active";
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
      this.closeModal(true, response.data, "create");
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

     this.closeModal(true, response.data, "update");
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
