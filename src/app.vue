<template>
  <div class="app"
    id="app">
    <Sidebar v-if="!$route.meta.hideSidebar && navLinkProps.length != 0"
      :navLinkProps="navLinkProps" />
    <CWrapper>
      <Header v-if="!$route.meta.hideHeader" />
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition :duration="{ leave: 100, enter: 500 }" name="fade" mode="out-in" appear>
              <router-view></router-view>
            </transition>
          </CContainer>
        </main>
        <Footer v-if="!$route.meta.hideFooter" />
      </div>
    </CWrapper>
    <TheLoading :key="'app-spinner'"/>

    <TheNotifications id="app-notifications" :key="'app-notifications'"/>
  </div>
</template>

<script>
import Sidebar from './components/layout/Sidebar/Sidebar'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import TheLoading from "./components/common/loading/TheLoading"
import TheNotifications from "./components/common/notification/TheNotifications"
import ComponentBase from "./components/common/component-base/ComponentBase"
import { mapGetters, mapActions } from "vuex";
import nav from "./components/layout/Sidebar/_nav";

export default {
  name: 'App',
  extends: ComponentBase,
  nav,
  components: {
    Sidebar,
    Header,
    Footer,
    TheNotifications,
    TheLoading
  },
  data() {
    return {
      navLinkProps: [],
    };
  },

  created() {
    this.navLinkProps = JSON.parse(JSON.stringify(nav));
  },

  async mounted() {
    await this.getUserProfile();
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", { userProfile: "getUserInfo", tokenKey: "getTokenKey" }),
  },
  
  methods: {
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),

    async getUserProfile() {
      // Check: if has token => get profile else push to LoginPage
      if (this.tokenKey) {        
        if (!this.userProfile || !this.userProfile.id) {
          await this.updateUserInfoDataAsync();
        }
      } else {
        if (this.$route.name !== "login") {
          this.$router.push({ name: "login" });
        }
      }
    }
  },

}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
