import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class WeeklyReportService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/WeeklyReportAppServices`
  }

  async getWeeklyReportByIdAsync(guid) {
    try {
      const response = await this.http.get(`${this.url}/Get?id=${guid}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getWeeklyReportsAsync(dataSend) {
    try {
      const response = await this.http.post(`${this.url}/Filter`, dataSend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createWeeklyReportAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Create`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateWeeklyReportAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteWeeklyReportAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}