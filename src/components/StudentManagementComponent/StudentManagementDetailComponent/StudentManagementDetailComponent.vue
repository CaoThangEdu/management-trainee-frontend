<template src='./StudentManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import PlanService from '../../../services/plan/planServices'
import ClassService from '../../../services/class/classServices'
import StudentViewModel from "../../../view-model/student/studentViewModel"

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
      student: {},
      plans: [],
      classes: [],
      errorMessages: [],
    }
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  async mounted(){
    await this.getPlansAsync()
    await this.getClassesAsync()
  },

  methods: {
    async getClassesAsync(){
      // Call Api
      this.showLoading();
      const api = new ClassService()

      const response = await api.getClassesAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classes = response.data.items
    },

    async getPlansAsync(){
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data.items
    },

    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.student = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createStudentAsync() {
      this.showLoading();
      let api = new StudentService();
      let response = await api.createStudentAsync(this.student);
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
      let response = await api.updateStudentAsync(this.student);
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
      let viewModel = new StudentViewModel();
      viewModel.setFields(this.student);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.student.id === undefined) {
        //create
        await this.createStudentAsync();
      } else {        
        //update
        await this.updateStudentAsync();
      }
    },

  },
  watch: {
    data() {
      this.isShow = true;
      this.student = this.data;
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
