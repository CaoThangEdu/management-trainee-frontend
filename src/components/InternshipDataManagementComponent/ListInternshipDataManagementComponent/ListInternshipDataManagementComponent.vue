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
          Danh sách link biểu mẫu
          <button class="btn btn-primary float-right btn-search"          
            @click="createInternshipData" title="Thêm mới">
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
                    @click="getInternshipDataFilterAsync()">
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
                  <th scope="col">Đợt thực tập</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col">Đường dẫn</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pageOfItems" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td class="link-detail"
                    title="Xem"
                    @click="updateInternshipData(index)">{{ item.title }}</td>
                  <td v-if="plans.length > 0">
                    {{
                      getInfoObject(item.internshipCourseId, plans)
                        .internshipCourseName
                    }}
                  </td>
                  <td>{{item.description}}</td>
                  <td>{{item.link}}</td>
                  <td>
                    <button class="btn btn-danger" title="Xóa"
                      @click="deleteInternshipData(item)">
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
        <InternshipDataDetailComponent
          :data="editInternshipData"
          @change-data="changeData"
          :plans="plans"
        />

        <ConfirmDialog
          :data="confirmInternshipData"
          @agree="deleteInternshipDataConfirm"
        ></ConfirmDialog>

        <div
          class="card-footer d-flex justify-content-center text--blue"
          v-show="pageOfItems.length !== 0"
        >
          <div class="form-group d-flex page-size-group mb-0 mr-2">
            <select class="form-control w-auto"
              @change="changePageSize()"
              v-model="pageSize">
              <option value="10">10/ trang</option>
              <option value="20">20/ trang</option>
              <option value="30">30/ trang</option>
              <option value="40">40/ trang</option>
              <option value="50">50/ trang</option>
            </select>
          </div>
          <JwPagination
            :items="internshipData"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="Number(pageSize)"
          >
          </JwPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InternshipDataDetailComponent from "../InternshipDataDetailComponent/InternshipDataDetailComponent.vue";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import InternshipDataService from "../../../services/internshipData/internshipDataServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import PlanService from "../../../services/plan/planServices";

export default {
  name: "ListInternshipDataManagementComponent",
  extends: ComponentBase,
  components: {
    InternshipDataDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      internshipData: [],
      editInternshipData: {},
      confirmInternshipData: null,
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
      plans: [],
      pageSize: 10,
    };
  },

  async mounted() {
    await this.getInternshipDataFilterAsync();
    await this.getPlansAsync();
  },

  methods: {
    async changePageSize() {
      await this.getInternshipDataFilterAsync();
    },

    async getPlansAsync() {
      let planFilter = {
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlansAsync(planFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data;
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

    createInternshipData() {
      this.editInternshipData = {};
    },

    async getInternshipDataFilterAsync() {
      // Call Api
      this.showLoading();
      const api = new InternshipDataService();

      const response = await api.getInternshipDataAllAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.internshipData = response.data.items;
    },

    async changePage(currentPage) {
      await this.getInternshipDataFilterAsync(currentPage);
    },

    updateInternshipData(index) {
      this.editInternshipData = Object.assign({}, this.pageOfItems[index]);
    },

    deleteInternshipData(classroom) {
      this.confirmInternshipData = classroom;
    },

    // Call api delete Class
    async deleteInternshipDataConfirm(internshipDataComfirm) {
      this.showLoading();
      let api = new InternshipDataService();
      let response = await api.deleteInternshipDataAsync(internshipDataComfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.internshipData = this.internshipData.filter(
        internshipDataInfo => internshipDataInfo.id != internshipDataComfirm.id
      );
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default} ${internshipDataComfirm.title}`
      );
    },

    async changeData() {
      await this.getInternshipDataFilterAsync();
    },
  },
};
</script>

<style lang="scss">
</style>
