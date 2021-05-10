import ViewModel from '../viewModel'
export default class CourseViewModel extends ViewModel {
  constructor() {
    super()
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