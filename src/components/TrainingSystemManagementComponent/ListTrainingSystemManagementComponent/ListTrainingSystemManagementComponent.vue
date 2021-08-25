<template src='./ListTrainingSystemManagementComponent.html'>
</template>

<script>
import TrainingSystemManagementDetailComponent from '../TrainingSystemManagementDetailComponent/TrainingSystemManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import FacultyServices from '../../../services/faculty/facultyServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ListTrainingSystemManagementComponent",
  extends: ComponentBase,
  components: {
    TrainingSystemManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      trainingSystems: [],
      editTrainingSystem: {},
      confirmTrainingSystem: null,
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        trainingSystemName: "",
        isDelete: false,
        status: "active",
      },
      faculties: [],
    };
  },

  async mounted() {
    await this.getTrainingSystemsFilterAsync();
    await this.getFacultiesFilterAsync();
  },

  methods: {
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createTrainingSystem() {
      this.editTrainingSystem = {};
    },

    async getTrainingSystemsFilterAsync() {
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsFilterAsync(this.filter);
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

    async getFacultiesFilterAsync() {
      let facultyFilter = {
        "isDelete": false
      };
      // Call Api
      this.showLoading();
      const api = new FacultyServices()

      const response = await api.getFacultiesFilterAsync(facultyFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties = response.data;
    },

    async changePage(currentPage) {
      await this.getTrainingSystemsAsync(currentPage);
    },

    updateTrainingSystem(index) {
      this.editTrainingSystem = Object.assign({}, this.pageOfItems[index]);
    },

    changeIsdelete(index) {
      this.editTrainingSystem = Object.assign({}, this.pageOfItems[index]);
    },

    deleteTrainingSystem(item) {
      this.confirmTrainingSystem = {item: item};
    },

    // Call api delete TrainingSystem
    async deleteTrainingSystemConfirm(trainingSystem) {
      trainingSystem.item.isDelete = true;
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.updateTrainingSystemAsync(trainingSystem.item);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems = this.trainingSystems.filter(
      trainingSystem => trainingSystem.id != response.data.id);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_status_success_default}`
      );
    },

    async updateStatus(index) {
      let trainingSystem = this.pageOfItems[index];
      if (trainingSystem.status === 'active') {
        trainingSystem.status = 'unactive';
      } else {
        trainingSystem.status = 'active';
      }
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.updateTrainingSystemAsync(trainingSystem);
      this.showLoading(false);

      if (!response.isOK) {
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
        `${AppConfig.notification.content_updated_status_success_default}`
      );
      this.getTrainingSystemsFilterAsync();
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    async changeData() {
      this.$emit("change-training-system");
      await this.getTrainingSystemsFilterAsync();
    },
  }
}
</script>

<style lang="scss">
@import './ListTrainingSystemManagementComponent.scss';
</style>
