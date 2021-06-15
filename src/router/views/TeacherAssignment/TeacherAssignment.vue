<template>
  <div>
    <ListPlanFilterComponent 
      @getPlan="getPlan"
      v-if="renderListPlanFilter" />
    <Assignment
      v-if="renderAssignment"
      :Plan="plan" />
  </div>
</template>

<script>
import ListPlanFilterComponent from '../../../components/TeacherAssignmentComponent/ListPlanFilterComponent/ListPlanFilterComponent';
import Assignment from '../../../components/TeacherAssignmentComponent/Assignment/Assignment.vue';

export default {
  components:{ 
    ListPlanFilterComponent, 
    Assignment 
  },
  data() {
    return{
      renderListPlanFilter: true,
      renderAssignment: false,
      plan: null,
    }
  },

  methods: {
    getPlan(e) {
      this.plan = e;
      console.log(e);
      this.renderListPlanFilter = false;
      this.renderAssignment = true;
    }
  }
}
</script>

<style>

</style>