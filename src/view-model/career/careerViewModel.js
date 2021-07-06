import ViewModel from '../viewModel'
export default class CareerViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      careersName: null,
      status: "active",
      trainingSystemId: "",
      IsDelete: false
    }
  }

  getValidations() {
    let validations = {
      careersName: {
        label: 'Tên ngành',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      trainingSystemId: {
        label: 'Hệ đào tạo',
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