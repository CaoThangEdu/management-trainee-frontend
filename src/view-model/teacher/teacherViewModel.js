import ViewModel from '../viewModel'
export default class TeacherViewModel extends ViewModel {
  constructor() {
    super();
    this.fields = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      status: '',
      facultyId: '',
    };
  }

  getValidations() {
    return {
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
      phoneNumber: {
        label: 'Số điện thoại',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        },
      },
      facultyId: {
        label: 'Khoa',
        rules: {
          require: '',
        },
      },
    }
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}
