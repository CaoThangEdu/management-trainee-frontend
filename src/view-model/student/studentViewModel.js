import ViewModel from '../viewModel'
export default class StudentViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      firstName: null,
      lastName: null,
      studentId: null,
      status: null,
      email: null,
      dayOfBirth: null,
      role: 0,
      internshipCourseId: null,
      classId: null,
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
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}