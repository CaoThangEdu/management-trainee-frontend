<template src='./ListTeacherAssignmentComponent.html'></template>

<script>
import SelectTeacher from "../../common/form/select-teacher/SelectTeacher.vue";
import TeacherAssignmentDetailComponent from "../TeacherAssignmentDetailComponent/TeacherAssignmentDetailComponent";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import BaseModal from "../../common/base-modal/BaseModal";
import JwPagination from "jw-vue-pagination";

export default {
  name: "ListTeacherAssignmentComponent",
  components: {
    TeacherAssignmentDetailComponent,
    SelectTeacher,
    BaseModal,
    AlertMessages,
    JwPagination,
  },
  data() {
    return {
      instructors: [],
      listBrand: [],
      editTeacher: {},
      classId: "",
      teacherId: "",
      instructorRequest: {
        internshipCourseId: "",
        classId: "",
        teacherId: "",
      },
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
    };
  },
  props: {
    internshipCourseId: {
      type: String,
    },
    classes: {
      type: Array,
    },
    teachers: {
      type: Array,
    },
  },
  async mounted() {
    this.getInstructorsAsync();
  },
  methods: {
    // changeStudentId(id, index) {
    //   this.studentId = id;
    //   this.index = index;
    // },

    // changeTeacher(teacher) {
    //   this.createInstructorAsync(teacher.id, this.studentId, null, this.index);

    // },

    async getInstructorsAsync() {
      const api = new InstructorService();
      this.instructorRequest = {
        internshipCourseId: this.internshipCourseId,
        classId: this.classId,
        teacherId: this.teacherId,
      };
      const response = await api.getInstructors(this.instructorRequest);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.instructors = response.data;
    },

    createBrand() {
      this.editTeacher = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
    changeClassName() {
      this.getInstructorsAsync();
    },
    changeTeacher() {
      this.getInstructorsAsync();
    },
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },
  },
};
</script>

<style lang='scss'>
@import "./ListTeacherAssignmentComponent.scss";
</style>