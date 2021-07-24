<template src='./AutomaticAssignment.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import StudentService from "../../../services/student/studentServices";
import TeacherService from "../../../services/teacher/teacherServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import ClassService from "../../../services/class/classServices";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import PlanService from "../../../services/plan/planServices";
import InstructorService from "../../../services/instructor/instructorService";
export default {
  name: "CareerManagementDetailComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    JwPagination,
  },
  data() {
    return {
      internshipCourseId: "f7d3b6a4-b1b3-4b3e-b767-08d949fbccb9",
      students: [], // Sinh viên chưa được phân công
      classes: [],
      teachers: [],
      studentsAll: [],
      statistiesStudentInClass: [],
      studentsUnassigned: {
        internshipCourseId: "",
        classId: "",
      },
      classFilter: {
        className: "",
        status: "",
        internshipCourseId: "",
        isDelete: false,
      },
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      isShow: false,
      career: {},
      errorMessages: [],
      statistical: {
        description: "",
        internshipCourseName: "",
        startDay: "",
        endDay: "",
        status: "",
        courseName: "",
        trainingSystemName: "",
        careersName: "",
        numberStudentsUnassigned: 0,
        numberTeachersInInternshipCourse: 0,
        numberOfStudentsInInternshipCourse: 0,
      },
      averageNumber: 0,
      classId: "",
      filterTeacher: {
        internshipCourseId: "",
      },
      statisticalRequest: {
        internshipCourseId: "",
      },
      numberOfStudentsInInternshipCourse: 0,
      numberTeachersInInternshipCourse: 0,
      immediateAssignment: "", // khi = true  option đc chọn sẻ đc phân công ngay  
      instructorRequest: {
        teacherId: "",
        studentId: "",
        internshipCourseId: "",
        status: "active",
        isDelete: false,
      },
      listInstructorRequest: [],
     
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  async mounted() {
    await this.getStudentsUnassigned();
    await this.getStatisticsStudentInClass();
    await this.getClassesAsync();
    await this.getTeachersAsync();
    await this.getStudentsInInternshipCourseAsync();
    await this.getPlanService();
  },

  methods: {
    teacherAssignment(teacherId, studentId) {
      // Phân công ngay khi được thay đổi    
      if (this.immediateAssignment) {
        this.createInstructorAsync(teacherId, studentId);
      } else {
        this.addListInstructorRequest(teacherId, studentId);
      }
    },

    addListInstructorRequest(teacherId,studentId) {     
      this.instructorRequest = {
        teacherId: teacherId,
        studentId: studentId,
        internshipCourseId: this.internshipCourseId,
      };
      this.listInstructorRequest.push(this.instructorRequest);
    },

    assignment() {
      this.listInstructorRequest.forEach((instructor) => {
        // Phân công theo danh sách sinh viên
        this.showLoading(true);
        console.log(this.listInstructorRequest)
        this.createInstructorAsync(-1, instructor);
        this.showLoading(false);
        this.listInstructorRequest = []
      });
    },

    // Phân công từng sinh viên
    async createInstructorAsync(studentId, instructor) {
      const api = new InstructorService();
      // Phân công từng sinh viên
      if (studentId != -1) {
        this.instructorRequest = {
          teacherId: this.teacherId,
          studentId: studentId,
          internshipCourseId: this.internshipCourseId,
        };
        instructor = this.instructorRequest;
      }

      const response = await api.createInstructorAsync(instructor);
      if (this.instructorRequest > -1) {
        this.students.splice(this.instructorRequest.index, 1);
      }
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
    },

    async getStatisticsStudentInClass() {
      this.showLoading();
      const api = new ClassService();
      this.statisticalRequest.internshipCourseId = this.internshipCourseId;
      const response = await api.getStatisticalClassUnassigned(
        this.statisticalRequest
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
      this.statistiesStudentInClass = response.data;
    },

    async getPlanService() {
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlanByIdAsync(this.internshipCourseId);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.statistical.courseName = response.data.courseName;
      this.statistical.internshipCourseName =
        response.data.internshipCourseName;
      this.statistical.description = response.data.description;
      this.statistical.startDay = response.data.startDay;
      this.statistical.endDay = response.data.endDay;
      this.statistical.courseName = response.data.courseName;
      this.statistical.status = response.data.status;
      this.statistical.numberStudentsUnassigned = this.studentsAll.length =
        this.students.length;
    },

    async getStudentsUnassigned() {
      // Call Api
      this.showLoading();
      const api = new StudentService();
      this.studentsUnassigned.classId = this.classId;
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
    },

    async getStudentsInInternshipCourseAsync() {
      // Call Api
      this.showLoading();
      const api = new StudentService();
      this.filterTeacher.internshipCourseId = this.internshipCourseId;
      const response = await api.getStudentsInInternshipCourse(
        this.filterTeacher
      );
      this.showLoading(false);
      this.studentLengthBanDau = response.data.length;

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentsAll = response.data;
      this.statistical.numberOfStudentsInInternshipCourse =
        response.data.length;
      this.numberOfStudentsInInternshipCourse = response.data.length;
    },

    async getTeachersAsync() {
      // Call Api
      this.showLoading();
      const api = new TeacherService();
      this.filterTeacher.internshipCourseId = this.internshipCourseId;
      const response = await api.getTeachersInInternshipCourse(
        this.filterTeacher
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
      this.teachers = response.data;
      this.statistical.numberTeachersInInternshipCourse = response.data.length;
      this.numberTeachersInInternshipCourse = response.data.length;
    },

    async getClassesAsync() {
      // Call Api
      this.showLoading();
      const api = new ClassService();
      this.classFilter.internshipCourseId = this.internshipCourseId;
      const response = await api.getClassesFilterAsync(this.classFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classes = response.data;
    },

    changeClassName() {
      this.getStudentsUnassigned();
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
  computed: {
    filterByTerm() {
      return this.localCars.filter((teachers) => {
        return teachers.lastName.toLowerCase().includes(this.searchTerm);
      });
    },
  },

  watch: {
    data() {
      this.averageNumber =
        this.numberOfStudentsInInternshipCourse /
        this.numberTeachersInInternshipCourse;
      this.isShow = true;
    },
  },
};
</script>

<style lang='scss'>
@import "./AutomaticAssignment.scss";
</style>
