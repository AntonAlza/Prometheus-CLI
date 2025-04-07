import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { EChartsOption, SeriesOption } from 'echarts';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { ListaConsultaConsumo } from 'src/app/models/Bases/consultaconsumo';
interface YearNode {
  name: string;
  children?: YearNode[];
}
@Component({
  selector: 'app-consultaconsumo',
  templateUrl: './consultaconsumo.component.html',
  styleUrls: ['./consultaconsumo.component.scss']
})
export class ConsultaconsumoComponent implements OnInit {

  public consulConsDS:MatTableDataSource<ListaConsultaConsumo>
  public consulCons: ListaConsultaConsumo[]=[];
  public pFechaInicio:string="";
  public pFechaFin:string="";
  public dtpFecIni:string="";
  public dtpFecFin:string="";
  public selectedOption: string;
  public companyNames: string[] = [];
  public tickerconsumo: string[] = [];
  public filteredData: ListaConsultaConsumo[] = [];
  public selectedCompanyName: string;
  public chartOptions: EChartsOption;
  public myChart: echarts.ECharts;
  public fechasconsumo:number[]=[];
  public selectedFechas:number[]=[];
  public selectedunderlying:string[]=[];
  chartInstances: EChartsOption[] = []; 
  selectedCards: ListaConsultaConsumo[] = [];
  lineChartData: ChartDataSets[][] = [];
  lineChartOptions: ChartOptions = {
      responsive: true,
      scales: {
          xAxes: [{ type: 'linear', position: 'bottom', scaleLabel: { display: true, labelString: 'Month Contract' } }],
          yAxes: [{ scaleLabel: { display: true, labelString: 'Metric Tons' } }]
      }
  };

  constructor(private consultaconsumoservice:CargabasetrigoService ) {  
    this.treeControl = new NestedTreeControl<YearNode>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource<YearNode>();
}

  ngOnInit(): void {
    this.CargarTickerYFechas()    
  }

  public CargarTickerYFechas(){

    this.consultaconsumoservice.obtenerfechaconsumo().subscribe(
      (respuesta:number[])=>{this.fechasconsumo=respuesta;console.log(this.fechasconsumo); this.Consultar_Consumo(this.fechasconsumo)
        ;this.convertirfechasCosnumo()
       }
    )
    this.consultaconsumoservice.obtenerTickerConsumo().subscribe(
      (respuesta:string[])=>{this.tickerconsumo=respuesta}
    )
  }
  trackByFn(index: number, item: any): any {
    return item?.id || index; // Usa una clave única (como un ID) o el índice como fallback
  }
  
  public convertirfechasCosnumo(){
    const yearMonthMap = new Map<number, Set<string>>(); 
    this.fechasconsumo.forEach(date => { 
      const year =parseInt(String(date).substring(0, 4))
      const month = String(date).substring(4, 6)
      if (!yearMonthMap.has(year)) { yearMonthMap.set(year, new Set()); } 
      yearMonthMap.get(year)?.add(month); })

      const treeData: YearNode[] = Array.from(yearMonthMap.entries()).map(([year, months]) => (
        { name: String(year),children: crearmeses(months) }))
    this.dataSource.data = treeData;
    this.initializeParentMap(treeData);
  }

  public setDateInicio(date:string) {
    var pDia:string
    var pMes:string
    var pAnho:string
    var posicion:number
    var posicion2:number
    this.dtpFecIni = date;
  
    posicion=date.indexOf("/",1)
    posicion2=date.indexOf( "/",posicion+1)
  
    pMes=date.substring(0,posicion)
    pDia=date.substring(posicion+1, posicion2)
    pAnho=date.substring(posicion2+1)
  
    if(Number(pDia)<10 && Number(pMes)<10){
      this.pFechaInicio= `${pAnho}0${pMes}0${pDia}`.toString(); 
    }else if (Number(pDia)<10 ){
      this.pFechaInicio= `${pAnho}${pMes}0${pDia}`.toString(); 
    }else if (Number(pMes)<10){
      this.pFechaInicio= `${pAnho}0${pMes}${pDia}`.toString(); 
    }else{
      this.pFechaInicio= `${pAnho}${pMes}${pDia}`.toString();
    }
    if(typeof this.dtpFecFin == 'undefined'  || this.dtpFecFin==='' || this.pFechaInicio > this.pFechaFin){
      this.dtpFecFin = this.dtpFecFin;
    }        
  } 
  ChangeSelectedCards(): void {      
    const selectedTickers = this.tickerconsumo.filter(ticker => this.selectedunderlying.includes(ticker));
      this.filteredData= this.consulCons.filter(item =>this.selectedMonths.includes(item.t089_UpdateDate.toString()) && selectedTickers.includes(item.t068_Ticker));
      this.updateChartOptions(selectedTickers);
  }
  isAllSelected(): boolean {
    return this.selectedunderlying.length === this.tickerconsumo.length;
  }
  
  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedunderlying = [...this.tickerconsumo];
    } else {
      this.selectedunderlying = [];
    }
    this.ChangeSelectedCards();
  }
  

  keepMenuOpen(event: any, menuTrigger: any): void {
    if (!event) {
      // Reabre el menú si el evento de cierre no fue causado por clic fuera del menú
      menuTrigger.openMenu();
    }
  }

