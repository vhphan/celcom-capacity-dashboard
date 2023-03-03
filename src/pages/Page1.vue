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
    <q-card class="col-4 justify-between" style="display: flex; flex-direction: column;">

      <q-card bordered class="full-height">
        <q-item class="text-h6 bg-primary text-white">
          <q-item-label>% Congested Sectors</q-item-label>
        </q-item>
        <q-item-section class="text-h4 q-ma-xs " :class="kpiChanges.percentChange >= 0? 'text-negative': 'text-positive'">
          <span class="q-mx-auto">
            <q-icon :name="kpiChanges.percentChange >= 0? 'trending_up': 'trending_down'"
            />
            {{ kpiChanges.percentChange >= 0 ? "+" : "" }}{{ kpiChanges.percentChange }}%
          </span>
        </q-item-section>
      </q-card>

      <q-card bordered class="full-height">
        <q-item class="text-h6 bg-primary text-white">
          <q-item-label>Total Congested Sectors</q-item-label>
        </q-item>
        <q-item-section class="text-h4 q-ma-xs " :class="kpiChanges.congestedCountChange >= 0? 'text-negative': 'text-positive'">
          <span class="q-mx-auto">
            <q-icon  :name="kpiChanges.congestedCountChange >= 0? 'trending_up': 'trending_down'"
            />
            {{ kpiChanges.congestedCountChange >= 0 ? "+" : "" }}{{ kpiChanges.congestedCountChange }}
          </span>
        </q-item-section>
      </q-card>

      <q-card bordered class="full-height">
        <q-item class="text-h6 bg-primary text-white">
          <q-item-label>Total Sectors</q-item-label>
        </q-item>
        <q-item-section class="text-h4 q-ma-xs " :class="kpiChanges.totalCountChange >= 0? 'text-positive': 'text-negative'">
          <span class="q-mx-auto">
            <q-icon :name="kpiChanges.totalCountChange >= 0? 'trending_up': 'trending_down'"
            />
            {{ kpiChanges.totalCountChange >= 0 ? "+" : "" }}{{ kpiChanges.totalCountChange }}
          </span>
        </q-item-section>
      </q-card>


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
    const postBarColor = '#237bff';
    const defaultBarColor = '#d1d1f5';
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

    const kpiChanges = computed(() => ({
          percentChange: (postData.value[0]?.percentage - preData.value[0]?.percentage).toFixed(2),
          congestedCountChange: (postData.value[0]?.count_congested - preData.value[0]?.count_congested).toFixed(2),
          totalCountChange: (postData.value[0]?.count_total - preData.value[0]?.count_total).toFixed(2),
        })
    )

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
      kpiChanges,
    }


  },
};
</script>

<style></style>