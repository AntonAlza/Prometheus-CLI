import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CargabasetrigoService } from 'src/app/models/Bases/cargabasetrigo.service';
import { LoadingService } from '../../loading.service';
import * as echarts from 'echarts';
import { objdeltahedgePDF } from 'src/app/models/Bases/deltahedgepdf';
export type ObjDeltaHedgeSinComoditieYFecha = Omit<objdeltahedge, 'comoditie' | 'fechareporte'>;
export type ObjDeltaHedgeLineaSinComoditieYFecha = Omit<objdeltahedgelinea, 'comoditie' | 'fechareporte'>;
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { objdeltahedge } from 'src/app/models/Bases/deltahedge';
import { objdeltahedgelinea } from 'src/app/models/Bases/deltahedgelinea';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// (window as any).pdfMake = pdfMake;
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-deltahedge',
  templateUrl: './deltahedge.component.html',
  styleUrls: ['./deltahedge.component.scss']
})
export class DeltahedgeComponent implements OnInit {
public pFechaInicio:string="";
public pFechaFin:string="";
public dtpFecIni:string="";
public dtpFecFin:string="";
public ListaBarras:objdeltahedge[]=[]
public ListaLineas:objdeltahedgelinea[]=[]
public ListaAceiteSoya:ObjDeltaHedgeSinComoditieYFecha[]=[]
public ListaAceiteSoyaLinea:ObjDeltaHedgeLineaSinComoditieYFecha[]=[]
public ListaHarinaSoya:ObjDeltaHedgeSinComoditieYFecha[]=[]
public ListaHarinaSoyaLinea:ObjDeltaHedgeLineaSinComoditieYFecha[]=[]
public ListaTrigocorrector:ObjDeltaHedgeSinComoditieYFecha[]=[ ]
public ListaTrigocorrectorLinea:ObjDeltaHedgeLineaSinComoditieYFecha[]=[]
public ListaTrigoEconomico:ObjDeltaHedgeSinComoditieYFecha[]=[]
public ListaTrigoEconomicoLinea:ObjDeltaHedgeLineaSinComoditieYFecha[]=[]
public ListaTrigoSuave:ObjDeltaHedgeSinComoditieYFecha[]=[]
public ListaTrigoSuaveLinea:ObjDeltaHedgeLineaSinComoditieYFecha[]=[] 
public ListaAceitePalma:ObjDeltaHedgeSinComoditieYFecha[]=[]
public ListaAceitePalmaLinea:ObjDeltaHedgeLineaSinComoditieYFecha[]=[]
public ListaDeltahedgePDF:objdeltahedgePDF[]=[]
loading$= this.loader.loading$
charts: any[] = [];
globalMax: number = 0; // Máximo absoluto basado en la primera columna
globalMin: number = 0;

  constructor( private serviciocargadelta:CargabasetrigoService,
               private loader:LoadingService ) { }

  ngOnInit(): void {
  }


  reportedeltahedge(){
    console.log(this.pFechaInicio)
    if (this.ListaBarras?.length && this.ListaLineas?.length) {
      this.clearAllCharts(); // Limpia los gráficos antes de cargar nuevos
  }
    this.serviciocargadelta.obtenerdeltahedgebarras(parseInt(this.pFechaInicio)).subscribe(
      (response: objdeltahedge[]) => {
          this.ListaBarras = response;
          this.ListaAceiteSoya = this.ListaBarras.filter(item => item.comoditie === '5').map(({ comoditie, fechareporte, ...resto }) => resto);
          this.ListaHarinaSoya = this.ListaBarras.filter(item => item.comoditie === '4').map(({ comoditie, fechareporte, ...resto }) => resto);
          this.ListaTrigocorrector = this.ListaBarras.filter(item => item.comoditie === '63').map(({ comoditie, fechareporte, ...resto }) => resto);
          this.ListaTrigoEconomico = this.ListaBarras.filter(item => item.comoditie === '62').map(({ comoditie, fechareporte, ...resto }) => resto);
          this.ListaTrigoSuave = this.ListaBarras.filter(item => item.comoditie === '61').map(({ comoditie, fechareporte, ...resto }) => resto);
          this.ListaAceitePalma = this.ListaBarras.filter(item => item.comoditie === '7').map(({ comoditie, fechareporte, ...resto }) => resto);
          this.serviciocargadelta.obtenerdeltahedgelineas(parseInt(this.pFechaInicio)).subscribe(
              (response: objdeltahedgelinea[]) => {
                  this.ListaLineas = response;
                  this.ListaAceiteSoyaLinea = this.ListaLineas.filter(item => item.comoditie === '5').map(({ comoditie, fechareporte, ...resto }) => resto);
                  this.ListaHarinaSoyaLinea = this.ListaLineas.filter(item => item.comoditie === '4').map(({ comoditie, fechareporte, ...resto }) => resto);
                  this.ListaTrigocorrectorLinea = this.ListaLineas.filter(item => item.comoditie === '63').map(({ comoditie, fechareporte, ...resto }) => resto);
                  this.ListaTrigoEconomicoLinea = this.ListaLineas.filter(item => item.comoditie === '62').map(({ comoditie, fechareporte, ...resto }) => resto);
                  this.ListaTrigoSuaveLinea = this.ListaLineas.filter(item => item.comoditie === '61').map(({ comoditie, fechareporte, ...resto }) => resto);
                  this.ListaAceitePalmaLinea = this.ListaLineas.filter(item => item.comoditie === '7').map(({ comoditie, fechareporte, ...resto }) => resto);
                  this.AceiteSoyaChart();this.HarinaSoyaChart();this.TrigoCorrectorChart(),this.TrigoEconomicoChart();this.TrigoSuaveChart();this.AceitePalmaChart();this.obteniendodatapdf()
              }
          );
      }
  );
  


  }
  public myChart: echarts.ECharts;
  public myChart_Harina: echarts.ECharts;

