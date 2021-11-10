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
          <span>Đăng ký giấy giới thiệu thực tập</span>

          <button
            class="btn btn-primary float-right"
            @click="createCertificates"
          >
            + Đăng ký
          </button>
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <h3>Danh sách giấy xác nhận đã đăng ký</h3>
            </div>
          </div>
          <div id="table" class="table-responsive">
            <table class="table table-hover">
              <caption></caption>
              <thead class="">
                <tr>
                  <th scope="col" class="text-center">STT</th>
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
                  <td class="text-center">{{index + 1}}</td>
                  <td>
                    <div><strong>MSSV:</strong> {{ student.mssv }}</div>
                    <div>
                      <strong>Họ tên sinh viên:</strong>
                      {{ student.fullName }}
                    </div>
                    <div>
                      <strong>lớp:</strong>
                      {{ student.className }}
                    </div>
                    <div>
                      <strong>Số điện thoại:</strong>
                      {{item.phoneNumberOfStudent }}
                    </div>
                    <div>
                      <strong>Ngày đăng ký giấy: </strong>
                      {{
                        convertTime(item.creationTime)
                      }}
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>Mã số thuế:</strong>
                      {{ item.taxCode }}.
                    </div>
                    <div>
                      <strong>Tên công ty:</strong>
                      {{ item.companyName }}.
                    </div>
                    <div>
                      <strong>Xác nhận công ty:</strong>
                      {{
                        confirmationCompany(item.taxCode)
                      }}.
                    </div>
                  </td>
                  <td>
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
                  <td>
                      <button
                      :disabled="item.status !== 'unconfirmed'"
                      class="btn btn-primary mr-1"
                      @click="updateCertificate(index)"
                    >
                      <em class="fa fa-edit"></em>
                    </button>
                    <button
                      :disabled="item.status !== 'unconfirmed'"
                      class="btn btn-danger"
                      @click="deleteCertificate(item.id,index)"
                    >
                      <em class="fa fa-trash"></em>
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
          <select
            :class="{ 'd-none': certificates == null || certificates.length === 0 }"
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
            :items="certificates"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="20"
          >
          </JwPagination>
          <ConfirmDialog
            :data="confirmedCertificate"
            @agree="agreeConfirm"
          ></ConfirmDialog>
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
import CompanyService from "../../../services/company/companyServices";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  name: "CertificatesStudentComponent",
  extends: ComponentBase,
  components: {
    CertificateDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      pageSize: 10,
      internshipCompanies: {},
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
      student: {},
      companiesByTaxCode: {},
      company: {},
      selectCertificate: -1,
      filterCerticate: {
        studentCode: "",
        status: "",
        classId: "",
        internshipCourseId: "",
      },
      unconfirmedData: [],
      confirmedData: [],
      completeData: [],
      notRegisteredData: [],
    };
  },

  async mounted() {
    if (this.userProfile !== "") {
      this.student = this.userProfile;
      // this.filterCerticate.classId = this.student.classId;
      this.filterCerticate.internshipCourseId = this.student.internshipCourseId;
      this.filterCerticate.studentCode = this.student.mssv;
      await this.getCertificatesAsync();
    }
    await this.getCompaniesAsync();
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
    }),
  },
  methods: {
    convertTime(time) {
      return moment(time).format("DD/MM/YYYY");
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createCertificates() {
      this.editCertificate = {};
    },

    async getCertificatesAsync() {
      // Call Api
      this.showLoading();
      const api = new CertificateSevice();

      const response = await api.getCertificatesAsync(this.filterCerticate);
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
      this.confirmedCertificate = { id: id, index: index };
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

  },
  watch: {
    async userProfile() {
     if (this.userProfile !== "") {
      this.student = this.userProfile;
      // this.filterCerticate.classId = this.userProfile.classId;
      this.filterCerticate.internshipCourseId = this.userProfile.internshipCourseId;
      this.filterCerticate.studentCode = this.userProfile.mssv;
      await this.getCertificatesAsync();
    }
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
