<template src='./ListCareerManagementComponent.html'>
  
</template>

<script>
import CareerManagementDetailComponent from '../CareerManagementDetailComponent/CareerManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CareerService from '../../../services/career/careerServices'
import AppConfig from '../../../../src/app.config.json'
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ListCareerManagementComponent",
  extends: ComponentBase,
  components: {
    CareerManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      careers: [],
      editCareer: {},
      confirmCareer: null,
      metaDataFile: [],
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      trainingSystems: [],
      filter: {
        trainingSystemId: "",
        isDelete: false,
        careersName: "",
        status: "",
      },
    };
  },

  async mounted(){
    await this.getCareersFilterAsync();
    await this.getTrainingSystemsFilterAsync();    
  },
  
  methods:{
    getTrainingSystemName(trainingSystemId, list) {
      return CrudMixin.methods.getInfo(trainingSystemId, list);
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    
    createCareer() {
      this.editCareer = {};
    },
    
    async getCareersFilterAsync(){
      // Call Api
      this.showLoading();
      const api = new CareerService()

      const response = await api.getCareersFilterAsync(this.filter);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data;
    },

    async getTrainingSystemsFilterAsync() {
      let filterTrainingSystem = {
        trainingSystemName: "",
        isDelete: false,
        status: "active",
      }
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsFilterAsync(filterTrainingSystem);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems = response.data;
    },

    async changePage(currentPage) {
      await this.getCareersFilterAsync(currentPage);
    },

    updateCareer(index) {
      this.editCareer = Object.assign({}, this.pageOfItems[index]);
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
      await this.getCareersFilterAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      this.$emit("change-career");
      await this.getCareersFilterAsync();
    },

    // Call api delete TrainingSystem
    async updateStatus(index) {
      let career = this.pageOfItems[index];
      if (career.status === 'active') {
        career.status = 'unactive';
      } else {
        career.status = 'active';
      }
      this.showLoading();
      let api = new CareerService();
      let response = await api.updateCareerAsync(career);
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
      await this.getCareersFilterAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListCareerManagementComponent.scss';
</style>