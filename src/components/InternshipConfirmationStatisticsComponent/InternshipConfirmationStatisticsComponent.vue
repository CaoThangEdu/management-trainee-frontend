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
          <span>Thống kê xác nhận thực tập</span>
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-xl-6 col-md-6 col-sm-12 mb-sm-12 mb-5">
              <label for="">Đợt thực tập:</label>
              <select
                class="form-control form-select form-select-class"
                v-model="filterStudent.internshipCourseId"
              >
                <option value="">Chọn đợt thực tập</option>
                <option
                  v-for="(plan, index) in plans"
                  :key="index"
                  :value="plan.id"
                >
                  {{ plan.internshipCourseName }}
                </option>
              </select>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12 mb-sm-12 mb-5">
              <label for="">Lớp:</label>
              <select
                class="form-control form-select form-select-class"
                v-model="filterStudent.classId"
              >
                <option value="">Tất cả</option>
                <option
                  v-for="(statistic, index) in statistics"
                  :key="index"
                  :value="statistic.classId"
                >
                  {{ statistic.className }}
                </option>
              </select>
            </div>
            <div class="col-lg-4 col-xl-4 col-md-12 col-sm-12">
              <Highcharts :options="pieChart" ref="pieCharts" />
            </div>
            <div class="col-lg-8 col-xl-8 col-md-12 col-sm-12">
              <div class="form-row filter-wrapper mx-0 mb-3">
                <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                  <input
                    type="text"
                    class="form-control"
                    id="filterStudent.keywords"
                    placeholder="Nhập từ khóa"
                  />
                </div>
                <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                  <button
                    @click="searchStudent"
                    type="submit"
                    id="btn-search"
                    class="btn btn-primary"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
              <div class="table-responsive table-internship-comfirmation">
                <table class="table">
                  <caption></caption>
                  <thead class="">
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col" class="align-middle">
                        Thông tin sinh viên
                      </th>
                      <th scope="col" class="align-middle">Trạng thái</th>
                      <th scope="col" class="align-middle text-center">Hoạt động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(student, index) in pageOfItems" :key="index">
                      <th scope="row">
                        <div>{{ index + 1 }}</div>
                      </th>
                      <td>
                        <div><strong>MSSV:</strong>{{ student.studentId }}</div>
                        <div>
                          <strong>Họ tên sinh viên:</strong>
                          {{ student.firstName }} {{ student.lastName }}
                        </div>
                        <div><strong>lớp:</strong> {{ student.className }}</div>
                      </td>
                      <td>
                        <button
                          v-if="
                            getInternshipConfirmationByStudentId(student.studentId).status === 'practiced'
                          "
                          class="btn btn-success not-active"
                          style="width: 117px;"
                        >
                          Xác nhận
                        </button>
                        <button
                          v-if="
                            getInternshipConfirmationByStudentId(student.studentId).status !== 'practiced'
                          "
                          class="btn btn-danger not-active"
                          style="width: 117px;"
                        >
                          Chưa xác nhận
                        </button>
                      </td>
                      <td class="text-center">
                        <button
                          v-if="getInternshipConfirmationByStudentId
                          (student.studentId).status === 'practiced'"
                          class="btn btn-primary"
                          @click="detailInternshipConfirmation(
                              getInternshipConfirmationByStudentId(student.studentId)
                            )"
                        >
                          <em class="fas fa-eye"></em>
                        </button>
                      </td>
                    </tr>
                    <tr v-show="students == null || students.length === 0">
                      <th colspan="5" class="text-left">
                        Không có dữ liệu nào được tìm thấy.
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
                 <div class="card-footer d-flex justify-content-center text--blue"
                  v-show="pageOfItems == null || pageOfItems.length === 0">
                  <select class="form-control w-auto mr-2"
                  @change="changePageSize()"
                  v-model="pageSize">
                  <option value="10">10/ trang</option>
                  <option value="20">20/ trang</option>
                  <option value="30">30/ trang</option>
                  <option value="40">40/ trang</option>
                  <option value="50">50/ trang</option>
                </select>
                  <JwPagination
                    :items="students"
                    @changePage="onChangePage"
                    :labels="customLabels"
                    :pageSize="Number(pageSize)"
                  >
                  </JwPagination>
              </div>
            </div>
          </div>
        </div>
        <IntershipConfirmationDetailComponent
          :intershipConfirmation="intershipConfirmation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InternshipConfirmationServices from "../../services/internshipconfirmation/InternshipConfirmationServices";
