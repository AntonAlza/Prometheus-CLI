export let DonutChartData :any = {
    pieseries: [68, 55, 45],
    colors: ["#2dce89",
    "#4454c3",
    "#ff5b51"],
    chart: {
        type: 'donut',
        height: 270,
    },
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

export let StatusData = {

    series: [{
        name: 'Page Views',
        type: 'bar',
        barMaxWidth: 7,
        data: [1453, 3425, 7654, 3245, 4532, 5643, 7635, 5465, 6754, 5432, 5435, 6545],
        itemStyle: {
              normal: {
                  barBorderRadius: [50, 50, 0, 0] ,
              }
        }
    }, {
        name: 'New Visitors',
		  type: 'bar',
		  barMaxWidth: 7,
		  data: [1123, 2435, 5463, 1245, 3245, 4534, 5435, 3452, 5432, 3452, 2564, 3456 ],
		  itemStyle: {
                normal: {
                    barBorderRadius: [50, 50, 0, 0] ,
				}
		  }
    }],

    colors: ['#4454c3', '#f72d66','#cedbfd'],

    chart: {
        height: 285,
        type: 'bar',
        toolbar: {
            show: true,
			showContent: true,
			alwaysShowContent: true,
			triggerOn: 'mousemove',
			trigger: 'axis',
			axisPointer:
			{
				label: {
					show: true,
				}
			}
        },
        fontFamily: 'Nunito, sans-serif',
    },

    plotOptions: {
        bar: {
            dataLabels: {
                enabled: false
            },
            columnWidth: '42%',
            endingShape: 'rounded',
        }
    },

    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 1,
        endingShape: 'rounded',
        colors: ['transparent'],
    },
    responsive: [{
        breakpoint: 576,
        options: {
            stroke: {
                show: true,
                width: 1,
                endingShape: 'rounded',
                colors: ['transparent'],
            },
        },


    }],

    xaxis: {
        categories: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
    yaxis:{
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
      }},
    fill: {
        opacity: 1
    },
    legend: {
        show: false,
        floating: true,
        position: 'top',
        horizontalAlign: 'left',


    },

    tooltip: {
        y: {
            formatter: function (val:any) {
                return "$ " + val + " thousands"
            }
        }
    }
};
