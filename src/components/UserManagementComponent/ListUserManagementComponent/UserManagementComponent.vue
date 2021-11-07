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
          Danh sách tài khoản
          <button
            class="btn btn-primary float-right btn-search"
            title="Thêm mới"
            @click="createUser"
          >
            <em class="fa fa-plus-square"></em>
          </button>
        </header>

        <div class="card-body">
            <div class="row mb-3">
          <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="form-row filter-wrapper ml-0 mr-0">
              <div class="col-xl-2 col-md-2 col-sm-12 mb-sm-2">
                <select
                  class="form-control form-select form-select-class" v-model="filterUser.role">
                  <option value="">Tất cả</option>
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="TEACHER">Giáo viên</option>
                   <option value="STUDENT">Sinh viên</option>
                </select>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12">
              <input type="text" class="form-control" id="user-name" placeholder="Nhập từ khóa"
              v-model="filterUser.userName"/>
              </div>
              <div class="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12 ">
                <button @click="getUsersAsync()" type="submit" id="btn-search" class="btn btn-primary">Tìm kiếm</button>
              </div>
            </div>
          </div>
        </div>
          <div class="table-responsive">
            <table class="table">
              <thead class="">
                <tr>
                  <th scope="col" class="text-center align-middle">STT</th>
                  <th scope="col" class="align-middle">Tên đăng nhập</th>
                  <th scope="col" class="align-middle">Họ và tên</th>
                  <th scope="col" class="align-middle">Email</th>
                  <th scope="col" class="align-middle">Quyền hạn</th>
                  <th scope="col" class="text-center align-middle" style="width: 125px;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in pageOfItems" :key="index">
                  <th scope="row" class="text-center">{{ index + 1 }}</th>
                  <td>{{ user.userName }}</td>
                  <td >{{ user.fullName }}</td>
                  <td>{{ user.emailAddress }}</td>
                  <td v-if="user.roleNames[0] === 'STUDENT'" >Sinh viên</td>
                  <td v-if="user.roleNames[0] === 'TEACHER'" >Giáo viên</td>
                  <td v-if="user.roleNames[0] === 'ADMIN'" >Admin</td>
                  <td class="text-center">
                    <button @click="resetPassword(user)" type="button" class="btn btn-success p-0 py-2">
                      Reset password
                    </button>
                  </td>
                </tr>
                <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                  <th scope="" colspan="8" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <UserManagementDetailComponent
          :dataUser="editUser"
          @change-data-user="changeDataUser"
        />
          <ResetPasswordComponent
          :dataUser="userResetPassword"
          :isShowResetPassword="isShowResetPassword"
          @close-reset-password="closeResetpassword"
        />
        <ConfirmDialog 
        :data="user" 
        @agree="resetPassword"
        :message="message"></ConfirmDialog>
        <div class="card-footer d-flex justify-content-center text--blue">
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
            :items="users"
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
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import JwPagination from "jw-vue-pagination";
import UserService from "../../../services/user/userService";
import AppConfig from "../../../app.config.json";
import UserManagementDetailComponent from "../UserManagementDetailComponent/UserManagementDetailComponent.vue";
import ResetPasswordComponent from "../ResetPasswordComponent/ResetPasswordComponent.vue";
import crudMixin from "../../../helpers/mixins/crudMixin";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"

export default {
  name: "UserManagementComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    BaseModal,
    AlertMessages,
    UserManagementDetailComponent,
    ConfirmDialog,
    ResetPasswordComponent
  },
  mixins: [crudMixin],
  data() {
    return {
      userResetPassword:null,
      isShowResetPassword:false,
      user: null,
      message:"",
      users: [],
      pageSize: 10,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      editUser: {},
      filterUser:{
        role:"",
        userName:"",
        isActive:true
      }
    };
  },
  async mounted() {
    await this.getUsersAsync();
  },
  methods: {
    createUser() {
      this.editUser = {};
    },

    async changeDataUser() {
      await this.getUsersAsync();
    },

    async createUserAsync(user) {
      // Call Api
      this.showLoading();
      const api = new UserService();
      const response = await api.createUserAsync(user);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
    },

    async getUsersAsync() {
      // Call Api
      this.showLoading();
      const api = new UserService();
      const response = await api.getUsersAsync(this.filterUser);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.users = response.data;
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    async changePageSize() {
      await this.getUsersAsync();
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },

   closeResetpassword(changeData){
     this.isShowResetPassword = changeData
   },

   resetPassword(user){
     this.userResetPassword = user;
     this.isShowResetPassword = true;
   }

  },

  watch:{
    "filterUser.role":async function() {
        await this.getUsersAsync();
    }
  }
};
</script>
