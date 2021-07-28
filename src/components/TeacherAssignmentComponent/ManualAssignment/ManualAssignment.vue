<template src='./ManualAssignment.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import StudentService from "../../../services/student/studentServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import PlanService from "../../../services/plan/planServices";
import InstructorService from "../../../services/instructor/instructorService";
import SelectTeacher from "../../common/form/select-teacher/SelectTeacher.vue";

export default {
  name: "ManualAssignment",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    JwPagination,
    SelectTeacher,
  },
   props: {
    internshipCourseId: {
      type: String,
      default: ''
    },
    classes: {
      type: Array,
    },
     teachers: {
      type: Array,
    },
  },
  data() {
    return {
      students: [], // Sinh viên chưa được phân công    
      studentsAll: [],
      statistiesStudentInClass: [],
      studentsUnassigned: {
        internshipCourseId: "",
        classId: "",
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
      numberOfStudentsInInternshipCourse: 0,
      numberTeachersInInternshipCourse: 0,
      immediateAssignment: "", // khi = true  option đc chọn sẻ đc phân công ngay  
      instructorRequest: {
        teacherId: "",
        studentId: "",
        internshipCourseId: "",
        status: "active",
        isDelete: false,
        index: 0
      },
      listInstructorRequest: [],
      teacherSelect: "",
    };
  },
 
  created(){
  },

  async mounted() {
    await this.getStudentsUnassigned();
    await this.getStudentsInInternshipCourseAsync();
    await this.getPlanService();
  },

  methods: {
    teacherAssignment(teacherId, studentId, index) {
      // Phân công ngay khi được thay đổi 
      if (this.immediateAssignment) {
        this.createInstructorAsync(teacherId, studentId, null, index);
      } else {
        this.addListInstructorRequest(teacherId, studentId, index);
      }
    },

    addListInstructorRequest(teacherId, studentId, index) {     
      this.instructorRequest = {
        teacherId: teacherId,
        studentId: studentId,
        internshipCourseId: this.internshipCourseId,
        index: index
      };
      this.listInstructorRequest.push(this.instructorRequest);
    },

    assignment() {
      this.listInstructorRequest.forEach((instructor) => {
        // Phân công theo danh sách sinh viên
        this.showLoading(true);
        this.createInstructorAsync(-1, -1, instructor, instructor.index)
        this.showLoading(false);
      });
      this.listInstructorRequest = []
    },

    // Phân công từng sinh viên
    async createInstructorAsync(teacherId, studentId, instructor, index) {
      const api = new InstructorService();
      // Phân công từng sinh viên
      if (studentId != -1) {
        this.instructorRequest = {
          teacherId: teacherId,
          studentId: studentId,
          internshipCourseId: this.internshipCourseId,
        };
        instructor = this.instructorRequest;
      }
      const response = await api.createInstructorAsync(instructor);
      if (response.isOK == true) {
        this.students.splice(index ,1);
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
      this.statistical.internshipCourseName = response.data.internshipCourseName;
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
@import "./ManualAssignment.scss";
</style>
