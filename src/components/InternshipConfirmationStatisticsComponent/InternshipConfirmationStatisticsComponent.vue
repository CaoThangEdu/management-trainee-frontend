<template src="./InternshipConfirmationStatisticsComponent.html"> </template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import JwPagination from "jw-vue-pagination";
import ComponentBase from "../common/component-base/ComponentBase";
import ConfirmDialog from "../common/confirm-dialog/ConfirmDialog";
export default {
  name: "InternshipConfirmationStatisticsComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    ConfirmDialog,
  },
  data() {
    return {
      internshipConfirmations: [],
    };
  },
  methods: {
    async fliterInternshipConfirmationAsync() {
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.fliterInternshipConfirmationAsync();
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data.items;
    },
  },
};
</script>

<style lang="scss">
@import "./InternshipConfirmationStatisticsComponent.scss";
</style>
