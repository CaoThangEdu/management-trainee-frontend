import ViewModel from '../viewModel'
export default class CompanyViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      companyName: null,
      taxCode: null,
      address: null,
      link: null,
      img: null,
    }
  }

  getValidations() {
    let validations = {
      companyName: {
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
      address: {
        label: 'Địa chỉ',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      link: {
        label: 'Trang web',
        rules: {
          require: '',
          maxLength: {
            max_value: 200
          }
        }
      },
      img: {
        label: 'Logo công ty',
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