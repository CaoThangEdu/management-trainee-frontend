import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class TimeLineService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/TimeLine`
  }

  async getTimeLinesAsync() {
    try {
      const response = await this.http.get(`${this.url}/GetAll`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getTimeLinesByInternshipCourseIdAsync(dataSend) {
    try {
      const response = await this.http.post(`${this.url}/Filter`, dataSend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createTimeLineAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/CreateTimeline`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateTimeLineAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/UpdateTimeline`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteTimeLineAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}