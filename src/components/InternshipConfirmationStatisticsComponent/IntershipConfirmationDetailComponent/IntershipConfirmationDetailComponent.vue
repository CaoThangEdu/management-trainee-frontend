<template src='./IntershipConfirmationDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"

export default {
  name: 'IntershipConfirmationDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      intership:false,
      keyInternshipConfirmation: {
        studentId: "",
        taxCode: "",
        title: "",
        companyAddress: "",
        website: "",
        owner: "",
        manager: "",
        companiesInterviewed: "",
        status: "", //notPracticed, practiced
        phoneNumber: "",
        internshipCourseId:""
      },
    }
  },

  props: {
    intershipConfirmation: {
      type: Object,
      default: null,
    },
  },

  methods: {
    closeModal(){
      this.isShow = false;
    }
  },
  watch: {
    intershipConfirmation() {
      this.isShow = true;
      if(this.intershipConfirmation.taxCode !== ""){
        this.intership = true;
      }
      if(this.intershipConfirmation.taxCode === ""){
        this.intership = false;
      }
      this.keyInternshipConfirmation = this.intershipConfirmation;
    }
  }
}
</script>

<style lang='scss'>
@import './IntershipConfirmationDetailComponent.scss';
.form-select-class{
  width: 100%;
  height: 35px;
}
</style>
