<template src="./TimeLineDetailComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import PlanService from '../../../services/plan/planServices'
import TimeLineService from '../../../services/timeline/timelineServices'
import TimeLineViewModel from "../../../view-model/timeline/timelineViewModel"
import AppConfig from '../../../../src/app.config.json'

export default {
  name: 'TimeLineDetailComponent',
  extends: ComponentBase,
  components: { 
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      timeline: {},
      plans: [],
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
    await this.getPlansAsync()
  },

  methods:{
    async getPlansAsync(){
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

    async getTimeLinesAsync(){
      // Call Api
      this.showLoading();
      const api = new TimeLineService()

      const response = await api.getTimeLinesAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.timeline = response.data.items
    },

    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.timeline = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createTimeLineAsync() {
      this.timeline.status = 'active';
      this.showLoading();
      let api = new TimeLineService();
      let response = await api.createTimeLineAsync(this.timeline);
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

    async updateTimeLineAsync() {
      this.showLoading();
      let api = new TimeLineService();
      let response = await api.updateTimeLineAsync(this.timeline);
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
      let viewModel = new TimeLineViewModel();
      viewModel.setFields(this.timeline);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.timeline.id === undefined){
        await this.createTimeLineAsync();
      } else{
        await this.updateTimeLineAsync();
      }
    }
  },
  watch: {
    data() {
      this.isShow = true;
      this.timeline = this.data;
    }
  }
}
</script>

<style lang="scss">
@import './TimeLineDetailComponent.scss';
</style>