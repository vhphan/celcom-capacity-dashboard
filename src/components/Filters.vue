<template>
  <div class="q-pa-md">
    <div class="bg-grey-2 q-pa-sm rounded-borders ">
      Regions:
      <q-option-group
          :options="availableRegions"
          type="checkbox"
          v-model="selectedRegions"
      />
    </div>

    <div
        v-show="['Page2'].includes(currentRouteName)"
        class="bg-blue-1 q-pa-sm rounded-borders ">
      Agings (Weeks)
      <q-option-group
          class="justify-between"
          :options="availableAgings"
          type="checkbox"
          v-model="selectedAgings"
      />
    </div>

    <div
        v-show="['Page2'].includes(currentRouteName)"
        class="bg-red-1 q-pa-sm rounded-borders ">
      Issue Categories
      <q-option-group
          :options="availableIssueTags"
          type="checkbox"
          v-model="selectedIssueTags"
      />
    </div>
    <q-separator/>
    <div class="bg-grey-2 q-pa-sm rounded-borders ">
      <q-btn
          color="primary"
          label="Apply"
          @click="applyFilters"
          icon="refresh"
          class="full-width"
          outline
          glossy
      />
    </div>
    <q-separator/>
    <div
        v-show="['Page2'].includes(currentRouteName)"
        class="bg-grey-2 q-pa-sm rounded-borders "
    >

      <q-table
          title="Filters Applied"
          :rows="rows"
          :columns="columns"
          row-key="name"
          hide-pagination
          flat
          dense
          bordered
          :table-header-style="{ backgroundColor: '#9afafa' }"
          separator="cell"
      />

    </div>
  </div>

</template>

<script>
import {useCapDataStore} from "@/store/capDataStore.js";
import {storeToRefs} from "pinia";
import {agings, issueTags, regions} from "@/settings/constants.js";
import {computed} from "vue";
import {useRoute} from 'vue-router';


export default {
  name: "Filters",
  emits: ['filtersApplied'],
  setup(props, {emit}) {
    const store = useCapDataStore();
    const {worstCellsTableFilters} = storeToRefs(store);

    const rows = computed(() => {
      let finalRows = worstCellsTableFilters.value.map(f => {
        return {
          field: f.field,
          type: f.type,
          value: f.value.join(', ')
        };
      })
      finalRows = finalRows.filter(r => {
        if (currentRouteName.value === 'Page1') {
          return r.field !== 'aging' && r.field !== 'issue_category';
        }
        return true;
      });
      return finalRows;
    });

    const availableRegions = regions.map(r => ({label: r, value: r}));
    const availableAgings = agings.map(a => ({label: a, value: a}));
    const availableIssueTags = issueTags.map(t => ({label: t, value: t}));

    const {selectedRegions, selectedAgings, selectedIssueTags} = storeToRefs(store);

    const applyFilters = function () {
      store.getRegionalCountTrend();
      store.getIssueCountTrend();
      store.getAgingCountTrend();
      store.getOverallCountAndPercentage();
      store.applyFiltersClicked = true;
    };
    const route = useRoute()
    const currentRouteName = computed(() => route.name)

    return {
      availableRegions,
      selectedRegions,
      availableAgings,
      selectedAgings,
      availableIssueTags,
      selectedIssueTags,
      applyFilters,
      worstCellsTableFilters,
      columns: [
        {name: 'field', label: 'Field', field: 'field', align: 'left', sortable: true},
        // {name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true},
        {name: 'value', label: 'Value', field: 'value', align: 'left', sortable: true},
      ],
      rows,
      currentRouteName
    };

  }


};
</script>

<style>
.option-parent > div {
  display: flex;
  justify-content: space-evenly;
}

.option-parent2 > div {
  margin-right: 0px;
}
</style>