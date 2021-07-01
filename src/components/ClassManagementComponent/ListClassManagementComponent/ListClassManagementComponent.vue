<template src='./ListClassManagementComponent.html'>
  
</template>

<script>
import ClassManagementDetailComponent from '../ClassManagementDetailComponent/ClassManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CourseService from '../../../services/course/courseServices'
import ClassService from '../../../services/class/classServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CareerService from '../../../services/career/careerServices';
import CrudMixin from "../../../helpers/mixins/crudMixin";
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'

export default {
  name: "ListClassManagementComponent",
  extends: ComponentBase,
  components: { 
    ClassManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      classes: [],
      courses: [],
      editClass: {},
      confirmClassRoom: null,
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        courseId: "",
        isDelete: false,
        className: "",
        status: "active",
      },
      careers:[],
      trainingSystems: [],
    };
  },

  async mounted(){
    await this.getClassesFilterAsync();
    await this.getCoursesFilterAsync();
    await this.getCareersFilterAsync();
    await this.getTrainingSystemsFilterAsync();
  },

  methods:{
    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async updateStatus(index) {
      let classRoom = this.pageOfItems[index];
      if (classRoom.status === 'active') {
        classRoom.status = 'unactive';
      } else {
        classRoom.status = 'active';
      }
      this.showLoading();
      let api = new ClassService();
      let response = await api.updateClassAsync(classRoom);
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
      this.getClassesFilterAsync();
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createClass() {
      this.editClass = {};
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

    async getCoursesFilterAsync() {
      let filterCourse = {
        careersId: "",
        isDelete: false,
        courseName: "",
        status: "active",
      }
      // Call Api
      this.showLoading();
      const api = new CourseService();

      const response = await api.getCoursesFilterAsync(filterCourse);
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
    
    async getClassesFilterAsync(){
      // Call Api
      this.showLoading();
      const api = new ClassService()

      const response = await api.getClassesFilterAsync(this.filter);
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

    async changePage(currentPage) {
      await this.getClassesFilterAsync(currentPage);
    },

    updateClass(index) {
      this.editClass = Object.assign({}, this.pageOfItems[index]);
    },

    deleteClass(id) {
      this.confirmClassRoom = { id: id };
    },

    // Call api delete Class
    async deleteClassConfirm(classComfirm) {
      this.showLoading();
      let api = new ClassService();
      let response = await api.deleteClassAsync(classComfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getClassesFilterAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData() {
      await this.getClassesFilterAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListClassManagementComponent.scss';
</style>