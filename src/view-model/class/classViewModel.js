import ViewModel from '../viewModel'
export default class ClassViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      className: null,
      status: "active",
      internshipCourseId: null,
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
      internshipCourseId: {
        label: 'Tên đợt thực tập',
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