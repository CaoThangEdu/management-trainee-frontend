import moment from 'moment'
import { options } from '../helpers/options'
import _ from 'lodash'
import store from '../store/index'

/*******************************************/
/****** [START] Check & Validate data ******/
/*******************************************/

export function checkUndefined(value) {
  return (value === undefined);
}
export function checkNull(value) {
  return (value === null);
}
export function checkStringEmpty(value) {
  return (value === '');
}
export function checkNullOrEmpty(value) {
  return (value === '' || value === null);
}

export function isValueEmpty(value) {
  let empty = false

  if (value === undefined || value === null || value === '') empty = true
  else if (typeof value == 'object' && value.length == 0) empty = true
  else empty = false

  return empty
}

export function isNullObject(object) {
  if (object && object != null && object != undefined) {
    return false
  } else {
    return true
  }
}

export function differentObject(object_1, object_2) {
  return !_.isEqual(object_1, object_2)
}

export function isOver24Hours(hours_string) {
  return (convertHoursToMinutes(hours_string) >= options.minutesOf24h)
}

/****** [END] Check & Validate data ******/


/*********************************/
/****** [START] Format data ******/
/*********************************/
/**
 * Format number to type money. Eg: 222,222.23
 * @param {String} num String or number to format
 * @param {Number} decimal_count Number of value after decimal dot
 */
export function formatMoney(num, decimal_count = 0) {
  if (num === undefined || num === null || num === '' || isNaN(Number(num))) return '';

  num = Number(num).toFixed(decimal_count);
  num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return num;
}

/**
 * Format Date. Eg: 31/12/2020
 * @param {Date} date Date to format
 * @param {String} format Date format, defaut "DD/MM/YYYY"
 */
export function formatDate(date, format = "") {
  if (date != null) {
    let d = new Date(date);
    if (!format) format = options.standardDateFormat.default;
    return moment(d).format(format);
  } else
    return '';
}

/**
 * Format Time. Eg: 23:59
 * @param {Date} date Date to format
 * @param {String} format Date format, defaut "HH:mm"
 */
export function formatTime(time, format = '') {
  //time = new Date('08:00:00')
  if (!time) return '';
  try {
    if (!format) format = options.standardHourFormat.default;
    let arr_time = time.split(':');
    let duration = '';
    if (arr_time.length == 3)
      duration = moment({
        h: arr_time[0],
        m: arr_time[1],
        s: arr_time[2]
      }).format(format);
    else if (arr_time.length == 2)
      duration = moment({
        h: arr_time[0],
        m: arr_time[1]
      }).format(format);
    return duration
  } catch (e) {
    return '';
  }
}


/**
 * Format DateTime by setting in UserSetting.
 * @param {Date} date Date to format
 * @param {Boolean} has_hours Include hours and minutes
 */
export function formatDateBySetting(date = new Date(), has_hours = false) {
  let settingData = store.getters['user/getUserSetting'];
  if (has_hours)
    return moment(date).format(settingData.formatDate + ' HH:mm');
  else
    return moment(date).format(settingData.formatDate);
}

/**
 * Format Hour short.
 * @param {Date} time Time to get hour
 */
export function formatHourShort(time) {
  if (time != null) {
    let arrTime = time.split(':');
    return `${arrTime[0]}:${arrTime[1]}`;
  } else
    return '';
}


export function formatSize(size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  return size.toString() + ' B'
}


/****** [END] Format data ******/


/*****************************************************/
/****** [START] Convert Date, Time and DateTime ******/
/*****************************************************/

export function convertTextToTime(text_time) {
  let date = new Date();
  let time = text_time.split(':');
  let hours = time[0];
  let minutes = time[1];

  if (text_time.substr(-2) == 'PM' && Number(hours) == 12) hours = Number(hours);
  else if (text_time.substr(-2) == 'PM') hours = Number(hours) + 12;

  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
}

export function convertUTCToDate(utcs) {
  let dates = []
  if (utcs) dates = utcs.map(date => {
    let utc = moment(date).startOf('date').toDate();
    return utc
  })
  return dates
}

export function convertDateToUTC(dates) {
  let utcs = []
  if (dates) utcs = dates.map(date => {
    let utc = moment(date).format(options.standardDateFormat.ymd)
    return utc
  })
  return utcs
}

export function convertHoursToMinutes(hours_string) {
  let temp = hours_string.split(':')
  let hour = Number(temp[0])
  let minute = Number(temp[1])
  return hour * 60 + minute
}


