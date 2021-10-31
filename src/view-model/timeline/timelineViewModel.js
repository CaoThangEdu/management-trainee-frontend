import ViewModel from '../viewModel'
export default class TimeLineViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      timelineName: '',
      description: '',
      startDay: '',
      endDay: '',
      value: '',
      internshipCourseId: '',
      status: 'active',
      isActive: true
    }
  }

  getValidations() {
    return {
      timelineName: {
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
    };
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}