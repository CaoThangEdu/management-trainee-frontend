<template src="./ListStudentManagementComponent.html">
  
</template>

<script>
import CompanyManagementDetailComponent from "../StudentManagementDetailComponent/StudentManagementDetailComponent"
import axios from 'axios'

export default {
  components: {
    CompanyManagementDetailComponent,
  },
  data() {
    return {
      listBrand: [],
      editData: {},
    };
  },
  mounted(){
    this.callApi()
  },
  methods:{
    createBrand() {
      this.editData = {};
    },
    async changeData() {
      // await this.getListBrandAsync();
    },
    async callApi(){
      try{
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
        console.log(res.data)
      } catch(error){
        console.log(error)
      }
    }
  }
}
</script>

<style lang='scss'>
@import './ListStudentManagementComponent.scss';
.btn-add-file{
  margin-right: 10px;
}
</style>