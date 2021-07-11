<template>
  <div>
    <ListStudentManagement 
      :students="students"
      :plans="plans" :classes="classes"
      @change-data-student-component="changeDataStudentComponent"
      @change-data-classroom="changeDataClassroom"
      @change-page="changePage" :careers="careers" />
  </div>
</template>

<script>
import ListStudentManagement from '../../../components/StudentManagementComponent/ListStudentManagementComponent/ListStudentManagementComponent.vue';
import ComponentBase from '../../../components/common/component-base/ComponentBase.vue';
import StudentService from '../../../services/student/studentServices';
import AppConfig from '../../../../src/app.config.json';
import PlanService from '../../../services/plan/planServices';
import ClassService from '../../../services/class/classServices';
import CareerService from '../../../services/career/careerServices';

export default {
  name: "StudentManagement",
  extends: ComponentBase,
  components: {
    ListStudentManagement,
  },
  data() {
    return {
      students: [],
      plans: [],
      classes: [],
      careers: [],
      filter: {
        keyword: "",
        isDelete: false,
        status: "active",
        classId: "",
      },
    };
  },
  
  async mounted(){
    await this.getClassesFilterAsync();
    await this.getPlansFilterAsync();
    await this.getCareersFilterAsync();
    await this.getStudentsAsync();
  },
  
  methods:{
    async getClassesFilterAsync() {
      let filterClass = {
        courseId: "",
        isDelete: false,
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

    async getCareersFilterAsync(){
      let filterCareer = {
        trainingSystemId: "",
        isDelete: false,
        careersName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new CareerService()

      const response = await api.getCareersFilterAsync(filterCareer);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data;
    },

    async getPlansFilterAsync() {
      let filterPlan = {
        status: "",
        isDelete: false
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
    
    async getStudentsAsync() {
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getStudentsAsync(this.filter)
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
      await this.getStudentsAsync();
    },

    async changePage(currentPage) {
      await this.getStudentsAsync(currentPage);
    },

    async changeDataClassroom() {
      await this.getClassesFilterAsync();
    }
  }
}
</script>

<style lang='scss'>

</style>
