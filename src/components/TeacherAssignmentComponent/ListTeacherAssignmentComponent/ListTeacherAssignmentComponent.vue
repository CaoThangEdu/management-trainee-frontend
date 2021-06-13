<template src='./ListTeacherAssignmentComponent.html'>
  
</template>

<script>
import TeacherAssignmentDetailComponent from '../TeacherAssignmentDetailComponent/TeacherAssignmentDetailComponent'

export default {
  name: "ListTeacherAssignmentComponent",
  components: {
    TeacherAssignmentDetailComponent
  },
  data() {
    return {
      listBrand: [],
      editData: {},
    };
  },
  methods:{
    createBrand() {
      this.editData = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListTeacherAssignmentComponent.scss';
</style>