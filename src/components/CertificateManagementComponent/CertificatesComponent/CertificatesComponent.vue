<template src="./CertificatesComponent.html"> </template>

<script>
import CertificateDetailComponent from "../CertificateDetailComponent/CertificateDetailComponent.vue";
import ComponentBase from "../../common/component-base/ComponentBase";
import AppConfig from "../../../../src/app.config.json";
import JwPagination from "jw-vue-pagination";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
import CertificateSevice from "../../../services/certificate/CertificateServices";
import CrudMixin from "../../../helpers/mixins/crudMixin";
import StudentService from "../../../services/student/studentServices";
import ClassService from "../../../services/class/classServices";
import CompanyService from "../../../services/company/companyServices";
import moment from "moment";

export default {
  name: "CertificatesComponent",
  extends: ComponentBase,
  components: {
    CertificateDetailComponent,
    ConfirmDialog,
    JwPagination,
  },
  props: {
    isAdmin: Boolean,
  },
  mixins: [CrudMixin],
  data() {
    return {
      certificates: [],
      editCertificate: {},
      confirmedCertificate: null,
      pageOfItems: [],
      customLabels: {
        first: "<<",
        last: ">>",
        previous: "<",
        next: ">",
      },
      filter: {
        status: "active",
        studentId: "",
        isDelete: false,
      },
      students: [],
      classById: [],
      companiesByTaxCode:{},
      company:{}
    };
  },

  async mounted() {
    await this.getCertificatesAsync();
    await this.getStudentsAsync();
    await this.getClassesAsync();
    await this.getCompaniesAsync();
  },

  methods: {
    convertTime(time) {
      return moment(time).format("DD/MM/YYYY");
    },

    getInfoObject(id, list) {
      return CrudMixin.methods.getInfo(id, list);
    },

    async getStudentsAsync() {
      let filterStudent = {
        keyword: "",
        classId: "",
        internshipCourseId: "",
        status: "active",
        isDelete: false,
      };
      // Call Api
      this.showLoading();
      const api = new StudentService();

      const response = await api.getStudentsAsync(filterStudent);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.students = response.data;
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
      const api = new CertificateSevice();

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
        index: index,
      };
    },
    // Call api delete Certificate
    async agreeConfirm(confirmedCertificate) {
      this.showLoading();
      let api = new CertificateSevice();
      let response = await api.deleteCertificateAsync(confirmedCertificate.id); // Gọi Api
      this.showLoading(false);
      if (!response.isOK) {
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
        `${AppConfig.notification.content_deleted_success_default}`
      );
    },

    changeStatus(event, index){
      this.certificates[index].status = event.target.value;
    },

    getNameClass(classId) {
      if(this.classById[classId] === undefined){
        return "";
      }
      return this.classById[classId].className;
    },

    async getClassesAsync() {
      // Call Api
      this.showLoading();
      const api = new ClassService();

      const response = await api.getClassesAsync();
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      this.classById = this.convertArrayToObject(response.data.items, "id");
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

    async updateCertificateAsync(index) {
      this.showLoading();
      let api = new CertificateSevice();
      let response = await api.updateCertificateAsync(this.certificates[index]);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }

      this.$set(this.certificates, index, response.data);
      if(response.data.status === "confirmed"){
        this.company.taxCode = response.data.taxCode;
        this.company.title = response.data.companyName;
        this.company.companyAddress = response.data.companyAddress;
        this.company.owner = response.data.owner;
        this.company.phoneNumber = response.data.phoneNumberOfCompany;
        this.company.status = "active";

        await this.createCompanyAsync(this.company);
      }
      this.showNotifications(
        "success",
        `${AppConfig.notification.title_default}`,
        `${AppConfig.notification.content_updated_success_default}`
      );
    },

    async createCompanyAsync(company) {
      if(this.companiesByTaxCode[company.taxCode]){
          return ;
      }
      this.showLoading();
      let api = new CompanyService();
      let response = await api.createCompanyAsync(company);
      this.showLoading(false);
      if (!response.isOK) {
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
        `${AppConfig.notification.content_created_success_default}`
      );
    },

    async getCompaniesAsync(){
      // Call Api
      this.showLoading();
      const api = new CompanyService()

      const response = await api.getCompaniesAsync()
      this.showLoading(false);

      if(!response.isOK){
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      let companies = response.data.items
      companies = companies.reduce((map, obj) => (map[obj.taxCode] = obj, map), {});
      this.companiesByTaxCode = companies;
    },
  },
};
</script>

<style lang="scss">
@import "./CertificatesComponent.scss";
</style>
