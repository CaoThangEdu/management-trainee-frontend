<template>
  <div v-if="isShow" class="row">
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
          <strong>Trả lời khảo sát</strong>
        </header>
        <div class="card-body">
          <strong>{{ surveyForms.surveyFormName }}</strong>
          <hr />
          <div
            v-for="(formMqcQuestion, index) in surveyForms.formMqcQuestion"
            :key="index"
          >
            <div>
              <strong
                >{{ index + 1 }}: {{ formMqcQuestion.mcq.question }}:</strong
              >
              <div
                class="my-2"
                v-if="
                  formMqcQuestion.mcq.type === '1' &&
                  formMqcQuestion.mcq.listChild.length === 0
                "
              >
                <textarea
                  v-model="answers[formMqcQuestion.mcq.id].answers"
                  :name="formMqcQuestion.mcq.id"
                  id=""
                  cols="30"
                  rows="10"
                  class="w-100 my-3"
                ></textarea>
              </div>
              <div
                v-if="
                  formMqcQuestion.mcq.type === '3' &&
                  formMqcQuestion.mcq.listChild.length === 0
                "
                class="row justify-content-around my-3"
              >
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input
                      type="checkbox"
                      id="yes"
                      aria-label="Checkbox for following text input"
                    />
                    <label class="form-check-label" for="yes">Có</label>
                  </div>
                </div>
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input
                      id="no"
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                    />
                    <label class="form-check-label" for="yes">Không</label>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  formMqcQuestion.mcq.type === '2' &&
                  formMqcQuestion.mcq.listChild.length === 0
                "
                class="row justify-content-around my-3"
              ></div>
              <div
                v-for="(listChild, index) in formMqcQuestion.mcq.listChild"
                :key="listChild + index"
              >
                {{ listChild.question }}
                <div
                  v-if="listChild.type === '3'"
                  class="row justify-content-around my-3 form-check"
                >
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="inlineRadioOptions"
                      id="checkbox1"
                      value="rat yeu"
                    />
                    <label class="form-check-label" for="checkbox1"
                      >Rất yếu</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="inlineRadioOptions"
                      id="checkbox2"
                      value="yeu"
                    />
                    <label class="form-check-label" for="checkbox2">Yếu</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="inlineRadioOptions"
                      id="checkbox3"
                      value="trunh binh"
                    />
                    <label class="form-check-label" for="checkbox3"
                      >Trung bình</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="inlineRadioOptions"
                      id="checkbox4"
                      value="tot"
                    />
                    <label class="form-check-label" for="checkbox4">Tốt</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="inlineRadioOptions"
                      id="checkbox5"
                      value="rat-tot"
                    />
                    <label class="form-check-label" for="checkbox5"
                      >Rất tốt</label
                    >
                  </div>
                </div>
                <div
                  v-if="listChild.type === '2'"
                  class="row justify-content-around my-3 form-check"
                >
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      :name="listChild.id"
                      :id="listChild.id + formMqcQuestion.mcq.id + 1"
                      value="rat yeu"
                      v-model="answers[listChild.id].answers"
                    />
                    <label
                      class="form-check-label"
                      :for="listChild.id + formMqcQuestion.mcq.id + 1"
                      >Rất yếu</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      :name="listChild.id"
                      :id="listChild.id + formMqcQuestion.mcq.id + 2"
                      value="yeu"
                      v-model="answers[listChild.id].answers"
                    />
                    <label
                      class="form-check-label"
                      :for="listChild.id + formMqcQuestion.mcq.id + 2"
                      >Yếu</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      :name="listChild.id"
                      :id="listChild.id + formMqcQuestion.mcq.id + 3"
                      value="trunh binh"
                      v-model="answers[listChild.id].answers"
                    />
                    <label
                      class="form-check-label"
                      :for="listChild.id + formMqcQuestion.mcq.id + 3"
                      >Trung bình</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      :name="listChild.id"
                      :id="listChild.id + formMqcQuestion.mcq.id + 4"
                      value="tot"
                      v-model="answers[listChild.id].answers"
                    />
                    <label
                      class="form-check-label"
                      :for="listChild.id + formMqcQuestion.mcq.id + 4"
                      >Tốt</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      :name="listChild.id"
                      :id="listChild.id + formMqcQuestion.mcq.id + 5"
                      value="rat-tot"
                      v-model="answers[listChild.id].answers"
                    />
                    <label
                      class="form-check-label"
                      :for="listChild.id + formMqcQuestion.mcq.id + 5"
                      >Rất tốt</label
                    >
                  </div>
                </div>
                <div v-if="listChild.type.type === '1'">
                  <textarea
                    :name="listChild.id"
                    id=""
                    cols="30"
                    rows="10"
                    class="w-100 my-3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button
              @click="$router.go(-1)"
              type="button"
              class="btn btn-secondary w-25 mr-2"
            >
              Hủy
            </button>
            <button
              @click="createAnswerAsync()"
              type="button"
              class="btn btn-success w-25 ml-2"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../common/component-base/ComponentBase";
