<template src="./ListCompanyManagementComponent.html"> </template>

<script>
import CompanyManagementDetailComponent from "../CompanyManagementDetailComponent/CompanyManagementDetailComponent";
import AddCompanyFileComponent from "../AddCompanyFlieComponent/AddCompanyFlieComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import CompanyService from "../../../services/company/companyServices";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import JwPagination from "jw-vue-pagination";
export default {
  extends: ComponentBase,
  components: {
    CompanyManagementDetailComponent,
    AddCompanyFileComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      companies: [],
      editCompany: {},
      companyFile: {},
      confirmedCompany: null,
      selectCompany: -1,
      filterCompany: {
        keyword:"",
        status:""
      },
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
    };
  },
  async mounted() {
    await this.getCompaniesAsync();
  },
  methods: {
    createCompany() {
      this.editCompany = {
        status: "active",
      };
    },
    
    createCompanyFile() {
      this.companyFile = {};
    },

    async getCompaniesAsync() {
      // Call Api
      this.showLoading();
      const api = new CompanyService();
      const response = await api.getCompaniesAsync(this.filterCompany);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.companies = response.data;
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
      if (!response.isOK) {
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
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeData(company, action) {
      if (action === "create") {
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

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    async updateStatus(index) {
      if (this.companies[index].status === "active") {
        this.companies[index].status = "unactive";
      } else {
        this.companies[index].status = "active";
      }
      this.showLoading();
      let api = new CompanyService();
      let response = await api.updateCompanyAsync(this.companies[index]);
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
        `${AppConfig.notification.content_updated_status_success_default}`
      );
      this.$set(this.companies, index, response.data);
    },

    async searchCompany() {
      // Call Api
      this.showLoading();
      const api = new CompanyService();
      const response = await api.getCompaniesAsync(
        this.filterCompany,
        this.status
      );
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.companies = response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
  },
};
</script>

<style></style>
