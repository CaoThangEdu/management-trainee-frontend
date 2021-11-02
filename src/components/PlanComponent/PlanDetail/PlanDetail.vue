<template>
  <div class="row">
    <div class="col-12">
      <div class="mb-4"
        v-if="!plan.id">
        <PlanningStepsComponent
          :isActiveStep="isActiveStep" />
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <header class="card-header">
              {{ isCreate ? "Thêm mới kế hoạch" : "Chỉnh sửa kế hoạch" }}
            </header>
            <div class="card-body">
              <form @submit.prevent>
                <div class="form-row">
                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Ngày bắt đầu
                      (<span class="text--red">*</span>)
                    </label>
                    <DatePicker
                      v-model="plan.startDay"
                      input-class="form-control"
                      :format="'DD/MM/YYYY'"
                      type="date"
                      :default-value="new Date()"
                      :disabled-date="hidePastDates"
                      class="w-100"
                    ></DatePicker>                  
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label class="mr-4">Ngày kết thúc 
                      (<span class="text--red">*</span>)
                    </label>
                    <DatePicker
                      v-model="plan.endDay"
                      input-class="form-control"
                      :format="'DD/MM/YYYY'"
                      type="date"
                      :disabled-date="displayBetweenFromDateAndPastDates"
                      class="w-100"
                    ></DatePicker>
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Mô tả (<span style="color: red">*</span>) </label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="plan.description"
                    />
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6">
                    <label>Tên khóa (<span class="text--red">*</span>) </label>
                    <input
                      class="w-100 form-control"
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="2018"
                      max=""
                      v-model="plan.courseName"
                    />
                  </div>

                  <div class="form-group col-sm-12 col-md-4 col-lg-4">
                    <div class="wrapCollapse">
                      <div v-for="(faq, i) in faqFaculties" :key="i">
                        <dt>
                          <div class="title-collapse">
                            <a
                              @submit.prevent
                              :class="{
                                active:
                                  currentFaqTrainingSystem == i,
                              }"
                              @click="openComponentFaculty(i)"
                            >
                              {{ faq.title }}
                            </a>
                          </div>
                        </dt>
                        <dd
                          class="display-hidden"
                          :class="{ active: currentFaqFaculty == i }"
                        >
                          <div
                            class="col-xl-12 col-md-12 col-sm-12 col-12"
                            v-if="faq.text == 'khoa'"
                          >
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                              v-if="!plan.id"
                            >
                              <label>Khoa
                                (<span class="text--red">*</span>)
                              </label>
                              <div class="input-group mb-3">
                                <select
                                  class="
                                    form-control form-select form-select-class
                                  "
                                  v-model="facultyId"
                                  @change="filterTrainingSystems"
                                >
                                  <option
                                    v-for="(item, index) in faculties"
                                    :key="index"
                                    :value="item.id"
                                  >
                                    {{ item.facultyName }}
                                  </option>
                                </select>
                              </div>
                              <div class="text--italic text--red"
                                v-if="!facultyId"
                                >
                                Vui lòng chọn khoa trước khi chọn Hệ đào tạo
                              </div>
                            </div>
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                              v-if="
                                plan.id &&
                                faculties !=0 &&
                                careers.length != 0 &&
                                trainingSystems.length != 0
                              "
                            >
                              <label>Khoa
                                (<span class="text--red">*</span>)
                              </label>
                              <div class="input-group mb-3">
                                <select
                                  class="
                                    form-control form-select form-select-class
                                  "
                                  v-model="facultyId"
                                  @change="filterTrainingSystems"
                                >
                                  <option
                                    v-for="(item, index) in faculties"
                                    :key="index"
                                    :value="item.id"
                                  >
                                    {{ item.facultyName }}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div
                            class="col-xl-12 col-md-12 col-sm-12 col-12"
                            v-if="faq.text == 'themKhoa'"
                          >
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                            >
                              <label
                                >Tên khoa (<span class="text--red"
                                  >*</span
                                >)
                              </label>
                              <div class="row">
                                <div class="col-md-10 col-sm-10">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="name"
                                    v-model="
                                      keyFaculty.facultyName
                                    "
                                  />
                                </div>
                                <div class="col-md-2 col-sm-2">
                                  <button
                                    class="btn btn-primary"
                                    @click="createFacultyAsync()"
                                  >
                                    <em class="fas fa-plus"></em>
                                  </button>
                                </div>
                              </div>

                              <div
                                v-if="createTrainingLoading"
                                role="status"
                                aria-hidden="false"
                                aria-label="Loading"
                                class="spinner-border text-primary"
                                style="width: 3rem; height: 3rem"
                              ></div>
                            </div>
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>

                  <div class="form-group col-sm-12 col-md-4 col-lg-4"
                    :class="{
                      'disable-wapper-content': checkFacultyIdExist,
                    }">
                    <div class="wrapCollapse">
                      <div v-for="(faq, i) in faqTrainingSystems" :key="i">
                        <dt>
                          <div class="title-collapse">
                            <a
                              @submit.prevent
                              :class="{
                                active:
                                  currentFaqTrainingSystem == i,
                              }"
                              @click="openComponentTrainingSystem(i)"
                            >
                              {{ faq.title }}
                            </a>
                          </div>
                        </dt>
                        <dd
                          class="display-hidden"
                          :class="{ active: currentFaqTrainingSystem == i }"
                        >
                          <div
                            class="col-xl-12 col-md-12 col-sm-12 col-12"
                            v-if="faq.text == 'he'"
                          >
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                              v-if="!plan.id"
                            >
                              <label>Hệ đào tạo
                                (<span class="text--red">*</span>)
                              </label>
                              <div class="input-group mb-3">
                                <select
                                  class="
                                    form-control form-select form-select-class
                                  "
                                  v-model="trainingSystemId"
                                  @change="filterCareer"
                                >
                                  <option
                                    v-for="(item, index) in trainingSystemsFilter"
                                    :key="index"
                                    :value="item.id"
                                  >
                                    {{ item.trainingSystemName }}
                                  </option>
                                </select>
                              </div>
                              <div class="text--italic text--red"
                                v-if="!trainingSystemId"
                                >
                                Vui lòng chọn Hệ đào tạo trước khi chọn Ngành
                              </div>
                            </div>
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                              v-if="
                                plan.id &&
                                careers.length != 0 &&
                                trainingSystems.length != 0
                              "
                            >
                              <label>Hệ đào tạo
                                (<span class="text--red">*</span>)
                              </label>
                              <div class="input-group mb-3">
                                <select
                                  class="
                                    form-control form-select form-select-class
                                  "
                                  v-model="trainingSystemId"
                                  @change="filterCareer"
                                >
                                  <option
                                    v-for="(item, index) in trainingSystemsFilter"
                                    :key="index"
                                    :value="item.id"
                                  >
                                    {{ item.trainingSystemName }}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div
                            class="col-xl-12 col-md-12 col-sm-12 col-12"
                            v-if="faq.text == 'themHe'"
                          >
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                            >
                              <label
                                >Tên hệ đào tạo (<span class="text--red"
                                  >*</span
                                >)
                              </label>
                              <div class="row">
                                <div class="col-md-10 col-sm-10">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="name"
                                    v-model="
                                      trainingSystem.trainingSystemName
                                    "
                                  />
                                </div>
                                <div class="col-md-2 col-sm-2">
                                  <button
                                    class="btn btn-primary"
                                    @click="createTrainingSystemAsync()"
                                  >
                                    <em class="fas fa-plus"></em>
                                  </button>
                                </div>
                              </div>

                              <div
                                v-if="createTrainingLoading"
                                role="status"
                                aria-hidden="false"
                                aria-label="Loading"
                                class="spinner-border text-primary"
                                style="width: 3rem; height: 3rem"
                              ></div>
                            </div>
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>

                  <div class="form-group col-sm-12 col-md-4 col-lg-4"
                    :class="{
                      'disable-wapper-content': checkTrainingSystemIdExist,
                    }">
                    <div class="wrapCollapse">
                      <div v-for="(faq, i) in faqs" :key="i">
                        <dt>
                          <div class="title-collapse">
                            <a
                              @submit.prevent
                              :class="{ active: currentFaq == i }"
                              @click="openComponet(i)"
                            >
                              {{ faq.title }}
                            </a>
                          </div>
                        </dt>
                        <dd
                          class="display-hidden"
                          :class="{ active: currentFaq == i }"
                        >
                          <div
                            class="col-xl-12 col-md-12 col-sm-12 col-12"
                            v-if="faq.text == 'nganhDaoTao'"
                          >
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                            >
                              <label>Ngành
                                (<span class="text--red">*</span>)
                              </label>
                              <div class="input-group mb-3">
                                <select
                                  class="
                                    form-control
                                    form-select
                                    form-select-class
                                  "
                                  v-model="plan.careersId"
                                >
                                  <option
                                    v-for="(item, index) in careersFilter"
                                    :key="index"
                                    :value="item.id"
                                  >
                                    {{ item.careersName }}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div
                            class="col-xl-12 col-md-12 col-sm-12 col-12"
                            v-if="faq.text == 'themNganh'"
                          >
                            <div
                              class="form-group col-sm-12 col-md-12 col-lg-12"
                            >
                              <label>
                                Tên ngành (<span class="text--red">*</span>)
                              </label>
                              <div class="row">
                                <div class="col-md-10 col-sm-10">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="name"
                                    v-model="career.careersName"
                                    placeholder="Nhập tên ngành cần tạo"
                                  />
                                </div>
                                <div class="col-md-2 col-sm-2">
                                  <button
                                    class="btn btn-primary"
                                    @click="createCareerAsync()"
                                  >
                                    <em class="fas fa-plus"></em>
                                  </button>
                                </div>
                              </div>
                              <div
                                v-if="createCareerLoading"
                                role="status"
                                aria-hidden="false"
                                aria-label="Loading"
                                class="spinner-border text-primary"
                                style="width: 3rem; height: 3rem"
                              ></div>
                            </div>
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6"
                    v-if="planId"
                  >
                    <label
                      >Trạng thái (<span class="text--red">*</span>)
                    </label>
                    <div class="input-group mb-3">
                      <select
                        class="form-control form-select form-select-class"
                        v-model="plan.status"
                      >
                        <option value="new">Mới lập</option>
                        <option value="start">Bắt đầu thực tập</option>
                        <option value="point">Chấm điểm</option>
                        <option value="end">Kết thúc thực tập</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group col-sm-12 col-md-6 col-lg-6"
                    v-if="planId">
                    <div class="button-continue">
                      <router-link
                        class="btn-continue"
                        :to="{ name: 'them-sv-cua-dot', params: { guid: planId } }"
                      >
                        Tiếp tục thêm sinh viên
                      </router-link>
                    </div>                    
                  </div>
                  <div class="form-group col-sm-12 col-md-12 col-lg-12 text-center">
                    <button
                      @click="$router.go(-1)"
                      id="cancel"
                      class="btn btn-dark mr-2"
                    >
                      Hủy
                    </button>
                    <button @click="save" id="submit" class="btn btn-success">
                      Lưu
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        :data="confirmPlan"
        @agree="changeConfirmPlan"
        :message="isNotification"
      >
      </ConfirmDialog>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase";
