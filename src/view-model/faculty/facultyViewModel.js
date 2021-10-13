import ViewModel from '../viewModel'
export default class FacultyViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      facultyName: null,
    }
  }

  getValidations() {
    let validations = {
      facultyName: {
        label: 'Tên khoa',
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