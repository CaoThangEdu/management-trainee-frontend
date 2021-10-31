<template>
  <div class="row notify-component">
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
          Tra cứu công ty thực tập
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div class="col-xl-5 col-lg-5 col-md-4 col-sm-12 col-12">
                  <input
                    type="text"
                    class="form-control"
                    id="keywords"
                    v-model="keyNameCompany"
                    placeholder="Nhập tên công ty"
                  />
                </div>
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12 ">
                  <button
                    @click="getCompaniesByNameAsync()"
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
          <div class="table-responsive">
            <table class="table table-hover">
              <caption></caption>
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">MST</th>
                  <th scope="col">Tên công ty</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Lĩnh Vực</th>
                  <th scope="col" style="width: 110px;">
                    Hoạt động
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(company, index) in companies" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ company.taxCode }}</td>
                  <td>{{ company.title }}</td>
                  <td>{{ company.companyAddress }}</td>
                  <td>{{ company.career }}</td>
                  <td>
                    <button
                      @click="showConfirmationCertificate(company)"
                      title="Đăng ký giấy giới thiệu thực tập"
                      type="button"
                      class="btn btn-success"
                    >
                      Đăng ký
                    </button>
                  </td>
                </tr>
                <tr v-show="companies == null || companies.length === 0">
                  <th colspan="7" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ConfirmationCertificate 
        :isShow="isShow" 
        :keyCompany="keyCompany" 
        :userProfile="user"
        @closeModal="closeModal"/>
        <div class="card-footer d-flex justify-content-center text--blue">
          <!-- <JwPagination
            :items="companies"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="10"
          >
          </JwPagination> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyService from "../../services/company/companyServices";
import JwPagination from "jw-vue-pagination";
import ComponentBase from "../common/component-base/ComponentBase";
import AppConfig from "../../../src/app.config.json";
import ConfirmationCertificate from "./ConfirmationCertificate.vue"
import { mapGetters } from "vuex";
export default {
  name: "SearchInternshipCompany",
  extends: ComponentBase,
  components: {
    JwPagination,
    ComponentBase,
    ConfirmationCertificate
  },
  data() {
    return {
      companies: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
      keyNameCompany: "",
      certificate: {
        taxCode: "",
        companyName: "",
        companyAddress: "",
        owner: "",
        phoneNumberOfCompany: "",
        phoneNumberOfStudent: "",
        career: "",
        status: "unconfirmed",
        mssv: "",
        classId: "",
      },
      isShow: false,
      keyCompany: {},
      user:{}
    };
  },
  async mounted() {
    await this.getAllCompaniesAsync();
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },
  methods: {
    async getAllCompaniesAsync() {
      // Call Api
      this.showLoading();
      const api = new CompanyService();
      const response = await api.getAllCompaniesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.companies = response.data.items;
    },
    async getCompaniesByNameAsync() {
      // Call Api
      this.showLoading();
      const api = new CompanyService();
      const response = await api.getCompaniesByNameAsync(this.keyNameCompany);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.companies = response.data.listCompany;
    },
    showConfirmationCertificate(company) {
      this.isShow = true;
      this.keyCompany = company;
    },
    closeModal(isShow){
      this.isShow = isShow;
    }
  },
  watch:{
    userProfile(){
      this.user = this.userProfile;
    }
  }
};
</script>
