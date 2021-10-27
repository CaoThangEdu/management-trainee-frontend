import ViewModel from '../viewModel'
export default class WeeklyReportViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      title: '',
      studenId: '',
      link: '',
      description: '',
    }
  }

  getValidations() {
    return {
      title: {
        label: 'Tiêu đề báo cáo',
        rules: {
          require: '',
        }
      },
      link: {
        label: 'Đường dẫn đến file báo cáo',
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
    };
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}