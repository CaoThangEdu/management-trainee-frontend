// chứa các biến config

export const REPEAT_TYPE = {
  NONE: 1,
  EVERY_WEEK: 2,
  BIWEEKLY: 3,
  MONTHLY: 4
}

export const REPEATED_WEEKS = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4
}

export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
}

export const STANDARD_DATE_FORMAT = {
  DMY: 'DD/MM/YYYY',
  DMYH: 'DD/MM/YYYY HH:mm',
  YMD: 'YYYY/MM/DD',
  YMDH: 'YYYY/MM/DD HH:mm',
  MDY: 'MM/DD/YYYY',
  UTC: 'YYYY/MM/DDTHH:mm:ss.SSSZ',
}

export const STANDARD_DAY_FORMAT = {
  SHORT: 'ddd',
  LONG: 'dddd'
}

export const STANDARD_HOUR_FORMAT = {
  H12: 'hh:mm A',
  H24: 'HH:mm',
  H24_SECONDS: 'HH:mm:ss'
}

export const DATE_DEFAULT = "01/01/1990"


export const TIMEOUT_NOTIFICATION_DEFAULT = {
  SHORT: 10000,
  MEDIUM: 20000,
  LONG: 30000
}

export const CONFIG_UPLOAD_DEFAULT = {
  EXTENSION_IMG: ['heic', 'png', 'jpg', 'jpeg', 'gif', 'bmp'],
  EXTENSION_FILE: ['heic', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'],
  MAX_SIZE: 5 * 1024 * 1024
}

export const EDITOR_CONFIG = {
  EDITOR_URL: "https://cdn.ckeditor.com/4.14.1/full-all/ckeditor.js"
}

export const HTTP_STATUS_CODE = {
  OK: 200,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  GATEWAY_TIMEOUT: 504,
}

export const PAGINATION = {
  PAGE_DEFAULT: 1,
  HOME: 3,
  ZERO: 0,
  SMALL: 5,
  DEFAULT: 10,
  MEDIUM: 20,
  LARGE: 50,
  EXTRA_LARGE: 100,
  MAX: 99999,
  NOTIFICATION: 10
}

export const GENDER_ENUMS = {
  MALE: 1,
  FEMALE: 2
}

//~~~ [START] Constants OPTIONS STATUS ~~~\\
export const CLIENT_ENUMS = {
  CLIENT_GROUP_STATUS: {
    EVERY: -1,
    ACTIVE: 1,
    INACTIVE: 2
  },
  CLIENT_RATING_STATUS: {
    EVERY: -1,
    ACTIVE: 1,
    INACTIVE: 2
  },
  CLIENT_REFERRAL_SOURCE_STATUS: {
    EVERY: -1,
    ACTIVE: 1,
    INACTIVE: 2
  },
  CLIENT_STATUS: {
    EVERY: -1,
    ACTIVE: 1,
    INACTIVE: 2
  }
}
//~~~ [END] Constants OPTIONS STATUS ~~~\\

//~~~ [START] Constants OPTIONS BOOKING ~~~\\
export const PASSENGER_TYPE_ENUMS = {
  ADT: 1,
  CHD: 2,
  INF: 3
}

export const CALL_STATUS_ENUMS = {
  NOCALL: 1,
  CALLED: 2,
  CALLFAIL: 3
}

export const PAYMENT_TYPE_ENUMS = {
  TRANSFER: 1,
  CASH: 2,
  BALANCE: 3
}

export const BOOKING_HISTORY_TYPE_ENUMS = {
  AUTO: 1, // History is added automatically
  MANUAL: 2, // History is added by user
}

export const BOOKING_STATUS_ENUMS = {
  BK_ERR_DEPART: -25,
  BK_ERR_RETURN: -20,
  BK_ERR_PASSENGER: -13,
  PAYNOW: -12,
  NO_RESULT_FIND: -9,
  NOT_LOGIN: -6,
  NOT_MATCH_RETURN: -4,
  NOT_MATCH_DEPART: -3,
  CHANGEDPRICE: -2,
  UNKNOW: 0,
  BOOKED: 1,
  CONFIRMED: 2, // paid
  TIMEOUT: 3,
  CANCELED: 4,
  ORDER_CONFIRMED: 5,
  ORDER_REFUND: 6, // Confirm
  REFUNDING: 7, // Confirm
  REFUNDED: 8, // Confirm
  COMPLETED: 9, // Ticket completed (Confirmed)
  WILLFLY: 10, // Ticket will fly (Confirmed)
  CHANGED_INFO: 11,

}

export const TICKET_PRICE_CODES = {
  /**Phí xuất vé (của đại lý) */
  FEE: 'FEE',
  /**FARE BASE - Giá gốc của vé */
  NET: 'NET',
  /**Authorized Collection - Khoản thu hộ của nhà chức trách */
  ATH: 'ATH',
  /**Thuế và Phí Sân Bay */
  TAX: "TAX",
  /**Tổng tiền = FEE + NET + ATH + TAX */
  TTL: "TTL",

}
//~~~ [END] Constants OPTIONS BOOKING ~~~\\

//~~~ [START] Constants API ERROR CODE ~~~\\

export const ACCOUNT_ERROR_CODES = {
  IDT05C: 'IDT05C',
  IDT08C: 'IDT08C',
}
//~~~ [END] Constants API ERROR CODE ~~~\\

export const ADD_STUDENT = {
  EMAIL: '@caothang.edu.vn',
}

export const STORAGE_KEY = {
  AUTH_TOKEN: "AUTH_TOKEN"
}

export const ROLE_ENUM = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
}

