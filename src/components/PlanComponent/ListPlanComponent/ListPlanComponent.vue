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
          Danh sách kế hoạch
          <router-link
            :to="{ name: 'them-ke-hoach' }"
            class="btn btn-primary float-right"
            title="Thêm mới"
          >
            <em class="fa fa-plus-square"></em>
          </router-link>
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div class="col-xl-5 col-lg-5 col-md-4 col-sm-12 col-12">
                  <select
                    class="form-control form-select form-select-class"
                    name="status" id="status" v-model="filter.status">
                    <option value="">Tất cả trạng thái</option>
                    <option v-for="(timeline, index) in timelineEnum"
                      :key="index + 'timeline'" :value="timeline.timelineName">
                      {{timeline.timelineName}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table">
              <caption></caption>
              <thead class="">
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Tên đợt</th>
                  <th scope="col">Ngày bắt đầu</th>
                  <th scope="col">Ngày kết thúc</th>
                  <th scope="col" class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(plan, index) in pageOfItems" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <th scope="row" title="Xem">
                    <router-link
                      :to="{ name: 'sua-ke-hoach', params: { guid: plan.id } }"
                    >
                      {{ plan.internshipCourseName }}
                      <em class="fas fa-external-link-alt"></em>
                    </router-link>
                  </th>
                  <td>{{ convertTime(plan.startDay, "DD/MM/YYYY") }}</td>
                  <td>{{ convertTime(plan.endDay, "DD/MM/YYYY") }}</td>
                  <td class="text-lg-center">
                    <router-link
                      class="btn btn-instagram mr-2"
                      title="Chi tiết kế hoạch"
                      :to="{
                        name: 'chi-tiet-ke-hoach',
                        params: { guid: plan.id },
                      }"
                    >
                      <em class="fas fa-info-circle"></em>
                    </router-link>
                    <router-link
                      class="btn btn-info mr-2"
                      title="Thêm sinh viên"
                      :to="{
                        name: 'them-sv-cua-dot',
                        params: { guid: plan.id },
                      }"
                    >
                      <em class="fa fa-arrow-alt-circle-right"></em>
                    </router-link>
                    <button
                      class="btn btn-danger"
                      @click="deletePlan(plan)"
                      title="Xóa"
                    >
                      <em class="fa fa-trash"></em>
                    </button>
                  </td>
                </tr>
                <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                  <th scope="" colspan="5" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ConfirmDialog :data="confirmPlan" @agree="deletePlanConfirm">
        </ConfirmDialog>
        <div class="card-footer d-flex justify-content-center text--blue"
          v-show="pageOfItems.length !== 0">
          <div class="form-group d-flex page-size-group mb-0 mr-2"
            v-if="getPlan.length!=0">
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
            :items="plans"
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
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import PlanService from "../../../services/plan/planServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import { TIME_LINE_ENUM } from "../../../config/constant";

export default {
  name: "ListPlan",
  extends: ComponentBase,
  components: {
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  props: {
    plans: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      editPlan: {},
      detailPlan: {},
      confirmPlan: null,
      renderPlanDetail: true,
      renderPlanInfo: true,
      showDetail: null,
      filter: {
        status: "",
      },
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageSize: 10,
      timelineEnum: TIME_LINE_ENUM,
    };
  },
  computed: {
    getPlan() {
      return this.plans;
    }
  },

  methods: {
    async changePageSize() {
      await this.$emit("change-page", 1);
    },

    async searchPlan() {
      await this.$emit("search-plan", this.filter);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },

    deletePlan(item) {
      this.confirmPlan = null;
      this.confirmPlan = { item: item };
    },

    // Call api delete Plan
    async deletePlanConfirm(planComfirm) {
      this.showLoading();
      let api = new PlanService();
      let response = await api.deletePlanAsync(planComfirm.item.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.$emit("change-data-plan-component", planComfirm.item.id);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },
  },
  watch:{
    "filter.status":async function() {
      await this.searchPlan()
    }
  }
};
</script>