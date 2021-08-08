<template src="./ListStudentManagementComponent.html">
  
</template>

<script>
import StudentManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
import AddStudentsFileComponent from "../AddStudentsFileComponent/AddStudentsFileComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";
import SelectPlan from '../../../components/common/form/select-plan/SelectPlan.vue';
import SelectClassroom from '../../../components/common/form/select-classroom/SelectClassroom.vue';

export default {
  name: "ListStudentManagementComponent",
  extends: ComponentBase,
  components: {
    StudentManagementDetailComponent,
    AddStudentsFileComponent,
    ConfirmDialog,
    JwPagination,
    SelectPlan,
    SelectClassroom,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      editStudent: {},
      addStudents: {},
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
        classId: "",
        internshipCourseId: "",
        status: "active",
        isDelete: false
      },
    };
  },

  props: {
    plans: {
      type: Array,
      default: null,
    },
    classes: {
      type: Array,
      default: null,
    },
    students: {
      type: Array,
      default: null,
    },
  },
  
  methods:{
    searchStudent() {
      if (this.filter.classId == -1 || this.filter.classId == '') {
        this.filter.classId = '';
      } else {
        this.filter.internshipCourseId = '';
        this.$emit("search-student", this.filter);
        return;
      }
      if (this.filter.internshipCourseId == -1) {
        this.filter.internshipCourseId = '';
      }
      this.$emit("search-student", this.filter);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    getInfoByCourseId(courseId, list){
      if (!CrudMixin.methods.getInfoByCourseId(courseId, list)) {
        return '';
      }
      return CrudMixin.methods.getInfoByCourseId(courseId, list);
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

    createStudent() {
      this.editStudent = {};
    },

    createStudentsFile() {
      this.addStudents = {};
    },

    async changeData() {
      this.$emit("change-data-student-component");
    },

    changeDataClass() {
      this.$emit("change-data-classroom");
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
      this.$emit("change-data-student-component");
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
      this.$emit("change-data-student-component");
    },

    deleteStudent(student) {
      this.confirmStudent = student;
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
      this.$emit("change-data-student-component");
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