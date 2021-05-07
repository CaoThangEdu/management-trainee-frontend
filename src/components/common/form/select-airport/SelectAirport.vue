<template>
  <select2
    v-model.number="valueModel"
    :options="listAirportForSelect2"
    :settings="{ dropdownAutoWidth: true }"
    @change="changeValue($event)"
  />
</template>

<script>
import Select2 from "v-select2-component";

import {mapGetters, mapActions} from "vuex"
export default {
  name: "SelectAirport",
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
        return "Tất cả"
      },
    }
  },

  data() {
    return {
      airportSelectedId: null,
      listDomesticAirport: ["HAN","HPH","DIN","SGN","VCA","VCS","PQC","VKG","CAH","DAD","THD","VII","HUI","VDH","VCL","UIH","TBB","CXR","PXU","BMV","DLI","VCA","VDO"],
      // listAirport: [
      //   { id: 1, name: "Hà Nội", code: "HAN" },
      //   { id: 2, name: "Hồ Chí Minh", code: "SGN" }
      // ],
    };
  },

  methods: {
    changeValue(val){
      let itemSelected = this.listAirports.find(m => m.id == val);
      let dataEmit = {
        id: 0,
        name: null,
        code: null,
        image: null,
        address: null,
        countryID: null,
        countryName: null,
      };
      if (itemSelected) {
        dataEmit = {
          id: Number(itemSelected.id),
          name: itemSelected.name,
          code: itemSelected.code,
          image: itemSelected.image,
          address: itemSelected.address,
          countryID: 0,
          countryName: "",
        };
      } else {
        if (!this.isRequired) {
          dataEmit = {
            id: this.defaultValue,
            name: null,
            code: null,
            image: null,
            address: null,
            countryID: null,
            countryName: null,
          };
        }
      }
      this.$emit("change", dataEmit);
    },
    ...mapActions("booking",  ["updateAirportDataAsync"]),  

  },

  computed: {
    ...mapGetters("booking", { listAirports: "getListAirports" }),  
    valueModel: {
      set(value) {
        this.airportSelectedId = value || this.defaultValue;
      },
      get() {
        return this.value || this.defaultValue;
      },
    },
    listAirportForSelect2() {
      let arrItem = [];
      if (!this.isRequired) {
        arrItem.push({
          id: this.defaultValue, text: this.defaultText
        });
      }
      if (this.listAirports && this.listAirports.length > 0) {
        for (const item of this.listAirports) {
          arrItem.push({
            id: item.id, text: `${item.name} (${item.code})`
          });
        }
      }
      return arrItem;
    },
  },
  mounted() {},
  beforeMount() {
    if (this.listAirports == null) {
      this.updateAirportDataAsync();
    }
  },
  watch: {
  },
};
</script>

<style lang="css">
</style>