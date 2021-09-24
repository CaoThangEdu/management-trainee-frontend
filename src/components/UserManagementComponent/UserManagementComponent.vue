<template src='./UserManagementComponent.html'></template>

<script>
import ComponentBase from "../common/component-base/ComponentBase";
import BaseModal from "../common/base-modal/BaseModal";
import AlertMessages from "../common/alert/alert-messages/AlertMessages";
import JwPagination from "jw-vue-pagination";
import UserService from "../../services/user/userService";
import AppConfig from "../../../src/app.config.json";
export default {
  name: "UserManagementComponent",
  extends: ComponentBase,
  components: {
    JwPagination,
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      users: [],
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      dataForCreateUser: {
        username: "",
        name: "",
        surname: "",
        emailAddress: "",
        isActive: true,
        roleNames: [],
        password: ""
      },
      dataForCreateUsers: [],
      passwordForStudent: "studentcaothang123@",
      passwordForTeacher: "teachercaothang"
    };
  },
  props: {},
  async mounted() {
    await this.getUserAsync();
  },
  methods: {
    
    // Ham tao tai khoan cho create student va create teacher
    // status 0 tạo dử liệu cho từng người
    // status 1 tạo dử liệu cho 1 list
    async eventCreateAccountWhenCreateStudentOrCreateTeacher(data, role, status){
      if(status == 0){
        // tạo account cho từng người
        this.dataForCreateUser = {
          username: data.username.toLowerCase(),
          name : data.name,
          surname : data.surname,
          emailAddress: data.email,
          isActive: true,
          roleNames: role,
          password:  role == "STUDENT" || role == "Student" ? this.passwordForStudent : this.passwordForTeacher
        }
        await this.createUserAsync(this.dataForCreateUser);
        return;   
      }
      // Tạo user cho 1 list
      await data.forEach(data => {
        this.dataForCreateUser = {
          username: data.username.toLowerCase(),
          name : data.name,
          surname : data.surname,
          emailAddress: data.email,
          isActive: true,
          roleNames: [role],
          password:  role == "STUDENT" || role == "Student" ? this.passwordForStudent : this.passwordForTeacher
        }
        this.createUserAsync(this.dataForCreateUser);     
      }); 
    },
    async createUserAsync(user) {
      // Call Api
      this.showLoading();
      const api = new UserService();
      const response = await api.createUserAsync(user);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
      }
    },
    async getUserAsync() {
      // Call Api
      this.showLoading();
      const api = new UserService();
      const response = await api.getAllUserAsync(null);
      this.showLoading(false);
      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.users = response.data.items;
    },
     onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    changePage(currentPage) {
      this.$emit("change-page", currentPage);
    },
  },
  watch: {},
};
</script>

<style lang='scss'>
@import "./UserManagementComponent.scss";
</style>