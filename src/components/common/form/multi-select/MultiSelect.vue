<template>
  <Multiselect
    v-model="listSelected"
    :selectLabel="''"
    :placeholder="'Nhập từ khóa'"
    label="name"
    track-by="code"
    :options="listOptions"
    :multiple="multiple"
    :taggable="allowAddTag"
    @tag="addTag"
    @search-change="filterChange"
    @input="changeValue"
    :clearOnSelect="true"
    :hideSelected="true"
  >
    <template slot="noOptions">Danh sách rỗng</template>
    <template slot="noResult">Không tìm thấy dữ liệu</template>
  </Multiselect>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  name: "MultiSelect",
  components: {
    Multiselect,
  },

  props: {
    listOptions: {
      type: Array,
      default: null,
    },

    listValues: {
      type: Array,
      default: null,
    },
    allowAddTag: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      listSelected: null,
    };
  },

  methods: {
    addTag(newTag) {
      if (!this.allowAddTag) {
        return;
      }

      const tag = {
        name: newTag,
        code: new Date().getTime(),
      };
      if (!this.listOptions) {
        this.listOptions = [];
      }
      this.listOptions.push(tag);
      if (!this.listSelected) {
        this.listSelected = [];
      }
      this.listSelected.push(tag);
    },

    changeValue() {
      this.$emit("change", this.listSelected);
    },

    filterChange(searchQuery) {
      this.$emit("search", searchQuery);
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
@import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>