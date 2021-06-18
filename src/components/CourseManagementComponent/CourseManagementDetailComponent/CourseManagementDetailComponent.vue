<template src='./CourseManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import CourseService from '../../../services/course/courseServices'
import CourseViewModel from "../../../view-model/course/courseViewModel"
import AppConfig from '../../../../src/app.config.json';

export default {
  name: 'CourseManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      course: {},

      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    careers: {
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
      this.course = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createCourseAsync() {
      this.course.status = "active";
      this.showLoading();
      let api = new CourseService();
      let response = await api.createCourseAsync(this.course);
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

    async updateCourseAsync() {
      this.showLoading();
      let api = new CourseService();
      let response = await api.updateCourseAsync(this.course);
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
      let viewModel = new CourseViewModel();
      viewModel.setFields(this.course);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.course.id === undefined){
        await this.createCourseAsync();
      } else{
        await this.updateCourseAsync();
      }
    },
  },
  
  watch: {
    data() {
      this.isShow = true;
      this.course = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './CourseManagementDetailComponent.scss';
</style>
