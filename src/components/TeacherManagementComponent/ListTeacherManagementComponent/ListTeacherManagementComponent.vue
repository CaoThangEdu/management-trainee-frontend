<template>
<div class="row">
  <div class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-0">
      <PlanningStepsComponent v-if="internshipCourseId"
        :isActiveStep="isActiveStep" />
    </div>
    <div class="row" :class="{'mt-4': internshipCourseId}">
      <div class="col-12">
        <div class="row card">
          <header class="card-header d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
                <path fill="var(--ci-primary-color, currentColor)"
                  d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
                  class="ci-primary"></path>
              </svg>
              <span class="ml-1">Danh sách giáo viên</span>
            </div>
            <div>
              <button class="btn btn-primary float-right" @click="createTeacher" title="Thêm mới">
                <em class="fa fa-plus-square"></em>
              </button>
              <button class="btn btn-instagram float-right btn-add-file" @click="createFileTeacher" title="Thêm file">
                <em class="fa fa-file-excel"></em>
              </button>
            </div>
          </header>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="form-row filter-wrapper ml-0 mr-0">
                  <div class="col-xl-3 col-md-3 col-sm-12 mb-sm-2">
                    <input type="text" class="form-control" id="keywords" placeholder="Nhập từ khóa" />
                  </div>
                  <div class="col-xl-3 col-md-3 col-sm-12">
                    <button type="submit" id="btn-search" class="btn btn-stack-overflow" title="Tìm kiếm">
                      <em class="fas fa-search"></em>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead class="">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Họ và tên</th>
                    <th scope="col">Email</th>
                    <th scope="col">Số điện thoại</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in pageOfItems" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <td @click="updateTeacher(index)" class="link-detail" title="Xem">
                      {{ item.firstName + ' ' + item.lastName }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.phoneNumber }}</td>
                    <td>
                      <button class="btn btn-danger" title="Xóa" @click="deleteTeacher(item)">
                        <em class="fa fa-trash"></em>
                      </button>
                    </td>
                  </tr>
                  <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                    <th id="" colspan="5" class="text-left">
                      Không có dữ liệu nào được tìm thấy.
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <TeacherManagementDetailComponent :data="editTeacher" @change-data="changeData" :faculties="faculties" />

          <AddTeacherFileComponent :data="teacherFile" @change-data="changeData" :faculties="faculties" />
          <ConfirmDialog :data="confirmTeacher" @agree="deleteTeacherConfirm"></ConfirmDialog>

          <div class="card-footer d-flex justify-content-center align-items-center text--blue">
            <div class="form-group d-flex page-size-group mb-0 mr-2">
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
              :items="teachers"
              @changePage="onChangePage"
              :labels="customLabels"
              :pageSize="Number(pageSize)">
            </JwPagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import TeacherManagementDetailComponent from "../TeacherManagementDetailComponent/TeacherManagementDetailComponent";
import AddTeacherFileComponent from "../AddTeacherFlieComponent/AddTeacherFlieComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import TeacherService from "../../../services/teacher/teacherServices";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import AppConfig from "../../../../src/app.config.json";
import FacultyServices from "../../../services/faculty/facultyServices";
import PlanningStepsComponent from "../../../components/planningStepsComponent/planningStepsComponent.vue";

export default {
  extends: ComponentBase,
  components: {
    TeacherManagementDetailComponent,
    AddTeacherFileComponent,
    ConfirmDialog,
    JwPagination,
    PlanningStepsComponent,
  },
  mixins: [CrudMixin],
  props: ["internshipCourseId"],
  data() {
    return {
      teachers: [],
      editTeacher: {},
      teacherFile: {},
      confirmTeacher: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filter: {
        lastName: "",
        facultyId: "",
        status: "active",
      },
      isActiveStep: "3",
      faculties: [],
      pageSize: 10,
    };
  },
  async mounted() {
    await this.getTeachersAsync();
    await this.getFacultiesFilterAsync();
  },
  methods: {
    async getFacultiesFilterAsync() {
      let facultyFilter = {};
      // Call Api
      this.showLoading();
      const api = new FacultyServices();

      const response = await api.getFacultiesFilterAsync(facultyFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties = response.data;
    },

    async changePageSize() {
      await this.getTeachersAsync();
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createTeacher() {
      this.editTeacher = {};
    },

    createFileTeacher() {
      this.teacherFile = {};
    },

    async getTeachersAsync() {
      // Call Api
      this.showLoading();
      const api = new TeacherService();
      const response = await api.getTeachersAsync(this.filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.teachers = response.data;
    },

    async changePage(currentPage) {
      await this.getTeachersAsync(currentPage);
    },

    updateTeacher(index) {
      this.editTeacher = Object.assign({}, this.teachers[index]);
    },

    deleteTeacher(teacher) {
      this.confirmTeacher = teacher;
    },

    // Call api delete teacher
    async updateIsDeleteStatus(index) {
      let teacher = this.pageOfItems[index];
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(teacher);
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
      this.getTeachersAsync();
    },

    async deleteTeacherConfirm(teacherComfirm) {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.deleteTeacherAsync(teacherComfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getTeachersAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeData() {
      await this.getTeachersAsync();
    },

    getTrainingSystemName(careersId, careers) {
      return CrudMixin.methods.getInfo(careersId, careers);
    },

    async updateStatus(index) {
      let teacher = this.pageOfItems[index];
      if (teacher.status === "active") {
        teacher.status = "unactive";
      } else {
        teacher.status = "active";
      }
      this.showLoading();
      let api = new TeacherService();
      let response = await api.updateTeacherAsync(teacher);
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
      this.getTeachersAsync();
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },
  },
};
</script>

<style lang="scss">
.btn-add-file {
  margin-right: 10px;
}
.card-header {
  .btn-add-file {
    margin-left: 20px;
    color: white;
  }
}
</style>
