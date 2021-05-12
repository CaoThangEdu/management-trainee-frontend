import ViewModel from '../viewModel'
export default class PlanViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      internshipCourceName: null,
      startDay: null,
      endDay: null,
      trainingSystems: null,
      careers: null,
      description: null,
      course: null,
      status: null,
    }
  }

  getValidations() {
    let validations = {
      // internshipCourceName: {
      //   label: 'Tên đợt thực tập',
      //   rules: {
      //     require: '',
      //     maxLength: {
      //       max_value: 200
      //     }
      //   }
      // },
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}