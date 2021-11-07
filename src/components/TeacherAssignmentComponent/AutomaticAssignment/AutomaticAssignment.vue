<template>
  <div class="auto_assignment tab-students-assign">
    <div class="restore_assign">
      <div class="restore_assign_notifi">
        <div class="pl-0 pr-0 row align-items-center">
          <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12">
            Trong đợt này hiện tại đã có {{ instructors.length }} sinh viên được
            phân công
          </div>
          <div class="col-md-4 col-lg-4 col-md-4 col-sm-12 text-right">
            <button
              class="btn btn-danger mr-2"
              data-toggle="tooltip"
              data-placement="top"
              title="Phân công lại từ đầu"
              @click="deleteStudent(internshipCourseId)"
            >
              <i class="fa fa-retweet"></i>
            </button>
            <!-- <button
              class="btn btn-info"
              title="Xem chi tiết"
              @click="showAssignments"
            >
              <i class="fa fa-window-restore"></i>
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <div class="table-responsive" v-if="isShowAssignment">
      <hr />
      <figure>
        <figcaption class="mb-3 font-weight-bold text-center">
          Danh sách giáo viên và sinh viên đã thêm vào phân công
        </figcaption>
        <table class="table">
          <thead class="">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Họ tên giáo viên</th>
              <th scope="col">Họ tên sinh viên</th>
              <th scope="col">Lớp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in instructors" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.teacherName }}</td>
              <td>{{ item.studentName }}</td>
              <td>{{ item.className }}</td>
            </tr>
            <tr v-show="instructors == null || instructors.length === 0">
              <th colspan="5" class="text-left">
                Không có dữ liệu nào được tìm thấy.
              </th>
            </tr>
          </tbody>
        </table>
      </figure>
    </div>

    <div class="continue-assignment">
      <hr v-if="instructors.length > 0" />
      <div class="col-sm-4 col-md-4 col-lg-4">
        <!-- <label>Số lượng sinh viên mà mỗi giáo viên sẽ quản lý {{averageNumber}}
        (<span class="text--red">*</span>)
      </label> -->
        <label
          >Nên để số lượng được gợi ý để đảm bảo các sinh viên đều được phân
          công (<span class="text--red">*</span>)
        </label>
        <input
          type="number"
          class="form-control"
          v-model="numberOfTeacher"
          @keypress="isNumber"
          min="0"
        />
      </div>

      <div
        class="btn btn-success btn-create-assignment-data mb-2"
        @click="createAssignmentData"
      >
        Tạo danh sách công
      </div>
      <hr />
      <div class="info_instructor form-row mb-3" v-if="showCreateAssignments">
        <div class="col-sm-4 col-md-4 col-lg-4">
          <label class="d-sm-block d-none">&nbsp;</label>
          <button
            class="btn btn-primary btn-create-assignment"
            @click="teacherAssignment"
            v-if="showCreateAssignments"
          >
            Phân công
          </button>
        </div>
      </div>

      <div class="list_assignment" v-if="showCreateAssignments">
        <div class="row">
          <div class="col-xl-8">
            <div class="table-responsive">
              <figure>
                <figcaption class="mb-3 font-weight-bold text-center">
                  Danh sách phân công giáo viên
                </figcaption>
                <table class="table">
                  <thead class="">
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Họ tên giáo viên</th>
                      <th scope="col">Họ tên sinh viên</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in pageOfItems" :key="index">
                      <th scope="row">{{ index + 1 }}</th>
                      <td
                        v-if="
                          teachers.length != 0 &&
                          getInfoObject(item.teacherId, teachers)
                        "
                      >
                        {{ getInfoObject(item.teacherId, teachers).firstName }}
                        {{ getInfoObject(item.teacherId, teachers).lastName }}
                      </td>
                      <td
                        v-if="
                          students.length != 0 &&
                          getInfoObject(item.studentId, students)
                        "
                      >
                        {{ getInfoObject(item.studentId, students).firstName }}
                        {{ getInfoObject(item.studentId, students).lastName }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  class="card-footer d-flex justify-content-center text--blue"
                >
                  <JwPagination
                    :items="assignments"
                    @changePage="onChangePage"
                    :labels="customLabels"
                    :pageSize="20"
                  >
                  </JwPagination>
                </div>
              </figure>
            </div>
          </div>
          <div class="col-xl-4">
            <label for="" class="font-weight-bold">Thống kê</label>
            <ul>
              <li v-for="(item, index) in statistics"
                :key="index + 'statistic'">
                {{ getInfoObject(item.teacherId, teachers).firstName }}
                {{ getInfoObject(item.teacherId, teachers).lastName }}:
                {{ item.number }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :data="confirmInternshipCourseId"
      @agree="restoreAssignment()"
      :message="'Bạn có muốn phân công lại từ đầu'"
    >
    </ConfirmDialog>
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import JwPagination from "jw-vue-pagination";
import InstructorService from "../../../services/instructor/instructorService";
import AppConfig from "../../../../src/app.config.json";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";

export default {
  name: "AutomaticAssignment",
  extends: ComponentBase,
  components: {
    JwPagination,
    ConfirmDialog,
  },
  data() {
    return {
      assignments: [],
      studentTemp: [],
      teacherTemp: [],
      teacherTempRequest: {
        teacherId: "",
        number: 0,
      },
      studentTempDelete: [],
      assignmentRequest: {
        teacherId: "",
        studentId: "",
        internshipCourseId: "",
        status: "active",
        index: 0,
      },
      averageNumber: 0,
      statistic: {
        teacherId: "",
        number: 0,
      },
      numberOfTeacher: 0,
      statistics: [],
      isShowAssignment: false,
      pageOfItems: [],
      pageOfItemsInstructor: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      confirmInternshipCourseId: null,
      isShowContinueAssignment: false,
      showCreateAssignments: false,
      studentsRemain: 0,
    };
  },
  props: {
    internshipCourseId: {
      type: String,
      default: "",
    },
    students: {
      type: Array,
      default: [],
    },
    classes: {
      type: Array,
      default: [],
    },
    teachers: {
      type: Array,
      default: [],
    },
    instructors: {
      type: Array,
      default: [],
    },
    numberOfStudentInInternshipCourse: {
      type: Number,
      default: 0,
    },
    statistiesStudentInClass: {
      type: Array,
      default: [],
    },
  },

  methods: {
    isNumber(val) {
      if (isNaN(Number(val.key))) {
        return val.preventDefault();
      }
    },
    showAssignments() {
      this.isShowAssignment = !this.isShowAssignment;
      if (this.isShowContinueAssignment) {
        this.isShowContinueAssignment = false;
      }
    },

    showContinueAssignment() {
      this.isShowContinueAssignment = !this.isShowContinueAssignment;
      if (this.isShowAssignment) {
        this.isShowAssignment = false;
      }
    },

    createAssignmentData() {
      if (this.showCreateAssignments) {
        this.showCreateAssignments = false;
        return;
      }
      const reducer = (previousValue, currentValue) =>
        previousValue + currentValue.numberOfStudentAssigned;
      this.studentsRemain = this.statistiesStudentInClass.reduce(reducer, 0);
      if (this.numberOfStudentInInternshipCourse == this.studentsRemain) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Bạn đã phân công hết sinh viên cho đợt này!"
        );
        return;
      }
      this.showCreateAssignments = true;
      //Phân công từ đầu
      this.statistics = [];
      this.studentTempDelete = JSON.parse(JSON.stringify(this.students));
      this.assignments = [];

      if (this.instructors.length == 0) {
        this.averageNumber = Math.round(
          this.numberOfStudentInInternshipCourse / this.teachers.length
        );
      } else {
        this.averageNumber = Math.ceil(
          (this.numberOfStudentInInternshipCourse - this.instructors.length) /
            this.teachers.length
        );
      }

      if (
        this.numberOfTeacher != 0 &&
        this.numberOfTeacher != this.averageNumber
      ) {
        this.averageNumber = this.numberOfTeacher;
      }

      if (this.instructors.length == 0) {
        this.teachers.forEach((teacher) => {
          this.studentTemp = [];

          if (this.studentTempDelete) {
            this.studentTemp = this.studentTempDelete.slice(
              0,
              this.averageNumber
            );
            this.studentTempDelete.splice(0, this.averageNumber);
          }

          var count = 0;
          this.studentTemp = this.studentTemp.forEach((student) => {
            count++;
            this.assignmentRequest = {
              teacherId: teacher.id,
              studentId: student.id,
              internshipCourseId: this.internshipCourseId,
              status: "active",
            };

            this.assignments.push(this.assignmentRequest);
          });

          this.addStatistics(teacher.id, count);
        });
        this.numberOfTeacher = this.averageNumber;
      }
      // Phân công tiếp tục
      else {
        // Láy danh sách giáo viên tạm bao gồm số lượng sinh viên đã phân công cho giáo viên đó.
        this.addAssignmentStudentNumber();

        this.teacherTemp.forEach((teacher) => {
          this.studentTemp = [];
          if (teacher.number > 0 && teacher.number <= this.averageNumber) {
            this.studentTemp = this.studentTempDelete.slice(
              0,
              this.averageNumber - teacher.number
            );
            this.studentTempDelete.splice(
              0,
              this.averageNumber - teacher.number
            );
          } else {
            this.studentTemp = this.studentTempDelete.slice(
              0,
              this.averageNumber
            );
            this.studentTempDelete.splice(0, this.averageNumber);
          }
          var count = 0;
          this.studentTemp = this.studentTemp.forEach((student) => {
            count++;
            this.assignmentRequest = {
              teacherId: teacher.teacherId,
              studentId: student.id,
              internshipCourseId: this.internshipCourseId,
              status: "active",
            };

            this.assignments.push(this.assignmentRequest);
          });

          this.addStatistics(teacher.teacherId, count);
        });
        this.numberOfTeacher = this.averageNumber;
      }
    },

    addStatistics(teacherId, count) {
      this.statistic = {
        teacherId: teacherId,
        number: count,
      };
      this.statistics.push(this.statistic);
    },

    addAssignmentStudentNumber() {
      this.teacherTemp = [];
      this.teachers.forEach((teacher) => {
        var count = 0;
        this.instructors.forEach((instructor) => {
          if (teacher.id == instructor.teacherId) {
            count++;
          }
        });
        this.teacherTempRequest = {
          teacherId: teacher.id,
          number: count,
        };
        this.teacherTemp.push(this.teacherTempRequest);
      });
    },

    async teacherAssignment() {
      this.showLoading();
      await this.createInstructorsAsync();
      this.showLoading(false);
      this.$emit("change-instructors", true);
      this.assignments = [];
      this.statistics = [];
      this.numberOfTeacher = 0;
    },

    // Phân công cho 1 danh sách
    async createInstructorsAsync() {
      const api = new InstructorService();
      // Phân công từng sinh viên
      const response = await api.createInstructorsAsync(this.assignments);
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
        `Phân công tự động thành công <br />
        Chuyển hướng qua <strong> Danh sách sinh viên đã được phân công</strong> để xem chi tiết`
      );
    },

    async createInstructorAsync(assignment) {
      this.showLoading();
      const api = new InstructorService();
      // Phân công từng sinh viên
      const response = await api.createInstructorAsync(assignment);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
    },

    deleteStudent(internshipCourseId) {
      this.confirmInternshipCourseId = {
        internshipCourseId: internshipCourseId,
      };
    },

    async restoreAssignment() {
      await this.getInstructorsAsync();
    },

    async getInstructorsAsync() {
      this.showLoading();
      const api = new InstructorService();
      this.instructorRequest = {
        internshipCourseId: this.internshipCourseId,
      };
      const response = await api.restoreInstructors(this.instructorRequest);
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
        "Xóa danh sách phân công thành công"
      );
      this.$emit("change-instructors", response.data);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    getClassName(classId) {
      for (const x in this.classes) {
        if (this.classes[x].id == classId) {
          return this.classes[x].className;
        }
      }
    },
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },
  },

  watch: {
    statistiesStudentInClass() {
      const reducer = (previousValue, currentValue) =>
        previousValue + currentValue.numberOfStudentAssigned;
      this.studentsRemain = this.statistiesStudentInClass.reduce(reducer, 0);
    },
  },
};
</script>

<style lang='scss'>
@import "./AutomaticAssignment.scss";
</style>
