<template src="./ListStudentManagementComponent.html">
  
</template>

<script>
import StudentManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
import AddStudentsFileComponent from "../AddStudentsFileComponent/AddStudentsFileComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import PlanService from '../../../services/plan/planServices'
import ClassService from '../../../services/class/classServices'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ListStudentManagementComponent",
  extends: ComponentBase,
  components: {
    StudentManagementDetailComponent,
    AddStudentsFileComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      students: [],
      editStudent: {},
      addStudents: {},
      plans: [],
      classes: [],
      confirmStudent: null,
      metaDataFile: [],
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        keyword: "",
        isDelete: false,
        status: "active",
        classId: "",
      }
    };
  },
  
  async mounted(){
    await this.getClassesFilterAsync();
    await this.getPlansFilterAsync();
    await this.getStudentsAsync();
  },
  
  methods:{
    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    getInfoByCourseId(courseId, list){
      return CrudMixin.methods.getInfoByCourseId(courseId, list)
    },

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

    async getClassesFilterAsync(){
      let filterClass = {
        courseId: "",
        isDelete: false,
        className: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new ClassService()

      const response = await api.getClassesFilterAsync(filterClass);
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

    async getPlansFilterAsync(){
      let filterPlan = {
        status: "",
        isDelete: false
      };
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync(filterPlan)
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

    createStudent() {
      this.editStudent = {};
    },

    createStudentsFile() {
      this.addStudents = {};
    },

    async changeData() {
      await this.getStudentsAsync();
      await this.getPlansFilterAsync();
      await this.getClassesFilterAsync();
    },
    
    async getStudentsAsync(){
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getStudentsAsync(this.filter)
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data
    },

    async changePage(currentPage) {
      await this.getStudentsAsync(currentPage);
    },

    updateStudent(index) {
      this.editStudent = Object.assign({}, this.pageOfItems[index]);
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    // Call api delete Student
    async updateIsDeleteStatus(index) {
      let student = this.pageOfItems[index];
      student.isDelete = true;
      this.showLoading();
      let api = new StudentService();
      let response = await api.updateStudentAsync(student);
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
      this.getStudentsAsync();
    },
    async updateStatus(index) {
      let student = this.pageOfItems[index];
      if (student.status === 'active') {
        student.status = 'unactive';
      } else {
        student.status = 'active';
      }
      this.showLoading();
      let api = new StudentService();
      let response = await api.updateStudentAsync(student);
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
      this.getStudentsAsync();
    },

    deleteStudent(item) {
      this.confirmStudent = item;
    },

    // Call api delete student
    async deleteStudentConfirm(studentComfirm) {
      studentComfirm.isDelete = true;
      this.showLoading();
      let api = new StudentService();
      let response = await api.updateStudentAsync(studentComfirm); // Gọi Api
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