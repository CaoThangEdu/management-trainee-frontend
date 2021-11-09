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
          Danh sách link biểu mẫu
          <button class="btn btn-primary float-right btn-search"          
            @click="createInternshipData" title="Thêm mới"
            v-if="userProfile && userProfile.role == 'Admin'"
          >
            <em class="fa fa-plus-square"></em>
          </button>
        </header>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead class="">
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Tiêu đề</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col">Đường dẫn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pageOfItems" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{item.description}}</td>
                  <td>
                    <a :href="item.link" target="_blank">
                      Xem chi tiết
                    </a>
                  </td>
                </tr>
                <tr v-show="pageOfItems == null || pageOfItems.length === 0">
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
          v-show="pageOfItems.length !== 0"
        >
          <div class="form-group d-flex page-size-group mb-0 mr-2"
            v-if="isPageSize">
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
            :items="internshipData"
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
import InternshipDataService from "../../../services/internshipData/internshipDataServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "InternshipDataOfStudentComponent",
  extends: ComponentBase,
  components: {
    JwPagination
  },
  mixins: [CrudMixin],
  data() {
    return {
      internshipData: [],
      editInternshipData: {},
      confirmInternshipData: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageSize: 10,
      isPageSize: false,
    };
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },

  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }
    await this.getInternshipDataFilterAsync();
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

    async changePageSize() {
      await this.getInternshipDataFilterAsync();
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createInternshipData() {
      this.editInternshipData = {};
    },

    async getInternshipDataFilterAsync() {
      if (!this.userProfile) return;
      if (!this.userProfile.internshipCourseId) return;
      // Call Api
      this.showLoading();
      const api = new InternshipDataService();

      const response = await api.getInternshipDatasAsync({
        internshipCourseId:  this.userProfile.internshipCourseId,
      });
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.internshipData = response.data;
      this.isPageSize = this.internshipData.length!=0;
    },

    async changePage(currentPage) {
      await this.getInternshipDataFilterAsync(currentPage);
    },

    updateInternshipData(index) {
      this.editInternshipData = Object.assign({}, this.pageOfItems[index]);
    },

    deleteInternshipData(classroom) {
      this.confirmInternshipData = classroom;
    },

    // Call api delete Class
    async deleteInternshipDataConfirm(internshipDataComfirm) {
      this.showLoading();
      let api = new InternshipDataService();
      let response = await api.deleteInternshipDataAsync(internshipDataComfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.internshipData = this.internshipData.filter(
        internshipDataInfo => internshipDataInfo.id != internshipDataComfirm.id
      );
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default} ${internshipDataComfirm.title}`
      );
    },

    async changeData() {
      await this.getInternshipDataFilterAsync();
    },
  },
};
</script>

<style lang="scss">
</style>
