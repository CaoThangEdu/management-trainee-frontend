<template src="./InternshipConfirmationStatisticsComponent.html"> </template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import JwPagination from "jw-vue-pagination";
import ComponentBase from "../common/component-base/ComponentBase";
import StudentService from "../../services/student/studentServices";
import CrudMixin from "../../helpers/mixins/crudMixin";
import { Chart } from "highcharts-vue";
import PlanService from "../../services/plan/planServices";
import IntershipConfirmationDetailComponent from "./IntershipConfirmationDetailComponent/IntershipConfirmationDetailComponent.vue"
export default {
  name: "InternshipConfirmationStatisticsComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    Highcharts: Chart,
    IntershipConfirmationDetailComponent
  },
  mixins: [CrudMixin],
  data() {
    return {
      pieChart: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
        },
        title: {
          text: "Thống kê sinh viên đã thực tập",
        },
        tooltip: {
          pointFormat: "",
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b><br>{point.percentage:.1f} %",
              distance: -50,
              filter: {
                property: "percentage",
                operator: ">",
                value: 4,
              },
            },
          },
        },
        colors: ["#2eb85c", "#e55353"],
        series: [
          {
            name: "Share",
            data: [
              { name: "Đã có công ty thực tập", y: 0 },
              { name: "Chưa có công ty thực tập", y: 0 },
            ],
          },
        ],
      },
      internshipConfirmations: {},
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filterStudent:{
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active"
      },
      pageOfItems: [],
      students: [],
      statistics: [],
      numberOfStudentACompany:0,
      numberOfStudentNotACompany:0,
      plans:[],
      intershipConfirmation: null
    };
  },
  async mounted() {
    this.internshipConfirmations = await this.fliterInternshipConfirmationAsync();
    await this.getPlansAsync();
  },
  methods: {
    detailInternshipConfirmation(intershipConfirmation){
      this.intershipConfirmation = intershipConfirmation;
    },
      async getPlansAsync(){
      let filter = {
        status: "",
      }
      // Call Api
      this.showLoading();
      const api = new PlanService()

      const response = await api.getPlansAsync(filter)
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data
    },

    async getStatisticalInternshipConfirm(internshipCourseId) {
      let filter = { internshipCourseId: internshipCourseId };
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.getStatisticalInternshipConfirm(filter);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data;
    },

    async fliterInternshipConfirmationAsync() {
      let filter = { studentId: "", status: "" };
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.fliterInternshipConfirmationAsync(filter);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return  response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    getInternshipConfirmationByStudentId(studentId){
      if(!this.internshipConfirmations || this.internshipConfirmations.length === 0) return;
      let internshipConfirmationsByStudentId = 
      CrudMixin.methods.convertArrayToObject(this.internshipConfirmations, "studentId") ;
      if(internshipConfirmationsByStudentId[studentId] === undefined){
        return {
          taxCode:"",
          title:"",
          status:""
        }
      }
      return internshipConfirmationsByStudentId[studentId];
    },

    async getStudentsByInternshipCourseAsync() {
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(this.filterStudent);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data;
    },

    async setPieChart(internshipCourseId){
      this.statistics = await this.getStatisticalInternshipConfirm(internshipCourseId);
      for(let i =0; i <= this.statistics.length - 1; i++){
        this.numberOfStudentACompany+= this.statistics[i].numberOfStudentACompany;
        this.numberOfStudentNotACompany+= this.statistics[i].numberOfStudentNotACompany;
      }
      this.pieChart.series[0].data[0].y = 
      (this.numberOfStudentACompany/(this.numberOfStudentACompany + this.numberOfStudentNotACompany))*100;
      this.pieChart.series[0].data[1].y = 
      (this.numberOfStudentNotACompany/(this.numberOfStudentACompany + this.numberOfStudentNotACompany))*100;
    },

    async searchStudent(){
      await this.getStudentsByInternshipCourseAsync();
    }
  },

  watch:{
     'filterStudent.internshipCourseId': async function () {
      if(this.filterStudent.internshipCourseId === ""){
        this.pieChart.series[0].data[0].y = 0;
        this.pieChart.series[0].data[1].y = 0;
        this.students = [];
        return;
      }
      this.setPieChart(this.filterStudent.internshipCourseId);
      await this.getStudentsByInternshipCourseAsync();
    },
      
     'filterStudent.classId': async function(){
      if(this.filterStudent.classId === ""){
        this.pieChart.series[0].data[0].y = 
      (this.numberOfStudentACompany/(this.numberOfStudentACompany + this.numberOfStudentNotACompany))*100;
      this.pieChart.series[0].data[1].y = 
      (this.numberOfStudentNotACompany/(this.numberOfStudentACompany + this.numberOfStudentNotACompany))*100;
      await this.getStudentsByInternshipCourseAsync();
      return;
      }
      let statisticsByClassId =  CrudMixin.methods.convertArrayToObject(this.statistics, "classId");
      this.pieChart.series[0].data[0].y = (statisticsByClassId[this.filterStudent.classId].numberOfStudentACompany/(statisticsByClassId[this.filterStudent.classId].numberOfStudentACompany + statisticsByClassId[this.filterStudent.classId].numberOfStudentNotACompany))*100;
      
      this.pieChart.series[0].data[1].y = 
     (statisticsByClassId[this.filterStudent.classId].numberOfStudentNotACompany/(statisticsByClassId[this.filterStudent.classId].numberOfStudentACompany + statisticsByClassId[this.filterStudent.classId].numberOfStudentNotACompany))*100;
     await this.getStudentsByInternshipCourseAsync();
    }
  }
};
</script>

<style lang="scss">
@import "./InternshipConfirmationStatisticsComponent.scss";
</style>
