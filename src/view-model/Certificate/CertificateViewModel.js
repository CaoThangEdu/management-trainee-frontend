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
      career:null,
      status: 'unconfirmed', //confirmed, unconfirmed, complete
    }
  }

  getValidations() {
    let validations = {
      taxCode: {
        label: 'Mã số thuế',
        rules: {
          require: '',
          maxLength: {
            max_value: 500
          }
        }
      },
      companyName: {
        label: 'Tên công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 500
          }
        }
      },
      companyAddress: {
        label: 'Địa chỉ công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 500
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
        label: 'Số điện thoại sinh viên',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      career: {
        label: 'Ngành nghề',
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