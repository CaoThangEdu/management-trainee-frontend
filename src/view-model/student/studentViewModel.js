import ViewModel from '../viewModel'
export default class StudentViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      name: null,
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
      name: {
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