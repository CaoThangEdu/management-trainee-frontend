<template src="./Assignment.html"  @getPlan="course = $event">  
</template>

<script>
import ListStudentComponent from '../ListStudentComponent/ListStudentComponent.vue'
import ListTeacherAssignmentComponent from '../ListTeacherAssignmentComponent/ListTeacherAssignmentComponent.vue'
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import ComponentBase from "../../common/component-base/ComponentBase"

export default {
  name: "Assigment",
  extends: ComponentBase,
  components: {
    ListStudentComponent,
    ListTeacherAssignmentComponent
  },
  props: {
    internshipCourseId: {
      type: String,
      default: null
    },
  },
  
  data() {
    return{
      students : { },
      teacher: {},
      studentsUnassigned: {
        internshipCourseId: "",
        classId: ""
      },
      classIdFilter: "",      
      course: []   
    };
  },
  created() {
  },
  async mounted(){
    await this.getStudentsUnassigned()   
  },
  
  methods: {   
  
    async getStudentsUnassigned(){      
      // Call Api
      this.showLoading();
      const api = new StudentService()
      //this.studentsUnassigned.internshipCourseId = this.internshipCourseId;
      this.studentsUnassigned.internshipCourseId = "854ef351-3c36-479e-2323-08d9442977d9";
      //
      this.studentsUnassigned.classId = this.classIdFilter;
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
  }

}
</script>

<style lang='scss'>
@import "./Assignment.scss";
</style> 