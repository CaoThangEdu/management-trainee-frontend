<template src='./ListTeacherAssignmentComponent.html'></template>

<script>
import SelectTeacher from "../../common/form/select-teacher/SelectTeacher.vue";
import TeacherAssignmentDetailComponent from "../TeacherAssignmentDetailComponent/TeacherAssignmentDetailComponent";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import BaseModal from '../../common/base-modal/BaseModal'

export default {
  name: "ListTeacherAssignmentComponent",
  components: {
    TeacherAssignmentDetailComponent,
    SelectTeacher,
     BaseModal,
    AlertMessages,
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
    async getInstructorsAsync() {
      const api = new InstructorService();
      this.instructorRequest= {
        internshipCourseId: this.internshipCourseId,
        classId: this.classId,
        teacherId: this.teacherId,
      }
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
  },
};
</script>

<style lang='scss'>
@import "./ListTeacherAssignmentComponent.scss";
</style>