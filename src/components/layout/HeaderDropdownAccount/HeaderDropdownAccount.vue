<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            src="img/avatars/6.jpg"
            class="c-avatar-img "
            alt="avatar"
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Cài đặt</strong>
    </CDropdownHeader>
    <CDropdownItem
      @click="$router.push({ name: 'ProfileUserLogged' })">
      <CIcon name="cil-user" /> Thông tin cá nhân
    </CDropdownItem>
    <CDropdownItem
      @click="$router.push({ name: 'changePassword' })">
      <CIcon name="cil-lock-locked" />
        Đổi mật khẩu
    </CDropdownItem>
    <!-- <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-dollar" /> Payments
      <CBadge color="secondary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem> -->
    <CDropdownDivider/>
    <CDropdownItem @click="logoutAccount">
      <CIcon name="cil-account-logout" /> Đăng xuất
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'HeaderDropdownAccount',
  data () {
    return { 
      itemsCount: 42
    }
  },
  methods: {
    ...mapActions("user", {
      logout: "updateUserInfoDataWhileLogout",
    }),
    /**
     * Logout Account Event
     */
    logoutAccount() {
      this.logout();
      localStorage.removeItem('AUTH_TOKEN');
      this.$router.push({ name: "login" })
    }
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", { userProfile: "getUserInfo", tokenKey: "getTokenKey" }),
  },
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>