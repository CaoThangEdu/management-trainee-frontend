<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <header class="card-header">
          {{ "Thêm mới thông báo" }}
        </header>
        <div class="card-body">
          <form @submit.prevent>
            <div class="form-group row">
              <label for="title" class="col-md-4 col-sm-4 col-form-label">
                Tiêu đề (<span style="color: red">*</span>)
              </label>
              <div class="col-md-8 col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="notifyRequest.notificationDto.title"
                />
              </div>
            </div>

            <div class="form-group row">
              <label for="content" class="col-md-4 col-sm-4 col-form-label">
                Nội dung (<span style="color: red">*</span>)
              </label>
              <div class="col-md-8 col-sm-8">
                <ckeditor
                  v-model="notifyRequest.notificationDto.content"
                  style
                ></ckeditor>
              </div>
            </div>
            <div class="form-group row">
              <label for="receiver" class="col-md-4 col-sm-4 col-form-label">
                Đợt thực tập (<span style="color: red">*</span>)
              </label>
              <div class="col-md-8 col-sm-8">
                <SelectPlan
                  :plans="plans"
                  @change="changeInternshipCourse($event)"
                >
                </SelectPlan>
                <div
                  class="text--italic text--red"
                  v-if="!notifyRequest.notificationDto.internshipCourseId"
                >
                  Vui lòng chọn đợt trước khi chọn đối tượng
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="receiver" class="col-md-4 col-sm-4 col-form-label">
                Đối tượng (<span style="color: red">*</span>)
              </label>
              <div
                class="col-md-8 col-sm-8"
                :class="{
                  'disable-wapper-content': checkInternshipCourseIdExist,
                }"
              >
                <div class="group-radio__wrapper">
                  <div
                    class="form-group radio-object"
                    v-for="(notifyObject, indexNotify) in notifyObjectEnum"
                    :key="indexNotify + 'Notify'"
                  >
                    <div class="custom-control custom-radio">
                      <input
                        class="custom-control-input"
                        type="radio"
                        name="account-groups"
                        :value="notifyObject.value"
                        :id="notifyObject.value"
                        v-model="selectObject"
                        @change="changeRadioObject(notifyObject.value)"
                      />
                      <label
                        class="custom-control-label"
                        :for="notifyObject.value"
                        >{{ notifyObject.name }}</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row card">
              <div v-if="selectObject == notifyObjectEnum.ALL.value">
                <div class="font-weight-bold text-center px-2 py-2">
                  Thông báo sẽ gửi đến tất cả giáo viên và sinh viên trong đợt
                  thực tập
                </div>
              </div>
              <div v-if="selectObject == notifyObjectEnum.TEACHERS.value">
                <div class="font-weight-bold text-center px-2 py-2">
                  Thông báo sẽ gửi đến tất cả giáo viên trong đợt thực tập
                </div>
              </div>
              <div v-if="selectObject == notifyObjectEnum.STUDENTS.value">
                <div class="font-weight-bold text-center px-2 py-2">
                  Thông báo sẽ gửi đến tất cả sinh viên trong đợt thực tập
                </div>
              </div>
              <div v-if="selectObject == notifyObjectEnum.CLASSID.value">
                <div class="font-weight-bold text-left px-2 py-2">
                  Thông báo sẽ gửi đến lớp được chọn bên dưới
                </div>
                <select-classes-object
                  :classes="classes"
                  @send-classes-id="sendClassId"
                  :selectObject="selectObject"
                  :notifyObjectEnum="notifyObjectEnum"
                />
              </div>
              <div v-if="selectObject == notifyObjectEnum.EMAILTEACHERS.value">
                <div class="font-weight-bold text-left px-2 py-2">
                  Thông báo sẽ gửi đến giáo viên được chọn bên dưới
                </div>
                <SelectTeachersObject
                  :teachers="teachers"
                  @send-teachers-email="sendTeachersEmail"
                  :selectObject="selectObject"
                  :notifyObjectEnum="notifyObjectEnum"
                />
              </div>
              <div v-if="selectObject == notifyObjectEnum.EMAILSTUDENTS.value">
                <div class="font-weight-bold px-2 py-2">
                  Thông báo sẽ gửi đến sinh viên được chọn bên dưới
                </div>
                <select-students-object
                  :students="students"
                  @send-students-email="sendStudentsEmail"
                  :selectObject="selectObject"
                  :notifyObjectEnum="notifyObjectEnum"
                />
              </div>
            </div>
            <div class="form-group">
              <AlertMessages :messages="errorMessages" />
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
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase";
import PlanService from "../../../services/plan/planServices";
import SelectPlan from "../../common/form/select-plan/SelectPlan.vue";
import { NOTIFY_OBJECT_ENUM } from "../../../config/constant";
import AppConfig from "../../../../src/app.config.json";
import SelectTeachersObject from "./SelectTeachersObject.vue";
import TeacherService from "../../../services/teacher/teacherServices";
import StudentService from "../../../services/student/studentServices";
import SelectStudentsObject from "./SelectStudentsObject.vue";
import ClassService from "../../../services/class/classServices";
import SelectClassesObject from "./SelectClassesObject.vue";
import NotificationViewModel from "../../../view-model/notification/notificationViewModel";
import NotificationService from "../../../services/notification/notificationServices";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages.vue";
import CKEditor from "ckeditor4-vue";

