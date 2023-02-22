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
      Issue Tags
      <q-option-group
          :options="availableIssueTags"
          type="checkbox"
          v-model="selectedIssueTags"
      />
    </div>
  </div>

</template>

<script>
import {useCapDataStore} from "@/store/capDataStore.js";
import {storeToRefs} from "pinia";
import {agings, issueTags, regions} from "@/constants.js";

export default {
  name: "Filters",
  setup() {
    const store = useCapDataStore();

    const availableRegions = regions.map(r => ({label: r, value: r}));
    const availableAgings = agings.map(a => ({label: a, value: a}));
    const availableIssueTags = issueTags.map(t => ({label: t, value: t}));

    const {selectedRegions, selectedAgings, selectedIssueTags} = storeToRefs(store);

    return {
      availableRegions,
      selectedRegions,
      availableAgings,
      selectedAgings,
      availableIssueTags,
      selectedIssueTags,
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