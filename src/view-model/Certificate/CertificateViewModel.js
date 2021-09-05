import ViewModel from '../viewModel'
export default class CertificateViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      taxCode: null,
      companyName: null,
      companyAddress:null,
      owner:null,
      phoneNumberOfCompany: null,
      phoneNumberOfStudent: null,
      studentId: null,
      status: 'unconfirmed', //confirmed, unconfirmed, complete
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
      owner: {
        label: 'Chủ sở hữu',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      companyName: {
        label: 'Tên công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      companyAddress: {
        label: 'Địa chỉ công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      phoneNumberOfCompany: {
        label: 'Số điện thoại công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      phoneNumberOfStudent: {
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