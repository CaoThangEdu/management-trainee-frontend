<template>
  <div class="row">
    <div v-if="isAdmin" class="col-12">
      <div class="card">
        <header class="card-header">
          <h4>Thống kê phiếu giới thiệu</h4>
        </header>
        <div class="card-body">
          <div class="form-row mb-2 filter-wrapper">
            <div class="col-sm-12 col-md-6 col-lg-6">
              <label for="">Đợt thực tập:</label>
              <SelectPlan
                :isRequired="false"
                v-model="filterCerticate.internshipCourseId"
                :plans="plans"
                :defaultText="'Tất cả'"
                @change="
                  (event) => {
                    filterCerticate.internshipCourseId = event.id;
                  }
                "
              >
              </SelectPlan>
            </div>
            <div v-if="isAdmin" class="col-sm-12 col-md-6 col-lg-6">
              <label for="">Lớp:</label>
              <select
                class="
                  form-control
                  form-select
                  form-select-class
                  form-select-class-size
                "
                v-model="filterCerticate.classId"
              >
                <option value="">Tất cả</option>
                <option
                  v-for="(item, index) in classById"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.className }}
                </option>
              </select>
            </div>
            <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12 mt-5">
              <Highcharts :options="pieChart" ref="pieCharts" />
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <span v-if="isAdmin">Duyệt giấy giới thiệu thực tập</span>
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div
                  v-if="isAdmin"
                  class="col-xl-2 col-md-2 col-sm-12 mb-sm-2"
                  @change="changeStatusFilterCerticate()"
                >
                  <label for="">Trạng thái:</label>
                  <select
                    class="form-control form-select form-select-class"
                    @change="filterStatusCerticate($event)"
                  >
                    <option value="registered">Đã đăng ký</option>
                    <option value="unregistered">Chưa đăng ký</option>
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
                  class="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12"
                  v-if="isAdmin"
                >
                  <label class="invisible" for="">Thao tác</label><br />
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
                  <th scope="col" class="align-middle" style="width: 300px">
                    Thông tin sinh viên
                  </th>
                  <th scope="col" class="align-middle">Thông tin công ty</th>
                  <th scope="col" class="align-middle" style="width: 200px">
                    Trạng thái
                  </th>
                  <th scope="col" class="align-middle" style="width: 110px">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pageOfItems" :key="index">
                  <th scope="row">
                    <div
                      v-if="isAdmin"
                      class="form-check form-check-inline"
                    >
                      <input v-if="Object.keys(getCertificate(item.studentId)).length !== 0"
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
                  </th>
                  <td>
                    <div><strong>MSSV:</strong> {{ item.studentId }}</div>
                    <div>
                      <strong>Họ tên sinh viên:</strong>
                      {{ item.firstName }}
                      {{ item.lastName }}
                    </div>
                    <div>
                      <strong>lớp:</strong>
                      {{ getNameClass(item.classId) }}
                    </div>
                    <div>
                      <strong>Số điện thoại:</strong>
                      {{ getCertificate(item.studentId).phoneNumberOfStudent }}
                    </div>
                    <div>
                      <strong>Ngày đăng ký giấy: </strong>
                      {{
                        convertTime(getCertificate(item.studentId).creationTime)
                      }}
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>Mã số thuế:</strong>
                      {{ getCertificate(item.studentId).taxCode }}.
                    </div>
                    <div>
                      <strong>Tên công ty:</strong>
                      {{ getCertificate(item.studentId).companyName }}.
                    </div>
                    <div>
                      <strong>Xác nhận công ty:</strong>
                      {{
                        confirmationCompany(
                          getCertificate(item.studentId).taxCode
                        )
                      }}.
                    </div>
                  </td>
                  <td v-if="isAdmin">
                    <select
                      v-if="
                        Object.keys(getCertificate(item.studentId)).length !== 0
                      "
                      :disabled="getCertificate(item.studentId).status === ''"
                      name="status"
                      id="group"
                      class="form-control mb-2 select-type"
                      @change="changeStatus($event, index)"
                    >
                      <option
                        v-if="getCertificate(item.studentId).status === ''"
                        :selected="getCertificate(item.studentId).status === ''"
                        value=""
                      >
                        Đang chọn
                      </option>
                      <option
                        :selected="
                          getCertificate(item.studentId).status ===
                          'unconfirmed'
                        "
                        value="unconfirmed"
                      >
                        Đang chờ duyệt
                      </option>
                      <option
                        :selected="
                          getCertificate(item.studentId).status === 'confirmed'
                        "
                        value="confirmed"
                      >
                        Đã duyệt
                      </option>
                      <option
                        :selected="
                          getCertificate(item.studentId).status === 'complete'
                        "
                        value="complete"
                      >
                        Hoàn thành
                      </option>
                    </select>
                  </td>
                  <td :class="{ 'text-center': isAdmin }">
                    <button
                      :disabled="
                        getCertificate(item.studentId).status === 'unconfirmed'
                      "
                      v-if="
                        isAdmin &&
                        Object.keys(getCertificate(item.studentId)).length !== 0
                      "
                      class="btn btn-primary"
                      @click="
                        exportPdfFile(getCertificate(item.studentId))
                      "
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
              v-if="isAdmin && !isHidenFunction"
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
            <div
              style="
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                margin-right: -15px;
                margin-left: -15px;
                justify-content: space-around;
              "
            >
              <div style="text-align: center">
                BỘ CÔNG THƯƠNG <br />
                <strong>TRƯỜNG CĐ KỸ THUẬT CAO THẮNG</strong>
                <hr />
                <strong
                  >Số:<span style="opacity: 0">---</span>/CĐKTCT-CTCT
                  HSSV</strong
                ><br />
                V/v:Liên hệ thực tập tốt nghiệp
              </div>
              <div style="text-align: center">
                <strong>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br />
                Độc lập – Tự do – Hạnh phúc
                <hr />
                TP.Hồ Chí Minh, ngày
                {{ today.day > 10 ? today.day : "0" + today.day }} tháng
                {{ today.month > 10 ? today.month : "0" + today.month }} năm
                {{ today.year }}
              </div>
            </div>
            <br />
            <div style="text-align: center"><span></span> Kính gửi:</div>
            <div style="padding: 0px 55px; text-align: center">
              <strong
                ><h2>{{ keyCertificate.companyName }}</h2>
              </strong>
            </div>
            <div style="padding: 0px 65px">
              <span
                >Để thực hiện tốt nhiệm vụ đào tạo của trường, giúp cho sinh
                viên học tập trong nhà trường phối hợp thực hành, sản xuất nâng
                cao tay nghề từ thực tiễn tại nhà máy, công ty, cơ sở sản xuất.
              </span>
            </div>
            <div style="padding: 0px 80px">
              <span
                >Trường Cao đẳng Kỹ thuật Cao Thắng kính đề nghị Quý đơn
                vị:</span
              ><br />
              <span>* Tạo điều kiện cho: 1 sinh viên (danh sách đính kèm).</span
              ><br />
              <span
                >* Đến thực tập sản xuất tại đơn vị theo ngành, nghề đào
                tạo:Công nghệ thông tin</span
              ><br />
              <span
                >* Với giảng viên hướng dẫn là Thầy/Cô: Nguyễn Võ Công
                Khanh</span
              ><br />
              <span
                >* Thời gian thực tập từ ngày: 18/01/2020 đến ngày:
                22/05/2021</span
              ><br />
              <span>* Nội dung thực tập: theo đề cương thực tập (gửi kèm)</span
              ><br />
              <span
                >Nhà trường cùng với giảng viên hướng dẫn có trách nhiệm giáo
                dục, nhắc nhở sinh viên thuộc trường chấp hành nghiêm nội quy,
                quy định thực tập, sản xuất tại Quý đơn vị. </span
              ><br />
              <span>Rất mong được xem xét giải quyết.</span><br />
              <span>Trân trọng kính chào./.</span>
            </div>
            <br />
            <div style="padding-left: 50%; text-align: center">
              <span>TL. <strong>HIỆU TRƯỞNG</strong></span> <br />
              <span><strong>TRƯỞNG PHÒNG CTCT HSSV</strong></span>
            </div>
            <br />
            <div style="padding: 0px 80px; text-align: center">
              <strong style="font-size: 20px"
                >DANH SÁCH SINH VIÊN THỰC TẬP TỐT NGHIỆP</strong
              ><br />
              <span
                >Kèm theo CV số: . . . . . . ngày . . . . . . . . . . . .</span
              >
            </div>
            <br />
            <div style="padding: 0px 60px">
              <table style="width: 100%">
                <caption></caption>
                <tr style="text-align: center">
                  <th style="border: 1px solid" scope="">
                    <strong>STT</strong>
                  </th>
                  <th style="border: 1px solid" scope="">
                    <strong>MSSV</strong>
                  </th>
                  <th style="border: 1px solid" scope="">
                    <strong>HỌ VÀ TÊN</strong>
                  </th>
                  <th style="border: 1px solid" scope="">
                    <strong>EMAIL</strong>
                  </th>
                </tr>
                <tr>
                  <td style="border: 1px solid; text-align: center">1</td>
                  <td style="border: 1px solid">{{ keyStudent.studentId }}</td>
                  <td style="border: 1px solid">
                    {{ keyStudent.firstName }} {{ keyStudent.lastName }}
                  </td>
                  <td style="border: 1px solid">{{ keyStudent.email }}</td>
                </tr>
              </table>
            </div>
            <br />
            <div style="padding-left: 50%; text-align: center">
              <span>TL. <strong>HIỆU TRƯỞNG</strong></span> <br />
              <span><strong>TRƯỞNG PHÒNG CTCT HSSV</strong></span>
            </div>
          </div>
        </div>
        <div id="certificates-pdf" class="d-none">
          <div
            v-for="(index, internshipCompany) in internshipCompanies"
            :key="internshipCompany"
            style="margin: 100px 0px"
          >
            <div
              style="
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                margin-right: -15px;
                margin-left: -15px;
                justify-content: space-around;
              "
            >
              <div style="text-align: center">
                BỘ CÔNG THƯƠNG <br />
                <strong>TRƯỜNG CĐ KỸ THUẬT CAO THẮNG</strong>
                <hr />
                <strong
                  >Số:<span style="opacity: 0">---</span>/CĐKTCT-CTCT
                  HSSV</strong
                ><br />
                V/v:Liên hệ thực tập tốt nghiệp
              </div>
              <div style="text-align: center">
                <strong>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br />
                Độc lập – Tự do – Hạnh phúc
                <hr />
                TP.Hồ Chí Minh, ngày
                {{ today.day > 10 ? today.day : "0" + today.day }} tháng
                {{ today.month > 10 ? today.month : "0" + today.month }} năm
                {{ today.year }}
              </div>
            </div>
            <br />
            <div style="text-align: center"><span></span> Kính gửi:</div>
            <div style="padding: 0px 55px; text-align: center">
              <strong
                ><h2>
                  {{
                    internshipCompanies[internshipCompany] === undefined
                      ? ""
                      : internshipCompanies[internshipCompany].nameCompany
                  }}
                </h2>
              </strong>
            </div>
            <div style="padding: 0px 65px">
              <span
                >Để thực hiện tốt nhiệm vụ đào tạo của trường, giúp cho sinh
                viên học tập trong nhà trường phối hợp thực hành, sản xuất nâng
                cao tay nghề từ thực tiễn tại nhà máy, công ty, cơ sở sản xuất.
              </span>
            </div>
            <div style="padding: 0px 80px">
              <span
                >Trường Cao đẳng Kỹ thuật Cao Thắng kính đề nghị Quý đơn
                vị:</span
              ><br />
              <span
                >* Tạo điều kiện cho:
                {{
                  internshipCompanies[internshipCompany] === undefined
                    ? 0
                    : internshipCompanies[internshipCompany].students.length
                }}
                sinh viên (danh sách đính kèm).</span
              ><br />
              <span
                >* Đến thực tập sản xuất tại đơn vị theo ngành, nghề đào
                tạo:Công nghệ thông tin</span
              ><br />
              <span
                >* Với giảng viên hướng dẫn là Thầy/Cô: Nguyễn Võ Công
                Khanh</span
              ><br />
              <span
                >* Thời gian thực tập từ ngày: 18/01/2020 đến ngày:
                22/05/2021</span
              ><br />
              <span>* Nội dung thực tập: theo đề cương thực tập (gửi kèm)</span
              ><br />
              <span
                >Nhà trường cùng với giảng viên hướng dẫn có trách nhiệm giáo
                dục, nhắc nhở sinh viên thuộc trường chấp hành nghiêm nội quy,
                quy định thực tập, sản xuất tại Quý đơn vị. </span
              ><br />
              <span>Rất mong được xem xét giải quyết.</span><br />
              <span>Trân trọng kính chào./.</span>
            </div>
            <br />
            <div style="padding-left: 50%; text-align: center">
              <span>TL. <strong>HIỆU TRƯỞNG</strong></span> <br />
              <span><strong>TRƯỞNG PHÒNG CTCT HSSV</strong></span>
            </div>
            <br />
            <div style="padding: 0px 80px; text-align: center">
              <strong style="font-size: 20px"
                >DANH SÁCH SINH VIÊN THỰC TẬP TỐT NGHIỆP</strong
              ><br />
              <span
                >Kèm theo CV số: . . . . . . ngày . . . . . . . . . . . .</span
              >
            </div>
            <br />
            <div style="padding: 0px 60px">
              <table style="width: 100%">
                <caption></caption>
                <tr style="text-align: center">
                  <th style="border: 1px solid" scope="">
                    <strong>STT</strong>
                  </th>
                  <th style="border: 1px solid" scope="">
                    <strong>MSSV</strong>
                  </th>
                  <th style="border: 1px solid" scope="">
                    <strong>HỌ VÀ TÊN</strong>
                  </th>
                  <th style="border: 1px solid" scope="">
                    <strong>EMAIL</strong>
                  </th>
                </tr>
                <tr
                  v-for="(student, index) in internshipCompanies[
                    internshipCompany
                  ].students"
                  :key="student"
                >
                  <td style="border: 1px solid; text-align: center">
                    {{
                      internshipCompanies[internshipCompany] === undefined
                        ? ""
                        : index + 1
                    }}
                  </td>
                  <td style="border: 1px solid">{{ student }}</td>
                  <td style="border: 1px solid">
                    {{
                      internshipCompanies[internshipCompany] === undefined
                        ? ""
                        : getStudent(student).firstName +
                          " " +
                          getStudent(student).lastName
                    }}
                  </td>
                  <td style="border: 1px solid">
                    {{
                      internshipCompanies[internshipCompany] === undefined
                        ? ""
                        : getStudent(student).email
                    }}
                  </td>
                </tr>
              </table>
            </div>
            <br />
            <div style="padding-left: 50%; text-align: center">
              <span>TL. <strong>HIỆU TRƯỞNG</strong></span> <br />
              <span><strong>TRƯỞNG PHÒNG CTCT HSSV</strong></span>
            </div>
          </div>
        </div>
        <div
          class="card-footer d-flex justify-content-center text--blue"
          v-show="pageOfItems == null || pageOfItems.length === 0"
        >
          <select
            :class="{ 'd-none': students == null || students.length === 0 }"
            class="form-control w-auto mr-2"
            @change="changePageSize()"
            v-model="pageSize"
          >
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
            :pageSize="20"
          >
          </JwPagination>
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
import CertificateSevice from "../../../services/certificate/CertificateServices";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import StudentService from "../../../services/student/studentServices";
import ClassService from "../../../services/class/classServices";
import CompanyService from "../../../services/company/companyServices";
import moment from "moment";
import SelectPlan from "../../common/form/select-plan/SelectPlan.vue";
import PlanService from "../../../services/plan/planServices";
import { mapGetters } from "vuex";
import lodash from "lodash";
import { Chart } from "highcharts-vue";
export default {
  name: "CertificatesComponent",
  extends: ComponentBase,
  components: {
    CertificateDetailComponent,
    JwPagination,
    SelectPlan,
    Highcharts: Chart,
  },
  props: {
    isAdmin: Boolean,
  },
  mixins: [CrudMixin],
  data() {
    return {
      pageSize: 10,
      pieChart: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
        },
        title: {
          text: "Thống kê đăng ký giấy giới thiệu",
        },
        tooltip: {
          pointFormat:
            "<b>{point.x} Sinh viên</b><br><b>{point.percentage:.1f} %</b> ",
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
              { name: "Đã đăng ký", y: 0, x: 0 },
              { name: "Chưa đăng ký", y: 0, x: 0 },
            ],
          },
        ],
      },
      internshipCompanies: {},
      keyCertificate: {},
      keyStudent: {},
      certificates: [],
      defaultCertificates: [],
      editCertificate: {},
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
      students: [],
      studentsDefault: [],
      classById: [],
      companiesByTaxCode: {},
      company: {},
      selectCertificate: -1,
      filterCerticate: {
        studentCode: "",
        status: "",
        classId: "",
        internshipCourseId: "",
      },
      selectUpdateCertificates: {
        certificationId: [],
        status: "unconfirmed",
      },
      filterChart: {
        internshipCourseId: "",
      },
      plans: [],
      statisticalCertificate: [],
      unconfirmedData: [],
      confirmedData: [],
      completeData: [],
      notRegisteredData: [],
      today: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      isHidenFunction: false,
    };
  },

  async mounted() {
    if (this.userProfile !== "") {
      if (!this.isAdmin) {
        this.filterCerticate.classId = this.userProfile.classId;
        this.filterCerticate.internshipCourseId =
          this.userProfile.internshipCourseId;
      }
      await this.getStudentsAsync();
    }
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
      if(!this.filterCerticate.internshipCourseId || Number(this.filterCerticate.internshipCourseId) == -1) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          'Vui lòng chọn đợt thực tập'
        );
        return;
      }
      
      let filter = {
        internshipCourseId: this.filterCerticate.internshipCourseId,
        classId: this.filterCerticate.classId,
      };
      // Call Api
      this.showLoading();
      const api = new CertificateSevice();

      const response = await api.getStatisticalCertificateAsync(filter);
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

    convertTime(time) {
      return moment(time).format("DD/MM/YYYY");
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async getStudentsAsync() {
      if(Number(this.filterCerticate.internshipCourseId) == -1) {
        this.filterCerticate.internshipCourseId = '';
      }

      let filterStudent = {
        keyword: this.userProfile.mssv,
        classId: this.filterCerticate.classId,
        internshipCourseId: this.filterCerticate.internshipCourseId,
        status: "active",
      };
      if (this.isAdmin) {
        filterStudent.keyword = "";
        filterStudent.classId = "";
      }
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
      if (response.data !== null) {
        this.studentsDefault = response.data;
        this.students = response.data.filter((student) => {
          return (
            Object.keys(this.getCertificate(student.studentId)).length !== 0
          );
        });
      }
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    async getCertificatesAsync(filterCerticate) {
      if(Number(filterCerticate.internshipCourseId) == -1) {
        filterCerticate.internshipCourseId = '';
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
      let studentsByMssv = CrudMixin.methods.convertArrayToObject(
        this.students,
        "studentId"
      );
      if (studentsByMssv[mssv] === undefined) {
        return "";
      }
      return studentsByMssv[mssv];
    },

    async getClassesAsync() {
      if(Number(this.filterCerticate.internshipCourseId) == -1) {
        this.filterCerticate.internshipCourseId = '';
      }
      let filterClass = {
        className: "",
        status: "",
        internshipCourseId: this.filterCerticate.internshipCourseId,
      };
      // Call Api
      this.showLoading();
      const api = new ClassService();

      const response = await api.getClassesFilterAsync(filterClass);
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
        response.data,
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
      await this.statisticsCerticate();
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
        if (
          document.getElementById(i) != null &&
          document.getElementById(i).checked === true
        ) {
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
          if (document.getElementById(i) === null) return;
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
        this.certificates[index].status =
          this.defaultCertificates[index].status;
      } else {
        this.selectUpdateCertificates.certificationId.push(event.target.value);
        this.certificates[index].status = "";
      }
    },

    async changeStatusFilterCerticate() {
      await this.getCertificatesAsync(this.filterCerticate);
    },

    updateCertificatePdf(certificate) {
      let studentsByMssv = CrudMixin.methods.convertArrayToObject(
        this.students,
        "studentId"
      );
      this.keyStudent = studentsByMssv[certificate.mssv];
      this.keyCertificate = certificate;
    },

    async exportPdfFile(certificate) {
      await this.updateCertificatePdf(certificate);

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

    setInternshipCompany() {
      for (let i = 0; i <= this.students.length - 1; i++) {
        if (
          !(this.getCertificate(this.students[i].studentId).taxCode in this.internshipCompanies) &&
          this.getCertificate(this.students[i].studentId).status === "confirmed"
        ) {
          this.internshipCompanies[this.getCertificate(this.students[i].studentId).taxCode] = {
            taxCode: this.getCertificate(this.students[i].studentId).taxCode,
            nameCompany: this.getCertificate(this.students[i].studentId).companyName,
            students: [],
          };
        }
        if (this.certificates[i].status === "confirmed") {
          this.internshipCompanies[this.getCertificate(this.students[i].studentId).taxCode].students.push(
            this.getCertificate(this.students[i].studentId).mssv
          );
        }
      }
    },

    async exportPdfFiles() {
      this.internshipCompanies = {};
      await this.setInternshipCompany();
      let mywindow = window.open("", "PRINT", "width=803,top=100,left=150");

      mywindow.document.write(
        document.getElementById("certificates-pdf").innerHTML
      );

      mywindow.document.close();
      mywindow.focus();

      mywindow.print();
      mywindow.close();

      return true;
    },

    async statisticsCerticate() {
      await this.getStatisticalCertificateAsync();
      var unregistered = 0;
      var registered = 0;
      for (let i = 0; i <= this.statisticalCertificate.length - 1; i++) {
        registered +=
          this.statisticalCertificate[i].unconfirmed +
          this.statisticalCertificate[i].confirmed +
          this.statisticalCertificate[i].complete;
        unregistered += this.statisticalCertificate[i].notRegistered;
      }
      this.pieChart.series[0].data[0].x = registered;
      this.pieChart.series[0].data[1].x = unregistered;
      this.pieChart.series[0].data[0].y =
        (registered / (unregistered + registered)) * 100;
      this.pieChart.series[0].data[1].y =
        (unregistered / (unregistered + registered)) * 100;
        await this.getCertificatesAsync(this.filterCerticate);
        await this.getStudentsAsync();
      this.students = this.studentsDefault.filter((student) => {
        return (Object.keys(this.getCertificate(student.studentId)).length !== 0);
      });
    },

    getCertificate(mssv) {
      let certificatesByMssv = CrudMixin.methods.convertArrayToObject(
        this.certificates,
        "mssv"
      );
      if (mssv in certificatesByMssv) return certificatesByMssv[mssv];
      return {};
    },

    filterStatusCerticate($event) {
      if ($event.target.value === "registered") {
        this.isHidenFunction = false;
        this.students = this.studentsDefault.filter((student) => {
          return (Object.keys(this.getCertificate(student.studentId)).length !== 0);
        });
        return;
      }
      this.isHidenFunction = true;
      this.students = this.studentsDefault.filter((student) => {
        return Object.keys(this.getCertificate(student.studentId)).length === 0;
      });
    },
  },
  watch: {
    async userProfile() {
      if (!this.isAdmin) {
        this.filterCerticate.classId = this.userProfile.classId;
        this.filterCerticate.internshipCourseId =
          this.userProfile.internshipCourseId;
      }
      await this.getStudentsAsync();
      await this.getCertificatesAsync(this.filterCerticate);
    },
    "filterCerticate.internshipCourseId": async function () {
      if(this.filterCerticate.internshipCourseId === ""){
        this.pieChart.series[0].data[0].x = 0;
        this.pieChart.series[0].data[1].x = 0;
        this.pieChart.series[0].data[0].y =0;
        this.pieChart.series[0].data[1].y =0;
        return;
      }
      await this.statisticsCerticate();
    },
    "filterCerticate.classId": async function () {
      await this.getStudentsAsync();
      this.statisticsCerticate();
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
.form-select-class-size {
  width: 100%;
  height: 28px;
  padding: 0px 5px;
}
</style>
