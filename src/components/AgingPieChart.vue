<template>
  <v-chart :option="option" :auto-resize="true"/>
</template>

<script>
import {useCapDataStore} from "@/store/capDataStore.js";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref, watch} from "vue";
import {getPieChartOptions} from "@/charts/options.js";
import "echarts"; // import echarts core
import VChart from "vue-echarts"; // import vue-echarts
import {use} from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  DatasetComponent, DataZoomComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent, ToolboxComponent,
  TooltipComponent, VisualMapComponent
} from "echarts/components.js";
import {CanvasRenderer, SVGRenderer} from "echarts/renderers.js";

export default {
  name: "AgingPieChart",
  components: {
    VChart
  },
  setup() {
    const store = useCapDataStore();
    const {agingCountTrend, maxYearWeek} = storeToRefs(store);
    const option = ref(null);
    const agingData = computed(() => {
      return agingCountTrend
          .value
          .filter(d => d['year_week'] === maxYearWeek.value)
          .map(d => ({
            name: d['aging_category'],
            value: d['count']
          }));
    });
    use([
      PieChart,
      GridComponent,
      PolarComponent,
      GeoComponent,
      TooltipComponent,
      LegendComponent,
      TitleComponent,
      DatasetComponent,
      CanvasRenderer,
      SVGRenderer,
      ToolboxComponent,
    ]);

    watch(agingData, (newVal) => {
      option.value = getPieChartOptions(newVal, 'Aging Category', 'Aging Breakdown');
    });

    onMounted(() => {
      store.getAgingCountTrend();
    });

    return {
      option,
      agingData,
      agingCountTrend,
      maxYearWeek,
    }
  }
};
</script>

<style scoped>

</style>