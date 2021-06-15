<template src="./Assignment.html"  @getPlan="course = $event">  
</template>

<script>
import ListStudentComponent from '../ListStudentComponent/ListStudentComponent.vue'
import TeacherAssingment from '../TeacherAssignmentComponent/TeacherAssignmentComponent.vue'
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import ComponentBase from "../../common/component-base/ComponentBase"
import TeacherAssignmentDetailComponent from "../TeacherAssignmentDetailComponent/TeacherAssignmentDetailComponent.vue"
import ClassService from '../../../services/class/classServices'


export default {
  name: "Assigment",
  extends: ComponentBase,
  components: {
    ListStudentComponent,
    TeacherAssingment,
    TeacherAssignmentDetailComponent
  },
  props: {
    Plan: {
      type: String,
      default: null
    },
  },
  
  data() {
    return{
      students : { },
      teacher: {},
      studentFilter: {
        courseId: "",
        classId: ""
      },
      course: []   
    };
  },
  created() {
  },
  async mounted(){
    await this.getStudentsByCourseIdAsync()
   
  },
  
  methods: {
   
  
    async getStudentsByCourseIdAsync(){
      this.studentFilter.courseId = this.Plan.courseId
      
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.filterStudentByClassIdAsync(this.studentFilter)
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data.items;
      console.log("Filter roi ne");
      console.log(this.students);
    },
   
  }

}
</script>

<style lang='scss'>
@import "./Assignment.scss";
</style> 