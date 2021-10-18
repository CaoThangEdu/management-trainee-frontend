<template src="./InternshipConfirmationStatisticsComponent.html"> </template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import JwPagination from "jw-vue-pagination";
import ComponentBase from "../common/component-base/ComponentBase";
import StudentService from "../../services/student/studentServices";
import ClassService from "../../services/class/classServices";
import CrudMixin from "../../helpers/mixins/crudMixin";
import { Chart } from "highcharts-vue";
import PlanService from "../../services/plan/planServices";
export default {
  name: "InternshipConfirmationStatisticsComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    Highcharts: Chart
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
      internshipConfirmations: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
      studentsByMssv: {},
      classById: {},
      statistics: [],
      internshipCourseId: "",
      classId:"",
      numberOfStudentACompany:0,
      numberOfStudentNotACompany:0,
      plans:[]
    };
  },
  async mounted() {
    this.internshipConfirmations = await this.fliterInternshipConfirmationAsync();
    await this.getStudentsAsync();
    await this.getClassesAsync();
    await this.getPlansAsync();
  },
  methods: {
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
      return response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    async getStudentsAsync() {
      let filterStudent = {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(filterStudent);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentsByMssv = CrudMixin.methods.convertArrayToObject(
        response.data,
        "studentId"
      );
    },
    async getClassesAsync() {
      // Call Api
      this.showLoading();
      const api = new ClassService();

      const response = await api.getClassesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classById = CrudMixin.methods.convertArrayToObject(
        response.data.items,
        "id"
      );
    },
    getStudent(mssv) {
      if (this.studentsByMssv[mssv] === undefined) {
        return "";
      }
      return this.studentsByMssv[mssv];
    },
    getNameClass(mssv) {
      let classId = this.studentsByMssv[mssv];
      if (this.classById[classId] === undefined) {
        return "";
      }
      return this.classById[classId].className;
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
  },

  watch:{
    internshipCourseId(){
      if(this.internshipCourseId === ""){
        this.pieChart.series[0].data[0].y = 0;
        this.pieChart.series[0].data[1].y = 0;
        return;
      }
      this.setPieChart(this.internshipCourseId);
    },

    classId(){
      if(this.classId === ""){
        this.pieChart.series[0].data[0].y = 
      (this.numberOfStudentACompany/(this.numberOfStudentACompany + this.numberOfStudentNotACompany))*100;
      this.pieChart.series[0].data[1].y = 
      (this.numberOfStudentNotACompany/(this.numberOfStudentACompany + this.numberOfStudentNotACompany))*100;
      return;
      }
      let statisticsByClassId =  CrudMixin.methods.convertArrayToObject(this.statistics, "classId");
      this.pieChart.series[0].data[0].y = (statisticsByClassId[this.classId].numberOfStudentACompany/(statisticsByClassId[this.classId].numberOfStudentACompany + statisticsByClassId[this.classId].numberOfStudentNotACompany))*100;
      
      this.pieChart.series[0].data[1].y = 
     (statisticsByClassId[this.classId].numberOfStudentNotACompany/(statisticsByClassId[this.classId].numberOfStudentACompany + statisticsByClassId[this.classId].numberOfStudentNotACompany))*100;
    }
  }
};
</script>

<style lang="scss">
@import "./InternshipConfirmationStatisticsComponent.scss";
</style>
