<template src="./Statistical.html"></template>

<script>
import ClassService from "../../../services/class/classServices";
import AppConfig from "../../../../src/app.config.json";
import ChartBar from "../../common/chart/chart-bar/ChartBar.vue";
import ComponentBase from "../../common/component-base/ComponentBase";
import crudMixin from "../../../helpers/mixins/crudMixin";
import Highcharts from "../../common/high-chart/HighChart.vue";

export default {
  name: "Statistical",
  extends: ComponentBase,
  components: {
    ChartBar,
    Highcharts,
  },
  mixins: [crudMixin],
  props: {
    internshipCourseId: {
      type: String,
      default: "",
    },
    teachers: {
      type: Array,
    },
    statisticalPlan: {
      type: Object,        
    },
    studentInInternshipCourse: {
      type: Array,
    },
  },

  data() {
    return {
      statistiesStudentInClass: [],
      statistical: {
        description: "",
        internshipCourseName: "",
        startDay: "",
        endDay: "",
        status: "",
        courseName: "",
        trainingSystemName: "",
        careersName: "",
        numberstudentsUnAssigned: 0,
        numberTeachersInInternshipCourse: 0,
        numberOfStudentsInInternshipCourse: 0,
      },
       statisticalRequest: {
        internshipCourseId: "",
      },
      chartData: null,
      labelsProps: null,
      chartDataStatisticsStudentInClass: [],
      labelsDataStatisticsStudentInClass: [],
      studentsAssigned: [],
      studentsUnAssign: [],
    };
   
  },
  async mounted() {
    this.labelsProps = [
      'Tổng số giáo viên',
      'Tổng số sinh viên',
      'Sinh viên chưa được phân công',
      'Sinh viên đã được phân công',
    ];
    let assigned = this.statisticalPlan.numberStudentsInInternshipCourse 
      - this.statisticalPlan.numberstudentsUnAssigned;
    this.chartData = [
      this.statisticalPlan.numberTeachersInInternshipCourse,
      this.statisticalPlan.numberStudentsInInternshipCourse,
      this.statisticalPlan.numberstudentsUnAssigned,
      assigned,
    ];
    this.$forceUpdate();
    await this.getStatisticsStudentInClass();
    this.getChartStatisticsStudentInClass();
  },

  methods: {
    getChartStatisticsStudentInClass() {
      for (let student of this.statistiesStudentInClass) {
        let totalStudents = this.studentInInternshipCourse.filter(
          studentInIntern => studentInIntern.className == student.className).length;
        let studentAssigned = {
          name: student.className,
          y: totalStudents - student.number,
        }
        this.studentsAssigned.push(studentAssigned);
        let studentUnAssign = {
          name: student.className,
          y: student.number,
        }
        this.studentsUnAssign.push(studentUnAssign);
        this.chartDataStatisticsStudentInClass.push(student.number);
        this.labelsDataStatisticsStudentInClass.push(student.className);
      }
    },
    
    async getStatisticsStudentInClass() {
      this.showLoading();
      const api = new ClassService();
      this.statisticalRequest.internshipCourseId = this.internshipCourseId;
      const response = await api.getStatisticalClassUnassigned(
        this.statisticalRequest
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
    },
  },
};
</script>

<style lang='scss'>
@import "./Statistical.scss";
</style> 