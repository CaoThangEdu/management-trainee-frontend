import ViewModel from '../viewModel'
export default class TeacherViewModel extends ViewModel {
  constructor() {
    super();
    this.fields = {
      firstName: null,
      lastName: null,
      phoneNumber: null,
      status: null,
      facultyId: null,
      isDelete: null,
    };
  }

  getValidations() {
    let validations = {
      firstName: {
        label: 'Họ',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        },
      },
      lastName: {
        label: 'Tên',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        },
      },
      email: {
        label: 'Email',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        },
      },
      status: {
        label: 'Trạng thái',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        },
      },
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}
