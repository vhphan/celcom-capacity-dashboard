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
    <div class="bg-blue-1 q-pa-sm rounded-borders ">
      Agings (Weeks)
      <q-option-group
          class="justify-between"
          :options="availableAgings"
          type="checkbox"
          v-model="selectedAgings"
      />
    </div>
    <div class="bg-red-1 q-pa-sm rounded-borders ">
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
    <div class="bg-grey-2 q-pa-sm rounded-borders ">

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
import {agings, issueTags, regions} from "@/constants.js";
import {computed} from "vue";

export default {
  name: "Filters",
  setup() {
    const store = useCapDataStore();
    const {worstCellsTableFilters} = storeToRefs(store);
    const rows = computed(() => worstCellsTableFilters.value.map(f => {
      return {
        field: f.field,
        type: f.type,
        value: f.value.join(', ')
      };
    }));

    const availableRegions = regions.map(r => ({label: r, value: r}));
    const availableAgings = agings.map(a => ({label: a, value: a}));
    const availableIssueTags = issueTags.map(t => ({label: t, value: t}));

    const {selectedRegions, selectedAgings, selectedIssueTags} = storeToRefs(store);

    const applyFilters = function () {
      store.getRegionalCountTrend();
      store.getIssueCountTrend();
      store.getAgingCountTrend();
    };

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