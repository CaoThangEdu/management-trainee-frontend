import ViewModel from '../viewModel'
export default class ChangePasswordViewModel extends ViewModel {
    constructor() {
        super()
        this.fields = {
            oldPassword: null,
            newPassword: null,
            confirmNewPassword: null,
        }
    }

    getValidations() {
        return {
            oldPassword: {
                label: 'Mật khẩu cũ',
                rules: {
                    require: '',
                }
            },
            newPassword: {
                label: 'Mật khẩu mới',
                rules: {                    
                    require: '',
                    minLength: {
                        min_value: 6,
                    },
                    password:{
                        equal:false,
                        equal_data:this.fields.oldPassword,
                    }
                }
            },
            confirmNewPassword: {
                label: 'Xác nhận mật khẩu mới',
                rules: {
                    require: '',
                    password:{
                        equal:true,
                        equal_data:this.fields.newPassword,
                    }
                }
            },
        };
    }
    isValid() {
        return super.isValid(this.getValidations())
    }
}