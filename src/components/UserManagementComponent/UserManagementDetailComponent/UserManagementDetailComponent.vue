<template>
<BaseModal
  @mouse-click-outside="closeModal(false)"
  :modalName="`UserManagementDetailComponent`"
  :isShow="isShow"
  size="lg"
>
  <div class="">
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Họ
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input
          type="text"
          class="form-control"
          id="sur-name"
          v-model="user.surname"
        />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Tên và tên đệm
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control"
          id="name" v-model="user.name" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Email
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control"
          id="emailAddress" v-model="user.emailAddress" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Mật khẩu
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control"
          id="password" v-model="user.password" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Xác nhận mật khẩu
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control"
          id="confirmPassword" v-model="user.confirmPassword" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Quyền
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <select class="form-control form-select form-select-class"
          v-model="user.roleNames">
          <option v-for="(role, index) in roleEnum"
            :key="index" :value="role">
            {{ getRoleName(role) }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group row" v-if="user.id">
      <label class="col-md-4 col-sm-4 col-form-label">Trạng thái</label>
      <div class="col-md-8 col-sm-8">
        <div class="input-group mb-3">
          <select 
            class="form-control form-select form-select-class"
            v-model="user.isActive">
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <template #header>
    <h5>{{user.id ? "Cập nhật khóa" : "Thêm mới giáo viên"}}</h5>
    <button class="close" style="color: red;" @click="closeModal(false)">
      &times;
    </button>
  </template>

  <template #footer>
    <div class="form-inline form-group col-md-12 pr-0">
      <div class="col-form-label col-md-4 col-sm-4"></div>
      <div class="col-md-8 col-sm-8 pl-0 pr-0">
        <AlertMessages :messages="errorMessages" />

      </div>
    </div>

    <div class="form-inline form-group col-md-12 pr-0">
      <div class="col-form-label col-md-4 col-sm-4"></div>
      <div class="col-md-8 col-sm-8 pl-0 pr-0">
        <button @click="save" class="btn btn-primary float-right ml-2">
          {{user.id ? "Cập nhật" : "Thêm mới"}}
        </button>
        <button class="btn btn-dark float-right" @click="closeModal(false)">
          Hủy
        </button>
      </div>
    </div>
  </template>
</BaseModal>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import UserService from "../../../services/user/userService";
import AppConfig from "../../../../src/app.config.json";
import UserViewModel from "../../../view-model/user/userViewModel";
import crudMixin from "../../../helpers/mixins/crudMixin";
import createUserMixin from "../../../helpers/mixins/createUserMixin";
import { ROLE_ENUM } from "../../../config/constant";

export default {
  name: "UserDetail",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ crudMixin, createUserMixin ],
  data() {
    return {
      isShow: false,
      user: {},
      errorMessages: [],
      dataForCreateUser: {
        username: "",
        name: "",
        surname: "",
        emailAddress: "",
      },
      roleEnum: ROLE_ENUM,
    };
  },
  props: {
    dataUser: {
      type: Object,
      default: null,
    },
    faculties: {
      type: Array,
      default: null,
    }
  },
  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.user = {};
      if (changeData) {
        this.$emit("change-data-user");
      }
    },
    
    async createUserAsync() {
      this.user.isActive = true;
      this.showLoading();
      let api = new UserService();
      let response = await api.createUserAsync(this.user);
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
      this.closeModal(true);
    },

    async updateUserAsync() {
      this.showLoading();
      let api = new UserService();
      let response = await api.updateUserAsync(this.user);
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
        `${AppConfig.notification.content_updated_success_default}`
      );
      this.closeModal(true);
    },

    async save() {
      //validate
      this.user.userName = this.user.emailAddress;
      let viewModel = new UserViewModel();
      viewModel.setFields(this.user);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }
      this.user.roleNames = [this.user.roleNames];

      if (this.user.id === undefined) {
        await this.createUserAsync();
        return;
      }
      await this.updateUserAsync();
    },
  },
  watch: {
    dataUser() {
      this.isShow = true;
      this.user = this.dataUser;
    },
  },
};
</script>
