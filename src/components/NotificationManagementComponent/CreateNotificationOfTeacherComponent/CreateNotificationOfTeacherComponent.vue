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
              <div v-if="selectObject == notifyObjectEnum.STUDENTS.value">
                <div class="font-weight-bold text-center px-2 py-2">
                  Thông báo sẽ gửi đến tất cả sinh viên mà bạn quản lý trong đợt thực tập
                </div>
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
import AppConfig from "../../../../src/app.config.json";
import teacherService from "../../../services/teacher/teacherServices";
import SelectStudentsObject from "./SelectStudentsObject.vue";
import NotificationViewModel from "../../../view-model/notification/notificationViewModel";
import NotificationService from "../../../services/notification/notificationServices";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages.vue";
import CKEditor from "ckeditor4-vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CreateNotificationOfTeacherComponent",
  extends: ComponentBase,
  components: {
    SelectPlan,
    SelectStudentsObject,
    AlertMessages,
    ckeditor: CKEditor.component,
  },
  data() {
    return {
      plans: [],
      notifyObjectEnum: {
        STUDENTS: {
          value: "STUDENTS",
          name: "Tất cả sinh viên",
        },
        EMAILSTUDENTS: {
          value: "EMAILSTUDENTS",
          name: "Chọn sinh viên"
        },
      },
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
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }
    await this.getPlansAsync();
  },

  computed: {
    checkInternshipCourseIdExist() {
      return !this.notifyRequest.notificationDto.internshipCourseId;
    },
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", {
      userProfile: "getUserInfo",
      tokenKey: "getTokenKey",
    }),
  },

  methods: {
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),
    async getUserProfile() {
      // Check: if has token => get profile else push to LoginPage
      if (this.tokenKey) {
        if (!this.userProfile || !this.userProfile.user) {
          await this.updateUserInfoDataAsync();
        }
      } else {
        if (this.$route.name !== "login") {
          this.$router.push({ name: "login" });
        }
      }
    },

    changeInternshipCourse($event) {
      this.notifyRequest.notificationDto.internshipCourseId = $event.id;
      this.notifyRequest.emails = [];
      this.selectObject = this.notifyObjectEnum.STUDENTS.value;
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
      if (this.selectObject == this.notifyObjectEnum.STUDENTS.value) {
        this.notifyRequest.emails = [];
        for (let element of this.students) {
          console.log(element.student.email);
          this.notifyRequest.emails.push(element.student.email);
        }
      }
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
      if (notifyObject == this.notifyObjectEnum.EMAILSTUDENTS.value) {
        await this.getStudentsAsync();
      }
    },

    async getStudentsAsync() {
      // Call Api
      this.showLoading();
      const api = new teacherService();

      const response = await api.getStudentsManagedByTeacherById(
        this.userProfile?this.userProfile.teacherId:''
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
