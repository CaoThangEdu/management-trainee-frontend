import ViewModel from '../viewModel'
export default class ChangePasswordViewModel extends ViewModel {
    constructor() {
        super()
        this.fields = {
            adminPassword: null,
            newPassword: null,
        }
    }

    getValidations() {
        return {
            adminPassword: {
                label: 'Mật khẩu admin',
                rules: {
                    require: '',
                }
            },
            newPassword: {
                label: 'Mật khẩu mới',
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