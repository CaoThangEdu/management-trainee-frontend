import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class surveyFormServices extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/SurveyForm`
  }

  async getSurveyFormsAsync() {
    try {
      const response = await this.http.get(`${this.url}/GetAllSurveyForm`, );
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }


  async createSurveyFormAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Create`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateSurveyFormAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteSurveyFormAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}