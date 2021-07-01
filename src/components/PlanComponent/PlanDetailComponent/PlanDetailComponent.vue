<template src='./PlanDetailComponent.html'>
  
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase"
import BaseModal from '../../../components/common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import PlanService from '../../../services/plan/planServices'
import PlanViewModel from "../../../view-model/plan/planViewModel"
import AppConfig from '../../../../src/app.config.json'
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: 'PlanDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      isShow: false,
      plan: {},
      errorMessages: [],
      typeShowDetail: null,
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    courses: {
      type: Array,
      default: null,
    },
    trainingSystems: {
      type: Array,
      default: null,
    },
    careers: {
      type: Array,
      default: null,
    },
    showDetail: {
      type: String,
      default: null,
    },
  },
  
  methods:{
    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
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
      this.plan.internshipCourseName = 
      this.getInfoObject(this.getInfoObject(
        this.getInfoObject(this.plan.courseId,
        this.courses).careersId, this.careers).trainingSystemId, 
        this.trainingSystems).trainingSystemName      
        + ' - '
        + this.getInfoObject(this.getInfoObject(this.plan.courseId,
          this.courses).careersId, this.careers).careersName
        + ' - '
        + this.getInfoObject(this.plan.courseId, this.courses).courseName;

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
      this.getInfoObject(this.getInfoObject(
        this.getInfoObject(this.plan.courseId,
        this.courses).careersId, this.careers).trainingSystemId, 
        this.trainingSystems).trainingSystemName      
        + ' - '
        + this.getInfoObject(this.getInfoObject(this.plan.courseId,
          this.courses).careersId, this.careers).careersName
        + ' - '
        + this.getInfoObject(this.plan.courseId, this.courses).courseName;
        
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
      this.typeShowDetail = this.showDetail;
    }
  }
}
</script>

<style lang="scss">
@import './PlanDetailComponent.scss';
</style>