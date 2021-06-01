<template src='./ListTrainingSystemManagementComponent.html'>
  
</template>

<script>
import TrainingSystemManagementDetailComponent from '../TrainingSystemManagementDetailComponent/TrainingSystemManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';

export default {
  name: "ListTrainingSystemManagementComponent",
  extends: ComponentBase,
  components: {
    TrainingSystemManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  data() {
    return {
      trainingsystems: [],
      editTrainingSystem: {},
      confirmTrainingSystem: null,
      metaDataFile: [],
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
    };
  },

  async mounted(){
    await this.getTrainingSystemsAsync()
  },
  
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    
    createTrainingSystem() {
      this.editTrainingSystem = {};
    },
    
    async getTrainingSystemsAsync(){
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingsystems = response.data.items
    },

    async changePage(currentPage) {
      await this.getTrainingSystemsAsync(currentPage);
    },

    updateTrainingSystem(index) {
      this.editTrainingSystem = Object.assign({}, this.trainingsystems[index]);
    },

    deleteTrainingSystem(id) {
      this.confirmTrainingSystem = { id: id };
    },

    // Call api delete TrainingSystem
    async deleteTrainingSystemConfirm(TrainingSystemComfirm) {
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.deleteTrainingSystemAsync(TrainingSystemComfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getTrainingSystemsAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
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