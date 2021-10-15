<template src="./InternshipConfirmationComponent.html"> </template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import ComponentBase from "../common/component-base/ComponentBase";
import IntershipConfirmationViewModel from "../../view-model/intershipconfirmation/IntershipConfirmationViewModel"
import AlertMessages from "../common/alert/alert-messages/AlertMessages"
export default {
  name: "InternshipConfirmationComponent",
  extends: ComponentBase,
  components: {AlertMessages},
  data() {
    return {
      keyInternshipConfirmation: {
      studentId: "",
      taxCode: "",
      title: "",
      companyAddress: "",
      website: "",
      owner: "",
      manager: "",
      companiesInterviewed: "",
      status: "notPracticed", //notPracticed, practiced
      phoneNumber: "",
      },
      intership: "false",
      errorMessages: [],
    };
  },
  methods: {
    changeStatusInternship(){
      if(this.intership === "false"){
        this.keyInternshipConfirmation.status = "notPracticed";
        return ;
      }
      this.keyInternshipConfirmation.status = "practiced";
    },

    async pressKeyEnter() {
      
    },

    internshipConfirmation(){
      this.validInternshipConfirmation();
    },

    validInternshipConfirmation(){
      if(this.intership === "false" && this.keyInternshipConfirmation.companiesInterviewed === ""){
        this.errorMessages = ["Vui lòng nhập <span>Những công ty đã phỏng vấn</span>."]
        return;
      }
      let viewModel = new IntershipConfirmationViewModel();
      viewModel.setFields(this.keyInternshipConfirmation);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }
    },

    async internshipConfirmationAsync() {
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.internshipConfirmationAsync(
        this.keyInternshipConfirmation
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
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },

    async updateInternshipConfirmationAsync() {
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.updateInternshipConfirmationAsync(
        this.keyInternshipConfirmation
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
      this.keyInternshipConfirmation = response.data;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
    },
  },
};
</script>

<style lang="scss">
@import "./InternshipConfirmationComponent.scss";
</style>
