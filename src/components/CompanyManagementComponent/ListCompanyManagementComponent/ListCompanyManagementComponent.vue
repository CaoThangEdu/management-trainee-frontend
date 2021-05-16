<template src="./ListCompanyManagementComponent.html">
  
</template>

<script>
import CompanyManagementDetailComponent from "../CompanyManagementDetailComponent/CompanyManagementDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import CompanyService from '../../../services/company/companyServices'
import AppConfig from '../../../../src/app.config.json'
export default {
    extends: ComponentBase,
  components: {
    CompanyManagementDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      companies: [],
      editCompany:{},
     confirmedCompany: null,
    }
  },
   async mounted(){
    await this.getCompaniesAsync()
  },
   methods:{
    createCompany() {
      this.editCompany = {};
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
      this.companies = response.data.items
    },

    async changePage(currentPage) {
      await this.getCompaniesAsync(currentPage);
    },

    updateCompany(index) {
      this.editCompany = Object.assign({}, this.companies[index]);
    },

    deleteCompany(id) {
      this.confirmedCompany = { id: id };
    },

    // Call api delete Company
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new CompanyService();
      let response = await api.deleteCompanyAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getCompaniesAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getCompaniesAsync();
    },

    showNotification() {
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },
  }
}
</script>

<style>

</style>