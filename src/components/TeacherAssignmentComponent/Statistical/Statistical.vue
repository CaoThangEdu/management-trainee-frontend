<template src="./Statistical.html"></template>

<script>
import ClassService from "../../../services/class/classServices";
import AppConfig from "../../../../src/app.config.json";

import ComponentBase from "../../common/component-base/ComponentBase";
export default {
  name: "Statistical",
  extends: ComponentBase,
  components: {},
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
    }
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
        numberStudentsUnassigned: 0,
        numberTeachersInInternshipCourse: 0,
        numberOfStudentsInInternshipCourse: 0,
      },
       statisticalRequest: {
        internshipCourseId: "",
      },
    };
   
  },
  async mounted() {
      this.getStatisticsStudentInClass();
  },

  methods: {
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