<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <header class="text-center card-header text-white bg-info">
          Chi tiết sinh viên
        </header>
        <div class="card-body">
           <div class="form-row">
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label class="font-weight-bold">MSSV: </label>
                {{ getStudentDetail.studentCode?getStudentDetail.studentCode:'...' }}
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label class="font-weight-bold">Họ tên: </label>
                {{ getStudentDetail.firstname?`${getStudentDetail.firstname} ${getStudentDetail.lastname}`:'...' }}      
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label class="font-weight-bold">Lớp: </label>
                {{ getStudentDetail.className?getStudentDetail.className:'...' }}
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6">
                <label class="font-weight-bold">Email: </label>
                {{ getStudentDetail.email?getStudentDetail.email:'...' }}
              </div>
              <div class="form-group col-sm-12 col-md-12 col-lg-12">
                <label class="font-weight-bold">Đợt thực tập: </label>
                {{ getStudentDetail.internshipCourseName?getStudentDetail.internshipCourseName:'...' }} 
              </div>
              
            </div>
          <div class="table-responsive table-hover">
            <figure class="mb-0">
              <figcaption class="caption-table mb-2 font-weight-bold">
                <h5 class="text-center">Báo cáo hàng tuần</h5>
              </figcaption>
              <table class="table">
                <thead class="">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu đề báo cáo</th>
                    <th scope="col">Mô tả</th>
                    <th scope="col">Ngày nộp</th>
                    <th scope="col">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in (getStudentDetail.weeklyReport?getStudentDetail.weeklyReport:[])"
                    :key="index + 'student'">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{student.title}}</td>
                    <td>{{student.description}}</td>
                    <td>{{student.creationTime}}</td>
                    <td>Xem báo cáo</td>
                  </tr>
                  <tr v-if="Object.keys(getStudentDetail).length == 0">
                    <th colspan="5" class="text-left">
                      ...
                    </th>
                  </tr>
                  <tr v-if="Object.keys(getStudentDetail).length != 0 ||
                    (getStudentDetail.weeklyReport && getStudentDetail.weeklyReport.length == 0)">
                    <th colspan="5" class="text-left">
                      Sinh viên chưa có báo cáo hàng tuần
                    </th>
                  </tr>
                </tbody>
              </table>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "WeeklyReportOfStudentDetail",
  extends: ComponentBase,
  mixins: [CrudMixin],
  props: {
    studentDetail: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    getStudentDetail() {
      return this.studentDetail;
    }
  },
};
</script>
