<template>
  <div>
    <ListTeacherAssignmentComponent />
    <ListStudentComponent />
  </div>
</template>

<script>
import ListTeacherAssignmentComponent from '../../../components/TeacherAssignmentComponent/ListTeacherAssignmentComponent/ListTeacherAssignmentComponent'
import ListStudentComponent from '../../../components/TeacherAssignmentComponent/ListStudentComponent/ListStudentComponent'
export default {
  components:{ 
    ListTeacherAssignmentComponent,
    ListStudentComponent
  }
}
</script>

<style>

</style>