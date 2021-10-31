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
      <li class="c-header-nav-item d-md-down-none mx-2 navbar__item--has-notify"
        @click="showNotify()">
        <span href="#" class="c-header-nav-link header-icon-notification">
          <CIcon name="cil-bell" />
          <span
            v-if="sumNotifyUnWatch"
            class="header__notice-count">{{sumNotifyUnWatch}}</span>
        </span>
        <div class="nav__notify"
          :class="{'nav__notify--display': isShowNotify}"
          id="notifications-box">
          <header class="nav__notify-header">
            <h3>Thông báo</h3>
          </header>
          <ul class="nav__notify-list">
            <li class="nav__notify-item"
              v-for="(notify, index) in notificationsOfUser"
              :class="{'nav__notify-item--viewed': !notify.watched}"
              :key="index + 'notify'">
              <router-link
                class="nav__notify-link"
                :to="{name:'thong-bao-cua-tai-khoan', params: { guid: notify.id } }">
                <div class="nav__notify-info">
                  <span class="nav__notify-name">{{ notify.title }}</span>
                  <span class="nav__notify-description text-right">
                    Trạng thái: {{ notify.watched?'Đã xem':'Chưa xem' }}
                  </span>
                </div>
              </router-link>
            </li>
            <li class="nav__notify-item--no-notidy font-weight-bold"
              v-if="notificationsOfUser && notificationsOfUser.length==0">
              Bạn chưa có thông báo nào
            </li>
          </ul>
          <div class="nav__notify-footer">
            <a href="" class="nav__notify-footer-btn"> Xem tất cả </a>
          </div>
        </div>
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
import { mapGetters, mapActions } from "vuex";
import ComponentBase from "../../common/component-base/ComponentBase";
import { STORAGE_KEY } from "../../../config/constant";
import localStorageMixin from "../../../helpers/mixins/localStorageMixin";
import axios from "axios";
import Http from "../../../helpers/http";
import AppConfig from "../../../app.config.json";

export default {
  name: "Header",
  extends: ComponentBase,
  components: {
    HeaderDropdownAccount,
  },
  mixins: [localStorageMixin],

  data() {
    return {
      breadCrumbList: [],
      notificationsOfUser: [],
      isShowNotify: false,
      sumNotifyUnWatch: 0,
    }
  },
  created() {
    let app = document.getElementById("app");
    app.addEventListener('mouseup', () => {
      let notificationsBox = document.getElementById('notifications-box');
      if(!notificationsBox) return;
      notificationsBox.classList.remove('nav__notify--display');
    });
  },

  async mounted() {
    if (this.userProfile.user) return;
    await this.updateUserInfoDataAsync();
    await this.getNotifyByEmail();
  },

  methods: {
    ...mapActions("layout", [
      "setToggleSidebarMobile",
      "setToggleSidebarDesktop",
    ]),
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),
    async getNotifyByEmail(){
      if(this.userProfile.role.toUpperCase() == 'ADMIN' || !this.userProfile.user) return;
      let res;
      let authToken = localStorageMixin.methods.getLocalStorage(STORAGE_KEY.AUTH_TOKEN);
      let accessToken = authToken?.accessToken;
      this.showLoading();
      await axios.get(
        `http://localhost:21021/api/services/app/Notify/GetNotifyByEmail?email=${this.userProfile?.user?.emailAddress}`, 
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => {
          if (response.data.success) {
            res = response.data;
            res.isOK = res.success;
          }
        })
        .catch(async error => {
          let http = new Http();
          let errorResult = await http.loadError(error);
          res = errorResult;
        });
      this.showLoading(false);
      if(!res.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          res.errorMessages
        );
        return;
      }
      this.notificationsOfUser = res.result;
      this.sumNotifyUnWatch = this.notificationsOfUser.filter(noti => !noti.watched).length;
    },
    async showNotify() {
      this.isShowNotify = !this.isShowNotify;
      if(!this.isShowNotify) return;
      await this.getNotifyByEmail();
    }
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", { userProfile: "getUserInfo", tokenKey: "getTokenKey" }),
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
