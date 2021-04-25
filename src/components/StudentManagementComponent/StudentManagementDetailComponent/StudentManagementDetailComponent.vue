<template src='./StudentManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'

export default {
  name: 'StudentManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      objStudent: {},

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
      this.objStudent = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createStudentAsync() {
      this.showLoading();
      let api = new StudentService();
      let response = await api.createStudentAsync(this.objStudent);
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

    async updateStudentAsync() {
      this.showLoading();
      let api = new StudentService();
      let response = await api.updateStudentAsync(this.objStudent);
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
      // let viewModel = new StudentService();
      // viewModel.setFields(this.objStudent);
      // this.errorMessages = viewModel.isValid();

      // if (this.errorMessages.length > 0) {
      //   return;
      // }

      if (this.objStudent.id > 0) {
        //update
        await this.updateStudentAsync();
      } else {
        //create
        await this.createStudentAsync();
      }
    },

  },
  watch: {
    data() {
      this.isShow = true;
      this.objStudent = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './StudentManagementDetailComponent.scss';
.form-select-class{
  width: 100%;
  height: 35px;
}
</style>
