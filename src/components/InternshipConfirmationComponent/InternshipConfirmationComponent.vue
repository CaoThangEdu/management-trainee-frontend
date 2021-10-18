<template src="./InternshipConfirmationComponent.html"> </template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import ComponentBase from "../common/component-base/ComponentBase";
import IntershipConfirmationViewModel from "../../view-model/intershipconfirmation/IntershipConfirmationViewModel";
import AlertMessages from "../common/alert/alert-messages/AlertMessages";
import { mapGetters } from "vuex";
import AppConfig from "../../../src/app.config.json";
export default {
  name: "InternshipConfirmationComponent",
  extends: ComponentBase,
  components: { AlertMessages },
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
        internshipCourseId:""
      },
      intership: "false",
      confirmed: false,
      errorMessages: [],
    };
  },
  async mounted() {
    let keyConfirmation = await this.getInternshipConfirmationAsync();
    if (keyConfirmation !== undefined) {
      this.confirmed = true;
      this.keyInternshipConfirmation = keyConfirmation;
    }
    if (this.keyInternshipConfirmation.status === "practiced") {
      this.intership = "true";
    }
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },
  methods: {
    changeStatusInternship() {
      if (this.intership === "false") {
        this.keyInternshipConfirmation.status = "notPracticed";
        return;
      }
      this.keyInternshipConfirmation.status = "practiced";
    },

    async pressKeyEnter() {
      await this.internshipConfirmationAsync();
    },

    async internshipConfirmation() {
      if (this.confirmed === true) {
        await this.updateInternshipConfirmationAsync();
        return;
      }
      await this.internshipConfirmationAsync();
    },

    validInternshipConfirmation() {
      if (
        this.intership === "false" &&
        this.keyInternshipConfirmation.companiesInterviewed === ""
      ) {
        this.errorMessages = [
          "Vui lòng nhập <span>Những công ty đã phỏng vấn</span>.",
        ];
      }
      if (this.intership === "true") {
        let viewModel = new IntershipConfirmationViewModel();
        viewModel.setFields(this.keyInternshipConfirmation);
        this.errorMessages = viewModel.isValid();
      }
    },

    async internshipConfirmationAsync() {
      this.validInternshipConfirmation();
      if (this.errorMessages.length > 0) {
        return;
      }
      this.keyInternshipConfirmation.studentId = this.userProfile.mssv;
      this.keyInternshipConfirmation.internshipCourseId = this.userProfile.internshipCourseId;
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
      this.confirmed = true;
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
        return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.confirmed = true;
      this.keyInternshipConfirmation = response.data;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
    },

    async getInternshipConfirmationAsync() {
      let filter = {
        studentId: this.userProfile.mssv,
        status: "",
      };
      console.log(filter);
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
      return response.data[0];
    },
  },
};
</script>

<style lang="scss">
@import "./InternshipConfirmationComponent.scss";
</style>
