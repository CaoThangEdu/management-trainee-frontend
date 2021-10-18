import ViewModel from '../viewModel'
export default class StudentViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      firstName: '',
      lastName: '',
      studentId: '',
      status: '',
      email: '',
      dayOfBirth: '',
      role: 0,
      classId: '',
      internshipStatus: '',
    }
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
        }
      },
      lastName: {
        label: 'Tên',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      dayOfBirth: {
        label: 'Ngày sinh',
        rules: {
          require: '',
        }
      },
      studentId: {
        label: 'MSSV',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      classId: {
        label: 'Lớp',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}