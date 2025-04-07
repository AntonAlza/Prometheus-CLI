import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

//Line Charts
export let lineChartOptions: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
    labels: {
      //display: false
    }
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 10,
        max: 80,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }]
  }
};

export let lineChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export let lineChartType: ChartType = 'line';
export let lineChartLegend = false;
export let lineChartData: ChartDataSets[] = [
  {
    data: [12, 15, 18, 40, 35, 38, 32, 20, 25, 15, 25, 30],
    borderColor: '#fb8fad',
    borderWidth: 1,
    fill: false
  }, {
    data: [10, 20, 25, 55, 50, 45, 35, 30, 45, 35, 55, 40],
    borderColor: '#5160c7',
    borderWidth: 1,
    fill: false
  }
];
export let lineChartColors: Color[] = [

];





//BarChart (Horizantal)
export let barChartOptions: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      stacked: true,
      ticks: {
        beginAtZero: true,
        fontSize: 10,
        max: 80,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],
    xAxes: [{
      stacked: true,
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        fontColor: "rgb(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }]
  }
};
export let barChartLabels: Label[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export let barChartType: ChartType = 'horizontalBar';
export let barChartLegend = true;
export let barChartPlugins = [];
export let barChartData: ChartDataSets[] = [
  {
    data: [10, 24, 20, 25, 35, 50],
    backgroundColor: '#3d55f9',
    borderWidth: 1,
    fill: true
  }, {
    data: [10, 24, 20, 25, 35, 50],
    backgroundColor: '#404fb9',
    borderWidth: 1,
    fill: true
  }, {
    data: [20, 30, 28, 33, 45, 65],
    backgroundColor: '#818bce',
    borderWidth: 1,
    fill: true
  }
]


//STACKED BAR CHART (Vertical)
export let barChart2Options: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
  },
  scales: {
    yAxes: [{
      stacked: true,
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],
    xAxes: [{
      stacked: true,
      ticks: {
        fontSize: 11,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }]
  },
}
export let barChart2Labels: Label[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export let barChart2Type: ChartType = 'bar';
export let barChart2Legend = true;
// export let barChart2Plugins = []

export let barChart2Data: ChartDataSets[] = [
  {
    data: [10, 24, 20, 25, 35, 50],
    backgroundColor: '#3d55f9',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.5,
  }, {
    data: [10, 24, 20, 25, 35, 50],
    backgroundColor: '#404fb9',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.5,
  }, {
    data: [20, 30, 28, 33, 45, 65],
    backgroundColor: '#818bce',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.5,
  }
];

export let barchart2Colors: Color[] = [
  {
    borderColor: "#b1b9f3",
    borderWidth: 0,
    backgroundColor: '#b1b9f3',
  },
  {
    borderColor: "#6d7ce4",
    borderWidth: 0,
    backgroundColor: '#6d7ce4'
  },
  {
    borderColor: "#4454c3",
    borderWidth: 0,
    backgroundColor: '#4454c3',
  },

]






//Area Chart
export let AreaChartOptions: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  tooltips: {
    mode: 'index',
    intersect: false
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],

    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 10,
        max: 80,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],
  },
  legend: {
    display: false,
    labels: {
      //   display: false
    }
  }

}
export let AreaChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export let AreaChartType: ChartType = 'line';
export let AreaChartData: ChartDataSets[] = [
  {
    data: [12, 15, 18, 40, 35, 38, 32, 20, 25, 15, 25, 30],
    borderColor: '##6d7ce4',
    borderWidth: 1,
    backgroundColor: 'rgba(247, 85, 122,.5)'
  }, {
    data: [10, 20, 25, 55, 50, 45, 35, 37, 45, 35, 55, 40],
    borderColor: '#007bff',
    borderWidth: 1,
    backgroundColor: 'rgba(0,123,255,.3)'
  }
]

export let AreaChartColors: Color[] = [
  {
    borderColor: '#f7557a',
    borderWidth: 1,
    backgroundColor: 'rgba(247, 85, 122,.5)',
  },
  {
    borderColor: '#007bff',
    borderWidth: 1,
    backgroundColor: 'rgba(0,123,255,.3)',
    // pointHighlightStroke: "rgba(235, 111, 51 ,1)",
  }

]






//DoughNut Chart and Pie chart data
export let PieChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
export let PieChartData: ChartDataSets[] = [
  {
    data: [20, 20, 30, 5, 25],
    backgroundColor: ['#285cf7', '#f10075', '#8500ff', '#7987a1', '#74de00']
  }

]
export let PieChartOptions: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
  },
  animation: {
    animateScale: true,
    animateRotate: true
  }
}
export let DoughnutChartType: ChartType = 'doughnut';
export let PieChartType: ChartType = 'pie';






//SOLID COLOR
export let solidColorChartOptions: ChartOptions = {

  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 10,
        max: 80,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }]
  }

}
export let solidColorChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
export let solidColorLegend = true;
export let solidColorChartType: ChartType = 'bar';
export let solidColorChartData: ChartDataSets[] = [{
  label: '# of Votes',
  data: [12, 39, 20, 10, 25, 18],
  barPercentage: 0.6
}];
export let solidColorChartColors: Color[] = [
  {
    backgroundColor: '#6d7ce4',

  }
];

export let transparentChartColors: Color[] = [
  {
    backgroundColor: '#9ca9ff',
  }
];

export let gradientColorColors: Color[] = [
  {
    backgroundColor: 'rgba(171, 167, 167,0.2)',
  }
];


// HORIZONTAL BAR CHART

export let horizantalBarChartOptions: ChartOptions = {

  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 10,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        max: 80,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }]
  }

}
export let horizantalBarChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
export let horizantalBarLegend = true;
export let horizantalBarChartType: ChartType = 'horizontalBar';
export let horizantalBarChartData: ChartDataSets[] = [{
  label: '# of Votes',
  data: [12, 39, 20, 10, 25, 18],

}];
export let horizantalBarChartColors: Color[] = [
  {
    backgroundColor: ['#285cf7', '#f10075', '#f7557a', '#673ab7', '#ffc107', '#7987a1']
  }
];

//HORIZONTAL 2 BAR CHART

export let horizantalBar2ChartOptions: ChartOptions = {

  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        fontColor: "rgba(171, 167, 167,0.9)",
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 11,
        max: 80,
        fontColor: "rgba(171, 167, 167,0.9)",
        
      },
      gridLines: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }]
  }
}

export let horizantalBar2ChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
export let horizantalBar2Legend = false;
export let horizantalBar2ChartType: ChartType = 'horizontalBar';
export let horizantalBar2ChartData: ChartDataSets[] = [{
  data: [12, 39, 20, 10, 25, 18],
}, {
  data: [22, 30, 25, 30, 20, 40],
}];
export let horizantalBar2ChartColors: Color[] = [
  {
    backgroundColor: ['#285cf7', '#f10075', '#673ab7', '#ffc107', '#7987a1', '#7571f9'],
  },
  {
    backgroundColor: 'rgba(0,123,255,.5)'
  }
];



