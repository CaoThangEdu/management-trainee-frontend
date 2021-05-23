<template>
<div class="row">
  <div class="col-lg-4 col-md-12 col-sm-12 col-12">
    <TimeLineComponent />
  </div>
  <div class="col-lg-8 col-md-12 col-sm-12 col-12">
    <ListPlanComponent />
  </div>
</div>
</template>

<script>
import ListPlanComponent from '../../../components/PlanComponent/ListPlanComponent/ListPlanComponent'
import TimeLineComponent from '../../../components/PlanComponent/TimeLineComponent/TimeLineComponent'
export default {
  name: 'Plan',
  components: {
    ListPlanComponent,
    TimeLineComponent
  }
}
</script>

<style>

</style>
