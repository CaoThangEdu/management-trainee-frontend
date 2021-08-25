import UserService from "../../services/user/userService";
import crudMixin from "./crudMixin";

export default {
  data() {
    return {}
  },
  mixins: [ crudMixin ],
  methods: {
    // Ham tao tai khoan cho create student va create teacher
    // status 0 tạo dử liệu cho từng người
    // status 1 tạo dử liệu cho 1 list
    async createUserAsync(user) {
      // Call Api
      const api = new UserService();
      const response = await api.createUserAsync(user);
      return {
        isOk: response.isOK,
        errorMessages: response.errorMessages,
      };
    },

    async eventCreateAccountWhenCreateStudentOrCreateTeacher(userData, role, status){
      if(status == 0){
        console.log("Data ben mixin 1 people", userData)

        // tạo account cho từng người
        let dataForCreateUser = {
          username: userData.email,
          name : userData.firstName,
          surname : userData.lastName,
          emailAddress: userData.email,
          isActive: true,
          roleNames: [role],
          password:  role == "STUDENT" || role == "Student" ? "studentCaoThang123@" : "teacherCaoThang@"
        }
        let createUserResponse = await this.createUserAsync(dataForCreateUser);
        return {
          isOk: createUserResponse.isOK,
          errorMessages: createUserResponse.errorMessages,
        };
      }
      // Tạo user cho 1 list
      console.log("Dã chạy tới hàm Tạo danh sách teacher ")
      console.log("Data ben mixin", userData)

      let createUserResponse;
      await userData.forEach(user => {
        let dataForCreateUser = {
          username: user.email,
          name : user.firstName,
          surname : user.lastName,
          emailAddress: user.email,
          isActive: true,
          roleNames: [role],
          password:  role == "STUDENT" || role == "Student" ? "studentCaoThang123@" : "teacherCaoThang@"
        }
        createUserResponse = this.createUserAsync(dataForCreateUser);
      }); 
      return {
        isOk: createUserResponse.isOK,
        errorMessages: createUserResponse.errorMessages,
      };
    },
  },
}