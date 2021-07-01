<template src="./ListPlanComponent.html">
</template>

<script>
import PlanDetailComponent from "../PlanDetailComponent/PlanDetailComponent";
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog" 
import PlanService from '../../../services/plan/planServices'
import AppConfig from '../../../../src/app.config.json'
import CourseService from '../../../services/course/courseServices'
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import CareerService from '../../../services/career/careerServices'

export default {
  name: "ListPlan",
  extends: ComponentBase,
  components: {
    PlanDetailComponent,
    ConfirmDialog,
  },
  data() {
    return {
      plans: [],
      editPlan: {},
      detailPlan: {},
      confirmPlan: null,
      courses:[],
      trainingSystems: [],
      careers: [],
      renderPlanDetail: true,
      renderPlanInfo: true,
      showDetail: null,
      filter: {
        status: "",
        isDelete: false
      },
    };
  },

  async mounted(){
    await this.getPlansAsync()
    await this.getTrainingSystemsFilterAsync()
    await this.getCoursesFilterAsync()
    await this.getCareersFilterAsync()
  },


  methods:{
    createPlan() {
      this.showDetail = 'edit';
      this.editPlan = {};
    },
    
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

    async changePage(currentPage) {
      await this.getPlansAsync(currentPage);
    },

    updatePlan(index, detail) {
      this.showDetail = detail;
      this.renderPlanDetail = false;
      this.$nextTick(() => {
        this.renderPlanDetail = true;
        this.editPlan = Object.assign({}, this.plans[index]);
      });
    },

    showdetailPlan(index) {
      this.renderPlanInfo = false;
      this.$nextTick(() => {
        this.renderPlanInfo = true;
      });
      this.detailPlan = Object.assign({}, this.plans[index]);
    },

    deletePlan(id) {
      this.confirmPlan = { id: id };
    },

    // Call api delete Plan
    async deletePlanConfirm(planComfirm) {
      this.showLoading();
      let api = new PlanService();
      let response = await api.deletePlanAsync(planComfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getPlansAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getPlansAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListPlanComponent.scss'
</style>