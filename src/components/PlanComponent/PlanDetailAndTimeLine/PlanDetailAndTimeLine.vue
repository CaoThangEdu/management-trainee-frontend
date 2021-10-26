<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <TimeLineComponent :plans="plans"
            :planGuid="guid" />
        </div>
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <div class="card">
            <header class="card-header">
              <h4 class="float-left">Chi tiết kế hoạch</h4>
              <div class="float-right">
                <router-link
                  class="btn btn-info"
                  :to="{ name: 'them-sv-cua-dot', params: { guid: planId } }"
                >
                  Thêm sinh viên
                </router-link>
              </div>
            </header>
            <div class="card-body">
              <form @submit.prevent>
                <div class="form-row">
                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Ngày bắt đầu: </label>
                    {{convertDateToString(plan.startDay)}}                
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Ngày kết thúc: </label>
                    {{convertDateToString(plan.endDay)}}
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Tên đợt: </label>
                    {{plan.internshipCourseName}}
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Mô tả: </label>
                    {{plan.description}}
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Tên khóa: </label>
                    {{plan.courseName}}
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Hệ đào tạo: </label>
                    {{trainingSystemId?getTrainingSystemById(trainingSystemId):''}}
                  </div>
                  
                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Ngành: </label>
                    {{plan.careersId?getCarrersById(plan.careersId):''}}
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Trạng thái: </label>
                    {{getPlanStatusName(plan.status)}}
                  </div>
                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <button
                      @click="$router.go(-1)"
                      id="cancel"
                      class="btn btn-dark mr-2"
                    >
                      Trở về
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-12"
          v-if="assignedStudents.length!=0 && unassignStudents.length!=0">
          <div class="card">
            <header class="card-header">
              <h4 class="float-left">Phân công</h4>
              <div class="float-right">
                <router-link
                    class="btn btn-info"
                    :to="{name:'phan-cong-dot', params: { internshipCourseId: guid } }"
                    title="Chi tiết">
                    <i class="fas fa-search-plus"></i>                    
                  </router-link>
              </div>
            </header>
            <div class="card-body">
              <Highcharts
                :assignedStudents="assignedStudents"
                :unassignStudents="unassignStudents"
                :labelsProps="'Số sinh viên'"
                :labelChart="'Thống kê phân công'"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase";
import PlanService from "../../../services/plan/planServices";
import AppConfig from "../../../../src/app.config.json";
import CareerService from "../../../services/career/careerServices";
import TrainingSystemService from "../../../services/trainingsystem/trainingsystemServices";
import TrainingSystemViewModel from "../../../view-model/trainingsystem/trainingsystemViewModel";
import localStorageMixin from "../../../helpers/mixins/localStorageMixin";
import crudMixin from "../../../helpers/mixins/crudMixin";
import FacultyServices from "../../../services/faculty/facultyServices";
import TimeLineComponent from "../TimeLineComponent/TimeLineComponent.vue";
import moment from "moment";
import ClassServices from "../../../services/class/classServices";
import Highcharts from "../../common/high-chart/HighChart.vue";

