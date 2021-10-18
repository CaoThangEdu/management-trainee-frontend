import ViewModel from '../viewModel'
export default class NotificationViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      title: null,
      content: "active",
      internshipCourseId: null,
    }
  }

  getValidations() {
    let validations = {
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
      receiver: {
        label: 'Đối tượng nhận thông báo',
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