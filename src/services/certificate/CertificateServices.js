import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class CertificateService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Certificate`
  }



  async createCertificateAsync(query) {

    try {
      const response = await this.http.post(`${this.url}/Create`, query);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateCertificateAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteCertificateAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  // async getCertificatesAsync(object) {
  //   const query = {
  //     mssv: object.keyword ?? '',
  //     status: object.status ?? '',
  //     classId:object.status ?? ''
  //   };
  //   try {
  //     const response = await this.http.post(`${this.url}/Filter`, query);
  //     this.setResult(response);
  //   } catch (e) {
  //     return this.http.loadError(e);
  //   }
  //   return this.result;
  // }
  async getCertificatesAsync() {
    try {
      const response = await this.http.get(`${this.url}/GetAll`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}