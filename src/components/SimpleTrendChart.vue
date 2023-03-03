<template>
  <v-chart autoresize class="full-width" style="min-height: 300px;" :option="option"/>
</template>

<script>
import VChart from "vue-echarts"; // import vue-echarts
import {use} from "echarts/core";
import {BarChart} from "echarts/charts";
import {TitleComponent, TooltipComponent} from "echarts/components";
import {computed, ref} from "vue";
import {getSimpleTrendCountChartOptions} from "@/charts/options.js";

export default {
  name: "SimpleTrendChart",
  components: {
    VChart
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    chartTitle: {
      type: String,
      default: '',
    },
    xLabel: {
      type: String,
      default: '',
    },
    yLabel: {
      type: String,
      default: '',
    },
    preXValue: {
      type: String,
      default: '',
    },
    postXValue: {
      type: String,
      default: '',
    },
    preBarColor: {
      type: String,
      default: '#ffa600',
    },
    postBarColor: {
      type: String,
      default: '#00FF00',
    },
    defaultBarColor: {
      type: String,
      default: '#0000FF',
    },
  },
  setup(props) {
    use([
      BarChart,
      TitleComponent,
      TooltipComponent
    ]);

    const option = computed(() => {
      const {
        data,
        chartTitle,
        xLabel,
        yLabel,
        preXValue,
        postXValue,
        preBarColor,
        postBarColor,
        defaultBarColor
      } = props;
      return getSimpleTrendCountChartOptions(
          data,
          chartTitle,
          xLabel,
          yLabel,
          preXValue,
          postXValue,
          preBarColor,
          postBarColor,
          defaultBarColor,
      );
    });
    return {
      option,
    }

  },
}
</script>

<style scoped>

</style>