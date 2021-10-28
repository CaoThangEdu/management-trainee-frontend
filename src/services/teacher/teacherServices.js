import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class TeacherService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Teacher`
  }

  async getTeachersAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/Filter`,object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
  
  async getTeachersInInternshipCourse(object) {
    try {
      const response = await this.http.post(`${this.url}/GetTeacherInInternshipCourse`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }    

  async getFilterByCareersId(careersId) {
    try {
      const response = await this.http.post(`${this.url}/FilterByCareersId`, careersId);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createTeacherAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/CreateTeacher`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createTeachersAsync(array) {
    try {
      const response = await this.http.post(`${this.url}/CreateTeachers`, array);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
  
  async updateTeacherAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteTeacherAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}