import AnswerServices from "../../services/answer/answerServices";
import AppConfig from "../../../src/app.config.json";
import CrudMixin from "../../helpers/mixins/crudMixin";
import SurveyFormServices from "../../services/surveyForm/surveyFormServices";
import { mapGetters } from "vuex";
export default {
  name: "AnswerSurveyComponent",
  extends: ComponentBase,
  components: {},
  mixins: [CrudMixin],
  props: ["formName", "surveyFormId"],
  data() {
    return {
      surveyForms: [],
      answers: {},
      isShow: false,
    };
  },
  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },
  async mounted() {
    this.surveyForms = await this.getSurveyFormByIdAsync();

    for (let i = 0; i <= this.surveyForms.formMqcQuestion.length - 1; i++) {
      if (this.surveyForms.formMqcQuestion[i].mcq.type === 0 || this.surveyForms.formMqcQuestion[i].mcq.listChild.length === 0) {
        this.answers[this.surveyForms.formMqcQuestion[i].mcq.id] = {
          studentId: this.userProfile.studentId,
          mcqId: this.surveyForms.formMqcQuestion[i].mcq.id,
          formId: this.surveyForms.surveyFormId,
          answers: "",
        };
      }

      for (let j = 0;j <= this.surveyForms.formMqcQuestion[i].mcq.listChild.length - 1;j++) {
        this.answers[this.surveyForms.formMqcQuestion[i].mcq.listChild[j].id] =
          {
            studentId: this.userProfile.studentId,
            mcqId: this.surveyForms.formMqcQuestion[i].mcq.listChild[j].id,
            formId: this.surveyForms.surveyFormId,
            answers: "",
          };
      }
    }
    let saveAnswer = await this.getAllAnswersAsync();
    if(saveAnswer.length !== 0){
      for(let i = 0; i <= saveAnswer.length -1 ; i++){
        this.answers[saveAnswer[i].mcqId] = saveAnswer[i];
      }
    }
    if (Object.values(this.answers).length !== 0) {
      this.isShow = true;
    }
  },
  methods: {
    async getSurveyFormByIdAsync() {
      this.showLoading();
      let api = new SurveyFormServices();
      let response = await api.getSurveyFormByIdAsync(this.surveyFormId); // Gọi Api
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

    // Call api delete SurveyForms
    async getAllAnswersAsync() {
      let filter = {
        formId: this.surveyFormId,
        studentId: this.userProfile.studentId,
      };
      this.showLoading();
      let api = new AnswerServices();
      let response = await api.getAllAnswersAsync(filter); // Gọi Api
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

    async createAnswerAsync() {
      var saveAnswer = Object.values(this.answers);
      this.showLoading();
      let api = new AnswerServices();
      let response = await api.createAnswerAsync(saveAnswer); // Gọi Api
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
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
  },
};
</script>

