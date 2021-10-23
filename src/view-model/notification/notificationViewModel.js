import ViewModel from '../viewModel'
export default class NotificationViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      title: "",
      content: "",
      internshipCourseId: "",
      isActive: true,
    }
  }

  getValidations() {
    return {
      title: {
        label: 'Tiêu đề',
        rules: {
          require: '',
        }
      },
      content: {
        label: 'Nội dung',
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