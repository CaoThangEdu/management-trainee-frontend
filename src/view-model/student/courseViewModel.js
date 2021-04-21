export default class CourseViewModel {
  constructor() {
    this.fields = {
      courseName: null,
      status: null,
    }
  }

  getValidations() {
    let validations = {
      courseName: {
        label: 'Tên khóa',
        rules: {
          require: ''
        }
      },
    }
    return validations
  }
  isValid() {
    return this.getValidations()
  }
}