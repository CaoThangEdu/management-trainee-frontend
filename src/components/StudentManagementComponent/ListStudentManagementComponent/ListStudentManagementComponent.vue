<template src="./ListStudentManagementComponent.html">
  
</template>

<script>
import StudentManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'


export default {
  name: "ListStudentManagementComponent",
  extends: ComponentBase,
  components: {
    StudentManagementDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      students: [],
      editData: {},
      confirmData: null,
    };
  },
  async mounted(){
    await this.getStudentsAsync()
  },
  methods:{
    createBrand() {
      this.editData = {};
    },
    async changeData() {
      await this.getStudentsAsync();
    },
    async getStudentsAsync(){
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getStudentsAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data.items
    },
    async changePage(currentPage) {
      await this.getStudentsAsync(currentPage);
    },
    updateStudent(index) {
      this.editData = Object.assign({}, this.students[index]);
    },
    deleteStudent(id) {
      this.confirmData = { id: id };
    },
    // Call api delete student
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new StudentService();
      let response = await api.deleteStudentAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getStudentsAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
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
@import './ListStudentManagementComponent.scss';
.btn-add-file{
  margin-right: 10px;
}
</style>