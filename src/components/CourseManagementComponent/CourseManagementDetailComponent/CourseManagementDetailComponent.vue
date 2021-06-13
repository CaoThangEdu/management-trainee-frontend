<template src='./CourseManagementDetailComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import CourseService from "../../../services/course/courseServices";
import CourseViewModel from "../../../view-model/course/courseViewModel";
import AppConfig from "../../../../src/app.config.json";
import TrainingSystemServices from "../../../services/trainingsystem/trainingsystemServices";
import CareerService from "../../../services/career/careerServices";

export default {
  name: "CourseManagementDetailComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      trainingSystems: [],
      errorMessages: [],
      course: [],
      careers: [],
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  async mounted() {
    await this.getTrainingSystemAsync();
    await this.getCareersAsync();
  },
  methods: {
    async pressKeyEnter() {
      await this.save();
    },
    async getTrainingSystemAsync() {
      // Call Api
      this.showLoading();
      const api = new TrainingSystemServices();

      const response = await api.getAllTrainingSystemsAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems = response.data.items;
    },
    async getCareersAsync() {
      // Call Api
      this.showLoading();
      const api = new CareerService();

      const response = await api.getCareersAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data.items;
    },
    closeModal(changeData) {
      this.isShow = false;
      this.course = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },
    async createCourseAsync() {
      this.showLoading();
      let api = new CourseService();
      let response = await api.createCourseAsync(this.course);
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
        `${AppConfig.notification.content_created_success_default}`
      );

      this.closeModal(true);
    },

    async updateCourseAsync() {
      this.showLoading();
      let api = new CourseService();
      let response = await api.updateCourseAsync(this.course);
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

      if (this.course.id === undefined) {
        await this.createCourseAsync();
      } else {
        await this.updateCourseAsync();
      }
    },
  },

  watch: {
    data() {
      this.isShow = true;
      this.course = this.data;
    },
  },
};
</script>

<style lang='scss'>
@import "./CourseManagementDetailComponent.scss";
</style>
