<template src="./TimeLineDetailComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from '../../common/base-modal/BaseModal';
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import PlanService from '../../../services/plan/planServices';
import TimeLineService from '../../../services/timeline/timelineServices';
import TimeLineViewModel from "../../../view-model/timeline/timelineViewModel";
import AppConfig from '../../../../src/app.config.json';
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
import moment from "moment";

export default {
  name: 'TimeLineDetailComponent',
  extends: ComponentBase,
  components: { 
    BaseModal,
    AlertMessages,
    DatePicker,
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
    planGuid: {
      type: String,
      default: null,
    },
  },

  async mounted(){
    await this.getPlansAsync();
  },

  methods:{
    getPlanName(id) {
      return this.plans.find(plan => plan.id == id);
    },

    changeTimeLineDay() {
      let planStartDay = new Date(this.getPlanName(this.timeline.internshipCourseId).startDay);
      this.timeline.startDay = planStartDay;
      if (planStartDay < new Date()) {
        this.timeline.endDay = moment().add(+4, "M").toDate();
        return;
      }
      let dob = moment().add(+4, "M").toDate();
      dob.setDate((new Date(planStartDay).getDate()));
      dob.setFullYear((new Date(planStartDay).getFullYear()));
      this.timeline.endDay = new Date(moment(new Date(dob)).format('DD/MM/YYYY'));
    },

    hidePastDates(date) {
      return date > this.timeline.endDay || date < new Date();
    },

    displayBetweenFromDateAndPastDates(date) {
      const day = new Date(this.timeline.startDay);
      return date < day;
    },
    async getPlansAsync(){
      let filterPlan = {
        status: "",
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
      this.timeline.internshipCourseId = this.planGuid;
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
      if (Object.keys(this.data).length == 0) {
        this.timeline = {
          timeLineName: "",
          description: "",
          startDay: new Date(),
          endDay: moment()
            .add(+4, "M")
            .toDate(),
          internshipCourseId: "",
          status: "active",
        };
        return;
      }
      this.timeline = this.data;
      this.timeline.startDay =  new Date(this.timeline.startDay);
      this.timeline.endDay = new Date(this.timeline.endDay);
    }
  }
}
</script>