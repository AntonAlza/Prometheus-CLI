import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { EChartsOption } from 'echarts';

export let DonutChartData :any = {
    pieseries: [68, 55, 45],
    colors: [	"#2dce89", "#4454c3", "#f72d66"],
    chart: {
        type: 'donut',
        height: 300,
    },
    labels: [
        "Completed",
        "Running",
        "Pending",
    ],
    legend: {
        show: false,
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                show: false,
                position: 'bottom'
            }
        }
    }]
};


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
        name: 'Project Budget',
        type: 'line',
        smooth:true,
        data: [7635, 5465, 6754, 5432, 5435, 6545, 4453, 3425, 7654, 3245, 4532, 5643],
        lineStyle:{
            width:4,
            opacity:0.8,
        
        }
	}, {
        name: 'Expenses',
        type: 'line',
        smooth:true,
        data: [ 5435, 3452, 5432, 3452, 2564, 3456, 3123, 2435, 5463, 1245, 3245, 4534,],
        lineStyle:{
            width:4,
            opacity:0.8,
        
        }

	}],
    color: ['#4454c3', '#f72d66']
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
            borderWidth: 3
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
        data: [13, 26, 20, 93, 61, 140, 85, 96],
        label: 'Expenses',
    }
]