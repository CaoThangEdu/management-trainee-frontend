<template src="./CertificatesComponent.html">
  
</template>

<script>
import CertificateDetailComponent from "../CertificateDetailComponent/CertificateDetailComponent.vue"
import ComponentBase from "../../common/component-base/ComponentBase"
import AppConfig from '../../../../src/app.config.json'
import JwPagination from 'jw-vue-pagination';
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog"
import CertificateSevice from '../../../services/certificate/CertificateServices'
import CrudMixin from "../../../helpers/mixins/crudMixin";
import StudentService from '../../../services/student/studentServices'
import moment from 'moment'

export default {
  name: "CertificatesComponent",
  extends: ComponentBase,
  components: {
    CertificateDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  props:{
    isAdmin: Boolean,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      certificates: [],
      editCertificate: {},
      confirmedCertificate: null,
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
    await this.getCertificatesAsync();
    await this.getStudentsAsync();
  },

  methods:{
    convertTime(time) {
      return moment(time).format('DD/MM/YYYY');
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

    async getCertificatesAsync() {
      // Call Api
      this.showLoading();
      const api = new CertificateSevice()

      const response = await api.getCertificatesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.certificates = response.data.items;
    },


    updateCertificate(index) {
      this.editCertificate = Object.assign({}, this.certificates[index]);
    },

    changeIsdelete(index) {
      this.editCertificates = Object.assign({}, this.pageOfItems[index]);
    },

    async changeData() {
      this.$emit("change-certificate");
      await this.getCertificatesAsync();
    },

    deleteCertificate(id, index) {
      this.confirmedCertificate = {
        id: id,
        index: index
      };
    },
    // Call api delete Certificate
    async agreeConfirm(confirmedCertificate) {
      this.showLoading();
      let api = new CertificateSevice();
      let response = await api.deleteCertificateAsync(confirmedCertificate.id); // Gọi Api
      this.showLoading(false);
      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.certificates.splice(confirmedCertificate.index, 1);
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_deleted_success_default}`,
      );
    },

    async updateStatusCertificate(status, index){
      if(status ==="unconfirmed"){
        this.certificate[index].status = "confirmed";
        await this.updateCertificateAsync(this.certificate[index]);
      }
      if(status ==="confirmed"){
        this.certificate[index].status = "complete";
        await this.updateCertificateAsync(this.certificate[index]);
      }
    },

    async updateCertificateAsync(certificate) {
      this.showLoading();
      let api = new CertificateService();
      let response = await api.updateCertificateAsync(certificate);
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );

        this.closeModal(true);
    },
  }
}
</script>

<style lang='scss'>
@import './CertificatesComponent.scss';
</style>