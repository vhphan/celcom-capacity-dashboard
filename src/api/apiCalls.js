import {apiNode} from "../plugins/http.js";

export const apiGetRegionalCountTrend = async (params = {}) => {
    const response = (await apiNode.get(`/regionalCountTrend`, {params})).data;
    return response.data;
};

export const apiGetIssueCountTrend = async (params = {}) => {
    const response = (await apiNode.get(`/getIssueCountTrend`, {params})).data;
    return response.data;
};

export const apiGetAgingCountTrend = async (params = {}) => {
    const response = (await apiNode.get(`/getAgingCountTrend`, {params})).data;
    return response.data;
};

export const apiGetMaxYearWeek = async (params = {}) => {
    const response = (await apiNode.get(`/getMaxYearWeek`, {params})).data;
    return response.data;
}

export const apiGetAvailableYearWeeks = async (params = {}) => {
    const response = (await apiNode.get(`/getAvailableYearWeeks`, {params})).data;
    return response.data;
}