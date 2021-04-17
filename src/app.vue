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
  </div>
</template>

<script>
import Sidebar from './components/layout/Sidebar/Sidebar'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
    Footer
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
