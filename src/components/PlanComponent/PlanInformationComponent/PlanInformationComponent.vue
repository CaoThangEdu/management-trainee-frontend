<template src="./PlanInformationComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import AppConfig from '../../../../src/app.config.json'
import CourseService from '../../../services/course/courseServices'

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