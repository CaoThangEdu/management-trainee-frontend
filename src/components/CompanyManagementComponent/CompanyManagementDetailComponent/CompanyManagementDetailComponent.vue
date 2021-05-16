<template src='./CompanyManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import CompanyService from '../../../services/company/companyServices'
import AppConfig from '../../../../src/app.config.json'
export default {
  name: 'PlanDetail',
  extends: ComponentBase,
  components: { 
     BaseModal,
    AlertMessages,
  },
 data() {
    return {
      isShow: false,
      companies: {},

      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.companies = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createCompanyAsync() {
      this.showLoading();
      let api = new CompanyService();
      let response = await api.createCompanyAsync(this.companies);
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

      this.closeModal(true);
    },

    async updateCompanyAsync() {
      this.showLoading();
      let api = new CompanyService();
      let response = await api.updateCompanyAsync(this.companies);
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

      this.closeModal(true);
    },

    async save() {
      // validate
      // let viewModel = new CourseService();
      // viewModel.setFields(this.course);
      // this.errorMessages = viewModel.isValid();

      // if (this.errorMessages.length > 0) {
      //   return;
      // }

      if(this.companies.id === undefined){
        await this.createCompanyAsync();
      } else{
        await this.updateCompanyAsync();
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.companies = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './CompanyManagementDetailComponent.scss';
</style>