export default {
  name: "CreateNotificationManagementComponent",
  extends: ComponentBase,
  components: {
    SelectPlan,
    SelectTeachersObject,
    SelectStudentsObject,
    SelectClassesObject,
    AlertMessages,
    ckeditor: CKEditor.component,
  },
  data() {
    return {
      plans: [],
      notifyObjectEnum: NOTIFY_OBJECT_ENUM,
      selectObject: "ALL",
      internshipCourseId: "",
      teachers: [],
      filterTeacher: {
        lastName: "",
        facultyId: "",
        status: "active",
      },
      students: [],
      filterStudent: {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
      },
      classes: [],
      filterClass: {
        internshipCourseId: "",
        className: "",
        status: "active",
      },
      notifyRequest: {
        notificationDto: new NotificationViewModel().fields,
        groupOfPeople: "",
        emails: [],
      },
      errorMessages: [],
    };
  },

  async mounted() {
    await this.getPlansAsync();
  },

  computed: {
    checkInternshipCourseIdExist() {
      return !this.notifyRequest.notificationDto.internshipCourseId;
    },
  },

  methods: {
    changeInternshipCourse($event) {
      this.notifyRequest.notificationDto.internshipCourseId = $event.id;
      this.notifyRequest.emails = [];
      this.selectObject = this.notifyObjectEnum.ALL.value;
    },

    sendClassId(classesId) {
      this.notifyRequest.emails = classesId;
    },

    sendTeachersEmail(emailTeachers) {
      this.notifyRequest.emails = emailTeachers;
    },

    sendStudentsEmail(emailStudents) {
      this.notifyRequest.emails = emailStudents;
    },

    validationNotifyRequest() {
      let objectEmailOrId = [
        this.notifyObjectEnum.CLASSID.value,
        this.notifyObjectEnum.EMAILTEACHERS.value,
        this.notifyObjectEnum.EMAILSTUDENTS.value,
      ];
      this.notifyRequest.groupOfPeople = objectEmailOrId.includes(
        this.selectObject
      )
        ? ""
        : this.selectObject;
      if (
        !this.notifyRequest.groupOfPeople &&
        this.notifyRequest.emails.length == 0
      ) {
        this.errorMessages.push("Vui lòng chọn đối tượng gửi mail");
      }
    },

    async save() {
      let viewModel = new NotificationViewModel();
      viewModel.setFields(this.notifyRequest.notificationDto);
      // validation model
      this.errorMessages = viewModel.isValid();
      this.validationNotifyRequest();
      if (this.errorMessages.length > 0) {
        return;
      }
      this.showLoading();
      let api = new NotificationService();
      let response = await api.createNotificationAsync(this.notifyRequest);
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
        `${AppConfig.notification.content_created_success_default}` +
          " thông báo"
      );
    },

    async changeRadioObject(notifyObject) {
      this.notifyRequest.emails = [];
      if (notifyObject == this.notifyObjectEnum.CLASSID.value) {
        await this.getClassesFilterAsync();
        return;
      }

      if (notifyObject == this.notifyObjectEnum.EMAILTEACHERS.value) {
        await this.getTeachersAsync();
      }

      if (notifyObject == this.notifyObjectEnum.EMAILSTUDENTS.value) {
        await this.getStudentsAsync();
      }
    },

    async getClassesFilterAsync() {
      this.filterClass.internshipCourseId =
        this.notifyRequest.notificationDto.internshipCourseId;
      // Call Api
      this.showLoading();
      const api = new ClassService();
      const response = await api.getClassesFilterAsync(this.filterClass);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classes = response.data;
    },

    async getStudentsAsync() {
      this.filterStudent.internshipCourseId =
        this.notifyRequest.notificationDto.internshipCourseId;
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(this.filterStudent);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data;
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

    async getTeachersAsync() {
      // Call Api
      this.showLoading();
      const api = new TeacherService();
      const response = await api.getTeachersAsync(this.filterTeacher);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.teachers = response.data;
    },
  },
};
</script>

<style lang="scss">
.group-radio__wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.radio-object {
  display: inline-block;
  width: 33%;
}
</style>
