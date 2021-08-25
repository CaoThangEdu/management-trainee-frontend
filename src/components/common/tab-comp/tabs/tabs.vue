<template>
  <div>
    <div class="tabs">
      <ul class="nav nav-tabs">
        <li
          class="nav-item"
          v-for="(tab, index) in tabs"
          :class="{ 'is-active': tab.isActive }"
          :key="index + 'tab'"
        >
          <a @click.stop.prevent="selectTab(tab)"
            class="nav-link">{{ tab.name }}</a>
        </li>
      </ul>
    </div>

    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { tabs: [] };
  },

  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name == selectedTab.name;
      });
    },
  },
};
</script>

<style lang="scss">
.tabs {
    cursor: pointer;
}
.is-active {
    color: blue;
    .nav-link {
        border-color: #d8dbe0 #d8dbe0 #c4c9d0;
    }
}
</style>