export default class StudentViewModel {
  constructor() {
    this.fields = {
      firstName: null,
      lastName: null,
      studentId: null,
      classId: null,
      email: null,
      dayOfBirth: null,
    }
  }

  getValidations() {
    let validations = {
      firstName: {
        label: 'Họ',
        rules: {
          require: ''
        }
      },

      lastName: {
        label: 'Tên đệm và tên',
        rules: {
          require: '',
        }
      },
      email: {
        label: 'Email',
        rules: {
          require: '',
          email: '',
        }
      },
    }
    return validations
  }
  isValid() {
    return this.getValidations()
  }
}