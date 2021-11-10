import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class FormMcqServices extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/FormMcq`
  }

  async getAllFormMcqByFormIdAsync(id) {
    try {
      const response = await this.http.get(`${this.url}/GetAllFormMcqByFormId?formId=${id}` );
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }


  async createFormMcqAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Create`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateFormMcqAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteFormMcqAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}