export default class StudentViewModel {
  constructor() {
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
          require: ''
        }
      },

      taxCode: {
        label: 'Mã số thuế',
        rules: {
          require: '',
        }
      },
      address: {
        label: 'Địa chỉ',
        rules: {
          require: '',
        }
      },
      link: {
        label: 'Trang web',
        rules: {
          require: '',
        }
      },
      img: {
        label: 'Hình ảnh',
        rules: {
          require: '',
        }
      },
    }
    return validations
  }
  isValid() {
    return this.getValidations()
  }
}