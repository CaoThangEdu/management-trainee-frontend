import ServicesBaseAPI from '../servicesBaseApi'
import AppConfig from '../../app.config.json'

export default class NotificationService extends ServicesBaseAPI {
  constructor() {
    super();
    this.url = `${AppConfig.apiHost}/Notify`
  }

  async createNotifyForUserAsync(datasend) {
    try {
      const response = await this.http.post(
        `${AppConfig.apiHost}/Instructor/CreateNotifyForUser?internshipCourseId=${datasend.internshipCourseId}`
        , datasend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getNotificationsReportAsync(datasend) {
    try {
      const response = await this.http.post(
        `${this.url}/StatisticPeopleWatchedNotify?notificationId=${datasend.notificationId}`
        , datasend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getNotificationsAsync(datasend) {
    try {
      const response = await this.http.post(`${this.url}/GetAllNotify`, datasend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getNotifyByEmail(email) {
    try {
      const response = await this.http.get(`${this.url}/GetNotifyByEmail?email=${email}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async getNotifyByIdAsync(id) {
    try {
      const response = await this.http.get(`${this.url}/GetNotifyById?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async sendAnEmailUrgingYouToSeeTheAnnouncementAsync(datasend) {
    try {
      const response = await this.http.post(`${this.url}/SendAnEmailUrgingYouToSeeTheAnnouncement`, datasend);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async createNotificationAsync(object) {
    try {
      const response = await this.http.post(`${this.url}/CreateNotify`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async updateNotificationAsync(object) {
    try {
      const response = await this.http.put(`${this.url}/Update`, object);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }

  async deleteNotificationAsync(id) {
    try {
      const response = await this.http.delete(`${this.url}/Delete?id=${id}`);
      this.setResult(response);
    } catch (e) {
      return this.http.loadError(e);
    }
    return this.result;
  }
}