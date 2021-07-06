<template src='./AutomaticAssignment.html'>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"

export default {
  name: 'CareerManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      career: {},
      errorMessages: [],
      internshipCourseName: "Đợt thực tập khoa công nghệ thông tin 2018",
      trainingSystemName: "Cao Dang",
      careersName: "Công nghệ thông tin",
      courseName: "K18",
      numberStudentsUnassigned: 160,
      numberTeachers: 20,
      averageNumber: 0

    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    }
  },
  
  methods: {
       closeModal() {
      this.isShow = false;
      
    },
   
  },
  
  watch: {
    data() {
      this.averageNumber = this.numberStudentsUnassigned / this.numberTeachers
      this.isShow = true;
      this.career = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './AutomaticAssignment.scss';
</style>
