import {
    REPEAT_TYPE,
    REPEATED_WEEKS,
    DAYS_OF_WEEK,
    STANDARD_DATE_FORMAT,
    STANDARD_DAY_FORMAT,
    STANDARD_HOUR_FORMAT,
    GENDER_ENUMS,
    PASSENGER_TYPE_ENUMS,
    CALL_STATUS_ENUMS,
    BOOKING_STATUS_ENUMS,
    TICKET_PRICE_CODES,
    PAYMENT_TYPE_ENUMS,
    BOOKING_HISTORY_TYPE_ENUMS,
    HTTP_STATUS_CODE,
    PAGINATION,
    TIMEOUT_NOTIFICATION_DEFAULT,
    CONFIG_UPLOAD_DEFAULT,
    EDITOR_CONFIG,
} from '../config/constant';

export const options = {
    gender: {
        male: GENDER_ENUMS.MALE,
        female: GENDER_ENUMS.FEMALE,
    },
    //~~~ [START] Options TIME ~~~\\

    minutesOf24h: 1440,
    milisecondsOf24h: 86400000,
    secondsOf24h: 86400,
    repeatType: {
        none: REPEAT_TYPE.NONE,
        everyWeek: REPEAT_TYPE.EVERY_WEEK,
        biweekly: REPEAT_TYPE.BIWEEKLY,
        monthly: REPEAT_TYPE.MONTHLY,
    },
    repeatedWeeksOptions: {
        first: REPEATED_WEEKS.FIRST,
        second: REPEATED_WEEKS.SECOND,
        third: REPEATED_WEEKS.THIRD,
        fourth: REPEATED_WEEKS.FOURTH,
    },
    daysOfWeek: {
        sunday: DAYS_OF_WEEK.SUNDAY,
        monday: DAYS_OF_WEEK.MONDAY,
        tuesday: DAYS_OF_WEEK.TUESDAY,
        wednesday: DAYS_OF_WEEK.WEDNESDAY,
        thursday: DAYS_OF_WEEK.THURSDAY,
        friday: DAYS_OF_WEEK.FRIDAY,
        saturday: DAYS_OF_WEEK.SATURDAY,
    },
    standardDateFormat: {
        default: STANDARD_DATE_FORMAT.DMY,
        dmy: STANDARD_DATE_FORMAT.DMY,
        dmyh: STANDARD_DATE_FORMAT.DMYH,
        ymd: STANDARD_DATE_FORMAT.YMD,
        ymdh: STANDARD_DATE_FORMAT.YMDH,
        mdy: STANDARD_DATE_FORMAT.MDY,
        utc: STANDARD_DATE_FORMAT.UTC,
    },
    standardDayFormat: {
        default: STANDARD_DAY_FORMAT.long,
        short: STANDARD_DAY_FORMAT.SHORT,
        long: STANDARD_DAY_FORMAT.LONG,
    },
    standardHourFormat: {
        default: STANDARD_HOUR_FORMAT.H24,
        h12: STANDARD_HOUR_FORMAT.H12,
        h24: STANDARD_HOUR_FORMAT.H24,
        h24Seconds: STANDARD_HOUR_FORMAT.H24_SECONDS,
    },
    //~~~ [END] Options TIME ~~~\\

    httpStatusCode: {
        ok: HTTP_STATUS_CODE.OK,
        noContent: HTTP_STATUS_CODE.NO_CONTENT,

        badRequest: HTTP_STATUS_CODE.BAD_REQUEST,
        unauthorized: HTTP_STATUS_CODE.UNAUTHORIZED,
        forbidden: HTTP_STATUS_CODE.FORBIDDEN,
        notFound: HTTP_STATUS_CODE.NOT_FOUND,

        internalServerError: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        badGateway: HTTP_STATUS_CODE.BAD_GATEWAY,
        gatewayTimeout: HTTP_STATUS_CODE.GATEWAY_TIMEOUT,
    },

    pagination: {
        pageDefault: PAGINATION.PAGE_DEFAULT,
        home: PAGINATION.HOME,
        zero: PAGINATION.ZERO,
        small: PAGINATION.SMALL,
        default: PAGINATION.DEFAULT,
        large: PAGINATION.LARGE,
        extraLarge: PAGINATION.EXTRA_LARGE,
        max: PAGINATION.MAX,
    },

    timeoutNotificationDefault: {
        short: TIMEOUT_NOTIFICATION_DEFAULT.SHORT,
        medium: TIMEOUT_NOTIFICATION_DEFAULT.MEDIUM,
        long: TIMEOUT_NOTIFICATION_DEFAULT.LONG,
    },

    configUploadDefault: {
        fileUrl: process.env.FILE_UPLOAD_API_URL,
        extensionImg: CONFIG_UPLOAD_DEFAULT.EXTENSION_IMG,
        extensionFile: CONFIG_UPLOAD_DEFAULT.EXTENSION_FILE,
        maxSize: CONFIG_UPLOAD_DEFAULT.MAX_SIZE,
    },

    editorConfig: {
        editorUrl: EDITOR_CONFIG.EDITOR_URL,
    },

    //~~~ [START] Options BOOKING ~~~\\

    passengerType: {
        adult: PASSENGER_TYPE_ENUMS.ADT,
        children: PASSENGER_TYPE_ENUMS.CHD,
        infant: PASSENGER_TYPE_ENUMS.INF,
    },
    callStatus: {
        noCall: CALL_STATUS_ENUMS.NOCALL,
        called: CALL_STATUS_ENUMS.CALLED,
        callFailed: CALL_STATUS_ENUMS.CALLFAIL,
    },
    paymentType: {
        transfer: PAYMENT_TYPE_ENUMS.TRANSFER,
        cash: PAYMENT_TYPE_ENUMS.CASH,
        balance: PAYMENT_TYPE_ENUMS.BALANCE,
    },
    bookingHistoryType: {
        auto: BOOKING_HISTORY_TYPE_ENUMS.AUTO,
        manual: BOOKING_HISTORY_TYPE_ENUMS.MANUAL,
    },
    bookingStatus: {
        errorDepart: BOOKING_STATUS_ENUMS.BK_ERR_DEPART,
        errorReturn: BOOKING_STATUS_ENUMS.BK_ERR_RETURN,
        errorPassenger: BOOKING_STATUS_ENUMS.BK_ERR_PASSENGER,
        paynow: BOOKING_STATUS_ENUMS.PAYNOW,
        noResultFind: BOOKING_STATUS_ENUMS.NO_RESULT_FIND,
        notLogin: BOOKING_STATUS_ENUMS.NOT_LOGIN,
        notMatchReturn: BOOKING_STATUS_ENUMS.NOT_MATCH_RETURN,
        notMatchDepart: BOOKING_STATUS_ENUMS.NOT_MATCH_DEPART,
        changedPrice: BOOKING_STATUS_ENUMS.CHANGEDPRICE,
        unknow: BOOKING_STATUS_ENUMS.UNKNOW,
        booked: BOOKING_STATUS_ENUMS.BOOKED,
        confirmed: BOOKING_STATUS_ENUMS.CONFIRMED,
        timeout: BOOKING_STATUS_ENUMS.TIMEOUT,
        canceled: BOOKING_STATUS_ENUMS.CANCELED,
        orderConfirmed: BOOKING_STATUS_ENUMS.ORDER_CONFIRMED,
        orderRefund: BOOKING_STATUS_ENUMS.ORDER_REFUND,
        refunding: BOOKING_STATUS_ENUMS.REFUNDING,
        refunded: BOOKING_STATUS_ENUMS.REFUNDED,
        completed: BOOKING_STATUS_ENUMS.COMPLETED,
        willfly: BOOKING_STATUS_ENUMS.WILLFLY,
        changedInfo: BOOKING_STATUS_ENUMS.CHANGED_INFO,
    },
    ticketPriceCodes: {
        /**Phí xuất vé (của đại lý) */
        FEE: TICKET_PRICE_CODES.FEE,
        /**FARE BASE - Giá gốc của vé */
        NET: TICKET_PRICE_CODES.NET,
        /**Authorized Collection - Khoản thu hộ của nhà chức trách */
        ATH: TICKET_PRICE_CODES.ATH,
        /**Thuế và Phí Sân Bay */
        TAX: TICKET_PRICE_CODES.TAX,
        /**Tổng tiền = FEE + NET + ATH + TAX */
        TTL: TICKET_PRICE_CODES.TTL,
    },
    //~~~ [END] Options BOOKING ~~~\\
};