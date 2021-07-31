<template src='./AutomaticAssignment.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import JwPagination from "jw-vue-pagination";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import StudentService from "../../../services/student/studentServices";

export default {
  name: "AutomaticAssignment",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    JwPagination,
  },
  data() {
    return {
      students: [],
      assignment: [],
      studentTemp: [],
      studentTempDelete: [],
      assignmentRequest: {
        teacherId: "",
        studentId: "",
        internshipCourseId: "",
        status: "active",
        isDelete: false,
        index: 0,
      },
      studentsUnassigned: {
        classId: "",
        internshipCourseId: "",
      },
      averageNumber: 0,
      numberAv: {
        studentsNumber: 0,
        teachersNumber: 0,
      },
      thongke: {
        teacherId:"",
        number: 0
      },
      listthongke:[]
    };
  },
  props: {
    internshipCourseId: {
      type: String,
      default: "",
    },
    classes: {
      type: Array,
    },
    teachers: {
      type: Array,
    },
    instructors: {
      type: Array,
    },
  },

  async mounted() {
    this.getStudentsUnassigned();
    this.createAssignmentData();
  },

  methods: {
    createAssignmentData() {
      console.log(this.students.length);
      //Phân công từ đầu
      this.listthongke = []
      this.studentTempDelete = this.students;
      this.assignment = [];
      this.averageNumber = Math.round(
        this.numberAv.studentsNumber / this.teachers.length
      );
      this.teachers.forEach((teacher) => {
        this.studentTemp = [];
        this.studentTemp = this.studentTempDelete.slice(0, this.averageNumber);
        this.studentTempDelete.splice(0, this.averageNumber);
        var count =0;        
        this.studentTemp = this.studentTemp.forEach((student) => {
          count++;
          this.assignmentRequest = {
            teacherId: teacher.id,
            studentId: student.id,
            internshipCourseId: this.internshipCourseId,
            status: "active",
            isDelete: false,
          };
         
          this.assignment.push(this.assignmentRequest);
        });
         this.thongke ={
            teacherId :teacher.id,
            number: count
          }
          this.listthongke.push(this.thongke);
      });
    },
    teacherAssignment() {
      this.assignment.forEach((assignment) => {
        this.createInstructorAsync(assignment);
      });
      this.assignment = [];
    },
    async createInstructorAsync(assignment) {
      const api = new InstructorService();
      // Phân công từng sinh viên
      const response = await api.createInstructorAsync(assignment);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
    },
    restoreAssignment() {
      this.getInstructorsAsync();
    },

    async getInstructorsAsync() {
      const api = new InstructorService();
      this.instructorRequest = {
        internshipCourseId: this.internshipCourseId,
      };
      const response = await api.restoreInstructors(this.instructorRequest);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.instructors = response.data;
    },

    async getStudentsUnassigned() {
      // Call Api
      this.showLoading();
      const api = new StudentService();
      this.studentsUnassigned.internshipCourseId = this.internshipCourseId;
      const response = await api.getStudentUnassignedAsync(
        this.studentsUnassigned
      );
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data;
      this.numberAv.studentsNumber = response.data.length;
    },
  },
  watch: {
    data() {},
  },
};
</script>

<style lang='scss'>
@import "./AutomaticAssignment.scss";
</style>
