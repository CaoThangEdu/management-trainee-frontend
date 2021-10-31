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
          <span v-if="!isAdmin">Đăng ký giấy giới thiệu thực tập</span>
          <span v-if="isAdmin">Duyệt giấy giới thiệu thực tập</span>
          <button
            v-if="!isAdmin"
            class="btn btn-primary float-right"
            @click="createCertificates"
          >
            + Đăng ký
          </button>
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div v-if="isAdmin" class="col-xl-2 col-md-2 col-sm-12 mb-sm-2">
                  <label for="">Lớp:</label>
                  <select
                    class="form-control form-select form-select-class"
                    v-model="filterCerticate.classId"
                  >
                    <option value="">Tất cả</option>
                    <option
                      v-for="(item, index) in classById"
                      :key="index"
                      :value="item.id"
                      >{{ item.className }}</option
                    >
                  </select>
                </div>
                <div v-if="isAdmin" class="col-xl-2 col-md-2 col-sm-12 mb-sm-2">
                  <label for="">Trạng thái:</label>
                  <select
                    class="form-control form-select form-select-class"
                    v-model="filterCerticate.status"
                  >
                    <option value="">Tất cả</option>
                    <option value="unconfirmed">Đang duyệt</option>
                    <option value="confirmed">Đã duyệt</option>
                    <option value="complete">Đã in</option>
                  </select>
                </div>
                <div
                  v-if="!isAdmin"
                  class="col-xl-2 col-md-2 col-sm-12 mb-sm-2"
                  @change="changeStatusFilterCerticate()"
                >
                  <label for="">Trạng thái:</label>
                  <select
                    class="form-control form-select form-select-class"
                    v-model="filterCerticate.status"
                  >
                    <option value="">Tất cả</option>
                    <option value="unconfirmed">Đang duyệt</option>
                    <option value="confirmed">Đã duyệt</option>
                    <option value="complete">Đã in</option>
                  </select>
                </div>
                <div
                  v-if="isAdmin"
                  class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12"
                >
                  <label for="">Từ khóa:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="keywords"
                    placeholder="Nhập từ khóa"
                    v-model="filterCerticate.keyword"
                  />
                </div>
                <div
                  class="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12 "
                  v-if="isAdmin"
                >
                  <label for="">&ensp;</label>
                  <div class="mb-2">&ensp;</div>
                  <button
                    @click="getCertificatesAsync(filterCerticate)"
                    type="submit"
                    id="btn-search"
                    class="btn btn-primary"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div id="table" class="table-responsive">
            <table class="table table-hover">
              <caption></caption>
              <thead class="">
                <tr>
                  <th v-if="isAdmin" scope="col" class="align-middle">
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="all"
                        :value="-1"
                        @change="selectUpdateCertificate"
                      />
                      <label class="form-check-label" for="all">STT</label>
                    </div>
                  </th>
                  <th v-if="!isAdmin" scope="col">STT</th>
                  <th scope="col" class="align-middle">Thông tin sinh viên</th>
                  <th scope="col" class="align-middle">Thông tin công ty</th>
                  <th scope="col" class="align-middle">Trạng thái</th>
                  <th scope="col" class="align-middle">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pageOfItems" :key="index">
                  <th scope="row">
                    <div v-if="isAdmin" class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        @change="selectUpdateCertificate"
                        :value="item.id"
                        type="checkbox"
                        :id="index"
                      />
                      <label class="form-check-label" :for="index">
                        {{ index + 1 }}</label
                      >
                    </div>
                    <div v-if="!isAdmin">{{ index + 1 }}</div>
                  </th>
                  <td>
                    <div><strong>MSSV:</strong> {{ item.mssv }}</div>
                    <div>
                      <strong>Họ tên sinh viên:</strong>
                      {{ getStudent(item.mssv).firstName }}
                      {{ getStudent(item.mssv).lastName }}
                    </div>
                    <div>
                      <strong>lớp:</strong>
                      {{ getNameClass(item.classId) }}
                    </div>
                    <div>
                      <strong>Số điện thoại:</strong>
                      {{ item.phoneNumberOfStudent }}
                    </div>
                    <div>
                      <strong>Ngày đăng ký giấy: </strong>
                      {{ convertTime(item.creationTime) }}
                    </div>
                  </td>
                  <td>
                    <div><strong>Mã số thuế:</strong> {{ item.taxCode }}.</div>
                    <div>
                      <strong>Tên công ty:</strong> {{ item.companyName }}.
                    </div>
                    <div>
                      <strong>Xác nhận công ty:</strong>
                      {{ confirmationCompany(item.taxCode) }}.
                    </div>
                  </td>
                  <td v-if="!isAdmin">
                    <button
                      v-if="item.status === 'unconfirmed'"
                      class="btn btn-warning not-active"
                    >
                      Đang chờ duyệt
                    </button>
                    <button
                      v-if="item.status === 'confirmed'"
                      class="btn btn-primary not-active"
                    >
                      Đã duyệt
                    </button>
                    <button
                      v-if="item.status === 'complete'"
                      class="btn btn-success not-active"
                    >
                      Hoàn thành
                    </button>
                  </td>
                  <td v-if="isAdmin">
                    <select
                      :disabled="item.status === ''"
                      name="status"
                      id="group"
                      class="form-control mb-2 select-type"
                      @change="changeStatus($event, index)"
                    >
                      <option
                        :selected="item.status === 'unconfirmed'"
                        value="unconfirmed"
                        >Đang chờ duyệt</option
                      >
                      <option
                        :selected="item.status === 'confirmed'"
                        value="confirmed"
                        >Đã duyệt</option
                      >
                      <option
                        :selected="item.status === 'complete'"
                        value="complete"
                        >Hoàn thành</option
                      >
                    </select>
                  </td>
                  <td :class="{ 'text-center': isAdmin }">
                    <button
                      v-if="!isAdmin"
                      :disabled="item.status !== 'unconfirmed'"
                      class="btn btn-primary mr-1"
                      @click="updateCertificate(index)"
                    >
                      <em class="fa fa-edit"></em>
                    </button>
                    <button
                      v-if="!isAdmin"
                      :disabled="item.status !== 'unconfirmed'"
                      class="btn btn-danger"
                      @click="deleteCertificate(item.id, index)"
                    >
                      <em class="fa fa-trash"></em>
                    </button>
                    <button
                      v-if="isAdmin"
                      class="btn btn-primary"
                      @click="exportPdfFile(item)"
                    >
                      <em class="fas fa-file-export"></em>
                    </button>
                  </td>
                </tr>
                <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                  <th colspan="5" id="" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
            <hr />
            <div
              v-if="isAdmin"
              class="form-group text-center d-flex justify-content-center"
            >
              <select
                class="form-control w-25"
                id="exampleFormControlSelect1"
                v-model="selectUpdateCertificates.status"
              >
                <option selected value="unconfirmed">Đang chờ duyệt</option>
                <option value="confirmed">Đã duyệt</option>
                <option value="complete">Hoàn thành</option>
              </select>
              <button
                @click="updateStatusCertificatesAsync"
                type="button"
                class="btn btn-primary ml-2 w-25"
              >
                Cập nhật trạng thái
              </button>
              <button
                @click="exportPdfFiles()"
                type="button"
                class="btn btn-success ml-2 w-25"
              >
                Xuất file PDF
              </button>
            </div>
          </div>
        </div>
        <div id="certificate-pdf" class="d-none">
          <div>
            <span style="opacity: 0;">---------</span> BỘ CÔNG THƯƠNG
            <span style="opacity: 0;">-----------------------------</span>
            <strong>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
          </div>
          <div>
            <strong>TRƯỜNG CĐ KỸ THUẬT CAO THẮNG</strong>
            <span style="opacity: 0;">--------------------------</span>
            Độc lập – Tự do – Hạnh phúc
          </div>
          <hr />
          <div>
            <span style="opacity: 0;">------</span>
            <strong
              >Số:<span style="opacity: 0;">---</span>/CĐKTCT-CTCT HSSV</strong
            >
            <span style="opacity: 0;">---------------------------</span>
            TP.Hồ Chí Minh, ngày 18 tháng 01 năm 2021
          </div>
          <div>
            <span style="opacity: 0;">------</span> V/v:Liên hệ thực tập tốt
            nghiệp
          </div><br>
          <div style="text-align: center;"><span></span> Kính gửi:</div>
          <div style="padding: 0px 55px;text-align: center;">
            <strong
              ><h2>{{keyCertificate.companyName}}</h2>
            </strong>
          </div>
          <div style="padding: 0px 65px">
            <span
              >Để thực hiện tốt nhiệm vụ đào tạo của trường, giúp cho sinh viên
              học tập trong nhà trường phối hợp thực hành, sản xuất nâng cao tay
              nghề từ thực tiễn tại nhà máy, công ty, cơ sở sản xuất.
            </span>
          </div>
          <div style="padding: 0px 80px;">
            <span>Trường Cao đẳng Kỹ thuật Cao Thắng kính đề nghị Quý đơn vị:</span><br>
            <span>* Tạo điều kiện cho: 2 sinh viên (danh sách đính kèm).</span><br>
            <span>* Đến thực tập sản xuất tại đơn vị theo ngành, nghề đào tạo:Công nghệ thông
