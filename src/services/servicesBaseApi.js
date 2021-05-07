import Http from '../helpers/http'

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
    console.log("response.data", response.data)
    console.log("isOK",this.result.isOK)
    if (response.data.success) {
      if (typeof handleMapFieldsFromAPI === 'function') {
        handleMapFieldsFromAPI(response.data.result);
      } else {
        this.result.data = response.data.result;
      }
    }
  }
}