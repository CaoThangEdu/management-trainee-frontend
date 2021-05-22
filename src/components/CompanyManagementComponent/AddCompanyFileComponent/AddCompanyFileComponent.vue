<template src='./AddCompanyFileComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
// import CompanyViewModel from "../../../view-model/Company/CompanyViewModel";
import CompanyService from '../../../services/company/companyServices'
import AppConfig from "../../../../src/app.config.json";
import XLSX from "xlsx";
export default {
  name: "AddCompanyFileComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShowFile: false,
      companies: [],
      metadataFile: [],
      errorMessages: [],
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  methods: {
    closeModal(changeData) {
      this.isShowFile = false;
      if (changeData) {
        this.$emit("change-data");
      }
    },

    async previewFiles(e) {
      var files = e.target.files,f = files[0];
      var reader = new FileReader();
      var vm = this;
      reader.onload = async function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        vm.metadataFile = XLSX.utils.sheet_to_json(worksheet);
       
      };
      reader.readAsArrayBuffer(f);
    },

    async pressEnterKey() {
      await this.addTeacherByFile();
    },
    async createCompanyByFlieAsync(i) {
      this.showLoading();
      let api = new CompanyService();
      let response = await api.createCompanyAsync(this.companies[i]);
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

      this.closeModal(true);
    },

    async addTeacherByFile() {
      this.companies = this.metadataFile;
      var companyLength = this.companies.length;
      for (let i = 0; i < this.companies.length; i++) {
        // validate
        // let viewModel = new CompanyViewModel();
        // viewModel.setFields(this.Companys[i]);
        // this.errorMessages = viewModel.isValid();

        // if (this.errorMessages.length > 0) {
        //   return;
        // }
        this.createCompanyByFlieAsync(i);
      }

      if (companyLength != this.companies.length) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới thất bại"
        );
      } else {
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_created_success_default}`
        );
      }
    },
  },
  watch: {
    data() {
      this.isShowFile = true;
    },
  },
};
</script>

<style lang='scss'>
@import "./AddCompanyFileComponent.scss";
.form-select-class {
  width: 100%;
  height: 35px;
}
.brith-day {
  width: 100%;
  height: 35px;
}
</style>
