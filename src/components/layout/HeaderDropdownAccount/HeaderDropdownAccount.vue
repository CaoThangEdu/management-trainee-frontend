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
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Thông tin cá nhân
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-shield-alt" />
        <router-link :to="{name:'changePassword'}">
          Đổi mật khẩu
        </router-link>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-dollar" /> Payments
      <CBadge color="secondary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem @click="logoutAccount">
      <CIcon name="cil-lock-locked" /> Đăng xuất
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'HeaderDropdownAccount',
  data () {
    return { 
      itemsCount: 42
    }
  },
  methods: {
    /**
     * Logout Account Event
     */
    logoutAccount() {
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