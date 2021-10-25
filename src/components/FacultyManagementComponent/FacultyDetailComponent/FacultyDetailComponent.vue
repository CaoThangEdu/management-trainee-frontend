<template>
  <BaseModal
    @mouse-click-outside="closeModal(false)"
    :modalName="`FacultyDetailComponent`"
    :isShow="isShow"
    size="lg"
  >
    <div class="">
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Tên khoa (<span class="text--red">*</span>)
        </label>
        <div class="col-md-8 col-sm-8">
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="faculty.facultyName"
          />
        </div>
      </div>
    </div>

    <template #header>
      <h5>{{ faculty.id ? "Cập nhật khoa" : "Thêm mới khoa" }}</h5>
      <button class="close" style="color: red;" @click="closeModal(false)">
        &times;
      </button>
    </template>

    <template #footer>
      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <AlertMessages :messages="errorMessages" />
        </div>
      </div>

      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <button @click="save" class="btn btn-primary float-right ml-2">
            {{ faculty.id ? "Cập nhật" : "Thêm mới" }}
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
import FacultyService from "../../../services/faculty/facultyServices";
import facultyViewModel from "../../../view-model/faculty/facultyViewModel";
import AppConfig from "../../../../src/app.config.json";

export default {
  name: "FacultyDetailComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      faculty: {},
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
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.faculty = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createFacultyAsync() {
      this.showLoading();
      let api = new FacultyService();
      let response = await api.createFacultyAsync(this.faculty);
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

    async updateFacultyAsync() {
      this.showLoading();
      let api = new FacultyService();
      let response = await api.updateFacultyAsync(this.faculty);
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
        `${AppConfig.notification.content_updated_success_default}`
      );

      this.closeModal(true);
    },

    async save() {
      // validate
      let viewModel = new facultyViewModel();
      viewModel.setFields(this.faculty);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.faculty.id === undefined) {
        await this.createFacultyAsync();
      } else {
        await this.updateFacultyAsync();
      }
    },
  },

  watch: {
    data() {
      this.isShow = true;
      this.faculty = this.data;
    },
  },
};
</script>

<style lang="scss">
</style>
