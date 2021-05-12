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
      editCompany: {},
    };
  },
  methods:{
    createBrand() {
      this.editCompany = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
  }
}
</script>

<style>

</style>