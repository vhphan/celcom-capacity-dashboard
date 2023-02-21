// define a new Pinia store with name capDataStore

import {defineStore} from 'pinia';
import {apiGetRegionalCountTrend} from "@/api/apiCalls.js";
import {getRegionalTrendCountChartOptions} from "@/charts/options.js";

export const useCapDataStore = defineStore({
    id: 'capData',
    state: () => ({
        regionalCountTrend: [],
    }),
    actions: {
        getRegionalCountTrend() {
            apiGetRegionalCountTrend().then((data) => {
                this.regionalCountTrend = data;
            });
        }
    },
    getters: {
        regionalTrendCountChartOptions() {
            return getRegionalTrendCountChartOptions(this.regionalCountTrend);
        }
    }
});