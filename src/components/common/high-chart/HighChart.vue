<template>
  <div class="chartElem">
    <highcharts
      class="chart"
      :constructor-type="'chart'"
      :options="chartOptions"
    >
    </highcharts>
  </div>
</template>
<script>
import Highcharts from "highcharts";
import dataModule from "highcharts/modules/data";
import drilldown from "highcharts/modules/drilldown";

drilldown(Highcharts);
dataModule(Highcharts);

let drilldownChart,
  drilldownEvent,
  drilldownLevel = 0;
export default {
  name: "high-chart",
  props: {
    assignedStudents: {
      type: Array,
      default: null,
    },
    unassignStudents: {
      type: Array,
      default: null,
    },
    labelsProps: {
      type: String,
      default: null,
    },
    labelChart: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      chartOptions: {},
      drilldownChart,
      drilldownEvent,
      drilldownLevel,
    };
  },
  mounted() {    
    this.renderHighChart();
    this.$children[0].chart.vueRef = this;
  },
  methods: {
    renderHighChart() {
      this.chartOptions = {
        chart: {
          type: "column",
          events: {
            drilldown: function (e) {
              if (!e.seriesOptions) {
                this.vueRef.updateGraph(true, this, e);
              }
            },
            drillup: function (e) {
              if (!e.seriesOptions.flag) {
                this.vueRef.drilldownLevel = e.seriesOptions._levelNumber;
                this.vueRef.updateGraph(false);
              }
            },
          },
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          column: {
            stacking: "normal",
            events: {
              click: function (event) {
                return false;
              },
            },
          },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              style: {
                textShadow: false,
                fontSize: "10px",
              },
            },
          },
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: "bold",
              color: "gray",
            },
          },
        },
        title: {
          text: this.labelChart,
          fontWeight: "bold",
        },
        xAxis: {
          title: {},
          type: "category",
        },
        yAxis: [
          {
            title: {
              text: this.labelsProps,
            },
            min: 0,
            allowDecimals: false,
          },
        ],
        series: [
          {
            type: "column",
            name: "Số sinh viên đã phân công",
            color: "rgb(128, 183, 255)",
            data: this.assignedStudents,
          },
          {
            type: "column",
            name: "Số sinh viên chưa phân công",
            color: "#EF5350",
            data: this.unassignStudents,
          },
        ],
      };
    },
  },
  watch: {
    assignedStudents() {
      this.renderHighChart();
      this.$forceUpdate();
    },
  },
};
</script>
