<template src='./CareerManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import CareerService from '../../../services/career/careerServices'
import CareerViewModel from "../../../view-model/career/careerViewModel"
import AppConfig from '../../../../src/app.config.json'

export default {
  name: 'CareerManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      career: {},
      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    trainingSystems: {
      type: Array,
      default: null
    },
  },
  
  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.career = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createCareerAsync() {
      this.career.status = "active";
      this.showLoading();
      let api = new CareerService();
      let response = await api.createCareerAsync(this.career);
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

    async updateCareerAsync() {
      this.showLoading();
      let api = new CareerService();
      let response = await api.updateCareerAsync(this.career);
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
      let viewModel = new CareerViewModel();
      viewModel.setFields(this.career);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.career.id === undefined){
        await this.createCareerAsync();
      } else{
        await this.updateCareerAsync();
      }
    },
  },
  
  watch: {
    data() {
      this.isShow = true;
      this.career = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './CareerManagementDetailComponent.scss';
</style>
