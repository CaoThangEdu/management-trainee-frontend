import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class InternshipConfirmationServices extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/InternshipConfirmation`
  }
  
  async internshipConfirmationAsync(query) {

    try {
      const response = await this.http.post(`${this.url}/Create`, query);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateInternshipConfirmationAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteInternshipConfirmationAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async fliterInternshipConfirmationAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Filter`,object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getStatisticalInternshipConfirm(object) {
    try {
      const response = await this.http.post(`${this.url}/GetStatisticalInternshipConfirm`,object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}