<template>
  <div class="select-classes-object">
    <div class="form-row filter-wrapper ml-2 mr-2">
      <div class="label-select"
        v-for="(classeChecked, index) in classesId"
        :key="index + 'classeChecked'">
        <div class="label-select__name"> {{ classeChecked.className }}
          <span
            @click="removeCheckedClass(classeChecked)">
            <em class="fas fa-times label-select__icon"></em>
          </span>
        </div>        
      </div>
      <div v-show="classesId == null || classesId.length === 0"
        class="text--red text--italic mb-2">
        Vui lòng chọn lớp
      </div>
    </div>
    <div class="table-responsive table-hover">
      <table class="table">
        <thead class="">
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Tên lớp</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(classroom, index) in pageOfClassroom"
            :key="index + 'classe'"
            @click="selectCheckboxClass(classroom)"
            class="cursor-pointer"
          >
            <th scope="row">{{ index + 1 }}</th>
            <td>
              {{ classroom.className }}
            </td>
          </tr>

          <tr v-show="pageOfClassroom == null || pageOfClassroom.length === 0">
            <th id="" colspan="5" class="text-left">
              Không có dữ liệu nào được tìm thấy.
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex justify-content-center text--blue"
      v-if="pageOfClassroom != null || pageOfClassroom.length !== 0">
      <JwPagination
        :items="resultQuery"
        @changePage="onChangePageClasse"
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
  name: "SelectClassesObject",
  extends: ComponentBase,
  components: {
    JwPagination,
  },
  mixins: [ CrudMixin ],
  props: {
    classes: {
      type: Array,
      default: null,
    },
    selectObject: {
      type: String,
      default: null,
    },
    notifyObjectEnum: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageOfClassroom: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      classesId: [],
      classesProps: [],
      searchQuery: null,
    };
  },
  mounted() {
    this.classesProps = JSON.parse(JSON.stringify(this.classes));
  },
  methods: {
    selectCheckboxClass(classroom) {
      let isExist = this.classesId.find(id => id == classroom);
      if(isExist) {
        this.$emit("send-classes-id", this.classesId);
        return;
      }
      this.classesId.push(classroom);
      this.$emit("send-classes-id", this.classesId);
    },

    onChangePageClasse(pageOfClassroom) {
      this.pageOfClassroom = pageOfClassroom;
    },

    removeCheckedClass(classeChecked) {
      this.classesId = this.classesId.filter(
        classe => classe !== classeChecked
      );
      this.$emit("send-classes-id", this.classesId);
    },
  },
  
  computed: {
    resultQuery(){
      if(this.searchQuery){
        return this.classesProps.filter((item) => {
          let searchKey = CrudMixin.methods.removeAccent(this.searchQuery.toLowerCase());
          let classeItem = CrudMixin.methods.removeAccent(item.className.toLowerCase());
          return searchKey.split(' ').every(
            v => classeItem.includes(v)
          );
        })
      }
      return this.classesProps;
    }
  },

  watch: {
    classes() {
      this.classesProps = JSON.parse(JSON.stringify(this.classes));
    },
    selectObject() {
      if(this.selectObject == this.notifyObjectEnum.ALL.value) {
        this.classesId = [];
      }
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