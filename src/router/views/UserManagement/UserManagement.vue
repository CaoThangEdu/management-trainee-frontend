<template>
  <div class="row">
    <div class="col-12">      
         <UserManagementComponent  />
    </div>            
  </div>
</template>

<script>
import UserManagementComponent from "../../../components/UserManagementComponent/UserManagementComponent.vue"
export default {
  components: {
    UserManagementComponent,
  },
  data() {
    return {
    }
  },

  methods: {
  
  },
};
</script>

<style lang="scss">
.wrapCollapse {
  dt {
    display: block;
    a {
      display: block;
      padding: 15px;
      background-color: #adadad;
      color: #fff;
      &:hover {
        text-decoration: none;
      }
      &.active {
        background-color: #3c6382;
        color: #fff;
      }
    }
  }
  dd {
    padding: 0 20px;
    height: 0;
    transition: all 0.5s ease;
    overflow: hidden;
    opacity: 0;
    &.active {
      height: auto;
      padding: 10px 0px;
      opacity: 1;
    }
  }
}
</style>