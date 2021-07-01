<template src="./AutomaticAssignment.html"  @getPlan="course = $event"></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"

export default {
  name: "Assigment",
  extends: ComponentBase,
  components: {},
  props: {},

  data() {
    return {};
  },
  created() {},
  async mounted() {
    await this.getStudentsByCourseIdAsync();
  },

  methods: {},
};
</script>

<style lang='scss'>
@import "./AutomaticAssignment.scss";
</style> 