<template src='./ManualAssignment.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import StudentService from "../../../services/student/studentServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
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
      default: "",
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
      studentId: "",
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
      classId: "",
      numberOfStudentsInInternshipCourse: 0,
      numberTeachersInInternshipCourse: 0,
      instructorRequest: {
        teacherId: "",
        studentId: "",
        internshipCourseId: "",
        status: "active",
        isDelete: false,
        index: 0,
      },
      listInstructorRequest: [],
      teacherSelect: "",
      filterTeacher: {
        internshipCourseId: "",
      },
      editCompany: {},
      index: 0,
    };
  },

  created() {},

  async mounted() {
    await this.getStudentsUnassigned();
  },

  methods: {
    changeStudentId(id, index) {
      this.studentId = id;
      this.index = index;
    },
    changeTeacher(teacher) {
      this.createInstructorAsync(teacher.id, this.studentId, null, this.index);
    },

    async assignment() {
      this.listInstructorRequest.forEach((instructor) => {
        // Phân công theo danh sách sinh viên
        this.showLoading(true);
        this.createInstructorAsync(-1, -1, instructor, instructor.index);
        this.showLoading(false);
      });
      await this.getInstructorsAsync();
      this.listInstructorRequest = [];
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
          status: "active",
          isDelete: false,
        };
        instructor = this.instructorRequest;
      }
      this.showLoading();
      const response = await api.createInstructorAsync(instructor);
      this.$emit("change-instructors", true);
      this.showLoading(false);
      if (response.isOK == true) {
        this.students.splice(index, 1);
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
  },
  computed: {},
};
</script>

<style lang='scss'>
@import "./ManualAssignment.scss";
</style>
