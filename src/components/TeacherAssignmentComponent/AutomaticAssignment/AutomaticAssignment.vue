<template src='./AutomaticAssignment.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import JwPagination from "jw-vue-pagination";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";

export default {
  name: "AutomaticAssignment",
  extends: ComponentBase,
  components: {
    JwPagination,
    ConfirmDialog,
  },
  data() {
    return {
      assignments: [],
      studentTemp: [],
      teacherTemp: [],
      teacherTempRequest: {
        teacherId: "",
        number: 0,
      },
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
      numberOfTeacher: 0,
      statistics: [],
      isShowAssignment: false,
        pageOfItems: [],
        pageOfItemsInstructor: [],
        customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      confirmInternshipCourseId: null,
      isShowContinueAssignment: false,
      showCreateAssignments: false,
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
    numberOfStudentInInternshipCourse: Number,

  },

  methods: {
    showAssignments() {
      this.isShowAssignment = !this.isShowAssignment;
      if (this.isShowContinueAssignment) {
        this.isShowContinueAssignment = false;
      }
    },

    showContinueAssignment() {
      this.isShowContinueAssignment = !this.isShowContinueAssignment;
      if (this.isShowAssignment) {
        this.isShowAssignment = false;
      }
    },

    createAssignmentData() {
       if(this.showCreateAssignments) {
        this.showCreateAssignments = false;
        return;
      }
      console.log("abc")
      this.showCreateAssignments = true;
      //Phân công từ đầu
      this.statistics = [];
      this.studentTempDelete = JSON.parse(JSON.stringify(this.students));
      this.assignments = [];
      this.averageNumber = Math.round(
        this.numberOfStudentInInternshipCourse / this.teachers.length
      );
      if(this.numberOfTeacher != 0 && this.numberOfTeacher != this.averageNumber ){
        this.averageNumber = this.numberOfTeacher
      }
      if (this.instructors.length == 0) {
        this.teachers.forEach((teacher) => {
          this.studentTemp = [];
          this.studentTemp = this.studentTempDelete.slice(
            0,
            this.averageNumber
          );
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

            this.assignments.push(this.assignmentRequest);
          });
          this.statistic = {
            teacherId: teacher.id,
            number: count,
          };
          this.statistics.push(this.statistic);
        });
      } else {
        this.addAssignmentStudentNumber();
        this.teacherTemp.forEach((teacher) => {
          this.studentTemp = [];
          //Nếu giáo viên đã được phân công thì giảm bớt số sinh viên lại cho đều
          if (teacher.number > 0) {
            this.studentTemp = this.studentTempDelete.slice(
              0,
              this.averageNumber - teacher.number
            );
            this.studentTempDelete.splice(
              0,
              this.averageNumber - teacher.number
            );
          } else {
            this.studentTemp = this.studentTempDelete.slice(
              0,
              this.averageNumber
            );
            this.studentTempDelete.splice(0, this.averageNumber);
          }
          var count = 0;
          this.studentTemp = this.studentTemp.forEach((student) => {
            count++;
            this.assignmentRequest = {
              teacherId: teacher.teacherId,
              studentId: student.id,
              internshipCourseId: this.internshipCourseId,
              status: "active",
              isDelete: false,
            };

            this.assignments.push(this.assignmentRequest);
          });
          this.statistic = {
            teacherId: teacher.teacherId,
            number: count,
          };
          this.statistics.push(this.statistic);
        });
      }
    },
    addAssignmentStudentNumber() {
      this.teacherTemp = [];
      this.teachers.forEach((teacher) => {
        var count = 0;
        this.instructors.forEach((instructor) => {
          if (
            teacher.firstName + "" + teacher.lastName ==
            instructor.teacherName
          ) {
            count++;
          }
        });
        this.teacherTempRequest = {
          teacherId: teacher.id,
          number: count,
        };
        this.teacherTemp.push(this.teacherTempRequest);
      });
      console.log(this.teacherTemp);
    },
    async teacherAssignment() {
       this.showLoading()
      await this.assignments.forEach((assignment) => {
        this.createInstructorAsync(assignment);
      });
      this.showLoading(false)
      this.assignments = [];  
      this.statistics = []   
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

    deleteStudent(internshipCourseId) {
      this.confirmInternshipCourseId = {
        internshipCourseId: internshipCourseId,
      };
    },

    async restoreAssignment(confirmInternshipCourseId) {
      await this.getInstructorsAsync(confirmInternshipCourseId);
    },

    async getInstructorsAsync(confirmInternshipCourseId) {
      this.showLoading();
      const api = new InstructorService();
      this.instructorRequest = confirmInternshipCourseId;
      const response = await api.restoreInstructors(this.instructorRequest);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        "Xóa danh sách phân công thành công"
      );
      console.log("response.data", response.data);
      this.$emit("change-instructors", response.data);
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

     onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    }, 
  },
  watch: {
   
  },
};
</script>

<style lang='scss'>
@import "./AutomaticAssignment.scss";
</style>