export default {
  name: "PlanDetail",
  props: ["guid"],
  extends: ComponentBase,
  mixins: [localStorageMixin, crudMixin],
  components: {
    TimeLineComponent,
    Highcharts,
  },
  data() {
    return {
      plan: {},
      isThemNganh: false,
      career: {},
      trainingSystemId: null,
      trainingSystems: [],
      confirmPlan: {},
      careers: [],
      careerId: null,
      careerNamePlan: null,
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
      currentFaqTrainingSystem: 0,
      careersFilter: [],
      createCareerLoading: false,
      createTrainingLoading: false,
      trainingSystem: {},
      isActiveStep: "1",
      planId: null,
      planName: null,
      plans: [],
      isNotification: null,
      faculties: [],
      statistiesStudentInClass: [],
      chartDataStatisticsStudentInClass: [],
      labelsDataStatisticsStudentInClass: [],
      assignedStudents: [],
      unassignStudents: [],
    };
  },

  async mounted() {
    await this.getTrainingSystemsFilterAsync();
    await this.getCareersFilterAsync();
    await this.getPlansAsync();
    await this.getFacultiesFilterAsync();
    if (!this.guid) {
      return;
    }
    this.plans = this.plans.filter((plan) => plan.id != this.guid);
    await this.getPlanByIdAsync(this.guid);
    this.planId = this.plan.id;
    this.trainingSystemId = this.getInfoObject(
      this.plan.careersId,
      this.careers
    ).trainingSystemId;
    this.plan.startDay =  new Date(this.plan.startDay);
    this.plan.endDay = new Date(this.plan.endDay);
    this.filterCareer();
    await this.getStatisticsStudentInClass();
  },

  methods: {
    getChartStatisticsStudentInClass() {
      for (let student of this.statistiesStudentInClass) {
        let assignedStudent = {
          name: student.className,
          y: student.numberOfStudentAssigned,
        }
        this.assignedStudents.push(assignedStudent);
        let unassignedStudent = {
          name: student.className,
          y: student.numberOfStudentUnAssign,
        }
        this.unassignStudents.push(unassignedStudent);
        this.chartDataStatisticsStudentInClass.push(student.numberOfStudentAssigned);
        this.labelsDataStatisticsStudentInClass.push(student.className);
      }
    },

    async getStatisticsStudentInClass() {
      this.showLoading();
      const api = new ClassServices();
      const response = await api.getStatisticalClassUnassigned(
        {internshipCourseId: this.guid}
      );
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.statistiesStudentInClass = response.data;
      this.getChartStatisticsStudentInClass();
    },

    convertDateToString(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    async getFacultiesFilterAsync() {
      let facultyFilter = {
      };
      // Call Api
      this.showLoading();
      const api = new FacultyServices();

      const response = await api.getFacultiesFilterAsync(facultyFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties = response.data;
    },

    async getPlansAsync() {
      let planFilter = {
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlansAsync(planFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data;
    },

    hidePastDates(date) {
      return date > this.plan.endDay || date < new Date();
    },

    displayBetweenFromDateAndPastDates(date) {
      const day = new Date(this.plan.startDay);
      return date < day;
    },

    async getPlanByIdAsync(guid) {
      // Call Api
      this.showLoading();
      const api = new PlanService();
      const response = await api.getPlanByIdAsync(guid);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plan = response.data;
    },

    async getTrainingSystemsFilterAsync() {
      let filterTrainingSystem = {
        trainingSystemName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService();

      const response = await api.getTrainingSystemsFilterAsync(
        filterTrainingSystem
      );
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

    getCarrersById(id) {
      return this.careers.find(m => m.id == id).careersName;
    },

    async getCareersFilterAsync() {
      let filterCareer = {
        trainingSystemId: "",
        careersName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new CareerService();

      const response = await api.getCareersFilterAsync(filterCareer);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data;
    },

    confirmChangePlan(plan) {
      this.confirmPlan = plan;
    },

    openComponet(i) {
      this.currentFaq = i;
    },
    openComponentTrainingSystem(i) {
      this.currentFaqTrainingSystem = i;
    },

    filterCareer() {
      this.careersFilter = this.careers.filter(
        (career) => career.trainingSystemId == this.trainingSystemId
      );
    },

    checkExistencePlan(planName) {
      const result = this.plans.find(
        ({ internshipCourseName }) => internshipCourseName === planName
      );
      if (result) {
        return true;
      }
      return false;
    },

    async createTrainingSystemAsync() {
      this.trainingSystem.status = "active";
      this.trainingSystem.facultyId = this.faculties[0].id;
      let viewModel = new TrainingSystemViewModel();
      viewModel.setFields(this.trainingSystem);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages.join('<br />')
        );
        return;
      }
      this.createTrainingLoading = true;
      let api = new TrainingSystemService();
      let response = await api.createTrainingSystemAsync(this.trainingSystem);
      this.createTrainingLoading = false;
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystemId = response.data.id;
      this.trainingSystems.push(response.data);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + " hệ"
      );
    },

    getTrainingSystemById(trainingSystemId) {
      return this.getInfoObject(
        trainingSystemId,
        this.trainingSystems
      ).trainingSystemName;
    },

    getInfoObject(id, list) {
      return crudMixin.methods.getInfo(id, list);
    },

    async pressKeyEnter() {
      await this.save();
    },
  },
};
</script>

<style>
</style>
