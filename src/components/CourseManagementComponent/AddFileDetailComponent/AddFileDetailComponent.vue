<template src='./AddFileDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import CourseService from '../../../services/course/courseServices'
import CourseViewModel from "../../../view-model/course/courseViewModel"
import AppConfig from '../../../../src/app.config.json'
import XLSX from 'xlsx'

export default {
  name: 'AddFileDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShowAddFile: false,
      course: {},
      metaDataFile: [],
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

    async previewFiles(e) {
      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      var vm = this;

      reader.onload = async function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        let sheetName = workbook.SheetNames[0]
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        vm.metaDataFile = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
    },

    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.course = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createCourseAsync() {
      this.course = this.metaDataFile
      this.showLoading();
      let api = new CourseService();
      let response = await api.createCourseAsync(this.course);
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

    async save() {
      this.course = this.metaDataFile
      const courseLength = this.course.length;
      for (let i = 0; i < this.course.length; i++){
        // validate
        let viewModel = new CourseViewModel();
        viewModel.setFields(this.course[i]);
        this.errorMessages = viewModel.isValid();

        if (this.errorMessages.length > 0) {
          return;
        }
        this.showLoading();
        let api = new CourseService();
        let response = await api.createCourseAsync(this.course[i]);
        // this.showLoading(false);
        if(!response.isOK){
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            response.errorMessages
          );
          return;
        }
        // Tạo thành công
      }
      if(courseLength === this.course.length){
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_created_success_default}`
        );
      } else {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới thất bại"
        );
      }
    },
  },

  watch: {
    data() {
      this.isShow = true;
      this.course = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './AddFileDetailComponent.scss';
</style>
