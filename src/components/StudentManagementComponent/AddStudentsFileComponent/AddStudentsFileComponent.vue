<template>
  <BaseModal
    @mouse-click-outside="closeModal(false)"
    :modalName="`AddStudentsFileComponent`"
    :isShow="isShowAddFile"
    size="lg"
  >
    <div class="">
      <div class="row">
        <div class="col-12">
          <div class="wrapCollapse">
            <div v-for="(faq, i) in faqs" :key="i">
              <dt>
                <div class="title-collapse">
                  <a
                    href="#"
                    :class="{ active: currentFaq == i }"
                    @click="openComponet(i)"
                  >
                    {{ faq.title }}
                  </a>
                </div>
              </dt>
              <dd class="display-hidden" :class="{ active: currentFaq == i }">
                <div
                  class="col-xl-12 col-md-12 col-sm-12 col-12"
                  v-if="faq.text == 'lop'"
                >
                  <div class="form-group row" v-if="plans.length != 0">
                    <label class="col-md-4 col-sm-4 col-form-label">
                      Lớp (<span class="text--red">*</span>)
                    </label>
                    <div class="col-md-8 col-sm-8">
                      <div class="input-group mb-3">
                        <select
                          class="form-control form-select form-select-class"
                          v-model="classIdSelected"
                        >
                          <option
                            v-for="(item, index) in classes"
                            :key="index"
                            :value="item.id"
                          >
                            {{
                              getInfoByCourseId(item.courseId, plans)
                                ? item.className +
                                  " (" +
                                  getInfoByCourseId(item.courseId, plans)
                                    .internshipCourseName +
                                  ")"
                                : item.className
                            }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="col-xl-12 col-md-12 col-sm-12 col-12"
                  v-if="faq.text == 'themLop'"
                >
                  <div class="form-group row">
                    <label class="col-md-4 col-sm-4 col-form-label"
                      >Tên lớp</label
                    >
                    <div class="col-md-8 col-sm-8">
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        v-model="classroom.className"
                        placeholder="Tên lớp cần tạo"
                      />
                    </div>
                  </div>

                  <div class="form-group row" v-if="plans.length != 0">
                    <label class="col-md-4 col-sm-4 col-form-label">Đợt</label>
                    <div class="col-md-6 col-sm-6">
                      <div class="input-group mb-3">
                        <select
                          class="form-control form-select form-select-class"
                          v-model="classroom.internshipCourseId"
                        >
                          <option
                            v-for="(plan, index) in plans"
                            :key="index"
                            :value="plan.id"
                          >
                            {{ plan.internshipCourseName }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-2 col-sm-2">
                      <button
                        class="btn btn-linkedin"
                        @click="createClassAsync()"
                      >
                        +<i class="fa fa-book-reader"></i>
                      </button>
                    </div>
                    <div
                      v-if="createClassLoading"
                      role="status"
                      aria-hidden="false"
                      aria-label="Loading"
                      class="spinner-border text-primary"
                      style="width: 3rem; height: 3rem;"
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-md-4 col-sm-4 col-form-label">Chọn file excel</label>
        <div class="col-md-8 col-sm-8">
          <div class="input-group mb-3">
            <input
              type="file"
              class="btn btn-secondary float-right btn-add-file"
              @change="previewFiles"
            />
          </div>
        </div>
      </div>
    </div>

    <template #header>
      <h5>Thêm mới sinh viên</h5>
      <button class="close text--red" @click="closeModal(false)">
        &times;
      </button>
    </template>

    <template #footer>
      <div
        class="form-inline form-group col-md-12 pr-0"
        v-show="errorMessages.length > 0"
      >
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <AlertMessages :messages="errorMessages" />
        </div>
      </div>

      <div class="form-inline form-group col-md-12 pr-0">
        <div class="col-form-label col-md-4 col-sm-4"></div>
        <div class="col-md-8 col-sm-8 pl-0 pr-0">
          <button @click="save" class="btn btn-primary float-right ml-2">
            Thêm mới
          </button>
          <button class="btn btn-dark float-right" @click="closeModal(false)">
            Hủy
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import BaseModal from "../../common/base-modal/BaseModal";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import StudentService from "../../../services/student/studentServices";
import AppConfig from "../../../../src/app.config.json";
import PlanService from "../../../services/plan/planServices";
import XLSX from "xlsx";
import ClassService from "../../../services/class/classServices";
import ClassViewModel from "../../../view-model/class/classViewModel";
import StudentViewModel from "../../../view-model/student/studentViewModel";
import { ADD_STUDENT } from "../../../config/constant";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import createUserMixin from "../../../helpers/mixins/createUserMixin";

export default {
  name: "AddStudentsFileComponent",
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [CrudMixin, createUserMixin],
  data() {
    return {
      isShowAddFile: false,
      students: [],
      studentsForCreate: [],
      studentsCallApi: [],
      studentLengthBanDau: 0,
      metaDataFile: [],
      classIdSelected: null,
      errorMessages: [],
      classroom: {},
      filter: {
        keyword: "",
        isDelete: false,
        status: "active",
        classId: "",
      },
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
      classCreated: null,
      createClassLoading: false,
      dataForCreateUser: {
        username: "",
        name: "",
        surname: "",
        emailAddress: "",
      },
      dataForCreateUsers: [],
    };
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
  },

  async mounted() {
    await this.getStudentsAsync();
  },

  methods: {
    getInfoByCourseId(courseId, list) {
      if (!CrudMixin.methods.getInfoByCourseId(courseId, list)) {
        return "";
      }
      return CrudMixin.methods.getInfoByCourseId(courseId, list);
    },

    openComponet(i) {
      this.currentFaq = i;
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
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classCreated = response.data.id;
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` + " lớp"
      );
      this.$emit("change-data-class");
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    getInfoObjectByName(className, list) {
      return CrudMixin.methods.getInfoObjectByName(className, list);
    },

    getClassId(className) {
      for (const x in this.classes) {
        if (this.classes[x].className === className) {
          return this.classes[x].id;
        }
      }
    },

    closeModal(changeData) {
      this.isShowAddFile = false;

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async getStudentsAsync() {
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(this.filter);
      this.showLoading(false);
      this.studentLengthBanDau = response.data.length;

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentsCallApi = response.data;
    },

    async previewFiles(e) {
      var files = e.target.files,
        f = files[0];
      var reader = new FileReader();
      var vm = this;

      reader.onload = async function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        vm.metaDataFile = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
    },

    async getPlansAsync() {
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlansAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.plans = response.data.items;
    },

    async pressKeyEnter() {
      await this.save();
    },

    async save() {
      if (this.classCreated) {
        this.classIdSelected = this.classCreated;
      }
      let courseDaChonId = this.getInfoObject(
        this.classIdSelected,
        this.classes
      ).courseId;
      this.students = this.metaDataFile;
      let studentLengthCallApi = this.studentLengthBanDau;
      var idClass = this.classIdSelected;
      for (let i = 0; i < this.students.length; i++) {
        let vtSV = i + 1;
        for (const index in this.studentsCallApi) {
          if (
            this.students[i].studentId == this.studentsCallApi[index].studentId
          ) {
            this.showNotifications(
              "error",
              `${AppConfig.notification.title_default}`,
              "Mã số sinh viên thứ " +
                vtSV +
                " đã tồn tại!" +
                "<br/> Đã thêm được " +
                i +
                " sinh viên"
            );
            return;
          }
        }

        // Kiểm tra lớp đã trùng với lớp đã chọn hay chưa
        let classOfStudent = this.getInfoObjectByName(
          this.students[i].classId,
          this.classes
        );
        if (classOfStudent) {
          // nếu tồn tại lớp
          this.students[i].classId = classOfStudent.classId;
          // nếu lớp bằng lớp đã chọn
          if (classOfStudent.id == idClass) {
            this.students[i].classId = idClass;
          } else {
            this.students[i].classId = classOfStudent.id;
          }
        } else {
          this.classroom.courseId = courseDaChonId;
          this.classroom.className = this.students[i].classId;
          this.classroom.status = "active";
          this.classroom.isDelete = false;
          let api = new ClassService();
          let response = await api.createClassAsync(this.classroom);
          this.showLoading(false);
          if (response.isOK) {
            this.showNotifications(
              "success",
              `${AppConfig.notification.title_default}`,
              `${AppConfig.notification.content_created_success_default}` +
                " Lớp " +
                this.students[i].classId
            );
            this.students[i].classId = response.data.id;
          }

          // this.students[i].classId = this.getInfoObjectByName(this.students[i].classId, this.classes).id;
        }
        this.students[i].status = "active";
        this.students[i].email = this.students[i].studentId + ADD_STUDENT.EMAIL;
        // validate
        let viewModel = new StudentViewModel();
        viewModel.setFields(this.students[i]);
        this.errorMessages = viewModel.isValid();

        if (this.errorMessages.length > 0) {
          return;
        }
        this.studentsForCreate.push(this.students[i]);
        this.closeModal(true);
      }

      this.showLoading();
      let api = new StudentService();
      let response = await api.createStudentsAsync(this.studentsForCreate);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }

      this.showLoading(false);

      await this.getStudentsAsync();
      if (studentLengthCallApi == this.studentLengthBanDau) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới thất bại"
        );
      } else {
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_created_success_default}`
        );
      }
      await this.getStudentsAsync();
    },
  },

  watch: {
    data() {
      this.isShowAddFile = true;
    },
  },
};
</script>

<style lang="scss">
@import '../../../assets/scss/style.scss'
</style>
