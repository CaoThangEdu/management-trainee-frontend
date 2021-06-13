import ViewModel from '../viewModel'
export default class ClassViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      className: null,
      status: null,
      carresId: null,
      isDelete: false
    }
  }

  getValidations() {
    let validations = {
      className: {
        label: 'Tên lớp',
        rules: {
          require: '',
        }
      },
     
     
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}