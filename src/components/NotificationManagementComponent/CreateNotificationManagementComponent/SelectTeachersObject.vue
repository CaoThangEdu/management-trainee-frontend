<template>
  <div class="select-teachers-object">
    <div class="form-row filter-wrapper ml-2 mr-2">
      <div class="label-select"
        v-for="(teacherChecked, index) in teachersEmailChecked"
        :key="index + 'teacherChecked'">
        <div class="label-select__name"> {{ teacherChecked }}
          <span
            @click="removeCheckedTeacher(teacherChecked)">
            <em class="fas fa-times label-select__icon"></em>
          </span>
        </div>        
      </div>
      <div v-show="teachersEmailChecked == null || teachersEmailChecked.length === 0"
        class="text--red text--italic mb-2">
        Vui lòng chọn giáo viên
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
            v-for="(teacher, index) in pageOfTeachers"
            :key="index + 'teacher'"
            @click="selectCheckboxTeacher(teacher.email)"
            class="cursor-pointer"
          >
            <th scope="row">{{ index + 1 }}</th>
            <td>
              {{ teacher.firstName + " " + teacher.lastName }}
            </td>
            <td>{{ teacher.email }}</td>
          </tr>

          <tr v-show="pageOfTeachers == null || pageOfTeachers.length === 0">
            <th id="" colspan="5" class="text-left">
              Không có dữ liệu nào được tìm thấy.
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex justify-content-center text--blue"
      v-if="pageOfTeachers != null || pageOfTeachers.length !== 0">
      <JwPagination
        :items="resultQuery"
        @changePage="onChangePageTeacher"
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
  name: "SelectTeachersObject",
  extends: ComponentBase,
  components: {
    JwPagination,
  },
  mixins: [ CrudMixin ],
  props: {
    teachers: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      pageOfTeachers: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      teachersEmailChecked: [],
      teachersProps: [],
      searchQuery: null,
    };
  },
  mounted() {
    this.teachersProps = JSON.parse(JSON.stringify(this.teachers));
  },
  methods: {
    selectCheckboxTeacher(emailTeacher) {
      let isExist = this.teachersEmailChecked.find(email => email == emailTeacher);
      if(isExist) {
        this.$emit("send-teachers-email", this.teachersEmailChecked);
        return;
      }
      this.teachersEmailChecked.push(emailTeacher);
      this.$emit("send-teachers-email", this.teachersEmailChecked);
    },

    onChangePageTeacher(pageOfTeachers) {
      this.pageOfTeachers = pageOfTeachers;
    },

    removeCheckedTeacher(teacherChecked) {
      this.teachersEmailChecked = this.teachersEmailChecked.filter(
        teacher => teacher !== teacherChecked
      );
      this.$emit("send-teachers-email", this.teachersEmailChecked);
    },
  },
  
  computed: {
    resultQuery(){
      if(this.searchQuery){
        return this.teachersProps.filter((item) => {
          let searchKey = CrudMixin.methods.removeAccent(this.searchQuery);
          let teacherItem = CrudMixin.methods.removeAccent(item.lastName);
          return searchKey.toLowerCase().split(' ').every(
            v => teacherItem.toLowerCase().includes(v)
          );
        })
      }
      return this.teachersProps;
    }
  },

  watch: {
    teachers() {
      this.teachersProps = JSON.parse(JSON.stringify(this.teachers));
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