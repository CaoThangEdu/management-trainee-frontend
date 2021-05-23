<template src='./TimeLineComponent.html'>
</template>

<script>
import TimeLineDetailComponent from "../TimeLineDetailComponent/TimeLineDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import TimlineService from '../../../services/timeline/timelineServices'
import PlanService from '../../../services/plan/planServices'
import AppConfig from '../../../../src/app.config.json'

export default {
  name: "TimeLineComponent",
  extends: ComponentBase,
  components: {
    TimeLineDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      timeLines: [],
      plans: [],
      editTimeLine: {},
      confirmTimeline: null,
    };
  },

  async mounted(){
    await this.getTimeLinesAsync()
    await this.getPlansAsync()
  },

  methods:{

    async getPlansAsync(){
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data.items
    },

    createTimeLine() {
      this.editTimeLine = {};
    },
    
    async getTimeLinesAsync(){
      // Call Api
      this.showLoading();
      const api = new TimlineService()

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
      this.timeLines = response.data.items
    },

    async changePage(currentPage) {
      await this.getTimeLinesAsync(currentPage);
    },

    updateTimeLine(index) {
      this.editTimeLine = Object.assign({}, this.timeLines[index]);
    },

    deleteTimeLine(id) {
      this.confirmTimeline = { id: id };
    },

    // Call api delete TimeLine
    async deleteTimelineConfirm(dataConfirm) {
      this.showLoading();
      let api = new TimlineService();
      let response = await api.deleteTimeLineAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getTimeLinesAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getTimeLinesAsync();
    },

    showNotification() {
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },
  }
}
</script>

<style lang='scss'>
@import './TimeLineComponent.scss';
</style>