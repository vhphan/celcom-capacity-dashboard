<template>
  <v-chart autoresize style="height: 300px;" :option="option"/>
</template>

<script>
import VChart from "vue-echarts"; // import vue-echarts
import {use} from "echarts/core";
import {GaugeChart} from "echarts/charts";
import {TitleComponent} from "echarts/components";
import {computed, ref} from "vue";
import {getGaugeChartOptions} from "@/charts/options.js";

export default {
  name: "PercentageGaugeChart",
  components: {
    VChart
  },
  props: {
    value: {
      type: [Number, null],
      required: false,
    },
    title: {
      type: String,
      default: 'Percentage'
    },
    chartColor: {
      type: String,
      default: '#00FF00'
    },
  },
  setup(props) {
    use([
      GaugeChart,
      TitleComponent,
    ]);

    const option = computed(() => getGaugeChartOptions(props.value,
        props.title,
        props.chartColor));


    return {
      option,


    }

  },
}
</script>

<style scoped>

</style>