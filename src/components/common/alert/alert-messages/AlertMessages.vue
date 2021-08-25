<template>
  <div class="show-messages" v-show="isShow && messages.length > 0">
    <div :class="`alert alert-${getAlertClassByType} mt-2 text-left`" role="alert">
      <button type="button" aria-label="Close" class="close" @click="isShow = false">×</button>
      <p class="m-1" v-for="(msg, index) in messages" :key="index" v-html="msg"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlertMessages",
  props: {
    type: {
      type: String,
      default: "error",
    },
    messages: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      isShow: false
    };
  },

  methods: {
  },
  computed: {
    getAlertClassByType() {
      switch (this.type) {
        case 'error':
          return 'danger';
        case 'success':
          return 'success';
        case 'warning':
          return 'warning';
      
        default:
          return 'primary';
      }
    }
  },
  watch: { 
    messages() {
      this.isShow = true; // Show alert
    }
  }
};
</script>

<style lang="scss">
.show-messages {
  span {
    font-weight: 700 !important;
  }
}
</style>>
