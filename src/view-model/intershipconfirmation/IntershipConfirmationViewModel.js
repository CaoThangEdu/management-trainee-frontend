import ViewModel from '../viewModel'
export default class CertificateViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      studentId:null,
      taxCode: null,
      title: null,
      companyAddress:null,
      owner:null,
      manager:null,
      phoneNumber: null,
      website:null,
      status: 'notPracticed', //notPracticed, practiced
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
      title: {
        label: 'Tên công ty',
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
      companyAddress: {
        label: 'Địa chỉ công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      phoneNumber: {
        label: 'Số điện thoại cán bộ hướng dẫn',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      manager: {
        label: 'Cán bộ hướng dẫn',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      website: {
        label: 'Link công ty',
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