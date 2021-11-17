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
          ><strong>Nội dung khảo sát: {{formName}}</strong> 
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
                  <th scope="col" class="align-middle" style="width: 600px;">Câu hỏi</th>
                  <th scope="col" class="align-middle" style="width: 150px;">Số thứ tự</th>
                  <th scope="col" class="align-middle text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(formMcq, index) in formMcqs" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <select
                      v-model="formMcq.mcqId"
                      class="form-control form-select form-select-class"
                    >
                      <option
                        v-for="(question, index) in questions"
                        :key="index"
                        :value="question.id"
                      >
                        {{ question.question }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control"
                      aria-label="Amount (to the nearest dollar)"
                      v-model="formMcq.order"
                    />
                  </td>
                  <td class="text-center">
                    <button
                      @click="updateFormMcqAsync(index)"
                      type="button"
                      class="btn btn-primary mr-1"
                    >
                      <em class="fas fa-edit"></em>
                    </button>
                    <button
                      @click="deleteFormMcq(formMcq.id, index)"
                      type="button"
                      class="btn btn-danger ml-1"
                    >
                      <em class="fas fa-trash-alt"></em>
                    </button>
                  </td>
                </tr>
                <tr v-show="formMcqs == null || formMcqs.length === 0">
                  <th colspan="5" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
                <tr>
             <td></td>
                  <td>
                    <select
                      v-model="keyFormMcq.mcqId"
                      class="form-control form-select form-select-class"
                    >
                      <option
                        v-for="(question, index) in questions"
                        :key="index"
                        :value="question.id"
                      >
                        {{ question.question }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control"
                      aria-label="Amount (to the nearest dollar)"
                      v-model="keyFormMcq.order"
                    />
                  </td>
                  <td class="text-center">
                    <button
                      @click="createFormMcqAsync()"
                      title="Thêm mới phiếu khảo sát"
                      class="btn btn-primary"
                    >
                      <em class="fa fa-plus-square"></em>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ConfirmDialog
          :data="confirmedFormMcq"
          @agree="agreeConfirm"
        ></ConfirmDialog>
        <div class="card-footer d-flex justify-content-center text--blue">
          <JwPagination
            :items="formMcqs"
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
import AppConfig from "../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import FormMcqServices from "../../services/formMcq/formMcqServices";
import QuestionServices from "../../services/question/questionServices";
export default {
  name: "ContentQuestionnaireComponent",
  extends: ComponentBase,
  components: {
    ConfirmDialog,
    JwPagination,
  },
  props: ["formName","surveyFormId"],

  data() {
    return {
      formMcqs: [],
      pageSize: 10,
      confirmedFormMcq: null,
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
      keyFormMcq: {
        formId: "",
        mcqId: "",
        order: 0,
      },
      questions: [],
    };
  },
  async mounted() {
    this.formMcqs = await this.getAllFormMcqByFormIdAsync();
    this.questions = await this.getQuestionsAsync();
  },
  methods: {
    deleteFormMcq(id, index) {
      this.confirmedFormMcq = { id: id, index: index };
    },

    async getQuestionsAsync() {
      this.showLoading();
      let api = new QuestionServices();
      let response = await api.getQuestionsAsync(); // Gọi Api
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
    // Call api delete 
    async getAllFormMcqByFormIdAsync() {
      this.showLoading();
      let api = new FormMcqServices();
      let response = await api.getAllFormMcqByFormIdAsync(this.surveyFormId); // Gọi Api
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

    async createFormMcqAsync() {
      if (this.keyFormMcq.mcqId === "") {
        return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Vui lòng chọn câu hỏi"
        );
      }
      this.keyFormMcq.formId = this.surveyFormId;
      this.showLoading();
      let api = new FormMcqServices();
      let response = await api.createFormMcqAsync(this.keyFormMcq); // Gọi Api
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
      this.formMcqs.unshift(response.data);
      this.keyFormMcq.mcqId = "";
      this.keyFormMcq.order = 0;
    },

    async updateFormMcqAsync(index) {
      this.showLoading();
      let api = new FormMcqServices();
      let response = await api.updateFormMcqAsync(this.formMcqs[index]); // Gọi Api
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
      this.$set(this.formMcqs, index, response.data);
    },

    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new FormMcqServices();
      let response = await api.deleteFormMcqAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.formMcqs.splice(dataConfirm.index, 1);
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
  },
};
</script>
