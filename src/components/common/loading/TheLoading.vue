<template>
    <CElementCover v-show="isShowLoading" id="v-spinner" :opacity="0.8">
      <CSpinner style="width:3rem;height:3rem;position: fixed;" color="primary" />
    </CElementCover>
</template>

<script>
import { mapGetters } from 'vuex'
export default {  
  name: 'DotLoader',
  props: {
    color: { 
      type: String,
      default: '#5dc596'
    },
    size: {
      type: String,
      default: '60px'
    },
    margin: {
      type: String,
      default: '2px'
    },
    radius: {
      type: String,
      default: '100%'
    }
  },
  computed: {
    ...mapGetters("layout", { isShowLoading: "getIsShowLoading" }),
   
    spinnerStyle () {
      return {
        backgroundColor: this.color,
        height: parseFloat(this.size)/2 + 'px',
        width: parseFloat(this.size)/2 + 'px',
        borderRadius: this.radius
      }
    },
    spinnerBasicStyle () {
      return {
        height: this.size,
        width: this.size,
        position: 'relative'
      }
    }
  },
  
}
</script>