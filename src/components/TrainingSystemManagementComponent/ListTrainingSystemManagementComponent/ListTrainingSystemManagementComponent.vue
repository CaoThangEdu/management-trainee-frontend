<template src='./ListTrainingSystemManagementComponent.html'>
  
</template>

<script>
import TrainingSystemManagementDetailComponent from '../TrainingSystemManagementDetailComponent/TrainingSystemManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import AppConfig from '../../../../src/app.config.json'

export default {
  name: "ListTrainingSystemManagementComponent",
  extends: ComponentBase,
  components: {
    TrainingSystemManagementDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      trainingsystems: [],
      editTrainingSystem: {},
      confirmTrainingSystem: null,
      metaDataFile: [],
      filter: {
        trainingSystemName: "",
        isDelete: false
      }
    };
  },

  async mounted(){
    await this.getTrainingSystemsAsync()
  },
  
  methods:{
    createTrainingSystem() {
      this.editTrainingSystem = {};
    },
    
    async getTrainingSystemsAsync(){
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()
      const response = await api.getTrainingSystemsAsync(this.filter)
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingsystems = response.data
    },

    async changePage(currentPage) {
      await this.getTrainingSystemsAsync(currentPage);
    },

    updateTrainingSystem(index) {
      this.editTrainingSystem = Object.assign({}, this.trainingsystems[index]);
    },

    changeIsdelete(index) {
           this.editTrainingSystem = Object.assign({}, this.trainingsystems[index]);
    },

    deleteTrainingSystem(id) {
      this.confirmTrainingSystem = { id: id };
    },

   
    // Call api delete TrainingSystem
   
     async updateIsDelete(index) {
      let trainingSystem = this.trainingsystems[index];
      if(trainingSystem.isDelete === true) {
        trainingSystem.isDelete = false;
      }
      else {
        trainingSystem.isDelete = true;
      }
       this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.updateTrainingSystemAsync(trainingSystem);
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
      this.getTrainingSystemsAsync();

    },
    async changeData() {
      await this.getTrainingSystemsAsync();
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
@import './ListTrainingSystemManagementComponent.scss';
</style>