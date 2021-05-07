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
      listStudent: [],
      editData: {},
      confirmData: null,
    };
  },
  async mounted(){
    console.log('Call API')
    await this.getListStudent()
  },
  methods:{
    createBrand() {
      this.editData = {};
    },
    async changeData() {
      await this.getListStudent();
    },
    async getListStudent(){
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getListStudentAsync()
      this.showLoading(false);

      if(response.isOK){
        this.listStudent = response.data.items
      } else{
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
    },
    async changePage(currentPage) {
      await this.getListStudent(currentPage);
    },
    updateStudent(index) {
      this.editData = Object.assign({}, this.listStudent[index]);
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
      if (response.isOK) {
        await this.getListStudent();
        // this.showNotifications(
        //   "success",
        //   this.$t("notification.title-default"),
        //   this.$t("notification.content-deleted-success-default")
        // );
      } else {
        // this.showNotifications(
        //   "error",
        //   this.$t("notification.title-default"),
        //   response.errorMessages
        // );
      }
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