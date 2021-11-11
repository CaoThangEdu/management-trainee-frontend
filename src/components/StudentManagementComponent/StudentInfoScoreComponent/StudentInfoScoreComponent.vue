<template>
<BaseModal
  @mouse-click-outside="closeModal(false)"
  :modalName="`StudentManagementDetail`" 
  :isShow="isShow"
  size="lg">
  <div>
    <div class="mb-2" v-if="student.student">
      <div>
        MSSV:
        <span class="font-weight-bold">{{ student.student.studentId }}</span>
      </div>
      <div>
        Họ tên:
        <span class="font-weight-bold">
          {{ student.student.firstName + ' ' + student.student.lastName }}
        </span>
      </div>
      <div>
        Lớp:
        <span class="font-weight-bold">
          {{ student.className }}
        </span>
      </div>
      <div>
        Đợt thực tập:
        <span class="font-weight-bold">
          {{ student.internshipCourseName }}
        </span>
      </div>
    </div>
    <div class="form-group row" v-if="!student.id">
      <label for="name" class="col-md-4 col-sm-4 col-form-label">
        Điểm (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="number" class="form-control"
          min="0" max="10"
          @keypress="isNumber"
          v-model="scoreStudentRequest.score" />
      </div>
    </div>
  </div>

  <template #header>
    <h5>Chấm điểm cho sinh viên</h5>
    <button class="close text--red" @click="closeModal(false)">&times;</button>
  </template>

  <template #footer>
    <div class="form-inline form-group col-md-12 pr-0"
      v-show="errorMessages.length > 0">
      <div class="col-form-label col-md-4 col-sm-4"></div>
      <div class="col-md-8 col-sm-8 pl-0 pr-0">
        <AlertMessages :messages="errorMessages" />
      </div>
    </div>

    <div class="form-inline form-group col-md-12 pr-0">
      <div class="col-form-label col-md-4 col-sm-4"></div>
      <div class="col-md-8 col-sm-8 pl-0 pr-0">
        <button
          @click="save"
          class="btn btn-primary float-right ml-2">Chấm điểm</button>
        <button class="btn btn-dark float-right" @click="closeModal(false)">Hủy</button>
      </div>
    </div>
  </template>
</BaseModal>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import { TIME_LINE_ENUM } from "../../../config/constant";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import TimlineService from "../../../services/timeline/timelineServices";

export default {
  name: 'StudentInfoScoreComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ CrudMixin ],

  data() {
    return {
      isShow: false,
      student: {},
      errorMessages: [],
      scoreStudentRequest: {
        internshipCourseId: "",
        score: 0,
        studentId: "",
      },
      timelineEnum: TIME_LINE_ENUM,
      timeLines: [],
    }
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  methods: {
    async getTimeLinesByInternshipCourseIdAsync() {
      let filterTimeLine = {
        timeLineName: "",
        internshipCourseId: this.student.internshipCourseId,
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new TimlineService();

      const response = await api.getTimeLinesByInternshipCourseIdAsync(filterTimeLine);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.timeLines = response.data;
    },

    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.student = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },
    async save() {
      this.scoreStudentRequest.studentId = this.student.student.id;
      this.scoreStudentRequest.internshipCourseId = this.student.internshipCourseId;
      let timelineActive = this.timeLines.find(timeline => timeline.isActive);
      if (timelineActive.value != this.timelineEnum[this.timelineEnum.length - 2].value) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          `Đợt thực tập <strong>${this.student.internshipCourseName}</strong> chưa đến giai đoạn chấm điểm`
        );
        return
      }
      // validate
      this.showLoading();
      let api = new StudentService();
      let response = await api.scoreStudentAsync(this.scoreStudentRequest);
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
        'Chấm điểm thành công cho ' + 
        `sinh viên ${this.student.student.firstName} ${this.student.student.lastName}`
      );
      this.closeModal(true);
    },
  },
  watch: {
    async data() {
      this.isShow = true;
      this.student = this.data;
      this.scoreStudentRequest.score = this.data.score.score;
      await this.getTimeLinesByInternshipCourseIdAsync();
    }
  }
}
</script>

<style lang='scss'>
@import '../../../assets/scss/style.scss';
</style>
