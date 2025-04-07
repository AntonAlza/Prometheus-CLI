import { EChartsOption } from 'echarts';

//Echart (line Chart)
export let echartLineOption: EChartsOption = {
    

    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2013', '2014', '2015', '2016', '2017', '2018', '2019'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		stack: 'Stack',
		data: [10, 15, 9, 18, 10, 15, 20]
	}, {
		name: 'Profit',
		type: 'bar',
		stack: 'Stack',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25 , 16]
	}],
    color: ['#f7557a', '#4454c3'],

};

//combined line and bar chart
export let echartLineBarOption: EChartsOption = {
    grid: {
        top: '6',
        right: '10',
        bottom: '17',
        left: '32',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        type: 'category',
        data: ['2013', '2014', '2015', '2016', '2017', '2018'],
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		stack: 'Stack',
		data: [10, 15, 9, 18, 10, 15]
	}, {
		name: 'Profit',
		type: 'bar',
		stack: 'Stack',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25]
	}],
    color: ['#f7557a', '#4454c3']
}
//Horizontal line chart
export let echartHorizontalLineChart: EChartsOption = {
    valueAxis: {
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        }
    },
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 15, 9, 18, 10, 15]
	},  {
		name: 'growth',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25]
	}],
    color: ['#4454c3', '#f7557a' ]
}
//Combined Horizontal line  and bar chart
export let echartHorizontalLineBarChart: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'line',
		smooth: true,
		data: [10, 15, 9, 18, 10, 15],
		color: ['#4454c3']
	}, {
		name: 'Profit',
		type: 'line',
		smooth: true,
		// size: 10,
		data: [10, 14, 10, 15, 9, 25],
		color: ['#f7557a']
	}],
    color: ['#4454c3', '#f7557a' ]
}
//stacked bar chart
export let echartStackedBarChart: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '32',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(119, 119, 142, 0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
    },
    yAxis: {
        type: 'category',
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 15, 9, 18, 10, 15]
	},  {
		name: 'growth',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25]
	}],
    color: ['#4454c3', '#f7557a']

}
//Horizontal stacked bar chart
export let echartHoriStackedBarChart: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '32',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
    },
    yAxis: {
        type: 'category',
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series:[{
		name: 'sales',
		type: 'line',
		smooth: true,
		data: [10, 15, 9, 18, 10, 15],
		color: ['#4454c3']
	}, {
		name: 'Profit',
		type: 'line',
		smooth: true,
		// size: 10,
		data: [10, 14, 10, 15, 9, 25],
		color: ['#f7557a']
	}],
    color: ['#f7557a', '#4454c3', '#43d7ef']
}

//DATA ATTRIBUTES 1
export let dataAttributes1: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2013', '2014', '2015', '2016', '2017', '2018'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series:[{
		name: 'data',
		type: 'line',
		data: [5, 15, 9, 18, 10, 15]
	}],
    color: ['#f7557a']
}

export let dataAttributes2: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2013', '2014', '2015', '2016', '2017', '2018'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series:[{
		name: 'data',
		type: 'line',
		smooth: true,
		data: [5, 15, 9, 18, 10, 15]
	}],
    color: ['#4454c3']
}

export let dataAttributes3: EChartsOption = {
    // grid: {
    //     x: 40,
    //     y: 20,
    //     x2: 40,
    //     y2: 20
    // },
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#888180'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        }
    },
    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#888180'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(255,255,255,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        }
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    legend: {
        data: ['New Account', 'Expansion Account']
    },
    toolbox: {
        show: false
    },
    calculable: false,
    xAxis: [{
        type: 'category',
        data: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    }],
    yAxis: [{
        type: 'value',
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    }],
    series: [{
        name: 'View Price',
        type: 'bar',
        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        markPoint: {
            data: [{
                type: 'max',
                name: ''
            }, {
                type: 'min',
                name: ''
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: ''
            }]
        }
    }, {
        name: ' Purchased Price',
        type: 'bar',
        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        markPoint: {
            data: [{
                name: 'Purchased Price',
                value: 182.2,
                xAxis: 7,
                yAxis: 183,
            }, {
                name: 'Purchased Price',
                value: 2.3,
                xAxis: 11,
                yAxis: 3
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: ''
            }]
        }
    }],
    color: ['#4454c3', '#f7557a']
}
