<template>
<BaseModal
  @mouse-click-outside="closeModal(false)"
  :modalName="`StudentManagementDetail`" 
  :isShow="isShow"
  size="lg">
  <div class="">
    <div class="form-group row" v-if="!student.id">
      <label for="name" class="col-md-4 col-sm-4 col-form-label">
        MSSV (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control"
        v-model="student.studentId" />
      </div>
    </div>

    <div class="form-group row" v-if="student.id">
      <label for="name" class="col-md-4 col-sm-4 col-form-label">
        MSSV (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" v-model="student.studentId" readonly/>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Họ (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" 
        v-model="student.firstName" />
      </div>
    </div>

    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">
        Tên đệm và tên (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" v-model="student.lastName" />
      </div>
    </div>

    <div class="form-group row" v-if="student.id">
      <label class="col-md-4 col-sm-4 col-form-label">
        Email (<span class="text--red">*</span>)
      </label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" v-model="student.email" readonly/>
      </div>
    </div>
    
    <div class="row">
      <div class="col-12">
        <div class="wrapCollapse">
          <div v-for="(faq, i) in faqs" :key="i">
            <dt>
              <a href="#" :class="{ active: currentFaq == i }" @click="openComponet(i)">
                {{ faq.title }}
              </a>
            </dt>
            <dd class="display-hidden" :class="{ active: currentFaq == i }">
              <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'lop'">
                <div class="form-group row" v-if="plans.length != 0">
                  <label class="col-md-4 col-sm-4 col-form-label">
                    Lớp (<span class="text--red">*</span>)
                  </label>
                  <div class="col-md-8 col-sm-8">
                    <div class="input-group mb-3">
                      <select class="form-control form-select form-select-class" v-model="student.classId">
                        <option v-for="(item, index) in classes" :key="index" :value="item.id">
                          {{ getInfoByCourseId(item.courseId, plans)? item.className + ' ('+ getInfoByCourseId(item.courseId, plans).internshipCourseName +')' : item.className }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'themLop'">
                <div class="form-group row">
                  <label class="col-md-4 col-sm-4 col-form-label">Tên lớp</label>
                  <div class="col-md-8 col-sm-8">
                    <input type="text" class="form-control" id="name" v-model="classroom.className" placeholder="Tên lớp cần tạo">
                  </div>
                </div>

                <div class="form-group row" v-if="plans.length != 0">
                  <label class="col-md-4 col-sm-4 col-form-label">Đợt</label>
                  <div class="col-md-6 col-sm-6">
                    <div class="input-group mb-3">
                      <select class="form-control form-select form-select-class" v-model="classroom.internshipCourseId">
                        <option v-for="(plan, index) in plans" :key="index" :value="plan.id">
                          {{ plan.internshipCourseName }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-2 col-sm-2">
                    <button class="btn btn-linkedin" @click="createClassAsync()">+<i
                        class="fa fa-book-reader"></i></button>
                  </div>
                  <div v-if="createClassLoading" role="status" aria-hidden="false" aria-label="Loading"
                    class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                </div>
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
    
    <div class="form-group row" v-if="!student.id">
      <label class="col-md-4 col-sm-4 col-form-label">Ngày sinh</label>
      <div class="col-md-8 col-sm-8">
        <DatePicker
          v-model="student.dayOfBirth"
          input-class="form-control brithday"
          :format="'DD/MM/YYYY'"
          type="date"
          :disabled-date="contrainInputDay"
          @focus="displayDateCloseConstraintDate()"
          class="w-100"
        ></DatePicker>
      </div>
    </div>

    <div class="form-group row" v-if="student.id">
      <label class="col-md-4 col-sm-4 col-form-label">Ngày sinh</label>
      <div class="col-md-8 col-sm-8">
        <input class="form-control brith-day" type="text"
          v-model="student.dayOfBirth" readonly>
      </div>
    </div>

    <div class="form-group row"
      v-if="student.id">
      <label class="col-md-4 col-sm-4 col-form-label">Trạng thái</label>
      <div class="col-md-8 col-sm-8">
        <div class="input-group mb-3">
          <select class="form-control form-select form-select-class" v-model="student.status">
            <option value="active">Hiển thị</option>
            <option value="unactive">Ẩn</option>
          </select>
        </div>
      </div>
    </div>

  </div>

  <template #header>
    <h5>{{student.id ? "Cập nhật sinh viên" : "Thêm mới sinh viên"}}</h5>
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
          class="btn btn-primary float-right ml-2">{{student.id ? "Cập nhật" : "Thêm mới"}}</button>
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
import StudentViewModel from "../../../view-model/student/studentViewModel"
import { ADD_STUDENT } from "../../../config/constant";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import ClassService from '../../../services/class/classServices'
import ClassViewModel from "../../../view-model/class/classViewModel"
import createUserMixin from "../../../helpers/mixins/createUserMixin";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
import moment from "moment";

export default {
  name: 'StudentManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
    DatePicker,
  },
  mixins: [ CrudMixin, createUserMixin ],

  data() {
    return {
      isShow: false,
      student: {
        firstName: '',
        lastName: '',
        studentId: '',
        status: '',
        email: '',
        dayOfBirth: null,
        classId: '',
        internshipStatus: '',
      },
      errorMessages: [],
      classroom: {},
      faqs: [
        {
          title: "Lớp",
          text: "lop",
        },
        {
          title: "Thêm mới lớp",
          text: "themLop",
        },
      ],
      currentFaq: 0,
      createClassLoading: false,
      dataForCreateUser: {
        username: "",
        name: "",
        surname: "",
        emailAddress: "",
      }
    }
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
    plans: {
      type: Array,
      default: null,
    },
    classes: {
      type: Array,
      default: null,
    },
    students: {
      type: Array,
      default: null,
    },
  },

  methods: {
    displayDateCloseConstraintDate() {
      let dob = moment().add(-18, "Y").toDate();
      dob.setDate((new Date().getDate()));
      dob.setMonth((new Date().getMonth()));
      dob.setHours(0, 0, 0, 0);
      this.$set(this.student, 'dayOfBirth', new Date(dob));
    },

    contrainInputDay(date) {
      const today = new Date();
      today.setFullYear(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
        0
      );
      return date > today;
    },

    getInfoObject(trainingSystemId, list) {
      return CrudMixin.methods.getInfo(trainingSystemId, list);
    },

    openComponet(i) {
      this.currentFaq = i;
    },

    getInfoByCourseId(courseId, list){
      if (!CrudMixin.methods.getInfoByCourseId(courseId, list)) {
        return '';
      }
      return CrudMixin.methods.getInfoByCourseId(courseId, list);
    },

    async createClassAsync() {
      let viewModel = new ClassViewModel();
      viewModel.setFields(this.classroom);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }
      this.classroom.status = "active";
      this.classroom.isDelete = "false";
      this.classroom.internshipStatus = "";
      this.createClassLoading = true;
      let api = new ClassService();
      let response = await api.createClassAsync(this.classroom);
      this.createClassLoading = false;
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.student.classId = response.data.id;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + ' lớp'
      );
      this.$emit("change-data-class");
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

    checkStudent(studentId){
      for(const index in this.students){
        if(studentId == this.students[index].student.studentId){
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            'Mã số sinh viên đã tồn tại'
          );
          return true;
        }
      }
      return false;
    },

    async createStudentAsync() {
      this.student.status = 'active';
      if(this.checkStudent(this.student.studentId)){
        return;
      }

      this.student.email = this.student.studentId + ADD_STUDENT.EMAIL;
      this.showLoading();
      let api = new StudentService();
      let response = await api.createStudentAsync(this.student);
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
        `${AppConfig.notification.content_created_success_default} ` + 
        `sinh viên ${this.student.firstName} ${this.student.lastName}`
      );
      this.closeModal(true);
    },  

    async updateStudentAsync() {
      this.showLoading();
      this.student.email = this.student.studentId + ADD_STUDENT.EMAIL;
      let api = new StudentService();
      let response = await api.updateStudentAsync(this.student);
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
        `${AppConfig.notification.content_updated_success_default} ` + 
        `sinh viên ${this.student.firstName} ${this.student.lastName}`
      );

        this.closeModal(true);
    },

    async save() {
      // validate
      let viewModel = new StudentViewModel();
      viewModel.setFields(this.student);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if (this.student.id === undefined) {
        //create
        await this.createStudentAsync();
      } else {        
        //update
        await this.updateStudentAsync();
      }
    },

  },
  watch: {
    data() {
      this.isShow = true;
      this.student = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import '../../../assets/scss/style.scss'

</style>
