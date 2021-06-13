<template src='./ListCourseManagementComponent.html'></template>

<script>
import CourseManagementDetailComponent from "../CourseManagementDetailComponent/CourseManagementDetailComponent";
import AddFileDetailComponent from "../AddFileDetailComponent/AddFileDetailComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import Pagination from "../../common/pagination/Pagination";
import CourseService from "../../../services/course/courseServices";
import AppConfig from "../../../../src/app.config.json";
import TrainingSystemServices from "../../../services/trainingsystem/trainingsystemServices";
import CareerService from '../../../services/career/careerServices'


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
      careers: [],
      editCourse: {},
      confirmCourse: null,
      metaDataFile: [],
      trainingSystems: [],
      filter: {
        trainingSystemId:"",
        isDelete: false,
        courseName: "",
      },
    };
  },

  async mounted() {
    await this.getCareersAsync();
    await this.getTrainingSystemAsync();

    await this.getAllCoursesAsync();
  },

  methods: {
    createCourse() {
      this.editCourse = {};
    },
    async getTrainingSystemAsync() {
      // Call Api
      this.showLoading();
      const api = new TrainingSystemServices();

      const response = await api.getAllTrainingSystemsAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems = response.data.items;
    },
    async getCareersAsync(){
      // Call Api
      this.showLoading();
      const api = new CareerService()

      const response = await api.getCareersAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data.items
    },

    //Lấy danh sách khóa học theo filter
    async getCoursesAsync() {
      // Call Api
      this.showLoading();
      const api = new CourseService();

      const response = await api.getCoursesAsync(this.filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.courses = response.data;
    },

    async getAllCoursesAsync() {
      // Call Api
      this.showLoading();
      const api = new CourseService();

      const response = await api.getAllCoursesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.courses = response.data.items;
    },

    async changePage(currentPage) {
      await this.getAllCoursesAsync(currentPage);
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
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getAllCoursesAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeData() {
      await this.getAllCoursesAsync();
    },

    showNotification() {
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },
  },
};
</script>

<style lang='scss'>
@import "./ListCourseManagementComponent.scss";
</style>