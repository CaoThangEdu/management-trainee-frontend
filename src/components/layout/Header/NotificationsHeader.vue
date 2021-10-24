<template>
  <div class="nav__notify">
    <header class="nav__notify-header">
      <h3>Thông báo mới nhận</h3>
    </header>
    <ul class="nav__notify-list">
      <li class="nav__notify-item nav__notify-item--viewed">
        <a class="nav__notify-link" href="">
          <div class="nav__notify-info">
            <span class="nav__notify-name">Thông báo từ trường</span>
            <span class="nav__notify-description">
              Bạn đã được thêm vào thực tập CĐ-CNTT-2021
            </span>
          </div>
        </a>
      </li>
      <div class="nav__notify-footer">
        <a href="" class="nav__notify-footer-btn"> Xem tất cả </a>
      </div>
    </ul>
  </div>
</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import Http from "../../../helpers/http";

export default {
  name: "NotificationsHeader",
  extends: ComponentBase,
  data() {
    return {
      notificationsOfUser: [],
    }
  },

  async mounted() {
    if (this.userProfile.user) return;
    await this.updateUserInfoDataAsync();
  },

  methods: {
    //gọi phương thức từ actions trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapActions("user", ["updateUserInfoDataAsync"]),
    async getNotifyByEmail(){
      let requestData = {
        email: this.userProfile.emailAddress,
      }
      let res;
      await axios.post(`${urlAuthorize}`, requestData)
        .then(response => {
          if (response.isOK) {
            response.data = response.result;
          }
        })
        .catch(async error => {
          let http = new Http();
          let errorResult = await http.loadError(error);
          res = errorResult;
        });
      this.notificationsOfUser = res;
    },
  },

  computed: {
    //gọi phương thức từ getter trên store (tên module, tên phương thức) để xử lý dữ liệu
    ...mapGetters("user", { userProfile: "getUserInfo", tokenKey: "getTokenKey" }),
  },
};
</script>