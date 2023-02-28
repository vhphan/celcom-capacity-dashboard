<template>
  <div style="display:flex;" class="q-ma-xs row">
    <region-count-bar-chart style="height: 300px;" class="col-md-12"/>
  </div>
  <div style="display:flex;" class="q-ma-xs row">
    <worst-cells-table class="col-md-8"/>
    <div class="col-md-4 q-pt-lg">
      <aging-pie-chart style="height: 300px; margin-top: 120px;" />
      <issue-pie-chart style="height: 300px;" class="q-mt-lg"/>
    </div>
  </div>
</template>

<script>
import AgingPieChart from "@/components/AgingPieChart.vue";
import RegionCountBarChart from "@/components/RegionCountBarChart.vue";
import IssuePieChart from "@/components/IssuePieChart.vue";
import WorstCellsTable from "@/components/WorstCellsTable.vue";

//    const {page, size, schema, boolOperand, table, filters, sorters} = request.query;

export default {
  name: "Page1",
  components: {
    WorstCellsTable,
    IssuePieChart,
    RegionCountBarChart,
    AgingPieChart,
  },
  setup: function () {

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