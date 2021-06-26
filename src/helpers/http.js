import axios from 'axios'
import store from '../store/index'
import router from '../router/index'
import { options } from './options'

import moment from 'moment'
import { STORAGE_KEY } from '../config/constant'

const esc = encodeURIComponent
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
  'Accept': 'application/json'
}

const tag_date = '#date'
const tag_resources = '#resources'
const tag_performances = '#performances'

export default class Http {
  getHeaders(header_parameters = {}) {
    // get authentication token
    let authToken = localStorage.getItem(STORAGE_KEY.AUTH_TOKEN);
    let token = '';
    if (authToken) {
      authToken = JSON.parse(authToken);
      const now = new Date();
      // token's expired
      if (now < authToken.expiredTime){
        localStorage.setItem(STORAGE_KEY.AUTH_TOKEN, null);
        // goto login page
        // this.$router.push('len-ke-hoach');
        return;
      }
        
      token = authToken.accessToken;
    }

    let default_headers = DEFAULT_HEADERS
    if (token) {
      default_headers = {
        'Authorization': `Bearer ${token}`,
        ...default_headers,
        ...header_parameters
      }
    } else {
      default_headers = {
        ...default_headers,
        ...header_parameters
      }
    }

    return default_headers
  }
  processAPIErrors(apiErrors) {
    let errors = {}
    if (apiErrors) {
      for (let key of Object.keys(apiErrors)) {
        let err = apiErrors[key]

        errors[key] = err

        if (typeof err === Object || err.hasOwnProperty.call('length')) {
          errors[key] = apiErrors[key][0]
        }
      }
    }
    return errors
  }
  qs(params) {
    return (
      Object
      .keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')
    )
  }
  async get(uri, header_parameters) {
    try {
      return axios.get(uri, {
        headers: this.getHeaders(header_parameters)
      })
    } catch (e) {
      return this.setError(e)
    }
  }
  async post(uri, data, header_parameters) {
    try {
      return axios.post(uri, data, {
        headers: this.getHeaders(header_parameters)
      })
    } catch (e) {
      return this.setError(e)
    }
  }
  async donwload(uri, data) {
    try {
      return axios.post(uri, data, {
        responseType: 'blob',
        headers: this.getHeaders()
      })
    } catch (e) {
      return this.setError(e)
    }
  }
  async put(uri, data, header_parameters) {
    try {
      return axios.put(uri, data, {
        headers: this.getHeaders(header_parameters)
      })
    } catch (e) {
      return this.setError(e)
    }
  }
  async delete(uri, data, header_parameters) {
    try {
      return axios.delete(uri, {
        headers: this.getHeaders(header_parameters),
        data: data
      })
    } catch (e) {
      return this.setError(e)
    }
  }
  setError(error) {
    let err = undefined
    if (error.response != undefined) {
      err = error.response
      if (typeof err.data != 'object') {
        err.data = {
          data: null,
          errorMessages: [error],
          isOK: false
        }
      }
    } else {
      err = {
        data: {
          data: null,
          errorMessages: [error.message],
          isOK: false
        }
      }
    }
    return err
  }
  // get(uri, data = {}) {
  //   if (Object.keys(data).length > 0) {
  //     uri = `${uri}?${this.qs(data)}`
  //   }
  //   return axios.get(uri, {
  //     headers: this.getHeaders() 
  //   })
  // }
  // upload(uri, data) {
  //   return fetch(uri, {
  //     headers: this.getHeaders(true),
  //     cors: true,
  //     method: 'POST',
  //     body: data
  //   })
  // }
  /**
   * Handle error while call api error
   * @param {Object} error Object Error of axios while call api
   */
  async loadError(error) {
    let e = {
      data: null,
      errorMessages: [error.message],
      isOK: false
    }
    // If http status code is unauthorized (401)
    if (error.request.status === options.httpStatusCode.unauthorized) {
      await store.dispatch("user/clearTokenAndResetStoreDataAsync");
      e.errorMessages = "Phiên làm việc của bạn đã hết hạn."
      router.push({ name: "LoginPage" });
    }
    return e
  }
  /**
   * Get list error messages of list object api errors
   * @param {Object} apiErrors List api errors
   */
  mapErrorsFromApi(apiErrors) {
    let errorMessages = [];

    if (apiErrors) {
      for (let error of apiErrors) {
        let errorMessage = '';
        if (error.errorCode)
          errorMessage = this.generateMessageBaseErrorCode(error);
        else
          errorMessage = error;

        errorMessages.push(errorMessage);
      }
    }
    return errorMessages;
  }

