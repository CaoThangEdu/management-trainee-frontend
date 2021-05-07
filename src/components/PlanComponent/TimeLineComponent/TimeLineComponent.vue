<template src='./TimeLineComponent.html'>
</template>

<script>
import TimeLineDetailComponent from "../TimeLineDetailComponent/TimeLineDetailComponent";
export default {
name: "ListPlan",
  components: {
    TimeLineDetailComponent,
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
@import './TimeLineComponent.scss';
</style>