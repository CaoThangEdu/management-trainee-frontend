<template src='./ListTeacherAssignmentComponent.html'></template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import AutomaticAssignment from "../AutomaticAssignment/AutomaticAssignment.vue"
export default {
  name: "ListTeacherAssignmentComponent",
  extends: ComponentBase,
  components: {AutomaticAssignment},
  data() {
    return {
     editCareer: {}
    };
  },
  methods: {
    automaticAssignment(){
       this.editCareer = {};
    }
   
  },
  watch: {
   
  },
};
</script>

<style lang='scss'>
@import "./ListTeacherAssignmentComponent.scss";
</style>