export function convertMinutesToHours(minutes, has_second = false, zero_in_hour = true) {
  let temp = minutes / 60
  let hour = Math.floor(temp)
  let minute = minutes - (hour * 60)
  if (zero_in_hour && hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute

  let time = hour + ':' + minute
  if (has_second) time += ':00'
  return time
}

/**
 * Convert DateTime to TimeStamp.
 * @param {Date} date Date to convert
 * @param {Boolean} is_convert_timezone Is covert date to Timezone in setting
 * @param {Boolean} has_hours Convert include hours and minutes
 */
export function convertDateToTimeStamp(date, is_convert_timezone, has_hours) {
  if (is_convert_timezone) date = convertDateToTimezone(date)

  let timestamp = ''
  if (has_hours) {
    timestamp = Date.parse(date) / 1000
  } else {
    if (moment(date).isValid()) {
      timestamp = moment(date).format(options.standardDateFormat.ymd)
      timestamp = Date.parse(timestamp) / 1000
    }
  }
  return timestamp
}

export function convertTimeStampToUtcDate(timestamp) {
  let tmp_date = ''
  if (timestamp == null || timestamp == '') {
    tmp_date = new Date()
    return tmp_date
  } else {
    tmp_date = new Date(timestamp * 1000)
    return new Date(tmp_date.getUTCFullYear(), tmp_date.getUTCMonth(), tmp_date.getUTCDate())
  }
}

export function convertDateFromTimezoneToTimestamp(d, zone_from, has_hours) {
  if (!moment(d).isValid) return null
  if (zone_from == null)
   zone_from = store.getters['user/getUserSetting'].timezone

  let s = ''
  if (has_hours)
   s = moment(d).format('YYYY-MM-DDTHH:mm:ss') + zone_from
  else
   s = moment(d).format('YYYY-MM-DDT00:00:00') + zone_from

  return Date.parse(s) / 1000
}

/**
 * Convert timestamp to Date with timezone
 * @param {Number} timestamp Number of timestamp
 * @param {Boolean} isConvertTimezone Is convert by timezone
 */
export function convertTimeStampToDate(timestamp, isConvertTimezone) {
  let date = ''
  if (timestamp == null || timestamp == '' || timestamp == 0)
   date = new Date();
  else
   date = new Date(timestamp * 1000);
  if (isConvertTimezone)
   date = convertDateToTimezone(date);
  return date;
}
export function convertDateToTimezone(date_local) {
  let timezone = store.getters['user/getUserSetting'].timezone;
  let tmp = moment(date_local).utcOffset(timezone);
  let date_timezone = new Date(tmp.year(), tmp.month(), tmp.date(), tmp.hour(), tmp.minute(), tmp.second());
  return date_timezone;
}
export function convertFirstDateToTimezone(date_local) {
  let timezone = store.getters['user/getUserSetting'].timezone
  let tmp = moment(date_local).utcOffset(timezone)
  let date_timezone = new Date(tmp.year(), tmp.month(), 1, tmp.hour(), tmp.minute(), tmp.second())

  return date_timezone
}

/**
 * Convert from UTC Date to Date with timezone
 * @param {Date} d UTC Date
 * @param {Boolean} zone_to Timezone will convert
 */
export function convertDateFromUtcToTimezone(d, zone_to) {
  let tmp = moment.utc(d).utcOffset(zone_to)
  if (!tmp.isValid) return null
  let toD = new Date(tmp.year(), tmp.month(), tmp.date(), tmp.hour(), tmp.minute(), tmp.second())
  return toD
}
export function convertHourToTimezone(date) {
  let date_settting = convertDateToTimezone(new Date())
  let hour_settting = new Date(
    date.getFullYear(), date.getMonth(), date.getDate(),
    date_settting.getHours(), date_settting.getMinutes(), date_settting.getSeconds()
  )
  return hour_settting
}

export function convertDateFromLocalToTimezone(date) {
  let date_settting = convertDateToTimezone(date)
  return new Date(date_settting.getFullYear(), date_settting.getMonth(), date_settting.getDate())
}
/****** [END] Convert Date, Time and DateTime ******/


export function loadWeekOfMonth(weeks) {
  let arr_week = [{
      name: "1st",
      value: options.repeatedWeeksOptions.first
    },
    {
      name: "2nd",
      value: options.repeatedWeeksOptions.second
    },
    {
      name:"3rd",
      value: options.repeatedWeeksOptions.third
    },
    {
      name: "4th",
      value: options.repeatedWeeksOptions.fourth
    }
  ]

  let str_week = ''
  for (let week in weeks) {
    for (let index in arr_week) {
      if (weeks[week] == arr_week[index].value) {
        str_week += arr_week[index].name + ', '
      }
    }
  }

  return "Tất cả" + ' ' + str_week.substr(0, str_week.length - 2) + ' ' + "Week"
}
export function loadDayOfWeek(days) {
  // [1, 2] -> Monday, Tuesday
  days = _.uniq(days)
  let arr_day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]

  let str_day = ''
  for (let index in days) {
    let day = arr_day[days[index]]
    if (index > 0) str_day = str_day + ', ' + day
    else str_day = day
  }
  return str_day
}
export function loadTextOfWeek(days) {
  // [1] -> general.monday
  let arr_day = [
    'general.sunday',
    'general.monday',
    'general.tuesday',
    'general.wednesday',
    'general.thursday',
    'general.friday',
    'general.saturday'
  ]

  let str_day = ''
  for (let index in days) {
    if (index > 0) str_day = str_day + ', ' + arr_day[days[index]]
    else str_day = arr_day[days[index]]
  }
  return str_day
}
export function addDateZero(date) {
  if (!checkUndefined(date) && !checkNull(date)) {
    if (date.toString().length == 1)
      date = '0' + date
    return date
  } else {
    return null
  }
}

