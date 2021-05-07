<template>
  <select2
    v-model.number="valueModel"
    :options="listAccountForSelect2"
    :settings="{ dropdownAutoWidth: true }"
    @change="changeValue($event)"
  />
</template>

<script>
import Select2 from "v-select2-component";

import {mapGetters, mapActions} from "vuex"
export default {
  name: "SelectAccount",
  components: {
    Select2,
  },

  props: {
    value: {
      type: Number,
      default: null,
    },
    /**Required select an item (not use default value) */
    isRequired: {
      type: Boolean,
      default: true,
    },
    /**Default value when SelectAccount not required (isRequired = false) */
    defaultValue: {
      type: Number,
      default: -1,
    },
    /**Default text when SelectAccount not required (isRequired = false) */
    defaultText: {
      type: String,
      default: function () {
        return 'Tất cả'
      },
    }
  },

  data() {
    return {
      accountSelectedId: null,
      listDomesticAccount: ["HAN","HPH","DIN","SGN","VCA","VCS","PQC","VKG","CAH","DAD","THD","VII","HUI","VDH","VCL","UIH","TBB","CXR","PXU","BMV","DLI","VCA","VDO"],
      // listAccount: [
      //   { id: 1, name: "Hà Nội", code: "HAN" },
      //   { id: 2, name: "Hồ Chí Minh", code: "SGN" }
      // ],
    };
  },

  methods: {
    changeValue(val){
      let itemSelected = this.listAccounts.find(m => m.id == val);
      let dataEmit = {
        id: 0,
        userName: "",
        lastName: "",
        firstName: "",
        email: ""
      };
      if (itemSelected) {
        dataEmit = {
          id: Number(itemSelected.id),
          userName: itemSelected.userName,
          lastName: itemSelected.lastName,
          firstName: itemSelected.name,
          email: itemSelected.email
        };
      } else {
        if (!this.isRequired) {
          dataEmit = {
            id: this.defaultValue,
            userName: null,
            lastName: null,
            firstName: null,
            email: null
          };
        }
      }
      this.$emit("change", dataEmit);
    },
    ...mapActions("account",  ["updateAccountDataAsync"]),  

  },

  computed: {
    ...mapGetters("account", { listAccounts: "getListAccounts" }),  
    valueModel: {
      set(value) {
        this.accountSelectedId = value || this.defaultValue;
      },
      get() {
        return this.value || this.defaultValue;
      },
    },
    listAccountForSelect2() {
      let arrItem = [];
      if (!this.isRequired) {
        arrItem.push({
          id: this.defaultValue, text: this.defaultText
        });
      }
      if (this.listAccounts && this.listAccounts.length > 0) {
        for (const item of this.listAccounts) {
          let fullName = this.$t("format.full-name", { firstName: item.name, lastName: item.lastName });
          arrItem.push({
            id: item.id,
            text: `${fullName} (${item.userName})`
          });
        }
      }
      return arrItem;
    },
  },
  mounted() {},
  beforeMount() {
    if (this.listAccounts == null) {
      this.updateAccountDataAsync();
    }
  },
  watch: {
  },
};
</script>

<style lang="css">
</style>