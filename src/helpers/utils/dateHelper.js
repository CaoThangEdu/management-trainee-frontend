import moment from "moment";

export default {
    /**
     * Convert from date or date with timezone to UTC Date
     * @param {string/Number} date // date
     * ex: '2019-10-10', 1631681250
     * @param {string} timezone // timezone (default "")
     * ex: 'Asia/Ho_Chi_Minh'
     * @return {Date} UTC Date
     */
    parseToDatetime(date, timezone = "") {
        let dateTime = typeof date == "string" ? date : (date * 1000);
        let dateConvert = new Date(dateTime);
        if (timezone) {
            dateConvert = moment.tz(dateTime, timezone).format();
        }
        if (JSON.stringify(new Date(dateConvert)) === 'null') {
            return null;
        }
        return new Date(dateConvert);
    },

    /**
     * Time displayed in UTC Date
     * @param {Date} date UTC Date
     * ex: new Date('2019-10-10')
     * @param {string} format // format date of js (default HH:mm DD/MM/YYYY)
     * ex: 'DD/MM/YYYY'
     * @return {Date} UTC Date -> '07:00 10/10/2021'
     */
    displayUtcDatetime(date, format = "") {
        if (JSON.stringify(new Date(date)) === 'null' || !date) {
            return null;
        }
        format = format ? format : 'HH:mm DD/MM/YYYY';
        return moment(date).utc().format(format);
    },
    /**
     * Time displayed in localtime
     * @param {Date} date UTC Date
     * ex: new Date('2019-10-10')
     * @param {string} format // format date of js (default HH:mm DD/MM/YYYY)
     * ex: 'DD/MM/YYYY'
     * @return {Date} d Date localtime -> '00:00 10/10/2021'
     */
    displayDatetime(date, format = "") {
        if (JSON.stringify(new Date(date)) === 'null' || !date) {
            return null;
        }
        let time = date.toLocaleString();
        format = format ? format : 'HH:mm DD/MM/YYYY';
        return moment(time).format(format);
    }
}