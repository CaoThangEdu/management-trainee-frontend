import ViewModel from '../viewModel'
export default class TimeLineViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      timeLineName: null,
      description: null,
      startDay: null,
      endDay: null,
      internshipCourseId: null,
      status: null,
    }
  }

  getValidations() {
    let validations = {
      timeLineName: {
        label: 'Tiêu đề',
        rules: {
          require: '',
        }
      },
      description: {
        label: 'Mô tả',
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