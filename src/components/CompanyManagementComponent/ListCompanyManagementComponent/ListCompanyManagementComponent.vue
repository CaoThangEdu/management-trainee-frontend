<template src="./ListCompanyManagementComponent.html">
  
</template>

<script>
import CompanyManagementDetailComponent from "../CompanyManagementDetailComponent/CompanyManagementDetailComponent"
import AddCompanyFileComponent from "../AddCompanyFlieComponent/AddCompanyFlieComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CompanyService from '../../../services/company/companyServices'
import AppConfig from '../../../../src/app.config.json'
export default {
    extends: ComponentBase,
  components: {
    CompanyManagementDetailComponent,
    AddCompanyFileComponent,
    ConfirmDialog,
  },
  data() {
    return {
      companies: [],
      editCompany:{},
      companyFile:{},
     confirmedCompany: null,
     selectCompany:-1
    }
  },
   async mounted(){
    await this.getCompaniesAsync()
  },
   methods:{
    createCompany() {
      this.editCompany = {
        status: "active"
      };
    },
     createCompanyFile() {
      this.companyFile = {};
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
      this.selectCompany = index;
      this.editCompany = Object.assign({}, this.companies[index]);
    },

    deleteCompany(id, index) {
      this.confirmedCompany = { id: id, index: index };
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
      this.companies.splice(dataConfirm.index, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData(company, action) {
      if(action === "create"){
        return this.companies.unshift(company);
      }
      this.$set(this.companies, this.selectCompany, company);
      this.selectCompany = -1;
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