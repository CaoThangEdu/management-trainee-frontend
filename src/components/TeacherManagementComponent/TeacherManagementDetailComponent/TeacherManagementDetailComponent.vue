<template src='./TeacherManagementDetailComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import TeacherService from "../../../services/teacher/teacherServices";
import AppConfig from "../../../../src/app.config.json";
import TeacherViewModel from "../../../view-model/teacher/teacherViewModel";
export default {
  name: "TeacherDetail",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      teacher: {},
      errorMessages: [],
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    faculties: {
      type: Array,
      default: null,
    }
  },
  methods: {
    async pressKeyEnter() {
      await this.save();
    },
    closeModal(changeData) {
      this.isShow = false;
      this.teacher = {};
      if (changeData) {
        this.$emit("change-data");
      }
    },
    async createTeacherAsync() {
      this.teacher.status = 'active';
      this.showLoading();
      let api = new TeacherService();
      let response = await api.createTeacherAsync(this.teacher);
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
    async updateTeacherAsync() {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(this.teacher);
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
      this.teacher.facultyId = this.faculties[0].id;
      //validate
      let viewModel = new TeacherViewModel();
      viewModel.setFields(this.teacher);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.teacher.id === undefined) {
        await this.createTeacherAsync();
      } else {
        await this.updateTeacherAsync();
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.teacher = this.data;
    },
  },
};
</script>

<style lang='scss'>
@import "./TeacherManagementDetailComponent.scss";
</style>
