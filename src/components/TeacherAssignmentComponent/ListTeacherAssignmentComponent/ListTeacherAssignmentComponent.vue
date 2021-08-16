<template src='./ListTeacherAssignmentComponent.html'></template>

<script>
import SelectTeacher from "../../common/form/select-teacher/SelectTeacher.vue";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import BaseModal from "../../common/base-modal/BaseModal";
import JwPagination from "jw-vue-pagination";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";

export default {
  name: "ListTeacherAssignmentComponent",
  components: {
    SelectTeacher,
    BaseModal,
    AlertMessages,
    JwPagination,
    ConfirmDialog,
  },
  data() {
    return {
      instructors: [],
      listBrand: [],
      editTeacher: {},
      classId: "",
      teacherId: "",
      studentId: "",
      instructorId: "",
      instructorRequest: {
        internshipCourseId: "",
        classId: "",
        teacherId: "",
      },
      updateInstructor: {
        internshipCourseId: "",
        id: "",
        studentId: "",
        teacherId: "",
        status: "",
        isDelete: ""
      },
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      confirmChangeTeacher: null,
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
    studentInInternshipCourse: {
      type: Array
    }
  },
  async mounted() {
    this.getInstructorsAsync();
  },
  methods: {
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

     changeStudentId(instructor) {       
      this.studentId = instructor.studentId
      this.instructorId = instructor.instructorId       
    },

    changeTeacher(teacher){
      this.teacherId = teacher.id     
      this.updateInstructorAsync()
    },

    async updateInstructorAsync() {
      const api = new InstructorService();
      this.updateInstructor = {
        internshipCourseId: this.internshipCourseId,
        id: this.instructorId,
        studentId : this.studentId,
        teacherId: this.teacherId,
        isDelete: false,
        status: "active"     
      };
    
      const response = await api.updateInstructorAsync(this.updateInstructor);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.$emit("change-instructors", true);
      this.instructors = response.data;
    },  

    changeClassName() {
      this.getInstructorsAsync();
    },

    changeAsignmantWhileChooseTeacher(instructor) {
      this.confirmChangeTeacher = { instructor: instructor};
    },

    changeTeacherFromSelect() {
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