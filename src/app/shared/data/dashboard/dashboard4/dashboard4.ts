import { color } from "echarts";

export let chartoptions:any = {
    series: [
        {
            name: 'Project In',
            type: 'bar',
            stack: 'Stack',
            barMaxWidth: 18,
            data: [1453, 3425, 7654, 3245, 4532, 5643, 7635, 5465, 6754, 5432, 5435, 6545],
            itemStyle: {
                  normal: {
                      barBorderRadius: [0] ,
                  }
            },
            color:'#4454c3',
          },
          {
            name: 'Project take',
            type: 'bar',
            stack: 'Stack',
            barMaxWidth:18,
            data: [1123, 2435, 5463, 1245, 3245, 4534, 5435, 3452, 5432, 3452, 2564, 3456 ],
            itemStyle: {
                  normal: {
                      barBorderRadius: [0] ,
                  }
            },
            color:'#f72d66'
          },
          {
            name: 'On Hold',
            type: 'bar',
            stack: 'Stack',
            barMaxWidth:18,
            data: [330, 990, 2191, 2000, 1287, 1109, 2013, 1322, 1980, 2971, 3089, 1234],
            itemStyle: {
                  normal: {
                      barBorderRadius: [50, 50, 0, 0] ,
                  }
            },
            color:"#cedbfd"
          }
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    color:['#4454c3', '#f72d66','#cedbfd'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
        grid: {
            top: '6',
            right: '0',
            bottom: '17',
            left: '40',
          },
      bar: {
        horizontal: false
      }
    },
    xaxis: {
        type: "category",
        categories:  ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };

  export let DonutChartData :any = {
    pieseries: [68, 55, 45, 34, 27],
    colors: ['#4454c3', '#f72d66','#2dce89', '#45aaf2','#ecb403','#ff5b51'],
    labels: [
        "Application",
        "Shortlisted",
        "Rejected",
        "On Hold",
        "Finalised"
    ],
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
