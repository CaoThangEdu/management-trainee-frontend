export default class TeacherViewModel {
  constructor() {
    this.fields = {
      firstName: null,
      lastName: null,
      email: null,
      status: null,
      careersId: "",
      isDelete: ""
    };
  }

  getValidations() {
    let validations = {
      firstName: {
        label: 'Họ',
        rules: {
          require: '',
        },
      },
      lastName: {
        label: 'Tên',
        rules: {
          require: '',
        },
      },
      email: {
        label: 'Email',
        rules: {
          require: '',
        },
      },
    };
    return validations;
  }
  isValid() {
    return this.getValidations();
  }
}
