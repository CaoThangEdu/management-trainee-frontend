<template src="./ListStudentManagementComponent.html">
  
</template>

<script>
import CompanyManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
export default {
  components: {
    CompanyManagementDetailComponent,
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
@import './ListStudentManagementComponent.scss';
.btn-add-file{
  margin-right: 10px;
}
</style>