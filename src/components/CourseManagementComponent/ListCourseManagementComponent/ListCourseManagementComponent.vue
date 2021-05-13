<template src='./ListCourseManagementComponent.html'>
  
</template>

<script>
import CourseManagementDetailComponent from '../CourseManagementDetailComponent/CourseManagementDetailComponent'
import AddFileDetailComponent from '../AddFileDetailComponent/AddFileDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import CourseService from '../../../services/course/courseServices'
import AppConfig from '../../../../src/app.config.json'
import XLSX from 'xlsx'

export default {
  name: "ListCourseManagementComponent",
  extends: ComponentBase,
  components: {
    CourseManagementDetailComponent,
    AddFileDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      courses: [],
      editCourse: {},
      confirmCourse: null,
      metaDataFile: [],
    };
  },
  async mounted(){
    await this.getCoursesAsync()
    // console.log(this.metaDataFile)
  },

  methods:{
    async previewFiles(e) {
      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      var vm = this;

      // this.showLoading();
      reader.onload = async function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        let sheetName = workbook.SheetNames[0]
        /* DO SOMETHING WITH workbook HERE */
        console.log(workbook);
        let worksheet = workbook.Sheets[sheetName];
        vm.metaDataFile = XLSX.utils.sheet_to_json(worksheet);
        console.log('file json 1', vm.metaDataFile);
        // for (let i = 0; i < this.metaDataFile.length; i++){
        //   // console.log('courseObj', this.metaDataFile[i].courseName);
        //   // this.showLoading();
        //   let api = new CourseService();
        //   let response = await api.createCourseAsync(this.metaDataFile[i]);
        //   // this.showLoading(false);
        //   if(!response.isOK){
        //     // this.showNotifications(
        //     //   "error",
        //     //   `${AppConfig.notification.title_default}`,
        //     //   response.errorMessages
        //     // );
        //     return;
        //   }
        //   // this.showNotifications(
        //   //   "success",
        //   //   `${AppConfig.notification.title_default}`,
        //   //   `${AppConfig.notification.content_created_success_default}`
        //   // );
        //   console.log('Thành công')
        // }
      };
      reader.readAsArrayBuffer(f);
      
      // await this.getCoursesAsync();
      // setTimeout(() => {
      //   console.log('file json 2', this.metaDataFile);
      // }, 2000)
      // this.showLoading(false);
    },

    removeImage: function () {
      console.log('file json 2', this.metaDataFile);
    },

    addFileExel(arr){
      // console.log(this.metaDataFile)
      if(arr){
        for (let i = 0; i < arr.length; i++){
          console.log('courseObj', arr[i]);
        }
      }
    },

    createCourse() {
      this.editCourse = {};
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

    async changePage(currentPage) {
      await this.getCoursesAsync(currentPage);
    },

    updateCourse(index) {
      this.editCourse = Object.assign({}, this.courses[index]);
    },

    deleteCourse(id) {
      this.confirmCourse = { id: id };
    },

    // Call api delete Course
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new CourseService();
      let response = await api.deleteCourseAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getCoursesAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getCoursesAsync();
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
@import './ListCourseManagementComponent.scss';
</style>