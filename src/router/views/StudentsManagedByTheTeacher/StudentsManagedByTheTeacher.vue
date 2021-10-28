<template>
  <div>
    <ListOfStudentsManagedByTheTeacher 
      :students="students"
      :plans="plans" :classes="classes"
      @change-data-student-component="changeDataStudentComponent"
      @change-data-classroom="changeDataClassroom"
      @search-student="searchStudent" />
  </div>
</template>

<script>
import ListOfStudentsManagedByTheTeacher from '../../../components/StudentManagementComponent/ListOfStudentsManagedByTheTeacher/ListOfStudentsManagedByTheTeacher.vue';
import ComponentBase from '../../../components/common/component-base/ComponentBase.vue';
import StudentService from '../../../services/student/studentServices';
import AppConfig from '../../../../src/app.config.json';
import PlanService from '../../../services/plan/planServices';
import ClassService from '../../../services/class/classServices';

export default {
  name: "StudentsManagedByTheTeacher",
  extends: ComponentBase,
  components: {
    ListOfStudentsManagedByTheTeacher,
  },
  data() {
    return {
      students: [],
      plans: [],
      classes: [],
      filter: {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
      },
    };
  },
  
  async mounted(){
    await this.getClassesFilterAsync();
    await this.getPlansFilterAsync();
    await this.getStudentsAsync(this.filter);
  },
  
  methods:{
    async searchStudent(filterStudent) {
      await this.getStudentsAsync(filterStudent);
    },

    async getClassesFilterAsync() {
      let filterClass = {
        courseId: "",
        className: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new ClassService()

      const response = await api.getClassesFilterAsync(filterClass);
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

    async getPlansFilterAsync() {
      let filterPlan = {
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync(filterPlan)
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data
    },
    
    async getStudentsAsync(filter) {
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getStudentsAsync(filter)
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data
    },

    async changeDataStudentComponent() {
      await this.getStudentsAsync(this.filter);
    },

    async changeDataClassroom() {
      await this.getClassesFilterAsync();
    }
  }
}
</script>

<style lang='scss'>

</style>
