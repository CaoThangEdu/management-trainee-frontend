<template>
  <BaseModal
    @mouse-click-outside="isShow = false;"
    @key-esc="isShow = false;"
    @key-enter="pressKeyEnter"
    :modalName="`ConfirmDialog`"
    :isShow="isShow"
  >
    <template #header>
      <h5 class="mb-0">{{ title ? title : "Thông báo" }}</h5>
    </template>
    <div class="text--red mb-2 text--italic">
      {{ message ? message : "Bạn có chắc chắn thêm sinh viên đã từng tồn tại ở đợt thực tập trước đó?" }}
    </div>
    <div v-if="dataDisplay.length > 0">
      <figure class="mb-0">
        <figcaption class="caption-table mb-2">
          Danh sách sinh viên đã từng tồn tại ở đợt thực tập trước đó
        </figcaption>
        <div class="table-responsive">
          <table class="table mb-0">
            <thead class="">
              <tr>
                <th scope="col">STT</th>
                <th scope="col">MSSV</th>
                <th scope="col">Họ</th>
                <th scope="col">Tên</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dataItem, index) in dataDisplay" :key="index + 'dataDisplay'">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ dataItem.studentId }}</td>
                <td>{{dataItem.lastName }}</td>
                <td>{{ dataItem.firstName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>
    </div>
    <template #footer>
      <input
        type="button"
        :value="'Có'"
        @click="agreeConfirm"
        class="btn btn-danger"
      />
      <input
        type="button"
        :value="'Không'"
        @click="cancelConfirm"
        class="btn btn-dark"
      />
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "../../../components/common/base-modal/BaseModal";

export default {
  name: "ConfirmDialog",
  components: {
    BaseModal,
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      default: null,
    },
    dataDisplay: {
      type: Array,
      default: null,
    }
  },

  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    pressKeyEnter() {
      this.agreeConfirm();
    },

    agreeConfirm() {
      this.isShow = false;
      this.$emit("agree");
    },

    cancelConfirm() {
      this.isShow = false;
      this.$emit("cancel");
    },
  },
  watch: {
    data() {
      this.isShow = true; // Show alert
    },

    // isShow() {
    //   this.$emit("change-overlay", this.isShow);
    // },
  },
};
</script>

<style>
</style>