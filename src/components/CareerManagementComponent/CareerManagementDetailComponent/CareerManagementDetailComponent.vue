<template>
  <BaseModal
    @mouse-click-outside="closeModal(false)"
    :modalName="`CareerDetailComponent`"
    :isShow="isShow"
    size="lg"
  >
    <div class="">
           <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Hệ đào tạo (<span class="text--red">*</span>)
        </label>
        <div class="col-md-8 col-sm-8" v-if="trainingSystems">
          <select
            class="form-control form-select form-select-class"
            v-model="career.trainingSystemId"
          >
            <option
              v-for="(item, index) in trainingSystems"
              :key="index"
              :value="item.id"
              >{{ getFaculty(item.facultyId).facultyName }}-{{ item.trainingSystemName }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Tên ngành (<span class="text--red">*</span>)
        </label>
        <div class="col-md-8 col-sm-8">
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="career.careersName"
          />
        </div>
      </div>
    </div>

    <template #header>
      <h5>{{ career.id ? "Cập nhật ngành" : "Thêm mới ngành" }}</h5>
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
            {{ career.id ? "Cập nhật" : "Thêm mới" }}
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
import CareerService from "../../../services/career/careerServices";
import CareerViewModel from "../../../view-model/career/careerViewModel";
import AppConfig from "../../../../src/app.config.json";
import crudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "CareerManagementDetailComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins:[crudMixin],
  data() {
    return {
      isShow: false,
      career: {},
      errorMessages: [],
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    trainingSystems: {
      type: Array,
      default: null,
    },
    faculties: {
      type: Array,
      default: null,
    },
  },

  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData, career, type) {
      if (changeData) {
        this.$emit("change-data",career, type);
      }
      this.isShow = false;
      this.career = {};
    },

    async createCareerAsync() {
      this.career.status = "active";
      this.showLoading();
      let api = new CareerService();
      let response = await api.createCareerAsync(this.career);
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

      this.closeModal(true, response.data, "create");
    },

    async updateCareerAsync() {
      this.showLoading();
      let api = new CareerService();
      let response = await api.updateCareerAsync(this.career);
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

     this.closeModal(true, response.data, "update");
    },

    async save() {
      // validate
      let viewModel = new CareerViewModel();
      viewModel.setFields(this.career);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.career.id === undefined) {
        await this.createCareerAsync();
      } else {
        await this.updateCareerAsync();
      }
    },

    getFaculty(facultyId){
      let facultyById = crudMixin.methods.convertArrayToObject(this.faculties, "id");
      if(facultyById[facultyId] === undefined){
        return {facultyName: ""}
      }
      return facultyById[facultyId];
    }
  },

  watch: {
    data() {
      this.isShow = true;
      this.career = this.data;
    },
  },
};
</script>

<style lang="scss">

</style>
