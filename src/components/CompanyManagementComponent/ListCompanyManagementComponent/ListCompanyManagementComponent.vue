<template src="./ListCompanyManagementComponent.html">
  
</template>

<script>
import CompanyManagementDetailComponent from "../CompanyManagementDetailComponent/CompanyManagementDetailComponent"
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

<style>

</style>