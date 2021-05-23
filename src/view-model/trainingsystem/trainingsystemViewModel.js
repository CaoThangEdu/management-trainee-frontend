import ViewModel from '../viewModel'
export default class TrainingSystemViewModel extends ViewModel {
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
        label: 'Tên hệ đào tạo',
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