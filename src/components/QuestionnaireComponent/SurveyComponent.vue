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
              </thead>
              <tbody>
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
                    <button
                      @click="answerSurvey(surveyForm)"
                      type="button"
                      class="btn btn-success mr-1"
                    >
                    <em class="fas fa-edit"></em>
                    </button>
                  </td>
                </tr>
                <tr v-show="surveyForms == null || surveyForms.length === 0">
                  <th colspan="5" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
import SurveyFormServices from "../../services/surveyForm/surveyFormServices";
import AppConfig from "../../../src/app.config.json";
import CrudMixin from "../../helpers/mixins/crudMixin";
import JwPagination from "jw-vue-pagination";
export default {
  name: "SurveyComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      pageSize: 10,
      surveyForms: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
    };
  },
  async mounted() {
    this.surveyForms = await this.getSurveyFormsAsync();
  },
  methods: {

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

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    answerSurvey(surveyForm) {
      this.$router.push({
        name: "answerSurvey",
        params: { formName:surveyForm.formName,surveyFormId: surveyForm.id},
      });
    },
  },
};
</script>

