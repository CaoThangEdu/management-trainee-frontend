<template>
  <div class="row notifications">
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
          Thông báo
          <router-link
            :to="{ name: 'them-thong-bao' }"
            class="btn btn-primary float-right"
            title="Thêm mới"
            v-if="userProfile && userProfile.role == 'Admin'"
          >
            <i class="fa fa-plus-square"></i>
          </router-link>
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div class="col-xl-4 col-md-4 col-sm-12 mb-sm-2">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      id="keywords"
                      placeholder="Nhập từ khóa tiêu đề thông báo"
                      v-model="filterNotify.title"
                    />
                  </div>
                </div>
                <div class="col-xl-4 col-md-4 col-sm-12 mb-sm-2">
                  <div class="input-group select-plan">
                    <SelectPlan
                      :isRequired="false"
                      v-model="filterNotify.internshipCourseId"
                      :plans="plans"
                      :defaultText="'Đợt thực tập'"
                      @change="
                        (event) => {
                          filterNotify.internshipCourseId = event.id;
                        }
                      "
                    >
                    </SelectPlan>
                  </div>
                </div>
                <div class="col-xl-4 col-md-4 col-sm-12 mb-sm-2">
                  <div class="input-group">
                    <select class="form-control form-select form-select-class"
                      name="notifyStatusEnums" id="notifyStatusEnums"
                      v-model="filterNotify.status">
                      <option value="">Tất cả trạng thái</option>
                      <option v-for="(item, index) in notifyStatusEnums"
                        :key="index + 'notifyStatus'"
                        :value="item.value">
                        {{item.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-xl-2 col-md-4 col-sm-12">
                  <button
                    type="submit"
                    @click="getNotificationsAsync()"
                    id="btn-search"
                    class="btn btn-primary"
                  >
                    Tìm kiếm
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
                  <th scope="col">Nội dung</th>
                  <th scope="col">Người gửi</th>
                  <th scope="col" class="text-center">Đợt thực tập</th>
                  <th scope="col">Ngày gửi</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(notify, index) in pageOfNotifications"
                  :key="index + 'notification'"
                >
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ notify.notify.title }}</td>
                  <td>{{ notify.notify.content }}</td>
                  <td>{{ notify.userCreate }}</td>
                  <td class="text-center" v-if="plans.length != 0">
                    {{
                      notify.notify.internshipCourseId
                        ? getPlanName(notify.notify.internshipCourseId)
                        : ""
                    }}
                  </td>
                  <td>{{ convertTime(notify.notify.creationTime, 'HH:mm DD/MM/YYYY') }}</td>
                  <td>
                    <router-link
                      :to="{ name: 'thong-ke-thong-bao', params: { guid: notify.notify.id } }"
                      class="btn btn-success mr-2"
                      title="Thống kê báo cáo">
                      <em class="fas fa-file-contract"></em>
                    </router-link>
                  </td>
                </tr>
                <tr
                  v-show="notifications == null || notifications.length === 0"
                >
                  <th colspan="5" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="card-footer d-flex justify-content-center text--blue"
          v-show="notifications == null || notifications.length === 0"
        >
          <JwPagination
            :items="notifications"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="10"
          >
          </JwPagination>
        </div>
      </div>
    </div>
    <NotificationManagementDetailComponent :data="editNoti" />
  </div>
</template>

<script>
import NotificationManagementDetailComponent from "../NotificationManagementDetailComponent/NotificationManagementDetailComponent";
import NotificationService from "../../../services/notification/notificationServices";
import ComponentBase from "../../common/component-base/ComponentBase";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import PlanService from "../../../services/plan/planServices";
import SelectPlan from "../../common/form/select-plan/SelectPlan.vue";
import { NOTYFY_STATUS_ENUM } from "../../../config/constant";
import { mapGetters, mapActions } from "vuex";
import crudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ListNotificationManagementComponent",
  extends: ComponentBase,
  components: {
    NotificationManagementDetailComponent,
    JwPagination,
    SelectPlan,
  },
  mixins:[crudMixin],
  data() {
    return {
      notifications: [],
      editNoti: {},
      pageOfItems: [],
      filterNotify: {
        internshipCourseId: "",
        isActive: true,
        title: "",
        status: "",
      },
      pageOfNotifications: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      plans: [],
      notifyStatusEnums: NOTYFY_STATUS_ENUM,
    };
  },
  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }
    await this.getNotificationsAsync();
    await this.getPlansAsync();
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
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

    getPlanName(id) {
      return this.plans.find((plan) => plan.id == id).internshipCourseName;
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

    createNotify() {
      this.editNoti = {};
    },

    onChangePage(pageOfNotifications) {
      // update page of items
      this.pageOfNotifications = pageOfNotifications;
    },
    // Get all notify
    async getNotificationsAsync() {
      if (this.filterNotify.internshipCourseId == -1) {
        this.filterNotify.internshipCourseId = '';
      }
      // Call Api
      this.showLoading();
      const api = new NotificationService();
      const response = await api.getNotificationsAsync(this.filterNotify);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.notifications = response.data;
    },
  },
};
</script>

<style lang='scss'>
div.notifications {
  .select-plan {
    width: 100%;
    div {
      width: 100%;
    }
    .select2-container {
      width: 100%;
    }
  }
}
</style>