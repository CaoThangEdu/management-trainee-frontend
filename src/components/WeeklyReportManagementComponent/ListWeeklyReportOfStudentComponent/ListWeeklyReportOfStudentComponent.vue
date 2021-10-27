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
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div class="col-xl-2 col-md-2 col-sm-12 mb-sm-2">
                  <select
                    class="form-control form-select form-select-class"
                    v-model="filter.status"
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="unactive">Không hoạt động</option>
                  </select>
                </div>
                <div class="col-xl-4 col-md-4 col-sm-12 mb-sm-2">
                  <input
                    type="text"
                    class="form-control"
                    id="keywords"
                    placeholder="Nhập từ khóa"
                    v-model="filter.className"
                  />
                </div>
                <div class="col-xl-2 col-md-4 col-sm-12">
                  <button type="submit" id="btn-search" 
                    class="btn btn-stack-overflow"
                    title="Tìm kiếm"
                    @click="getWeeklyReportFilterAsync()">
                    <em class="fas fa-search"></em>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  <td>{{item.title}}</td>
                  <td>{{item.description}}</td>
                  <td>{{item.link}}</td>
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
        className: "",
        status: "active",
      },
    };
  },

  async mounted() {
    await this.getWeeklyReportFilterAsync();
  },

  methods: {
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
      // Call Api
      this.showLoading();
      const api = new WeeklyReportService();
      const response = await api.getWeeklyReportsAsync();
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

    deleteWeeklyReport(classroom) {
      this.confirmWeeklyReport = classroom;
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
        `${AppConfig.notification.content_deleted_success_default} ${weeklyReportsComfirm.title}`
      );
    },

    async changeData() {
      await this.getWeeklyReportFilterAsync();
    },
  },
};
</script>
