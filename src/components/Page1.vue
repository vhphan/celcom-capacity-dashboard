<template>

  <figure>
    <v-chart :option="option" autoresize style="height: 300px;" ref="trendChart"/>
  </figure>
  <div ref="tableRef" style="height: 500px;"></div>
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
import {basePath} from "@/constants.js";
import {createTabulator, minMaxFilterEditor, minMaxFilterFunction} from "@/utils/tblFuncs.js";
import {BASE_URL_NODE} from "@/plugins/http.js";

//    const {page, size, schema, boolOperand, table, filters, sorters} = request.query;

export default {
  name: "Page1",
  components: {

    VChart
  },
  setup: function () {
    const store = useCapDataStore();
    const regionalCountTrend = storeToRefs(store).regionalCountTrend;
    const option = ref(null);

    const tableRef = ref(null);
    const tabulatorRef = ref(null);
    const tableData = storeToRefs(store).worstCellsList;

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
          let rawXValuesLength = 0;
          for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            let rawIndices = brushComponent.selected[sIdx].dataIndex;
            let rawXValues = rawIndices.map(function (idx) {
              return chartOptions.xAxis[0].data[idx];
            });
            brushed.push('[' + chartOptions.series[sIdx].name + '] ' + rawXValues.join(', '));
            rawXValuesLength += rawXValues.length;
          }
          console.log(rawXValuesLength);
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

    watch(regionalCountTrend, (newVal) => {
      if (newVal.length) {
        option.value = getRegionalTrendCountChartOptions(newVal);
      }
    });

    onMounted(() => {
      store.getRegionalCountTrend();

      const numberColumns = ['aging', 'Average PRB (Normalize)', 'Average user TP 4BH (Mbps) Total', 'Current Sector 4BH volume (GB)'];
      const addOpts = {
        layout: "fitData",
        headerFilterLiveFilterDelay: 1000,
        autoColumnsDefinitions: function (definitions) {

          definitions.forEach((column) => {

                column.headerFilter = true; // add header filter to every column
                column.maxWidth = 150;
                column.headerTooltip = true;
                column.headerWordWrap = true;

                if (numberColumns.includes(column.field)) {
                  column.headerFilter = minMaxFilterEditor;
                  column.headerFilterFunc = minMaxFilterFunction;
                  column.width = 130;
                }
                if (column.field === 'aging') {
                  column.title = 'Aging (Weeks)';
                }
                if (column.field === 'first_day_of_week') {
                  column.title = 'First Day of Week';
                }
                if (column.field === 'Final Status') {
                  column.headerFilter = 'select';
                  column.headerFilterParams = {values: ['Optimize', 'Required Upgrade']};
                  column.headerFilterFunc = 'in';
                }


              }
          );

          return definitions;
        },
      };
      createTabulator(tabulatorRef, tableRef, 'worst_cells', `${BASE_URL_NODE}/getTabulatorData`, addOpts, 'capacity');
    });


    return {
      regionalCountTrend,
      option,
      trendChart,
      tableRef,
      tabulatorRef,
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