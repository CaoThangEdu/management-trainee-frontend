import ViewModel from '../viewModel'
export default class PlanViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      internshipCourseName: '',
      startDay: '',
      endDay: '',
      description: '',
      careersId: '',
      courseName: '',
      status: 'active',
      facultyId: '',
    }
  }

  getValidations() {
    return {
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
      facultyId: {
        label: 'Khoa',
        rules: {
          require: '',
        }
      },
    }
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}