import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class CompanyService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Company`
  }

  async createCompanyAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Create`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateCompanyAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteCompanyAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getCompanieByTaxCodeAsync(taxCode) {
    try {
      const response = await this.http.get(`${this.url}/GetCompany?TaxCode=${taxCode}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getCompaniesAsync(object) {
    const query = {
      Keyword: object.keyword,
      Status: object.status ?? ''
    };
    try {
      const response = await this.http.post(`${this.url}/Filter`, query);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getAllCompaniesAsync() {
    try {
      const response = await this.http.get(`${this.url}/GetAll`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}