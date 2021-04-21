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
  },
  
  methods:{
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
    async deleteCourseConfirm(courseComfirm) {
      this.showLoading();
      let api = new CourseService();
      let response = await api.deleteCourseAsync(courseComfirm.id); // Gọi Api
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