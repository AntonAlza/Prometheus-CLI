import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { number } from 'echarts';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { ListaConsultaInv } from 'src/app/models/Bases/consultainventario';
import { ListaDataGraf } from 'src/app/models/Bases/data_graf_Stock';
import * as echarts from 'echarts';

import * as XLSX from 'xlsx';
import { ListaDataGrafdiario } from 'src/app/models/Bases/data_graf_stock_diario';

@Component({
  selector: 'app-consulinventario',
  templateUrl: './consulinventario.component.html',
  styleUrls: ['./consulinventario.component.scss']
})
export class ConsulinventarioComponent implements AfterViewInit {

  public consulInvDS:MatTableDataSource<ListaConsultaInv>
  public consulInv: ListaConsultaInv[]=[];
  public pFechaInicio:string="";
  public pFechaInicio_1:string="";
  public pFechaInicio_2:string="";
  public pFechaFin:string="";
  public dtpFecIni:string="";
  public dtpFecIni_1:string="";
  public dtpFecIni_2:string="";
  
  public dtpFecFin:string="";
  @ViewChild(MatSort) misort: MatSort;
  public consulgrafInvDS:MatTableDataSource<ListaDataGraf>
  public consulgrafInv: ListaDataGraf[]=[];
  public mifecha=[];
  public myChart: echarts.ECharts;
  public consulInvdiarioDS:MatTableDataSource<ListaDataGrafdiario>
  public consulInvdiario: ListaDataGrafdiario[]=[];
  public selectedCells: Set<string> = new Set<string>();
public isSelecting: boolean = false;
public totalSum: number = 0;
public totalCount: number = 0;
  
  constructor(private consultainventarioservice:CargabasetrigoService,
              private obtenerdatagrafInv:CargabasetrigoService,
            private obtenerdatagrafInvdiarioservice:CargabasetrigoService) { }
  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnInit(): void {this.Obtener_data_graf();
  }
  columnaListainv: string[] = ['s348_Date','s348_Underlying','s348_Ticker','s348_ToneladasMetricas'];

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
    this.Consultar_Inv(parseInt(this.pFechaInicio_1),parseInt(this.pFechaInicio_2));
    this.Consultar_Inv_diario(parseInt(this.pFechaInicio_1),parseInt(this.pFechaInicio_2));
    this.Obtener_data_graf()
    
  }

  public Consultar_Inv(fechareporte_1:number,fechareporte_2):void{
    this.consultainventarioservice.obtenerconsultaInventario(fechareporte_1,fechareporte_2).subscribe(
      (response:ListaConsultaInv[])=>{this.consulInv=response,this.consulInvDS=new MatTableDataSource(this.consulInv)}
    )
  }
  public Obtener_data_graf():void{
    this.obtenerdatagrafInv.obtener_data_graf_inv().subscribe(
      (response:ListaDataGraf[])=>{this.consulgrafInv=response,
        this.consulgrafInvDS=new MatTableDataSource(this.consulgrafInv),this.Actualizar_graf_Inv()}
    )
  }

  public Consultar_Inv_diario(fechareporte_1:number,fechareporte_2:number):void{
    this.obtenerdatagrafInvdiarioservice.obtenerconsultaInventariodiario(fechareporte_1,fechareporte_2).subscribe(
      (response:ListaDataGrafdiario[])=>{this.consulInvdiario=response,
        this.consulInvdiarioDS=new MatTableDataSource(this.consulInvdiario)}
    )
  }
  public exportToExcel(): void {
    // Convierte el data source en un worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.consulInvdiario);

    // Crea un nuevo workbook y añade el worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Data': worksheet },
      SheetNames: ['Data']
    };

    // Convierte el workbook a un archivo Excel
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    // Guarda el archivo Excel
    this.saveAsExcelFile(excelBuffer, `Inventario diario ${this.pFechaInicio_1}_${this.pFechaInicio_2}`);
  }
  public saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(data);

    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.click();

    // Libera el objeto URL
    window.URL.revokeObjectURL(url);
  }

