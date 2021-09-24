import Http from '../helpers/http'
import { map } from 'lodash'

export default class ServicesBaseAPI {
  constructor() {
    this.http = new Http()
    this.result = {
      isOK: false,
      errorMessages: [],
      data: {}
    }
  }

  setResult(response, handleMapFieldsFromAPI) {
    this.result.errorMessages = this.http.mapErrorsFromApi(response.data.errorMessages);
    this.result.isOK = response.data.success;
    if (response.data.success) {
      if (typeof handleMapFieldsFromAPI === 'function') {
        handleMapFieldsFromAPI(response.data.result);
      } else {
        this.result.data = response.data.result;
      }
    }
  }

  getUrlFromParams(urlParams) {
    const params = new URLSearchParams();

    map(urlParams, (value, key) => {
      if (Array.isArray(urlParams[key])) {
        map(value, item => params.append(key, item));
      } else {
        params.append(key, value);
      }
    });
    return params;
  }
}