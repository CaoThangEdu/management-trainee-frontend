<template src='./TrainingSystemManagementDetailComponent.html'>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"
import TrainingSystemService from '../../../services/trainingsystem/trainingsystemServices'
import TrainingSystemViewModel from "../../../view-model/trainingsystem/trainingsystemViewModel"
import AppConfig from '../../../../src/app.config.json'

export default {
  name: 'TrainingSystemManagementDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      trainingsystem: {},
      errorMessages: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    faculties: {
      type: Array,
      default: null,
    },
  },
  methods: {
    async pressKeyEnter() {
      await this.save();
    },

    closeModal(changeData) {
      this.isShow = false;
      this.trainingsystem = {};

      if (changeData) {
        this.$emit("change-data");
      }
    },

    async deleteTrainingSystemConfirm(){
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.deleteTrainingSystemAsync(this.trainingsystem.id);
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

    async createTrainingSystemAsync() {
      this.trainingsystem.status = 'active';
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.createTrainingSystemAsync(this.trainingsystem);
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

    async updateTrainingSystemAsync() {
      this.showLoading();
      let api = new TrainingSystemService();
      let response = await api.updateTrainingSystemAsync(this.trainingsystem);
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
      this.trainingsystem.facultyId = this.faculties[0].id;
      // validate
      let viewModel = new TrainingSystemViewModel();
      viewModel.setFields(this.trainingsystem);
      this.errorMessages = viewModel.isValid();

      if (this.errorMessages.length > 0) {
        return;
      }

      if(this.trainingsystem.id === undefined){
        await this.createTrainingSystemAsync();
      } else{
        await this.updateTrainingSystemAsync();
      }
    },
  },
  
  watch: {
    data() {
      this.isShow = true;
      this.trainingsystem = this.data;
    }
  }
}
</script>

<style lang='scss'>
@import './TrainingSystemManagementDetailComponent.scss';
.wrapCollapse {
  dt {
    display: block;

    a {
      display: block;
      padding: 15px;
      background-color: #adadad;
      color: #fff;

      &:hover {
        text-decoration: none;
      }

      &.active {
        background-color: #3c6382;
        color: #fff;
      }
    }
  }

  dd {
    padding: 0 20px;
    height: 0;
    transition: all 0.5s ease;
    overflow: hidden;
    opacity: 0;

    &.active {
      height: auto;
      padding: 10px 0px;
      opacity: 1;
    }
  }
}
</style>
