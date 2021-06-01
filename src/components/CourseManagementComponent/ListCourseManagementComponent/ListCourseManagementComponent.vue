<template src='./ListCourseManagementComponent.html'>
  
</template>

<script>
import CourseManagementDetailComponent from '../CourseManagementDetailComponent/CourseManagementDetailComponent'
import AddFileDetailComponent from '../AddFileDetailComponent/AddFileDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CourseService from '../../../services/course/courseServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';

export default {
  name: "ListCourseManagementComponent",
  extends: ComponentBase,
  components: {
    CourseManagementDetailComponent,
    AddFileDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  data() {
    return {
      courses: [],
      editCourse: {},
      confirmCourse: null,
      metaDataFile: [],
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
    await this.getCoursesAsync()
  },
  
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
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