<template>
  <select2
    v-model="valueModel"
    :options="teachersForSelect2"
    :settings="{ dropdownAutoWidth: true }"
    @change="changeTeacher($event)"
  />
</template>

<script>
import Select2 from "v-select2-component";
import ComponentBase from "../../component-base/ComponentBase.vue";

export default {
  name: "SelectTeacherByGuid",
  extends: ComponentBase,
  components: {
    Select2,
  },

  props: {
    teachers: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: "",
    },
    /**Required select an item (not use default value) */
    isRequired: {
      type: Boolean,
      default: true,
    },
    /**Default value when Selectteacher not required (isRequired = false) */
    defaultValue: {
      type: String,
      default: "-1",
    },
    /**Default text when Selectteacher not required (isRequired = false) */
    defaultText: {
      type: String,
      default: function () {
        return 'Tất cả'
      },
    }
  },

  data() {
    return {
      teacherSelectedGuid: null,
    };
  },

  methods: {
    changeTeacher(teacherGuid){
      let selectedteacher = this.teachers.find(m => m.id == teacherGuid);
      let emitData = {
        id: "",
        email: "",
        phoneNumber: "",
      };
      if (selectedteacher) {
        emitData = {
          id: selectedteacher.id,
          email: selectedteacher.email,
          phoneNumber: selectedteacher.phoneNumber,
        };
      } else if (!this.isRequired) {
        emitData = {
          id: this.defaultValue,
          email: "",
          phoneNumber: "",
        };
      }
      this.$emit("change", emitData);
    },
  },

  computed: {
    valueModel: {
      set(value) {
        this.teacherSelectedGuid = value || this.defaultValue;
      },
      get() {
        return this.value || this.defaultValue;
      },
    },
    teachersForSelect2() {
      let teacherOptions = [];
      if (!this.isRequired) {
        teacherOptions.push({
          id: this.defaultValue, text: this.defaultText
        });
      }

      if (!this.teachers && this.teachers.length == 0) {
        return;
      }
      
      for (const teacher of this.teachers) {
        let fullName =  teacher.firstName + ' ' + teacher.lastName;
        teacherOptions.push({
          id: teacher.id,
          text: `${fullName}`
        });
      }
      return teacherOptions;
    },
  },
};
</script>