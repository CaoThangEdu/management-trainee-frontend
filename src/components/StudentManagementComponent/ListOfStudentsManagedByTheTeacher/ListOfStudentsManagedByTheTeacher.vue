<template>
<div class="row">
  <div class="col-12">
    <div class="card">
      <header class="card-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" class="c-icon">
          <path fill="var(--ci-primary-color, currentColor)"
            d="M47.547,63.547V448.453a16,16,0,0,0,16,16H448.453a16,16,0,0,0,16-16V63.547a16,16,0,0,0-16-16H63.547A16,16,0,0,0,47.547,63.547Zm288.6,16h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm-128.3-256.6h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Zm0,128.3h96.3v96.3h-96.3Z"
            class="ci-primary"></path>
        </svg> Danh sách sinh viên của tôi quản lý
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
                <th scope="col">Đợt thực tập</th>
                <th scope="col">Điểm</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(studentItem, index) in pageOfItems" :key="index + 'student'">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ studentItem.student.studentId }}</td>
                <td>{{ studentItem.student.firstName + ' ' + studentItem.student.lastName }}</td>
                <td>{{ studentItem.className }}</td>
                <td>{{ studentItem.student.email }}</td>
                <td>{{ studentItem.internshipCourseName }}</td>
                <td>{{ studentItem.score?studentItem.score.score:0 }}</td>
                <td>
                  <button class="btn btn-success"
                    @click="updateStudent(index)">
                    Chấm điểm
                  </button>
                </td>
              </tr>
              <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                <th colspan="8" class="text-left">
                  Không có dữ liệu nào được tìm thấy.
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <StudentInfoScoreComponent
        :data="editStudent"
        @change-data="changeData"/>

      <div class="card-footer d-flex justify-content-center text--blue"
        v-show="pageOfItems.length !== 0">
        <div class="form-group d-flex page-size-group mb-0 mr-2"
          v-if="isPageSize">
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
import ComponentBase from "../../common/component-base/ComponentBase";
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";
import SelectPlan from '../../../components/common/form/select-plan/SelectPlan.vue';
import SelectClassroom from '../../../components/common/form/select-classroom/SelectClassroom.vue';
import teacherService from '../../../services/teacher/teacherServices';
import { mapGetters, mapActions } from "vuex";
import AppConfig from "../../../app.config.json";
import StudentInfoScoreComponent from "../StudentInfoScoreComponent/StudentInfoScoreComponent.vue"

export default {
  name: "ListOfStudentsManagedByTheTeacher",
  extends: ComponentBase,
  components: {
    JwPagination,
    SelectPlan,
    SelectClassroom,
    StudentInfoScoreComponent,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      students: [],
      pageSize: 10,
      isPageSize: false,
      editStudent: {},
    };
  },

  async mounted() {
    if (!this.userProfile.user) {
      await this.getUserProfile();
    }
    await this.getStudentsManagedByTeacherById();
  },
  
  computed: {
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

    updateStudent(index) {
      this.editStudent = Object.assign({}, this.pageOfItems[index]);
    },

    async changePageSize() {
      await this.getStudentsManagedByTeacherById();
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    async getStudentsManagedByTeacherById() {
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
      this.isPageSize = this.students.length!=0?true:false;
    },

    async changePage(currentPage) {
      await this.getStudentsManagedByTeacherById(currentPage);
    },

    deleteClass(classroom) {
      this.confirmClassRoom = classroom;
    },

    async changeData() {
      await this.getStudentsManagedByTeacherById();
    },
  },
}
</script>