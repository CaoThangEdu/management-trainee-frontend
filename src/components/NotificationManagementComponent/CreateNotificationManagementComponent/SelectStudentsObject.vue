<template>
  <div class="select-students-object">
    <div class="form-row filter-wrapper ml-2 mr-2">
      <div class="label-select"
        v-for="(studentChecked, index) in studentsEmailChecked"
        :key="index + 'studentChecked'">
        <div class="label-select__name"> {{ studentChecked }}
          <span
            @click="removeCheckedStudent(studentChecked)">
            <em class="fas fa-times label-select__icon"></em>
          </span>
        </div>        
      </div>
      <div v-show="studentsEmailChecked == null || studentsEmailChecked.length === 0"
        class="text--red text--italic mb-2">
        Vui lòng chọn sinh viên
      </div>
    </div>
    <div class="form-row filter-wrapper ml-0 mr-0">
      <div class="col-xl-3 col-md-3 col-sm-12 mb-sm-2">
        <input
          type="text"
          class="form-control"
          id="keywords"
          placeholder="Nhập từ khóa theo tên"
          v-model="searchQuery"
        />
      </div>
    </div>
    <div class="table-responsive table-hover">
      <table class="table">
        <thead class="">
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Họ và tên</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, index) in pageOfstudents"
            :key="index + 'student'"
            @click="selectCheckboxStudent(student.email)"
            class="cursor-pointer"
          >
            <th scope="row">{{ index + 1 }}</th>
            <td>
              {{ student.firstName + " " + student.lastName }}
            </td>
            <td>{{ student.email }}</td>
          </tr>

          <tr v-show="pageOfstudents == null || pageOfstudents.length === 0">
            <th id="" colspan="5" class="text-left">
              Không có dữ liệu nào được tìm thấy.
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex justify-content-center text--blue"
      v-if="pageOfstudents != null || pageOfstudents.length !== 0">
      <JwPagination
        :items="resultQuery"
        @changePage="onChangePagestudent"
        :labels="customLabels"
        :pageSize="10"
      >
      </JwPagination>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../../../components/common/component-base/ComponentBase";
import JwPagination from "jw-vue-pagination";
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: "SelectStudentsObject",
  extends: ComponentBase,
  components: {
    JwPagination,
  },
  mixins: [ CrudMixin ],
  props: {
    students: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      pageOfstudents: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      studentsEmailChecked: [],
      studentsProps: [],
      searchQuery: null,
    };
  },
  mounted() {
    this.studentsProps = JSON.parse(JSON.stringify(this.students));
  },
  methods: {
    selectCheckboxStudent(emailstudent) {
      let isExist = this.studentsEmailChecked.find(email => email == emailstudent);
      if(isExist) {
        this.$emit("send-students-email", this.studentsEmailChecked);
        return;
      }
      this.studentsEmailChecked.push(emailstudent);
      this.$emit("send-students-email", this.studentsEmailChecked);
    },

    onChangePagestudent(pageOfstudents) {
      this.pageOfstudents = pageOfstudents;
    },

    removeCheckedStudent(studentChecked) {
      this.studentsEmailChecked = this.studentsEmailChecked.filter(
        student => student !== studentChecked
      );
      this.$emit("send-students-email", this.studentsEmailChecked);
    },
  },
  
  computed: {
    resultQuery(){
      if(this.searchQuery){
        return this.studentsProps.filter((item) => {
          let searchKey = CrudMixin.methods.removeAccent(this.searchQuery);
          let studentItem = CrudMixin.methods.removeAccent(item.lastName);
          return searchKey.toLowerCase().split(' ').every(
            v => studentItem.toLowerCase().includes(v)
          );
        })
      }
      return this.studentsProps;
    }
  },

  watch: {
    students() {
      this.studentsProps = JSON.parse(JSON.stringify(this.students));
    }
  }
};
</script>

<style lang="scss">
.label-select {
  margin: 0px 3px 10px;
  display: flex;
  padding: 5px 30px 5px 15px;
  background-color: #2196F3;
  color: white;
  border-radius: 20px;
  position: relative;

  .label-select__icon {
    position: absolute;
    top: 35%;
    right: 15px;
    cursor: pointer;
  }
}
</style>