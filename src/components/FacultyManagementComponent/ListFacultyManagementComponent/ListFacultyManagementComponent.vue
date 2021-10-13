<template src='./ListFacultyManagementComponent.html'>
  
</template>

<script>
import FacultyManagementDetailComponent from '../FacultyDetailComponent/FacultyDetailComponent.vue'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import FacultyService from '../../../services/faculty/facultyServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ListFacultyManagementComponent",
  extends: ComponentBase,
  components: {
    FacultyManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      faculties: [],
      editFaculty: {},
      confirmFaculty: null,
      metaDataFile: [],
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        facultyName: "",
      },
    };
  },

  async mounted(){
    await this.getFacultiesFilterAsync();
  },
  
  methods:{
    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    
    createFaculty() {
      this.editFaculty = {};
    },
    
    async getFacultiesFilterAsync(){
      // Call Api
      this.showLoading();
      const api = new FacultyService()

      const response = await api.getFacultiesFilterAsync(this.filter);
      this.showLoading(false);

      if(!response.isOK){
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
      await this.getFacultiesFilterAsync(currentPage);
    },

    updateFaculty(index) {
      this.editFaculty = Object.assign({}, this.pageOfItems[index]);
    },

    deleteFaculty(item) {
      this.confirmFaculty = { item: item };
    },

    // Call api delete Faculty
    async deleteFacultyConfirm(facultyComfirm) {
      this.showLoading();
      let api = new FacultyService();
      let response = await api.deleteFacultyAsync(facultyComfirm.item.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties.splice(facultyComfirm.item.id, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      this.$emit("change-faculty");
      await this.getFacultiesFilterAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListFacultyManagementComponent.scss';
</style>