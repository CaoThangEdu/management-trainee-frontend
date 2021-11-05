<template>
<div class="row">
  <div class="col-12">
    <div class="card">
      <header class="card-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
          <path fill="var(--ci-primary-color, currentColor)"
            d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
            class="ci-primary"></path>
        </svg> Danh sách sinh viên
        <button class="btn btn-primary float-right btn-search"          
          @click="createStudent" title="Thêm mới">
          <em class="fa fa-plus-square"></em>
        </button>
      </header>
      <div class="card-body">
        <div class="form-row mb-2 filter-wrapper">
          <div class="col-sm-12 col-md-6 col-lg-3">
            <label>Chọn lớp</label>
            <SelectClassroom
              :isRequired="false"
              v-model="filter.classId"
              :plans="plans"
              :classrooms="classes" :defaultText="'Tất cả'"
              @change="(event) => {filter.classId = event.id}">
            </SelectClassroom>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-3"
            v-if="filter.classId == '' || filter.classId == -1">
            <label>Chọn đợt thực tập</label>
            <SelectPlan
              :isRequired="false"
              v-model="filter.internshipCourseId"
              :plans="plans" :defaultText="'Tất cả'"
              @change="(event) => {filter.internshipCourseId = event.id}">
            </SelectPlan>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-3">
            <label>Nhập từ khóa</label>
            <input type="text" class="form-control" id="keywords"
              v-model="filter.keyword"
              placeholder="Nhập từ khóa" />
          </div>
          <div class="col-auto">
            <label class="d-sm-block d-none" style="height: 21px;">&nbsp;</label>
            <button type="submit" id="btn-search" 
              class="btn btn-stack-overflow"
              title="Tìm kiếm"
              @click="searchStudent()">
              <em class="fas fa-search"></em>
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead class="">
              <tr>
                <th scope="col">STT</th>
                <th scope="col">MSSV</th>
                <th scope="col">Tên sinh viên</th>
                <th scope="col">Lớp</th>
                <th scope="col">Email</th>
                <th scope="col">Đợt thực tập</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in pageOfItems" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ item.studentId }}</td>
                <td @click="updateStudent(index)" class="link-detail"
                  title="Xem">{{ item.firstName + ' ' + item.lastName }}</td>
                <td v-if="students.length != 0 && classes.length != 0 && getInfoObject(item.classId, classes)">
                  {{ getInfoObject(item.classId, classes).className }}
                </td>
                <td>{{ item.email }}</td> 
                <td
                  v-if="students.length != 0 && classes.length != 0 && plans.length != 0 
                  && getInfoObject(item.classId, classes)">
                  {{ getInfoByCourseId(getInfoObject(item.classId, classes).courseId, plans) ? getInfoByCourseId(getInfoObject(item.classId, classes).courseId, plans).internshipCourseName : 'Chưa có đợt' }}
                </td>
                <td>
                  <button class="btn btn-danger mr-2" @click="updateStatus(index)" v-if="item.status == 'unactive'">
                    <i :class="getStatusIcon(item.status)"></i>
                  </button>
                  <button class="btn btn-warning mr-2" @click="updateStatus(index)" v-if="item.status == 'active'">
                    <i :class="getStatusIcon(item.status)"></i>
                  </button>
                </td>
                <td>
                  <button class="btn btn-danger" title="Xóa"
                    @click="deleteStudent(item)">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                <th colspan="5" class="text-left">
                  Không có dữ liệu nào được tìm thấy.
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <StudentManagementDetailComponent
        :data="editStudent"
        @change-data="changeData"
        @change-data-class="changeDataClass"
        :classes="classes"
        :students="students"
        :plans="plans"/>

      <ConfirmDialog
        :data="confirmStudent"
        @agree="deleteStudentConfirm">
      </ConfirmDialog>

      <div class="card-footer d-flex justify-content-center text--blue"
        v-show="pageOfItems.length !== 0">
        <div class="form-group d-flex page-size-group mb-0 mr-2"
          v-if="getPageSize">
          <select class="form-control w-auto"
            @change="changePageSize()"
            v-model="pageSize">
            <option value="10">10/ trang</option>
            <option value="20">20/ trang</option>
            <option value="30">30/ trang</option>
            <option value="40">40/ trang</option>
            <option value="50">50/ trang</option>
          </select>
        </div>
        <JwPagination
          :items="students"
          @changePage="onChangePage"
          :labels="customLabels"
          :pageSize="Number(pageSize)">
        </JwPagination>
      </div>
    </div>
  </div>  
</div>
  
</template>

<script>
import StudentManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";
import SelectPlan from '../../../components/common/form/select-plan/SelectPlan.vue';
import SelectClassroom from '../../../components/common/form/select-classroom/SelectClassroom.vue';

export default {
  name: "ListStudentManagementComponent",
  extends: ComponentBase,
  components: {
    StudentManagementDetailComponent,
    ConfirmDialog,
    JwPagination,
    SelectPlan,
    SelectClassroom,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      editStudent: {},
      addStudents: {},
      confirmStudent: null,
      metaDataFile: [],
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
      },
      pageSize: 10,
    };
  },

  props: {
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
  
  methods:{
    async changePageSize() {
      await this.$emit("search-student", this.filter);
    },

    searchStudent() {
      if (this.filter.classId == -1 || this.filter.classId == '') {
        this.filter.classId = '';
      } else {
        this.filter.internshipCourseId = '';
        this.$emit("search-student", this.filter);
        return;
      }
      if (this.filter.internshipCourseId == -1) {
        this.filter.internshipCourseId = '';
      }
      this.$emit("search-student", this.filter);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    getInfoByCourseId(courseId, list){
      if (!CrudMixin.methods.getInfoByCourseId(courseId, list)) {
        return '';
      }
      return CrudMixin.methods.getInfoByCourseId(courseId, list);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    getClassName(classId){
      for (const x in this.classes) {
        if(this.classes[x].id == classId){
          return this.classes[x].className
        }
      }
    },

    createStudent() {
      this.editStudent = {};
    },

    createStudentsFile() {
      this.addStudents = {};
    },

    async changeData() {
      this.$emit("change-data-student-component");
    },

    changeDataClass() {
      this.$emit("change-data-classroom");
    },

    updateStudent(index) {
      this.editStudent = Object.assign({}, this.pageOfItems[index]);
    },

    getStatusIcon(status) {
      return CrudMixin.methods.getStatusIcon(status);
    },

    // Call api delete Student
    async updateIsDeleteStatus(index) {
      let student = this.pageOfItems[index];
      this.showLoading();
      let api = new StudentService();
      let response = await api.updateStudentAsync(student);
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
        `${AppConfig.notification.content_updated_status_success_default}`
      );
      this.$emit("change-data-student-component");
    },
    
    async updateStatus(index) {
      let student = this.pageOfItems[index];
      if (student.status === 'active') {
        student.status = 'unactive';
      } else {
        student.status = 'active';
      }
      this.showLoading();
      let api = new StudentService();
      let response = await api.updateStudentAsync(student);
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
        `${AppConfig.notification.content_updated_status_success_default}`
      );
      this.$emit("change-data-student-component");
    },

    deleteStudent(student) {
      this.confirmStudent = student;
    },

    // Call api delete student
    async deleteStudentConfirm(studentComfirm) {
      this.showLoading();
      let api = new StudentService();
      let response = await api.deleteStudentAsync(studentComfirm.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.$emit("change-data-student-component");
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },
  },
  computed: {
    getPageSize() {
      return this.students.length!=0?true:false;
    }
  }
}
</script>