export const NOTIFY_OBJECT_ENUM = {
  ALL: {
    value: "ALL",
    name: "Tất cả",
  },
  TEACHERS: {
    value: "TEACHERS",
    name: "Tất cả giáo viên",
  },
  STUDENTS: {
    value: "STUDENTS",
    name: "Tất cả sinh viên",
  },
  CLASSID: {
    value: "CLASSID",
    name: "Chọn lớp"
  },
  EMAILTEACHERS: {
    value: "EMAILTEACHERS",
    name: "Chọn giáo viên"
  },
  EMAILSTUDENTS: {
    value: "EMAILSTUDENTS",
    name: "Chọn sinh viên"
  },
}

export const INTERNSHIP_COURSE_STATUS = {
  NEW: {
    value: "new",
    name: "Mới lập",
  },
  START: {
    value: "start",
    name: "Bắt đầu thực tập",
  },
  POINT: {
    value: "point",
    name: "Chấm điểm",
  },
  END: {
    value: "end",
    name: "Kết thúc thực tập",
  },
}

export const TIME_LINE_ENUM = [
  {
    value: 'Plan',
    timelineName: 'Lên kế hoạch',
  },
  {
    value: 'AssignInstructors',
    timelineName: 'Phân công giáo viên hướng dẫn',
  },
  {
    value: 'SignUpForAnInternshipReferralForm',
    timelineName: 'Đăng ký phiếu giới thiệu thực tập',
  },
  {
    value: 'ConfirmInternshipInformationAtTheCompany',
    timelineName: 'Xác nhận thông tin thực tập tại công ty',
  },
  {
    value: 'UpdateInternshipContent',
    timelineName: 'Cập nhật nội dung công việc thực tập, báo cáo hàng tuần',
  },
  {
    value: 'SubmitReportsAndAttachedDocuments',
    timelineName: 'Nộp báo cáo, giấy tờ đính kèm',
  },
  {
    value: 'SurveyOfEnterprisesAboutTheInternshipProcess',
    timelineName: 'Khảo sát doanh nghiệp về quá trình thực tập',
  },
  {
    value: 'Grading_EnteringInternshipScores',
    timelineName: 'Chấm điểm, nhập điểm thực tập',
  },
  {
    value: 'End',
    timelineName: 'Kết thúc đợt thực tập',
  }
]
