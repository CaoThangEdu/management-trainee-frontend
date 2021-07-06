<template>
  <div>
    <PlanningStepsComponent :isActiveStep="isActiveStep" />
    <ListStudentManagement 
      :students="students" :courses="courses"
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
import PlanningStepsComponent from '../../../components/planningStepsComponent/planningStepsComponent.vue';
import CourseService from '../../../services/course/courseServices';
import CareerService from '../../../services/career/careerServices';

export default {
  name: "StudentManagement",
  extends: ComponentBase,
  components: {
    ListStudentManagement,
    PlanningStepsComponent,
  },
  data() {
    return {
      students: [],
      plans: [],
      classes: [],
      courses:[],
      careers: [],
      filter: {
        keyword: "",
        isDelete: false,
        status: "active",
        classId: "",
      },
      isActiveStep:"2",
    };
  },
  
  async mounted(){
    await this.getClassesFilterAsync();
    await this.getPlansFilterAsync();
    await this.getCareersFilterAsync();
    await this.getStudentsAsync();
    await this.getCoursesFilterAsync();
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
    
    async getCoursesFilterAsync() {
      let filterCourse = {
        careersId: "",
        isDelete: false,
        courseName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new CourseService();

      const response = await api.getCoursesFilterAsync(filterCourse);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.courses = response.data;
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
