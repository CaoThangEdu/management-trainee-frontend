<template>
  <BaseModal
    @mouse-click-outside="closeModal(false)"
    :modalName="`InternshipDataDetailComponent`"
    :isShow="isShow"
    size="lg"
  >
    <div class="">
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Đợt thực tập
          (<span class="text--red">*</span>)
        </label>
        <div class="col-md-8 col-sm-8">
          <div class="input-group mb-3">
            <select
              class="form-control form-select form-select-class"
              v-model="internshipDataInfo.internshipCourseId"
            >
              <option
                v-for="(item, index) in plans"
                :key="index"
                :value="item.id"
              >
                {{ item.internshipCourseName }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Tiêu đề
          (<span class="text--red">*</span>)
        </label>
        <div class="col-md-8 col-sm-8">
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="internshipDataInfo.title"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Mô tả
          (<span class="text--red">*</span>)  
        </label>
        <div class="col-md-8 col-sm-8">
          <textarea
            class="form-control"
            id="description"
            v-model="internshipDataInfo.description"
          ></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">
          Link đường dẫn
          (<span class="text--red">*</span>)
        </label>
        <div class="col-md-8 col-sm-8">
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="internshipDataInfo.link"
          />
          <div>
            <span class="text--italic text--red">
              Vui lòng copy link google drive để vào đây!
            </span>
            <a href="https://drive.google.com/" target="_blank">
              Đi đến google drive của bạn
            </a>
          </div>
        </div>
      </div>
    </div>

    <template #header>
      <h5>{{ internshipDataInfo.id ? "Cập nhật biểu mẫu" : "Thêm mới biểu mẫu" }}</h5>
      <button class="close" style="color: red" @click="closeModal(false)">
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
            {{ internshipDataInfo.id ? "Cập nhật" : "Thêm mới" }}
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
import InternshipDataService from "../../../services/internshipData/internshipDataServices";
import InternshipDataViewModel from "../../../view-model/internshipData/internshipDataViewModel";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "InternshipDataDetailComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [CrudMixin],
  data() {
    return {
      isShow: false,
      internshipDataInfo: {
        title: "",
        internshipCourseId: "",
        link: "",
        description: "",
      },
      errorMessages: [],
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    plans: {
      type: Array,
      default: null,
    },
  },

  methods: {
    getInfoObject(trainingSystemId, list) {
      return CrudMixin.methods.getInfo(trainingSystemId, list);
    },
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.internshipDataInfo = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createInternshipDataAsync() {
      this.showLoading();
      let api = new InternshipDataService();
      let response = await api.createInternshipDataAsync(
        this.internshipDataInfo
      );
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

    async updateInternshipDataAsync() {
      this.showLoading();
      let api = new InternshipDataService();
      let response = await api.updateInternshipDataAsync(
        this.internshipDataInfo
      );
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
      let viewModel = new InternshipDataViewModel();
      viewModel.setFields(this.internshipDataInfo);
      this.errorMessages = viewModel.isValid();
      if(this.internshipDataInfo.link && 
        !(this.internshipDataInfo.link.includes('https://drive.google.com'))) {
        this.errorMessages.push('Vui lòng copy link google drive để <strong>Link đường dẫn</strong> ')
      }
      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.internshipDataInfo.id === undefined) {
        await this.createInternshipDataAsync();
      } else {
        await this.updateInternshipDataAsync();
      }
    },
  },

  watch: {
    data() {
      this.isShow = true;
      this.internshipDataInfo = this.data;
    },
  },
};
</script>

<style lang='scss'>
</style>
