<template src="./Assignment.html"  @getPlan="course = $event">  
</template>

<script>
import ListTeacherAssignmentComponent from '../ListTeacherAssignmentComponent/ListTeacherAssignmentComponent.vue'
import TeacherService from "../../../services/teacher/teacherServices";
import ComponentBase from "../../common/component-base/ComponentBase"
import Tabs from "../../common/tab-comp/tabs/tabs.vue";
import Tab from "../../common/tab-comp/tab/tab.vue";
import ManualAssignment from "../ManualAssignment/ManualAssignment.vue";
import Statistical from "../Statistical/Statistical.vue";
import ClassService from "../../../services/class/classServices";
import AppConfig from "../../../../src/app.config.json";

export default {
  name: "Assigment",
  extends: ComponentBase,
  components: {
    ListTeacherAssignmentComponent,
    ManualAssignment,
    Tabs, Tab,
    Statistical
  },
  props: {
    internshipCourseId: {
      type: String,
      default: ''
    },
    
  },
  
  data() {
    return{
      teachers:[],
      classes: [],     
      studentsUnassigned: {
        internshipCourseId: "",
        classId: ""
      },
      classIdFilter: "",      
      course: []  ,
      classFilter: {
        className: "",
        status: "",
        internshipCourseId: "",
        isDelete: false,
      }, 
      filterTeacher: {
        internshipCourseId: "",
      }, 
    };
  },
  created() {
  },
  async mounted(){
    this.getClassesAsync();
    this.getTeachersAsync();
  },
  
  methods: {     
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
    },    
  }

}
</script>

<style lang='scss'>
@import "./Assignment.scss";
</style> 