<template src="./RegisteredInternshipReferralsComponent.html">
  
</template>

<script>
import RegisteredInternshipReferralsDetailComponent from "../RegisteredInternshipReferralsDetailComponent/RegisteredInternshipReferralsDetailComponent"
export default {
  components: {
    RegisteredInternshipReferralsDetailComponent,
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
@import './RegisteredInternshipReferralsComponent.scss';
</style>