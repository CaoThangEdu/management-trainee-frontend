import ServicesBaseAPI from '../servicesBaseApi';
import AppConfig from '../../app.config.json';
import { STORAGE_KEY } from '../../config/constant';

export default class AuthenticateService extends ServicesBaseAPI {
    constructor(){
        super();
        this.url = `${AppConfig.authHost}/api/TokenAuth`;
    }
    /**
     * Call api login
     * @param {Object} query {username, password}
     */
    async loginAsync(query) {
        const requestData = {
            userNameOrEmailAddress: query.username,
            password: query.password,
            rememberClient: true
        }
        try {
            const response = await this.http.post(`${this.url}/Authenticate`, requestData);
            this.setResult(response);
        } catch (e) {
            return this.http.loadError(e)
        }
        this.updateAuthStorage();
        return this.result
    }

    updateAuthStorage(){
        if (!this.result || !this.result.isOK)
            return;
        let authToken = Object.assign({}, this.result.data);
        authToken['expiredTime'] = new Date() + authToken.expireInSeconds * 900;
        delete authToken.expireInSeconds;
        localStorage.setItem(STORAGE_KEY.AUTH_TOKEN, JSON.stringify(authToken));
    }
}