<template>
  <div class="row">
    <div class="col-12">
      <div>
        <PlanningStepsComponent :isActiveStep="isActiveStep" />
      </div>
      <div class="row mt-4">
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
              Danh sách lớp của đợt
              <strong>"{{ plan.internshipCourseName }}"</strong>
              <button
                class="btn btn-info float-right"
                @click="goToAssignment()"
              >
                Đi đến phân công
              </button>
            </header>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead class="">
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Tên lớp</th>
                      <th scope="col" class="text-center">
                        Số sinh viên trong lớp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(classItem, index) in classes" :key="index">
                      <th scope="row">{{ index + 1 }}</th>
                      <th scope="row">{{ classItem.className }}</th>
                      <th scope="row" class="text-center">
                        {{ sumStuentInClass(classItem.id) }}
                      </th>
                    </tr>
                    <tr v-show="classes == null || classes.length === 0">
                      <th colspan="5" class="text-left">
                        Không có dữ liệu nào được tìm thấy.
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
              Danh sách sinh viên
            </header>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead class="">
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">MSSV</th>
                      <th scope="col">Tên sinh viên</th>
                      <th scope="col">Lớp</th>
                      <th scope="col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in pageOfItems" :key="index">
                      <th scope="row">{{ index + 1 }}</th>
                      <td>{{ item.studentId }}</td>
                      <td>
                        {{ item.firstName + " " + item.lastName }}
                      </td>
                      <td
                        v-if="
                          classes.length != 0 &&
                          getInfoObject(item.classId, classes)
                        "
                      >
                        {{ getInfoObject(item.classId, classes).className }}
                      </td>
                      <td>{{ item.email }}</td>
                    </tr>
                    <tr
                      v-show="pageOfItems == null || pageOfItems.length === 0"
                    >
                      <th colspan="5" class="text-left">
                        Không có dữ liệu nào được tìm thấy.
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              class="card-footer d-flex justify-content-center text--blue"
              v-show="pageOfItems.length !== 0"
            >
              <div
                class="form-group d-flex page-size-group mb-0 mr-2"
                v-if="studentOfInInternshipCourse.length != 0"
              >
                <JwPagination
                  :items="studentOfInInternshipCourse"
                  @changePage="onChangePage"
                  :labels="customLabels"
                  :pageSize="10"
                >
                </JwPagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <header class="card-header h5 mb-0">
              <span class="text--red" v-if="teachers.length == 0">
                Bạn vui lòng thêm giáo viên cho khoa
              </span>
              <strong>"{{ facultyName }}"</strong>
            </header>
            <div class="card-body">
              <div class="form-group row font-weight-bold mb-2">
                <label class="col-12 col-form-label">
                  Tổng số giáo viên trong khoa là: {{ teachers.length }} giáo
                  viên
                </label>
              </div>
              <div class="form-group row mb-2">
                <label class="col-md-4 col-sm-4 col-form-label"
                  >Chọn file excel</label
                >
                <div class="col-md-8 col-sm-8">
                  <div class="input-group">
                    <input
                      type="file"
                      class="btn btn-secondary float-right btn-add-file"
                      @change="previewFilesTeachers"
                      accept="application/vnd.ms-excel"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group row mb-0">
                <label class="col-md-4 col-sm-4 col-form-label"></label>
                <div class="col-md-8 col-sm-8">
                  <div class="input-group">
                    <button
                      @click="saveCreateTeachers"
                      class="btn btn-primary float-right"
                    >
                      Thêm mới giáo viên
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <header class="card-header">
              Thêm mới sinh viên của đợt
              <strong>"{{ plan.internshipCourseName }}"</strong>
            </header>
            <!-- <div class="row">
            <div class="col-12">
              <div class="wrapCollapse">
                <div v-for="(faq, i) in faqs" :key="i">
                  <dt>
                    <a @submit.prevent :class="{ active: currentFaq == i }" @click="openComponet(i)">
                      {{ faq.title }}
                    </a>
                  </dt>
                  <dd class="display-hidden" :class="{ active: currentFaq == i }">
                    <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'lop'">
                      <div class="form-group row">
                        <label class="col-md-4 col-sm-4 col-form-label">
                          Lớp (<span class="text--red">*</span>)
                        </label>
                        <div class="col-md-8 col-sm-8">
                          <div class="input-group mb-3">
                            <select class="form-control form-select form-select-class" v-model="classIdSelected">
                              <option v-for="(item, index) in classes" :key="index" :value="item.id">
                                {{ item.className }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-12 col-md-12 col-sm-12 col-12" v-if="faq.text == 'themLop'">
                      <div class="form-group row">
                        <label class="col-md-4 col-sm-4 col-form-label">Tên lớp</label>
                        <div class="col-md-6 col-sm-6">
                          <input type="text" class="form-control" id="name" v-model="classroom.className" placeholder="Tên lớp cần tạo">
                        </div>
                        <div class="col-md-2 col-sm-2">
                          <button class="btn btn-linkedin" @click="createClassAsync()">+<i class="fa fa-book-reader"></i></button>
                        </div>
                        <div v-if="createClassLoading" role="status"
                          aria-hidden="false" aria-label="Loading"
                          class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                      </div>

                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div> -->
            <div class="form-group row mt-3">
              <label class="col-md-4 col-sm-4 col-form-label ml-3"
                >Chọn file excel</label
              >
              <div class="col-md-6 col-sm-6">
                <div class="input-group mb-3">
                  <input
                    type="file"
                    class="btn btn-secondary float-right btn-add-file"
                    @change="previewFiles"
                    accept="application/vnd.ms-excel"
                  />
                </div>
              </div>
            </div>
            <div class="text-center mb-4">
              <router-link
                :to="{ name: 'ds-ke-hoach' }"
                class="btn btn-dark mr-2"
                >Hủy</router-link
              >
              <button @click="save" id="submit" class="btn btn-success">
                Lưu
              </button>
            </div>
          </div>
          <ConfirmDialogCreateStudent
            :data="confirmCreateStudentExist"
            @agree="createStudentExist"
            @cancel="createStudentNotExist"
            :dataDisplay="studentExistInDB"
          ></ConfirmDialogCreateStudent>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase.vue";
import StudentService from "../../../services/student/studentServices";
import AppConfig from "../../../../src/app.config.json";
import PlanService from "../../../services/plan/planServices";
import XLSX from "xlsx";
import ClassService from "../../../services/class/classServices";
import ClassViewModel from "../../../view-model/class/classViewModel";
import StudentViewModel from "../../../view-model/student/studentViewModel";
import ConfirmDialogCreateStudent from "../../../components/common/confirm-dialog/ConfirmDialogCreateStudent";
import { ADD_STUDENT } from "../../../config/constant";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import PlanningStepsComponent from "../../../components/planningStepsComponent/planningStepsComponent.vue";
import createUserMixin from "../../../helpers/mixins/createUserMixin";
import TeacherService from "../../../services/teacher/teacherServices";
import JwPagination from 'jw-vue-pagination';

export default {
  name: "AddStudentsFileByPlan",
  extends: ComponentBase,
  mixins: [CrudMixin, createUserMixin],
  components: {
    PlanningStepsComponent,
    ConfirmDialogCreateStudent,
    JwPagination,
  },
  data() {
    return {
      isShowAddFile: false,
      students: [],
      studentsForCreate: [],
      studentsCallApi: [],
      studentLengthBanDau: 0,
      metaDataFile: [],
      metaDataFileTeacher: [],
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
      classes: [],
      plan: {},
      planName: null,
      isActiveStep: "2",
      classInNameFile: "",
      confirmCreateStudentExist: {},
      studentNoExistInDB: [],
      studentExistInDB: [],
      studentLengthCallApi: 0,
      teachers: [],
      teachersForCreate: [],
      teachersCreate: [],
      facultyName: "",
      pageOfItems: [],
      studentOfInInternshipCourse: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
    };
  },
  props: {
    guid: {
      type: String,
      default: "",
    },
  },

  async mounted() {
    await this.getStudentsAsync();
    await this.getClassesFilterAsync();
    await this.getPlanByIdAsync(this.guid);
    await this.getTeachersInInternshipCourse();
    let listClassId = [];
    this.classes = this.classes.filter(
      (classroom) => {
        listClassId.push(classroom.id);
        return classroom.internshipCourseId == this.guid;
      }
    );
    this.studentOfInInternshipCourse = this.studentsCallApi.filter(
      (student) =>  listClassId.includes(student.classId)
    );
  },

  created() {
    localStorage.removeItem("ID_PLAN");
  },

  methods: {
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    goToAssignment() {
      if (this.teachers.length == 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          `Bạn vui lòng thêm giáo viên cho khoa ${this.facultyName}`
        );
        return;
      }
      this.$router.push({
        name: "phan-cong-dot",
        params: { internshipCourseId: this.guid },
      });
    },
    async previewFilesTeachers(e) {
      var files = e.target.files,
        f = files[0];
      var reader = new FileReader();
      var vm = this;
      reader.onload = async function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        vm.metaDataFileTeacher = XLSX.utils.sheet_to_json(worksheet);
        vm.metaDataFileTeacher.forEach(function (element) {
          element.status = "active";
          element.facultyId = "facultyId";
        });
      };
      reader.readAsArrayBuffer(f);
    },

    async createTeachersAsync() {
      this.showLoading();
      let api = new TeacherService();
      let response = await api.createTeachersAsync(this.teachersForCreate);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return false;
      }
      return true;
    },

    async saveCreateTeachers() {
      this.teachersForCreate = [];
      this.teachersCreate = this.metaDataFileTeacher;
      for (let i in this.teachersCreate) {
        if(!this.teachersCreate[i].email || !this.teachersCreate[i].lastName
          || !this.teachersCreate[i].firstName || !this.teachersCreate[i].phoneNumber ){
          return this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            "Thêm mới giáo viên thất bại<br/ >File thêm không đúng định dạng!"
          );
        }
        // duyệt danh sách teacher từ file
        this.teachersCreate[i].facultyId = this.plan.facultyId;
        this.teachersForCreate.push(this.teachersCreate[i]);
      }

      let createUserResponse = await this.createTeachersAsync();
      this.showLoading(false);
      if (!createUserResponse) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới giáo viên thất bại"
        );
      } else {
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_created_success_default} giáo viên`
        );
        await this.getTeachersInInternshipCourse();
      }
    },

    async getTeachersInInternshipCourse() {
      // Call Api
      this.showLoading();
      const api = new TeacherService();
      const response = await api.getTeachersInInternshipCourse({
        internshipCourseId: this.guid,
      });
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

    sumStuentInClass(classId) {
      if (!this.studentsCallApi) {
        return 0;
      }
      return this.studentsCallApi.reduce((total, student) => {
        return student.classId == classId ? total + 1 : total;
      }, 0);
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
    },

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
      this.classroom.internshipCourseId = this.guid;
      this.classroom.status = "active";
      this.classroom.isDelete = "false";
      let viewModel = new ClassViewModel();
      viewModel.setFields(this.classroom);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }
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
      await this.getClassesFilterAsync();
      this.classes = this.classes.filter(
        (classroom) => classroom.internshipCourseId == this.guid
      );
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

    async getStudentsAsync() {
      let studentFilter = {
        keyword: "",
        classId: "",
        internshipCourseId: this.guid,
        status: "active",
        isDelete: false,
      };
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(studentFilter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.studentLengthBanDau = response.data.length;
      this.studentsCallApi = response.data;
    },

    async previewFiles(e) {
      var files = e.target.files,
        f = files[0];
      var reader = new FileReader();
      var vm = this;

      reader.onload = async function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {
          type: "array",
        });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        vm.metaDataFile = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
    },

    async getClassesFilterAsync() {
      let classFilter = {
        internshipCourseId: "",
        isDelete: false,
        className: "",
        status: "active",
      };
      // Call Api
      this.showLoading();
      const api = new ClassService();

      const response = await api.getClassesFilterAsync(classFilter);
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

    showConfirmCreateStudentExist(item) {
      this.confirmCreateStudentExist = { item: item };
    },

    async createStudentExist() {
      await this.createStudentAfterWhileReadAsync(this.studentsForCreate);
    },

    async createStudentNotExist() {
      if (this.studentNoExistInDB.length == 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới sinh viên thất bại<br/ >Do bị trùng file đã được thêm trước đó"
        );
        return;
      }
      await this.createStudentAfterWhileReadAsync(this.studentNoExistInDB);
    },

    async createStudentAfterWhileReadAsync(students) {
      let response = false;
      if (this.studentsForCreate.length != 0) {
        this.showLoading();
        let api = new StudentService();
        response = await api.createStudentsAsync(students);
        this.showLoading(false);
      }
      if (!response || !response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages ?? "Thêm mới sinh viên thất bại"
        );
        return;
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default}` +
          " sinh viên"
      );
      this.metaDataFile = [];
      await this.getStudentsAsync();
      let listClassId = [];
      this.classes = this.classes.filter(
        (classroom) => {
          listClassId.push(classroom.id);
          return classroom.internshipCourseId == this.guid;
        }
      );
      this.studentOfInInternshipCourse = this.studentsCallApi.filter(
        (student) =>  listClassId.includes(student.classId)
      );
    },

    async save() {
      if (this.metaDataFile.length==0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          'Vui lòng chọn file sinh viên'
        );
        return;
      }
      this.students = this.metaDataFile;
      this.studentLengthCallApi = this.studentLengthBanDau;
      this.studentsForCreate = [];
      this.studentNoExistInDB = [];
      this.studentExistInDB = [];
      for (let i in this.students) {
        if (this.students[i]["__EMPTY_2"] && i == 0) {
          this.classInNameFile = this.students[i]["__EMPTY_2"]
            .split("-")
            .shift();
          continue;
        }
        if (
          !this.students[i]["__EMPTY"] ||
          (this.students[i]["__EMPTY"] &&
            isNaN(parseInt(this.students[i]["__EMPTY"])))
        )
          continue;
        let viewModel = new StudentViewModel();
        let isStudentExist = this.studentsCallApi.find(
          ({ studentId }) => studentId == this.students[i]["__EMPTY"]
        );
        viewModel.fields.studentId = this.students[i]["__EMPTY"];
        viewModel.fields.firstName = this.students[i]["__EMPTY_1"];
        viewModel.fields.lastName = this.students[i]["__EMPTY_2"];
        viewModel.fields.dayOfBirth = this.students[i]["__EMPTY_3"];
        viewModel.fields.status = "active";
        viewModel.fields.email = viewModel.fields.studentId + ADD_STUDENT.EMAIL;
        // Kiểm tra lớp đã trùng với lớp đã có trong database chưa
        let classIdExist = this.classes.find(
          ({ className }) => className == this.classInNameFile
        );
        if (classIdExist) {
          viewModel.fields.classId = classIdExist.id;
        } else {
          this.classroom.internshipCourseId = this.guid;
          this.classroom.className = this.classInNameFile;
          this.classroom.status = "active";
          this.classroom.isDelete = false;
          let apiClass = new ClassService();
          let responseCreateClass = await apiClass.createClassAsync(
            this.classroom
          );
          this.showLoading(false);
          if (responseCreateClass.isOK) {
            this.showNotifications(
              "success",
              `${AppConfig.notification.title_default}`,
              `${AppConfig.notification.content_created_success_default}` +
                " Lớp " +
                this.classInNameFile
            );
            viewModel.fields.classId = responseCreateClass.data.id;
          }
          await this.getClassesFilterAsync();
          this.classes = this.classes.filter(
            (classroom) => classroom.internshipCourseId == this.guid
          );
        }
        // validate
        viewModel.setFields(viewModel.fields);
        this.errorMessages = viewModel.isValid();
        if (this.errorMessages.length > 0) {
          return;
        }

        if (isStudentExist) {
          viewModel.fields.studentId =
            viewModel.fields.studentId + "-duplicate";
          this.studentExistInDB.push(isStudentExist);
        } else {
          this.studentNoExistInDB.push(viewModel.fields);
        }
        this.studentsForCreate.push(viewModel.fields);
      }

      if (
        this.studentsForCreate.length == 0 &&
        this.studentNoExistInDB.length == 0
      ) {
        await this.saveStudentBefore();
        return;
      }

      if (this.studentNoExistInDB.length < this.studentsForCreate.length) {
        this.showConfirmCreateStudentExist(this.studentsForCreate);
        return;
      }
      await this.createStudentAfterWhileReadAsync(this.studentsForCreate);
    },

    async saveStudentBefore() {
      if (this.metaDataFile.length==0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          'Vui lòng chọn file sinh viên'
        );
        return;
      }
      this.students = this.metaDataFile;
      this.studentsForCreate = [];
      this.studentNoExistInDB = [];
      this.studentExistInDB = [];
      for (let i in this.students) {
        if (!this.students[i].classId) {
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            "Thêm mới sinh viên thất bại<br/ >File thêm không đúng định dạng!"
          );
          return;
        }

        let classIdExist = this.classes.find(
          ({ className }) => className == this.students[i].classId
        );
        if (classIdExist) {
          this.students[i].classId = classIdExist.id;
        } else {
          this.classroom.internshipCourseId = this.guid;
          this.classroom.className = this.students[i].classId;
          this.classroom.status = "active";
          this.classroom.isDelete = false;
          let apiClass = new ClassService();
          let responseCreateClass = await apiClass.createClassAsync(
            this.classroom
          );
          this.showLoading(false);
          if (responseCreateClass.isOK) {
            this.showNotifications(
              "success",
              `${AppConfig.notification.title_default}`,
              `${AppConfig.notification.content_created_success_default}` +
                " Lớp " +
                this.students[i].classId
            );
            this.students[i].classId = responseCreateClass.data.id;
          }
          await this.getClassesFilterAsync();
          this.classes = this.classes.filter(
            (classroom) => classroom.internshipCourseId == this.guid
          );
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

        let isStudentExist = this.studentsCallApi.find(
          ({ studentId }) => studentId == this.students[i].studentId
        );
        
        if (isStudentExist) {
          viewModel.fields.studentId =
            viewModel.fields.studentId + "-duplicate";
          this.studentExistInDB.push(this.students[i]);
        } else {
          this.studentNoExistInDB.push(this.students[i]);
        }
        this.studentsForCreate.push(this.students[i]);
      }

      if (
        this.studentsForCreate.length == 0 &&
        this.studentNoExistInDB.length == 0
      ) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới sinh viên thất bại<br/ >File thêm không đúng định dạng!"
        );
        return;
      }

      if (this.studentNoExistInDB.length < this.studentsForCreate.length) {
        this.showConfirmCreateStudentExist(this.studentsForCreate);
        return;
      }
      await this.createStudentAfterWhileReadAsync(this.studentsForCreate);
    },
  },

  watch: {
    data() {
      this.isShowAddFile = true;
      this.planName = this.getInfoObject(
        this.guid,
        this.plans
      ).internshipCourseName;
    },
  },
};
</script>

<style lang="scss">
.form-select-class {
  width: 100%;
  height: 35px;
}
</style>
