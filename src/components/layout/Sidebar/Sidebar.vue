<template>
  <CSidebar
    fixed
    :minimize="minimize()"
    :show="show()"
    @update:show="(value) => setSidebarShowData(value)"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 556 134"
      />
      <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 110 134"
      />
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="$options.nav" />
    <CSidebarMinimizer class="d-md-down-none" @click.native="setSidebarMinimizeData(!minimize())" />
  </CSidebar>
</template>

<script>
import nav from "././_nav";
import { mapGetters, mapActions } from "vuex";
import localStorageMixin from "../../../helpers/mixins/localStorageMixin";

export default {
  name: "Sidebar",
  nav,
  mixins: [localStorageMixin],
  props: {
    navLinkProps: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      roles: '',
      navFilter: [],
      navOrigins: [],
    }
  },
  methods: {
    ...mapGetters("layout", ["getSidebarShow", "getSidebarMinimize"]),
    ...mapActions("layout", ["setSidebarShowData", "setSidebarMinimizeData"]),

    show() {
      return this.getSidebarShow();
    },
    minimize() {
      return this.getSidebarMinimize();
    },
    filterNavByRoles(navsFilter, roles) {
      return navsFilter.filter(itemNavLink => {
        if(roles.includes(itemNavLink.role)) {
          return itemNavLink;
        }
      });
    },
    parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },
  },
  created() {
    this.navOrigins = JSON.parse(JSON.stringify(this.navLinkProps));
    this.navFilter = JSON.parse(JSON.stringify(this.navOrigins[0]._children));
    let tokenInfo = localStorageMixin.methods.getLocalStorage('AUTH_TOKEN');
    if(!tokenInfo) {
      nav[0]._children = JSON.parse(JSON.stringify(this.navFilter));
      return;
    }
    let accessToken = tokenInfo.accessToken;
    this.roles = this.parseJwt(accessToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    for (let index = 0; index < this.navFilter.length; index++) {
      if (this.navFilter[index].role) {
        if(!this.roles.includes(this.navFilter[index].role)) {
          this.navFilter.splice(index, 1);
          index = index - 1;
        }
        continue;
      }
      if (this.navFilter[index].items) {
        // filter các phần tử khớp với role của user đang đăng nhập
        this.navFilter[index].items = this.filterNavByRoles(this.navFilter[index].items, this.roles);
      }
      // kiểm tra lại sau khi filter nếu là empty thì remove
      if (this.navFilter[index].items && this.navFilter[index].items.length == 0) {
        this.navFilter.splice(index, 1);
        index = index - 1;
      }
    }
    nav[0]._children = JSON.parse(JSON.stringify(this.navFilter));
  },
};
</script>
