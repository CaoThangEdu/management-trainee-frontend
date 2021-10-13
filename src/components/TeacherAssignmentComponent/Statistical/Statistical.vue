<template src="./Statistical.html"></template>

<script>
import ClassService from "../../../services/class/classServices";
import AppConfig from "../../../../src/app.config.json";
import ComponentBase from "../../common/component-base/ComponentBase";
import crudMixin from "../../../helpers/mixins/crudMixin";
import Highcharts from "../../common/high-chart/HighChart.vue";

export default {
  name: "Statistical",
  extends: ComponentBase,
  components: {
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
      default: [],
    },
    statisticalPlan: {
      type: Object, 
      default: {},       
    },
    studentInInternshipCourse: {
      type: Array,
      default: [],
    },
    statistiesStudentInClass: {
      type: Array,
      default: [],
    }
  },

  data() {
    return {
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
      assignedStudents: [],
      unassignStudents: [],
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
  },

  watch: {
    statistiesStudentInClass() {
      this.assignedStudents = [];
      this.unassignStudents = [];
      this.getChartStatisticsStudentInClass();
    }
  }
};
</script>

<style lang='scss'>
@import "./Statistical.scss";
</style> 