public Actualizar_graf_Inv():void{
  if (this.myChart){
   this.myChart.clear();
   const mesesinventario=[...new Set(this.consulgrafInv.map(d=>this.formatDate(d.x348_Date.toString())))];
   const tickers=[...new Set(this.consulgrafInv.map(d=>d.x348_Ticker))];

   const colors = [
'#ff0000', 
'#00bb2d', 
'#6f00fe', 
'#2b31d4', 
'#ea9a90', 
'#f0c100',  
'#2a6f3d',
'#273b63',
'#bf7b19', 
'#A441f7',
'#191919', 
'#42f1f5',
'#9d2929', 
'#908e00',
'#ea9a90', 

  ];

   const series: echarts.LineSeriesOption[] = tickers.map((ticker, index) => {
     return {
          name: ticker,
          type: 'line',
          smooth: true,
          emphasis: { focus: 'series' },
          showSymbol: false,
          data: mesesinventario.map(month => {
                const record = this.consulgrafInv.find(d => d.x348_Ticker === ticker && this.formatDate(d.x348_Date.toString()) === month);
                return record ? Math.round(record.x348_ToneladasMetricas) : null;
          }) as echarts.LineSeriesOption['data'] ,
          lineStyle: {color: colors[index],width:3}          ,
          itemStyle: {color: colors[index]}
            };
    });

     type EChartsOption = echarts.EChartsOption;
     var chartDom = document.getElementById('main_inventario')!;
     var myChart = echarts.init(chartDom);
     var option: EChartsOption;
  
     option = {
         title: {text: 'Inventario TM',left:'center'},
         tooltip: {trigger: 'axis'},
         legend: {data: tickers,orient:'vertical',left:'right',top:'center',right: '5%',},
         grid: {left: '3%',right: '20%',bottom: '13%',containLabel: true},
         toolbox: {feature: {dataZoom: {yAxisIndex: 'none'},
        //  restore: {},
         saveAsImage: {title: 'Descargar Gráfico'}},left:'3%',top: 'top'},
         xAxis: {type: 'category',data: mesesinventario,boundaryGap: false},
         yAxis: {type: 'value',axisLabel: {margin: 30,fontSize: 14,formatter: '{value}'},},
         dataZoom: [{type: 'inside',start: 90,end: 100},{start: 90,end: 100}],
         series: series};

         this.myChart.setOption(option);
}
}
 
 formatNumber(num: number): string {
    // Redondear a 2 decimales y agregar coma de miles
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  setExportFileName(exporter): void {
    exporter.exportTable('xlsx', { fileName: `Inventario_${this.pFechaInicio_1}_${this.pFechaInicio_2}` });
  }

formatDate(dateStr: string): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const year = dateStr.substring(2, 4);
    const month = months[parseInt(dateStr.substring(4, 6), 10) - 1];
    const day = dateStr.substring(6, 8);
    
    return `${day}-${month}-${year}`;
  }

  private initChart(): void {
    const chartDom = document.getElementById('main_inventario');
    if (chartDom) {
      this.myChart = echarts.init(chartDom);
    } else {
      console.error('El contenedor del gráfico no se ha encontrado');
    }
  }

  startSelection(element: ListaConsultaInv, column: string) {
    this.isSelecting = true;
    this.selectedCells.clear(); // Limpiar selección previa
    this.totalSum = 0; // Reiniciar suma
    this.totalCount = 0; // Reiniciar conteo
    this.addCellToSelection(element, column);
    this.calculateSumAndCount(); // Calcular la suma para la primera celda seleccionada
  }
  
  updateSelection(element: ListaConsultaInv, column: string) {
    if (this.isSelecting) {
      this.addCellToSelection(element, column);
      this.calculateSumAndCount(); // Actualizar la suma a medida que se seleccionan celdas
    }
  }
  
  endSelection() {
    this.isSelecting = false;
    // No es necesario volver a calcular aquí ya que se hace en tiempo real
  }
  
  addCellToSelection(element: ListaConsultaInv, column: string) {
    const cellId = this.getCellId(element, column);
    if (!this.selectedCells.has(cellId)) {
      this.selectedCells.add(cellId);
    }
  }
  
  getCellId(element: ListaConsultaInv, column: string): string {
    return `${this.consulInv.indexOf(element)}-${column}`;
  }
  
  isSelected(element: ListaConsultaInv, column: string): boolean {
    return this.selectedCells.has(this.getCellId(element, column));
  }
  
  calculateSumAndCount() {
    this.totalSum = 0;
    this.totalCount = 0;
    this.selectedCells.forEach(cellId => {
      const [rowIndex, column] = cellId.split('-');
      const element = this.consulInv[+rowIndex];
      this.totalSum += element[column];
      this.totalCount++;
    });
  }
}