import PlanService from "../../../services/plan/planServices";
import PlanViewModel from "../../../view-model/plan/planViewModel";
import AppConfig from "../../../../src/app.config.json";
import CareerService from "../../../services/career/careerServices";
import CareerViewModel from "../../../view-model/career/careerViewModel";
import TrainingSystemService from "../../../services/trainingsystem/trainingsystemServices";
import TrainingSystemViewModel from "../../../view-model/trainingsystem/trainingsystemViewModel";
import PlanningStepsComponent from "../../../components/planningStepsComponent/planningStepsComponent.vue";
import localStorageMixin from "../../../helpers/mixins/localStorageMixin";
import ConfirmDialog from "../../../components/common/confirm-dialog/ConfirmDialog.vue";
import crudMixin from "../../../helpers/mixins/crudMixin";
import FacultyServices from "../../../services/faculty/facultyServices";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
import moment from "moment";

export default {
  name: "PlanDetail",
  props: ["guid"],
  extends: ComponentBase,
  components: {
    PlanningStepsComponent,
    ConfirmDialog,
    DatePicker,
  },
  mixins: [localStorageMixin, crudMixin],
  data() {
    return {
      isCreate: true,
      plan: {
        internshipCourseName: '',
        startDay: new Date(),
        endDay: moment()
          .add(+4, "M")
          .toDate(),
        description: '',
        careersId: '',
        courseName: '',
        status: 'new',
        facultyId: '',
      },
      errorMessages: [],
      isThemNganh: false,
      career: {},
      trainingSystemId: '',
      trainingSystems: [],
      confirmPlan: {},
      careers: [],
      careerId: null,
      careerNamePlan: null,
      faqs: [
        {
          title: "Ngành",
          text: "nganhDaoTao",
        },
        {
          title: "Thêm mới ngành",
          text: "themNganh",
        },
      ],
      faqTrainingSystems: [
        {
          title: "Hệ đào tạo",
          text: "he",
        },
        {
          title: "Thêm mới hệ đào tạo",
          text: "themHe",
        },
      ],
      faqFaculties: [
        {
          title: "Khoa",
          text: "khoa",
        },
        {
          title: "Thêm mới khoa",
          text: "themKhoa",
        },
      ],
      currentFaqFaculty:0,
      currentFaq: 0,
      currentFaqTrainingSystem: 0,
      careersFilter: [],
      createCareerLoading: false,
      createTrainingLoading: false,
      trainingSystem: {},
      isActiveStep: "1",
      planId: null,
      planName: null,
      plans: [],
      isNotification: null,
      faculties: [],
      facultyId: '',
      keyFaculty:{
        facultyName:""
      },
      trainingSystemsFilter: [],
      facultyName: '',
    };
  },

  async mounted() {
    await this.getTrainingSystemsFilterAsync();
    await this.getCareersFilterAsync();
    await this.getPlansAsync();
    await this.getFacultiesFilterAsync();
    if (!this.guid) {
      return;
    }
    this.plans = this.plans.filter((plan) => plan.id != this.guid);
    this.isCreate = false;
    await this.getPlanByIdAsync(this.guid);
    this.planId = this.plan.id;
    this.trainingSystemId = this.getInfoObject(
      this.plan.careersId,
      this.careers
    ).trainingSystemId;
    this.plan.startDay =  new Date(this.plan.startDay);
    this.plan.endDay = new Date(this.plan.endDay);
    this.facultyId = this.plan.facultyId;
    this.careersFilter = this.careers.filter(
      (career) => career.trainingSystemId == this.trainingSystemId
    );
    this.trainingSystemsFilter = this.trainingSystems.filter(
      (trainingSystem) => trainingSystem.facultyId == this.facultyId
    );
    let idPlanStore = localStorageMixin.methods.getLocalStorage("ID_PLAN");
    if (!idPlanStore) {
      return;
    }
    if (!this.planId) {
      this.planId = idPlanStore;
      await this.getPlanByIdAsync(this.planId);
    }
  },

  methods: {
    async getFacultiesFilterAsync() {
      let facultyFilter = {
        facultyName:"",
      };
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

    hidePastDates(date) {
      return date > this.plan.endDay || date < new Date().setHours(0, 0, 0, 0);
    },

    displayBetweenFromDateAndPastDates(date) {
      const day = new Date(this.plan.startDay);
      return date < day;
    },

    async getPlanByIdAsync(guid) {
      // Call Api
      this.showLoading();
      const api = new PlanService();
      const response = await api.getPlanByIdAsync(guid);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plan = response.data.internshipCourseDto;
      this.facultyName = response.data.facultyName;
      this.facultyId = this.plan.facultyId;
    },

    async getTrainingSystemsFilterAsync() {
      let filterTrainingSystem = {
        trainingSystemName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService();

      const response = await api.getTrainingSystemsFilterAsync(
        filterTrainingSystem
      );
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

    async getCareersFilterAsync() {
      let filterCareer = {
        trainingSystemId: "",
        careersName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new CareerService();

      const response = await api.getCareersFilterAsync(filterCareer);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careers = response.data;
    },

    confirmChangePlan(plan) {
      this.confirmPlan = plan;
    },

    openComponet(i) {
      this.currentFaq = i;
    },
    openComponentTrainingSystem(i) {
      this.currentFaqTrainingSystem = i;
    },
    openComponentFaculty(i) {
      this.currentFaqFaculty = i;
    },

    filterCareer() {
      this.careersFilter = this.careers.filter(
        (career) => career.trainingSystemId == this.trainingSystemId
      );
      this.plan.careersId = '';
    },

    filterTrainingSystems() {
      this.trainingSystemsFilter = this.trainingSystems.filter(
        (trainingSystem) => trainingSystem.facultyId == this.facultyId
      );
      this.trainingSystemId = '';
      this.plan.careersId = '';
    },

    async createCareerAsync() {
      this.career.trainingSystemId = this.trainingSystemId;
      let viewModel = new CareerViewModel();
      viewModel.setFields(this.career);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages.join('<br />')
        );
        return;
      }
      this.career.status = "active";
      this.createCareerLoading = true;
      let api = new CareerService();
      let response = await api.createCareerAsync(this.career);
      this.createCareerLoading = false;
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plan.careersId = response.data.id;
      this.careerNamePlan = response.data.careersName;
      this.openComponet(0);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + " ngành"
      );
      this.careers.push(response.data);
      this.careersFilter = this.careers.filter(
        (career) => career.trainingSystemId == this.trainingSystemId
      );
    },

    async changeConfirmPlan() {
      this.plan.internshipCourseName =
        this.plan.internshipCourseName +
        "-" + 2;
      if (!this.isCreate) {
        this.showLoading();
        let api = new PlanService();
        let response = await api.updatePlanAsync(this.plan);
        this.showLoading(false);
        if (!response.isOK) {
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            response.errorMessages
          );
          return;
        }
        this.planId = response.data.id;
        this.$router.push({
          name: "them-sv-cua-dot",
          params: { guid: `${this.planId}` },
        });

        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_updated_success_default}`
        );
        return;
      }
      this.showLoading();
      let api = new PlanService();
      let response = await api.createPlanAsync(this.plan);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.planId = response.data.id;
      localStorageMixin.methods.setLocalStorage("ID_PLAN", this.planId);
      this.$router.push({
        name: "them-sv-cua-dot",
        params: { guid: `${this.planId}` },
      });

      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + " đợt"
      );
    },

    checkExistencePlan(planName) {
      const result = this.plans.find(
        ({ internshipCourseName }) => internshipCourseName === planName
      );
      if (result) {
        return true;
      }
      return false;
    },

    async createTrainingSystemAsync() {
      this.trainingSystem.status = "active";
      this.trainingSystem.facultyId = this.facultyId;
      let viewModel = new TrainingSystemViewModel();
      viewModel.setFields(this.trainingSystem);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages.join('<br />')
        );
        return;
      }
      this.createTrainingLoading = true;
      let api = new TrainingSystemService();
      let response = await api.createTrainingSystemAsync(this.trainingSystem);
      this.createTrainingLoading = false;
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystemId = response.data.id;
      this.trainingSystems.push(response.data);
      this.trainingSystemsFilter = this.trainingSystems.filter(
        (trainingSystem) => trainingSystem.facultyId == this.facultyId
      );
      this.openComponentTrainingSystem(0);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + " hệ"
      );
    },

    themNganh() {
      this.isThemNganh = true;
    },

    getTrainingSysId() {
      this.trainingSystemId = this.getInfoObject(
        this.getInfoObject(this.careerId, this.careers).trainingSystemId,
        this.trainingSystems
      ).id;
    },

    getInfoObject(id, list) {
      return crudMixin.methods.getInfo(id, list);
    },

    async pressKeyEnter() {
      await this.save();
    },

    async createPlanAsync() {
      this.plan.status = "new";
      if (!this.careerNamePlan) {
        this.careerNamePlan = this.getInfoObject(
          this.careerId,
          this.careers
        ).careersName;
      }
      this.plan.internshipCourseName =
        this.getInfoObject(this.trainingSystemId, this.trainingSystems)
          .trainingSystemName +
        "-" +
        this.getInfoObject(this.plan.careersId, this.careers).careersName +
        "-" +
        this.plan.courseName + 
        ` (${crudMixin.methods.convertTime(this.plan.startDay, "DD/MM/YYYY")} - ` + 
        `${crudMixin.methods.convertTime(this.plan.endDay, "DD/MM/YYYY")})`;
      let checkPlan = this.checkExistencePlan(this.plan.internshipCourseName);
      if (checkPlan) {
        if (
          this.checkExistencePlan(
            this.plan.internshipCourseName +
              "-" +
              crudMixin.methods.convertTime(this.plan.startDay, "DD/MM")
          )
        ) {
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            "Đợt " +
              this.plan.internshipCourseName +
              "-" +
              crudMixin.methods.convertTime(this.plan.startDay, "DD/MM") +
              " đã tồn tại! Vui lòng chọn ngày khác để tạo đợt thực tập mới"
          );
          return;
        }
        this.confirmChangePlan(this.plan);
        this.isNotification = `Bạn có chắc chắn muốn thêm đợt thực tập mới khi trước đó đã tồn tại
          tên đợt '${this.plan.internshipCourseName}'?`;
        return;
      }

      this.showLoading();
      let api = new PlanService();
      let response = await api.createPlanAsync(this.plan);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.planId = response.data.id;
      localStorageMixin.methods.setLocalStorage("ID_PLAN", this.planId);
      this.$router.push({
        name: "them-sv-cua-dot",
        params: { guid: `${this.planId}` },
      });

      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + " đợt"
      );
    },

    async updatePlanAsync() {
      if (this.careerNamePlan) {
        this.careerNamePlan = this.getInfoObject(
          this.careerId,
          this.careers
        ).careersName;
      }
      let planNameNew =
        this.getInfoObject(this.trainingSystemId, this.trainingSystems)
          .trainingSystemName +
        "-" +
        this.getInfoObject(this.plan.careersId, this.careers).careersName +
        "-" +
        this.plan.courseName + 
        ` (${crudMixin.methods.convertTime(this.plan.startDay, "DD/MM/YYYY")} - ` + 
        `${crudMixin.methods.convertTime(this.plan.endDay, "DD/MM/YYYY")})`;
      if (
        this.plan.internshipCourseName !=
        planNameNew +
          "-" +
          crudMixin.methods.convertTime(this.plan.startDay, "DD/MM")
      ) {
        this.plan.internshipCourseName = planNameNew;
      }
      let checkPlan = this.checkExistencePlan(this.plan.internshipCourseName);
      if (checkPlan) {
        if (
          this.checkExistencePlan(
            this.plan.internshipCourseName +
              "-" +
              crudMixin.methods.convertTime(this.plan.startDay, "DD/MM")
          )
        ) {
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            "Đợt " +
              this.plan.internshipCourseName +
              "-" +
              crudMixin.methods.convertTime(this.plan.startDay, "DD/MM") +
              " đã tồn tại! Vui lòng chọn ngày khác để cập nhật đợt thực tập"
          );
          return;
        }
        this.confirmChangePlan(this.plan);
        this.isNotification = `Bạn có chắc chắn muốn cập nhật đợt thực tập mới khi trước đó đã tồn tại
          tên đợt '${this.plan.internshipCourseName}'?`;
        return;
      }
      this.showLoading();
      let api = new PlanService();
      let response = await api.updatePlanAsync(this.plan);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.$router.push({
        name: "them-sv-cua-dot",
        params: { guid: `${this.planId}` },
      });

      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
    },

    async createFacultyAsync() {
      if(this.keyFaculty.facultyName === ""){
         return this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Vui lòng nhập tên khoa."
        );
       }
      this.showLoading();
      let api = new FacultyServices();
      let response = await api.createFacultyAsync(this.keyFaculty);
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.faculties.push(response.data);
      this.facultyId = response.data.id;
      this.trainingSystemsFilter = this.trainingSystems.filter(
        (trainingSystem) => trainingSystem.facultyId == this.facultyId
      );
      this.openComponentFaculty(0);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}`
      );
    },

    async save() {
      this.plan.facultyId = this.facultyId;
      // validate
      let viewModel = new PlanViewModel();
      viewModel.setFields(this.plan);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages.join('<br />')
        );
        return;
      }
      if (this.plan.id === undefined) {
        await this.createPlanAsync();
      } else {
        await this.updatePlanAsync();
      }
    },
  },
  
  computed: {
    checkFacultyIdExist() {
      return !this.facultyId;
    },

    checkTrainingSystemIdExist() {
      return !this.trainingSystemId;
    },
  },
};
</script>