tin</span><br>
            <span>* Với giảng viên hướng dẫn là Thầy/Cô: Nguyễn Võ Công Khanh</span><br>
            <span>* Thời gian thực tập từ ngày: 18/01/2020 đến ngày: 22/05/2021</span><br>
            <span>* Nội dung thực tập: theo đề cương thực tập (gửi kèm)</span><br>
            <span>Nhà trường cùng với giảng viên hướng dẫn có trách nhiệm giáo dục, nhắc
              nhở sinh viên thuộc trường chấp hành nghiêm nội quy, quy định thực tập, sản xuất
              tại Quý đơn vị.
            </span><br>
            <span>Rất mong được xem xét giải quyết.</span><br>
            <span>Trân trọng kính chào./.</span>
          </div>
          <br>
          <div style="padding-left: 50%;text-align: center;">
              <span>TL. <strong>HIỆU TRƯỞNG</strong></span> <br>
              <span><strong>TRƯỞNG PHÒNG CTCT HSSV</strong></span>
          </div>
          <br>
          <div style="padding: 0px 80px;text-align: center;">
            <strong style="font-size: 20px;">DANH SÁCH SINH VIÊN THỰC TẬP TỐT NGHIỆP</strong><br>
            <span>Kèm theo CV số: . . . . . . ngày . . . . . . . . . . . .</span>
          </div>
         <br>
          <div style="padding: 0px 60px;">
            <table style="width: 100%;">
              <caption></caption>
              <tr style="text-align: center;">
              <th style="border: 1px solid;" scope=""><strong>STT</strong></th>
              <th style="border: 1px solid;" scope=""><strong>MSSV</strong></th>
              <th style="border: 1px solid;" scope=""><strong>HỌ VÀ TÊN</strong></th>
              <th style="border: 1px solid;" scope=""><strong>EMAIL</strong></th>
            </tr>
            <tr>
              <td style="border: 1px solid;text-align: center;" >1</td>
              <td style="border: 1px solid;" >{{keyCertificate.mssv}}</td>
              <td style="border: 1px solid;" >
                {{keyStudent.firstName + keyStudent.lastName}}
              </td>
              <td style="border: 1px solid;" >{{keyStudent.email}}</td>
            </tr>
            </table>
          </div>
          <br>
          <div style="padding-left: 50%;text-align: center;">
              <span>TL. <strong>HIỆU TRƯỞNG</strong></span> <br>
              <span><strong>TRƯỞNG PHÒNG CTCT HSSV</strong></span>
          </div>
        </div>
        <CertificateDetailComponent
          :data="editCertificate"
          @change-data="changeData"
          @changeCompanies="changeCompanies"
        />

        <div
          class="card-footer d-flex justify-content-center text--blue"
          v-show="pageOfItems == null || pageOfItems.length === 0"
        >
          <JwPagination
            :items="certificates"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="5"
          >
          </JwPagination>
          <ConfirmDialog
            :data="confirmedCertificate"
            @agree="agreeConfirm"
          ></ConfirmDialog>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <header class="card-header">
          <h4>Thống kê phiếu giới thiệu</h4>
        </header>
        <div class="card-body">
          <div class="form-row mb-2 filter-wrapper">
            <div class="col-sm-12 col-md-6 col-lg-3">
              <label for="">Đợt thực tập:</label>
              <SelectPlan
                :isRequired="false"
                v-model="filterChart.internshipCourseId"
                :plans="plans"
                :defaultText="'Tất cả'"
                @change="
                  (event) => {
                    filterChart.internshipCourseId = event.id;
                  }
                "
              >
              </SelectPlan>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-3">
              <label class="d-sm-block d-none" style="height: 21px;"
                >&nbsp;</label
              >
              <button
                type="submit"
                id="btn-search"
                class="btn btn-stack-overflow"
                title="Tìm kiếm"
                @click="showchartAsnyc()"
              >
                <em class="fas fa-search"></em>
              </button>
            </div>
          </div>
          <div v-if="statisticalCertificate.length > 0">
            <highcharts
              class="chart"
              :constructor-type="'chart'"
              :options="chartOptions"
            >
            </highcharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CertificateDetailComponent from "../CertificateDetailComponent/CertificateDetailComponent.vue";
