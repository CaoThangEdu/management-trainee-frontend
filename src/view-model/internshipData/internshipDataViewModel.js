import ViewModel from '../viewModel'
export default class InternshipDataViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      title: '',
      internshipCourseId: '',
      link: '',
      description: '',
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
      internshipCourseId: {
        label: 'Tên đợt thực tập',
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
      link: {
        label: 'Đường dẫn',
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