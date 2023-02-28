<template>
    <v-chart :option="option" autoresize ref="trendChart" />
</template>

<script>
import {useCapDataStore} from "@/store/capDataStore.js";
import {storeToRefs} from "pinia";
import "echarts";
import VChart from "vue-echarts";
import {use,} from "echarts/core";
import {BarChart, PieChart,} from "echarts/charts";
import {
  DatasetComponent,
  DataZoomComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent
} from "echarts/components";
import {CanvasRenderer, SVGRenderer} from "echarts/renderers";
import {getRegionalTrendCountChartOptions} from "@/charts/options.js";
import {onMounted, ref, watch} from "vue";
import {colorTrace} from "@/utils/myFunctions.js";
import {createTabulator, minMaxFilterEditor, minMaxFilterFunction} from "@/utils/tblFuncs.js";
import {BASE_URL_NODE} from "@/plugins/http.js";
import AgingPieChart from "@/components/AgingPieChart.vue";

//    const {page, size, schema, boolOperand, table, filters, sorters} = request.query;

export default {
  name: "RegionCountBarChart",
  components: {
    AgingPieChart,
    VChart
  },
  setup: function () {
    const store = useCapDataStore();
    const {regionalCountTrend} = storeToRefs(store);
    const option = ref(null);

    use([
      BarChart,
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

      if (chartObj.on) {
        chartObj.on('brushSelected', function (params) {

          if (!chartObj.getOption()) {
            return;
          }
          const chartOptions = chartObj.getOption();
          let brushed = [];
          let brushComponent = params.batch[0];
          let rawXValuesLength = 0;
          for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            let rawIndices = brushComponent.selected[sIdx].dataIndex;
            let rawXValues = rawIndices.map(function (idx) {
              return chartOptions.xAxis[0].data[idx];
            });
            brushed.push('[' + chartOptions.series[sIdx].name + '] ' + rawXValues.join(', '));
            rawXValuesLength += rawXValues.length;
          }
          if (rawXValuesLength === 0) {
            chartObj.setOption({
              title: {
                show: false
              },
              grid: {
                bottom: 20
              },
            });
            return;
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
              },
              show: true
            },
            grid: {
              bottom: 100
            },
          });
        });
        unwatch();
      }

    });

    watch(regionalCountTrend, (newVal, oldVal) => {
      if (newVal.length || (newVal.length===0 && oldVal.length > 0)){
        option.value = getRegionalTrendCountChartOptions(newVal);
      }
    });

    onMounted(() => {
      store.getRegionalCountTrend();

    });

    return {
      regionalCountTrend,
      option,
      trendChart,
    };
  },
};
</script>

<style>

/*.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title {*/
/*  white-space: normal;*/
/*  text-overflow: clip;*/
/*}*/
.tabulator-col {
  justify-content: flex-end !important;
}


</style>