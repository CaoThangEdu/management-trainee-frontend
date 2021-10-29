import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class ReceiverService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Receiver`
  }

  async updateStatusWatchedWhenUserClickView(datasend) {
    try {
      const response = await this.http.put(`${this.url}/UpdateStatusWatchedWhenUserClickView`, datasend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getReceiversAsync(datasend) {
    try {
      const response = await this.http.post(`${this.url}/GetAllReceiver`, datasend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getReceiverByEmail(email) {
    try {
      const response = await this.http.get(`${this.url}/GetReceiverByEmail?email=${email}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createReceiverAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/CreateReceiver`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateReceiverAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteReceiverAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}