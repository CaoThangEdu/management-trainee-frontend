<template>
  <select2
    v-model.number="valueModel"
    :options="listAirlineForSelect2"
    :settings="{ dropdownAutoWidth: true }"
    @change="changeValue($event)"
  />
</template>

<script>
import Select2 from "v-select2-component";

import {mapGetters, mapActions} from "vuex"
export default {
  name: "SelectAirline",
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
      // listAirline: [
      //   { id: 1, name: "Vietnam Airlines", code: "VN" },
      //   { id: 2, name: "Vietjet Air", code: "VJ" },
      //   { id: 3, name: "Pacific Airline", code: "PA" },
      //   { id: 4, name: "Bamboo Airways", code: "QH" }
      // ],
    };
  },

  methods: {
    changeValue(val){
      let itemSelected = this.listAirlines.find(m => m.id == val);
      let dataEmit = {
        id: 0,
        name: "",
        code: "",
        image: "",
      };
      if (itemSelected) {
        dataEmit = {
          id: Number(itemSelected.id),
          name: itemSelected.name,
          code: itemSelected.code,
          image: itemSelected.image,
        };
      } else {
        if (!this.isRequired) {
          dataEmit = {
            id: this.defaultValue,
            name: null,
            code: null,
            image: null,
          };
        }
      }
      this.$emit("change", dataEmit);
    },
    ...mapActions("booking",  ["updateAirlineDataAsync"]),  
  },

  computed: {
    valueModel: {
      set(value) {
        this.airlineSelectedId = value || this.defaultValue;
      },
      get() {
        return this.value || this.defaultValue;
      },
    },
    listAirlineForSelect2() {
      let arrItem = [];
      if (!this.isRequired) {
        arrItem.push({
          id: this.defaultValue, text: this.defaultText
        });
      }
      if (this.listAirlines && this.listAirlines.length > 0) {
        for (const item of this.listAirlines) {
          arrItem.push({
            id: item.id, text: `${item.name} (${item.code})`
          });
        }
      }
      return arrItem;
    },
    ...mapGetters("booking", { listAirlines: "getListAirlines" }),  
  },
  mounted() {},

  beforeMount() {
    if (this.listAirlines == null) {
      this.updateAirlineDataAsync();
    }
  },

  watch: {
    listValues() {
      this.listSelected = this.listValues;
    },
  },
};
</script>

<style lang="css">
</style>