import ComponentBase from "../../common/component-base/ComponentBase";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import CertificateSevice from "../../../services/certificate/CertificateServices";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import StudentService from "../../../services/student/studentServices";
import ClassService from "../../../services/class/classServices";
import CompanyService from "../../../services/company/companyServices";
import moment from "moment";
import Highcharts from "highcharts";
import dataModule from "highcharts/modules/data";
import drilldown from "highcharts/modules/drilldown";
import SelectPlan from "../../common/form/select-plan/SelectPlan.vue";
import PlanService from "../../../services/plan/planServices";
import { mapGetters } from "vuex";
import lodash from "lodash";
drilldown(Highcharts);
dataModule(Highcharts);
let drilldownChart,
  drilldownEvent,
  drilldownLevel = 0;
import jsPDF from "jspdf";
export default {
  name: "CertificatesComponent",
  extends: ComponentBase,
  components: {
    CertificateDetailComponent,
    ConfirmDialog,
    JwPagination,
    SelectPlan,
  },
  props: {
    isAdmin: Boolean,
  },
  mixins: [CrudMixin],
  data() {
    return {
      keyCertificate:{},
      keyStudent:{},
      certificates: [],
      defaultCertificates: [],
      editCertificate: {},
      confirmedCertificate: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filter: {
        status: "active",
        studentId: "",
        isDelete: false,
      },
      studentsByMssv: [],
      classById: [],
      companiesByTaxCode: {},
      company: {},
      selectCertificate: -1,
      filterCerticate: {
        mssv: "",
        status: "",
        classId: "",
      },
      selectUpdateCertificates: {
        certificationId: [],
        status: "unconfirmed",
      },
      chartOptions: {},
      drilldownChart,
      drilldownEvent,
      drilldownLevel,
      filterChart: {
        internshipCourseId: "",
      },
      plans: [],
      statisticalCertificate: [],
      unconfirmedData: [],
      confirmedData: [],
      completeData: [],
      notRegisteredData: [],
    };
  },

  async mounted() {
    if (this.userProfile !== "") {
      await this.getCertificatesAsync(this.filterCerticate);
    }
    await this.getStudentsAsync();
    await this.getClassesAsync();
    await this.getCompaniesAsync();
    await this.getPlansFilterAsync();
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
    }),
  },
  methods: {
    async showchartAsnyc() {
      if (!this.filterChart.internshipCourseId) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Vui lòng chọn đợt để xem thống kê"
        );
        return;
      }
      await this.getStatisticalCertificateAsync();
      this.renderHighChart();
    },

    async getPlansFilterAsync() {
      let filterPlan = {
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlansAsync(filterPlan);
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

    async getStatisticalCertificateAsync() {
      // Call Api
      this.showLoading();
      const api = new CertificateSevice();

      const response = await api.getStatisticalCertificateAsync(
        this.filterChart
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
      this.statisticalCertificate = response.data;
    },

    getChart() {
      this.unconfirmedData = [];
      this.confirmedData = [];
      this.completeData = [];
      this.notRegisteredData = [];
      for (let res of this.statisticalCertificate) {
        this.unconfirmedData.push(res.unconfirmed);
        this.confirmedData.push(res.confirmed);
        this.completeData.push(res.complete);
        this.notRegisteredData.push(res.notRegistered);
      }
    },

    renderHighChart() {
      this.getChart();
      this.chartOptions = {
        chart: {
          type: "column",
          events: {
            drilldown: function(e) {
              if (!e.seriesOptions) {
                this.vueRef.updateGraph(true, this, e);
              }
            },
            drillup: function(e) {
              if (!e.seriesOptions.flag) {
                this.vueRef.drilldownLevel = e.seriesOptions._levelNumber;
                this.vueRef.updateGraph(false);
              }
            },
          },
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          column: {
            stacking: "normal",
            events: {
              click: function(event) {
                return false;
              },
            },
          },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              style: {
                textShadow: false,
                fontSize: "10px",
              },
            },
          },
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: "bold",
              color: "gray",
            },
          },
        },
        title: {
          text: "Thống kê giấy giới thiệu của sinh viên",
          fontWeight: "bold",
        },
        xAxis: {
          title: {},
          type: "category",
        },
        yAxis: [
          {
            title: {
              text: "Số lượng giấy",
            },
            min: 0,
            allowDecimals: false,
          },
        ],
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: "</table>",
          shared: true,
          useHTML: true,
        },
        series: [
          {
            type: "column",
            name: "Số phiếu giới thiệu đang duyệt",
            color: "#EF5350",
            data: this.unconfirmedData,
          },
          {
            type: "column",
            name: "Số phiếu giới thiệu đã duyệt",
            color: "rgb(128, 183, 255)",
            data: this.confirmedData,
          },
          {
            type: "column",
            name: "Số phiếu giới thiệu đã in",
            color: "#33691E",
            data: this.completeData,
          },
          {
            type: "column",
            name: "Số sinh viên không đăng ký",
            color: "#FF6F00",
            data: this.notRegisteredData,
          },
        ],
      };
    },
    convertTime(time) {
      return moment(time).format("DD/MM/YYYY");
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async getStudentsAsync() {
      let filterStudent = {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(filterStudent);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentsByMssv = CrudMixin.methods.convertArrayToObject(
        response.data,
        "studentId"
      );
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createCertificates() {
      this.editCertificate = {};
    },

    async getCertificatesAsync(filterCerticate) {
      if (this.userProfile !== undefined && this.isAdmin === false) {
        filterCerticate.mssv = this.userProfile.mssv;
      }
      // Call Api
      this.showLoading();
      const api = new CertificateSevice();

      const response = await api.getCertificatesAsync(filterCerticate);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.certificates = response.data;
      this.defaultCertificates = lodash.cloneDeep(this.certificates);
    },

    updateCertificate(index) {
      this.selectCertificate = index;
      this.editCertificate = Object.assign({}, this.certificates[index]);
    },

    changeIsdelete(index) {
      this.editCertificates = Object.assign({}, this.pageOfItems[index]);
    },

    async changeData(certificate, action) {
      if (action === "create") {
        return this.certificates.unshift(certificate);
      }
      this.$set(this.certificates, this.selectCertificate, certificate);
      this.selectCertificate = -1;
    },

    deleteCertificate(id, index) {
      this.confirmedCertificate = {
        id: id,
        index: index,
      };
    },
    // Call api delete Certificate
    async agreeConfirm(confirmedCertificate) {
      this.showLoading();
      let api = new CertificateSevice();
      let response = await api.deleteCertificateAsync(confirmedCertificate.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.certificates.splice(confirmedCertificate.index, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeStatus(event, index) {
      this.certificates[index].status = event.target.value;
      await this.updateCertificateAsync(index);
    },

    getNameClass(classId) {
      if (this.classById[classId] === undefined) {
        return "";
      }
      return this.classById[classId].className;
    },

    getStudent(mssv) {
      if (this.studentsByMssv[mssv] === undefined) {
        return "";
      }
      return this.studentsByMssv[mssv];
    },

    async getClassesAsync() {
      // Call Api
      this.showLoading();
      const api = new ClassService();

      const response = await api.getClassesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classById = CrudMixin.methods.convertArrayToObject(
        response.data.items,
        "id"
      );
    },

    async updateCertificateAsync(index) {
      this.showLoading();
      let api = new CertificateSevice();
      let response = await api.updateCertificateAsync(this.certificates[index]);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }

      this.$set(this.certificates, index, response.data);
      if (response.data.status === "confirmed") {
        this.company.taxCode = response.data.taxCode;
        this.company.title = response.data.companyName;
        this.company.companyAddress = response.data.companyAddress;
        this.company.owner = response.data.owner;
        this.company.phoneNumber = response.data.phoneNumberOfCompany;
        this.company.status = "active";

        await this.createCompanyAsync(this.company);
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
      await this.showchartAsnyc();
    },
    async updateStatusCertificatesAsync() {
      if (this.selectUpdateCertificates.certificationId.length === 0) {
        return this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_updated_success_default}`
        );
      }
      this.showLoading();
      let api = new CertificateSevice();
      let response = await api.updateStatusCertificatesAsync(
        this.selectUpdateCertificates
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
      for (let i = 0; i <= this.certificates.length - 1; i++) {
        if (document.getElementById(i).checked === true) {
          this.certificates[i].status = this.selectUpdateCertificates.status;
          document.getElementById(i).checked = false;
        }
      }
      this.selectUpdateCertificates.status = "unconfirmed";
      this.selectUpdateCertificates.certificationId = [];
      document.getElementById("all").checked = false;

      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
    },

    async createCompanyAsync(company) {
      if (this.companiesByTaxCode[company.taxCode]) {
        return;
      }
      this.showLoading();
      let api = new CompanyService();
      let response = await api.createCompanyAsync(company);
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
    },

    async getCompaniesAsync() {
      let filter = {
        status: "",
        keyword: "",
      };
      // Call Api
      this.showLoading();
      const api = new CompanyService();

      const response = await api.getCompaniesAsync(filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.companiesByTaxCode = CrudMixin.methods.convertArrayToObject(
        response.data,
        "taxCode"
      );
    },

    confirmationCompany(taxCode) {
      if (this.companiesByTaxCode[taxCode]) {
        return "Hoạt động";
      }
      return "Không hoạt động";
    },

    changeCompanies(company) {
      this.companiesByTaxCode[company.taxCode] = company;
    },

    selectUpdateCertificate(event) {
      // select all
      if (event.target.value === "-1") {
        if (event.target.checked === false) {
          this.selectUpdateCertificates.certificationId = [];
          this.certificates = lodash.cloneDeep(this.defaultCertificates);
          for (let i = 0; i <= this.certificates.length - 1; i++) {
            document.getElementById(i).checked = false;
          }
          return;
        }
        for (let i = 0; i <= this.certificates.length - 1; i++) {
          document.getElementById(i).checked = true;
          this.certificates[i].status = "";
          this.selectUpdateCertificates.certificationId.push(
            this.certificates[i].id
          );
        }
        return;
      }
      //select item
      let index = parseInt(event.target.id);
      if (event.target.checked === false) {
        document.getElementById("all").checked = false;
        for (
          let i = 0;
          i <= this.selectUpdateCertificates.certificationId.length - 1;
          i++
        ) {
          if (
            this.selectUpdateCertificates.certificationId[i] ===
            event.target.value
          ) {
            this.selectUpdateCertificates.certificationId.splice(i, 1);
          }
        }
        this.certificates[index].status = this.defaultCertificates[
          index
        ].status;
      } else {
        this.selectUpdateCertificates.certificationId.push(event.target.value);
        this.certificates[index].status = "";
      }
    },

    async changeStatusFilterCerticate() {
      await this.getCertificatesAsync(this.filterCerticate);
    },

    async exportPdfFile(item) {
      this.keyStudent =  await this.studentsByMssv[item.mssv];
      this.keyCertificate = await item;
      // const doc = new jsPDF();

      let mywindow = window.open("", "PRINT", "width=803,top=100,left=150");

      mywindow.document.write(
        document.getElementById("certificate-pdf").innerHTML
      );

      mywindow.document.close();
      mywindow.focus(); 

      mywindow.print();
      mywindow.close();

      return true;
    },
  },
  watch: {
    async userProfile() {
      await this.getCertificatesAsync(this.filterCerticate);
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
</style>
