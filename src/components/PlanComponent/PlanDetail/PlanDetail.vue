<template>
<div class="row">
  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
    <PlanningStepsComponent :isActiveStep="isActiveStep" />
  </div>
  <div class="col-12" v-if="planId">
    <div class="button-continue">
      <router-link class="btn-continue"
        :to="{name:'them-sv-cua-dot', params: { guid: planId } }" >
        Tiếp tục thêm sinh viên của đợt {{ plan.internshipCourseName }}
      </router-link>
    </div>
  </div>
  <div class="col-12">
    <div class="card">
      <header class="card-header">
        {{ isCreate ? "Thêm mới kế hoạch" : "Chỉnh sửa kế hoạch" }}
      </header>
      <div class="card-body">
        <form @submit.prevent>
          <div class="form-group row">
            <label for="example-datetime-local-input" class="col-md-4 col-sm-4 col-form-label">Ngày bắt đầu
            </label>
            <div class="col-md-8 col-sm-8">
              <input class="form-control" type="date" format="yyyy-mm-dd" value="2021-05-03" 
              v-model="plan.startDay">
            </div>
          </div>

          <div class="form-group row">
            <label for="example-datetime-local-input" class="col-md-4 col-sm-4 col-form-label">
              Ngày kết thúc
            </label>
            <div class="col-md-8 col-sm-8">
              <input class="form-control" type="date" v-model="plan.endDay">
            </div>
          </div>

          <div class="form-group row">
            <label for="name" class="col-md-4 col-sm-4 col-form-label">
              Mô tả (<span style="color: red;">*</span>)
            </label>
            <div class="col-md-8 col-sm-8">
              <input type="text" class="form-control" id="name" v-model="plan.description" />
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="wrapCollapse">
                <div v-for="(faq, i) in faqTrainingSystems" :key="i">
                  <dt>
                    <a @submit.prevent :class="{ activeTrainingSystem: currentFaqTrainingSystem == i }" @click="openComponentTrainingSystem(i)">
                      {{ faq.title }}
                    </a>
                  </dt>
                  <dd class="display-hidden" :class="{ active: currentFaqTrainingSystem == i }">
                    <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'he'">
                      <div class="form-group row" v-if="!plan.id">
                        <label class="col-md-4 col-sm-4 col-form-label">Hệ đào tạo</label>
                        <div class="col-md-8 col-sm-8">
                          <div class="input-group mb-3">
                            <select class="form-control form-select form-select-class" v-model="trainingSystemId" @change="filterCareer">
                              <option v-for="(item, index) in trainingSystems" :key="index" :value="item.id">
                                {{ item.trainingSystemName }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="form-group row" v-if="plan.id && careers.length != 0 && trainingSystems.length != 0">
                        <label class="col-md-4 col-sm-4 col-form-label">Hệ đào tạo</label>
                        <div class="col-md-8 col-sm-8">
                          <div class="input-group mb-3">
                            <select class="form-control form-select form-select-class" 
                              v-model="trainingSystemId" @change="filterCareer">
                              <option v-for="(item, index) in trainingSystems" :key="index" :value="item.id">
                                {{ item.trainingSystemName }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'themHe'">
                      <div class="form-group row">
                        <label class="col-md-4 col-sm-4 col-form-label">
                          Tên hệ đào tạo (<span class="text--red">*</span>)
                        </label>
                        <div class="col-md-6 col-sm-6">
                          <input type="text" class="form-control" id="name" v-model="trainingSystem.trainingSystemName" />
                        </div>
                        <div class="col-md-2 col-sm-2">
                          <button class="btn btn-vimeo" @click="createTrainingSystemAsync()">+<i class="fa fa-praying-hands" style="color: white;"></i></button>
                        </div>
                        <div v-if="createTrainingLoading" role="status" aria-hidden="false" aria-label="Loading" class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                      </div>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="wrapCollapse">
                <div v-for="(faq, i) in faqs" :key="i">
                  <dt>
                    <a @submit.prevent :class="{ active: currentFaq == i }" @click="openComponet(i)">
                      {{ faq.title }}
                    </a>
                  </dt>
                  <dd class="display-hidden" :class="{ active: currentFaq == i }">
                    <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'nganhDaoTao'">
                      <div class="form-group row">
                        <label class="col-md-4 col-sm-4 col-form-label">Ngành</label>
                        <div class="col-md-8 col-sm-8">
                          <div class="input-group mb-3">
                            <select class="form-control form-select form-select-class" v-model="plan.careersId">
                              <option v-for="(item, index) in careersFilter" :key="index" :value="item.id">
                                {{ item.careersName }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'themNganh'">
                      <div class="form-group row">
                        <label class="col-md-4 col-sm-4 col-form-label">
                          Tên ngành (<span class="text--red">*</span>)
                        </label>
                        <div class="col-md-6 col-sm-6">
                          <input type="text" class="form-control" id="name" v-model="career.careersName" placeholder="Nhập tên ngành cần tạo" />
                        </div>
                        <div class="col-md-2 col-sm-2">
                          <button class="btn btn-linkedin" @click="createCareerAsync()">+<i class="fa fa-chalkboard"></i></button>
                        </div>
                        <div v-if="createCareerLoading" role="status" aria-hidden="false" aria-label="Loading" class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                      </div>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-md-4 col-sm-4 col-form-label">Tên khóa</label>
            <div class="col-md-6 col-sm-6">
              <input class="w-100" type="number" id="quantity" name="quantity" min="2018" max="" v-model="plan.courseName">
            </div>
          </div>

          <div class="form-group row">
            <label class="col-md-4 col-sm-4 col-form-label">Trạng thái</label>
            <div class="col-md-8 col-sm-8">
              <div class="input-group mb-3">
                <select class="form-control form-select form-select-class" v-model="plan.status">
                  <option value="new">Mới lập</option>
                  <option value="start">Bắt đầu thực tập</option>
                  <option value="point">Chấm điểm</option>
                  <option value="end">Kết thúc thực tập</option>
                </select>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button @click="$router.go(-1)" id="cancel" class="btn btn-primary mr-2">Hủy</button>
            <button @click="save" id="submit" class="btn btn-success">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase";
// import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import PlanService from "../../../services/plan/planServices";
import PlanViewModel from "../../../view-model/plan/planViewModel";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import CareerService from "../../../services/career/careerServices";
import CareerViewModel from "../../../view-model/career/careerViewModel";
import TrainingSystemService from "../../../services/trainingsystem/trainingsystemServices";
import TrainingSystemViewModel from "../../../view-model/trainingsystem/trainingsystemViewModel";
import PlanningStepsComponent from "../../../components/planningStepsComponent/planningStepsComponent.vue";
import localStorageMixin from "../../../helpers/mixins/localStorageMixin";

export default {
  name: "PlanDetail",
  props: ["guid"],
  extends: ComponentBase,
  components: {
    PlanningStepsComponent,
  },
  mixins: [localStorageMixin],
  data() {
    return {
      isCreate: true,
      plan: {},
      errorMessages: [],
      isThemNganh: false,
      career: {},
      trainingSystemId: null,
      trainingSystems: [],
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
      currentFaq: 0,
      currentFaqTrainingSystem: 0,
      careersFilter: [],
      createCareerLoading: false,
      createTrainingLoading: false,
      trainingSystem: {},
      isActiveStep:"1",
      planId: null,
      planName: null,
    }
  },

  async mounted() {
    await this.getTrainingSystemsFilterAsync();
    await this.getCareersFilterAsync();
    if (!this.guid) {
      return;
    }
    this.isCreate = false;
    await this.getPlanByIdAsync(this.guid);
    this.planId = this.plan.id;
    this.trainingSystemId = this.getInfoObject(this.plan.careersId, this.careers).trainingSystemId;
    this.filterCareer();
    let idPlanStore = localStorageMixin.methods.getLocalStorage('ID_PLAN');
    if (!idPlanStore) {
      return;
    }
    if(!this.planId) {
      this.planId = idPlanStore;
      await this.getPlanByIdAsync(this.planId);
    }
  },

  methods: {
    async getPlanByIdAsync(guid){
      // Call Api
      this.showLoading();
      const api = new PlanService()
      const response = await api.getPlanByIdAsync(guid);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plan = response.data;
    },

    async getTrainingSystemsFilterAsync() {
      let filterTrainingSystem = {
        trainingSystemName: "",
        isDelete: false,
        status: "active",
      }
      // Call Api
      this.showLoading();
      const api = new TrainingSystemService()

      const response = await api.getTrainingSystemsFilterAsync(filterTrainingSystem);
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
    
    async getCareersFilterAsync(){
      let filterCareer = {
        trainingSystemId: "",
        isDelete: false,
        careersName: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new CareerService()

      const response = await api.getCareersFilterAsync(filterCareer);
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

    openComponet(i) {
      this.currentFaq = i;
    },
    openComponentTrainingSystem(i) {
      this.currentFaqTrainingSystem = i;
    },

    filterCareer() {
      this.careersFilter = this.careers.filter(career => career.trainingSystemId == this.trainingSystemId);
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
          this.errorMessages
        );
        return;
      }
      this.career.status = "active";
      this.career.isDelete = "false";
      this.createCareerLoading = true;
      let api = new CareerService();
      let response = await api.createCareerAsync(this.career);
      this.createCareerLoading = false;
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.careerId = response.data.id;
      this.careerNamePlan = response.data.careersName;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + ' ngành'
      );
      await this.getCareersFilterAsync();
      this.filterCareer();
    },

    async createTrainingSystemAsync() {
      this.trainingSystem.status = "active";
      this.trainingSystem.isDelete = "false";
      let viewModel = new TrainingSystemViewModel();
      viewModel.setFields(this.trainingSystem);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages
        );
        return;
      }
      this.createTrainingLoading = true;
      let api = new TrainingSystemService();
      let response = await api.createTrainingSystemAsync(this.trainingSystem);
      this.createTrainingLoading = false;
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.trainingSystemId = response.data.id;
      await this.getTrainingSystemsFilterAsync();
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + ' hệ'
      );
    },

    themNganh() {
      this.isThemNganh = true;
    },

    getTrainingSysId() {
      this.trainingSystemId = this.getInfoObject(
        this.getInfoObject(this.careerId, this.careers).trainingSystemId
        , this.trainingSystems).id;
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async pressKeyEnter() {
      await this.save();
    },

    async createPlanAsync() {
      this.showLoading();
      if (!this.careerNamePlan){
        this.careerNamePlan = this.getInfoObject(this.careerId, this.careers).careersName;
      }
      this.plan.internshipCourseName = this.getInfoObject(this.trainingSystemId, this.trainingSystems).trainingSystemName
        + "-" + this.getInfoObject(this.plan.careersId, this.careers).careersName + "-" + this.plan.courseName;
      let api = new PlanService();
      let response = await api.createPlanAsync(this.plan);
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.planId = response.data.id;
      localStorageMixin.methods.setLocalStorage('ID_PLAN', this.planId);

      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + ' đợt'
      );
    },

    async updatePlanAsync() {
      this.showLoading();
      if (this.careerNamePlan){
        this.careerNamePlan = this.getInfoObject(this.careerId, this.careers).careersName
      }
      this.plan.internshipCourseName = this.getInfoObject(this.trainingSystemId, this.trainingSystems).trainingSystemName
        + "-" + this.getInfoObject(this.plan.careersId, this.careers).careersName + "-" + this.plan.courseName;
        
      let api = new PlanService();
      let response = await api.updatePlanAsync(this.plan);
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
    },

    async save() {
      // validate
      let viewModel = new PlanViewModel();
      viewModel.setFields(this.plan);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          this.errorMessages
        );
        return;
      }
      if(this.plan.id === undefined){
        await this.createPlanAsync();
      } else{
        await this.updatePlanAsync();
      }
    },
  },

  watch: {
    data() {
      if(Object.values(this.plan).length != 0) {
        // this.getTrainingSysId();
        // this.filterCareer();
      }
    }
  }
}
</script>

<style>

</style>
