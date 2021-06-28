import ViewModel from '../viewModel'
export default class RegisteredInternshipReferralsViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      taxCode: null,
      nameCompany: null,
      phoneStudent: null,
      studentId: null,
      isDelete: false,
      status: 'active',
      registrationDate: null,
    }
  }

  getValidations() {
    let validations = {
      taxCode: {
        label: 'Mã sô thuế',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      nameCompany: {
        label: 'Tên công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      phoneStudent: {
        label: 'Số điện thoại',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}