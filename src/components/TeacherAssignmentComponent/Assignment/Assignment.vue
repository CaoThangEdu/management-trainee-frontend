<template @getPlan="course = $event">
<div class="assignment">
  <div class="statistics-students">
    <Statistical
      v-if="statisticalPlan && studentInInternshipCourse"
      v-bind:internshipCourseId="internshipCourseId"
      v-bind:studentInInternshipCourse="studentInInternshipCourse"
      v-bind:classes="classes"
      v-bind:teachers="teachers"
      v-bind:statisticalPlan="statisticalPlan"
      :statistiesStudentInClass="statistiesStudentInClass"
     />
  </div>
  <div class="student-assignment mb-4">
    <Tabs>
      <Tab name="Danh sách sinh viên đã được phân công" :selected="true">
        <ListTeacherAssignmentComponent
          class="tab-students-assign"
          v-if="reloadAutomaticAssignment"
          v-bind:studentInInternshipCourse="studentInInternshipCourse"
          v-bind:internshipCourseId="internshipCourseId"
          v-bind:classes="classes"
          v-bind:teachers="teachers" 
          @change-instructors="changeInstructors"         
        />
      </Tab>
      <Tab name="Phân công">
        <ManualAssignment 
          class="tab-students-assign"
          v-if="reloadAutomaticAssignment"
          v-bind:internshipCourseId="internshipCourseId"
          v-bind:classes="classes"
          v-bind:teachers="teachers"
          @change-instructors="changeInstructors"
        />
      </Tab>
      <Tab name="Phân công tự động">
        <AutomaticAssignment
          class="tab-students-assign"
          v-if="reloadAutomaticAssignment"
          v-bind:internshipCourseId="internshipCourseId"
          v-bind:classes="classes"
          v-bind:teachers="teachers"
          v-bind:instructors="instructors"
          v-bind:students="students"
          v-bind:numberOfStudentInInternshipCourse="studentInInternshipCourse.length"
          @change-instructors="changeInstructors"
          :statistiesStudentInClass="statistiesStudentInClass"
        />
      </Tab>
    </Tabs>
  </div>
</div>

</template>

<script>
import ListTeacherAssignmentComponent from "../ListTeacherAssignmentComponent/ListTeacherAssignmentComponent.vue";
import TeacherService from "../../../services/teacher/teacherServices";
import ComponentBase from "../../common/component-base/ComponentBase";
import Tabs from "../../common/tab-comp/tabs/tabs.vue";
import Tab from "../../common/tab-comp/tab/tab.vue";
import ManualAssignment from "../ManualAssignment/ManualAssignment.vue";
import Statistical from "../Statistical/Statistical.vue";
import ClassService from "../../../services/class/classServices";
import AppConfig from "../../../../src/app.config.json";
import AutomaticAssignment from "../AutomaticAssignment/AutomaticAssignment.vue";
import InstructorService from "../../../services/instructor/instructorService";
import StudentService from "../../../services/student/studentServices";
import PlanService from "../../../services/plan/planServices";

export default {
  name: "Assigment",
  extends: ComponentBase,
  components: {
    ListTeacherAssignmentComponent,
    ManualAssignment,
    Tabs,
    Tab,
    Statistical,
    AutomaticAssignment,
  },
  props: {
    internshipCourseId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      instructors: [],
      teachers: [],
      classes: [],
      students: [],
      studentInInternshipCourse: [],
      studentsUnassigned: {
        internshipCourseId: "",
        classId: "",
      },
      classIdFilter: "",
      course: [],
      classFilter: {
        className: "",
        status: "",
        internshipCourseId: "",
      },
      filterTeacher: {
        internshipCourseId: "",
      },
      listInstructorRequest: [],
      reloadAutomaticAssignment: true,
      classId: "",
      teacherId: "",
      statisticalPlan: null,
      statistiesStudentInClass: [],
    };
  },
  async mounted() {
    await this.getInstructorsAsync();
    await this.getClassesAsync();
    await this.getTeachersAsync();
    await this.getStudentsUnassigned();
    await this.getStudentsInInternshipCourseAsync();
    await this.getPlanService();
    await this.getStatisticsStudentInClass();
  },

  methods: {
    async getStatisticsStudentInClass() {
      this.showLoading();
      const api = new ClassService();
      const response = await api.getStatisticalClassUnassigned(
        {internshipCourseId: this.internshipCourseId}
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
      this.statistiesStudentInClass = response.data;
    },
    async changeInstructors(changeInstructors) {
      if (changeInstructors) {
        await this.getInstructorsAsync();
        await this.getStudentsUnassigned();
        await this.getStudentsInInternshipCourseAsync();
        await this.getStatisticsStudentInClass();
        this.reloadAutomaticAssignment = false;
        this.$nextTick(() => {
          this.reloadAutomaticAssignment = true;
        });
      }
    },

    async getStudentsUnassigned() {
      // Call Api
      this.showLoading();
      const api = new StudentService();
      this.studentsUnassigned.internshipCourseId = this.internshipCourseId;
      const response = await api.getStudentUnassignedAsync(
        this.studentsUnassigned
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
    
    async getInstructorsAsync() {
      const api = new InstructorService();
      this.instructorRequest = {
        internshipCourseId: this.internshipCourseId,
        classId: "",
        teacherId: "",
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
    async getPlanService() {
      // Call Api
      this.showLoading();
      const api = new PlanService();

      const response = await api.getPlanByIdAsync(this.internshipCourseId);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }

      this.statisticalPlan = {
        courseName: response.data.courseName,
        internshipCourseName: response.data.internshipCourseName,
        description: response.data.description,
        startDay: response.data.startDay,
        endDay: response.data.endDay,
        status: response.data.status,
        numberStudentsUnassigned:
        this.studentInInternshipCourse.length - this.instructors.length,
        numberStudentsInInternshipCourse: this.studentInInternshipCourse.length,
        numberTeachersInInternshipCourse: this.teachers.length,
      };
    },

    async getClassesAsync() {
      // Call Api
      this.showLoading();
      const api = new ClassService();
      this.classFilter.internshipCourseId = this.internshipCourseId;
      const response = await api.getClassesFilterAsync(this.classFilter);
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

    async getTeachersAsync() {
      // Call Api
      this.showLoading();
      const api = new TeacherService();
      this.filterTeacher.internshipCourseId = this.internshipCourseId;
      const response = await api.getTeachersInInternshipCourse(
        this.filterTeacher
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
      this.teachers = response.data;

      if(this.teachers.length === 0){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          "Hiện tại chưa có giáo viên. Vui lòng thêm giáo viên !"
        );
      }
    },

    async getStudentsInInternshipCourseAsync() {
      // Call Api
      this.showLoading();
      const api = new StudentService();
      this.filterTeacher.internshipCourseId = this.internshipCourseId;
      const response = await api.getStudentsInInternshipCourse(
        this.filterTeacher
      );
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
      this.studentInInternshipCourse = response.data;
    },
  },
};
</script>

<style lang='scss'>
.is-active {
    color: white;
    background-color: #4e3bcd;
    .nav-link {
        border-color: #d8dbe0 #d8dbe0 #c4c9d0;
    }
}

.student-assignment {
    background-color: white;
}

.tab-students-assign {
    transition: all 0.35s ease-in-out 0s;
}
</style> 