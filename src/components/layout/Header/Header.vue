<template>
  <header class="c-header c-header-light c-header-fixed c-header-with-subheader">
    <CToggler in-header class="ml-3 d-lg-none" @click="setToggleSidebarMobile()" />
    <CToggler in-header class="ml-3 d-md-down-none" @click="setToggleSidebarDesktop()" />
    <a href class="c-header-brand d-lg-none mx-auto router-link-active">IT CAO THANG</a>
    <ul class="c-header-nav d-md-down-none mr-auto">
      <li class="c-header-nav-item px-3">
        <a href="#" class="c-header-nav-link">Dashboard</a>
      </li>
      <li class="c-header-nav-item px-3">
        <a href="#" class="c-header-nav-link">Users</a>
      </li>
      <li class="c-header-nav-item px-3">
        <a href="#" class="c-header-nav-link">Settings</a>
      </li>
    </ul>
    <ul class="c-header-nav mr-4">
      <li class="c-header-nav-item d-md-down-none mx-2 navbar__item--has-notify">
        <a href="#" class="c-header-nav-link">
          <CIcon name="cil-bell" />
        </a>
        <NotificationsHeader />
      </li>
      <li class="c-header-nav-item d-md-down-none mx-2">
        <a href="#" class="c-header-nav-link">
          <CIcon name="cil-list" />
        </a>
      </li>
      <li class="c-header-nav-item d-md-down-none mx-2">
        <a href="#" class="c-header-nav-link">
          <CIcon name="cil-envelope-open" />
          <HeaderDropdownAccount />
        </a>
      </li>
    </ul>
    <CSubheader class="px-3">
      <CBreadcrumb class="border-0 mb-0" :items="breadCrumbList" />
    </CSubheader>
  </header>
</template>

<script>
import HeaderDropdownAccount from "../HeaderDropdownAccount/HeaderDropdownAccount";
import { mapActions } from "vuex";
import NotificationsHeader from './NotificationsHeader.vue';

export default {
  name: "Header",
  components: {
    HeaderDropdownAccount,
    NotificationsHeader,
  },

  data() {
    return {
      breadCrumbList: []
    }
  },

  methods: {
    ...mapActions("layout", [
      "setToggleSidebarMobile",
      "setToggleSidebarDesktop",
    ]),
  },
  watch : {
    '$route': {
      immediate: true,
      handler: function () {
        this.breadCrumbList = [];
        this.$route.matched.forEach(item => {
          let path = item.path;
          let arrPaths = path.split("/");
          // Replace params in query string
          for (const subPath of arrPaths) {
            if(subPath.indexOf(':') != -1) {
              for (const key in this.$route.params) {
                if (subPath === ':' + key) {
                  path = path.replace(subPath, this.$route.params[key]);
                }
              }
            }
          }
          let name = item.name;
          if (item.meta.breadcrumbName) {
            name = item.meta.breadcrumbName;
          }
          this.breadCrumbList.push({
            text: name,
            to: path
          });
        });
        // Remove link duplicated
        for (let index = this.breadCrumbList.length - 1; index > 0; index--) {
          if (this.breadCrumbList[index].to === (this.breadCrumbList[index - 1].to + '/')) {
            this.breadCrumbList.splice(index - 1, 1);
          }
        }
      }
    }
  }
};
</script>
<style lang="scss">
@import './NotificationsHeader.scss';
</style>
