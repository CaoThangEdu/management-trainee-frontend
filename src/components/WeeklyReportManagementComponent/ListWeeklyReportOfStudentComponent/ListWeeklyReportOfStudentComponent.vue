<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <header class="card-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            role="img"
            class="c-icon"
          >
            <path
              fill="var(--ci-primary-color, currentColor)"
              d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
              class="ci-primary"
            ></path>
          </svg>
          Danh sách báo cáo hàng tuần
          <button class="btn btn-primary float-right btn-search"          
            @click="createWeeklyReport" title="Thêm mới">
            <em class="fa fa-plus-square"></em>
          </button>
        </header>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead class="">
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Tiêu đề</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col">Đường dẫn</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pageOfItems" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td class="link-detail"
                    @click="updateWeeklyReport(index)"
                    title="Xem">
                    {{ item.title }}
                    <em class="fas fa-external-link-alt"></em>
                  </td>
                  <td>{{item.description}}</td>
                  <td>
                    <a :href="item.link" target="_blank">
                      Xem chi tiết
                    </a>
                  </td>
                  <td>
                    <button class="btn btn-danger" title="Xóa"
                      @click="deleteWeeklyReport(item)">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                  <th colspan="5" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <WeeklyReportDetailComponent
          :data="editWeeklyReport"
          @change-data="changeData"
        />

        <ConfirmDialog
          :data="confirmWeeklyReport"
          @agree="deleteWeeklyReportConfirm"
        ></ConfirmDialog>

        <div
          class="card-footer d-flex justify-content-center text--blue"
          v-show="pageOfItems == null || pageOfItems.length === 0"
        >
          <JwPagination
            :items="weeklyReports"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="5"
          >
          </JwPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WeeklyReportDetailComponent from "../WeeklyReportDetailComponent/WeeklyReportDetailComponent.vue";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import WeeklyReportService from "../../../services/weeklyReport/weeklyReportServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ListWeeklyReportOfStudentComponent",
  extends: ComponentBase,
  components: {
    WeeklyReportDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      weeklyReports: [],
      editWeeklyReport: {},
      confirmWeeklyReport: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filter: {
        internshipCourseId: "",
        studentId: "",
        teacherId: "",
      },
    };
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },

  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }
    await this.getWeeklyReportFilterAsync();
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
    
    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createWeeklyReport() {
      this.editWeeklyReport = {};
    },

    async getWeeklyReportFilterAsync() {
      this.filter.studentId = this.userProfile.studentId;
      this.filter.internshipCourseId = this.userProfile.internshipCourseId;
      // Call Api
      this.showLoading();
      const api = new WeeklyReportService();
      const response = await api.getWeeklyReportsAsync(this.filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.weeklyReports = response.data;
    },

    async changePage(currentPage) {
      await this.getWeeklyReportFilterAsync(currentPage);
    },

    updateWeeklyReport(index) {
      this.editWeeklyReport = Object.assign({}, this.pageOfItems[index]);
    },

    deleteWeeklyReport(confirmWeeklyReport) {
      this.confirmWeeklyReport = confirmWeeklyReport;
    },

    // Call api delete Class
    async deleteWeeklyReportConfirm(weeklyReportsComfirm) {
      this.showLoading();
      let api = new WeeklyReportService();
      let response = await api.deleteWeeklyReportAsync(weeklyReportsComfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.weeklyReports = this.weeklyReports.filter(
        weeklyReportsInfo => weeklyReportsInfo.id != weeklyReportsComfirm.id
      );
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeData() {
      await this.getWeeklyReportFilterAsync();
    },
  },
};
</script>
