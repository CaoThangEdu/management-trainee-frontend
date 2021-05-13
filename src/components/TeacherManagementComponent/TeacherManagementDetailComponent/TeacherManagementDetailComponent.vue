<template src='./TeacherManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import TeacherService from '../../../services/teacher/teacherServices'
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
      teachers: {},
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
      this.teachers = {};
      if (changeData) {
        this.$emit("change-data");
      }
    },
    async createTeacherAsync() {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.createTeacherAsync(this.teachers);
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
    async updateTeacherAsync() {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(this.teachers);
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
      if(this.teachers.id === undefined){
        await this.createTeacherAsync();
      } else{
        await this.updateTeacherAsync();
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.teachers = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './TeacherManagementDetailComponent.scss';
</style>