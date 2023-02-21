import {apiNode} from "../plugins/http.js";

export const apiGetRegionalCountTrend = async () => {
    const response = (await apiNode.get(`/regionalCountTrend`)).data;
    return response.data;
};
