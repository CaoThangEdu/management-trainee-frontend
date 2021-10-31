<template>
  <BaseModal
    @mouse-click-outside="closeModal()"
    :modalName="`ConfirmationCertificate`"
    :isShow="isShow"
    size="lg"
  >
    <div class="">
      <div class="form-group px-5">
        <h5>
          Bạn chắc chắn muốn đăng ký giấy giới thiệu thực tập công ty:
          {{ keyCompany.title }} - Mã số thuế: {{ keyCompany.taxCode }} ?
        </h5>
      </div>
    </div>
    <template #header>
      <h5>Xác nhận đăng ký giấy giới thiệu thực tập</h5>
      <button class="close" style="color: red;" @click="closeModal()">
        &times;
      </button>
    </template>
    <template #footer>
      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0"></div>
      </div>

      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <button
            @click="createCertificateAsync()"
            class="btn btn-primary float-right ml-2"
          >
            Đăng ký
          </button>
          <button class="btn btn-dark float-right" @click="closeModal()">
            Hủy
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
<script>
import ComponentBase from "../common/component-base/ComponentBase";
import BaseModal from "../../components/common/base-modal/BaseModal.vue";
import CertificateService from "../../services/certificate/CertificateServices";
import AppConfig from "../../../src/app.config.json";
export default {
  name: "ConfirmationCertificate",
  extends: ComponentBase,
  components: {
    BaseModal,
  },
  props: {
    isShow: Boolean,
    keyCompany: Object,
    userProfile:Object
  },
  data(){
    return{
      certificate: {
        taxCode: "",
        companyName: "",
        companyAddress: "",
        owner: "",
        phoneNumberOfCompany: "",
        phoneNumberOfStudent: "",
        career: "",
        status: "unconfirmed",
        mssv: "",
        classId: "",
      },
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal", false);
    },
      async createCertificateAsync() {

      this.certificate.mssv = this.userProfile.mssv;
      this.certificate.classId = this.userProfile.classId;
      this.certificate.taxCode = this.keyCompany.taxCode;
      this.certificate.companyName = this.keyCompany.title;
      this.certificate.companyAddress = this.keyCompany.companyAddress;
      this.certificate.owner = this.keyCompany.owner;
      this.certificate.phoneNumber = this.keyCompany.phoneNumberOfCompany;
      this.certificate.career = this.keyCompany.career;
      this.showLoading();
      let api = new CertificateService();
      let response = await api.createCertificateAsync(this.certificate);
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
      this.closeModal();
    },
  },
};
</script>
