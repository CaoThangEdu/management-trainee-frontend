<template>
<BaseModal @mouse-click-outside="closeModal(false)" :modalName="`TeacherAssignmentDetailComponent`" :isShow="isShow"
  size="lg">
  <div class="">
    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">Tên lớp</label>
      <div class="col-md-8 col-sm-8">
        <input type="text" class="form-control" id="name" v-model="classroom.className">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-md-4 col-sm-4 col-form-label">Đợt thực tập</label>
      <div class="col-md-8 col-sm-8">
        <div class="input-group mb-3">
          <select class="form-control form-select form-select-class" v-model="classroom.internshipCourseId">
            <option v-for="(item, index) in plans" 
              :key="index" :value="item.id">
              {{ item.internshipCourseName}}
            </option>
          </select>
        </div>
      </div>
    </div>
    <input type="hidden" v-model="classroom.status" value="active">

  </div>

  <template #header>
    <h5>{{classroom.id ? "Cập nhật lớp" : "Thêm mới lớp"}}</h5>
    <button class="close" style="color: red;" @click="closeModal(false)">&times;</button>
  </template>

  <template #footer>
    <div class="form-inline form-group col-md-12 pr-0">
      <div class="col-form-label col-md-4 col-sm-4"></div>
      <div class="col-md-8 col-sm-8 pl-0 pr-0">
        <AlertMessages :messages="errorMessages" />
      </div>
    </div>

    <div class="form-inline form-group col-md-12 pr-0">
      <div class="col-form-label col-md-4 col-sm-4"></div>
      <div class="col-md-8 col-sm-8 pl-0 pr-0">
        <button @click="save"
          class="btn btn-primary float-right ml-2">{{classroom.id ? "Cập nhật" : "Thêm mới"}}</button>
        <button class="btn btn-dark float-right" @click="closeModal(false)">Hủy</button>
      </div>
    </div>
  </template>
</BaseModal>
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

</style>
