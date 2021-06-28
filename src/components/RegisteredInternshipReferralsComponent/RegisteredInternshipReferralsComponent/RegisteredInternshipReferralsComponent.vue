<template src="./RegisteredInternshipReferralsComponent.html">
  
</template>

<script>
import RegisteredInternshipReferralsDetailComponent from "../RegisteredInternshipReferralsDetailComponent/RegisteredInternshipReferralsDetailComponent"
import ComponentBase from "../../common/component-base/ComponentBase"
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CertificateSevice from '../../../services/registeredInternshipReferrals/registeredInternshipReferrals'
import CrudMixin from "../../../helpers/mixins/crudMixin";
import { STANDARD_DATE_FORMAT } from "../../../config/constant"
import StudentService from '../../../services/student/studentServices'

export default {
  name: "ListRegisteredInternshipReferralsComponent",
  extends: ComponentBase,
  components: {
    RegisteredInternshipReferralsDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      certificates: [],
      editCertificate: {},
      confirmCertificate: null,
      pageOfItems: [],
      customLabels: {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
      },
      filter: {
        status: "active",
        studentId: "",
        isDelete: false
      },
      students: [],
    };
  },

  async mounted() {
    await this.getCertificatesFilterAsync();
    await this.getStudentsAsync();
  },

  methods:{
    convertTime(time) {
      return CrudMixin.methods.convertTime(time, STANDARD_DATE_FORMAT.DMY);
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async getStudentsAsync(){
      let filterStudent = {
        keyword: "",
        isDelete: false,
        status: "active",
        classId: "",
      };
      // Call Api
      this.showLoading();
      const api = new StudentService()

      const response = await api.getStudentsAsync(filterStudent)
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createCertificates() {
      this.editCertificate = {};
    },

    async getCertificatesFilterAsync() {
      // Call Api
      this.showLoading();
      const api = new CertificateSevice()

      const response = await api.getRegisteredInternshipReferralsAsync(this.filter);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.certificates = response.data;
    },

    async changePage(currentPage) {
      await this.getCertificatesFilterAsync(currentPage);
    },

    updateCertificate(index) {
      this.editCertificate = Object.assign({}, this.pageOfItems[index]);
    },

    changeIsdelete(index) {
      this.editCertificates = Object.assign({}, this.pageOfItems[index]);
    },

    async changeData() {
      this.$emit("change-certificate");
      await this.getCertificatesFilterAsync();
    },

    deleteCertificate(id) {
      this.confirmCertificate = {
        id: id
      };
    },
  }
}
</script>

<style lang='scss'>
@import './RegisteredInternshipReferralsComponent.scss';
</style>