  public AceiteSoyaChart(){
    //########PARA ACEITE DE SOYA##############
    const ListaAceiteSoyaPositivo = this.ListaAceiteSoya.map(obj => {
      const newObj: any = { ...obj };
      for (const key in newObj) {
          if (typeof newObj[key] === 'number') {newObj[key] = Math.abs(newObj[key]);
          }
      }
      return newObj;
  });
    const ListastackaSoya=this.ListaAceiteSoya.map(item=>({
      Periodo:item.periodo,
      Necesidad:0,
      Fisico:item.tm_NECESIDAD+item.tm_FISICO,
      Pricing:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING,
      HedgePL:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl,
      HedgePC:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl+item.hedgepc,
      PosicionDelta:0
    }))
    const AceiteSoyaoriginal_0:number[]=Object.values(this.ListaAceiteSoya[0]).filter((value): value is number => typeof value === 'number')
    //GRAFICO CASCADA
// CASCADA NUMERO 1
    const chartIdBarraSoya_0=`main_${this.ListaAceiteSoya[0].periodo}_AceiteSoya`
    this.initializeChart(chartIdBarraSoya_0, {
      tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params: any) {
              const index = params[1].dataIndex;
              const value = AceiteSoyaoriginal_0[index];
              let borderColor = '#cccccc';
              if (index === 0 || index === AceiteSoyaoriginal_0.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
              else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
              return `<div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                  <strong>${params[1].name}</strong><br/>
                  ${params[1].seriesName}: ${value.toFixed(2)}
                </div>`},
            padding: 0,
            backgroundColor: 'transparent', 
            textStyle: {color: '#333333' }},
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', splitLine: { show: false }, 
      data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
      yAxis: {name:this.ListaAceiteSoya[0].periodo, type: 'value' ,nameLocation: 'middle',
        nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
      series: [
        { type: 'bar',
          stack: 'Necesidad',
          itemStyle: {borderColor: 'transparent', color: 'transparent'  },
          emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
          data: Object.values(ListastackaSoya[0]).filter((value): value is number => typeof value === 'number')},
        { name:this.ListaAceiteSoya[0].periodo,
          type: 'bar',
          stack: 'Necesidad',
          label: {show: true, position: 'top', color:'black',
            formatter: function (params) {
              const originalValues = AceiteSoyaoriginal_0;
              return originalValues[params.dataIndex].toFixed(1).toString()}},
          itemStyle: {
            color: function (params) {
              const originalValues = AceiteSoyaoriginal_0;
              const index = params.dataIndex;
              const value = originalValues[index];      
              if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
              else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
            },
            borderWidth:2,
          },
          data: Object.values(ListaAceiteSoyaPositivo[0]).filter((value): value is number => typeof value === 'number')
        }
      ]
    })  
      
// CASCADA NUMERO 2
    const AceiteSoyaoriginal_1:number[]=Object.values(this.ListaAceiteSoya[1]).filter((value): value is number => typeof value === 'number')
    const chartIdBarraSoya_1=`main_${this.ListaAceiteSoya[1].periodo}_AceiteSoya`
    this.initializeChart(chartIdBarraSoya_1, {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params: any) {
          const index = params[1].dataIndex;
          const value = AceiteSoyaoriginal_1[index];
          let borderColor = '#cccccc';
          if (index === 0 || index === AceiteSoyaoriginal_1.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
          else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
          return `
            <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
              <strong>${params[1].name}</strong><br/>
              ${params[1].seriesName}: ${value.toFixed(2)}
            </div>
          `;
        },
        padding: 0,
        backgroundColor: 'transparent', 
        textStyle: {color: '#333333' }
      }
,      
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', splitLine: { show: false }, 
      data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
      yAxis: {name:this.ListaAceiteSoya[1].periodo, type: 'value' ,nameLocation: 'middle',
        nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
      series: [
        {
          type: 'bar',
          stack: 'Necesidad',
          itemStyle: {borderColor: 'transparent', color: 'transparent'  },
          emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
          data: Object.values(ListastackaSoya[1]).filter((value): value is number => typeof value === 'number')
        },
        { name:this.ListaAceiteSoya[1].periodo,
          type: 'bar',
          stack: 'Necesidad',
          label: {
            show: true,
            position: 'top',
            color:'black',
            formatter: function (params) {
              const originalValues = AceiteSoyaoriginal_1;
              return originalValues[params.dataIndex].toFixed(1).toString()}
          },
          itemStyle: {
            color: function (params) {
              const originalValues = AceiteSoyaoriginal_1;
              const index = params.dataIndex;
              const value = originalValues[index];
              if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
              else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
            },
            borderWidth:2,
          },
          data: Object.values(ListaAceiteSoyaPositivo[1]).filter((value): value is number => typeof value === 'number')
        }
      ]
    })
// CASCADA NUMERO 3
    if(this.ListaAceiteSoya &&this.ListaAceiteSoya[2] &&this.ListaAceiteSoya[2].periodo){
    const AceiteSoyaoriginal_2:number[]=Object.values(this.ListaAceiteSoya[2]).filter((value): value is number => typeof value === 'number')
    const chartIdBarraSoya_2=`main_${this.ListaAceiteSoya[2].periodo}_AceiteSoya`
    this.initializeChart(chartIdBarraSoya_2, {

      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params: any) {
          const index = params[1].dataIndex;
          const value = AceiteSoyaoriginal_2[index];
          let borderColor = '#cccccc';
          if (index === 0 || index === AceiteSoyaoriginal_2.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
          else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
          return `
            <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
              <strong>${params[1].name}</strong><br/>
              ${params[1].seriesName}: ${value.toFixed(2)}
            </div>
          `;
        },
        padding: 0,
        backgroundColor: 'transparent', 
        textStyle: {color: '#333333' }
      }
    ,      
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', splitLine: { show: false }, 
      data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
      yAxis: {name:this.ListaAceiteSoya[2].periodo, type: 'value' ,nameLocation: 'middle',
        nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
      series: [
        {
          type: 'bar',
          stack: 'Necesidad',
          itemStyle: {borderColor: 'transparent', color: 'transparent'  },
          emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
          data: Object.values(ListastackaSoya[2]).filter((value): value is number => typeof value === 'number')
        },
        { name:this.ListaAceiteSoya[2].periodo,
          type: 'bar',
          stack: 'Necesidad',
          label: {
            show: true,
            position: 'top',
            color:'black',
            formatter: function (params) {
              const originalValues = AceiteSoyaoriginal_2;
              return originalValues[params.dataIndex].toFixed(1).toString()}
          },
          itemStyle: {
            color: function (params) {
              const originalValues = AceiteSoyaoriginal_2;
              const index = params.dataIndex;
              const value = originalValues[index];
              if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
              else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
            },
            borderWidth:2,
          },
          data: Object.values(ListaAceiteSoyaPositivo[2]).filter((value): value is number => typeof value === 'number')
        }
      ]
    })
  }


//GRAFICO PARA LA LINEA
//#1 GRAFICO PARA LA LINEA
  const delta_0_aceite= this.ListaAceiteSoyaLinea[0].posicionDelta; 
  const minInterval_0_aceite = Math.min(this.ListaAceiteSoyaLinea[0].intervalominimo, delta_0_aceite); 
  const maxInterval_0_aceite = Math.max(this.ListaAceiteSoyaLinea[0].intervalomaximo, delta_0_aceite);
    const chartIdLineaSoya_0 = `main_${this.ListaAceiteSoyaLinea[0].periodo}_AceiteSoya_linea`
    this.initializeChart(chartIdLineaSoya_0, {
  
    // optionlinea_0= {
      title: { text: this.ListaAceiteSoyaLinea[0].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
      grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
      xAxis: {type: 'value', min:minInterval_0_aceite , max:maxInterval_0_aceite,
              axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
      yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
      series: [
        {
          name: 'Rango',
          type: 'line',
          data: [[this.ListaAceiteSoyaLinea[0].minimo, 0], [this.ListaAceiteSoyaLinea[0].maximo, 0]], // Coordenadas del rango
          lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
          markPoint: {
            data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaAceiteSoyaLinea[0].minimo), xAxis: this.ListaAceiteSoyaLinea[0].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                   { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaAceiteSoyaLinea[0].maximo), xAxis: this.ListaAceiteSoyaLinea[0].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
            label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
        },
        // Punto scatter
        {
          name: 'Punto',
          type: 'scatter',
          data: [{ value: [this.ListaAceiteSoyaLinea[0].posicionDelta, 0], 
                   itemStyle: {color: (() => {
                   if (delta_0_aceite >= this.ListaAceiteSoyaLinea[0].minimo && delta_0_aceite <= this.ListaAceiteSoyaLinea[0].maximo) {return 'green'}
                    else if ((delta_0_aceite >= this.ListaAceiteSoyaLinea[0].intervalominimo && delta_0_aceite <= this.ListaAceiteSoyaLinea[0].minimo) || (delta_0_aceite >= this.ListaAceiteSoyaLinea[0].maximo && delta_0_aceite <= this.ListaAceiteSoyaLinea[0].intervalomaximo)) {return 'amber'}
                   else{return 'red'}})()},
                   label: {show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black' } }], 
                   symbolSize: 20,
                   z:20
        }
      ],
      graphic: [
        { type: 'text',left: '70%',top: '70%',
          style: {text: `Tolerancia: ${(this.ListaAceiteSoyaLinea[0].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                  fill: 'black',align: 'center', verticalAlign: 'middle'}}]
    })
    
    // optionlinea_0 && myChart_linea_0.setOption(optionlinea_0);
//#2 GRAFICO PARA LA LINEA
if( this.ListaAceiteSoyaLinea &&this.ListaAceiteSoyaLinea[1] &&this.ListaAceiteSoyaLinea[1].periodo){
  const delta_1_aceite= this.ListaAceiteSoyaLinea[1].posicionDelta; 
  const minInterval_1_aceite = Math.min(this.ListaAceiteSoyaLinea[1].intervalominimo, delta_1_aceite); 
  const maxInterval_1_aceite = Math.max(this.ListaAceiteSoyaLinea[1].intervalomaximo, delta_1_aceite);
  const chartIdLineaSoya_1=`main_${this.ListaAceiteSoyaLinea[1].periodo}_AceiteSoya_linea`
  this.initializeChart(chartIdLineaSoya_1, {
      title: { text: this.ListaAceiteSoyaLinea[1].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
      grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
      xAxis: {type: 'value', min:minInterval_1_aceite, max: maxInterval_1_aceite,
              axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
      yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
      series: [
        {
          name: 'Rango',
          type: 'line',
          data: [[this.ListaAceiteSoyaLinea[1].minimo, 0], [this.ListaAceiteSoyaLinea[1].maximo, 0]], // Coordenadas del rango
          lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
          markPoint: {
            data: [{ name: 'Min', value: this.ListaAceiteSoyaLinea[1].minimo.toString(), xAxis: this.ListaAceiteSoyaLinea[1].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                   { name: 'Max', value: this.ListaAceiteSoyaLinea[1].maximo.toString(), xAxis: this.ListaAceiteSoyaLinea[1].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
            label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
        },
        // Punto scatter
        {
          name: 'Punto',
          type: 'scatter',
          data: [{value: [this.ListaAceiteSoyaLinea[1].posicionDelta, 0], 
                  itemStyle: {color: (() => {
                    if (delta_1_aceite >= this.ListaAceiteSoyaLinea[1].minimo && delta_1_aceite <= this.ListaAceiteSoyaLinea[1].maximo) {return 'green'}
                     else if ((delta_1_aceite >= this.ListaAceiteSoyaLinea[1].intervalominimo && delta_1_aceite <= this.ListaAceiteSoyaLinea[1].minimo) || (delta_1_aceite >= this.ListaAceiteSoyaLinea[1].maximo && delta_1_aceite <= this.ListaAceiteSoyaLinea[1].intervalomaximo)) {return 'amber'}
                    else{return 'red'}})() },
                  label: { show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black'} }], 
                  symbolSize: 20,
                  z:20}],

      graphic: [
        { type: 'text',left: '70%', top: '70%', 
          style: { text: this.ListaAceiteSoyaLinea[1].tolerancia.toString(), fontSize: 16, fontWeight: 'bold',
            fill: 'black',align: 'center',verticalAlign: 'middle' }},
      ],
    })
   } 
  }
  public HarinaSoyaChart(){
       //########PARA HARINA DE SOYA##############

       const ListaHarinaSoyaPositivo = this.ListaHarinaSoya.map(obj => {
        const newObj: any = { ...obj };
        for (const key in newObj) {
            if (typeof newObj[key] === 'number') {newObj[key] = Math.abs(newObj[key]);
            }
        }
        return newObj;
    });
      const ListastackaHarinaSoya=this.ListaHarinaSoya.map(item=>({
        Periodo:item.periodo,
        Necesidad:0,
        Fisico:item.tm_NECESIDAD+item.tm_FISICO,
        Pricing:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING,
        HedgePL:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl,
        HedgePC:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl+item.hedgepc,
        PosicionDelta:0
      }))
      const HarinaSoyaoriginal_0:number[]=Object.values(this.ListaHarinaSoya[0]).filter((value): value is number => typeof value === 'number')
  
  //GRAFICO CASCADA
  // CASCADA NUMERO 1
      const chartIdBarraHarinaSoya_0=`main_${this.ListaHarinaSoya[0].periodo}_HarinaSoya`
      this.initializeChart(chartIdBarraHarinaSoya_0, {
        tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
              formatter: function (params: any) {
                const index = params[1].dataIndex;
                const value = HarinaSoyaoriginal_0[index];
                let borderColor = '#cccccc';
                if (index === 0 || index === HarinaSoyaoriginal_0.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
                else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
                return `<div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                    <strong>${params[1].name}</strong><br/>
                    ${params[1].seriesName}: ${value.toFixed(2)}
                  </div>`},
              padding: 0,
              backgroundColor: 'transparent', 
              textStyle: {color: '#333333' }},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaHarinaSoya[0].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          { type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaHarinaSoya[0]).filter((value): value is number => typeof value === 'number')},
          { name:this.ListaHarinaSoya[0].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {show: true, position: 'top', color:'black',
              formatter: function (params) {
                const originalValues = HarinaSoyaoriginal_0;
                return originalValues[params.dataIndex].toFixed(1).toString()}},
            itemStyle: {
              color: function (params) {
                const originalValues = HarinaSoyaoriginal_0;
                const index = params.dataIndex;
                const value = originalValues[index];      
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaHarinaSoyaPositivo[0]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
        
  // CASCADA NUMERO 2
      const HarinaSoyaoriginal_1:number[]=Object.values(this.ListaHarinaSoya[1]).filter((value): value is number => typeof value === 'number')
      const chartIdBarraHarinaSoya_1=`main_${this.ListaHarinaSoya[1].periodo}_HarinaSoya`
      this.initializeChart(chartIdBarraHarinaSoya_1, {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params: any) {
            const index = params[1].dataIndex;
            const value = HarinaSoyaoriginal_1[index];
            let borderColor = '#cccccc';
            if (index === 0 || index === HarinaSoyaoriginal_1.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
            else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
            return `
              <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                <strong>${params[1].name}</strong><br/>
                ${params[1].seriesName}: ${value.toFixed(2)}
              </div>
            `;
          },
          padding: 0,
          backgroundColor: 'transparent', 
          textStyle: {color: '#333333' }
        }
  ,      
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaHarinaSoya[1].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          {
            type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaHarinaSoya[1]).filter((value): value is number => typeof value === 'number')
          },
          { name:this.ListaHarinaSoya[1].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {
              show: true,
              position: 'top',
              color:'black',
              formatter: function (params) {
                const originalValues = HarinaSoyaoriginal_1;
                return originalValues[params.dataIndex].toFixed(1).toString()}
            },
            itemStyle: {
              color: function (params) {
                const originalValues = HarinaSoyaoriginal_1;
                const index = params.dataIndex;
                const value = originalValues[index];
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaHarinaSoyaPositivo[1]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
      
  // CASCADA NUMERO 3
  if( this.ListaHarinaSoya &&this.ListaHarinaSoya[2] &&this.ListaHarinaSoya[2].periodo){
      const HarinaSoyaoriginal_2:number[]=Object.values(this.ListaHarinaSoya[2]).filter((value): value is number => typeof value === 'number')
      const chartIdBarraHarinaSoya_2=`main_${this.ListaHarinaSoya[2].periodo}_HarinaSoya`
      this.initializeChart(chartIdBarraHarinaSoya_2, {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params: any) {
            const index = params[1].dataIndex;
            const value = HarinaSoyaoriginal_2[index];
            let borderColor = '#cccccc';
            if (index === 0 || index === HarinaSoyaoriginal_2.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
            else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
            return `
              <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                <strong>${params[1].name}</strong><br/>
                ${params[1].seriesName}: ${value.toFixed(2)}
              </div>
            `;
          },
          padding: 0,
          backgroundColor: 'transparent', 
          textStyle: {color: '#333333' }
        }
      ,      
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaHarinaSoya[2].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          {
            type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaHarinaSoya[2]).filter((value): value is number => typeof value === 'number')
          },
          { name:this.ListaHarinaSoya[2].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {
              show: true,
              position: 'top',
              color:'black',
              formatter: function (params) {
                const originalValues = HarinaSoyaoriginal_2;
                return originalValues[params.dataIndex].toFixed(1).toString()}
            },
            itemStyle: {
              color: function (params) {
                const originalValues = HarinaSoyaoriginal_2;
                const index = params.dataIndex;
                const value = originalValues[index];
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaHarinaSoyaPositivo[2]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
    }
  
  //GRAFICO PARA LA LINEA
  //#1 GRAFICO PARA LA LINEA
  const delta_0_harina= this.ListaHarinaSoyaLinea[0].posicionDelta; 
  const minInterval_0_harina = Math.min(this.ListaHarinaSoyaLinea[0].intervalominimo, delta_0_harina); 
  const maxInterval_0_harina = Math.max(this.ListaHarinaSoyaLinea[0].intervalomaximo, delta_0_harina);
      const chartIdLineaHarinasoya_0=`main_${this.ListaHarinaSoyaLinea[0].periodo}_HarinaSoya_linea`
      this.initializeChart(chartIdLineaHarinasoya_0, {
        title: { text: this.ListaHarinaSoyaLinea[0].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_0_harina, max:maxInterval_0_harina,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaHarinaSoyaLinea[0].minimo, 0], [this.ListaHarinaSoyaLinea[0].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaHarinaSoyaLinea[0].minimo), xAxis: this.ListaHarinaSoyaLinea[0].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaHarinaSoyaLinea[0].maximo), xAxis: this.ListaHarinaSoyaLinea[0].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{ value: [this.ListaHarinaSoyaLinea[0].posicionDelta, 0], 
                     itemStyle: {color: (() => {
                     if (delta_0_harina >= this.ListaHarinaSoyaLinea[0].minimo && delta_0_harina <= this.ListaHarinaSoyaLinea[0].maximo) {return 'green'}
                      else if ((delta_0_harina >= this.ListaHarinaSoyaLinea[0].intervalominimo && delta_0_harina <= this.ListaHarinaSoyaLinea[0].minimo) || (delta_0_harina >= this.ListaHarinaSoyaLinea[0].maximo && delta_0_harina <= this.ListaHarinaSoyaLinea[0].intervalomaximo)) {return 'amber'}
                     else{return 'red'}})()},
                     label: {show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black' } }], 
                     symbolSize: 20,
                     z:20
          }
        ],
        graphic: [
          { type: 'text',left: '70%',top: '70%',
            style: {text: `Tolerancia: ${(this.ListaHarinaSoyaLinea[0].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                    fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })
  //#2 GRAFICO PARA LA LINEA
  if( this.ListaHarinaSoyaLinea &&this.ListaHarinaSoyaLinea[1] &&this.ListaHarinaSoyaLinea[1].periodo){
    const delta_1_harina= this.ListaHarinaSoyaLinea[1].posicionDelta; 
  const minInterval_1_harina = Math.min(this.ListaHarinaSoyaLinea[1].intervalominimo, delta_1_harina); 
  const maxInterval_1_harina = Math.max(this.ListaHarinaSoyaLinea[1].intervalomaximo, delta_1_harina);
      const chartIdLineaHarinasoya_1=`main_${this.ListaHarinaSoyaLinea[1].periodo}_HarinaSoya_linea`
      this.initializeChart(chartIdLineaHarinasoya_1, {
        title: { text: this.ListaHarinaSoyaLinea[1].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_1_harina, max: maxInterval_1_harina,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaHarinaSoyaLinea[1].minimo, 0], [this.ListaHarinaSoyaLinea[1].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaHarinaSoyaLinea[1].minimo), xAxis: this.ListaHarinaSoyaLinea[1].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaHarinaSoyaLinea[1].maximo), xAxis: this.ListaHarinaSoyaLinea[1].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{value: [this.ListaHarinaSoyaLinea[1].posicionDelta, 0], 
                    itemStyle: {color: (() => {
                      if (delta_1_harina >= this.ListaHarinaSoyaLinea[1].minimo && delta_1_harina <= this.ListaHarinaSoyaLinea[1].maximo) {return 'green'}
                       else if ((delta_1_harina >= this.ListaHarinaSoyaLinea[1].intervalominimo && delta_1_harina <= this.ListaHarinaSoyaLinea[1].minimo) || (delta_1_harina >= this.ListaHarinaSoyaLinea[1].maximo && delta_1_harina <= this.ListaHarinaSoyaLinea[1].intervalomaximo)) {return 'amber'}
                      else {return 'red'}})() },
                    label: { show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black'} }], 
                    symbolSize: 20,
                    z:20}],
  
                    graphic: [
                      { type: 'text',left: '70%',top: '70%',
                        style: {text: `Tolerancia: ${(this.ListaHarinaSoyaLinea[1].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                                fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })}
  }
  public TrigoCorrectorChart(){
          // ########PARA TRIGO CORRECTOR ##############
  
       const ListaTrigoCorrectorPositivo = this.ListaTrigocorrector.map(obj => {
        const newObj: any = { ...obj };
        for (const key in newObj) {
            if (typeof newObj[key] === 'number') {newObj[key] = Math.abs(newObj[key]);
            }
        }
        return newObj;
    });
      const ListastackaTrigoCorrector=this.ListaTrigocorrector.map(item=>({
        Periodo:item.periodo,
        Necesidad:0,
        Fisico:item.tm_NECESIDAD+item.tm_FISICO,
        Pricing:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING,
        HedgePL:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl,
        HedgePC:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl+item.hedgepc,
        PosicionDelta:0
      }))
      const TrigoCorrectororiginal_0:number[]=Object.values(this.ListaTrigocorrector[0]).filter((value): value is number => typeof value === 'number')
  
  //GRAFICO CASCADA
  // CASCADA NUMERO 1
      const chartIdBarraTrigoCorrector_0=`main_${this.ListaTrigocorrector[0].periodo}_TrigoCorrector`
      this.initializeChart(chartIdBarraTrigoCorrector_0, {
        tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
              formatter: function (params: any) {
                const index = params[1].dataIndex;
                const value = TrigoCorrectororiginal_0[index];
                let borderColor = '#cccccc';
                if (index === 0 || index === TrigoCorrectororiginal_0.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
                else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
                return `<div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                    <strong>${params[1].name}</strong><br/>
                    ${params[1].seriesName}: ${value.toFixed(2)}
                  </div>`},
              padding: 0,
              backgroundColor: 'transparent', 
              textStyle: {color: '#333333' }},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaTrigocorrector[0].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          { type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaTrigoCorrector[0]).filter((value): value is number => typeof value === 'number')},
          { name:this.ListaTrigocorrector[0].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {show: true, position: 'top', color:'black',
              formatter: function (params) {
                const originalValues = TrigoCorrectororiginal_0;
                return originalValues[params.dataIndex].toFixed(1).toString()}},
            itemStyle: {
              color: function (params) {
                const originalValues = TrigoCorrectororiginal_0;
                const index = params.dataIndex;
                const value = originalValues[index];      
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaTrigoCorrectorPositivo[0]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
        
  // CASCADA NUMERO 2
      const TrigoCorrectororiginal_1:number[]=Object.values(this.ListaTrigocorrector[1]).filter((value): value is number => typeof value === 'number')
      const chartIdBarraTrigoCorrector_1=`main_${this.ListaTrigocorrector[1].periodo}_TrigoCorrector`
      this.initializeChart(chartIdBarraTrigoCorrector_1, {      
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params: any) {
            const index = params[1].dataIndex;
            const value = TrigoCorrectororiginal_1[index];
            let borderColor = '#cccccc';
            if (index === 0 || index === TrigoCorrectororiginal_1.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
            else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
            return `
              <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                <strong>${params[1].name}</strong><br/>
                ${params[1].seriesName}: ${value.toFixed(2)}
              </div>
            `;
          },
          padding: 0,
          backgroundColor: 'transparent', 
          textStyle: {color: '#333333' }
        }
  ,      
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaTrigocorrector[1].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          {
            type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaTrigoCorrector[1]).filter((value): value is number => typeof value === 'number')
          },
          { name:this.ListaTrigocorrector[1].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {
              show: true,
              position: 'top',
              color:'black',
              formatter: function (params) {
                const originalValues = TrigoCorrectororiginal_1;
                return originalValues[params.dataIndex].toFixed(1).toString()}
            },
            itemStyle: {
              color: function (params) {
                const originalValues = TrigoCorrectororiginal_1;
                const index = params.dataIndex;
                const value = originalValues[index];
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaTrigoCorrectorPositivo[1]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
  // CASCADA NUMERO 3
  if(this.ListaTrigocorrector &&this.ListaTrigocorrector[2] &&this.ListaTrigocorrector[2].periodo){
  const TrigoCorrectororiginal_2:number[]=Object.values(this.ListaTrigocorrector[2]).filter((value): value is number => typeof value === 'number')
  const chartIdBarraTrigoCorrector_2=`main_${this.ListaTrigocorrector[2].periodo}_TrigoCorrector`
  this.initializeChart(chartIdBarraTrigoCorrector_2, {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params: any) {
        const index = params[1].dataIndex;
        const value = TrigoCorrectororiginal_2[index];
        let borderColor = '#cccccc';
        if (index === 0 || index === TrigoCorrectororiginal_2.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
        else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
        return `
          <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
            <strong>${params[1].name}</strong><br/>
            ${params[1].seriesName}: ${value.toFixed(2)}
          </div>
        `;
      },
      padding: 0,
      backgroundColor: 'transparent', 
      textStyle: {color: '#333333' }
    }
  ,      
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', splitLine: { show: false }, 
    data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
    yAxis: {name:this.ListaTrigocorrector[2].periodo, type: 'value' ,nameLocation: 'middle',
      nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
    series: [
      {
        type: 'bar',
        stack: 'Necesidad',
        itemStyle: {borderColor: 'transparent', color: 'transparent'  },
        emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
        data: Object.values(ListastackaTrigoCorrector[2]).filter((value): value is number => typeof value === 'number')
      },
      { name:this.ListaTrigocorrector[2].periodo,
        type: 'bar',
        stack: 'Necesidad',
        label: {
          show: true,
          position: 'top',
          color:'black',
          formatter: function (params) {
            const originalValues = TrigoCorrectororiginal_2;
            return originalValues[params.dataIndex].toFixed(1).toString()}
        },
        itemStyle: {
          color: function (params) {
            const originalValues = TrigoCorrectororiginal_2;
            const index = params.dataIndex;
            const value = originalValues[index];
            if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
            else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
          },
          borderWidth:2,
        },
        data: Object.values(ListaTrigoCorrectorPositivo[2]).filter((value): value is number => typeof value === 'number')
      }
    ]
  })
}
  
  //GRAFICO PARA LA LINEA
  //#1 GRAFICO PARA LA LINEA
      const chartIdLineaTrigoCorrector_0=`main_${this.ListaTrigocorrectorLinea[0].periodo}_TrigoCorrector_linea`
      const delta_0 = this.ListaTrigocorrectorLinea[0].posicionDelta; 
      const minInterval_0 = Math.min(this.ListaTrigocorrectorLinea[0].intervalominimo, delta_0); 
      const maxInterval_0 = Math.max(this.ListaTrigocorrectorLinea[0].intervalomaximo, delta_0);
      this.initializeChart(chartIdLineaTrigoCorrector_0, {
        title: { text: this.ListaTrigocorrectorLinea[0].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_0, max: maxInterval_0,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaTrigocorrectorLinea[0].minimo, 0], [this.ListaTrigocorrectorLinea[0].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigocorrectorLinea[0].minimo), xAxis: this.ListaTrigocorrectorLinea[0].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigocorrectorLinea[0].maximo), xAxis: this.ListaTrigocorrectorLinea[0].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{ value: [this.ListaTrigocorrectorLinea[0].posicionDelta, 0], 
                     itemStyle: {color: (() => {
                     if (delta_0 >= this.ListaTrigocorrectorLinea[0].minimo && delta_0 <= this.ListaTrigocorrectorLinea[0].maximo) {return 'green'}
                      else if ((delta_0 >= this.ListaTrigocorrectorLinea[0].intervalominimo && delta_0 <= this.ListaTrigocorrectorLinea[0].minimo) || (delta_0 >= this.ListaTrigocorrectorLinea[0].maximo && delta_0 <= this.ListaTrigocorrectorLinea[0].intervalomaximo)) {return 'amber'}
                      else { return 'red';}})()},
                     label: {show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black' } }], 
                     symbolSize: 20,
                     z:20
          }
        ],
        graphic: [
          { type: 'text',left: '70%',top: '70%',
            style: {text: `Tolerancia: ${(this.ListaTrigocorrectorLinea[0].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                    fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })
  //#2 GRAFICO PARA LA LINEA
  if(this.ListaTrigocorrectorLinea &&this.ListaTrigocorrectorLinea[1] &&this.ListaTrigocorrectorLinea[1].periodo){
      const delta_1 = this.ListaTrigocorrectorLinea[1].posicionDelta; 
      const minInterval_1 = Math.min(this.ListaTrigocorrectorLinea[1].intervalominimo, delta_1); 
      const maxInterval_1 = Math.max(this.ListaTrigocorrectorLinea[1].intervalomaximo, delta_1);
      const chartIdLineaTrigoCorrector_1=`main_${this.ListaTrigocorrectorLinea[1].periodo}_TrigoCorrector_linea`
      this.initializeChart(chartIdLineaTrigoCorrector_1, {
        title: { text: this.ListaTrigocorrectorLinea[1].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_1, max: maxInterval_1,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaTrigocorrectorLinea[1].minimo, 0], [this.ListaTrigocorrectorLinea[1].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigocorrectorLinea[1].minimo), xAxis: this.ListaTrigocorrectorLinea[1].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigocorrectorLinea[1].maximo), xAxis: this.ListaTrigocorrectorLinea[1].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{value: [this.ListaTrigocorrectorLinea[1].posicionDelta, 0], 
                    itemStyle: {color: (() => {
                      if (delta_1 >= this.ListaTrigocorrectorLinea[1].minimo && delta_1 <= this.ListaTrigocorrectorLinea[1].maximo) {return 'green'}
                       else if ((delta_1 >= this.ListaTrigocorrectorLinea[1].intervalominimo && delta_1 <= this.ListaTrigocorrectorLinea[1].minimo) || (delta_1 >= this.ListaTrigocorrectorLinea[1].maximo && delta_1 <= this.ListaTrigocorrectorLinea[1].intervalomaximo)) {return 'amber'}
                      else{return 'red'}})() },
                    label: { show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black'} }], 
                    symbolSize: 20,
                    z:20}],
  
                    graphic: [
                      { type: 'text',left: '70%',top: '70%',
                        style: {text: `Tolerancia: ${(this.ListaTrigocorrectorLinea[1].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                                fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })}

  }
  public TrigoEconomicoChart(){
       //########PARA TRIGO ECONOMICO ##############
	  
      const ListaTrigoEconomicoPositivo = this.ListaTrigoEconomico.map(obj => {
        const newObj: any = { ...obj };
        for (const key in newObj) {
            if (typeof newObj[key] === 'number') {newObj[key] = Math.abs(newObj[key]);
            }
        }
        return newObj;
    });
      const ListastackaTrigoEconomico=this.ListaTrigoEconomico.map(item=>({
        Periodo:item.periodo,
        Necesidad:0,
        Fisico:item.tm_NECESIDAD+item.tm_FISICO,
        Pricing:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING,
        HedgePL:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl,
        HedgePC:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl+item.hedgepc,
        PosicionDelta:0
      }))
      const TrigoEconomicooriginal_0:number[]=Object.values(this.ListaTrigoEconomico[0]).filter((value): value is number => typeof value === 'number')
  //GRAFICO CASCADA
  // CASCADA NUMERO 1
      const chartIdBarraTrigoEconomico_0=`main_${this.ListaTrigoEconomico[0].periodo}_TrigoEconomico`
      this.initializeChart(chartIdBarraTrigoEconomico_0, {
        tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
              formatter: function (params: any) {
                const index = params[1].dataIndex;
                const value = TrigoEconomicooriginal_0[index];
                let borderColor = '#cccccc';
                if (index === 0 || index === TrigoEconomicooriginal_0.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
                else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
                return `<div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                    <strong>${params[1].name}</strong><br/>
                    ${params[1].seriesName}: ${value.toFixed(2)}
                  </div>`},
              padding: 0,
              backgroundColor: 'transparent', 
              textStyle: {color: '#333333' }},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaTrigoEconomico[0].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          { type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaTrigoEconomico[0]).filter((value): value is number => typeof value === 'number')},
          { name:this.ListaTrigoEconomico[0].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {show: true, position: 'top', color:'black',
              formatter: function (params) {
                const originalValues = TrigoEconomicooriginal_0;
                return originalValues[params.dataIndex].toFixed(1).toString()}},
            itemStyle: {
              color: function (params) {
                const originalValues = TrigoEconomicooriginal_0;
                const index = params.dataIndex;
                const value = originalValues[index];      
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaTrigoEconomicoPositivo[0]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
        
  // CASCADA NUMERO 2
      const TrigoEconomicooriginal_1:number[]=Object.values(this.ListaTrigoEconomico[1]).filter((value): value is number => typeof value === 'number')
      const chartIdBarraTrigoEconomico_1=`main_${this.ListaTrigoEconomico[1].periodo}_TrigoEconomico`
      this.initializeChart(chartIdBarraTrigoEconomico_1, {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params: any) {
            const index = params[1].dataIndex;
            const value = TrigoEconomicooriginal_1[index];
            let borderColor = '#cccccc';
            if (index === 0 || index === TrigoEconomicooriginal_1.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
            else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
            return `
              <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                <strong>${params[1].name}</strong><br/>
                ${params[1].seriesName}: ${value.toFixed(2)}
              </div>
            `;
          },
          padding: 0,
          backgroundColor: 'transparent', 
          textStyle: {color: '#333333' }
        }
  ,      
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaTrigoEconomico[1].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          {
            type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaTrigoEconomico[1]).filter((value): value is number => typeof value === 'number')
          },
          { name:this.ListaTrigoEconomico[1].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {
              show: true,
              position: 'top',
              color:'black',
              formatter: function (params) {
                const originalValues = TrigoEconomicooriginal_1;
                return originalValues[params.dataIndex].toFixed(1).toString()}
            },
            itemStyle: {
              color: function (params) {
                const originalValues = TrigoEconomicooriginal_1;
                const index = params.dataIndex;
                const value = originalValues[index];
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaTrigoEconomicoPositivo[1]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
  // CASCADA NUMERO 3
  if(this.ListaTrigoEconomico &&this.ListaTrigoEconomico[2] &&this.ListaTrigoEconomico[2].periodo){
  const TrigoEconomicooriginal_2:number[]=Object.values(this.ListaTrigoEconomico[2]).filter((value): value is number => typeof value === 'number')
  const chartIdBarraTrigoEconomico_2=`main_${this.ListaTrigoEconomico[2].periodo}_TrigoEconomico`
  this.initializeChart(chartIdBarraTrigoEconomico_2, {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params: any) {
        const index = params[1].dataIndex;
        const value = TrigoEconomicooriginal_2[index];
        let borderColor = '#cccccc';
        if (index === 0 || index === TrigoEconomicooriginal_2.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
        else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
        return `
          <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
            <strong>${params[1].name}</strong><br/>
            ${params[1].seriesName}: ${value.toFixed(2)}
          </div>
        `;
      },
      padding: 0,
      backgroundColor: 'transparent', 
      textStyle: {color: '#333333' }
    }
  ,      
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', splitLine: { show: false }, 
    data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
    yAxis: {name:this.ListaTrigoEconomico[2].periodo, type: 'value' ,nameLocation: 'middle',
      nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
    series: [
      {
        type: 'bar',
        stack: 'Necesidad',
        itemStyle: {borderColor: 'transparent', color: 'transparent'  },
        emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
        data: Object.values(ListastackaTrigoEconomico[2]).filter((value): value is number => typeof value === 'number')
      },
      { name:this.ListaTrigoEconomico[2].periodo,
        type: 'bar',
        stack: 'Necesidad',
        label: {
          show: true,
          position: 'top',
          color:'black',
          formatter: function (params) {
            const originalValues = TrigoEconomicooriginal_2;
            return originalValues[params.dataIndex].toFixed(1).toString()}
        },
        itemStyle: {
          color: function (params) {
            const originalValues = TrigoEconomicooriginal_2;
            const index = params.dataIndex;
            const value = originalValues[index];
            if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
            else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
          },
          borderWidth:2,
        },
        data: Object.values(ListaTrigoEconomicoPositivo[2]).filter((value): value is number => typeof value === 'number')
      }
    ]
  })
}
  
  //GRAFICO PARA LA LINEA
  //#1 GRAFICO PARA LA LINEA
      const delta_0_eco = this.ListaTrigoEconomicoLinea[0].posicionDelta; 
      const minInterval_0_eco = Math.min(this.ListaTrigoEconomicoLinea[0].intervalominimo, delta_0_eco); 
      const maxInterval_0_eco = Math.max(this.ListaTrigoEconomicoLinea[0].intervalomaximo, delta_0_eco);
      const chartIdLineaTrigoEconomico_0 =`main_${this.ListaTrigoEconomicoLinea[0].periodo}_TrigoEconomico_linea`
        this.initializeChart(chartIdLineaTrigoEconomico_0, {
        title: { text: this.ListaTrigoEconomicoLinea[0].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_0_eco, max: maxInterval_0_eco,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaTrigoEconomicoLinea[0].minimo, 0], [this.ListaTrigoEconomicoLinea[0].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoEconomicoLinea[0].minimo), xAxis: this.ListaTrigoEconomicoLinea[0].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoEconomicoLinea[0].maximo), xAxis: this.ListaTrigoEconomicoLinea[0].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{ value: [this.ListaTrigoEconomicoLinea[0].posicionDelta, 0], 
                     itemStyle: {color: (() => {
                     if (delta_0_eco >= this.ListaTrigoEconomicoLinea[0].minimo && delta_0_eco <= this.ListaTrigoEconomicoLinea[0].maximo) {return 'green'}
                      else if ((delta_0_eco >= this.ListaTrigoEconomicoLinea[0].intervalominimo && delta_0_eco <= this.ListaTrigoEconomicoLinea[0].minimo) || (delta_0_eco >= this.ListaTrigoEconomicoLinea[0].maximo && delta_0_eco <= this.ListaTrigoEconomicoLinea[0].intervalomaximo)) {return 'amber'}
                     else{return 'red'}})()},
                     label: {show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black' } }], 
                     symbolSize: 20,
                     z:20
          }
        ],
        graphic: [
          { type: 'text',left: '70%',top: '70%',
            style: {text: `Tolerancia: ${(this.ListaTrigoEconomicoLinea[0].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                    fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })
  //#2 GRAFICO PARA LA LINEA
  if(this.ListaTrigoEconomicoLinea &&this.ListaTrigoEconomicoLinea[1] &&this.ListaTrigoEconomicoLinea[1].periodo){
    const delta_1_eco = this.ListaTrigoEconomicoLinea[1].posicionDelta; 
    const minInterval_1_eco = Math.min(this.ListaTrigoEconomicoLinea[1].intervalominimo, delta_1_eco); 
    const maxInterval_1_eco = Math.max(this.ListaTrigoEconomicoLinea[1].intervalomaximo, delta_1_eco);
      const chartIdLineaTrigoEconomico_1=`main_${this.ListaTrigoEconomicoLinea[1].periodo}_TrigoEconomico_linea`
      this.initializeChart(chartIdLineaTrigoEconomico_1, {
        title: { text: this.ListaTrigoEconomicoLinea[1].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_1_eco, max: maxInterval_1_eco,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaTrigoEconomicoLinea[1].minimo, 0], [this.ListaTrigoEconomicoLinea[1].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoEconomicoLinea[1].minimo), xAxis: this.ListaTrigoEconomicoLinea[1].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoEconomicoLinea[1].maximo), xAxis: this.ListaTrigoEconomicoLinea[1].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{value: [this.ListaTrigoEconomicoLinea[1].posicionDelta, 0], 
                    itemStyle: {color: (() => {
                      if (delta_1_eco >= this.ListaTrigoEconomicoLinea[1].minimo && delta_1_eco <= this.ListaTrigoEconomicoLinea[1].maximo) {return 'green'}
                       else if ((delta_1_eco >= this.ListaTrigoEconomicoLinea[1].intervalominimo && delta_1_eco <= this.ListaTrigoEconomicoLinea[1].minimo) || (delta_1_eco >= this.ListaTrigoEconomicoLinea[1].maximo && delta_1_eco <= this.ListaTrigoEconomicoLinea[1].intervalomaximo)) {return 'amber'}
                      else{return 'red'}})() },
                    label: { show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black'} }], 
                    symbolSize: 20,
                    z:20}],
  
                    graphic: [
                      { type: 'text',left: '70%',top: '70%',
                        style: {text: `Tolerancia: ${(this.ListaTrigoEconomicoLinea[1].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                                fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })}
  }
  public TrigoSuaveChart(){
    //###### PARA TRIGO SUAVE ###################
     const ListaTrigoSuavePositivo = this.ListaTrigoSuave.map(obj => {
        const newObj: any = { ...obj };
        for (const key in newObj) {
            if (typeof newObj[key] === 'number') {newObj[key] = Math.abs(newObj[key]);
            }
        }
        return newObj;
    });
      const ListastackaTrigoSuave=this.ListaTrigoSuave.map(item=>({
        Periodo:item.periodo,
        Necesidad:0,
        Fisico:item.tm_NECESIDAD+item.tm_FISICO,
        Pricing:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING,
        HedgePL:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl,
        HedgePC:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl+item.hedgepc,
        PosicionDelta:0
      }))
      const TrigoSuaveoriginal_0:number[]=Object.values(this.ListaTrigoSuave[0]).filter((value): value is number => typeof value === 'number')
  //GRAFICO CASCADA
  // CASCADA NUMERO 1
      const chartIdBarraTrigoEconomico_0=`main_${this.ListaTrigoSuave[0].periodo}_TrigoSuave`
      this.initializeChart(chartIdBarraTrigoEconomico_0, {
        tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
              formatter: function (params: any) {
                const index = params[1].dataIndex;
                const value = TrigoSuaveoriginal_0[index];
                let borderColor = '#cccccc';
                if (index === 0 || index === TrigoSuaveoriginal_0.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
                else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
                return `<div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                    <strong>${params[1].name}</strong><br/>
                    ${params[1].seriesName}: ${value.toFixed(2)}
                  </div>`},
              padding: 0,
              backgroundColor: 'transparent', 
              textStyle: {color: '#333333' }},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaTrigoSuave[0].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          { type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaTrigoSuave[0]).filter((value): value is number => typeof value === 'number')},
          { name:this.ListaTrigoSuave[0].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {show: true, position: 'top', color:'black',
              formatter: function (params) {
                const originalValues = TrigoSuaveoriginal_0;
                return originalValues[params.dataIndex].toFixed(1).toString()}},
            itemStyle: {
              color: function (params) {
                const originalValues = TrigoSuaveoriginal_0;
                const index = params.dataIndex;
                const value = originalValues[index];      
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaTrigoSuavePositivo[0]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
        
  // CASCADA NUMERO 2
      const TrigoSuaveoriginal_1:number[]=Object.values(this.ListaTrigoSuave[1]).filter((value): value is number => typeof value === 'number')
      const chartIdBarraTrigoEconomico_1=`main_${this.ListaTrigoSuave[1].periodo}_TrigoSuave`
      this.initializeChart(chartIdBarraTrigoEconomico_1, {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params: any) {
            const index = params[1].dataIndex;
            const value = TrigoSuaveoriginal_1[index];
            let borderColor = '#cccccc';
            if (index === 0 || index === TrigoSuaveoriginal_1.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
            else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
            return `
              <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
                <strong>${params[1].name}</strong><br/>
                ${params[1].seriesName}: ${value.toFixed(2)}
              </div>
            `;
          },
          padding: 0,
          backgroundColor: 'transparent', 
          textStyle: {color: '#333333' }
        }
  ,      
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', splitLine: { show: false }, 
        data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
        yAxis: {name:this.ListaTrigoSuave[1].periodo, type: 'value' ,nameLocation: 'middle',
          nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
        series: [
          {
            type: 'bar',
            stack: 'Necesidad',
            itemStyle: {borderColor: 'transparent', color: 'transparent'  },
            emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
            data: Object.values(ListastackaTrigoSuave[1]).filter((value): value is number => typeof value === 'number')
          },
          { name:this.ListaTrigoSuave[1].periodo,
            type: 'bar',
            stack: 'Necesidad',
            label: {
              show: true,
              position: 'top',
              color:'black',
              formatter: function (params) {
                const originalValues = TrigoSuaveoriginal_1;
                return originalValues[params.dataIndex].toFixed(1).toString()}
            },
            itemStyle: {
              color: function (params) {
                const originalValues = TrigoSuaveoriginal_1;
                const index = params.dataIndex;
                const value = originalValues[index];
                if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
                else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
              },
              borderWidth:2,
            },
            data: Object.values(ListaTrigoSuavePositivo[1]).filter((value): value is number => typeof value === 'number')
          }
        ]
      })
  // CASCADA NUMERO 3
  if(this.ListaTrigoSuave &&this.ListaTrigoSuave[2] &&this.ListaTrigoSuave[2].periodo){
  const TrigoSuaveoriginal_2:number[]=Object.values(this.ListaTrigoSuave[2]).filter((value): value is number => typeof value === 'number')
  const chartIdBarraTrigoEconomico_2=`main_${this.ListaTrigoSuave[2].periodo}_TrigoSuave`
  this.initializeChart(chartIdBarraTrigoEconomico_2, {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params: any) {
        const index = params[1].dataIndex;
        const value = TrigoSuaveoriginal_2[index];
        let borderColor = '#cccccc';
        if (index === 0 || index === TrigoSuaveoriginal_2.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
        else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
        return `
          <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
            <strong>${params[1].name}</strong><br/>
            ${params[1].seriesName}: ${value.toFixed(2)}
          </div>
        `;
      },
      padding: 0,
      backgroundColor: 'transparent', 
      textStyle: {color: '#333333' }
    }
  ,      
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', splitLine: { show: false }, 
    data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
    yAxis: {name:this.ListaTrigoSuave[2].periodo, type: 'value' ,nameLocation: 'middle',
      nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
    series: [
      {
        type: 'bar',
        stack: 'Necesidad',
        itemStyle: {borderColor: 'transparent', color: 'transparent'  },
        emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
        data: Object.values(ListastackaTrigoSuave[2]).filter((value): value is number => typeof value === 'number')
      },
      { name:this.ListaTrigoSuave[2].periodo,
        type: 'bar',
        stack: 'Necesidad',
        label: {
          show: true,
          position: 'top',
          color:'black',
          formatter: function (params) {
            const originalValues = TrigoSuaveoriginal_2;
            return originalValues[params.dataIndex].toFixed(1).toString()}
        },
        itemStyle: {
          color: function (params) {
            const originalValues = TrigoSuaveoriginal_2;
            const index = params.dataIndex;
            const value = originalValues[index];
            if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
            else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
          },
          borderWidth:2,
        },
        data: Object.values(ListaTrigoSuavePositivo[2]).filter((value): value is number => typeof value === 'number')
      }
    ]
  })
}
  
  //GRAFICO PARA LA LINEA
  //#1 GRAFICO PARA LA LINEA
  const delta_0_suave= this.ListaTrigoSuaveLinea[0].posicionDelta; 
  const minInterval_0_suave = Math.min(this.ListaTrigoSuaveLinea[0].intervalominimo, delta_0_suave); 
  const maxInterval_0_suave = Math.max(this.ListaTrigoSuaveLinea[0].intervalomaximo, delta_0_suave);
      const chartIdLineaTrigoSuave_0 =`main_${this.ListaTrigoSuaveLinea[0].periodo}_TrigoSuave_linea`
      this.initializeChart(chartIdLineaTrigoSuave_0, {
        title: { text: this.ListaTrigoSuaveLinea[0].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_0_suave, max: maxInterval_0_suave,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaTrigoSuaveLinea[0].minimo, 0], [this.ListaTrigoSuaveLinea[0].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoSuaveLinea[0].minimo), xAxis: this.ListaTrigoSuaveLinea[0].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoSuaveLinea[0].maximo), xAxis: this.ListaTrigoSuaveLinea[0].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{ value: [this.ListaTrigoSuaveLinea[0].posicionDelta, 0], 
                     itemStyle: {color: (() => {
                     if (delta_0_suave >= this.ListaTrigoSuaveLinea[0].minimo && delta_0_suave <= this.ListaTrigoSuaveLinea[0].maximo) {return 'green'}
                      else if ((delta_0_suave >= this.ListaTrigoSuaveLinea[0].intervalominimo && delta_0_suave <= this.ListaTrigoSuaveLinea[0].minimo) || (delta_0_suave >= this.ListaTrigoSuaveLinea[0].maximo && delta_0_suave <= this.ListaTrigoSuaveLinea[0].intervalomaximo)) {return 'amber'}
                     else{return 'red'}})()},
                     label: {show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black' } }], 
                     symbolSize: 20,
                     z:20
          }
        ],
        graphic: [
          { type: 'text',left: '70%',top: '70%',
            style: {text: `Tolerancia: ${(this.ListaTrigoSuaveLinea[0].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                    fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })
  //#2 GRAFICO PARA LA LINEA
  if(this.ListaTrigoSuaveLinea &&this.ListaTrigoSuaveLinea[1] &&this.ListaTrigoSuaveLinea[1].periodo){
    const delta_1_suave= this.ListaTrigoSuaveLinea[1].posicionDelta; 
    const minInterval_1_suave = Math.min(this.ListaTrigoSuaveLinea[1].intervalominimo, delta_1_suave); 
    const maxInterval_1_suave = Math.max(this.ListaTrigoSuaveLinea[1].intervalomaximo, delta_1_suave);
      const chartIdLineaTrigoSuave_1 =`main_${this.ListaTrigoSuaveLinea[1].periodo}_TrigoSuave_linea`
      this.initializeChart(chartIdLineaTrigoSuave_1, {
        title: { text: this.ListaTrigoSuaveLinea[1].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
        grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
        xAxis: {type: 'value', min: minInterval_1_suave, max: maxInterval_1_suave,
                axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
        yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
        series: [
          {
            name: 'Rango',
            type: 'line',
            data: [[this.ListaTrigoSuaveLinea[1].minimo, 0], [this.ListaTrigoSuaveLinea[1].maximo, 0]], // Coordenadas del rango
            lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
            markPoint: {
              data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoSuaveLinea[1].minimo), xAxis: this.ListaTrigoSuaveLinea[1].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
                     { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaTrigoSuaveLinea[1].maximo), xAxis: this.ListaTrigoSuaveLinea[1].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
              label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
          },
          // Punto scatter
          {
            name: 'Punto',
            type: 'scatter',
            data: [{value: [this.ListaTrigoSuaveLinea[1].posicionDelta, 0], 
                    itemStyle: {color: (() => {
                      if (delta_1_suave >= this.ListaTrigoSuaveLinea[1].minimo && delta_1_suave <= this.ListaTrigoSuaveLinea[1].maximo) {return 'green'}
                       else if ((delta_1_suave >= this.ListaTrigoSuaveLinea[1].intervalominimo && delta_1_suave <= this.ListaTrigoSuaveLinea[1].minimo) || (delta_1_suave >= this.ListaTrigoSuaveLinea[1].maximo && delta_1_suave <= this.ListaTrigoSuaveLinea[1].intervalomaximo)) {return 'amber'}
                      else{return 'red'}})() },
                    label: { show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black'} }], 
                    symbolSize: 20,
                    z:20}],
  
                    graphic: [
                      { type: 'text',left: '70%',top: '70%',
                        style: {text: `Tolerancia: ${(this.ListaTrigoSuaveLinea[1].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                                fill: 'black',align: 'center', verticalAlign: 'middle'}}]
      })}

  }
  public AceitePalmaChart(){
    
//############### PARA ACEITE DE PALMA  ######################################

const ListaAceitePalmaPositivo = this.ListaAceitePalma.map(obj => {
  const newObj: any = { ...obj };
  for (const key in newObj) {
      if (typeof newObj[key] === 'number') {newObj[key] = Math.abs(newObj[key]);
      }
  }
  return newObj;
});
const ListastackaAceitePalma=this.ListaAceitePalma.map(item=>({
  Periodo:item.periodo,
  Necesidad:0,
  Fisico:item.tm_NECESIDAD+item.tm_FISICO,
  Pricing:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING,
  HedgePL:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl,
  HedgePC:item.tm_NECESIDAD+item.tm_FISICO+item.tm_PRICING+item.hedgepl+item.hedgepc,
  PosicionDelta:0
}))
const AceitePalmaoriginal_0:number[]=Object.values(this.ListaAceitePalma[0]).filter((value): value is number => typeof value === 'number')

//GRAFICO CASCADA
// CASCADA NUMERO 1
const chartIdBarraPalma_0=`main_${this.ListaAceitePalma[0].periodo}_AceitePalma`
this.initializeChart(chartIdBarraPalma_0, {
  tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params: any) {
          const index = params[1].dataIndex;
          const value = AceitePalmaoriginal_0[index];
          let borderColor = '#cccccc';
          if (index === 0 || index === AceitePalmaoriginal_0.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
          else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
          return `<div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
              <strong>${params[1].name}</strong><br/>
              ${params[1].seriesName}: ${value.toFixed(2)}
            </div>`},
        padding: 0,
        backgroundColor: 'transparent', 
        textStyle: {color: '#333333' }},
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', splitLine: { show: false }, 
  data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
  yAxis: {name:this.ListaAceitePalma[0].periodo, type: 'value' ,nameLocation: 'middle',
    nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
  series: [
    { type: 'bar',
      stack: 'Necesidad',
      itemStyle: {borderColor: 'transparent', color: 'transparent'  },
      emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
      data: Object.values(ListastackaAceitePalma[0]).filter((value): value is number => typeof value === 'number')},
    { name:this.ListaAceitePalma[0].periodo,
      type: 'bar',
      stack: 'Necesidad',
      label: {show: true, position: 'top', color:'black',
        formatter: function (params) {
          const originalValues = AceitePalmaoriginal_0;
          return originalValues[params.dataIndex].toFixed(1).toString()}},
      itemStyle: {
        color: function (params) {
          const originalValues = AceitePalmaoriginal_0;
          const index = params.dataIndex;
          const value = originalValues[index];      
          if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
          else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
        },
        borderWidth:2,
      },
      data: Object.values(ListaAceitePalmaPositivo[0]).filter((value): value is number => typeof value === 'number')
    }
  ]
})
  
// CASCADA NUMERO 2
const AceitePalmaoriginal_1:number[]=Object.values(this.ListaAceitePalma[1]).filter((value): value is number => typeof value === 'number')
const chartIdBarraPalma_1=`main_${this.ListaAceitePalma[1].periodo}_AceitePalma`
this.initializeChart(chartIdBarraPalma_1, {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: function (params: any) {
      const index = params[1].dataIndex;
      const value = AceitePalmaoriginal_1[index];
      let borderColor = '#cccccc';
      if (index === 0 || index === AceitePalmaoriginal_1.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
      else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
      return `
        <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
          <strong>${params[1].name}</strong><br/>
          ${params[1].seriesName}: ${value.toFixed(2)}
        </div>
      `;
    },
    padding: 0,
    backgroundColor: 'transparent', 
    textStyle: {color: '#333333' }
  }
,      
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', splitLine: { show: false }, 
  data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
  yAxis: {name:this.ListaAceitePalma[1].periodo, type: 'value' ,nameLocation: 'middle',
    nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
  series: [
    {
      type: 'bar',
      stack: 'Necesidad',
      itemStyle: {borderColor: 'transparent', color: 'transparent'  },
      emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
      data: Object.values(ListastackaAceitePalma[1]).filter((value): value is number => typeof value === 'number')
    },
    { name:this.ListaAceitePalma[1].periodo,
      type: 'bar',
      stack: 'Necesidad',
      label: {
        show: true,
        position: 'top',
        color:'black',
        formatter: function (params) {
          const originalValues = AceitePalmaoriginal_1;
          return originalValues[params.dataIndex].toFixed(1).toString()}
      },
      itemStyle: {
        color: function (params) {
          const originalValues = AceitePalmaoriginal_1;
          const index = params.dataIndex;
          const value = originalValues[index];
          if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
          else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
        },
        borderWidth:2,
      },
      data: Object.values(ListaAceitePalmaPositivo[1]).filter((value): value is number => typeof value === 'number')
    }
  ]
})
// CASCADA NUMERO 3
if(this.ListaAceitePalma &&this.ListaAceitePalma[2] &&this.ListaAceitePalma[2].periodo){
const AceitePalmaoriginal_2:number[]=Object.values(this.ListaAceitePalma[2]).filter((value): value is number => typeof value === 'number')
const chartIdBarraPalma_2=`main_${this.ListaAceitePalma[2].periodo}_AceitePalma`
this.initializeChart(chartIdBarraPalma_2, {
tooltip: {
trigger: 'axis',
axisPointer: { type: 'shadow' },
formatter: function (params: any) {
  const index = params[1].dataIndex;
  const value = AceitePalmaoriginal_2[index];
  let borderColor = '#cccccc';
  if (index === 0 || index === AceitePalmaoriginal_2.length - 1) {borderColor = 'rgba(128, 128, 128, 0.6)' } 
  else if (value > 0) {borderColor = 'rgba(0, 128, 0, 0.5)'} else {borderColor = 'rgba(255, 0, 0, 0.5)'}
  return `
    <div style="border: 2px solid ${borderColor}; padding: 10px; border-radius: 8px; background-color: #f5f5f5; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);">
      <strong>${params[1].name}</strong><br/>
      ${params[1].seriesName}: ${value.toFixed(2)}
    </div>
  `;
},
padding: 0,
backgroundColor: 'transparent', 
textStyle: {color: '#333333' }
}
,      
grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
xAxis: { type: 'category', splitLine: { show: false }, 
data: ['Necesidad', 'Físico', 'Pricing', 'HedgePL', 'HedgePC', 'Posición Delta']},
yAxis: {name:this.ListaAceitePalma[2].periodo, type: 'value' ,nameLocation: 'middle',
nameTextStyle: {fontSize: 14, color: '#333',fontWeight: 'bold',padding: [0, 0, 10, 0],},},
series: [
{
  type: 'bar',
  stack: 'Necesidad',
  itemStyle: {borderColor: 'transparent', color: 'transparent'  },
  emphasis: {itemStyle: { borderColor: 'transparent', color: 'transparent' }},
  data: Object.values(ListastackaAceitePalma[2]).filter((value): value is number => typeof value === 'number')
},
{ name:this.ListaAceitePalma[2].periodo,
  type: 'bar',
  stack: 'Necesidad',
  label: {
    show: true,
    position: 'top',
    color:'black',
    formatter: function (params) {
      const originalValues = AceitePalmaoriginal_2;
      return originalValues[params.dataIndex].toFixed(1).toString()}
  },
  itemStyle: {
    color: function (params) {
      const originalValues = AceitePalmaoriginal_2;
      const index = params.dataIndex;
      const value = originalValues[index];
      if (index === 0 || index === originalValues.length - 1) {return 'rgba(128, 128, 128, 0.6)'} 
      else if (value > 0) {return 'rgba(0, 128, 0, 0.3)'} else {return 'rgba(255, 0, 0, 0.3)'}
    },
    borderWidth:2,
  },
  data: Object.values(ListaAceitePalmaPositivo[2]).filter((value): value is number => typeof value === 'number')
}
]
})
}

//GRAFICO PARA LA LINEA
//#1 GRAFICO PARA LA LINEA
const delta_0_palma= this.ListaAceitePalmaLinea[0].posicionDelta; 
  const minInterval_0_palma = Math.min(this.ListaAceitePalmaLinea[0].intervalominimo, delta_0_palma); 
  const maxInterval_0_palma = Math.max(this.ListaAceitePalmaLinea[0].intervalomaximo, delta_0_palma);
const chartIdLineaAceitePalma_0=`main_${this.ListaAceitePalmaLinea[0].periodo}_AceitePalma_linea`
this.initializeChart(chartIdLineaAceitePalma_0, {
  title: { text: this.ListaAceitePalmaLinea[0].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
  grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
  xAxis: {type: 'value', min: minInterval_0_palma, max: maxInterval_0_palma,
          axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
  yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
  series: [
    {
      name: 'Rango',
      type: 'line',
      data: [[this.ListaAceitePalmaLinea[0].minimo, 0], [this.ListaAceitePalmaLinea[0].maximo, 0]], // Coordenadas del rango
      lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
      markPoint: {
        data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaAceitePalmaLinea[0].minimo), xAxis: this.ListaAceitePalmaLinea[0].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
               { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaAceitePalmaLinea[0].maximo), xAxis: this.ListaAceitePalmaLinea[0].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
        label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
    },
    // Punto scatter
    {
      name: 'Punto',
      type: 'scatter',
      data: [{ value: [this.ListaAceitePalmaLinea[0].posicionDelta, 0], 
               itemStyle: {color: (() => {
               if (delta_0_palma >= this.ListaAceitePalmaLinea[0].minimo && delta_0_palma <= this.ListaAceitePalmaLinea[0].maximo) {return 'green'}
                else if ((delta_0_palma >= this.ListaAceitePalmaLinea[0].intervalominimo && delta_0_palma <= this.ListaAceitePalmaLinea[0].minimo) || (delta_0_palma >= this.ListaAceitePalmaLinea[0].maximo && delta_0_palma <= this.ListaAceitePalmaLinea[0].intervalomaximo)) {return 'amber'}
               else{return 'red'}})()},
               label: {show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black' } }], 
               symbolSize: 20,
               z:20
    }
  ],
  graphic: [
    { type: 'text',left: '70%',top: '70%',
      style: {text: `Tolerancia: ${(this.ListaAceitePalmaLinea[0].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
              fill: 'black',align: 'center', verticalAlign: 'middle'}}]
})
//#2 GRAFICO PARA LA LINEA
if(this.ListaAceitePalmaLinea &&this.ListaAceitePalmaLinea[1] &&this.ListaAceitePalmaLinea[1].periodo){
  const delta_1_palma= this.ListaAceitePalmaLinea[1].posicionDelta; 
  const minInterval_1_palma = Math.min(this.ListaAceitePalmaLinea[1].intervalominimo, delta_1_palma); 
  const maxInterval_1_palma = Math.max(this.ListaAceitePalmaLinea[1].intervalomaximo, delta_1_palma);
const chartIdLineaAceitePalma_1=`main_${this.ListaAceitePalmaLinea[1].periodo}_AceitePalma_linea`
this.initializeChart(chartIdLineaAceitePalma_1, {
  title: { text: this.ListaAceitePalmaLinea[1].periodo,  left: 'left',  top: 'left', textStyle: { fontSize: 18, fontWeight: 'bold', color: 'black'}},
  grid: {left: '10%',right: '10%',top: '15%',bottom: '15%',borderColor:'gray',borderWidth:1,show:true},
  xAxis: {type: 'value', min: minInterval_1_palma, max:maxInterval_1_palma,
          axisLabel: { show: false }, axisLine: { show: true, lineStyle: {type: 'dashed', color: 'gray', width: 2}}, axisTick: { show: false },splitLine: { show: false }},
  yAxis: {type: 'value', min: -1,max: 1, axisLine: { show: false },axisTick: { show: false },axisLabel: { show: false },splitLine: { show: false }},
  series: [
    {
      name: 'Rango',
      type: 'line',
      data: [[this.ListaAceitePalmaLinea[1].minimo, 0], [this.ListaAceitePalmaLinea[1].maximo, 0]], // Coordenadas del rango
      lineStyle: {color: 'rgba(128, 128, 128, 0.6)',width: 8},
      markPoint: {
        data: [{ name: 'Min', value: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaAceitePalmaLinea[1].minimo), xAxis: this.ListaAceitePalmaLinea[1].minimo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 },
               { name: 'Max', value:  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.ListaAceitePalmaLinea[1].maximo), xAxis: this.ListaAceitePalmaLinea[1].maximo, yAxis: 0, symbolOffset: [0, 0],symbolSize: 20 }],
        label: {show: true,position: 'bottom',fontSize: 15,color: 'black'}}
    },
    // Punto scatter
    {
      name: 'Punto',
      type: 'scatter',
      data: [{value: [this.ListaAceitePalmaLinea[1].posicionDelta, 0], 
              itemStyle: {color: (() => {
                if (delta_1_palma >= this.ListaAceitePalmaLinea[1].minimo && delta_1_palma <= this.ListaAceitePalmaLinea[1].maximo) {return 'green'}
                 else if ((delta_1_palma >= this.ListaAceitePalmaLinea[1].intervalominimo && delta_1_palma <= this.ListaAceitePalmaLinea[1].minimo) || (delta_1_palma >= this.ListaAceitePalmaLinea[1].maximo && delta_1_palma <= this.ListaAceitePalmaLinea[1].intervalomaximo)) {return 'amber'}
                else{return 'red'}})() },
              label: { show: true,position: 'top',formatter: (params) => {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(params.value[0])},fontSize: 15,color: 'black'} }], 
              symbolSize: 20,
              z:20}],

              graphic: [
                { type: 'text',left: '70%',top: '70%',
                  style: {text: `Tolerancia: ${(this.ListaAceitePalmaLinea[1].tolerancia / 1000).toFixed(1)} kTM`, fontSize: 16,
                          fill: 'black',align: 'center', verticalAlign: 'middle'}}]
})}

  }

  private initializeChart(chartId: string, options: echarts.EChartsOption): void {
    const waitForDom = setInterval(() => {
        const chartDom = document.getElementById(chartId);
        if (chartDom) {
            clearInterval(waitForDom); // Detiene el intervalo una vez encontrado el DOM
            const myChart = echarts.init(chartDom);
            myChart.setOption(options);
        }
    }, 100); // Verifica cada 100 ms
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



private clearAllCharts(): void {
  const chartIds: string[] = [];

  // Validar y agregar IDs para Aceite Soya
  if (this.ListaAceiteSoya?.length) {
      this.ListaAceiteSoya.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_AceiteSoya`);
          }
      });
  }
  if (this.ListaAceiteSoyaLinea?.length) {
      this.ListaAceiteSoyaLinea.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_AceiteSoya_linea`);
          }
      });
  }

  // Validar y agregar IDs para Harina Soya
  if (this.ListaHarinaSoya?.length) {
      this.ListaHarinaSoya.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_HarinaSoya`);
          }
      });
  }
  if (this.ListaHarinaSoyaLinea?.length) {
      this.ListaHarinaSoyaLinea.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_HarinaSoya_linea`);
          }
      });
  }

  // Validar y agregar IDs para Trigo Corrector
  if (this.ListaTrigocorrector?.length) {
      this.ListaTrigocorrector.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_TrigoCorrector`);
          }
      });
  }
  if (this.ListaTrigocorrectorLinea?.length) {
      this.ListaTrigocorrectorLinea.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_TrigoCorrector_linea`);
          }
      });
  }

  // Validar y agregar IDs para Trigo Económico
  if (this.ListaTrigoEconomico?.length) {
      this.ListaTrigoEconomico.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_TrigoEconomico`);
          }
      });
  }
  if (this.ListaTrigoEconomicoLinea?.length) {
      this.ListaTrigoEconomicoLinea.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_TrigoEconomico_linea`);
          }
      });
  }

  // Validar y agregar IDs para Trigo Suave
  if (this.ListaTrigoSuave?.length) {
      this.ListaTrigoSuave.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_TrigoSuave`);
          }
      });
  }
  if (this.ListaTrigoSuaveLinea?.length) {
      this.ListaTrigoSuaveLinea.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_TrigoSuave_linea`);
          }
      });
  }

  // Validar y agregar IDs para Aceite Palma
  if (this.ListaAceitePalma?.length) {
      this.ListaAceitePalma.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_AceitePalma`);
          }
      });
  }
  if (this.ListaAceitePalmaLinea?.length) {
      this.ListaAceitePalmaLinea.forEach((item, index) => {
          if (item?.periodo) {
              chartIds.push(`main_${item.periodo}_AceitePalma_linea`);
          }
      });
  }

  // Recorre y elimina cada gráfico, si existe
  chartIds.forEach(chartId => {
      const chartDom = document.getElementById(chartId);
      if (chartDom) {
          const existingChart = echarts.getInstanceByDom(chartDom);
          if (existingChart) {
              existingChart.dispose(); // Limpia el gráfico
          }
      }
  });
}


//CARGANDO DATA DEL PDF
public obteniendodatapdf(){
  this.serviciocargadelta.obtenerdeltahedgePDF(parseInt(this.pFechaInicio)).subscribe(
    (response: objdeltahedgePDF[]) => {this.ListaDeltahedgePDF=response;console.log(this.ListaDeltahedgePDF)})
}
formatDate(fecha: string): string {
  const year = fecha.substring(0, 4);
  const month = parseInt(fecha.substring(4, 6), 10);
  const day = fecha.substring(6, 8);

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const mesTexto = meses[month - 1]; // Meses son 0-indexados en el array

  return `${day}-${mesTexto}-${year}`;
}
generatePdf(producto) {

  const productDescriptions: { [key: string]: string } = {
    '5': 'Aceite de Soya',
    '4': 'Harina de Soya',
    '63': 'Trigo Corrector',
    '62': 'Trigo Económico',
    '61': 'Trigo Suave',
    '7': 'Aceite de Palma',
  };

  // Obtener la descripción del producto
  const descripcionProducto = productDescriptions[producto] || 'Producto desconocido';
  const fechaFormateada = this.formatDate(this.pFechaInicio);

  const ListaDeltahedgePDF_Aceite=this.ListaDeltahedgePDF.filter(item=>item.comoditie==producto)
const nuevoListaDeltahedgePDF=ListaDeltahedgePDF_Aceite.map(item=>({
  ...item,
  mespdf:convertirFecha(item.mescontrato)
}))
const valoresPorDefecto = { comoditie: '', mescontrato: '', necesidadcompra: 0, comprabases: 0, bases: 0, compraterceros: 0, pricing: 0, futurosctv: 0, swaps: 0, futuros: 0, opcion_tn: 0, opcion_delta: 0, fechareporte: 0, mespdf: '' };
const secuenciameses=generarSecuenciaSemestres('20250104')
const arreglofinal_0: typeof nuevoListaDeltahedgePDF = [];

secuenciameses.forEach(mes => {
  const objencontrado = nuevoListaDeltahedgePDF.find(item => item.mespdf === mes); 
  if (objencontrado) { arreglofinal_0.push(objencontrado); } 
  else { arreglofinal_0.push({ ...valoresPorDefecto, mespdf: mes }); } });

const arreglofinal_1=arreglofinal_0.map(item=>({...item,sempdf:convertToSemester(item.mespdf)}))

const primerosSeisMeses = arreglofinal_1.slice(0, 6);
console.log(primerosSeisMeses)
const todoElAño = arreglofinal_1;
const inicial = {
  bases:null,
  comprabases: 0,
  compraterceros: 0,
  futuros: 0,
  futurosctv: null,
  necesidadcompra: 0,
  swaps: 0,
  opcion_delta: 0,
  opcion_tn: 0,
  pricing: 0,
  mespdf: "",
  sempdf: "",
};

// Suma para los primeros seis meses
const sumaPrimerosSeisMeses = primerosSeisMeses.reduce((acumulado, actual) => {
  
  acumulado.swaps += actual.swaps || 0;
  acumulado.comprabases += actual.comprabases || 0;
  acumulado.compraterceros += actual.compraterceros || 0;
  acumulado.futuros += actual.futuros || 0;
  acumulado.necesidadcompra += actual.necesidadcompra || 0;
  acumulado.opcion_delta += actual.opcion_delta || 0;
  acumulado.opcion_tn += actual.opcion_tn || 0;
  acumulado.pricing += actual.pricing || 0;

  return acumulado;
}, { ...inicial });

// Cambia el mespdf para la suma total
sumaPrimerosSeisMeses.mespdf = primerosSeisMeses[0]?.sempdf;

// Suma para todo el año
const sumaTodoElAño = todoElAño.reduce((acumulado, actual) => {
  acumulado.swaps+=actual.swaps
  acumulado.comprabases += actual.comprabases || 0;
  acumulado.compraterceros += actual.compraterceros || 0;
  acumulado.futuros += actual.futuros || 0;
  acumulado.necesidadcompra += actual.necesidadcompra || 0;
  acumulado.opcion_delta += actual.opcion_delta || 0;
  acumulado.opcion_tn += actual.opcion_tn || 0;
  acumulado.pricing += actual.pricing || 0;
  return acumulado;
}, { ...inicial });

// Cambia el mespdf para la suma total del año
sumaTodoElAño.mespdf = "Posicion Neta";
const arreglofinal_2 = [sumaTodoElAño,sumaPrimerosSeisMeses,...arreglofinal_1];
const arreglofinal=arreglofinal_2.map(item=>({
  ...item,
  div_bases:item.necesidadcompra !== 0 ? (item.comprabases / item.necesidadcompra)*100 : 0,
  div_priced:item.necesidadcompra !== 0 ? ((item.compraterceros+item.pricing) / item.necesidadcompra)*100 : 0,
  div_hedge:item.necesidadcompra !== 0 ? (Math.abs((item.swaps+item.futuros+item.opcion_tn)) / item.necesidadcompra)*100 : 0,
  total_PL:item.compraterceros+item.pricing,
  total_PC:item.necesidadcompra,
  posicion_total:item.compraterceros+item.pricing-item.necesidadcompra,
  TotalPosIFD_tn:item.swaps+item.futuros+item.opcion_tn,
  TotalPosIFD_delta:item.swaps+item.futuros+item.opcion_delta,
  TotalPos_Neta_tn:item.compraterceros+item.pricing-item.necesidadcompra+item.swaps+item.futuros+item.opcion_tn, 
  TotalPos_Neta_delta:item.compraterceros+item.pricing-item.necesidadcompra+item.swaps+item.futuros+item.opcion_delta

}))

console.log(arreglofinal)

const docDefinition = {
  pageOrientation: 'landscape',
  content: [
    
    { text: `Posición : ${descripcionProducto}`, style: 'title' },
    {
      table: {
        minCellHeight: 60,
        headerRows: 2, 
        widths: [90, ...Array(20).fill('auto')],
        body: [
        // Encabezados con estilo aplicado
        [
          { text: fechaFormateada, style: 'header',border:[false,true,true, true],borderColor: ['White', 'black', 'white', [200, 15, 30]]}, 
          ...combinarCeldasHorizontales(arreglofinal, 'sempdf', 'header'),
        ],
        [{ text: '', style: 'header',border:[false,true,true, true],borderColor: ['white', [200, 15, 30], 'white', 'black']}, ...arreglofinal.map((item,index) => ({ text: item.mespdf, style: 'header' ,borderColor: ['white', 'white', 'white', 'black']}))],
        // Filas de datos con formato y estilo
        [{text: 'Necesidad Compra',style: 'dataColumn',border:[false,true,true, true]},
        ...arreglofinal.map((item, index) => {
          const value = item.necesidadcompra;
          const isNegative = value*-1 < 0;
          return {
            text: isNegative? `(${Math.abs(value).toLocaleString('en-US')})`: value.toLocaleString('en-US'),
            style: 'dataRow',
            color: isNegative ? 'red' : 'black', 
            border: [false,true,index==13||index==7||index==1?true:false, true],
            borderStyle: {
              lineWidth: 0.1,
              lineColor: '#d9d9d9',
            },
          };
        }),
        ],
        [{text: '',colSpan: arreglofinal.length + 1,border: [false, false, false, false], style: 'emptyRow',height: 50},...Array(arreglofinal.length).fill({text: '',border: [false, false, false, false],style: 'emptyRow',height: 50})],
        [{ text: 'Compras en Bases', style: 'dataColumn',border:[false,true,true, false] },...arreglofinal.map((item,index) => ({
            text: Math.round(item.comprabases).toLocaleString('en-US'),
            style: 'dataRow',
            border: [false,true,index==13||index==7||index==1?true:false, false]
          }))],
          [
            { text: 'Bases cts/lb', style: 'dataColumn', border: [false, false, true, false] },
            ...arreglofinal.map((item, index) => ({
              text: item.bases !== null 
                ? `$${item.bases.toFixed(1)}` 
                : '', // Reemplaza '-' con el valor que desees mostrar si es null
              style: 'dataRow',
              border: [false, false, index == 13 || index == 7 || index == 1 ? true : false, false]
            }))
          ]
          ,
        [{ text: '% Bases', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => ({
            text: `${item.div_bases.toFixed(0)}%`,style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}))],
        [{text: '',colSpan: arreglofinal.length + 1,border: [false, true, false, true], style: 'emptyRow',height: 50},...Array(arreglofinal.length).fill({text: '',border: [false, true, false, true],style: 'emptyRow',height: 50,})],
        [{ text: 'Compra a Terceros (Flat)', style: 'dataColumn',border:[false,true,true, false] },...arreglofinal.map((item,index) => ({
            text: Math.round(item.compraterceros).toLocaleString('en-US'), style: 'dataRow', border: [false,true,index==13||index==7||index==1?true:false, false]}))],
        [{ text: 'Pricing', style: 'dataColumn',border:[false,false,true, false] },...arreglofinal.map((item,index) => ({
              text: Math.round(item.pricing).toLocaleString('en-US'), style: 'dataRow', border: [false,false,index==13||index==7||index==1?true:false, false]}))],
              [
                { text: 'Futuros ctvs/lb', style: 'dataColumn', border: [false, false, true, false] },
                ...arreglofinal.map((item, index) => ({
                  text: item.futurosctv !== null 
                    ? `$${item.futurosctv.toFixed(1)}` 
                    : '', // Reemplaza '-' con el valor que desees mostrar si es null
                  style: 'dataRow',
                  border: [false, false, index == 13 || index == 7 || index == 1 ? true : false, false]
                }))
              ]
              ,
        [{ text: '% Priced', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => ({
                  text: `${item.div_priced.toFixed(0)}%`,style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}))],     
        [{text: '',colSpan: arreglofinal.length + 1,border: [false, true, false, true], style: 'emptyRow',height: 50},...Array(arreglofinal.length).fill({text: '',border: [false, true, false, true],style: 'emptyRow',height: 50})],    
        [{ text: 'Total Pos. Larga', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => ({
          text: Math.round(item.total_PL).toLocaleString('en-US'),style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}))], 
        [{ text: 'Total Pos. Corta', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => {
          const value = item.total_PC;
          const isNegative = value*-1 < 0;
          return{
            text: isNegative? `(${Math.abs(value).toLocaleString('en-US')})`: value.toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
            style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}})
          ], 
        [{text: '',colSpan: arreglofinal.length + 1,border: [false, false, false, false], style: 'emptyRow',height: 50},...Array(arreglofinal.length).fill({text: '',border: [false, true, false, true],style: 'emptyRow',height: 50})],
        [{ text: 'Total Posicion Neta Fisico', style: 'dataColumn',border:[false,true,true, true] },...arreglofinal.map((item,index) => {
          const value = item.posicion_total;
          const isNegative = value < 0;
          return{
            text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
            style: 'subtotal',border: [false,true,index==13||index==7||index==1?true:false, true]}})
          ], 
        [{text: '',colSpan: arreglofinal.length + 1,border: [false, true, false, true], style: 'emptyRow',height: 50},...Array(arreglofinal.length).fill({text: '',border: [false, true, false, true],style: 'emptyRow',height: 50})],
        [{ text: 'Swaps', style: 'dataColumn',border:[false,true,true, false] },...arreglofinal.map((item,index) => {
          const value = item.swaps;
        const isNegative = value < 0;
        return{
          text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
          style: 'dataRow',border: [false,false,index==13||index==7||index==1?true:false, false]}})
        ],
        [{ text: 'Futuros', style: 'dataColumn',border:[false,false,true, false] },...arreglofinal.map((item,index) =>  {
          const value = item.futuros;
        const isNegative = value < 0;
        return{
          text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
          style: 'dataRow',border: [false,false,index==13||index==7||index==1?true:false, false]}})
          ],
        [{ text: 'Opciones (tn)', style: 'dataColumn',border:[false,false,true, false] },...arreglofinal.map((item,index) => {
          const value = item.opcion_tn;
        const isNegative = value < 0;
        return{
          text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
          style: 'dataRow',border: [false,false,index==13||index==7||index==1?true:false, false]}})
            ],
        [{ text: 'Opciones (delta)', style: 'dataColumn',border:[false,false,true, false] },...arreglofinal.map((item,index) => {
          const value = item.opcion_delta;
        const isNegative = value < 0;
        return{
          text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
          style: 'dataRow',border: [false,false,index==13||index==7||index==1?true:false, false]}})
              ],
        [{ text: '% Hedged', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => ({
                  text: `${item.div_hedge.toFixed(0)}%`,style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}))],
        [{text: '',colSpan: arreglofinal.length + 1,border: [false, true, false, true], style: 'emptyRow',height: 50},...Array(arreglofinal.length).fill({text: '',border: [false, true, false, true],style: 'emptyRow',height: 50})],
        [{ text: 'Total Pos. IFDs (tn)', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => {
          const value = item.TotalPosIFD_tn;
            const isNegative = value < 0;
            return{
              text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
              style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}})
        ], 
        [{ text: 'Total Pos. IFDs (delta)', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => {
          const value = item.TotalPosIFD_delta;
            const isNegative = value < 0;
            return{
              text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
              style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}})
          ],

        [{text: '',colSpan: arreglofinal.length + 1,border: [false, true, false, true], style: 'emptyRow',height: 50},...Array(arreglofinal.length).fill({text: '',border: [false, true, false, true],style: 'emptyRow',height: 50})],
        [{ text: 'Total Posición Neta (tn)', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => {
            const value = item.TotalPos_Neta_tn;
            const isNegative = value < 0;
            return{
              text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
              style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}})
            ],   
        [{ text: 'Total Posición Neta (delta)', style: 'dataColumn',border:[false,false,true, true] },...arreglofinal.map((item,index) => {
              const value = item.TotalPos_Neta_delta;
              const isNegative = value< 0;
              return{
                text: isNegative? `(${Math.abs(Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toLocaleString('en-US'),color: isNegative ? 'red' : 'black', 
                style: 'subtotal',border: [false,false,index==13||index==7||index==1?true:false, true]}})
              ], 
          ]
      }
    }
  ],
  styles: {
    title: {
      fontSize: 20,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    header: {
      bold: true,
      fontSize: 7,
      fillColor: [200, 15, 30],
      color: 'white',
      alignment: 'center',
      borderWidth: [2, 2, 2, 4]
    },
    subheader: {
      italics: true,
      fillColor: '#f9f9f9',
      alignment: 'center',
    },
    dataRow: {
      fontSize: 7, // Tamaño de fuente para las filas de datos
      alignment: 'center',
      bold: false
    },
    dataColumn: {
      fontSize: 7,
      bold: true,
      fillColor: '#d9d9d9', // Color de fondo para la columna
      alignment: 'left',
    },
    emptyRow: {
      fillColor: '#ffffff',
    },
    subtotal:{
      fontSize: 7,
      bold: true,
      fillColor: '#d9d9d9', // Color de fondo para la columna
      alignment: 'center', 
      lineWidth: 0.1

    }
  },
}
pdfMake.createPdf(docDefinition).download( `Posición : ${descripcionProducto}_${fechaFormateada}.pdf`);

}





}

function convertirFecha(cadena: string): string {
  const año = cadena.slice(0, 4);
  const mes = parseInt(cadena.slice(4, 6), 10);

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  return `${meses[mes - 1]}-${año.slice(2, 4)}`;
}
function generarSecuenciaSemestres(fechaCadena: string): string[] { 
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]; 
  const secuencia: string[] = []; 
  const añoActual = parseInt(fechaCadena.slice(0, 4), 10);
   const mesActual = parseInt(fechaCadena.slice(4, 6), 10); 
   // Determinar el semestre 
   let añoInicio = añoActual;
   let mesInicio = mesActual <= 6 ? 0 : 6; 
   if (mesActual > 6){ añoInicio = añoActual; mesInicio = 6;} else { mesInicio = 0}
   for (let i = 0; i < 18; i++) {
    const mes = (mesInicio + i) % 12;
    const año = añoInicio + Math.floor((mesInicio + i) / 12);
    secuencia.push(`${meses[mes]}-${año.toString().slice(2, 4)}`);} 
     return secuencia; }

function convertToSemester(attribute: string): string {
      // Mapeo de los meses al semestre correspondiente
      const semesterMap: { [key: string]: string } = {
        "Ene": "1S",
        "Feb": "1S",
        "Mar": "1S",
        "Abr": "1S",
        "May": "1S",
        "Jun": "1S",
        "Jul": "2S",
        "Ago": "2S",
        "Sep": "2S",
        "Oct": "2S",
        "Nov": "2S",
        "Dic": "2S"
      };
    
      // Separar el atributo en mes y año
      const [month, year] = attribute.split("-");
    
      // Obtener el semestre correspondiente al mes
      const semester = semesterMap[month];
    
      if (!semester) {
        throw new Error(`Mes inválido: ${month}`);
      }
    
      // Retornar el formato "[semestre][año]"
      return `${semester}${year}`;
    }
function combinarCeldasHorizontales(array: any[], key: string, style: string): any[] {
      const result: any[] = [];
      let colSpanCount = 1;
    
      for (let i = 0; i < array.length; i++) {
        if (i > 0 && array[i][key] === array[i - 1][key]) {
          colSpanCount++;
          // Usa "as any" para asegurar que pdfMake acepte esta celda
          result.push({ text: '', colSpan: 0 } as any);
        } else {
          if (colSpanCount > 1) {
            result[result.length - colSpanCount].colSpan = colSpanCount;
          }
          colSpanCount = 1;
          // Usa "as any" para evitar el error de tipos
          result.push({ text: array[i][key], style, colSpan: 1 ,borderColor: ['white', 'black', 'white', 'white']} as any);
        }
      }
    
      // Ajustar colSpan acumulado para la última celda combinada
      if (colSpanCount > 1) {
        result[result.length - colSpanCount].colSpan = colSpanCount;
      }
    
      return result;
    }
    