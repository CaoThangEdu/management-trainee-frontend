import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class UserService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/User`
  }

  async createUserAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Create`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createUsersAsync(array) {
    try {
      const response = await this.http.post(`${this.url}/CreateUsers`, array);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateUserAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }  

  async deleteUserAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getRolesAsync() {
    try {
      const response = await this.http.post(`${this.url}/GetRoles`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async changePasswordAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/ChangePassword`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async resetPasswordAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/ResetPassword`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  } 

  async getUserAsyncAsync(id) {
    try {
      const response = await this.http.get(`${this.url}/Get?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getAllUserAsync(object) {
    try {
      const response = await this.http.get(`${this.url}/GetAll`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getUsersAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/FilterUser`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  } 

}