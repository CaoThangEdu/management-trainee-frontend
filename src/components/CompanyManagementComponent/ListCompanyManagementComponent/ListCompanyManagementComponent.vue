<template > 
<div class="row">
  <div class="col-12">
    <div class="card">
      <header class="card-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
          <path fill="var(--ci-primary-color, currentColor)"
            d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
            class="ci-primary"></path>
        </svg> Công ty

        <button title="Thêm mới công ty" class="btn btn-primary float-right" @click="createCompany"><i class="fa fa-plus-square"></i></button>
        <!-- <button class="btn btn-secondary float-right btn-search mr-2" @click="createCompanyFile">+ Thêm file</button> -->
      </header>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="form-row filter-wrapper ml-0 mr-0">
              <div class="col-xl-2 col-md-2 col-sm-12 mb-sm-2">
                <select
                  class="form-control form-select form-select-class" v-model="filterCompany.status">
                  <option value="">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="unactive">Không hoạt động</option>
                </select>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12">
                <input v-model="filterCompany.keyword" type="text" class="form-control" id="keywords" placeholder="Nhập từ khóa" />
              </div>
              <div class="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12 ">
                <button @click="searchCompany()" type="submit" id="btn-search" class="btn btn-primary">Tìm kiếm</button>
              </div>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead class="">
              <tr>
                <th scope="col" class="align-middle">STT</th>
                <th scope="col" class="align-middle">Mã số thuế</th>
                <th scope="col" class="align-middle">Tên công ty</th>
                <th scope="col" class="align-middle">thông tin</th>
                <th scope="col" class="align-middle">Trạng thái</th>
                <th scope="col" class="align-middle">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(company, index) in companies" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td class="link-detail" title="Xem chi tiết" @click="updateCompany(index)">
                  {{ company.taxCode }}
                </td>
                <td>{{ company.title }}</td>
                <td>
                  <div><strong>Đại chỉ: </strong> {{ company.companyAddress }}</div>
                  <div><strong>Chủ sở hữu: </strong> {{ company.owner }}</div>
                  <div><strong>Số điện thoại: </strong>{{ company.phoneNumber }}</div>
                  <div><strong>Ngành nghề: </strong>{{ company.career }}</div>
                </td>
                <td>
                  <button title="Không hoạt động" class="btn btn-danger mr-2" @click="updateStatus(index)" v-if="company.status == 'unactive'">
                    <i :class="getStatusIcon(company.status)"></i>
                  </button>
                  <button title="Hoạt động" class="btn btn-warning mr-2" @click="updateStatus(index)" v-if="company.status == 'active'">
                    <i :class="getStatusIcon(company.status)"></i>
                  </button>
                </td>
                <td>
                  <button title="Xóa công ty" class="btn btn-danger" @click="deleteCompany(company.id, index)"> <em
                      class="fa fa-trash"></em></button>
                </td>
              </tr>
              <tr v-show="companies == null || companies.length === 0">
                <th colspan="5" class="text-left">
                  Không có dữ liệu nào được tìm thấy.
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <CompanyManagementDetailComponent :data="editCompany" @change-data="changeData" />
      <AddCompanyFileComponent :data="companyFile" @change-data="changeData" />
      <ConfirmDialog :data="confirmedCompany" @agree="agreeConfirm"></ConfirmDialog>
      <div class="card-footer d-flex justify-content-center text--blue">
        <JwPagination
          :items="companies"
          @changePage="onChangePage"
          :labels="customLabels"
          :pageSize="10">
        </JwPagination>  
      </div>
    </div>

  </div>
</div>
</template>

<script>
import CompanyManagementDetailComponent from "../CompanyManagementDetailComponent/CompanyManagementDetailComponent";
import AddCompanyFileComponent from "../AddCompanyFlieComponent/AddCompanyFlieComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import CompanyService from "../../../services/company/companyServices";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import JwPagination from "jw-vue-pagination";
export default {
  extends: ComponentBase,
  components: {
    CompanyManagementDetailComponent,
    AddCompanyFileComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      companies: [],
      editCompany: {},
      companyFile: {},
      confirmedCompany: null,
      selectCompany: -1,
      filterCompany: {
        keyword:"",
        status:""
      },
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
    };
  },
  async mounted() {
    await this.getAllCompaniesAsync();
  },
  methods: {
    createCompany() {
      this.editCompany = {
        status: "active",
      };
    },
    
    createCompanyFile() {
      this.companyFile = {};
    },

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

    async changePage(currentPage) {
      await this.getCompaniesAsync(currentPage);
    },

    updateCompany(index) {
      this.selectCompany = index;
      this.editCompany = Object.assign({}, this.companies[index]);
    },

    deleteCompany(id, index) {
      this.confirmedCompany = { id: id, index: index };
    },

    // Call api delete Company
    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new CompanyService();
      let response = await api.deleteCompanyAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.companies.splice(dataConfirm.index, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeData(company, action) {
      if (action === "create") {
        return this.companies.unshift(company);
      }
      this.$set(this.companies, this.selectCompany, company);
      this.selectCompany = -1;
    },

    showNotification() {
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    async updateStatus(index) {
      if (this.companies[index].status === "active") {
        this.companies[index].status = "unactive";
      } else {
        this.companies[index].status = "active";
      }
      this.showLoading();
      let api = new CompanyService();
      let response = await api.updateCompanyAsync(this.companies[index]);
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
        `${AppConfig.notification.content_updated_status_success_default}`
      );
      this.$set(this.companies, index, response.data);
    },

    async searchCompany() {
      if(this.filterCompany.keyword === "" && this.filterCompany.status ===""){
        return this.getAllCompaniesAsync();
      }
      // Call Api
      this.showLoading();
      const api = new CompanyService();
      const response = await api.getCompaniesAsync(this.filterCompany);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.companies = response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
  },
};
</script>

<style></style>
