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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in pageOfItems" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ item.studentId }}</td>
                <td>{{ item.firstName + ' ' + item.lastName }}</td>
                <td v-if="students.length != 0 && classes.length != 0 && getInfoObject(item.classId, classes)">
                  {{ getInfoObject(item.classId, classes).className }}
                </td>
                <td>{{ item.email }}</td> 
                <td
                  v-if="students.length != 0 && classes.length != 0 && plans.length != 0 
                  && getInfoObject(item.classId, classes)">
                  {{ getInfoByCourseId(getInfoObject(item.classId, classes).courseId, plans) ? getInfoByCourseId(getInfoObject(item.classId, classes).courseId, plans).internshipCourseName : 'Chưa có đợt' }}
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

      <div class="card-footer d-flex justify-content-center text--blue">
        <JwPagination
          :items="students"
          @changePage="onChangePage"
          :labels="customLabels"
          :pageSize="10">
        </JwPagination>  
      </div>
    </div>
  </div>  
</div>
  
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import StudentService from '../../../services/student/studentServices'
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import CrudMixin from "../../../helpers/mixins/crudMixin";
import SelectPlan from '../../../components/common/form/select-plan/SelectPlan.vue';
import SelectClassroom from '../../../components/common/form/select-classroom/SelectClassroom.vue';

export default {
  name: "ListOfStudentsManagedByTheTeacher",
  extends: ComponentBase,
  components: {
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
  }
}
</script>