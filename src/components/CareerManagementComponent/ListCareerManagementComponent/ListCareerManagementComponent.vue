<template src='./ListCareerManagementComponent.html'>
  
</template>

<script>
import CareerManagementDetailComponent from '../CareerManagementDetailComponent/CareerManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import CareerService from '../../../services/career/careerServices'
import AppConfig from '../../../../src/app.config.json'

export default {
  name: "ListCareerManagementComponent",
  extends: ComponentBase,
  components: {
    CareerManagementDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      careers: [],
      editCareer: {},
      confirmCareer: null,
      metaDataFile: [],
    };
  },

  async mounted(){
    await this.getCareersAsync()
  },
  
  methods:{
    createCareer() {
      this.editCareer = {};
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

    async changePage(currentPage) {
      await this.getCareersAsync(currentPage);
    },

    updateCareer(index) {
      this.editCareer = Object.assign({}, this.careers[index]);
    },

    deleteCareer(id) {
      this.confirmCareer = { id: id };
    },

    // Call api delete Career
    async deleteCareerConfirm(careerComfirm) {
      this.showLoading();
      let api = new CareerService();
      let response = await api.deleteCareerAsync(careerComfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getCareersAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getCareersAsync();
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
@import './ListCareerManagementComponent.scss';
</style>