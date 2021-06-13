<template src="./PlanInformationComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import AppConfig from '../../../../src/app.config.json'
import CourseService from '../../../services/course/courseServices'
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import CareerService from '../../../services/career/careerServices'

export default {
  name: 'PlanInformationComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    },
  data() {
    return {
      isShowPlan: false,
      plan: {},
      courses:[],
      trainingsystems: [],
      careers: [],
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
    await this.getTrainingSystemsAsync()
    await this.getAllCoursesAsync()
    await this.getCareersAsync()
  },
  
  methods:{
    checkStatus(status){
      if (status == 'new') {
        return 'Mới lập'
      } else if (status == 'start') {
        return 'Bắt đầu thực tập'
      } else if (status == 'point') {
        return 'Chấm điểm'
      }
      return 'Kết thúc thực tập'
    },

    async getTrainingSystemsAsync(){
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsAsync()
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

    async getCareersAsync(){
      // Call Api
      this.showLoading();
      const api = new CareerService()

      const response = await api.getCareersAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data.items
    },

    getName(objName, id){
      for (const x in objName) {
        if(objName[x].id == id){
          return objName[x].name
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

    async getAllCoursesAsync(){
      // Call Api
      this.showLoading();
      const api = new CourseService()

      const response = await api.getAllCoursesAsync()
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
      this.isShowPlan = false;
      this.plan = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },
  },

  watch: {
    data() {
      this.isShowPlan = true;
      this.plan = this.data;
    }
  }
}
</script>

<style lang="scss">
@import './PlanInformationComponent.scss';
</style>