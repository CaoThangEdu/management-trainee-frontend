<template>
  <div>
    <ListOfStudentsManagedByTheTeacher />
  </div>
</template>

<script>
import ListOfStudentsManagedByTheTeacher from '../../../components/StudentManagementComponent/ListOfStudentsManagedByTheTeacher/ListOfStudentsManagedByTheTeacher.vue';

export default {
  name: "StudentsManagedByTheTeacher",
  components: { ListOfStudentsManagedByTheTeacher },
  data() {
    return {};
  },
}
</script>

<style lang='scss'>

</style>
