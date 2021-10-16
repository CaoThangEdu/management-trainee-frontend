import ViewModel from '../viewModel'
export default class TimeLineViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      timeLineName: '',
      description: '',
      startDay: '',
      endDay: '',
      internshipCourseId: '',
      status: 'active',
      isActive: true
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
      startDay: {
        label: 'Ngày bắt đầu',
        rules: {
          require: '',
        }
      },
      endDay: {
        label: 'Ngày kết thúc',
        rules: {
          require: '',
        }
      },
      internshipCourseId: {
        label: 'Đợt thực tập',
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