<template>
  <BaseModal
    @mouse-click-outside="closeModal(false)"
    :modalName="`weeklyReportDetailComponent`"
    :isShow="isShow"
    size="lg"
  >
    <div class="">
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
            v-model="weeklyReportInfo.title"
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
            v-model="weeklyReportInfo.description"
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
            v-model="weeklyReportInfo.link"
          />
        </div>
      </div>
    </div>

    <template #header>
      <h5>{{ weeklyReportInfo.id ? "Cập nhật báo cáo" : "Thêm mới báo cáo" }}</h5>
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
            {{ weeklyReportInfo.id ? "Cập nhật" : "Thêm mới" }}
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
import WeeklyReportService from "../../../services/weeklyReport/weeklyReportServices";
import WeeklyReportViewModel from "../../../view-model/weeklyReport/weeklyReportViewModel";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "WeeklyReportDetailComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [CrudMixin],
  data() {
    return {
      isShow: false,
      weeklyReportInfo: {
        title: "",
        studenId: "",
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
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },

  async mounted() {
    if (this.userProfile.user) return;
    await this.getUserProfile();
  },

  methods: {
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),
    async getUserProfile() {
      // Check: if has token => get profile else push to LoginPage
      if (this.tokenKey) {
        if (!this.userProfile || !this.userProfile.user) {
          await this.updateUserInfoDataAsync();
        }
      } else {
        if (this.$route.name !== "login") {
          this.$router.push({ name: "login" });
        }
      }
    },

    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.weeklyReportInfo = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createWeeklyReportAsync() {
      this.showLoading();
      let api = new WeeklyReportService();
      let response = await api.createWeeklyReportAsync(
        this.weeklyReportInfo
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

    async updateWeeklyReportAsync() {
      this.showLoading();
      let api = new WeeklyReportService();
      let response = await api.updateWeeklyReportAsync(
        this.weeklyReportInfo
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
      this.weeklyReportInfo.studenId = this.userProfile.studentId;
      // validate
      let viewModel = new WeeklyReportViewModel();
      viewModel.setFields(this.weeklyReportInfo);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.weeklyReportInfo.id === undefined) {
        await this.createWeeklyReportAsync();
      } else {
        await this.updateWeeklyReportAsync();
      }
    },
  },

  watch: {
    data() {
      this.isShow = true;
      this.weeklyReportInfo = this.data;
    },
  },
};
</script>
