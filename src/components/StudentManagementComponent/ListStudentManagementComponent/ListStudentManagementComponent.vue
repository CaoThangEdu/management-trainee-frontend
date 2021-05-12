<template src="./ListStudentManagementComponent.html">
  
</template>

<script>
import StudentManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import PlanService from '../../../services/plan/planServices'
import XLSX from 'xlsx'

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
      editStudent: {},
      plans: [],
      confirmStudent: null,
      metaDataFile: [],
      internCourceName: null,
    };
  },
  
  async mounted(){
    await this.getStudentsAsync()
    await this.getPlansAsync()
  },
  methods:{
    async previewFiles(e) {
      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      this.showLoading();
      var id = this.internCourceName
      console.log('id dot 1', this.internCourceName);
      reader.onload = async function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        let sheetName = workbook.SheetNames[0]
        /* DO SOMETHING WITH workbook HERE */
        console.log(workbook);
        let worksheet = workbook.Sheets[sheetName];
        this.metaDataFile = XLSX.utils.sheet_to_json(worksheet);
        console.log('file json 1', this.metaDataFile);
        for (let i = 0; i < this.metaDataFile.length; i++){
          console.log('id dot', id);
          // this.showLoading();
          this.metaDataFile[i].internshipCourseId = id;
          let api = new PlanService();
          let response = await api.createPlanAsync(this.metaDataFile[i]);
          // this.showLoading(false);
          if(!response.isOK){
            return;
          }
          console.log('Thành công')
        }
      };
      reader.readAsArrayBuffer(f);
      console.log('file json 2', this.metaDataFile);
      this.showLoading(false);
    },

    async getPlansAsync(){
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data.items
    },

    createBrand() {
      this.editStudent = {};
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
      this.editStudent = Object.assign({}, this.students[index]);
    },
    deleteStudent(id) {
      this.confirmStudent = { id: id };
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