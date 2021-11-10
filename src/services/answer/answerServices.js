import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class AnswerServices extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Answer`
  }

  async getAllAnswersAsync(object) {
    try {
      const response = await this.http.get(`${this.url}/GetAnswers?FormId=${object.formId}&StudentId=${object.studentId}` );
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }


  async createAnswerAsync(array) {
    try {
      const response = await this.http.post(`${this.url}/SaveAnswer`,array);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  // async updateFormMcqAsync(object) {
  //   try {
  //     const response = await this.http.put(`${this.url}/Update`, object);
  //     this.setResult(response);
  //   } catch (e) {
  //     return this.http.loadError(e);
  //   }
  //   return this.result;
  // }

  async deleteAnswerAsync(object) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?FormId=${object.fromId}&studentId=${object.StudentId}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}