<template src='./ListCourseManagementComponent.html'>
  
</template>

<script>
import CourseManagementDetailComponent from '../CourseManagementDetailComponent/CourseManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CourseService from '../../../services/course/courseServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CareerService from '../../../services/career/careerServices';
import CrudMixin from "../../../helpers/mixins/crudMixin";
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'

export default {
  name: "ListCourseManagementComponent",
  extends: ComponentBase,
  components: {
    CourseManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      courses: [],
      editCourse: {},
      confirmCourse: null,
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      careers: [],
      filter: {
        careersId: "",
        isDelete: false,
        courseName: "",
        status: "active",
      },
      trainingSystems: [],
    };
  },

  async mounted(){
    await this.getCoursesFilterAsync();
    await this.getCareersFilterAsync();
    await this.getTrainingSystemsFilterAsync();
  },
  
  methods:{
    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list)
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    
    createCourse() {
      this.editCourse = {};
    },

    async getTrainingSystemsFilterAsync() {
      let filterTrainingSystem = {
        trainingSystemName: "",
        isDelete: false,
        status: "active",
      }
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsFilterAsync(filterTrainingSystem);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems = response.data;
    },

    async getCareersFilterAsync(){
      let filterCareer = {
        trainingSystemId: "",
        isDelete: false,
        careersName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new CareerService()

      const response = await api.getCareersFilterAsync(filterCareer);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data;
    },
    
    //Lấy danh sách khóa học theo filter
    async getCoursesFilterAsync() {
      // Call Api
      this.showLoading();
      const api = new CourseService();

      const response = await api.getCoursesFilterAsync(this.filter);
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

    async changePage(currentPage) {
      await this.getCoursesFilterAsync(currentPage);
    },

    updateCourse(index) {
      this.editCourse = Object.assign({}, this.pageOfItems[index]);
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
      await this.getCoursesFilterAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },

    async updateStatus(index) {
      let course = this.pageOfItems[index];
      if (course.status === 'active') {
        course.status = 'unactive';
      } else {
        course.status = 'active';
      }
      this.showLoading();
      let api = new CourseService();
      let response = await api.updateCourseAsync(course);
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
      this.getCoursesFilterAsync();

    },
    
    async changeData() {
      await this.getCoursesFilterAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListCourseManagementComponent.scss';
</style>