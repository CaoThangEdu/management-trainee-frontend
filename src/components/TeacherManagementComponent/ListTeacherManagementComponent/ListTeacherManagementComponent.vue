<template src="./ListTeacherManagementComponent.html">
  
</template>

<script>
import CompanyManagementDetailComponent from "../TeacherManagementDetailComponent/TeacherManagementDetailComponent"
export default {
  components: {
    CompanyManagementDetailComponent,
  },
  data() {
    return {
      listBrand: [],
      editTeacher: {},
    };
  },
  methods:{
    createBrand() {
      this.editTeacher = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListTeacherManagementComponent.scss';
.btn-add-file{
  margin-right: 10px;
}
</style>