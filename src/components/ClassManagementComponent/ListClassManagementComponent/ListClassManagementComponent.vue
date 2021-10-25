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
          Danh sách lớp
          <button class="btn btn-primary float-right" @click="createClass">
            + Thêm mới
          </button>
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div class="col-xl-2 col-md-2 col-sm-12 mb-sm-2">
                  <select
                    @change="getClassesFilterAsync"
                    class="form-control form-select form-select-class"
                    v-model="filter.status"
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="unactive">Không hoạt động</option>
                  </select>
                </div>
                <div class="col-xl-4 col-md-4 col-sm-12 mb-sm-2">
                  <input
                    type="text"
                    class="form-control"
                    id="keywords"
                    placeholder="Nhập từ khóa"
                    v-model="filter.className"
                  />
                </div>
                <div class="col-xl-2 col-md-4 col-sm-12">
                  <button
                    type="submit"
                    id="btn-search"
                    class="btn btn-primary"
                    @click="getClassesFilterAsync"
                  >
                    Tìm kiếm
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
                  <th scope="col">Tên lớp</th>
                  <th scope="col">Đợt thực tập</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pageOfItems" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ item.className }}</td>
                  <td v-if="plans.length > 0">
                    {{
                      getInfoObject(item.internshipCourseId, plans)
                        .internshipCourseName
                    }}
                  </td>
                  <td>
                    <button
                      class="btn btn-danger mr-2"
                      @click="updateStatus(index)"
                      v-if="item.status == 'unactive'"
                    >
                      <i :class="getStatusIcon(item.status)"></i>
                    </button>
                    <button
                      class="btn btn-warning mr-2"
                      @click="updateStatus(index)"
                      v-if="item.status == 'active'"
                    >
                      <i :class="getStatusIcon(item.status)"></i>
                    </button>
                  </td>
                  <td>
                    <button
                      class="btn btn-success mr-2"
                      @click="updateClass(index)"
                    >
                      Sửa
                    </button>
                    <button class="btn btn-danger" @click="deleteClass(item)">
                      Xóa
                    </button>
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
        <ClassManagementDetailComponent
          :data="editClass"
          @change-data="changeData"
          :plans="plans"
        />

        <ConfirmDialog
          :data="confirmClassRoom"
          @agree="deleteClassConfirm"
        ></ConfirmDialog>

        <div
          class="card-footer d-flex justify-content-center text--blue"
          v-show="pageOfItems == null || pageOfItems.length === 0"
        >
          <JwPagination
            :items="classes"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="5"
          >
          </JwPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClassManagementDetailComponent from "../ClassManagementDetailComponent/ClassManagementDetailComponent";
import ComponentBase from "../../common/component-base/ComponentBase";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import ClassService from "../../../services/class/classServices";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import PlanService from "../../../services/plan/planServices";

export default {
  name: "ListClassManagementComponent",
  extends: ComponentBase,
  components: {
    ClassManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      classes: [],
      editClass: {},
      confirmClassRoom: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filter: {
        internshipCourseId: "",
        className: "",
        status: "active",
      },
      plans: [],
    };
  },

  async mounted() {
    await this.getClassesFilterAsync();
    await this.getPlansAsync();
  },

  methods: {
    async getPlansAsync() {
      let planFilter = {
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlansAsync(planFilter);
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

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async updateStatus(index) {
      let classRoom = this.pageOfItems[index];
      if (classRoom.status === "active") {
        classRoom.status = "unactive";
      } else {
        classRoom.status = "active";
      }
      this.showLoading();
      let api = new ClassService();
      let response = await api.updateClassAsync(classRoom);
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
      this.getClassesFilterAsync();
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createClass() {
      this.editClass = {};
    },

    async getClassesFilterAsync() {
      // Call Api
      this.showLoading();
      const api = new ClassService();

      const response = await api.getClassesFilterAsync(this.filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classes = response.data;
    },

    async changePage(currentPage) {
      await this.getClassesFilterAsync(currentPage);
    },

    updateClass(index) {
      this.editClass = Object.assign({}, this.pageOfItems[index]);
    },

    deleteClass(classroom) {
      this.confirmClassRoom = classroom;
    },

    // Call api delete Class
    async deleteClassConfirm(classComfirm) {
      this.showLoading();
      let api = new ClassService();
      let response = await api.deleteClassAsync(classComfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      await this.getClassesFilterAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    async changeData() {
      await this.getClassesFilterAsync();
    },
  },
};
</script>

<style lang="scss">
</style>
