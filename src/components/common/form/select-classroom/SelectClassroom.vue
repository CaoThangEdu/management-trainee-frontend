<template>
  <select2
    v-model="valueModel"
    :options="classroomsForSelect2"
    :settings="{ dropdownAutoWidth: true }"
    @change="changeClassroom($event)"
  />
</template>

<script>
import Select2 from "v-select2-component";

export default {
  name: "SelectClassroomByGuid",
  components: {
    Select2,
  },
  props: {
    plans: {
      type: Array,
      default: () => []
    },
    classrooms: {
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
    /**Default value when SelectClassroom not required (isRequired = false) */
    defaultValue: {
      type: String,
      default: "-1",
    },
    /**Default text when SelectClassroom not required (isRequired = false) */
    defaultText: {
      type: String,
      default: function () {
        return 'Tất cả'
      },
    }
  },

  data() {
    return {
      classroomSelectedGuid: null,
    };
  },

  methods: {
    getPlanName(id) {
      return this.plans.find(plan => plan.id == id);
    },

    changeClassroom(classroomGuid){
      let selectedclassroom = this.classrooms.find(m => m.id == classroomGuid);
      let emitData = {
        id: "",
        className: "",
        internshipCourseId: "",
      };
      if (selectedclassroom) {
        emitData = {
          id: selectedclassroom.id,
          className: selectedclassroom.className,
          internshipCourseId: selectedclassroom.internshipCourseId,
        };
      } else if (!this.isRequired) {
        emitData = {
          id: this.defaultValue,
          className: "",
          internshipCourseId: "",
        };
      }
      this.$emit("change", emitData);
    },
  },

  computed: {
    valueModel: {
      set(value) {
        this.classroomSelectedGuid = value || this.defaultValue;
      },
      get() {
        return this.value || this.defaultValue;
      },
    },
    classroomsForSelect2() {
      let classroomOptions = [];
      if (!this.isRequired) {
        classroomOptions.push({
          id: this.defaultValue, text: this.defaultText
        });
      }

      if (!this.classrooms && this.classrooms.length == 0) {
        return;
      }
      
      for (const classroom of this.classrooms) {
        let fullName = classroom.className;
        let planName = '';
        if (this.plans.length > 0) {
          planName = this.getPlanName(classroom.internshipCourseId);
          if (!planName) {
            planName = '';
          } else {
            planName = planName.internshipCourseName;
          }
        }
        classroomOptions.push({
          id: classroom.id,
          text: `${fullName} (${planName})`
        });
      }
      return classroomOptions;
    },
  },
};
</script>