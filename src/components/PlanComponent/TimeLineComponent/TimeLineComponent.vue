<template src='./TimeLineComponent.html'>
</template>

<script>
import TimeLineDetailComponent from "../TimeLineDetailComponent/TimeLineDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import TimlineService from '../../../services/timeline/timelineServices'
import AppConfig from '../../../../src/app.config.json'
import CrudMixin from "../../../helpers/mixins/crudMixin";
import { TIME_LINE_ENUM } from "../../../config/constant";

export default {
  name: "TimeLineComponent",
  extends: ComponentBase,
  components: {
    TimeLineDetailComponent,
    ConfirmDialog,
  },
  mixins: [CrudMixin],
  props: {
    planGuid: {
      type: String,
      default: null,
    },
    plan: {
      type: Object,
      default: {},
    },
    userProfile: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      timeLines: [],
      editTimeLine: {},
      confirmTimeline: null,
      filterTimeLine: {
        planId: '',
      },
      timelineEnums: TIME_LINE_ENUM,
    };
  },

  async mounted(){
    await this.getTimeLinesAsync();
  },

  computed: {
    getUserProfile() {
      return this.userProfile;
    }
  },

  methods:{
    checkTimeLineExpired(time) {
      return new Date(time) <= new Date();
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
  }
}
</script>

<style lang="scss">
@import "./TimeLineComponent.scss";
</style>
