<template src='./AddFileStudentDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import PlanService from '../../../services/plan/planServices'
import XLSX from 'xlsx'

export default {
  name: 'AddFileStudentDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShowAddFile: false,
      students: [],
      metaDataFile: [],
      internCourceName: null,
      plans: [],
      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    }, 
  },

  async mounted(){
    await this.getPlansAsync()
    console.log(this.plans)
  },

  methods: {
    
    closeModal(changeData) {
      this.isShowAddFile = false;

      if (changeData) {
        this.$emit("change-data");
      }
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
        console.log(workbook);
        let worksheet = workbook.Sheets[sheetName];
        vm.metaDataFile = XLSX.utils.sheet_to_json(worksheet);
        console.log('file json 1', vm.metaDataFile);
        
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
      
      this.students = this.metaDataFile;
      let studentLength = this.students.length;
      console.log("student", this.students)
      var id = this.internCourceName
      for(let i = 0; i< this.students.length; i++){
        this.students[i].internshipCourseId = id;
        this.students[i].status = 'active';
        // this.students[i].name = this.students[i].firstName + ' ' + this.students[i].lastName;
        this.students[i].email = this.students[i].studentId + '@caothang.edu.vn';
        // validate
        // let viewModel = new StudentService();
        // viewModel.setFields(this.students[i]);
        // this.errorMessages = viewModel.isValid();

        // if (this.errorMessages.length > 0) {
        //   return;
        // }

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
        console.log('Thành công')
      }

      if(studentLength != this.students.length){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới thất bại"
        );
      } else{
        console.log('studentLength', studentLength);
        console.log('length student', this.students.length)
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_created_success_default}`
        );
      }
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
@import './AddFileStudentDetailComponent.scss';
.form-select-class{
  width: 100%;
  height: 35px;
}
</style>
