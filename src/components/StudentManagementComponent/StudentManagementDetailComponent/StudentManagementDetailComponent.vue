<template src='./StudentManagementDetailComponent.html'>

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

export default {
  name: 'StudentManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ CrudMixin, createUserMixin ],

  data() {
    return {
      isShow: false,
      student: {},
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
        if(studentId == this.students[index].studentId){
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
        `${AppConfig.notification.content_created_success_default}`
      );
      this.mapDataCreateStudentToCreateAccount(this.student);
      this.closeModal(true);
    },

    async mapDataCreateStudentToCreateAccount(student){
      this.showLoading();
      //bắn event tạo account ngay đây truyền đi (teacher, TEACHER, 0)
      let createUserResponse = await createUserMixin.methods.eventCreateAccountWhenCreateStudentOrCreateTeacher(student, 'STUDENT', 0);
      this.showLoading(false);
      if(!createUserResponse.isOk) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          createUserResponse.errorMessages,
        );
      }
      // kết thúc tạo user
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
        `${AppConfig.notification.content_updated_success_default}`
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
@import './StudentManagementDetailComponent.scss';
.form-select-class{
  width: 100%;
  height: 35px;
}
</style>
