<template>
  <div ref="tableRef" style="height: calc(100vh - 350px);" ></div>
</template>
<script>

import {useCapDataStore} from "@/store/capDataStore.js";
import {computed, onMounted, ref, watch} from "vue";
import {createTabulator, minMaxFilterEditor, minMaxFilterFunction} from "@/utils/tblFuncs.js";
import {BASE_URL_NODE} from "@/plugins/http.js";
import {storeToRefs} from "pinia";

export default {
  name: 'worst-cells-table',
  setup() {
    const store = useCapDataStore();
    const tableRef = ref(null);
    const tabulatorRef = ref(null);
    const {regionalCountTrend, worstCellsTableFilters, applyFiltersClicked} = storeToRefs(store);
    const {selectedRegions, selectedAgings, selectedIssueTags} = storeToRefs(store);
    const isTableBuilt = ref(false);
    const tableFilters = ref([]);
    const numberColumns = ['aging', 'Average PRB (Normalize)', 'Average user TP 4BH (Mbps) Total', 'Current Sector 4BH volume (GB)'];


    onMounted(() => {
      const {regions, agings, issueTags} = store.selectionToParams();
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
                if (column.field === 'issue_category') {
                  column.title = 'Issue Category';
                }
              }
          );

          return definitions;
        },
        initialFilter:[
          {field: 'Region', type: 'in', value: regions},
          {field: 'aging', type: 'in', value: agings},
          {field: 'issue_category', type: 'in', value: issueTags},
        ],

      };
      createTabulator(
          tabulatorRef,
          tableRef,
          isTableBuilt,
          'worst_cells',
          `${BASE_URL_NODE}/getTabulatorData`,
          'capacity',
          addOpts,
      );


    });

    watch(applyFiltersClicked, (newVal, oldVal) => {
      if (newVal) {
        const {regions, agings, issueTags} = store.selectionToParams();
        tabulatorRef.value.setFilter([
          {field: 'Region', type: 'in', value: regions},
          {field: 'aging', type: 'in', value: agings},
          {field: 'issue_category', type: 'in', value: issueTags},
        ]);
        store.applyFiltersClicked = false;
      }
    });

    const unwatch = watch(isTableBuilt, (newVal, oldVal) => {
      if (newVal) {
        console.log('isTableBuilt changed to true');
        console.log(tabulatorRef.value?.getHeaderFilters());
        tabulatorRef.value.on("dataFiltered", function (filters, rows) {
          //filters - array of filters currently applied
          //rows - array of row components that pass the filters
          tableFilters.value = filters;
          store.worstCellsTableFilters = filters;
          console.log(filters);
        });
        store.applyFiltersClicked = false;
        unwatch();
      }
    });



    return {
      tableRef,
      tabulatorRef,
      tableFilters,
    };

  }
};
</script>
