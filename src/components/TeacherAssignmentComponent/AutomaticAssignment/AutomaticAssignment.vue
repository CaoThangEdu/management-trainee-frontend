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
            };

            this.assignments.push(this.assignmentRequest);
          });

          this.addStatistics(teacher.teacherId, count)  

        });
      } 
      // Phân công tiếp tục 
      else {
        // Láy danh sách giáo viên tạm bao gồm số lượng sinh viên đã phân công cho giáo viên đó.
        this.addAssignmentStudentNumber();

        this.teacherTemp.forEach((teacher) => {         
          this.studentTemp = [];
          if(teacher.number > 0 && teacher.number <= this.averageNumber) {
            this.studentTemp = this.studentTempDelete.slice(0, this.averageNumber - teacher.number);
            this.studentTempDelete.splice(0, this.averageNumber - teacher.number);
          } 
          else {
            this.studentTemp = this.studentTempDelete.slice(0, this.averageNumber );
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
            };

            this.assignments.push(this.assignmentRequest);
          });

          this.addStatistics(teacher.teacherId, count)         
        });
      }
    },

    addStatistics(teacherId, count)
    {
      this.statistic = {
        teacherId: teacherId,
        number: count,
        };
        this.statistics.push(this.statistic);
    },

    addAssignmentStudentNumber() {
      this.teacherTemp = [];
      this.teachers.forEach((teacher) => {
        var count = 0;
        this.instructors.forEach((instructor) => {
          if (teacher.id == instructor.teacherId)
          {
            count++;
          }
        });
        this.teacherTempRequest = {
          teacherId: teacher.id,
          number: count,
        };
        this.teacherTemp.push(this.teacherTempRequest);
      });
    },

    async teacherAssignment() {
       this.assignments.forEach((assignment) => {
        this.createInstructorAsync(assignment);
      });
       this.$emit("change-instructors", true);
      this.assignments = [];  
      this.statistics = []   
    },

    async createInstructorAsync(assignment) {
      this.showLoading();
      const api = new InstructorService();
      // Phân công từng sinh viên
      const response = await api.createInstructorAsync(assignment);
      this.showLoading(false);
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

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },
  },
};
</script>

<style lang='scss'>
@import "./AutomaticAssignment.scss";
</style>