import JwPagination from "jw-vue-pagination";
import ComponentBase from "../common/component-base/ComponentBase";
import StudentService from "../../services/student/studentServices";
import CrudMixin from "../../helpers/mixins/crudMixin";
import { Chart } from "highcharts-vue";
import AppConfig from "../../../src/app.config.json";
import PlanService from "../../services/plan/planServices";
import IntershipConfirmationDetailComponent from "./IntershipConfirmationDetailComponent/IntershipConfirmationDetailComponent.vue";
export default {
  name: "InternshipConfirmationStatisticsComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    Highcharts: Chart,
    IntershipConfirmationDetailComponent,
  },
  mixins: [CrudMixin],
  data() {
    return {
      pieChart: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
        },
        title: {
          text: "Thống kê sinh viên thực tập",
        },
        tooltip: {
          pointFormat: '<b>{point.x} Sinh viên</b><br><b>{point.percentage:.1f} %</b> ',
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b><br>{point.percentage:.1f} %",
              distance: -50,
              filter: {
                property: "percentage",
                operator: ">",
                value: 4,
              },
            },
          },
        },
        colors: ["#2eb85c", "#e55353"],
        series: [
          {
            // name: "Share",
            data: [
              { name: "Xác nhận", y: 0 , x:0},
              { name: "Chưa xác nhận", y: 0, x:0 },
            ],
          },
        ],
      },
      pageSize: 10,
      internshipConfirmations: {},
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filterStudent: {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
      },
      pageOfItems: [],
      students: [],
      statistics: [],
      numberOfStudentACompany: 0,
      numberOfStudentNotACompany: 0,
      plans: [],
      intershipConfirmation: null,
    };
  },
  async mounted() {
    this.internshipConfirmations =
      await this.fliterInternshipConfirmationAsync();
    await this.getPlansAsync();
  },
  methods: {
    detailInternshipConfirmation(intershipConfirmation) {
      this.intershipConfirmation = intershipConfirmation;
    },
    async getPlansAsync() {
      let filter = {
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlansAsync(filter);
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

    async getStatisticalInternshipConfirm(internshipCourseId) {
      let filter = { internshipCourseId: internshipCourseId };
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.getStatisticalInternshipConfirm(filter);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data;
    },

    async fliterInternshipConfirmationAsync() {
      let filter = { studentId: "", status: "" };
      this.showLoading();
      let api = new InternshipConfirmationServices();
      let response = await api.fliterInternshipConfirmationAsync(filter);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    getInternshipConfirmationByStudentId(studentId) {
      if (
        !this.internshipConfirmations ||
        this.internshipConfirmations.length === 0
      )
        return;
      let internshipConfirmationsByStudentId =
        CrudMixin.methods.convertArrayToObject(
          this.internshipConfirmations,
          "studentId"
        );
      if (internshipConfirmationsByStudentId[studentId] === undefined) {
        return {
          taxCode: "",
          title: "",
          status: "",
        };
      }
      return internshipConfirmationsByStudentId[studentId];
    },

    async getStudentsByInternshipCourseAsync() {
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsInInternshipCourse(
        this.filterStudent
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
      this.students = response.data;
    },

    async setPieChart(internshipCourseId) {
      this.statistics = await this.getStatisticalInternshipConfirm(
        internshipCourseId
      );
      for (let i = 0; i <= this.statistics.length - 1; i++) {
        this.numberOfStudentACompany +=
          this.statistics[i].numberOfStudentACompany;
        this.numberOfStudentNotACompany +=
          this.statistics[i].numberOfStudentNotACompany;
      }
      this.pieChart.series[0].data[0].x = this.numberOfStudentACompany;
      this.pieChart.series[0].data[1].x = this.numberOfStudentNotACompany
      this.pieChart.series[0].data[0].y =
        (this.numberOfStudentACompany /
        (this.numberOfStudentACompany + this.numberOfStudentNotACompany)) *100;
      this.pieChart.series[0].data[1].y =
        (this.numberOfStudentNotACompany /
        (this.numberOfStudentACompany + this.numberOfStudentNotACompany)) *100;
    },

    async searchStudent() {
      await this.getStudentsByInternshipCourseAsync();
    },
    async changePageSize() {
      await this.getStudentsByInternshipCourseAsync();
    },
  },

  watch: {
    "filterStudent.internshipCourseId": async function () {
      if (this.filterStudent.internshipCourseId === "") {
        this.pieChart.series[0].data[0].y = 0;
        this.pieChart.series[0].data[1].y = 0;
        this.students = [];
        return;
      }
      this.setPieChart(this.filterStudent.internshipCourseId);
      await this.getStudentsByInternshipCourseAsync();
    },

    "filterStudent.classId": async function () {
      if (this.filterStudent.classId === "") {
        this.pieChart.series[0].data[0].y =
          (this.numberOfStudentACompany /
            (this.numberOfStudentACompany + this.numberOfStudentNotACompany)) *
          100;
        this.pieChart.series[0].data[1].y =
          (this.numberOfStudentNotACompany /
            (this.numberOfStudentACompany + this.numberOfStudentNotACompany)) *
          100;
        await this.getStudentsByInternshipCourseAsync();
        return;
      }
      let statisticsByClassId = CrudMixin.methods.convertArrayToObject(
        this.statistics,
        "classId"
      );
      this.pieChart.series[0].data[0].y =
        (statisticsByClassId[this.filterStudent.classId]
          .numberOfStudentACompany /
          (statisticsByClassId[this.filterStudent.classId]
            .numberOfStudentACompany +
            statisticsByClassId[this.filterStudent.classId]
              .numberOfStudentNotACompany)) *
        100;

      this.pieChart.series[0].data[1].y =
        (statisticsByClassId[this.filterStudent.classId]
          .numberOfStudentNotACompany /
          (statisticsByClassId[this.filterStudent.classId]
            .numberOfStudentACompany +
            statisticsByClassId[this.filterStudent.classId]
              .numberOfStudentNotACompany)) *
        100;
      await this.getStudentsByInternshipCourseAsync();
    },
  },
};
</script>

<style lang="scss">
.not-active {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
}
.table-internship-comfirmation{
  height: 500px;
  overflow: scroll;
}
</style>
