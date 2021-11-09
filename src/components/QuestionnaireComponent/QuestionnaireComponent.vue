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
            ></path></svg
          >Phiếu khảo sát
        </header>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12">
                  <input
                    type="text"
                    class="form-control"
                    id="keywords"
                    placeholder="Nhập từ khóa"
                  />
                </div>
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12">
                  <button type="submit" id="btn-search" class="btn btn-primary">
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
                  <th scope="col" class="align-middle">STT</th>
                  <th scope="col" class="align-middle">Tên phiếu khảo sát</th>
                  <th scope="col" class="align-middle text-center">Thao tác</th>
                </tr>
                <tr v-for="(surveyForm, index) in surveyForms" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      aria-label="Amount (to the nearest dollar)"
                      v-model="surveyForm.formName"
                    />
                  </td>
                  <td class="text-center">
                    <button @click="contentSurveyForm(surveyForm.id)" type="button" class="btn btn-success mr-1">
                     <em class="fas fa-list"></em>
                    </button>
                    <button @click="updateSurveyFormsAsync(index)" type="button" class="btn btn-primary mr-1">
                      <em class="fas fa-edit"></em>
                    </button>
                    <button
                      @click="deleteSurveyForm(surveyForm.id, index)"
                      type="button"
                      class="btn btn-danger ml-1"
                    >
                      <em class="fas fa-trash-alt"></em>
                    </button>
                  </td>
                </tr>
                <tr>
                  <th scope="col" class="align-middle"></th>
                  <th scope="col" class="align-middle">
                    <div class="input-group">
                      <input
                        v-model="keySurveyForm.formName"
                        type="text"
                        class="form-control"
                        aria-label="Amount (to the nearest dollar)"
                      />
                      <div class="input-group-append"></div>
                    </div>
                  </th>
                  <th scope="col" class="text-center">
                    <button
                      @click="createSurveyFormsAsync()"
                      title="Thêm mới phiếu khảo sát"
                      class="btn btn-primary"
                    >
                      <em class="fa fa-plus-square"></em>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-show="surveyForms == null || surveyForms.length === 0">
                  <th colspan="5" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ConfirmDialog
          :data="confirmedSurveyForm"
          @agree="agreeConfirm"
        ></ConfirmDialog>
        <div class="card-footer d-flex justify-content-center text--blue">
          <JwPagination
            :items="surveyForms"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="pageSize"
          >
          </JwPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../common/component-base/ComponentBase";
import ConfirmDialog from "../common/confirm-dialog/ConfirmDialog";
import SurveyFormServices from "../../services/surveyForm/surveyFormServices";
import AppConfig from "../../../src/app.config.json";
import CrudMixin from "../../helpers/mixins/crudMixin";
import JwPagination from "jw-vue-pagination";
export default {
  name: "QuestionnaireComponent",
  extends: ComponentBase,
  components: {
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      pageSize: 10,
      confirmedSurveyForm: null,
      surveyForms: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
      keySurveyForm: {
        formName: "",
      },
    };
  },
  async mounted() {
    this.surveyForms = await this.getSurveyFormsAsync();
  },
  methods: {
    deleteSurveyForm(id, index) {
      this.confirmedSurveyForm = { id: id, index: index };
    },

    // Call api delete SurveyForms
    async getSurveyFormsAsync() {
      this.showLoading();
      let api = new SurveyFormServices();
      let response = await api.getSurveyFormsAsync(); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      return response.data;
    },

    async createSurveyFormsAsync() {
      if(this.keySurveyForm.formName === ""){
        return  this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Tên phiếu khảo sát"
        );
      }
      this.showLoading();
      let api = new SurveyFormServices();
      let response = await api.createSurveyFormAsync(this.keySurveyForm); // Gọi Api
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
      this.surveyForms.unshift(response.data);
      this.surveyForms.formName = "";
    },

    async updateSurveyFormsAsync(index) {
      this.showLoading();
      let api = new SurveyFormServices();
      let response = await api.updateSurveyFormAsync(this.surveyForms[index]); // Gọi Api
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
      this.$set(this.surveyForms, index, response.data)
    },

    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new SurveyFormServices();
      let response = await api.deleteSurveyFormAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.surveyForms.splice(dataConfirm.index, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    contentSurveyForm(surveyFormId){
      this.$router.push({ name: 'contentQuestionnaire', params: { surveyFormId: surveyFormId } })
    }
  },
};
</script>

