import {computed, ref} from 'vue';
import {defineStore} from 'pinia';
import {
    apiGetAgingCountTrend,
    apiGetAvailableYearWeeks,
    apiGetIssueCountTrend,
    apiGetRegionalCountTrend
} from "@/api/apiCalls.js";
import {agings, issueTags, regions} from "@/constants.js";
import {apiGetOverallCountAndPercentageTrend} from '../api/apiCalls';

export const useCapDataStore = defineStore('capData', () => {
    // STATES
    const regionalCountTrend = ref([]);
    const agingCountTrend = ref([]);
    const issueCountTrend = ref([]);
    const worstCellsList = ref([]);
    const availableYearWeeks = ref([]);
    const worstCellsTableFilters = ref([]);
    const overallCountAndPercentage = ref([]);
    const applyFiltersClicked = ref(false);

    const selectedRegions = ref(regions);
    const selectedAgings = ref(agings);
    const selectedIssueTags = ref(issueTags);
    const latestYearWeek = ref(null);
    const previosYearWeek = ref(null);
    const selectedPostYearWeek = ref(null);
    const selectedPreYearWeek = ref(null);

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
        availableYearWeeks.value = data.map(d => d["year_week"]);
        selectedPostYearWeek.value = availableYearWeeks.value.at(-1);
        selectedPreYearWeek.value = availableYearWeeks.value.at(-2);
    }

    async function getOverallCountAndPercentage() {
        overallCountAndPercentage.value = (await apiGetOverallCountAndPercentageTrend(selectionToParams.value()));
    }



    return {
        selectedAgings,
        selectedIssueTags,
        selectedRegions,
        regionalCountTrend,
        agingCountTrend,
        issueCountTrend,
        worstCellsList,
        overallCountAndPercentageTrend: overallCountAndPercentage,
        availableYearWeeks,
        selectedPostYearWeek,
        selectedPreYearWeek,
        getRegionalCountTrend,
        getIssueCountTrend,
        getAgingCountTrend,
        getAvailableYearWeeks,
        getOverallCountAndPercentage,
        maxYearWeek,
        selectionToParams,
        worstCellsTableFilters,
        applyFiltersClicked,
    };
});