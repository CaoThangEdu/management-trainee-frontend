<template src='./PlanDetailComponent.html'>
  
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase"
import BaseModal from '../../../components/common/base-modal/BaseModal'
// import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import PlanService from '../../../services/plan/planServices'
import PlanViewModel from "../../../view-model/plan/planViewModel"
import AppConfig from '../../../../src/app.config.json'
import CrudMixin from "../../../helpers/mixins/crudMixin";
import CareerService from '../../../services/career/careerServices'
import CareerViewModel from "../../../view-model/career/careerViewModel"
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import TrainingSystemViewModel from "../../../view-model/trainingsystem/trainingsystemViewModel"

export default {
  name: 'PlanDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    // AlertMessages,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      isShow: false,
      plan: {},
      errorMessages: [],
      typeShowDetail: null,
      isThemNganh: false,
      career: {},
      trainingSystemId: null,
      course: {},
      careerId: null,
      careerNamePlan: null,
      courseNamePlan: null,
      faqs: [
        {
          title: "Ngành",
          text: "nganhDaoTao",
        },
        {
          title: "Thêm mới ngành",
          text: "themNganh",
        },
      ],
      faqCourses: [
        {
          title: "Khóa",
          text: "khoa",
        },
        {
          title: "Thêm mới khóa",
          text: "themKhoa",
        },
      ],
      faqTrainingSystems: [
        {
          title: "Hệ đào tạo",
          text: "he",
        },
        {
          title: "Thêm mới hệ đào tạo",
          text: "themHe",
        },
      ],
      currentFaq: 0,
      currentFaqCourse: 0,
      currentFaqTrainingSystem: 0,
      careersFilter: [],
      coursesFilter: [],
      createCareerLoading: false,
      createCourseLoading: false,
      createTrainingLoading: false,
      trainingSystem: {},
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    courses: {
      type: Array,
      default: null,
    },
    trainingSystems: {
      type: Array,
      default: null,
    },
    careers: {
      type: Array,
      default: null,
    },
    showDetail: {
      type: String,
      default: null,
    },
  },
  
  methods:{
    openComponet(i) {
      this.currentFaq = i;
    },

    openComponentTrainingSystem(i) {
      this.currentFaqTrainingSystem = i;
    },

    filterCareer() {
      this.careersFilter = this.careers.filter(career => career.trainingSystemId == this.trainingSystemId);
    },

    filterCourse() {
      this.coursesFilter = this.courses.filter(course => course.careersId == this.careerId);
    },

    openComponentCourse(i) {
      this.currentFaqCourse = i;
    },
    async createCareerAsync() {
      this.career.trainingSystemId = this.trainingSystemId;
      let viewModel = new CareerViewModel();
      viewModel.setFields(this.career);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages
        );
        return;
      }
      this.career.status = "active";
      this.career.isDelete = "false";
      this.createCareerLoading = true;
      let api = new CareerService();
      let response = await api.createCareerAsync(this.career);
      this.createCareerLoading = false;
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careerId = response.data.id;
      this.careerNamePlan = response.data.careersName;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
      this.$emit("change-data-career");
      this.filterCareer();
    },

    async createTrainingSystemAsync() {
      this.trainingSystem.status = 'active';
      this.trainingSystem.isDelete = 'false';
      let viewModel = new TrainingSystemViewModel();
      viewModel.setFields(this.trainingSystem);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages
        );
        return;
      }
      this.createTrainingLoading = true;
      let api = new TrainingSystemService();
      let response = await api.createTrainingSystemAsync(this.trainingSystem);
      this.createTrainingLoading = false;
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystemId = response.data.id;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
      this.$emit("change-data-training-system");
    },

    themNganh() {
      this.isThemNganh = true;
    },

    getTrainingSysId() {
      this.trainingSystemId = this.getInfoObject(
        this.getInfoObject(this.careerId, this.careers).trainingSystemId
        , this.trainingSystems).id;
    },

    getCareerId() {
      if (this.courses.length < 0){
        return;
      }
      this.careerId = this.getInfoObject(this.plan.courseId, this.courses).careersId;
    },

    getCourseNameAndId() {
      this.courseNamePlan = this.getInfoObject(this.plan.courseId, this.courses).courseName;
      this.course.courseName = this.getInfoObject(this.plan.courseId, this.courses).courseName;
      this.careerNamePlan = this.getInfoObject(this.careerId, this.careers).careersName;
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
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
      if (!this.careerNamePlan){
        this.careerNamePlan = this.getInfoObject(this.careerId, this.careers).careersName;
      }
      this.plan.internshipCourseName = this.getInfoObject(this.trainingSystemId, this.trainingSystems).trainingSystemName
        + this.careerNamePlan + this.courseNamePlan;
      let api = new PlanService();
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
      if (this.careerNamePlan){
        this.careerNamePlan = this.getInfoObject(this.careerId, this.careers).careersName
      }
      this.plan.internshipCourseName = this.getInfoObject(this.trainingSystemId, this.trainingSystems).trainingSystemName
        + this.careerNamePlan + this.courseNamePlan;
        
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
      if (!this.plan.courseId) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          'Vui lòng chọn khóa'
        );
        return;
      }
      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages
        );
        return;
      }
      if(this.plan.id === undefined){
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
      this.typeShowDetail = this.showDetail;
      this.currentFaq = 0;
      this.currentFaqCourse = 0;
      this.currentFaqTrainingSystem = 0;
      if(Object.values(this.plan).length != 0) {
        this.getCareerId();
        this.getTrainingSysId();
        this.getCourseNameAndId();
        this.filterCareer();
        this.filterCourse();
      }
    }
  }
}
</script>

<style lang="scss">
@import './PlanDetailComponent.scss';
</style>