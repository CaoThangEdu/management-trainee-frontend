<template>
  <select2
    v-model.number="valueModel"
    :options="listSupplierForSelect2"
    :settings="{ dropdownAutoWidth: true }"
    @change="changeValue($event)"
  />
</template>

<script>
import Select2 from "v-select2-component";

export default {
  name: "SelectSupplier",
  components: {
    Select2,
  },

  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      supplierSelectedId: null,
      listSupplier: [
        { id: 1, name: "NCC 1" },
        { id: 2, name: "NCC 2" },
        { id: 3, name: "NCC 3" },
        { id: 4, name: "NCC 4" },
      ],
    };
  },

  methods: {
    changeValue(val) {
      let itemSelected = this.listSupplier.find((m) => m.id == val);
      this.$emit("change", {
        id: itemSelected.id,
        name: itemSelected.name       
      });
    },
  },

  computed: {
    valueModel: {
      set(value) {
        this.supplierSelectedId = value;
      },
      get() {
        return this.value;
      },
    },
    listSupplierForSelect2() {
      let arrItem = [];
      for (const item of this.listSupplier) {
        arrItem.push({
          id: item.id,
          text: `${item.name}`,
        });
      }
      return arrItem;
    },
  },
  mounted() {},

  watch: {
    listValues() {
      this.listSelected = this.listValues;
    },
  },
};
</script>

<style lang="css">
</style>