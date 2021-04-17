<!--Document:https://github.com/mengxiong10/vue2-datepicker#value-type-->

<template>
  <DatePicker
    v-model="valueModel"
    @input="changeDate"
    input-class="form-control"
    :format="format"
    :type="type"
    :range="range"
    :disabled="disabled"
    :clearable="allowEmpty"
  ></DatePicker>
</template>

<script>
import moment from "moment";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";

import { DATE_DEFAULT } from "../../../../../config/constant";

export default {
  name: "InputDateTime",
  components: {
    DatePicker,
  },
  props: {
    date: {},
    range: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: "DD/MM/YYYY",
    },
    type: {
      type: String,
      default: "date",
    },
    allowEmpty: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: null,
    };
  },
  methods: {
    changeDate() {
      let temp = Object.assign({}, this.value);
      if (this.range) {
        temp[0] = this.value[0];
        temp[1] = this.value[1];
      } else {
        temp = this.value;
      }
      this.$emit("change-date", temp);
    },
  },
  computed: {
    valueModel: {
      set(date) {
        this.value = date;
      },
      get() {
        if (this.date == undefined) {
          if (this.allowEmpty) return "";
          return new Date(DATE_DEFAULT);
        }
        return this.date;
      },
    },
  },
  mounted() {
    if (this.range) {
      this.value = [
        new Date(moment().add(-1, "M").toDate()),
        new Date(moment().toDate()),
      ];
    }
    if (this.value === undefined) {
      this.value = moment().toDate();
    }
  },
};
</script>

<style>
</style>