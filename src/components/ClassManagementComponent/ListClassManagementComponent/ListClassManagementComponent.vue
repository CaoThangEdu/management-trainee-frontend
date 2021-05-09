<template src='./ListClassManagementComponent.html'>
  
</template>

<script>
import ClassManagementDetailComponent from '../ClassManagementDetailComponent/ClassManagementDetailComponent'
export default {
  name: "ListClassManagementComponent",
  components: { ClassManagementDetailComponent },
  data() {
    return {
      classes: [],
      editClass: {},
    };
  },
  methods:{
    createBrand() {
      this.editClass = {};
    },
    async changeData() {
      // await this.getclassesAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListClassManagementComponent.scss';
</style>