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
      studentsByMssv: [],
      classById: [],
      companiesByTaxCode: {},
      company: {},
      selectCertificate: -1,
      filterCerticate: {
        mssv: "",
        status: "",
        classId: "",
      },
      selectUpdateCertificates:[],
    };
  },

  async mounted() {
    await this.getCertificatesAsync(this.filterCerticate);
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
      this.studentsByMssv = this.convertArrayToObject(
        response.data,
        "studentId"
      );
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    createCertificates() {
      this.editCertificate = {};
    },

    async getCertificatesAsync(filterCerticate) {
      // Call Api
      this.showLoading();
      const api = new CertificateSevice();

      const response = await api.getCertificatesAsync(filterCerticate);
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

    updateCertificate(index) {
      this.selectCertificate = index;
      this.editCertificate = Object.assign({}, this.certificates[index]);
    },

    changeIsdelete(index) {
      this.editCertificates = Object.assign({}, this.pageOfItems[index]);
    },

    async changeData(certificate, action) {
      if (action === "create") {
        return this.certificates.unshift(certificate);
      }
      this.$set(this.certificates, this.selectCertificate, certificate);
      this.selectCertificate = -1;
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

    changeStatus(event, index) {
      this.certificates[index].status = event.target.value;
    },

    getNameClass(classId) {
      if (this.classById[classId] === undefined) {
        return "";
      }
      return this.classById[classId].className;
    },

    getStudent(mssv) {
      if (this.studentsByMssv[mssv] === undefined) {
        return "";
      }
      return this.studentsByMssv[mssv];
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
      if (response.data.status === "confirmed") {
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
      if (this.companiesByTaxCode[company.taxCode]) {
        return;
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

    async getCompaniesAsync() {
      const filterCompany = {
        keyword: "",
        status: "",
      };
      // Call Api
      this.showLoading();
      const api = new CompanyService();

      const response = await api.getCompaniesAsync(filterCompany);
      this.showLoading(false);

      if (!response.isOK) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          response.errorMessages
        );
        return;
      }
      let companies = response.data;
      companies = companies.reduce(
        (map, obj) => ((map[obj.taxCode] = obj), map),
        {}
      );
      this.companiesByTaxCode = companies;
    },

    confirmationCompany(taxCode) {
      if (this.companiesByTaxCode[taxCode]) {
        return "Hoạt động";
      }
      return "Không hoạt động";
    },

    changeCompanies(company) {
      this.companiesByTaxCode[company.taxCode] = company;
    },

    selectUpdateCertificate(event){
      // select all
      if(event.target.value === "-1"){
        if(event.target.checked === false){
          this.selectUpdateCertificates = [];
          return;
        }
        this.selectUpdateCertificates = this.certificates;
        return;
      }
      //select item
      if(event.target.checked === false){
        for(let i = 0; i <= this.selectUpdateCertificates.length - 1; i++){
          if(this.certificates[event.target.value].id === this.selectUpdateCertificates[i].id){
            this.selectUpdateCertificates.splice(i, 1);
          }
        }
        return;
      }
      this.selectUpdateCertificates.push(this.certificates[event.target.value]);
    }
    
  },
};
</script>

<style lang="scss">
@import "./CertificatesComponent.scss";
</style>
