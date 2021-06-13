<template src='./PlanDetailComponent.html'>
  
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase"
import BaseModal from '../../../components/common/base-modal/BaseModal'

import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import PlanService from '../../../services/plan/planServices'
import PlanViewModel from "../../../view-model/plan/planViewModel"
import AppConfig from '../../../../src/app.config.json'
import CourseService from '../../../services/course/courseServices'
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import CareerService from '../../../services/career/careerServices'

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
      trainingSystems: [],
      careers: [],
      errorMessages: [],
      careersFilter: {
        careersName: "",
        trainingSystemId: "",
        isDelete: false
      },
       courseFilter: {
        courseName: "",
        careersId: "",
        isDelete: false
      }

    }
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  async mounted(){
    await this.getTrainingSystemsAsync()
    await this.getAllCoursesAsync()
    await this.getCareersAsync()
  },
  
  methods:{
    getName(objName, id){
      for (const x in objName) {
        if(objName[x].id == id){
          return objName[x].trainingSystemName
        }
      }
    },

    getNameCourse(objName, id){
      for (const x in objName) {
        if(objName[x].id == id){
          return objName[x].courseName
        }
      }
    },

    async getTrainingSystemsAsync(){
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getAllTrainingSystemsAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingsystems = response.data.items
    },

    async getCareersAsync(trainingSystemId){
      // Call Api
      //this.showLoading();
      const api = new CareerService()    
      this.careersFilter.trainingSystemId= trainingSystemId
      const response = await api.Filter(this.careersFilter)
      //this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data
    },

    async getCoursesAsync(careersId){
      // Call Api
      //this.showLoading();
      const api = new CourseService()
      this.courseFilter.careersId = careersId
      console.log(this.courseFilter.careersId)
      const response = await api.Filter(this.courseFilter)
      //this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.courses = response.data
      console.log(this.courses)
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
      this.plan.status ="Đang chuẩn bị";
      this.plan.internshipCourseName = 
      this.getName(this.trainingSystems, this.plan.trainingSystemId)
      + '-' + this.getNameCourse(this.courses, this.plan.courseId) 
      + '-' + this.getName(this.careers,this.plan.careersId);

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
      this.plan.internshipCourseName = 
      this.getName(this.trainingSystems, this.plan.trainingSystemId)
      + '-' + this.getNameCourse(this.courses, this.plan.courseId) 
      + '-' + this.getName(this.careers,this.plan.careersId);

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