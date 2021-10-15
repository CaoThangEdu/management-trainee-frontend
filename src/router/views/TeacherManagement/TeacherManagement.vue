<template>
    <div>
        <ListTeacherManagement :internshipCourseId="internshipCourseId"/>
    </div>
</template>
<script>
import ListTeacherManagement from '../../../components/TeacherManagementComponent/ListTeacherManagementComponent/ListTeacherManagementComponent.vue'
export default {
    props:{internshipCourseId:String},
    components:{
        ListTeacherManagement
    }
    
}
</script>

<style lang="scss">
    
</style>