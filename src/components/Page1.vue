<template>
  <div>Page1</div>
  <figure>
    <v-chart :option="option" autoresize style="height: 600px;" ref="trendChart"/>
  </figure>
</template>

<script>
import {useCapDataStore} from "@/store/capDataStore.js";
import {storeToRefs} from "pinia";
import "echarts";
import VChart from "vue-echarts";
import {
  use,
  // registerMap,
  // registerTheme,
  // connect,
  // disconnect
} from "echarts/core";
import {
  BarChart,
  PieChart,
} from "echarts/charts";
import {
  GridComponent,
  PolarComponent,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DatasetComponent,
  ToolboxComponent,
  DataZoomComponent
} from "echarts/components";
import {CanvasRenderer, SVGRenderer} from "echarts/renderers";
import {getRegionalTrendCountChartOptions} from "@/charts/options.js";
import {ref, watch} from "vue";
import {colorTrace} from "@/utils/myFunctions.js";

export default {
  name: "Page1",
  components: {
    VChart
  },
  setup() {
    const store = useCapDataStore();
    const regionalCountTrend = storeToRefs(store).regionalCountTrend;
    const option = ref(null);
    use([
      BarChart,
      PieChart,
      // MapChart,
      // RadarChart,
      // ScatterChart,
      // EffectScatterChart,
      // LinesChart,
      GridComponent,
      PolarComponent,
      GeoComponent,
      TooltipComponent,
      LegendComponent,
      TitleComponent,
      VisualMapComponent,
      DatasetComponent,
      CanvasRenderer,
      SVGRenderer,
      ToolboxComponent,
      DataZoomComponent
    ]);
    const trendChart = ref(null);

    const unwatch = watch(trendChart, () => {
      const chartObj = trendChart.value.chart;

      console.log("-> trendChart", trendChart);
      console.log("-> chartObj", chartObj);


      colorTrace('=======================', 'red');
      console.log("-> trendChart.value.getOption()", trendChart.value.getOption());
      colorTrace('=======================', 'red');

      if (chartObj.on) {
        chartObj.on('brushSelected', function (params) {

          if (!chartObj.getOption()) {
            return;
          }
          const chartOptions = chartObj.getOption();
          let brushed = [];
          let brushComponent = params.batch[0];
          for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            let rawIndices = brushComponent.selected[sIdx].dataIndex;
            let rawXValues  = rawIndices.map(function (idx) {
              return chartOptions.xAxis[0].data[idx];
            });
            brushed.push('[' + chartOptions.series[sIdx].name + '] ' + rawXValues.join(', '));
          }
          chartObj.setOption({
            title: {
              backgroundColor: '#333',
              text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
              bottom: 0,
              right: '10%',
              width: 100,
              textStyle: {
                fontSize: 12,
                color: '#fff'
              }
            }
          });
        });
        unwatch();
      }
    });

    watch(regionalCountTrend, (newVal) => {
      if (newVal.length) {
        option.value = getRegionalTrendCountChartOptions(newVal);
      }
    });

    return {
      regionalCountTrend,
      option,
      trendChart,
    };
  },
};
</script>

<style scoped>

</style>