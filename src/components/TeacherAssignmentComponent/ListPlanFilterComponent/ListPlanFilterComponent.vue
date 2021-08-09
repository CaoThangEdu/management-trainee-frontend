<template src='./ListPlanFilterComponent.html'>
  
</template>

<script>
import PlanService from '../../../services/plan/planServices'
import AppConfig from '../../../../src/app.config.json'
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
export default {
  name: "ListPlanFilterComponent",
   extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      teachers: [],
      editTeacher: {},
      internshipCourse: [],
      internshipCourseFilter: {
        status: "",
        isDelete: false, 
      }
    
    };
  },
  async mounted(){
    await this.getInternshipCourseAsync();
  },
  methods:{    
    async getInternshipCourseAsync(){
      // Call Api
      this.showLoading();
      const api = new PlanService()
      const response = await api.getPlansAsync(this.internshipCourseFilter)
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.internshipCourse = response.data;
    },
  }
}
</script>

<style lang='scss'>
@import './ListPlanFilterComponent.scss';
</style>