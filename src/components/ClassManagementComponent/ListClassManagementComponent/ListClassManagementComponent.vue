<template src='./ListClassManagementComponent.html'>
  
</template>

<script>
import ClassManagementDetailComponent from '../ClassManagementDetailComponent/ClassManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import Pagination from "../../common/pagination/Pagination"
import CourseService from '../../../services/course/courseServices'
import ClassService from '../../../services/class/classServices'
import AppConfig from '../../../../src/app.config.json'

export default {
  name: "ListClassManagementComponent",
  extends: ComponentBase,
  components: { 
    ClassManagementDetailComponent,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      classes: [],
      courses: [],
      editClass: {},
      confirmClassRoom: null,
    };
  },

  async mounted(){
    await this.getClassesAsync()
    await this.getCoursesAsync()
  },

  methods:{
    getCourseName(courseId){
      for (const x in this.courses) {
        if(this.courses[x].id === courseId){
          return this.courses[x].courseName
        }
      }
    },

    createClass() {
      this.editClass = {};
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

    async changePage(currentPage) {
      await this.getClassesAsync(currentPage);
    },

    updateClass(index) {
      this.editClass = Object.assign({}, this.classes[index]);
    },

    deleteClass(id) {
      this.confirmClassRoom = { id: id };
    },

    // Call api delete Class
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new ClassService();
      let response = await api.deleteClassAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getClassesAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getClassesAsync();
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
@import './ListClassManagementComponent.scss';
</style>