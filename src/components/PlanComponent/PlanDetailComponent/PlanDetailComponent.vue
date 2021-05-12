<template src="./PlanDetailComponent.html">
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import PlanService from '../../../services/plan/planServices'
import PlanViewModel from "../../../view-model/plan/planViewModel"
import AppConfig from '../../../../src/app.config.json'
import CourseService from '../../../services/course/courseServices'
// import StudentService from '../../../services/student/studentServices'
import XLSX from 'xlsx'

export default {
  name: 'PlanDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    },
  data() {
    return {
      isShow: false,
      plan: {},
      courses:[],
      students: [],
      errorMessages: [],
      metaDataFile: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  async mounted(){
    await this.getCoursesAsync()
  },
  
  methods:{
    async previewFiles(e) {
      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      this.showLoading();
      reader.onload = async function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        let sheetName = workbook.SheetNames[0]
        /* DO SOMETHING WITH workbook HERE */
        console.log(workbook);
        let worksheet = workbook.Sheets[sheetName];
        this.metaDataFile = XLSX.utils.sheet_to_json(worksheet);
        console.log('file json 1', this.metaDataFile);
        // for (let i = 0; i < this.metaDataFile.length; i++){
        //   console.log('studentObj', this.metaDataFile[i].name);
        //   // this.showLoading();
        //   let api = new StudentService();
        //   let response = await api.createStudentAsync(this.metaDataFile[i]);
        //   // this.showLoading(false);
        //   if(!response.isOK){
        //     return;
        //   }
        //   console.log('Thành công')
        // }
      };
      reader.readAsArrayBuffer(f);
      // await this.getCoursesAsync();
      // setTimeout(() => {
      //   console.log('file json 2', this.metaDataFile);
      // }, 2000)
      console.log('file json 2', this.metaDataFile);
      this.showLoading(false);
    },

    async getCoursesAsync(){
      // Call Api
      this.showLoading();
      const api = new CourseService()

      const response = await api.getCoursesAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.courses = response.data.items
    },

    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.plan = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createPlanAsync() {
      this.showLoading();
      let api = new PlanService();
      this.plan.internshipCourceName = this.plan.course + ' ' + this.plan.careers;
      let response = await api.createPlanAsync(this.plan);
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
        `${AppConfig.notification.content_created_success_default}`
      );

      this.closeModal(true);
    },

    async updatePlanAsync() {
      this.showLoading();
      let api = new PlanService();
      let response = await api.updatePlanAsync(this.plan);
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

      this.closeModal(true);
    },

    async save() {
      // validate
      let viewModel = new PlanViewModel();
      viewModel.setFields(this.plan);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.plan.id === undefined){
        // this.plan.internshipCourceName = this.plan.course + this.plan.course + this.plan.careers
        await this.createPlanAsync();
      } else{
        await this.updatePlanAsync();
      }
    },
  },

  watch: {
    data() {
      this.isShow = true;
      this.plan = this.data;
    }
  }
}
</script>

<style lang="scss">
@import './PlanDetailComponent.scss';
</style>