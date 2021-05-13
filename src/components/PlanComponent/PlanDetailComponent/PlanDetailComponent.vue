<template src="./PlanDetailComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import PlanService from '../../../services/plan/planServices'
import PlanViewModel from "../../../view-model/plan/planViewModel"
import AppConfig from '../../../../src/app.config.json'
import CourseService from '../../../services/course/courseServices'

export default {
  name: 'PlanDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    },
  data() {
    return {
      isShow: false,
      plan: {},
      courses:[],
      students: [],
      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  async mounted(){
    await this.getCoursesAsync()
  },
  
  methods:{
    async getCoursesAsync(){
      // Call Api
      this.showLoading();
      const api = new CourseService()

      const response = await api.getCoursesAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.courses = response.data.items
    },

    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.plan = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createPlanAsync() {
      this.showLoading();
      let api = new PlanService();
      this.plan.internshipCourceName = this.plan.trainingSystems + '-' +this.plan.course + '-' + this.plan.careers;
      let response = await api.createPlanAsync(this.plan);
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );

      this.closeModal(true);
    },

    async updatePlanAsync() {
      this.showLoading();
      this.plan.internshipCourceName = this.plan.trainingSystems + '-' +this.plan.course + '-' + this.plan.careers;
      let api = new PlanService();
      let response = await api.updatePlanAsync(this.plan);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );

      this.closeModal(true);
    },

    async save() {
      // validate
      let viewModel = new PlanViewModel();
      viewModel.setFields(this.plan);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.plan.id === undefined){
        await this.createPlanAsync();
      } else{
        await this.updatePlanAsync();
      }
    },
  },

  watch: {
    data() {
      this.isShow = true;
      this.plan = this.data;
    }
  }
}
</script>

<style lang="scss">
@import './PlanDetailComponent.scss';
</style>