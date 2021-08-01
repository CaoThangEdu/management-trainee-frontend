<template src='./AutomaticAssignment.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import JwPagination from "jw-vue-pagination";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";

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
      averageNumber: 0,    
      statistic: {
        teacherId: "",
        number: 0,
      },
      statistics: [],
    };
  },
  props: {
    internshipCourseId: {
      type: String,
      default: "",
    },
    students: {
      type: Array,
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
  },

  methods: {
    createAssignmentData() {
      //Phân công từ đầu
      console.log(this.students)
      this.statistics = [];
      this.studentTempDelete = this.students;
      this.assignment = [];
      this.averageNumber = Math.round(
        this.students.length / this.teachers.length
      );
      this.teachers.forEach((teacher) => {
        this.studentTemp = [];
        this.studentTemp = this.studentTempDelete.slice(0, this.averageNumber);
        this.studentTempDelete.splice(0, this.averageNumber);
        var count = 0;
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
        this.statistic = {
          teacherId: teacher.id,
          number: count,
        };
        this.statistics.push(this.statistic);
      });
    },
    async teacherAssignment() {
      console.log("loading...");
      // hiện loading
      this.showLoading();
      await this.assignment.forEach((assignment) => {
        this.createInstructorAsync(assignment);
      });
      this.assignment = [];
      // có r mà đâu show giao diện
      // hay là phải show ở dưới hàm call api mới đc
      // ẩn loading
      this.showLoading(false);
      console.log("end loading");
    },

    async createInstructorAsync(assignment) {
      console.log("loading...");
      this.showLoading();
      const api = new InstructorService();
      // Phân công từng sinh viên
      const response = await api.createInstructorAsync(assignment);
      this.showLoading(false);
      console.log("end loading");
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

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    getClassName(classId) {
      for (const x in this.classes) {
        if (this.classes[x].id == classId) {
          return this.classes[x].className;
        }
      }
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
