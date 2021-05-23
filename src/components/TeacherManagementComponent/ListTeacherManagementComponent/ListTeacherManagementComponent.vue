<template src="./ListTeacherManagementComponent.html"></template>

<script>
import TeacherManagementDetailComponent from "../TeacherManagementDetailComponent/TeacherManagementDetailComponent";
import AddTeacherFileComponent from "../AddTeacherFlieComponent/AddTeacherFlieComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import Pagination from "../../common/pagination/Pagination";
import TeacherService from "../../../services/teacher/teacherServices";
import AppConfig from "../../../../src/app.config.json";
export default {
  extends: ComponentBase,
  components: {
    TeacherManagementDetailComponent,
    AddTeacherFileComponent,
    ConfirmDialog,
    Pagination,

  },
  data() {
    return {
      teachers: [],
      editTeacher: {},
      teacherFile: {},
      confirmTeacher: null,
    };
  },
  async mounted() {
    await this.getTeachersAsync();
  },
  methods: {
    createTeacher() {
      this.editTeacher = {};
    },

    createFileTeacher() {
      this.teacherFile = {};
    },

    async getTeachersAsync() {
      // Call Api
      this.showLoading();
      const api = new TeacherService();
      const response = await api.getTeachersAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.teachers = response.data.items;
    },
    async changePage(currentPage) {
      await this.getTeachersAsync(currentPage);
    },
    updateTeacher(index) {
      this.editTeacher = Object.assign({}, this.teachers[index]);
    },
    deleteTeacher(id) {
      this.confirmTeacher = { id: id };
    },
    // Call api delete teacher
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.deleteTeacherAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getTeachersAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    deleteTeacher(id) {
      this.confirmTeacher = { id: id };
    },

    // Call api delete teacher
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.deleteTeacherAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getTeachersAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeData() {
      await this.getTeachersAsync();
    },
    
    showNotification() {
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },
  },
};
</script>

<style lang='scss'>
@import "./ListTeacherManagementComponent.scss";
.btn-add-file {
  margin-right: 10px;
}
</style>