<template src='./AutomaticAssignment.html'>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import StudentService from '../../../services/student/studentServices'
import TeacherService from "../../../services/teacher/teacherServices"
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import ClassService from "../../../services/class/classServices";

export default {
  name: 'CareerManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    JwPagination,

  },
  data() {
    return {
      internshipCourseId: "854ef351-3c36-479e-2323-08d9442977d9",
      students: [], // Sinh viên chưa được phân công      
      classes: [],
      teachers: [],
      studentsUnassigned: {
        internshipCourseId: "",
        classId: ""
      },
      classFilter: {
        className:"",
        status: "",
        internshipCourseId:"",
        isDelete: false
      },  
      pageOfItems: [], 
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      }, 
      isShow: false,
      career: {},
      errorMessages: [],
      statistical: {
        trainingSystemName: "Cao Dang",
        careersName: "Công nghệ thông tin",
        courseName: "K18",
        numberStudentsUnassigned: 160,
        numberTeachers: 20,
        numberOfStudentsInInternshipCourse: "",
      },
      internshipCourseName: "Đợt thực tập khoa công nghệ thông tin 2018",
      averageNumber: 0,
      classId: "",
      filterTeacher: {
        internshipCourseId: ""
      }

    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    }
  },

  async mounted(){
    await this.getStudentsUnassigned()
    await this.getClassesAsync()
    await this.getTeachersAsync()
    await this.getStudentsInInternshipCourseAsync()
   
  },
  
  methods: {
     async getStudentsUnassigned(){      
      // Call Api
      this.showLoading();
      const api = new StudentService()
      this.studentsUnassigned.classId = this.classId;
      this.studentsUnassigned.internshipCourseId = this.internshipCourseId;
      const response = await api.getStudentUnassignedAsync(this.studentsUnassigned)
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }      
      this.students = response.data;
    },

    async getStudentsInInternshipCourseAsync(){
      // Call Api
      this.showLoading();
      const api = new StudentService()
      this.filterTeacher.internshipCourseId = this.internshipCourseId;
      const response = await api.getStudentsInInternshipCourse(this.filterTeacher)
      this.showLoading(false);
      this.studentLengthBanDau = response.data.length;

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentsAll = response.data  
    },
  
    async getTeachersAsync() {
      // Call Api
      this.showLoading();
      const api = new TeacherService();
      this.filterTeacher.internshipCourseId = this.internshipCourseId;
      const response = await api.getTeachersInInternshipCourse(this.filterTeacher);
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
    },

     async getClassesAsync(){
      // Call Api
      this.showLoading();
      const api = new ClassService()
      this.classFilter.internshipCourseId = this.internshipCourseId;
      const response = await api.getClassesFilterAsync(this.classFilter);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classes = response.data;
    },

    changeClassName(){
      this.getStudentsUnassigned();
    },    

    getClassName(classId){
      for (const x in this.classes) {
        if(this.classes[x].id == classId){
          return this.classes[x].className
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
  
  watch: {
    data() {
      this.averageNumber = this.numberStudentsUnassigned / this.numberTeachers
      this.isShow = true;
      this.career = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './AutomaticAssignment.scss';
</style>