  /**
   * Generate message from error code
   * @param {Object} apiError Api error {errorCode: "", errorMessage: "", errorValues: []}
   */
  generateMessageBaseErrorCode(apiError) {
    let message = apiError.errorMessage;
    // let replace_tags = [];

    // ACCOUNT
    // if(apiError.errorCode == ACCOUNT_ERROR_CODES.IDT05C) {
    //   replace_tags = [];
    //   message = this.getErrorMessage('booking-resources.staff-assigned-only-one-resource', replace_tags, apiError);
    // }

    // reference from exceedWorkHourCalendarCell
    // workhour shop
    // if(apiError.errorCode == options.booking.booking_error_codes.bk44c) { 
    //   replace_tags = [tag_date]
    //   message = this.getErrorMessage('bookings.selected-date-is-shop-specific-off-day', replace_tags, apiError)
    // }
    return message
  }

  /**
   * Get error message and replace tags
   * @param {String} errorMessage Error message (key to translate or content message)
   * @param {Array} replaceTags Tags to replace with value in apiError.errorValues
   * @param {Object} apiError Api error {errorCode: "", errorMessage: "", errorValues: []}
   */
  getErrorMessage(errorMessage, replaceTags, apiError) {
    let message = 'Error'

    for (let i in replaceTags) {
      let replace_tag = replaceTags[i]
      let replace_tag_value = ''
      for (let j in apiError.errorValues) {
        let error_value = apiError.errorValues[j]
        let break_value_index = error_value.indexOf(':')
        let key_txt = error_value.substring(0, break_value_index)
        let content_txt = error_value.substring(break_value_index + 2, error_value.length)

        if (replace_tag == tag_date && (key_txt == 'dateTS' || key_txt == 'bookingDateTS')) {
          replace_tag_value = this.getErrorDate(content_txt)
        }
        if (replace_tag == tag_resources && key_txt == 'resourceName') {
          replace_tag_value = this.getErrorResources(content_txt)
        }
        if (replace_tag == tag_performances && key_txt == 'performanceResources')
          replace_tag_value = this.getErrorPerformances(content_txt)
      }
      message = message.replace(replace_tag, replace_tag_value)
    }

    return `<b class="hide">[${apiError.errorCode}]</b>` + message;
  }
  getErrorDate(content_txt) {
    return moment(new Date(Number(content_txt) * 1000)).format(options.standardDateFormat.ymd)
  }
  getErrorResources(content_txt) {
    return this.addSpaceToListName(content_txt)
  }
  getErrorPerformances(content_txt) {
    content_txt = content_txt.substring(0, content_txt.length - 4)
    let tmp_performances = content_txt.split('@--@')
    let txt_performances = []
    for (let i in tmp_performances) {
      let tmp_performance = tmp_performances[i]

      if (i == 0) {
        tmp_performance = tmp_performance.replace('@:@', ' ➞ ')
        tmp_performance = this.addSpaceToListName(tmp_performance)
        txt_performances.push(tmp_performance)
      } else {
        let tmp_performance_array = tmp_performance.split('@:@')
        let tmp_resource_name = tmp_performance_array[0].trim()
        let tmp_services_name = tmp_performance_array[1]

        let last_performance = txt_performances[txt_performances.length - 1]
        let last_resource_name = last_performance.split(' ➞ ')[0].trim()

        if (tmp_resource_name == last_resource_name) {
          last_performance += ', ' + tmp_services_name
          txt_performances[txt_performances.length - 1] = last_performance
        } else {
          tmp_performance = tmp_performance.replace('@:@', ' ➞ ')
          tmp_performance = this.addSpaceToListName(tmp_performance)
          txt_performances.push(tmp_performance)
        }
      }
    }

    tmp_performances = []
    for (let i in txt_performances) {
      let txt_performance = txt_performances[i]
      txt_performance = '<small><span>' + txt_performance + '</small>'
      txt_performance = txt_performance.replace(' ➞ ', ' </span>➞ ')
      tmp_performances.push(txt_performance)
    }
    return tmp_performances.join('')
  }
  addSpaceToListName(text) {
    return text.replace(/,/g, ', ')
  }
}