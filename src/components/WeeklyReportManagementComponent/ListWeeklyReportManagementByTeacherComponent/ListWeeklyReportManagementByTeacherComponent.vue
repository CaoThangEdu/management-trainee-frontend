<template>
  <div class="row">
    <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
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
          Danh sách sinh viên
        </header>
        <div class="card-body">
          <div class="table-responsive table-hover">
            <table class="table">
              <thead class="">
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Họ tên</th>
                  <th scope="col">MSSV</th>
                  <th scope="col">Lớp</th>
                  <th scope="col">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in pageOfItems" :key="index + 'student'"
                  :class="{'bg-info text-white': (currentIndex == index)}">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ student.firstname + ' ' + student.lastname }}</td>
                  <td>{{student.studentCode}}</td>
                  <td>{{student.className}}</td>
                  <td>
                    <button
                      @click="chooseStudent(student, index)"
                      class="btn btn-info"
                      title="Nhấn để xem chi tiết thông tin sinh viên và báo cáo của sinh viên"
                      :class="{'bg-white text-dark': (currentIndex == index)}"
                      ><em class="fas fa-info-circle"></em></button>
                  </td>
                </tr>
                <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                  <th colspan="4" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="card-footer d-flex justify-content-center text--blue"
          v-show="pageOfItems == null || pageOfItems.length === 0">
          <JwPagination
            :items="weeklyReports"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="10"
          >
          </JwPagination>
        </div>
      </div>
    </div>
    <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
      <WeeklyReportOfStudentDetail 
        :studentDetail="studentDetail"/>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import WeeklyReportService from "../../../services/weeklyReport/weeklyReportServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import { mapGetters, mapActions } from "vuex";
import WeeklyReportOfStudentDetail from '../WeeklyReportOfStudentDetail/WeeklyReportOfStudentDetail.vue';

export default {
  name: "ListWeeklyReportManagementByTeacherComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    WeeklyReportOfStudentDetail,
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
      plans: [],
      teachers: [],
      studentDetail: {},
      currentIndex: -1,
    };
  },

  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }    
    await this.getWeeklyReportFilterAsync();
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

    chooseStudent(student, index) {
      this.studentDetail = JSON.parse(JSON.stringify(student));
      this.currentIndex = index;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
      this.currentIndex = -1;
    },

    async getWeeklyReportFilterAsync() {
      // Call Api
      this.showLoading();
      const api = new WeeklyReportService();
      const response = await api.getWeeklyReportByTeacherIdAsync(this.userProfile.teacherId);
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
      this.currentIndex = -1;
    },
  },
};
</script>
