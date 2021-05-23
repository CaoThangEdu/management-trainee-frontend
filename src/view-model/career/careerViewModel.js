import ViewModel from '../viewModel'
export default class CareerViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      name: null,
      status: null,
    }
  }

  getValidations() {
    let validations = {
      name: {
        label: 'Tên ngành',
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