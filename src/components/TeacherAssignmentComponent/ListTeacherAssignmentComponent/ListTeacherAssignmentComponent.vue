<template src='./ListTeacherAssignmentComponent.html'>
  
</template>

<script>
import SelectTeacher from "../../common/form/select-teacher/SelectTeacher.vue";
import TeacherAssignmentDetailComponent from '../TeacherAssignmentDetailComponent/TeacherAssignmentDetailComponent'

export default {
  name: "ListTeacherAssignmentComponent",
  components: {
     TeacherAssignmentDetailComponent,
     SelectTeacher
  },
  data() {
    return {
      listBrand: [],
      editTeacher: {},
      classId: "",
      teacherId: ""
    };
  },
  props: {
   classes: {
      type: Array,
    },
    teachers: {
      type: Array,
    },
  },
  methods:{
    createBrand() {
      this.editTeacher = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
    changeClassName() {
      console.log(this.classes)
    },
    changeTeacher(){

    }
  }
}
</script>

<style lang='scss'>
@import './ListTeacherAssignmentComponent.scss';
</style>