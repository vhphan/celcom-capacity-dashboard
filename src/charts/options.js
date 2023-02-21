export const getRegionalTrendCountChartOptions = (data) => {
    let allYearWeek = data.map(d => d['Wk Year'] + '-' + d['Wk Num']);
    let xAxisData = [...new Set(allYearWeek)];
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
        legend: {
            data: regions,
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
            data: xAxisData,
            name: 'X Axis'
            // axisLine: { onZero: true },
            // splitLine: { show: false },
            // splitArea: { show: false }
        },
        yAxis: {},
        grid: {
            bottom: 100
        },
        series: series
    };
    return option;

};