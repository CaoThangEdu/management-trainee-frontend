import ViewModel from '../viewModel'
export default class UserViewModel extends ViewModel {
    constructor() {
        super()
        this.fields = {
            userName: '',
            surname: '',
            name: '',
            emailAddress: '',
            password: '',
            confirmPassword: '',
            roleNames: '',
            isActive: '',
        }
    }

    getValidations() {
        return {
            surname: {
                label: 'Họ',
                rules: {
                    require: '',
                }
            },
            name: {
                label: 'Tên và tên đệm',
                rules: {
                    require: '',
                }
            },
            emailAddress: {
                label: 'Emai',
                rules: {
                    require: '',
                }
            },
            password: {
                label: 'Mật khẩu',
                rules: {                    
                    require: '',
                    minLength: {
                        min_value: 6,
                    },
                    password:{
                        equal: false,
                    }
                }
            },
            confirmPassword: {
                label: 'Xác nhận mật khẩu',
                rules: {
                    require: '',
                    password:{
                        equal: true,
                        equal_data: this.fields.password,
                    }
                }
            },
            roleNames: {
                label: 'Quyền',
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