<template src="./ListClassManagementComponent.html">
  
</template>

<script>
import ClassManagementDetailComponent from "../ClassManagementDetailComponent/ClassManagementDetailComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import ClassService from "../../../services/class/classServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import PlanService from '../../../services/plan/planServices';

export default {
  name: "ListClassManagementComponent",
  extends: ComponentBase,
  components: { 
    ClassManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      classes: [],
      editClass: {},
      confirmClassRoom: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">"
      },
      filter: {
        internshipCourseId: "",
        isDelete: false,
        className: "",
        status: "active",
      },
      plans: [],
    };
  },

  async mounted(){
    await this.getClassesFilterAsync();
    await this.getPlansAsync();
  },

  methods:{
    async getPlansAsync(){
      let planFilter = {
        status: "",
        isDelete: false
      };
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync(planFilter);
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

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async updateStatus(index) {
      let classRoom = this.pageOfItems[index];
      if (classRoom.status === "active") {
        classRoom.status = "unactive";
      } else {
        classRoom.status = "active";
      }
      this.showLoading();
      let api = new ClassService();
      let response = await api.updateClassAsync(classRoom);
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
      this.getClassesFilterAsync();
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createClass() {
      this.editClass = {};
    },
    
    async getClassesFilterAsync(){
      // Call Api
      this.showLoading();
      const api = new ClassService()

      const response = await api.getClassesFilterAsync(this.filter);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classes = response.data;
    },

    async changePage(currentPage) {
      await this.getClassesFilterAsync(currentPage);
    },

    updateClass(index) {
      this.editClass = Object.assign({}, this.pageOfItems[index]);
    },

    deleteClass(id) {
      this.confirmClassRoom = { id: id };
    },

    // Call api delete Class
    async deleteClassConfirm(classComfirm) {
      this.showLoading();
      let api = new ClassService();
      let response = await api.deleteClassAsync(classComfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getClassesFilterAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getClassesFilterAsync();
    },
  }
}
</script>

<style lang="scss">
@import "./ListClassManagementComponent.scss";
</style>