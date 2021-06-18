<template src='./RegisteredInternshipReferralsDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import AppConfig from '../../../../src/app.config.json'
import CertificateViewModel from "../../../view-model/registeredInternshipReferrals/registeredInternshipReferralsViewModel"
import CertificateService from '../../../services/registeredInternshipReferrals/registeredInternshipReferrals'

export default {
  name: 'CertificateDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      certificate: {},

      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.certificate = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createCertificateAsync() {
      this.showLoading();
      let api = new CertificateService();
      let response = await api.createRegisteredInternshipReferralsAsync(this.certificate);
      this.showLoading(false);
      if(!response.isOK){
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

      this.closeModal(true);
    },

    async updateCertificateAsync() {
      this.showLoading();
      let api = new CertificateService();
      let response = await api.updateRegisteredInternshipReferralsAsync(this.certificate);
      this.showLoading(false);

      if(!response.isOK){
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
        `${AppConfig.notification.content_updated_success_default}`
      );

        this.closeModal(true);
    },

    async save() {
      // validate
      let viewModel = new CertificateViewModel();
      viewModel.setFields(this.certificate);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.certificate.id === undefined) {
        //create
        await this.createCertificateAsync();
      } else {        
        //update
        await this.updateCertificateAsync();
      }
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.certificate = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './RegisteredInternshipReferralsDetailComponent.scss';
</style>
