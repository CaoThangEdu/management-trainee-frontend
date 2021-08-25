import moment from "moment";
export default {
  data() {
    return {}
  },
  methods: {
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
      return moment(new Date(time).toISOString()).format(typeFormat);
    },

    removeAccents(str) {
      let AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"    
      ];
      for (let i=0; i<AccentsMap.length; i++) {
        let re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        let char = AccentsMap[i][0];
        str = str.replace(re, char);
      }
      return str;
    }
  },
}