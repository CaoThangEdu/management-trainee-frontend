<script>
// MonthlyIncome.vue
import { Bar, mixins } from "vue-chartjs";

export default {
  name: "MonthlyIncome",
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: ["chartData", "options", "numbers", 
    "labelsProps", "labelChart"],
  mounted() {
    this.renderBarChart();
  },
  methods: {
    renderBarChart() {
      this.renderChart(
        {
          labels: this.labelsProps,
          datasets: [
            {
              label: this.labelChart,
              backgroundColor: "#f87979",
              data: this.numbers,
            },
          ],
        },
        { responsive: true, maintainAspectRatio: false }
      );
    }
  },
  watch: {
    numbers() {
      this.renderBarChart();
    },
  },
};
</script>