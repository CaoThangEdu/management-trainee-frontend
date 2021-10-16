<template src="./InternshipConfirmationStatisticsComponent.html"> </template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import JwPagination from "jw-vue-pagination";
import ComponentBase from "../common/component-base/ComponentBase";
import StudentService from "../../services/student/studentServices";
import ClassService from "../../services/class/classServices";
import CrudMixin from "../../helpers/mixins/crudMixin";
export default {
  name: "InternshipConfirmationStatisticsComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      internshipConfirmations: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
      studentsByMssv: {},
      classById: {},
    };
  },
  async mounted(){
    this.internshipConfirmations = await this.fliterInternshipConfirmationAsync();
    await this.getStudentsAsync();
    await this.getClassesAsync();
  },
  methods: {
    async fliterInternshipConfirmationAsync() {
      let filter ={studentId: "",status: ""};
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.fliterInternshipConfirmationAsync(filter);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    async getStudentsAsync() {
      let filterStudent = {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(filterStudent);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentsByMssv = CrudMixin.methods.convertArrayToObject(
        response.data,
        "studentId"
      );
    },
    async getClassesAsync() {
      // Call Api
      this.showLoading();
      const api = new ClassService();

      const response = await api.getClassesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classById = CrudMixin.methods.convertArrayToObject(response.data.items, "id");
    },
    getStudent(mssv) {
      if (this.studentsByMssv[mssv] === undefined) {
        return "";
      }
      return this.studentsByMssv[mssv];
    },
    getNameClass(mssv) {
      let classId = this.studentsByMssv[mssv];
      if (this.classById[classId] === undefined) {
        return "";
      }
      return this.classById[classId].className;
    },
  },
};
</script>

<style lang="scss">
@import "./InternshipConfirmationStatisticsComponent.scss";
</style>
