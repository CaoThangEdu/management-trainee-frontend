import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class StudentService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Student`
  }

  async getStudentsAsync() {
    try {
      const response = await this.http.get(`${this.url}/GetAll`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createStudentAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Create`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateStudentAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteStudentAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}