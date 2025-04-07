import { AfterViewInit, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import * as echarts from 'echarts';
import { ListaStickPrice } from 'src/app/models/Bases/stickprice';

@Component({
  selector: 'app-candle-stick-price',
  templateUrl: './candle-stick-price.component.html',
  styleUrls: ['./candle-stick-price.component.scss']
})
export class CandleStickPriceComponent implements AfterViewInit {


  public pFechaInicio:string="";
  public pFechaInicio_1:string="";
  public pFechaInicio_2:string="";
  public pFechaFin:string="";
  public dtpFecIni:string="";
  public dtpFecIni_1:string="";
  public dtpFecIni_2:string="";
  public dtpFecFin:string="";
  public consulPreciosVDS:MatTableDataSource<ListaStickPrice>
  public consulPreciosV: ListaStickPrice[]=[];
  public GrafPreciosVDS:MatTableDataSource<ListaStickPrice>
  public GrafPreciosV: ListaStickPrice[]=[];
  public MateriaPrima: string[]=[];
  public Tickerscombo: string[]=[];
  public filteredData: ListaStickPrice[]=[];
  public filteredTickerData: ListaStickPrice[]=[];
  public myChart: echarts.ECharts;
  public myChart_caja: echarts.ECharts;

  public date:NgbDateStruct;
  public fecha:string;
  public selectedMateriaPrima: string;
  
  columnaListainv: string[] = ['fecha','materiaprima','mercado','ticker','settle','closeprice','openprice','lowprice','highprice','volume'];
  Tickerunico: string;

  constructor(private preciosvariablesService:CargabasetrigoService,
              private grafpreciosVservice:CargabasetrigoService) { }
  ngAfterViewInit(): void {
    this.initChart(); this.initChart_Caja()
  }

  ngOnInit(): void {this.fecha=this.getformattedDate().toString().substring(6,8)+'/'+this.getformattedDate().toString().substring(4,6)
  +'/'+this.getformattedDate().toString().substring(0,4);this.Obtener_data_graf();
  }

  public setDateInicio_1(date:string) {
    var pDia:string
    var pMes:string
    var pAnho:string
    var posicion:number
    var posicion2:number
    
    this.dtpFecIni_1 = date;
  
    posicion=date.indexOf("/",1)
    posicion2=date.indexOf( "/",posicion+1)
  
    pMes=date.substring(0,posicion)
    pDia=date.substring(posicion+1, posicion2)
    pAnho=date.substring(posicion2+1)
  
    if(Number(pDia)<10 && Number(pMes)<10){
      this.pFechaInicio_1= `${pAnho}0${pMes}0${pDia}`.toString(); 
    }else if (Number(pDia)<10 ){
      this.pFechaInicio_1= `${pAnho}${pMes}0${pDia}`.toString(); 
    }else if (Number(pMes)<10){
      this.pFechaInicio_1= `${pAnho}0${pMes}${pDia}`.toString(); 
    }else{
      this.pFechaInicio_1= `${pAnho}${pMes}${pDia}`.toString();
    }
    if(typeof this.dtpFecFin == 'undefined'  || this.dtpFecFin==='' || this.pFechaInicio_1 > this.pFechaFin){
      this.dtpFecFin = this.dtpFecFin;
    }    
    
  }  
  public setDateInicio_2(date:string) {
    var pDia:string
    var pMes:string
    var pAnho:string
    var posicion:number
    var posicion2:number
    
    this.dtpFecIni_2 = date;
  
    posicion=date.indexOf("/",1)
    posicion2=date.indexOf( "/",posicion+1)
  
    pMes=date.substring(0,posicion)
    pDia=date.substring(posicion+1, posicion2)
    pAnho=date.substring(posicion2+1)
  
    if(Number(pDia)<10 && Number(pMes)<10){
      this.pFechaInicio_2= `${pAnho}0${pMes}0${pDia}`.toString(); 
    }else if (Number(pDia)<10 ){
      this.pFechaInicio_2= `${pAnho}${pMes}0${pDia}`.toString(); 
    }else if (Number(pMes)<10){
      this.pFechaInicio_2= `${pAnho}0${pMes}${pDia}`.toString(); 
    }else{
      this.pFechaInicio_2= `${pAnho}${pMes}${pDia}`.toString();
    }
    if(typeof this.dtpFecFin == 'undefined'  || this.dtpFecFin==='' || this.pFechaInicio_2 > this.pFechaFin){
      this.dtpFecFin = this.dtpFecFin;
    }    
    
  }

public Consultar():void{
    this.Consultar_PreciosV(parseInt(this.pFechaInicio_1),parseInt(this.pFechaInicio_2));
    }
    obtenerOpcionesMprima:string[]=[];
    obtenerOpcionesMercado:string[]=[];
public Consultar_PreciosV(fechareporte_1:number,fechareporte_2):void{
    this.preciosvariablesService.obtenerPreciosVariables(fechareporte_1,fechareporte_2).subscribe(
      (response:ListaStickPrice[])=>{this.consulPreciosV=response;
        this.consulPreciosVDS=new MatTableDataSource(this.consulPreciosV);
      this.obtenerOpcionesMprima=[...new Set(this.consulPreciosV.map(item=>item.materiaprima))];
      this.obtenerOpcionesMercado=[...new Set(this.consulPreciosV.map(item=>item.mercado))] })}

public Obtener_data_graf():void{
    this.grafpreciosVservice.grafPreciosVariables().subscribe(
      (response:ListaStickPrice[])=>{this.GrafPreciosV=response,
        this.GrafPreciosVDS=new MatTableDataSource(this.GrafPreciosV);
        this.MateriaPrima=[...new Set(this.GrafPreciosV.map(d=>d.materiaprima))];
        this.filteredData=this.GrafPreciosV;this.Actualizar_graf_Prices();this.selectedMateriaPrima = 'Maíz',
        this.MPChange(this.selectedMateriaPrima),this.Actualizar_graf_Caja() })}

public MPChange(Mprima: string): void {
    this.filteredData = this.GrafPreciosV.filter(d => d.materiaprima === Mprima);
    this.Tickerscombo = [...new Set(this.filteredData.map(d => d.ticker))];this.Actualizar_graf_Prices()}

public tickerChange(Ticker:String): void {
    this.filteredTickerData = this.GrafPreciosV.filter(d => d.ticker === Ticker);this.Actualizar_graf_Caja()}

private initChart(): void {
  const chartDom = document.getElementById('main_CandleStickPrice');
    if (chartDom) {this.myChart = echarts.init(chartDom);} else {console.error('El contenedor del gráfico no se ha encontrado'); }
  }
public Actualizar_graf_Prices():void{

if (this.myChart){
  this.myChart.clear();
  this.filteredData.sort((a, b) => a.fecha - b.fecha);
  const mesesprecios=[...new Set(this.filteredData.map(d=>this.formatDate(d.fecha.toString())))];
  const tickers=[...new Set(this.filteredData.map(d=>d.ticker))];

  const series: echarts.LineSeriesOption[] = tickers.map(ticker => {
  return {name: ticker,
          type: 'line',
          smooth: true,
          emphasis: { focus: 'series' },
          showSymbol: false,
          data: mesesprecios.map(month => {
          const record = this.filteredData.find(d => d.ticker === ticker && this.formatDate(d.fecha.toString()) === month);
          return record ? Math.round(record.settle) : null;}) as echarts.LineSeriesOption['data']};});

  type EChartsOption = echarts.EChartsOption;
  var option: EChartsOption;
  
  option = {
         title: {text: 'SettlePrice',left:'center'},
         tooltip: {trigger: 'axis'},
         legend: {data: tickers,orient:'vertical',left:'right',top:'center',right: '5%',},
         grid: {left: '3%',right: '22%',bottom: '13%',containLabel: true},
         toolbox: {feature: {dataZoom: {yAxisIndex: 'none'},saveAsImage: {title: 'Descargar Gráfico'}},left:'3%',top: 'top'},
         xAxis: {type: 'category',data: mesesprecios,boundaryGap: false},
         yAxis: { type: 'value', axisLabel: { margin: 30, fontSize: 14, formatter: '{value}' }, scale: true },
         dataZoom: [{type: 'inside',start: 90,end: 100},{start: 90,end: 100}],
         series: series};
  this.myChart.setOption(option);
  window.addEventListener('resize', () => { this.myChart.resize();});
}
}

private initChart_Caja(): void {
  const chartDom = document.getElementById('main_StickPriceCaja');
    if (chartDom) {this.myChart_caja = echarts.init(chartDom);}else {console.error('El contenedor del gráfico no se ha encontrado');}
    }

public Actualizar_graf_Caja(): void {
  if (this.myChart_caja) {
    this.myChart_caja.clear();
    this.filteredTickerData.sort((a, b) => a.fecha - b.fecha);

    const mesesinventario = [...new Set(this.filteredTickerData.map(d => this.formatDate(d.fecha.toString())))];
    const volumen = this.filteredTickerData.map(item => item.volume);
    const series = this.filteredTickerData.map(item => [item.openprice, item.closeprice, item.lowprice, item.highprice]);

    if (this.filteredTickerData[0] !== undefined) {
      this.Tickerunico = this.filteredTickerData[0].ticker;
    }

    type EChartsOption = echarts.EChartsOption;
    var option: EChartsOption;

  option = {
    title: { text: this.Tickerunico, left: 'center' },
    tooltip: {trigger: 'axis',axisPointer: { type: 'cross' },borderWidth: 1,borderColor: '#ccc',padding: 10,textStyle: { color: '#000' },
        position: function (pos, params, el, elRect, size) {
          const obj: Record<string, number> = {top: 10};obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;}},
    legend: { orient: 'vertical', left: 'right', top: 'center', right: '10%' },
    brush: {xAxisIndex: 'all',brushLink: 'all',outOfBrush: {colorAlpha: 0.1}},
    grid: [{left: '10%',right: '18%',height: '50%',borderColor: '#7f7f7f'},
          {left: '10%',right: '18%',top: '63%',height: '16%',borderColor: '#7f7f7f'}],
    axisPointer: {link: [{xAxisIndex: 'all'}],label: {backgroundColor: '#777'}},
    toolbox: { feature: { dataZoom: { yAxisIndex: 'none' }, saveAsImage: { title: 'Descargar Gráfico' } }, left: '3%', top: 'top' },
    xAxis: [
        {type: 'category',data: mesesinventario,boundaryGap: false,axisLine: { onZero: false },splitLine: { show: false },min: 'dataMin',max: 'dataMax',axisPointer: {z: 100}},
        {type: 'category',gridIndex: 1,data: mesesinventario,boundaryGap: false,axisLine: { onZero: false },axisTick: { show: false },splitLine: { show: false },axisLabel: { show: false },min: 'dataMin', max: 'dataMax'}
      ],
    yAxis: [
        {type: 'value', axisLabel: { margin: 32, fontSize: 14, formatter: '{value}' },scale: true,splitArea: {show: true}},
        {scale: true,gridIndex: 1,splitNumber: 2,axisLabel: { show: false },axisLine: { show: false },axisTick: { show: false },splitLine: { show: false }}
      ],
    dataZoom: [
        { type: 'inside', xAxisIndex: [0, 1], start: 50, end: 100 },
        { show: true, xAxisIndex: [0, 1], type: 'slider', top: '90%', start: 50, end: 100 }
      ],
    series: [
      {name: this.Tickerunico,type: 'candlestick',data: series,itemStyle: {color: '#fe004e',color0: '#6495ed',borderColor: '#8A0000',borderColor0: '#1121ed'}},
      {name: 'Volume',type: 'bar',xAxisIndex: 1,yAxisIndex: 1,data: volumen,itemStyle: {
          color: function (params) {return series[params.dataIndex][1] > series[params.dataIndex][0] ? '#fe004e' : '#6495ed';},
          }}]}

  this.myChart_caja.setOption(option);
  window.addEventListener('resize', () => { this.myChart_caja.resize();});
  }
}

  formatNumber(num: number): string {
    // Redondear a 2 decimales y agregar coma de miles
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  setExportFileName(exporter): void {
    exporter.exportTable('xlsx', { fileName: `CandleStickPrice_${this.pFechaInicio_1}_${this.pFechaInicio_2}` });
  }

formatDate(dateStr: string): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const year = dateStr.substring(2, 4);
    const month = months[parseInt(dateStr.substring(4, 6), 10) - 1];
    const day = dateStr.substring(6, 8);
    
    return `${day}-${month}-${year}`;
  }

  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));}

  public dateToString = ((date) => {
      if(date.day<10 && date.month<10){
        return `${date.year}0${date.month}0${date.day}`.toString();
      }else if (date.day<10 ){
        return `${date.year}${date.month}0${date.day}`.toString();
      }else if (date.month<10){
        return `${date.year}0${date.month}${date.day}`.toString();
      }else{
        return `${date.year}${date.month}${date.day}`.toString();
      }
    })
  
    filtroMP:string='';
    public filtroMPrima(valoresSeleccionados: string[]) {
      this.filtroMP = valoresSeleccionados.map(value => value.trim().toLowerCase()).join(',');
      this.filtarseleccion();
    }
    filtroMk:string='';
  public filtroMarket(valoresSeleccionados: string[]) {
      this.filtroMk = valoresSeleccionados.map(value => value.trim().toLowerCase()).join(',');
      this.filtarseleccion();
    }

    public filtarseleccion() {
      // Aplicar filtros secuenciales
      this.consulPreciosVDS.filterPredicate = this.customFilterPredicate();
      console.log(this.consulPreciosVDS.filterPredicate);
       const filters = {
        materiaprima: this.filtroMP,
        mercado: this.filtroMk,
        
       };
       console.log(filters);
       this.consulPreciosVDS.filter = JSON.stringify(filters);
   }

   public  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string) => {
      const filters = JSON.parse(filter);
      let match = true;
  
      for (const key in filters) {
        if (filters[key]) {
          const filterValues = filters[key].split(',').map(value => value.trim().toLowerCase());
          const dataValue = data[key]?.toLowerCase();
          if (!filterValues.includes(dataValue)) {
            match = false;
            break;
          }
        }
      }
      return match;
    };
  
    return myFilterPredicate;
  }
  selectedMprimas: string[] = []; 
  toggleSelection_MP(option: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedMprimas.push(option);
    } else {
      const index = this.selectedMprimas.indexOf(option);
      if (index > -1) {
        this.selectedMprimas.splice(index, 1);
      }
    }
   this.filtroMPrima(this.selectedMprimas);
  }
  selectedMercado: string[] = []; 
  toggleSelection_Mercado(option: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedMercado.push(option);
    } else {
      const index = this.selectedMercado.indexOf(option);
      if (index > -1) {
        this.selectedMercado.splice(index, 1);
      }
    }
    this.filtroMarket(this.selectedMercado);
  }


}
