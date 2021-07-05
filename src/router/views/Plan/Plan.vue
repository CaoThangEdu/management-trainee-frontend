<template>
<div class="row">
  <div class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
      <PlanningStepsComponent :isActiveStep="isActiveStep" />
    </div>
    <!-- <div class="col-lg-4 col-md-12 col-sm-12 col-12">
      <TimeLineComponent />
    </div> -->
    <div>
      <ListPlanComponent :plans="plans" :courses="courses"
        :trainingSystems="trainingSystems" :careers="careers"
        @change-data-plan-component="updateDataPlan"
        @change-page="changePage" 
        @change-data-career="changeDataCareer" 
        @change-data-course="changeDataCourse"
        @change-data-training-system="changeDataTrainingSystem" />
    </div>
  </div>
</div>
</template>

<script>
import ListPlanComponent from '../../../components/PlanComponent/ListPlanComponent/ListPlanComponent'
// import TimeLineComponent from '../../../components/PlanComponent/TimeLineComponent/TimeLineComponent'
import ComponentBase from '../../../components/common/component-base/ComponentBase.vue'
import PlanService from '../../../services/plan/planServices'
import AppConfig from '../../../../src/app.config.json'
import CourseService from '../../../services/course/courseServices'
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import CareerService from '../../../services/career/careerServices'
import PlanningStepsComponent from '../../../components/planningStepsComponent/planningStepsComponent.vue'

export default {
  name: 'Plan',
  extends: ComponentBase,
  components: {
    ListPlanComponent,
    PlanningStepsComponent,
    // TimeLineComponent
  },

  data() {
    return {
      plans: [],
      courses:[],
      trainingSystems: [],
      careers: [],
      filter: {
        status: "",
        isDelete: false
      },
      changeDataPlan: false,
      isActiveStep:"1",
    };
  },

  async mounted(){
    await this.getPlansAsync();
    await this.getTrainingSystemsFilterAsync();
    await this.getCoursesFilterAsync();
    await this.getCareersFilterAsync();
  },

  methods:{    
    async getPlansAsync(){
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync(this.filter)
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

    async getTrainingSystemsFilterAsync() {
      let filterTrainingSystem = {
        trainingSystemName: "",
        isDelete: false,
        status: "active",
      }
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsFilterAsync(filterTrainingSystem);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems = response.data;
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

    async updateDataPlan() {
      this.changeDataPlan = true;
      await this.getPlansAsync();
      // await this.getTrainingSystemsFilterAsync();
    },

    async changeDataCareer() {
      await this.getCareersFilterAsync();
    },

    async changePage(currentPage) {
      await this.getPlansAsync(currentPage);
    },

    async changeDataCourse() {
      await this.getCoursesFilterAsync();
    },

    async changeDataTrainingSystem() {
      await this.getTrainingSystemsFilterAsync();
    }
  }
}
</script>

<style>

</style>
