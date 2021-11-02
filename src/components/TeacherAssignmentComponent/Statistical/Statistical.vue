<template>
  <div class="information">
    <div class="card">
      <div class="card-body">
        <div class="row col-12">
          <div class="col-lg-8 col-xl-8 col-md-8 col-sm-12">
            <div class="text--font-size__m mb-3">
              <div>
                <div>
                  Đợt thực tập:
                  <strong>{{ statisticalPlan.internshipCourseName }}</strong>
                </div>
                <div>
                  Khóa: <strong>{{ statisticalPlan.courseName }}</strong>
                </div>
              </div>
              <div>
                <div>
                  Ngày bắt đầu:
                  <strong>{{
                    convertTime(statisticalPlan.startDay, "DD/MM/YYYY")
                  }}</strong>
                </div>
                <div>
                  Ngày kết thúc:
                  <strong>{{
                    convertTime(statisticalPlan.endDay, "DD/MM/YYYY")
                  }}</strong>
                </div>
              </div>
              <div :class="{
                  'disable-wapper-content': (students.length!=0),
                }">
                <button class="btn btn-success"
                  @click="createNotifyForUser(internshipCourseId)">
                  Gửi thông báo cho tất cả những người trong đợt
                </button>
                <div class="text--red text--italic"
                  v-if="students.length!=0">
                  Sau khi phân công xong giáo viên, chức năng này mới hoạt động được
                </div>
              </div>
              <ConfirmDialog
                :data="confirmCreateNotify"
                @agree="createNotifyForUserAsync"
                :message="'Bạn có muốn gửi thông báo cho tất cả những người trong đợt thực tập ' 
                + statisticalPlan.internshipCourseName">
              </ConfirmDialog>
            </div>
            <Highcharts
              v-if="
                assignedStudents.length != 0 && unassignStudents.length != 0
              "
              :assignedStudents="assignedStudents"
              :unassignStudents="unassignStudents"
              :labelsProps="'Số sinh viên'"
              :labelChart="
                'Thống kê phân công của đợt thực tập ' +
                statisticalPlan.internshipCourseName
              "
            />
          </div>
          <div class="col-lg-4 col-xl-4 col-md-4 col-sm-12">
            <div class="table-responsive">
              <table class="table">
                <thead class="">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên giáo viên</th>
                    <th scope="col">Số lượng sinh viên</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(teacher, index) in pageOfItemsTeacher"
                    :key="index + 'teacher' + index"
                  >
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ teacher.firstName + " " + teacher.lastName }}</td>
                    <td class="text-center">{{ teacher.sumStudents }}</td>
                  </tr>
                  <tr v-show="teachers == null || teachers.length === 0">
                    <th colspan="3" class="text-left">
                      Không có dữ liệu nào được tìm thấy.
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
             <div class="card-footer d-flex justify-content-center text--blue">
              <JwPagination
                :items="teachers"
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
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import crudMixin from "../../../helpers/mixins/crudMixin";
import Highcharts from "../../common/high-chart/HighChart.vue";
import JwPagination from "jw-vue-pagination";
import NotificationService from "../../../services/notification/notificationServices";
import AppConfig from "../../../../src/app.config.json";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog.vue";

export default {
  name: "Statistical",
  extends: ComponentBase,
  components: {
    Highcharts,
    JwPagination,
    ConfirmDialog,
  },
  mixins: [crudMixin],
  props: {
    internshipCourseId: {
      type: String,
      default: "",
    },
    teachers: {
      type: Array,
      default: [],
    },
    statisticalPlan: {
      type: Object,
      default: {},
    },
    studentInInternshipCourse: {
      type: Array,
      default: [],
    },
    statistiesStudentInClass: {
      type: Array,
      default: [],
    },
    students: {
      type: Array,
      default: [],
    }
  },

  data() {
    return {
      statistical: {
        description: "",
        internshipCourseName: "",
        startDay: "",
        endDay: "",
        status: "",
        courseName: "",
        trainingSystemName: "",
        careersName: "",
        numberstudentsUnAssigned: 0,
        numberTeachersInInternshipCourse: 0,
        numberOfStudentsInInternshipCourse: 0,
      },
      statisticalRequest: {
        internshipCourseId: "",
      },
      chartData: null,
      labelsProps: null,
      chartDataStatisticsStudentInClass: [],
      labelsDataStatisticsStudentInClass: [],
      assignedStudents: [],
      unassignStudents: [],
      pageOfItemsTeacher: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      confirmCreateNotify: null,
    };
  },
  async mounted() {
    this.labelsProps = [
      "Tổng số giáo viên",
      "Tổng số sinh viên",
      "Sinh viên chưa được phân công",
      "Sinh viên đã được phân công",
    ];
    let assigned =
      this.statisticalPlan.numberStudentsInInternshipCourse -
      this.statisticalPlan.numberstudentsUnAssigned;
    this.chartData = [
      this.statisticalPlan.numberTeachersInInternshipCourse,
      this.statisticalPlan.numberStudentsInInternshipCourse,
      this.statisticalPlan.numberstudentsUnAssigned,
      assigned,
    ];
    this.$forceUpdate();
  },

  methods: {
    createNotifyForUser(internshipCourseId) {
      this.confirmCreateNotify = {
        internshipCourseId: internshipCourseId
      };
    },

    onChangePage(pageOfItemsTeacher) {
      // update page of items
      this.pageOfItemsTeacher = pageOfItemsTeacher;
    },

    getChartStatisticsStudentInClass() {
      for (let student of this.statistiesStudentInClass) {
        let assignedStudent = {
          name: student.className,
          y: student.numberOfStudentAssigned,
        };
        this.assignedStudents.push(assignedStudent);
        let unassignedStudent = {
          name: student.className,
          y: student.numberOfStudentUnAssign,
        };
        this.unassignStudents.push(unassignedStudent);
        this.chartDataStatisticsStudentInClass.push(
          student.numberOfStudentAssigned
        );
        this.labelsDataStatisticsStudentInClass.push(student.className);
      }
    },
    
    async createNotifyForUserAsync(internshipCourseId) {
      this.showLoading();
      const api = new NotificationService();
      const response = await api.createNotifyForUserAsync(
        {internshipCourseId: internshipCourseId.internshipCourseId}
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
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_created_success_default} thông báo`
      );
    },
  },

  watch: {
    statistiesStudentInClass() {
      this.assignedStudents = [];
      this.unassignStudents = [];
      this.getChartStatisticsStudentInClass();
    },
  },
};
</script>