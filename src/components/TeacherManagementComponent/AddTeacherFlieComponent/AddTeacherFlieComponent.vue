<template src='./AddTeacherFlieComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
// import TeacherViewModel from "../../../view-model/teacher/teacherViewModel";
import TeacherService from '../../../services/teacher/teacherServices'
import AppConfig from "../../../../src/app.config.json";
import XLSX from "xlsx";

export default {
  name: "AddTeacherFileComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShowFile: false,
      teachers: [],
      metadataFile: [],
      errorMessages: [],
      careersId:"",
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    careers:Array
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
        vm.metadataFile.forEach(function(element) { element.status = "active"; });
        vm.metadataFile.forEach(function(element) { element.careersId = vm.careersId; console.log(vm.careersId, element.careersId); });
       
        console.log(this.careersId);
      };
      reader.readAsArrayBuffer(f);
    },

    async pressEnterKey() {
      await this.save();
    },
    async createTeacherByFlieAsync(i) {
      console.log('careersId', this.teachers[i].careersId)
      this.showLoading();
      let api = new TeacherService();
      let response = await api.createTeacherAsync(this.teachers[i]);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.closeModal(true);
    },

    async save() {
      this.teachers = this.metadataFile;
      var teacherLength = this.teachers.length;
      for (let i = 0; i < this.teachers.length; i++) {
        // validate
        // let viewModel = new TeacherViewModel();
        // viewModel.setFields(this.teachers[i]);
        // this.errorMessages = viewModel.isValid();

        // if (this.errorMessages.length > 0) {
        //   return;
        // }
        this.createTeacherByFlieAsync(i);
      }

      if (teacherLength != this.teachers.length) {
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
@import "./AddTeacherFlieComponent.scss";
.form-select-class {
  width: 100%;
  height: 35px;
}
.brith-day {
  width: 100%;
  height: 35px;
}
</style>
