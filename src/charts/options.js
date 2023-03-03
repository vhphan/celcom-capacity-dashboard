import string from "tabulator-tables/src/js/modules/Sort/defaults/sorters/string.js";

export const getRegionalTrendCountChartOptions = (data) => {
    let allYearWeek = data.map(d => d['Wk Year'] + '-' + d['Wk Num']);
    let allYearWeekPadded = data.map(d => d['Wk Year'] + '-' + String(d['Wk Num']).padStart(2, '0'));
    let xAxisData = [...new Set(allYearWeek)];
    let xAxisLabels = [...new Set(allYearWeekPadded)];
    let regions = [...new Set(data.map(d => d['Region']))];
    let series = [];
    const emphasisStyle = {
        itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
        }
    };
    regions.forEach((region) => {
        let seriesData = [];
        xAxisData.forEach((xData) => {
            let filteredData = data.filter(d => d['Wk Year'] + '-' + d['Wk Num'] === xData && d['Region'] === region);
            if (filteredData.length > 0) {
                seriesData.push(filteredData[0]['count']);
            } else {
                seriesData.push(0);
            }
        });
        series.push({
            name: region,
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: seriesData
        });
    });

    const option = {
        title: {
            text: 'Count of Congested Sectors'
        },
        legend: {
            data: regions,
            top: '10%',
            left: '10%'
        },
        brush: {
            toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
            xAxisIndex: 0
        },
        toolbox: {
            feature: {
                magicType: {
                    type: ['stack']
                },
                dataView: {}
            }
        },
        tooltip: {},
        xAxis: {
            data: xAxisLabels,
            name: 'X Axis'
            // axisLine: { onZero: true },
            // splitLine: { show: false },
            // splitArea: { show: false }
        },
        yAxis: {},
        grid: {
            bottom: 20
        },
        series: series
    };
    return option;

};

export const getPieChartOptions = (data, seriesName, chartTitle) => {

    return {
        title: {
            top: '0%',
            text: chartTitle,
            left: 'center'
        },
        grid: {
            // left: '3%',
            // right: '3%',
            bottom: '0%',
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '10%',
            left: 'center'
        },
        series: [
            {
                name: seriesName,
                type: 'pie',
                radius: ['30%', '60%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                // data: [
                //     {value: 1048, name: 'Search Engine'},
                //     {value: 735, name: 'Direct'},
                //     {value: 580, name: 'Email'},
                //     {value: 484, name: 'Union Ads'},
                //     {value: 300, name: 'Video Ads'}
                // ]
                data: data
            }
        ]
    };
};

export const getGaugeChartOptions = (value, chartTitle, chartColor) => {

    return {
        title: {
            text: chartTitle,
            left: 'center'
        },
        series: [
            {
                type: 'gauge',
                itemStyle: {
                    color: chartColor
                },
                progress: {
                    show: true,
                    width: 18
                },
                axisLine: {
                    lineStyle: {
                        width: 18,
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    length: 15,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 25,
                    color: '#999',
                    fontSize: 12
                },
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 25,
                    itemStyle: {
                        borderWidth: 10,
                        // color: chartColor
                        borderColor: chartColor,
                    }
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: true,
                    fontSize: 30,
                    offsetCenter: [0, '70%']
                },
                data: [
                    {
                        value
                    }
                ]
            }
        ]
    };


}

export const getSimpleTrendCountChartOptions = (data, chartTitle,
                                                xLabel, yLabel, preXValue, postXValue,
                                                preBarColor = '#a90000',
                                                postBarColor = '#00a900',
                                                defaultBarColor = '#9bd4f3') => {

    chartTitle ||= `${yLabel} Trend Count`;
    let xAxisData = data.map(d => d[xLabel]);
    let seriesData = data.map((d, i) => ({
        value: d[yLabel],
        itemStyle: {
            color: getColor(xAxisData[i])
        }
    }));

    function getColor(xAxisDatum) {
        if (xAxisDatum === preXValue) {
            return preBarColor;
        }
        if (xAxisDatum === postXValue) {
            return postBarColor;
        }
        return defaultBarColor;
    }

    return {
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: seriesData,
                type: 'bar'
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
    };
}
