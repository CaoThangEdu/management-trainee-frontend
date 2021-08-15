import ViewModel from '../viewModel'
export default class CompanyViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      taxCode: null,
      title: null,
      companyAddress: null,
      owner: null,
      career: null,
      phoneNumber: null,
    }
  }

  getValidations() {
    let validations = {
      title: {
        label: 'Tên công ty',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      taxCode: {
        label: 'Mã số thuế',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      companyAddress: {
        label: 'Địa chỉ',
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
      phoneNumber: {
        label: 'Số điện thoại',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      // career: {
      //   label: 'Ngành nghề',
      //   rules: {
      //     require: '',
      //     maxLength: {
      //       max_value: 200
      //     }
      //   }
      // },
    }
    return validations
  }
  isValid() {
    return super.isValid(this.getValidations())
  }
}