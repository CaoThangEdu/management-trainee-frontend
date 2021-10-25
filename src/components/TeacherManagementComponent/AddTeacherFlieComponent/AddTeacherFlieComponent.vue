<template>
<BaseModal
  @mouse-click-outside="closeModal(false)"
  :modalName="`AddTeacherFlieComponent`"
  :isShow="isShowFile"
  size="lg"
>
  <div class="form-group row">
    <label class="col-md-4 col-sm-4 col-form-label">Chọn file excel</label>
    <div class="col-md-8 col-sm-8">
      <div class="input-group mb-3">
        <input
          type="file"
          class="btn btn-secondary float-right btn-add-file"
          @change="previewFiles"
        />
      </div>
    </div>
  </div>

  <template #header>
    <h5>{{"Thêm giáo viên"}}</h5>
    <button class="close" style="color: red;" @click="closeModal(false)">
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
        <button @click="save" class="btn btn-primary float-right ml-2">
          {{"Thêm mới"}}
        </button>
        <button class="btn btn-dark float-right" @click="closeModal(false)">
          Hủy
        </button>
      </div>
    </div>
  </template>
</BaseModal>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
// import TeacherViewModel from "../../../view-model/teacher/teacherViewModel";
import TeacherService from '../../../services/teacher/teacherServices'
import AppConfig from "../../../../src/app.config.json";
import XLSX from "xlsx";
import crudMixin from "../../../helpers/mixins/crudMixin";
import createUserMixin from "../../../helpers/mixins/createUserMixin";

export default {
  name: "AddTeacherFileComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
   mixins: [ crudMixin, createUserMixin ],

  data() {
    return {
      isShowFile: false,
      teachers: [],
      teachersForCreate: [],
      metadataFile: [],
      errorMessages: [],
      dataForCreateUser: {
        username: "",
        name: "",
        surname: "",
        emailAddress: "",
      },
      dataForCreateUsers: []
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    faculties: {
      type: Array,
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
        vm.metadataFile.forEach(function(element) { element.status = "active"; });
        vm.metadataFile.forEach(function(element) { element.facultyId = 'facultyId'; });
      };
      reader.readAsArrayBuffer(f);
    },

    async pressEnterKey() {
      await this.save();
    },

    async createTeachersAsync() {     
      this.showLoading();
      let api = new TeacherService();
      let response = await api.createTeachersAsync(this.teachersForCreate);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return false;
      }
      this.closeModal(true);
      return true;
    },
  
    async save() {
      this.teachersForCreate = [];
      this.teachers = this.metadataFile;
      var teacherLength = this.teachers.length;
      for (let i in this.teachers) {
        // duyệt danh sách teacher từ file
        this.dataForCreateUser ={
          username: this.teachers[i].firstName + this.teachers[i].lastName,
          name: this.teachers[i].firstName,
          surname : this.teachers[i].lastName,
          emailAddress : this.teachers[i].email
        };
        this.dataForCreateUsers.push(this.dataForCreateUser);
        this.teachers[i].facultyId = this.faculties[0].id;
        this.teachersForCreate.push(this.teachers[i])
      }

      let createUserResponse = await this.createTeachersAsync();
      this.showLoading(false);
      if (!createUserResponse) {
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
.form-select-class {
  width: 100%;
  height: 35px;
}
.brith-day {
  width: 100%;
  height: 35px;
}
</style>
