<template src="./InternshipConfirmationComponent.html"> </template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import ComponentBase from "../common/component-base/ComponentBase";
export default {
  name: "InternshipConfirmationComponent",
  extends: ComponentBase,
  components: {},
  data() {
    return {
      keyInternshipConfirmation: {},
      intership: "false",
    };
  },
  methods: {
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
