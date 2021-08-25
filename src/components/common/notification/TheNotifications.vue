<template>
  <notifications position="top right">
    <template slot="body" slot-scope="props">
        <div class="notification-header" :class="props.item.type">
          <strong class="notification-title">{{props.item.title}}</strong>
          <button class="notification-close" type="button" @click="props.close">&times;</button>
        </div>
        <div class="notification-content">
          <p class="notification-text" v-html="props.item.text"></p>
          <!-- <div>{{props}}</div> -->
        </div>
    </template>
  </notifications>
</template>

<script>
export default {
  name: "TheNotifications",
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      count: 1,
    };
  },
  methods: {
  },
  computed: {
  },
  updated() {
  },
};
</script>

<style lang="scss">
@import "./TheNotifications.scss";
</style>