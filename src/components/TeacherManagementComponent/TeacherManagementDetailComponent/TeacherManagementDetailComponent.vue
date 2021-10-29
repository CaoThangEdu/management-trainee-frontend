<template >
<BaseModal
  @mouse-click-outside="closeModal(false)"
  :modalName="`TeacherManagementDetailComponent`"
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
          id="name"
          v-model="teacher.firstName"
        />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Tên
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" id="lastName" v-model="teacher.lastName" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Email
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" id="email"
          v-model="teacher.email" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Số điện thoại
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" id="phoneNumber"
          v-model="teacher.phoneNumber"
          maxlength="11" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Khoa
        (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <select
          class="form-control form-select form-select-class"
          v-model="teacher.facultyId"
        >
          <option
            v-for="(faculty, index) in faculties"
            :key="index + 'faculty'"
            :value="faculty.id"
          >
            {{ faculty.facultyName }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group row" v-if="teacher.id">
      <label class="col-md-4 col-sm-4 col-form-label">Trạng thái </label>
      <div class="col-md-8 col-sm-8">
        <div class="input-group mb-3">
          <select class="form-control form-select form-select-class" id="inputGroupSelect02" v-model="teacher.status">
            <option value="active">Hoạt động</option>
            <option value="unctive">Không hoạt động</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <template #header>
    <h5>{{teacher.id ? "Cập nhật khóa" : "Thêm mới giáo viên"}}</h5>
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
          {{teacher.id ? "Cập nhật" : "Thêm mới"}}
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
import TeacherService from "../../../services/teacher/teacherServices";
import AppConfig from "../../../../src/app.config.json";
import TeacherViewModel from "../../../view-model/teacher/teacherViewModel";
import crudMixin from "../../../helpers/mixins/crudMixin";
import createUserMixin from "../../../helpers/mixins/createUserMixin";

export default {
  name: "TeacherDetail",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ crudMixin, createUserMixin ],
  data() {
    return {
      isShow: false,
      teacher: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        status: '',
        facultyId: '',
      },
      errorMessages: [],
      dataForCreateUser: {
        username: "",
        name: "",
        surname: "",
        emailAddress: "",
      }
    };
  },
  props: {
    data: {
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
      this.teacher = {};
      if (changeData) {
        this.$emit("change-data");
      }
    },
    async createTeacherAsync() {
      this.teacher.status = 'active';
      this.showLoading();
      let api = new TeacherService();
      let response = await api.createTeacherAsync(this.teacher);
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

    async updateTeacherAsync() {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(this.teacher);
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
      let viewModel = new TeacherViewModel();
      viewModel.setFields(this.teacher);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.teacher.id === undefined) {
        await this.createTeacherAsync();
        return;
      }
      await this.updateTeacherAsync();
    },
  },
  watch: {
    data() {
      this.isShow = true;
      this.teacher = this.data;
    },
  },
};
</script>

<style lang='scss'>
.form-select-class {
  width: 100%;
  height: 35px;
}

.brith-day {
  width: 100%;
  height: 35px;
}
</style>
