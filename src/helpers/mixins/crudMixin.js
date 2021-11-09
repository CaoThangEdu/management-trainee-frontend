import moment from "moment";
import { ROLE_ENUM, INTERNSHIP_COURSE_STATUS } from "../../config/constant";

export default {
  data() {
    return {
      roleEnums: ROLE_ENUM,
      internshipCourseStatus: INTERNSHIP_COURSE_STATUS,
    }
  },
  methods: {
    isNumber(val) {
      if (isNaN(Number(val.key))) {
        return val.preventDefault();
      }
    },
    
    getStatusIcon(status) {
      if (status == 'active') {
        return 'fa fa-unlock';
      }
      return 'fa fa-lock';
    },

    getInfo(isId, list) {
      const result = list.find(({
        id
      }) => id === isId);
      if (!result) {
        return false;
      }
      return result;
    },

    getInfoByCourseId(isId, list) {
      const result = list.find(({
        courseId
      }) => courseId === isId);
      return result;
    },

    getInfoObjectByName(isClassName, list) {
      const result = list.find(({
        className
      }) => className === isClassName);
      return result;
    },

    convertTime(time, typeFormat) {
      if (JSON.stringify(new Date(time)) === 'null' || !time) {
        return null;
      }
      return moment(new Date(time).toISOString()).format(typeFormat);
    },
    // Convert array to object
    convertArrayToObject(arr, key) {
      const initialValue = {};
      return arr.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item,
        };
      }, initialValue);
    },
    getRoleName(role) {
      if(role == this.roleEnums.STUDENT) {
        return 'Sinh viên';
      }

      if(role == this.roleEnums.TEACHER) {
        return 'Giáo viên';
      }
      return 'Quản trị viên';
    },
    getPlanStatusName(status) {
      for(let i in this.internshipCourseStatus) {
        if(this.internshipCourseStatus[i].value == status) return this.internshipCourseStatus[i].name;
      }
      return '';
    },
  }
}