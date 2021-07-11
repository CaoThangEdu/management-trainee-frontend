<template>
<div class="row">
  <div class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
      <PlanningStepsComponent :isActiveStep="isActiveStep" />
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <header class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
              <path fill="var(--ci-primary-color, currentColor)" d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z" class="ci-primary"></path>
            </svg> Danh sách lớp của đợt
            <b>"{{ plan.internshipCourseName }}"</b>
          </header>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead class="">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên lớp</th>
                    <th scope="col" class="text-center">Số sinh viên trong lớp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(classItem, index) in classes" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <th scope="row">{{ classItem.className }}</th>
                    <th scope="row" class="text-center">{{ sumStuentInClass(classItem.id) }}</th>
                  </tr>
                  <tr v-show="classes == null || classes.length === 0">
                    <th colspan="5" class="text-left">Không có dữ liệu nào được tìm thấy.</th>
                  </tr>
                </tbody>
              </table>
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
            <b>"{{ plan.internshipCourseName }}"</b>
          </header>
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
                        <div v-if="createClassLoading" role="status" aria-hidden="false" aria-label="Loading" class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                      </div>

                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-md-4 col-sm-4 col-form-label ml-3">Chọn file excel</label>
            <div class="col-md-6 col-sm-6">
              <div class="input-group mb-3">
                <input type="file" class="btn btn-secondary float-right btn-add-file" @change="previewFiles" />
              </div>
            </div>
          </div>
          <div class="text-center mb-4">
            <router-link :to="{name:'ds-ke-hoach'}" class="btn btn-primary mr-2">Hủy</router-link>
            <button @click="save" id="submit" class="btn btn-success">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase.vue";
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json';
import PlanService from '../../../services/plan/planServices';
import XLSX from 'xlsx';
import ClassService from '../../../services/class/classServices';
import ClassViewModel from "../../../view-model/class/classViewModel";
import StudentViewModel from "../../../view-model/student/studentViewModel";
import {
  ADD_STUDENT
} from "../../../config/constant";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import PlanningStepsComponent from '../../../components/planningStepsComponent/planningStepsComponent.vue';

export default {
  name: 'AddStudentsFileByPlan',
  extends: ComponentBase,
  mixins: [CrudMixin],
  components: {
    PlanningStepsComponent,
  },
  data() {
    return {
      isShowAddFile: false,
      students: [],
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
      faqs: [{
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
      isActiveStep:"2",
    }
  },
  props: {
    guid: {
      type: String,
      default: '',
    },
  },

  async mounted() {
    await this.getStudentsAsync();
    await this.getClassesFilterAsync();
    await this.getPlanByIdAsync(this.guid);
    this.classes = this.classes.filter(
      classroom => classroom.internshipCourseId == this.guid);
  },

  created() {
    localStorage.removeItem('ID_PLAN');
  },

  methods: {
    sumStuentInClass(classId) {
      if (!this.studentsCallApi) {
        return 0;
      }
      let result = this.studentsCallApi.reduce((total, student) => {
        return student.classId == classId ? total + 1 : total
      }, 0);
      return result;
    },

    async getPlanByIdAsync(guid) {
      // Call Api
      this.showLoading();
      const api = new PlanService()
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
      this.plan = response.data;
    },

    getInfoByCourseId(courseId, list) {
      if (!CrudMixin.methods.getInfoByCourseId(courseId, list)) {
        return '';
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
        `${AppConfig.notification.content_created_success_default}` + ' lớp'
      );
      await this.getClassesFilterAsync();
      this.classes = this.classes.filter(
        classroom => classroom.internshipCourseId == this.guid);
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
          return this.classes[x].id
        }
      }
    },

    async getStudentsAsync() {
      let studentFilter = {
        keyword: "",
        isDelete: false,
        status: "active",
        classId: "",
      };
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getStudentsAsync(studentFilter);
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

      reader.onload = async function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {
          type: 'array'
        });
        let sheetName = workbook.SheetNames[0]
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
      const api = new ClassService()

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

    async pressKeyEnter() {
      await this.save();
    },

    async save() {
      if (this.classCreated) {
        await this.getClassesFilterAsync();
        this.classes = this.classes.filter(
          classroom => classroom.internshipCourseId == this.guid);
        this.classIdSelected = this.classCreated;
      }
      // let courseDaChonId = this.getInfoObject(this.classIdSelected, this.classes).courseId;
      this.students = this.metaDataFile;
      let studentLengthCallApi = this.studentLengthBanDau;
      var idClass = this.classIdSelected;
      for (let i = 0; i < this.students.length; i++) {
        let vtSV = i + 1;
        for (const index in this.studentsCallApi) {
          if (this.students[i].studentId == this.studentsCallApi[index].studentId) {
            this.showNotifications(
              "error",
              `${AppConfig.notification.title_default}`,
              'Mã số sinh viên thứ ' + vtSV + ' đã tồn tại!' +
              "<br/> Đã thêm được " + i + " sinh viên"
            );
            return;
          }
        }

        // Kiểm tra lớp đã trùng với lớp đã chọn hay chưa
        let classOfStudent = this.getInfoObjectByName(this.students[i].classId, this.classes);
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
          this.classroom.internshipCourseId = this.guid;
          this.classroom.className = this.students[i].classId;
          this.classroom.status = 'active';
          this.classroom.isDelete = false;
          let api = new ClassService();
          let response = await api.createClassAsync(this.classroom);
          this.showLoading(false);
          if (response.isOK) {
            this.showNotifications(
              "success",
              `${AppConfig.notification.title_default}`,
              `${AppConfig.notification.content_created_success_default}` +
              ' Lớp ' + this.students[i].classId
            );
            this.students[i].classId = response.data.id;
          }
          await this.getClassesFilterAsync();
          this.classes = this.classes.filter(
            classroom => classroom.internshipCourseId == this.guid);
          // this.students[i].classId = this.getInfoObjectByName(this.students[i].classId, this.classes).id;
        }
        this.students[i].status = 'active';
        this.students[i].email = this.students[i].studentId + ADD_STUDENT.EMAIL;
        // validate
        let viewModel = new StudentViewModel();
        viewModel.setFields(this.students[i]);
        this.errorMessages = viewModel.isValid();

        if (this.errorMessages.length > 0) {
          return;
        }
        this.showLoading();
        let api = new StudentService();
        let response = await api.createStudentAsync(this.students[i]);
        if (!response.isOK) {
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            response.errorMessages
          );
          return;
        }
        // Tạo thành công
      }
      this.showLoading(false);
      await this.getStudentsAsync();
      if (studentLengthCallApi == this.studentLengthBanDau) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Thêm mới sinh viên thất bại"
        );
      } else {
        this.showNotifications(
          "success",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.content_created_success_default}` + ' sinh viên'
        );
      }
      await this.getStudentsAsync();
      await this.getPlanByIdAsync(this.guid);
      this.classes = this.classes.filter(
        classroom => classroom.internshipCourseId == this.guid);
    },
  },

  watch: {
    data() {
      this.isShowAddFile = true;
      this.planName = this.getInfoObject(this.guid, this.plans).internshipCourseName;
    }
  }
}
</script>

<style lang="scss">
.form-select-class {
  width: 100%;
  height: 35px;
}
</style>
