<template src="./ListStudentManagementComponent.html">
  
</template>

<script>
import StudentManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
import AddStudentsFileComponent from "../AddStudentsFileComponent/AddStudentsFileComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import PlanService from '../../../services/plan/planServices'
import ClassService from '../../../services/class/classServices'
import JwPagination from 'jw-vue-pagination';

export default {
  name: "ListStudentManagementComponent",
  extends: ComponentBase,
  components: {
    StudentManagementDetailComponent,
    AddStudentsFileComponent,
    ConfirmDialog,
    Pagination,
    JwPagination,
  },
  data() {
    return {
      students: [],
      editStudent: {},
      addStudents: {},
      plans: [],
      classes: [],
      confirmStudent: null,
      metaDataFile: [],
      internCourceName: null,
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
    await this.getStudentsAsync()
    await this.getPlansAsync()
    await this.getClassesAsync()
  },
  
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    getClassName(classId){
      for (const x in this.classes) {
        if(this.classes[x].id == classId){
          return this.classes[x].className
        }
      }
    },

    async getClassesAsync(){
      // Call Api
      this.showLoading();
      const api = new ClassService()

      const response = await api.getClassesAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classes = response.data.items
    },

    getPlanName(planId){
      for(const index in this.plans){
        if(planId == this.plans[index].id){
          return this.plans[index].internshipCourceName
        }
      }
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

    createStudent() {
      this.editStudent = {};
    },

    createStudentsFile() {
      this.addStudents = {};
    },

    async changeData() {
      await this.getClassesAsync()
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
    async deleteStudentConfirm(studentComfirm) {
      this.showLoading();
      let api = new StudentService();
      let response = await api.deleteStudentAsync(studentComfirm.id); // Gọi Api
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
  }
}
</script>

<style lang='scss'>
@import './ListStudentManagementComponent.scss';
.btn-add-file{
  margin-right: 10px;
}
</style>