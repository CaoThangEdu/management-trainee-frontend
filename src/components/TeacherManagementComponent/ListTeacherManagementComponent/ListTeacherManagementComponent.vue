<template src="./ListTeacherManagementComponent.html"></template>

<script>
import TeacherManagementDetailComponent from "../TeacherManagementDetailComponent/TeacherManagementDetailComponent";
import AddTeacherFileComponent from "../AddTeacherFlieComponent/AddTeacherFlieComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import TeacherService from "../../../services/teacher/teacherServices";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import AppConfig from "../../../../src/app.config.json";
import FacultyServices from "../../../services/faculty/facultyServices";
import planningStepsComponent from "../../planningStepsComponent/planningStepsComponent";

export default {
  extends: ComponentBase,
  components: {
    TeacherManagementDetailComponent,
    AddTeacherFileComponent,
    ConfirmDialog,
    JwPagination,
    planningStepsComponent
  },
  mixins: [CrudMixin],
  data() {
    return {
      teachers: [],
      editTeacher: {},
      teacherFile: {},
      confirmTeacher: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filter: {
        trainingSystemId: "",
        isDelete: false,
        careersName: "",
        status: "active"
      },
      isActiveStep:"3",
      faculties: [],
    };
  },
  async mounted() {
    await this.getTeachersAsync();
    await this.getFacultiesFilterAsync();
  },
  methods: {
    async getFacultiesFilterAsync() {
      let facultyFilter = {
        isDelete: false,
      };
      // Call Api
      this.showLoading();
      const api = new FacultyServices();

      const response = await api.getFacultiesFilterAsync(facultyFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties = response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

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
      const response = await api.getTeachersAsync(this.filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.teachers = response.data;
    },

    async changePage(currentPage) {
      await this.getTeachersAsync(currentPage);
    },

    updateTeacher(index) {
      this.editTeacher = Object.assign({}, this.teachers[index]);
    },

    deleteTeacher(teacher) {
      this.confirmTeacher = teacher;
    },

    // Call api delete teacher
    async updateIsDeleteStatus(index) {
      let teacher = this.pageOfItems[index];
      teacher.isDelete = true;
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(teacher);
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
        `${AppConfig.notification.content_updated_status_success_default}`
      );
      this.getTeachersAsync();
    },

    async deleteTeacherConfirm(teacherComfirm) {
      teacherComfirm.isDelete = true;
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(teacherComfirm); // Gọi Api
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

    getTrainingSystemName(careersId, careers) {
      return CrudMixin.methods.getInfo(careersId, careers);
    },

    async updateStatus(index) {
      let teacher = this.pageOfItems[index];
      if (teacher.status === "active") {
        teacher.status = "unactive";
      } else {
        teacher.status = "active";
      }
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(teacher);
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
      this.getTrainingSystemsAsync();
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
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