<template src='./ListStudentComponent.html'>
  
</template>

<script>
export default {
  name: "ListStudentComponent",
  components: {},
  data() {
    return {
      students: [],
      editStudent: {},
    };
  },
  methods:{
    createBrand() {
      this.editStudent = {};
    },
    async changeData() {
      // await this.getStudentsAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './ListStudentComponent.scss';
</style>