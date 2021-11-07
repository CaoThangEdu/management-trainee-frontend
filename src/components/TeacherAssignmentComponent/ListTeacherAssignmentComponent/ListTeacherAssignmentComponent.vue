<template>
  <div class="row tab-students-assign">
    <div class="col-12">
      <div class="">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-row filter-wrapper ml-0 mr-0">
                <div class="col-xl-6 col-md-6 col-sm-12">
                  <select
                    class="form-control"
                    v-model="classId"
                    v-on:change="changeClassName()"
                  >
                    <option value="">Chọn lớp</option>
                    <option
                      v-for="(item, index) in classes"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.className }}
                    </option>
                  </select>
                </div>
                <div class="col-xl-6 col-md-6 col-sm-12">
                  <select
                    class="form-control"
                    v-model="teacherId"
                    v-on:change="changeTeacherFromSelect()"
                  >
                    <option value="">Chọn giáo viên</option>
                    <option
                      v-for="(teacher, index) in teachers"
                      :key="index"
                      :value="teacher.id"
                    >
                      {{ teacher.firstName + ' ' + teacher.lastName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead class="">
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Tên sinh viên</th>
                  <th scope="col">Lớp</th>
                  <th scope="col">Khóa</th>
                  <th scope="col">Đợt thực tập</th>
                  <th scope="col">Tên giáo viên</th>
                  <th scope="col">Thao tác (Thay đổi giáo viên)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(instructor, index) in pageOfItems" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ instructor.studentName }}</td>
                  <td>{{ instructor.className }}</td>
                  <td>{{ instructor.courseName }}</td>
                  <td>{{ instructor.internshipCourseName }}</td>
                  <td>{{ instructor.teacherName }}</td>
                  <td v-on:click="changeStudentId(instructor)">
                    <SelectTeacher
                      :teachers="teachers"
                      @change="
                        (event) => {
                          teacherSelect = event.id;
                        }
                      "
                      @changeTeacher="changeTeacher"
                      :isRequired="false"
                      :defaultText="'Chọn giáo viên'"
                    >
                    </SelectTeacher>
                  </td>
                </tr>
                <tr v-show="pageOfItems == null || pageOfItems.length === 0">
                  <th colspan="7" class="text-left">
                    Không có dữ liệu nào được tìm thấy.
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-center text--blue">
          <JwPagination
            :items="instructors"
            @changePage="onChangePage"
            :labels="customLabels"
            :pageSize="20"
          >
          </JwPagination>
        </div>
        <ConfirmDialog
          :message="'Bạn có muốn thay đổi giáo viên?'"
          :data="confirmChangeTeacher"
          @agree="changeTeacher"
        >
        </ConfirmDialog>
      </div>
    </div>
  </div>
</template>

<script>
import SelectTeacher from "../../common/form/select-teacher/SelectTeacher.vue";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import AlertMessages from "../../common/alert/alert-messages/AlertMessages";
import BaseModal from "../../common/base-modal/BaseModal";
import JwPagination from "jw-vue-pagination";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import ComponentBase from "../../common/component-base/ComponentBase";

export default {
  name: "ListTeacherAssignmentComponent",
  components: {
    SelectTeacher,
    BaseModal,
    AlertMessages,
    JwPagination,
    ConfirmDialog,
  },
  extends: ComponentBase,
  data() {
    return {
      instructors: [],
      listBrand: [],
      editTeacher: {},
      classId: "",
      teacherId: "",
      studentId: "",
      instructorId: "",
      instructorRequest: {
        internshipCourseId: "",
        classId: "",
        teacherId: "",
      },
      updateInstructor: {
        internshipCourseId: "",
        id: "",
        studentId: "",
        teacherId: "",
        status: "",
      },
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      confirmChangeTeacher: null,
    };
  },
  props: {
    internshipCourseId: {
      type: String,
    },
    classes: {
      type: Array,
    },
    teachers: {
      type: Array,
    },
    studentInInternshipCourse: {
      type: Array,
    },
  },
  async mounted() {
    await this.getInstructorsAsync();
  },
  methods: {
    async getInstructorsAsync() {
      const api = new InstructorService();
      this.instructorRequest = {
        internshipCourseId: this.internshipCourseId,
        classId: this.classId,
        teacherId: this.teacherId,
      };
      const response = await api.getInstructors(this.instructorRequest);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.instructors = response.data;
    },

    changeStudentId(instructor) {
      this.studentId = instructor.studentId;
      this.instructorId = instructor.instructorId;
    },

    async changeTeacher(teacher) {
      this.teacherId = teacher.id;
      await this.updateInstructorAsync();
    },

    async updateInstructorAsync() {
      const api = new InstructorService();
      this.updateInstructor = {
        internshipCourseId: this.internshipCourseId,
        id: this.instructorId,
        studentId: this.studentId,
        teacherId: this.teacherId,
        status: "active",
      };
      this.showLoading();
      const response = await api.updateInstructorAsync(this.updateInstructor);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        "Thay đổi giáo viên thành công"
      );
      this.$emit("change-instructors", true);
    },

    async changeClassName() {
      this.showLoading();
      await this.getInstructorsAsync();
      this.showLoading(false);
    },

    changeAsignmantWhileChooseTeacher(instructor) {
      this.confirmChangeTeacher = { instructor: instructor };
    },

    async changeTeacherFromSelect() {
      this.showLoading();
      await this.getInstructorsAsync();
      this.showLoading(false);
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },
  },
};
</script>