export function getTimeInclude24(time) {
  let to_time_minutes = convertHoursToMinutes(time)
  if (to_time_minutes < options.minutesOf24h)
    to_time_minutes += options.minutesOf24h
  return convertMinutesToHours(to_time_minutes)
}
export function getTimeSubtract24(time) {
  let to_time_minutes = convertHoursToMinutes(time)
  if (to_time_minutes >= options.minutesOf24h)
    to_time_minutes -= options.minutesOf24h
  return convertMinutesToHours(to_time_minutes)
}

export function isAmOrPm(total_minutes, zero_in_hour = true) {
  let minutes_of_half_day = 720
  let tmp_total_minutes = total_minutes

  if (tmp_total_minutes >= options.minutesOf24h)
    tmp_total_minutes -= options.minutesOf24h

  let total_half_day_minute = tmp_total_minutes
  if (tmp_total_minutes >= minutes_of_half_day + 60) {
    total_half_day_minute -= minutes_of_half_day
  }

  let time_text = convertMinutesToHours(total_half_day_minute, false, zero_in_hour)

  if (tmp_total_minutes < minutes_of_half_day) return time_text + ' AM'
  if (minutes_of_half_day <= tmp_total_minutes) return time_text + ' PM'
}
export function logTime() {
  let date = new Date()
  return date.getSeconds() + '.' + date.getMilliseconds()
}
export function getDatePickerMin(date_picked) {
  return moment(date_picked).subtract(1, 'month').toDate()
}
export function getDatePickerMax(date_picked) {
  return moment(date_picked).add(1, 'year').toDate()
}

/*
  Input  : array, value
  Output : text  
  Exp : arr = [
    {value :  1 , text : 'value 1'},
    {value :  2 , text : 'value 2'}
  ]
  (arr,1) => 'value 1'  
*/
export function getTypeNameOfArray(arr, value) {
  let text = ''
  let type = _.find(arr, x => x.value == value)
  if (type != undefined) {
    text = type.text
  }
  return text
}

export function cookieAction(vue, cookie_action, key, expiry_date = null, value = null) {
  if (cookie_action == options.cookie_action.exist)
    return vue.$cookies.isKey(key)
  else if (cookie_action == options.cookie_action.set)
    vue.$cookies.set(key, value, expiry_date)
  else if (cookie_action == options.cookie_action.remove)
    vue.$cookies.remove(key)
  else if (cookie_action == options.cookie_action.get)
    return vue.$cookies.get(key)
}

export function roundNumberByDecimal(number, decimal = 0) {
  let factor = Math.pow(10, decimal)
  let tmp_number = Math.round(number * factor) / factor
  return tmp_number
}

export function guid() {
  return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}


export function convertHtmlToTxt(html) { // mapFieldsFromApi
  let txt = html
  txt = txt.replace(/&#34/g, '"')
  return txt
}

export function convertTxtToHtml(txt) { // mapFieldsToApi
  let html = txt
  html = html.replace(/"/g, '&#34')
  return html
}