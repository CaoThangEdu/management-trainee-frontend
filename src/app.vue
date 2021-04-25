<template>
  <div class="c-app">
    <Sidebar/>
    <CWrapper>
      <Header/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <Footer/>
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

export default {
  name: 'App',
  extends: ComponentBase,
  components: {
    Sidebar,
    Header,
    Footer,
    TheNotifications,
    TheLoading
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
