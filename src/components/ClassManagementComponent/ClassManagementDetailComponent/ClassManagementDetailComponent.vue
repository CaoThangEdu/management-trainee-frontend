<template src='./ClassManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import ClassService from '../../../services/class/classServices'
import ClassViewModel from "../../../view-model/class/classViewModel"
import AppConfig from '../../../../src/app.config.json'
import CrudMixin from "../../../helpers/mixins/crudMixin";

export default {
  name: 'ClassManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  mixins: [ CrudMixin ],
  data() {
    return {
      isShow: false,
      classroom: {},
      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    plans: {
      type: Array,
      default: null
    },
  },

  methods: {
    getInfoObject(trainingSystemId, list) {
      return CrudMixin.methods.getInfo(trainingSystemId, list);
    },
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.classroom = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async createClassAsync() {
      this.showLoading();
      let api = new ClassService();
      let response = await api.createClassAsync(this.classroom);
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
        `${AppConfig.notification.content_created_success_default}`
      );

      this.closeModal(true);
    },

    async updateClassAsync() {
      this.showLoading();
      let api = new ClassService();
      let response = await api.updateClassAsync(this.classroom);
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

    async save() {
      // validate
      let viewModel = new ClassViewModel();
      viewModel.setFields(this.classroom);
      this.errorMessages = viewModel.isValid();
      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.classroom.id === undefined){
        await this.createClassAsync();
      } else{
        await this.updateClassAsync();
      }
    }
  },

  watch: {
    data() {
      this.isShow = true;
      this.classroom = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './ClassManagementDetailComponent.scss';
</style>
