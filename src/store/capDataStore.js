// define a new Pinia store with name capDataStore

import {defineStore} from 'pinia';
import {apiGetRegionalCountTrend} from "@/api/apiCalls.js";
import {getRegionalTrendCountChartOptions} from "@/charts/options.js";
import {agings, issueTags, regions} from "@/constants.js";

export const useCapDataStore = defineStore({
    id: 'capData',
    state: () => ({
        regionalCountTrend: [],
        worstCellsList: [],
        selectedRegions: regions,
        selectedAgings: agings,
        selectedIssueTags: issueTags,
    }),
    actions: {
        async getRegionalCountTrend() {
            this.regionalCountTrend = await apiGetRegionalCountTrend();
        }
    },
    getters: {
        regionalTrendCountChartOptions() {
            return getRegionalTrendCountChartOptions(this.regionalCountTrend);
        }
    }
});