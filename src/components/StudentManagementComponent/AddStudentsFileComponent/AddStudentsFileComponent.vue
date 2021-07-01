<template src='./AddStudentsFileComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import PlanService from '../../../services/plan/planServices'
import XLSX from 'xlsx'
import ClassService from '../../../services/class/classServices'
import StudentViewModel from "../../../view-model/student/studentViewModel"
import { ADD_STUDENT } from "../../../config/constant";
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: 'AddStudentsFileComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      isShowAddFile: false,
      students: [],
      studentsCallApi: [],
      studentLengthBanDau: 0,
      metaDataFile: [],
      classIdSelected: null,
      errorMessages: [],
      classroom: {},
      classes: [],
      filter: {
        keyword: "",
        isDelete: false,
        status: "active",
        classId: "",
      }
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    plans: {
      type: Array,
      default: null,
    },
  },

  async mounted(){
    await this.getStudentsAsync();
    await this.getClassesFilterAsync();
  },

  methods: {
    checkCourse(item) {
      if (this.getInfoByCourseId(item.courseId, this.plans).internshipCourseName) {
        return true;
      }
      return false;
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

    getInfoByCourseId(courseId, list){
      return CrudMixin.methods.getInfoByCourseId(courseId, list)
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    getInfoObjectByName(className, list) {
      return CrudMixin.methods.getInfoObjectByName(className, list);
    },

    getClassId(className){
      for (const x in this.classes) {
        if(this.classes[x].className === className){
          return this.classes[x].id
        }
      }
    },

    closeModal(changeData) {
      this.isShowAddFile = false;

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async getStudentsAsync(){
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getStudentsAsync(this.filter)
      this.showLoading(false);
      this.studentLengthBanDau = response.data.length;

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentsCallApi = response.data
    },
  
    async previewFiles(e) {
      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      var vm = this;

      reader.onload = async function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        let sheetName = workbook.SheetNames[0]
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        vm.metaDataFile = XLSX.utils.sheet_to_json(worksheet);     
      };
      reader.readAsArrayBuffer(f);
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

    async pressKeyEnter() {
      await this.save();
    },

    async save() {
      let courseDaChonId = this.getInfoObject(this.classIdSelected, this.classes).courseId;
      this.students = this.metaDataFile;
      let studentLengthCallApi = this.studentLengthBanDau;
      var idClass = this.classIdSelected
      for(let i = 0; i < this.students.length; i++){
        let vtSV = i + 1;
        for(const index in this.studentsCallApi){
          if(this.students[i].studentId == this.studentsCallApi[index].studentId){
            this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            'Mã số sinh viên thứ '+ vtSV + ' đã tồn tại!'+
            "<br/> Đã thêm được " + i + " sinh viên"
          );
          return;
          }
        }

        // Kiểm tra lớp đã trùng với lớp đã chọn hay chưa
        let classOfStudent = this.getInfoObjectByName(this.students[i].classId, this.classes);
        if (classOfStudent) {
          // nếu tồn tại lớp
          this.students[i].classId = classOfStudent.classId;
          // nếu lớp bằng lớp đã chọn
          if (classOfStudent.id == idClass){
            this.students[i].classId = idClass;
          } else {
            this.students[i].classId = classOfStudent.id;
          }
        } else {
          this.classroom.courseId = courseDaChonId;
          this.classroom.className = this.students[i].classId;
          this.classroom.status = 'active';
          this.classroom.isDelete = false;
          let api = new ClassService();
          let response = await api.createClassAsync(this.classroom);
          this.showLoading(false);
          if (response.isOK) {
            this.showNotifications(
              "success",
              `${AppConfig.notification.title_default}`,
              `${AppConfig.notification.content_created_success_default}`
                + ' Lớp ' + this.students[i].classId
            );
            await this.getClassesFilterAsync()
          }
          
          this.students[i].classId = this.getInfoObjectByName(this.students[i].classId, this.classes).id;
        }    
        this.students[i].status = 'active';
        this.students[i].email = this.students[i].studentId + ADD_STUDENT.EMAIL;
        // validate
        let viewModel = new StudentViewModel();
        viewModel.setFields(this.students[i]);
        this.errorMessages = viewModel.isValid();

        if (this.errorMessages.length > 0) {
          return;
        }
        this.showLoading();
        let api = new StudentService();
        let response = await api.createStudentAsync(this.students[i]);
        if(!response.isOK){
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            response.errorMessages
          );
          return;
        }
        // Tạo thành công
        this.closeModal(true);
      }
      this.showLoading(false);
      await this.getStudentsAsync();
      if(studentLengthCallApi == this.studentLengthBanDau){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới thất bại"
        );
      } else{
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_created_success_default}`
        );
      }
      await this.getStudentsAsync()
    },
  },

  watch: {
    data() {
      this.isShowAddFile = true;
    }
  }
}
</script>

<style lang='scss'>
@import './AddStudentsFileComponent.scss';
.form-select-class{
  width: 100%;
  height: 35px;
}
</style>
