<template>
  <div class="row">
  <div class="col-12">
    <div class="card">
    <header class="card-header">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
        <path fill="var(--ci-primary-color, currentColor)"
          d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
          class="ci-primary"></path>
      </svg> Danh sách ngành
      <button class="btn btn-primary float-right" title="Thêm mới"
        @click="createCareer">
        <i class="fa fa-plus-square"></i>
      </button>
    </header>
    <div class="card-body">
      <div class="row mb-3">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="form-row filter-wrapper ml-0 mr-0">
            <div class="col-xl-2 col-md-2 col-sm-12 mb-sm-2">
              <select @change="getCareersFilterAsync" class="form-control form-select form-select-class"
                name="trainingSystemId" id="trainingSystemId" v-model="filter.trainingSystemId">
                <option v-for="(item,index) in trainingSystems" :key="index" :value="item.id">
                  {{item.trainingSystemName}}</option>
              </select>
            </div>
            <div class="col-xl-3 col-md-3 col-sm-12 mb-sm-2">
              <input type="text" class="form-control" id="keywords" placeholder="Nhập từ khóa"
                v-model="filter.careersName" />
            </div>
            <div class="col-xl-3 col-md-3 col-sm-12">
              <button type="submit" id="btn-search" class="btn btn-stack-overflow"
                @click="getCareersFilterAsync"
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
              <th scope="col">Ngành</th>
              <th scope="col">Hệ</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pageOfItems" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td
                @click="updateCareer(index)"
                class="link-detail"
                title="Xem">{{ item.careersName }}</td>
              <td v-if="trainingSystems.length != 0">
                {{ getTrainingSystemName(item.trainingSystemId, trainingSystems).trainingSystemName }}
              </td>
              <td>
                <button class="btn btn-danger" title="Xóa"
                  @click="deleteCareer(item, index)"><em class="fa fa-trash"></em></button>
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
      <CareerManagementDetailComponent 
        :data="editCareer" @change-data="changeData"
        :trainingSystems="trainingSystems"
        :faculties="faculties" />

      <ConfirmDialog :data="confirmCareer" @agree="deleteCareerConfirm"></ConfirmDialog>

      <div class="card-footer d-flex justify-content-center text--blue"
        v-show="pageOfItems == null || pageOfItems.length === 0">
        <JwPagination :items="careers" @changePage="onChangePage"
          :labels="customLabels" :pageSize="10">
        </JwPagination>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import CareerManagementDetailComponent from '../CareerManagementDetailComponent/CareerManagementDetailComponent'
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CareerService from '../../../services/career/careerServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "ListCareerManagementComponent",
  extends: ComponentBase,
  components: {
    CareerManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  props:{
    trainingSystems:Array,
    faculties: Array
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      careers: [],
      editCareer: {},
      confirmCareer: null,
      selectCareer: -1,
      metaDataFile: [],
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        trainingSystemId: "",
        careersName: "",
        status: "",
      },
    };
  },

  async mounted(){
    await this.getCareersFilterAsync();
  },
  
  methods:{
    getTrainingSystemName(trainingSystemId, list) {
      return CrudMixin.methods.getInfo(trainingSystemId, list);
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    
    createCareer() {
      this.editCareer = {};
    },
    
    async getCareersFilterAsync(){
      // Call Api
      this.showLoading();
      const api = new CareerService()

      const response = await api.getCareersFilterAsync(this.filter);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data;
    },

    async changePage(currentPage) {
      await this.getCareersFilterAsync(currentPage);
    },

    updateCareer(index) {
      this.selectCareer = index;
      this.editCareer = Object.assign({}, this.pageOfItems[index]);
    },

    deleteCareer(item, index) {
      this.confirmCareer = { item: item, index : index };
    },

    // Call api delete Career
    async deleteCareerConfirm(careerComfirm) {
      this.showLoading();
      let api = new CareerService();
      let response = await api.deleteCareerAsync(careerComfirm.item.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers.splice(careerComfirm.index, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
    
    changeData(career, type) {
      if(type === "create"){
        return this.careers.unshift(career);
      }
      this.careers.splice(this.selectCareer, 1 ,career)
      this.selectCareer = -1;
    },

    // Call api delete TrainingSystem
    async updateStatus(index) {
      let career = this.pageOfItems[index];
      if (career.status === 'active') {
        career.status = 'unactive';
      } else {
        career.status = 'active';
      }
      this.showLoading();
      let api = new CareerService();
      let response = await api.updateCareerAsync(career);
      this.showLoading(false);

      if(!response.isOK){
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
      await this.getCareersFilterAsync();
    },
  }
}
</script>

<style lang='scss'>

</style>