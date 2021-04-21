<template src='./AddCompanyFlieComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import CompanyService from "../../../services/company/companyServices";
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
      companys: [],
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
      await this.addCompanyByFile();
    },
    async createCompanyByFlieAsync(i) {
      this.showLoading();
      let api = new CompanyService();
      let response = await api.createCompanyAsync(this.companys[i]);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages + "<br/> Đã thêm được " + i + " công ty"
              + "<br/> Lỗi tại công ty thứ " + (i +1)
        );
        return;
      }
      this.closeModal(true);
    },

    async addCompanyByFile() {
      this.companys = this.metadataFile;
      var companyLength = this.companys.length;
      for (let i = 0; i < this.companys.length; i++) {
        // validate
        // let viewModel = new companyViewModel();
        // viewModel.setFields(this.companys[i]);
        // this.errorMessages = viewModel.isValid();

        // if (this.errorMessages.length > 0) {
        //   return;
        // }
        this.createCompanyByFlieAsync(i);
      }

      if (companyLength != this.companys.length) {
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
@import "./AddCompanyFlieComponent.scss";
.form-select-class {
  width: 100%;
  height: 35px;
}
.brith-day {
  width: 100%;
  height: 35px;
}
</style>
