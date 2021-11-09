<template>
  <div class="row">
  <div class="col-12">
    <div class="card">
    <header class="card-header">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
        <path fill="var(--ci-primary-color, currentColor)"
          d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
          class="ci-primary"></path>
      </svg> Danh sách khoa
      <button class="btn btn-primary float-right" title="Thêm mới"
        @click="createFaculty">
        <em class="fa fa-plus-square"></em>
      </button>
    </header>
    <div class="card-body">
      <div class="row mb-3">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="form-row filter-wrapper ml-0 mr-0">
            <div class="col-xl-3 col-md-3 col-sm-12 mb-sm-2">
              <input type="text" class="form-control" id="keywords" placeholder="Nhập từ khóa"
                v-model="filter.facultyName" />
            </div>
            <div class="col-xl-3 col-md-3 col-sm-12">
              <button type="submit" id="btn-search" class="btn btn-stack-overflow"
                @click="getFacultiesFilterAsync"
                title="Tìm kiếm">
                <em class="fas fa-search"></em>
              </button>
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
              <th scope="col">Khoa</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pageOfItems" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td
                @click="updateFaculty(index)"
                class="link-detail"
                title="Xem">{{ item.facultyName }}
                <em class="fas fa-external-link-alt"></em>
              </td>
              <td>
                <button class="btn btn-danger" title="Xóa"
                  @click="deleteFaculty(item, index)"><em class="fa fa-trash"></em></button>
              </td>
            </tr>
            <tr v-show="pageOfItems == null || pageOfItems.length === 0">
              <th colspan="5" scope="" class="text-left">
                Không có dữ liệu nào được tìm thấy.
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
      <FacultyManagementDetailComponent 
        :data="editFaculty" @change-data="changeData" />

      <ConfirmDialog :data="confirmFaculty" @agree="deleteFacultyConfirm"></ConfirmDialog>

      <div class="card-footer d-flex justify-content-center text--blue"
        v-show="pageOfItems == null || pageOfItems.length === 0">
        <JwPagination :items="faculties" @changePage="onChangePage"
          :labels="customLabels" :pageSize="10">
        </JwPagination>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import FacultyManagementDetailComponent from '../FacultyDetailComponent/FacultyDetailComponent.vue'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import FacultyService from '../../../services/faculty/facultyServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ListFacultyManagementComponent",
  extends: ComponentBase,
  components: {
    FacultyManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      faculties: [],
      editFaculty: {},
      selectFaculty:-1,
      confirmFaculty: null,
      metaDataFile: [],
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        facultyName: "",
      },
    };
  },

  async mounted(){
    await this.getFacultiesFilterAsync();
  },
  
  methods:{
    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    
    createFaculty() {
      this.editFaculty = {};
    },
    
    async getFacultiesFilterAsync(){
      // Call Api
      this.showLoading();
      const api = new FacultyService()

      const response = await api.getFacultiesFilterAsync(this.filter);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties = response.data;
      this.$emit("change-faculty", this.faculties);
    },

    async changePage(currentPage) {
      await this.getFacultiesFilterAsync(currentPage);
    },

    updateFaculty(index) {
      this.selectFaculty = index;
      this.editFaculty = Object.assign({}, this.pageOfItems[index]);
    },

    deleteFaculty(item, index) {
      this.confirmFaculty = { item: item , index: index};
    },

    // Call api delete Faculty
    async deleteFacultyConfirm(facultyComfirm) {
      this.showLoading();
      let api = new FacultyService();
      let response = await api.deleteFacultyAsync(facultyComfirm.item.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties.splice(facultyComfirm.index, 1);
      this.$emit("change-faculty", this.faculties);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    async changeData(faculty, type) {
      if(type === "create"){
        this.faculties.unshift(faculty);
        return this.$emit("change-faculty", this.faculties);
      }
      this.faculties.splice(this.selectFaculty, 1 ,faculty)
      this.selectFaculty = -1;
      this.$emit("change-faculty", this.faculties);
    },
  }
}
</script>

<style lang='scss'>
</style>