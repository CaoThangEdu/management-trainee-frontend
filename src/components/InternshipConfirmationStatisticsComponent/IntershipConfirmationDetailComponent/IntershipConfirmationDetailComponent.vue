<template>
<BaseModal
  @mouse-click-outside="closeModal()"
  :modalName="`IntershipConfirmationDetailComponent`" 
  :isShow="isShow"
  size="lg">
            <div class="form-row p-3">
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Mã số thuế</label>
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.taxCode"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Tên công ty</label>
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.title"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Giám đốc</label>
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.owner"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Địa chỉ</label>
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.companyAddress"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Website</label>
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.website"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Cán bộ hướng dẫn</label>
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.manager"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Số điện thoại cán bộ hướng dẫn</label>
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="keyInternshipConfirmation.phoneNumber"
                />
              </div>
              <div class="form-group col-sm-12 col-md-6 col-lg-6" v-if="intership === true">
                <label>Các công ty đã phỏng vấn</label>
                <textarea name="name-companies" cols="30"  class="w-100" readonly v-model="keyInternshipConfirmation.companiesInterviewed"></textarea>
              </div>
              <div class="form-group col-sm-12 col-md-12 col-lg-12" v-if="intership === false">
                <label>Những công ty đã phỏng vấn</label>
                <textarea name="name-companies" cols="30" rows="10" class="w-100" readonly v-model="keyInternshipConfirmation.companiesInterviewed"></textarea>
              </div>
            </div>
  <template #header>
    <h5>Chi tiết xác nhận thực tập</h5>
    <button class="close" style="color: red;" @click="closeModal()">
      &times;
    </button>
  </template>
  <template #footer>
    <div class="form-inline form-group col-md-12 pr-0">
      <div class="col-form-label col-md-4 col-sm-4"></div>
      <div class="col-md-8 col-sm-8 pl-0 pr-0">
        <button @click="closeModal()" class="btn btn-primary float-right ml-2">
          Xác nhận
        </button>
      </div>
    </div>
  </template>
</BaseModal>

</template>

<script>
import ComponentBase from "../../common/component-base/ComponentBase"
import BaseModal from '../../common/base-modal/BaseModal'
import AlertMessages from "../../common/alert/alert-messages/AlertMessages"

export default {
  name: 'IntershipConfirmationDetailComponent',
  extends: ComponentBase,
  components: {
    BaseModal,
    AlertMessages,
  },
  data() {
    return {
      isShow: false,
      intership:false,
      keyInternshipConfirmation: {
        studentId: "",
        taxCode: "",
        title: "",
        companyAddress: "",
        website: "",
        owner: "",
        manager: "",
        companiesInterviewed: "",
        status: "", //notPracticed, practiced
        phoneNumber: "",
        internshipCourseId:""
      },
    }
  },

  props: {
    intershipConfirmation: {
      type: Object,
      default: null,
    },
  },

  methods: {
    closeModal(){
      this.isShow = false;
    }
  },
  watch: {
    intershipConfirmation() {
      this.isShow = true;
      if(this.intershipConfirmation.taxCode !== ""){
        this.intership = true;
      }
      if(this.intershipConfirmation.taxCode === ""){
        this.intership = false;
      }
      this.keyInternshipConfirmation = this.intershipConfirmation;
    }
  }
}
</script>

<style lang='scss'>
.form-select-class{
  width: 100%;
  height: 35px;
}
</style>
