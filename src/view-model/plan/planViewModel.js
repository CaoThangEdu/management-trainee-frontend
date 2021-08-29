import ViewModel from '../viewModel'
export default class PlanViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      internshipCourseName: null,
      startDay: null,
      endDay: null,
      description: null,
      careersId: null,
      courseName: null,
      status: 'active',
    }
  }

  getValidations() {
    let validations = {
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
      description: {
        label: 'Mô tả',
        rules: {
          require: '',
        }
      },
      careersId: {
        label: 'Ngành đào tạo',
        rules: {
          require: '',
        }
      },      
      courseName: {
        label: 'Khóa',
        rules: {
          require: '',
        }
      },
      status: {
        label: 'Trạng thái',
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