onCheckboxChange(event: any, option: string): void {
    if (event.checked) {
      this.selectedunderlying.push(option);
    } else {
      this.selectedunderlying = this.selectedunderlying.filter(item => item !== option);
    }
    this.ChangeSelectedCards(); // Actualiza el filtrado y el gráfico
  }


  updateChartOptions(selectedTickers: string[]): void {
    this.chartInstances = [];
  
    selectedTickers.forEach(ticker => {
      const tickerData = this.filteredData.filter(item => item.t068_Ticker === ticker);
      const ejeX = [...new Set(this.filteredData.map(item => item.t089_MonthContract))].sort();
  
      const series: SeriesOption[] = this.selectedMonths.map(fecha => {
        const dataForFecha = tickerData.filter(item => item.t089_UpdateDate.toString() === fecha).map(
          item => ({ name: item.t089_MonthContract, value: item.t089_MetricTons })
        );
  
        const alignedData = ejeX.map(x => {
          const point = dataForFecha.find(item => item.name === x);
          return point && point.value !== 0 ? Math.round(point.value) : null;
        });
        return {
          name: fecha.toString(),
          type: 'line',
          smooth: true,
          data: alignedData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          lineStyle: { width: 4 },
          showSymbol: false,
          symbolSize: 8
        } as SeriesOption; // Casting explícito como SeriesOption
      });
  
      const chartOption: EChartsOption = {
        title: { text: ticker, padding: [2, 2, 2, 2],textStyle: {fontSize: 13, color: '#333'} ,top: '0%'},
        tooltip: { trigger: 'axis' },
        legend: { data: this.selectedMonths.map(fecha => fecha.toString()), align: 'left' ,top: '8%'},
        xAxis: { type: 'category', data: ejeX},
        yAxis: { type: 'value', name: 'TM' },
        grid: { top: '22%', bottom: '10%', left: '12%', right: '5%' },
        dataZoom: [{type: 'inside',throttle: 20}],
        toolbox: { feature: { saveAsImage: {} ,restore:{}} },
        series: series
      };
  
      this.chartInstances.push(chartOption);
    });
  }
  

  public Consultar_Consumo(fechareporte:number[]):void{

    this.consultaconsumoservice.obtenerconsultaConsumo(fechareporte).subscribe(
      (response:ListaConsultaConsumo[])=>{this.consulCons=response,console.log(this.consulCons)
       }
    )
  }
 //PARA DATEPICKER ARTIFICIAL
// Control y dataSource para el árbol
treeControl: NestedTreeControl<YearNode>;
dataSource: MatTreeNestedDataSource<YearNode>;
parentMap = new Map<YearNode, YearNode>();

selectedMonths: string[] = [];
initializeParentMap(nodes: YearNode[], parent: YearNode | null = null): void {
  nodes.forEach(node => {
    if (parent) this.parentMap.set(node, parent);
    if (node.children) this.initializeParentMap(node.children, node);
  })
}
getParent(node: YearNode): YearNode | null {
  return this.parentMap.get(node) || null;
}
onMonthSelected(node: YearNode): void {
  const parentYearNode = this.getParent(node);
  if (!parentYearNode) return;

  const year = parentYearNode.name; // Año del nodo padre
  const monthNumber = this.getMonthNumber(node.name); // Número del mes (01-12)
  const yearMonth = `${year}${monthNumber}`;

  const index = this.selectedMonths.indexOf(yearMonth);

  // Agregar o quitar el mes de la lista seleccionada
  if (index === -1) {this.selectedMonths.push(yearMonth)} else {this.selectedMonths.splice(index, 1)}  
  console.log('Meses seleccionados:', this.selectedMonths);

  this.ChangeSelectedCards()
}

// Convertir nombre del mes a número
getMonthNumber(monthName: string): string {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const index = months.indexOf(monthName);
  return index >= 0 ? (index + 1).toString().padStart(2, '0') : '';
}

// Determinar si un nodo es padre
isExpandable = (node: YearNode): boolean => !!node.children && node.children.length > 0;

hasChild = (_: number, node: YearNode): boolean => this.isExpandable(node);

}
function crearmeses(months: Set<string>): YearNode[] { 
  const monthNames: { [key: string]: string } = { 
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun', 
    '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic' }; 
    return Array.from(months)
    .sort((a, b) => parseInt(a) - parseInt(b)) // Ordenar numéricamente
    .map(month => ({ 
      name: monthNames[month] || month, // Asignar nombre del mes o el valor original si no está en el objeto
      level: 1 
    }));
 }
