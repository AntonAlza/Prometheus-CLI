import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { EChartsOption } from 'echarts';
import { Color, Label } from 'ng2-charts';

export let echartHorizontalLineBarChart: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '35',
    },
    tooltip: {
        show: true,
			showContent: true,
			alwaysShowContent: true,
			triggerOn: 'mousemove',
			trigger: 'axis',
			axisPointer:
			{
				label: {
					show: false,
				}
			}
    },
    xAxis: {
       
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        data: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: {
          lineStyle: {
            color: 'rgba(67, 87, 133, .09)'
          }
        },
        axisLabel: {
          fontSize: 10,
          color: '#8e9cad'
        }
    },
    yAxis: {
        splitLine: {
			lineStyle: {
			  color: 'rgba(67, 87, 133, .09)'
			}
		  },
		  axisLine: {
			lineStyle: {
			  color: 'rgba(67, 87, 133, .09)'
			}
		  },
		  axisLabel: {
			fontSize: 10,
			color: '#8e9cad'
		}
    },
    series: [{
        name: 'Last Price $',
        type: 'line',
        smooth: true,
        data: [254, 678, 346, 789, 452, 389, 576, 689, 937, 457, 782, 827],
        lineStyle:{  
            opacity:0.8,
            width:4
       }
	},
     {
        name: 'Daily Change $',
        type: 'line',
        smooth: true,
        data: [154, 578, 226, 589, 252, 189, 376, 289, 637, 257, 582, 727],
        lineStyle:{  
            opacity:0.8,
            width:4
       }

	}],
    color:[ '#4454c3','#f72d66']
}

//Crypto Charts
export let lineChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    responsive: true,
    tooltips: {
        mode: 'index',
        titleFontSize: 12,
        titleFontColor: '#7886a0',
        bodyFontColor: '#7886a0',
        backgroundColor: '#fff',
        titleFontFamily: 'Montserrat',
        bodyFontFamily: 'Montserrat',
        cornerRadius: 3,
        intersect: false,
    },
    scales: {
        xAxes: [{
            gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent'
            },
            ticks: {
                fontSize: 2,
                fontColor: 'transparent'
            }
        }],
        yAxes: [{
            display: false,
            ticks: {
                display: false,
            }
        }]
    },
    title: {
        display: false,
    },
    elements: {
        line: {
            borderWidth: 1
        },
        point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4
        }
    }
}

export let lineChartLabels: Label[] = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
export let lineChartType: ChartType = 'line';
export let lineChartLegend = true;
export let lineChartColors: Color[] = [
    {
        backgroundColor: 'rgb(68, 84, 195,0.06)',
        borderColor: 'rgba(68, 84, 195,0.8)',
        borderWidth: 3,
        pointBorderColor: 'transparent',
        pointBackgroundColor: 'transparent',
    }
]
export let lineChartData: ChartDataSets[] = [
    {
        data: [83,56,89, 73, 61, 75, 86, 56],
        label: 'Bitcon',
    }
]

export let lineChartData1: ChartDataSets[] = [
    {
        data: [45,78,67,78,36,78,89,84],
        label: 'Nem',
    }
]
export let lineChartData2: ChartDataSets[] = [
    {
        data: [56,78,36,78,29,78,37,56],
        label: 'Ripple',
    }
]
export let lineChartData3: ChartDataSets[] = [
    {
        data: [45,78,98,34,67,28,89,45],
		label: 'Neo',
    }
]

