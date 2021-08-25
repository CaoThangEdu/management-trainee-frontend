<template src="./planningStepsComponent.html">
 
</template>

<script>
export default {
  name: "BookSteps",
  props:{
    isActiveStep:String
  },
  data() {
    return {
      isActive:this.isActiveStep
    };
  },
};
</script>

<style lang="scss">
@import "./planningStepsComponent.scss";
</style>
