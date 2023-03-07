<template>
  <v-chart :option="option" autoresize/>
</template>

<script>
import {useCapDataStore} from "@/store/capDataStore.js";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref, watch} from "vue";
import {getPieChartOptions} from "@/charts/options.js";
import "echarts"; // import echarts core
import VChart from "vue-echarts"; // import vue-echarts
import {use} from "echarts/core";
import {PieChart} from "echarts/charts";
import {
  DatasetComponent, DataZoomComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent, ToolboxComponent,
  TooltipComponent, VisualMapComponent
} from "echarts/components";
import {CanvasRenderer, SVGRenderer} from "echarts/renderers";

export default {
  name: "IssuePieChart",
  components: {
    VChart
  },
  setup() {
    const store = useCapDataStore();
    const {issueCountTrend, maxYearWeek} = storeToRefs(store);
    const option = ref(null);
    const issueData = computed(() => {
      return issueCountTrend
          .value
          .filter(d => d['year_week'] === maxYearWeek.value)
          .map(d => ({
            name: d['issue_category'],
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

    watch(issueData, (newVal) => {
      option.value = getPieChartOptions(newVal, 'Issue Category', 'Issue Breakdown', [
        '#ff6666',
        '#3cb371',
        '#d5b158',
        '#82b6e9',
        '#ff6347',
        '#a092f1',
      ]);
    });

    onMounted(() => {
      store.getIssueCountTrend();
    });

    return {
      option,
      issueData,
      issueCountTrend,
      maxYearWeek,
    }
  }
};
</script>

<style scoped>

</style>