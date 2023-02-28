import {ref, computed} from 'vue';
import {defineStore} from 'pinia';
import {
    apiGetAgingCountTrend,
    apiGetAvailableYearWeeks,
    apiGetIssueCountTrend, apiGetMaxYearWeek,
    apiGetRegionalCountTrend
} from "@/api/apiCalls.js";
import {getRegionalTrendCountChartOptions} from "@/charts/options.js";
import {agings, issueTags, regions} from "@/constants.js";

export const useCapDataStore = defineStore('capData', () => {
    // STATES
    const regionalCountTrend = ref([]);
    const agingCountTrend = ref([]);
    const issueCountTrend = ref([]);
    const worstCellsList = ref([]);
    const availableYearWeeks = ref([]);
    const worstCellsTableFilters = ref([]);

    const selectedRegions = ref(regions);
    const selectedAgings = ref(agings);
    const selectedIssueTags = ref(issueTags);

    // GETTERS
    const selectionToParams = computed(() => function () {

        let agings = selectedAgings.value.reduce((r, agingCategory) => {
            switch (agingCategory) {
                case '1':
                    r.push(1);
                    break;
                case '2 to 4':
                    r.push(2, 3, 4);
                    break;
                case '> 4':
                    r.push(5, 6, 7, 8);
                    break;
            }
            return r;
        }, []);
        return {
            regions: selectedRegions.value,
            agings,
            issueTags: selectedIssueTags.value,
        };

    });
    const maxYearWeek = computed(() => {
        if (!availableYearWeeks.value.length) {
            return null;
        }
        return availableYearWeeks.value[availableYearWeeks.value.length - 1];
    });


    // ACTIONS
    async function getRegionalCountTrend() {
        regionalCountTrend.value = (await apiGetRegionalCountTrend(selectionToParams.value()));
    }
    async function getIssueCountTrend() {
        issueCountTrend.value = (await apiGetIssueCountTrend(selectionToParams.value()));
    }

    async function getAgingCountTrend() {
        agingCountTrend.value = (await apiGetAgingCountTrend(selectionToParams.value()));
    }

    // async function getMaxYearWeek() {
    //     const data = (await apiGetMaxYearWeek());
    //     maxYearWeek.value = data[0]?.['max_year_week'];
    // }

    async function getAvailableYearWeeks() {
        const data = (await apiGetAvailableYearWeeks());
        availableYearWeeks.value = data.map(d => d.year_week);
    }

    return {
        selectedAgings,
        selectedIssueTags,
        selectedRegions,
        regionalCountTrend,
        agingCountTrend,
        issueCountTrend,
        worstCellsList,
        getRegionalCountTrend,
        getIssueCountTrend,
        getAgingCountTrend,
        getAvailableYearWeeks,
        maxYearWeek,
        selectionToParams,
        worstCellsTableFilters,
    };
});