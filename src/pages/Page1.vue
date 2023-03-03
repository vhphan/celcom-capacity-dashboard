<template>
  <div class="text-h4 q-ma-md text-amber-10">Work in Progress Here!!...</div>
  <q-card bordered class="full-width q-pa-xs">
    <q-select outlined v-model="selectedMetric" :options="availableMetrics" label="Select Metric"/>
    <simple-trend-chart
        :data="overallCountAndPercentageTrend"
        chartTitle="Simple Trend Chart"
        xLabel="year_week"
        :yLabel="selectedMetric.value"
        :preXValue="selectedPreYearWeek"
        :postXValue="selectedPostYearWeek"
        :preBarColor="preBarColor"
        :postBarColor="postBarColor"
        :defaultBarColor="defaultBarColor"

    />
  </q-card>
  <div class="q-pa-md row">
    <q-card class="col-4">
      <q-select outlined v-model="selectedPreYearWeek" :options="availableYearWeeks" label="Select Year-Week"/>
      <percentage-gauge-chart
          class="col-4"
          :value="preData[0]?.percentage"
          title="PRE: Percentage Congested"
          :chart-color="preBarColor"
      />
    </q-card>
    <q-card class="col-4">
      <q-select outlined v-model="selectedPostYearWeek" :options="availablePostYearWeeks" label="Select Year-Week"/>
      <percentage-gauge-chart
          class="col-4"
          :value="postData[0]?.percentage"
          title="POST: Percentage Congested"
          :chart-color="postBarColor"
      />
    </q-card>
  </div>
</template>

<script>
import {storeToRefs} from 'pinia';
import {onMounted, computed, ref} from 'vue';
import {useCapDataStore} from '../store/capDataStore.js';
import PercentageGaugeChart from "@/components/PercentageGaugeChart.vue";
import SimpleTrendChart from "@/components/SimpleTrendChart.vue";


export default {
  name: "Page1",
  components: {
    SimpleTrendChart,
    PercentageGaugeChart

  },
  setup: function () {

    const store = useCapDataStore();
    const {
      overallCountAndPercentageTrend,
      availableYearWeeks,
      selectedPostYearWeek,
      selectedPreYearWeek
    } = storeToRefs(store);

    const preData = computed(() => {
      return overallCountAndPercentageTrend.value.filter(d => d['year_week'] === selectedPreYearWeek.value);
    });

    const postData = computed(() => {
      return overallCountAndPercentageTrend.value.filter(d => d['year_week'] === selectedPostYearWeek.value);
    });

    onMounted(() => {
      store.getOverallCountAndPercentage();
    });

    const availablePostYearWeeks = computed(() => {
      const indexPre = availableYearWeeks.value.indexOf(selectedPreYearWeek.value);
      return availableYearWeeks.value.filter((d, i) => i >= indexPre);
    });

    const preBarColor = '#ffa600';
    const postBarColor = '#06c506';
    const defaultBarColor = '#0000FF';
    const availableMetrics = [
      {
        label: 'Total Sectors',
        value: 'count_total'
      },
      {
        label: 'Total Congested Sectors',
        value: 'count_congested'
      },
      {
        label: 'Percentage Sectors Congested',
        value: 'percentage'
      }
    ];
    const selectedMetric = ref(availableMetrics.at(-1));

    return {
      preData,
      postData,
      availableYearWeeks,
      availablePostYearWeeks,
      selectedPostYearWeek,
      selectedPreYearWeek,
      overallCountAndPercentageTrend,
      preBarColor,
      postBarColor,
      defaultBarColor,
      availableMetrics,
      selectedMetric,
    }


  },
};
</script>

<style></style>