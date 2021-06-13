import ViewModel from '../viewModel'
export default class TrainingSystemViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      trainingSystemName: null,
      isDelete: false,
    }
  }

  getValidations() {
    let validations = {
      trainingSystemName: {
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