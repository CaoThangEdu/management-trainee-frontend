<template>
<div class="row">
  <div class="col-12">
    <div class="card">
      <header class="card-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
          <path fill="var(--ci-primary-color, currentColor)"
            d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
            class="ci-primary"></path>
        </svg> Danh sách hệ đào tạo
        <button class="btn btn-primary float-right" title="Thêm mới"
          @click="createTrainingSystem">
          <i class="fa fa-plus-square"></i>
        </button>
      </header>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="form-row filter-wrapper ml-0 mr-0">
              <div class="col-xl-4 col-md-4 col-sm-12 mb-sm-2">
                <select @change="getTrainingSystemsFilterAsync" 
                  class="form-control form-select form-select-class" v-model="filter.status">
                  <option value="">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="unactive">Không hoạt động</option>
                </select>
              </div>
              <div class="col-xl-4 col-md-4 col-sm-12 mb-sm-2">
                <input type="text" class="form-control" id="keywords" placeholder="Nhập từ khóa"
                  v-model="filter.trainingSystemName" />
              </div>
              <div class="col-xl-4 col-md-4 col-sm-12">
                <button type="submit" id="btn-search" class="btn btn-stack-overflow" 
                  @click="getTrainingSystemsFilterAsync"
                  title="Tìm kiếm">
                  <i class="fas fa-search"></i>
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
                <th scope="col">Tên hệ đào tạo</th>
                <th scope="col">Khoa</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>                
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in pageOfItems" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td @click="updateTrainingSystem(index)"
                  class="link-detail"
                  title="Xem">{{ item.trainingSystemName }}</td>
                  <td>{{ getFaculty(item.facultyId).facultyName }}</td>
                <td>
                  <button class="btn btn-danger mr-2"
                    @click="updateStatus(index)"
                    v-if="item.status == 'unactive'"
                    title="Không hoạt động">
                    <i :class="getStatusIcon(item.status)"></i>
                  </button>
                  <button class="btn btn-warning mr-2"
                    @click="updateStatus(index)"
                    v-if="item.status == 'active'"
                    title="Hoạt động">
                    <em :class="getStatusIcon(item.status)"></em>
                  </button>
                </td>
                <td>
                  <button class="btn btn-danger" title="Xóa"
                    @click="deleteTrainingSystem(item, index)">
                    <em class="fa fa-trash"></em>
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
      <TrainingSystemManagementDetailComponent 
        :data="editTrainingSystem" @change-data="changeData"
        :faculties="faculties" />

      <ConfirmDialog :data="confirmTrainingSystem" @agree="deleteTrainingSystemConfirm"></ConfirmDialog>

      <div class="card-footer d-flex justify-content-center text--blue"
        v-show="pageOfItems == null || pageOfItems.length === 0">
        <JwPagination 
          :items="trainingSystems"
          @changePage="onChangePage" 
          :labels="customLabels" 
          :pageSize="5">
        </JwPagination>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import TrainingSystemManagementDetailComponent from '../TrainingSystemManagementDetailComponent/TrainingSystemManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import FacultyServices from '../../../services/faculty/facultyServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";
import crudMixin from '../../../helpers/mixins/crudMixin'

export default {
  name: "ListTrainingSystemManagementComponent",
  extends: ComponentBase,
  components: {
    TrainingSystemManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      trainingSystems: [],
      editTrainingSystem: {},
      confirmTrainingSystem: null,
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        trainingSystemName: "",
        status: "active",
      },
      faculties: [],
    };
  },

  async mounted() {
    await this.getTrainingSystemsFilterAsync();
    await this.getFacultiesFilterAsync();
  },

  methods: {
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createTrainingSystem() {
      this.editTrainingSystem = {};
    },

    async getTrainingSystemsFilterAsync() {
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsFilterAsync(this.filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems = response.data;
    },

    async getFacultiesFilterAsync() {
      let facultyFilter = {
      };
      // Call Api
      this.showLoading();
      const api = new FacultyServices()

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

    async changePage(currentPage) {
      await this.getTrainingSystemsAsync(currentPage);
    },

    updateTrainingSystem(index) {
      this.editTrainingSystem = Object.assign({}, this.pageOfItems[index]);
    },

    changeIsdelete(index) {
      this.editTrainingSystem = Object.assign({}, this.pageOfItems[index]);
    },

    deleteTrainingSystem(item, index) {
      this.confirmTrainingSystem = {item: item, index: index};
    },

    // Call api delete TrainingSystem
    async deleteTrainingSystemConfirm(trainingSystem) {
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.deleteTrainingSystemAsync(trainingSystem.item.id);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystems.splice(trainingSystem.index, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_status_success_default}`
      );
    },

    async updateStatus(index) {
      let trainingSystem = this.pageOfItems[index];
      if (trainingSystem.status === 'active') {
        trainingSystem.status = 'unactive';
      } else {
        trainingSystem.status = 'active';
      }
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.updateTrainingSystemAsync(trainingSystem);
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
      this.getTrainingSystemsFilterAsync();
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    async changeData() {
      this.$emit("change-training-system");
      await this.getTrainingSystemsFilterAsync();
    },

    getFaculty(facultyId){
      let facultyById = crudMixin.methods.convertArrayToObject(this.faculties, "id");
      if(facultyById[facultyId] === undefined){
        return {facultyName: ""}
      }
      return facultyById[facultyId];
    }
  }
}
</script>

<style lang="scss">

</style>
