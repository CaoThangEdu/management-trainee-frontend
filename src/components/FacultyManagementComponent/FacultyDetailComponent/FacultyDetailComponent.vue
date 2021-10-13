<template src='./FacultyDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import FacultyService from '../../../services/faculty/facultyServices'
import facultyViewModel from "../../../view-model/faculty/facultyViewModel"
import AppConfig from '../../../../src/app.config.json'

export default {
  name: 'FacultyDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      faculty: {},
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
      this.faculty = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createFacultyAsync() {
      this.showLoading();
      let api = new FacultyService();
      let response = await api.createFacultyAsync(this.faculty);
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

    async updateFacultyAsync() {
      this.showLoading();
      let api = new FacultyService();
      let response = await api.updateFacultyAsync(this.faculty);
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
      let viewModel = new facultyViewModel();
      viewModel.setFields(this.faculty);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.faculty.id === undefined){
        await this.createFacultyAsync();
      } else{
        await this.updateFacultyAsync();
      }
    },
  },
  
  watch: {
    data() {
      this.isShow = true;
      this.faculty = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './FacultyDetailComponent.scss';
</style>
