<template>
  <select2
    v-model="valueModel"
    :options="plansForSelect2"
    :settings="{ dropdownAutoWidth: true }"
    @change="changePlan($event)"
  />
</template>

<script>
import Select2 from "v-select2-component";

export default {
  name: "SelectPlanByGuid",
  components: {
    Select2,
  },
  props: {
    plans: {
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
    /**Default value when SelectPlan not required (isRequired = false) */
    defaultValue: {
      type: String,
      default: "-1",
    },
    /**Default text when SelectPlan not required (isRequired = false) */
    defaultText: {
      type: String,
      default: function () {
        return 'Tất cả'
      },
    }
  },

  data() {
    return {
      planSelectedGuid: null,
    };
  },

  methods: {
    changePlan(planGuid){
      let selectedPlan = this.plans.find(m => m.id == planGuid);
      let emitData = {
        id: "",
        internshipCourseName: "",
        careersId: "",
      };
      if (selectedPlan) {
        emitData = {
          id: selectedPlan.id,
          internshipCourseName: selectedPlan.internshipCourseName,
          careersId: selectedPlan.careersId,
        };
      } else if (!this.isRequired) {
        emitData = {
          id: this.defaultValue,
          internshipCourseName: "",
          careersId: "",
        };
      }
      this.$emit("change", emitData);
    },
  },

  computed: {
    valueModel: {
      set(value) {
        this.planSelectedGuid = value || this.defaultValue;
      },
      get() {
        return this.value || this.defaultValue;
      },
    },
    plansForSelect2() {
      let planOptions = [];
      if (!this.isRequired) {
        planOptions.push({
          id: this.defaultValue, text: this.defaultText
        });
      }

      if (!this.plans && this.plans.length == 0) {
        return;
      }
      
      for (const plan of this.plans) {
        let fullName = plan.internshipCourseName;
        planOptions.push({
          id: plan.id,
          text: `${fullName}`
        });
      }
      return planOptions;
    },
  },
};
</script>