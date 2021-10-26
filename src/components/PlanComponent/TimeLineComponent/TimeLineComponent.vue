<template src='./TimeLineComponent.html'>
</template>

<script>
import TimeLineDetailComponent from "../TimeLineDetailComponent/TimeLineDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import TimlineService from '../../../services/timeline/timelineServices'
import AppConfig from '../../../../src/app.config.json'
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "TimeLineComponent",
  extends: ComponentBase,
  components: {
    TimeLineDetailComponent,
    ConfirmDialog,
  },
  mixins: [CrudMixin],
  props: {
    plans: {
      type: Array,
      default: null,
    },
    planGuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      timeLines: [],
      editTimeLine: {},
      confirmTimeline: null,
      filterTimeLine: {
        planId: '',
      },
    };
  },

  async mounted(){
    await this.getTimeLinesAsync();
  },

  methods:{
    checkTimeLineExpired(time) {
      return new Date(time) > new Date();
    },

    createTimeLine() {
      this.editTimeLine = {};
    },
    
    async getTimeLinesAsync(){
      let filterTimeLine = {
        timeLineName: "",
        internshipCourseId: this.planGuid,
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new TimlineService()

      const response = await api.getTimeLinesByInternshipCourseIdAsync(filterTimeLine);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.timeLines = response.data;
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

<style lang="scss">
@import "./TimeLineComponent.scss";
</style>