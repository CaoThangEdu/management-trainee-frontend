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
          >Câu hỏi khảo sát
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
                  <th scope="col" class="align-middle" 
                  style="width: 550px;">
                  Câu hỏi</th>
                  <th scope="col" class="align-middle"  style="width: 250px;">Câu hỏi cha</th>
                  <th scope="col" class="align-middle">Kiểu câu trả lời</th>
                  <th scope="col" class="align-middle text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(question, index) in pageOfItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      aria-label="Amount (to the nearest dollar)"
                      v-model="question.question"
                    />
                  </td>
                  <td>
                    <select
                      v-model="question.parrentMcqId"
                      class="form-control form-select form-select-class"
                    >
                      <option :selected ="question.parrentMcqId == '00000000-0000-0000-0000-000000000000'" value="00000000-0000-0000-0000-000000000000">Câu hỏi chính</option>
                      <option
                        :selected ="question.parrentMcqId === selectQuestion.id"
                        v-for="(selectQuestion, index) in questions"
                        :key="`select-${index}`"
                        :value="selectQuestion.id"
                      >
                        {{ selectQuestion.question }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <select
                      v-model="question.type"
                      class="form-control form-select form-select-class"
                    >
                     <option value="0">Không chọn</option>
                      <option value="1">Text</option>
                      <option value="2">Radio button</option>
                      <option value="3">Check box</option>
                      <option value="4">String</option>
                    </select>
                  </td>
                  <td class="text-center">
                    <button
                      @click="updateQuestionAsync(index)"
                      type="button"
                      class="btn btn-primary mr-1"
                    >
                      <em class="fas fa-edit"></em>
                    </button>
                    <button
                      @click="deleteQuestion(question.id, index)"
                      type="button"
                      class="btn btn-danger ml-1"
                    >
                      <em class="fas fa-trash-alt"></em>
                    </button>
                  </td>
                </tr>
                <tr v-show="questions == null || questions.length === 0">
                  <th colspan="5" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
                <tr>
                  <td class="align-middle"></td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      aria-label="Amount (to the nearest dollar)"
                      v-model="keyQuestion.question"
                    />
                  </td>
                  <td>
                    <select
                      v-model="keyQuestion.parrentMcqId"
                      class="form-control form-select form-select-class"
                    >
                      <option value="null" >Câu hỏi chính</option>
                      <option
                        v-for="(question, index) in questions"
                        :key="`select-${index}`"
                        :value="question.id"
                      >
                        {{ question.question }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <select
                      v-model="keyQuestion.type"
                      class="form-control form-select form-select-class"
                    >
                      <option value="0">Không chọn</option>
                      <option value="1">Text</option>
                      <option value="2">Radio button</option>
                      <option value="3">Check box</option>
                      <option value="4">String</option>
                    </select>
                  </td>
                  <td class="text-center">
                    <button
                      @click="createQuestionAsync()"
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
          :data="confirmedquestion"
          @agree="agreeConfirm"
        ></ConfirmDialog>
        <div class="card-footer d-flex justify-content-center text--blue">
          <JwPagination
            :items="questions"
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
import QuestionServices from "../../services/question/questionServices";
import AppConfig from "../../../src/app.config.json";
import CrudMixin from "../../helpers/mixins/crudMixin";
import JwPagination from "jw-vue-pagination";
export default {
  name: "QuestionsComponent",
  extends: ComponentBase,
  components: {
    ConfirmDialog,
    JwPagination,
  },
  mixins: [CrudMixin],
  data() {
    return {
      pageSize: 10,
      confirmedquestion: null,
      questions: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      pageOfItems: [],
      keyQuestion: {
        question: "",
        parrentMcqId: null,
        type: 0,
      },
    };
  },
  async mounted() {
    this.questions = await this.getQuestionsAsync();
  },
  methods: {
    deleteQuestion(id, index) {
      this.confirmedquestion = { id: id, index: index };
    },

    // Call api delete
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

    async createQuestionAsync() {
      if (this.keyQuestion.question === "") {
        return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Vui lòng nhập câu hỏi"
        );
      }
      this.keyQuestion.parrentMcqId = this.keyQuestion.parrentMcqId === "null"? null : this.keyQuestion.parrentMcqId
      this.showLoading();
      let api = new QuestionServices();
      let response = await api.createQuestionAsync(this.keyQuestion); // Gọi Api
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
      this.questions.unshift(response.data);
      this.keyQuestion.question = "";
      this.keyQuestion.parrentMcqId = "";
      this.keyQuestion.type = 0;
    },

    async updateQuestionAsync(index) {
      this.showLoading();
      let api = new QuestionServices();
      let response = await api.updateQuestionAsync(this.questions[index]); // Gọi Api
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
      this.$set(this.questions, index, response.data);
    },

    async agreeConfirm(dataConfirm) {
      this.showLoading();
      let api = new QuestionServices();
      let response = await api.deleteQuestionAsync(dataConfirm.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.questions.splice(dataConfirm.index, 1);
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

