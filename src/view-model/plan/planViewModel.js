import ViewModel from '../viewModel'
export default class PlanViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      internshipCourceName: null,
      startDay: null,
      endDay: null,
      trainingSystemId: null,
      careersId: null,
      description: null,
      courseId: null,
      status: null,
    }
  }

  getValidations() {
    let validations = {
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}