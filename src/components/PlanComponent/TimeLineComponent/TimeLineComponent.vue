<template src='./TimeLineComponent.html'>
</template>

<script>
import TimeLineDetailComponent from "../TimeLineDetailComponent/TimeLineDetailComponent";
export default {
name: "TimeLineComponent",
  components: {
    TimeLineDetailComponent,
  },
  data() {
    return {
      timeLines: [],
      editTimeLine: {},
    };
  },
  methods:{
    createBrand() {
      this.editTimeLine = {};
    },
    async changeData() {
      // await this.gettimeLinesAsync();
    },
  }
}
</script>

<style lang='scss'>
@import './TimeLineComponent.scss';
</style>