import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class CertificateService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Certificate`
  }

  async getCertificatesAsync() {
    try {
      const response = await this.http.get(`${this.url}/GetAll`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createCertificateAsync(query) {

    let certificate = {
    taxCode: query.taxCode,
    companyName: query.companyName,
    companyAddress: query.companyAddress,
    owner: query.owner,
    phoneNumberOfCompany:query.phoneNumberOfCompany,
    phoneNumberOfStudent: query.phoneNumberOfStudent,
    status: query.status,
    studentId: query.studentId,
    isDelete: query.isDelete
    }

    try {
      const response = await this.http.post(`${this.url}/Create`, certificate);
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
}