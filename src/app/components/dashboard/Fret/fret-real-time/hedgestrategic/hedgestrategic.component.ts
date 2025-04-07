import { Component, OnDestroy , OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FretService } from 'src/app/models/Fret/fret.service';
import { ListaHedge } from 'src/app/models/IFD/datoshedge';
import { ListaHedgeAbierto } from 'src/app/models/IFD/datoshedgeabierto';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { FretRealTimeService } from 'src/app/shared/services/FretRealTimeService';
type tipoMeses = {
  [Mes: string]: number;
};
interface Producto {
  categoria: string;
  meses: tipoMeses;  
  totalSum: number; // Propiedad para la suma total de todos los meses por categoría
  resultadoAbierto: number; // Propiedad para el valor de 'ResultadoSuma_abierto' correspondiente a la categoría
}
@Component({
  selector: 'app-hedgestrategic',
  templateUrl: './hedgestrategic.component.html',
  styleUrls: ['./hedgestrategic.component.scss']
})
export class HedgestrategicComponent implements OnInit,OnDestroy {

  private subscriptionHedge: Subscription;
  public ListadataHedge:ListaHedge[]=[];
  public ListadataHedgeDS:MatTableDataSource<ListaHedge>;
  public ListadataHedgeAbierto:ListaHedgeAbierto[]=[];
  public ListadataHedgeAbiertoDS:MatTableDataSource<ListaHedgeAbierto>;
  public ListaHedgeabiertoTrigo:ListaHedgeAbierto[]=[];
  public ListaHedgeabiertoSoyCrush:ListaHedgeAbierto[]=[];
  public ListaHedgeabiertoBeans:ListaHedgeAbierto[]=[];
  public ListaHedgeabiertoSBM:ListaHedgeAbierto[]=[];
  public ListaHedgeabiertoSBO:ListaHedgeAbierto[]=[];
  public ListaHedgeabiertoCPO:ListaHedgeAbierto[]=[];
  listasHedge: { [key: string]: ListaHedgeAbierto[] } = {};

  displaycolumnas:string[];
  fechaVigenteEntero: string;
  fechaVigenteString: string;
  fechaVigente: NgbDateStruct | null;
  flgCargando: boolean = false;
  date: Date = new Date();
  displaymeses: string[];
  displaymesescolumnas: string[];
  dataSourceMeses: Producto[];
  factor: number;
  @ViewChild(MatSort) sort: MatSort;
  
  ngAfterViewInit() {
    this.ListadataHedgeDS.sort = this.sort;
  }
  constructor(private servicedataHedge: PortafolioIFDMoliendaService,
              private fretRealTimeService: FretRealTimeService,
              private fretService: FretService) { }

  ngOnDestroy(): void {
    if (this.subscriptionHedge) {
      this.subscriptionHedge.unsubscribe();
    }
  }

  ngOnInit(): void {

    // this.fretService.Fret_Sim_Factores(this.selectedOptions[0]).subscribe(
    //   data=>{
    //     this.factor = data;
    // },
    // (error: HttpErrorResponse) => {
    //   alert(error.message);
    // });
    
    this.date = new Date();
    // this.fretRealTimeService.initWebSocket();
    this.fechaVigente = {day: this.date.getDate(),month: this.date.getMonth() + 1,year: this.date.getFullYear()};
    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);
    this.fechaVigenteString = this.fechaVigenteEntero.substring(7,2) + this.fechaVigenteEntero.substring(5,2) + this.fechaVigenteEntero.substring(1,4)
    this.cargaReporteLiquidHedge(Number(this.fechaVigenteEntero));
    this.cargaReporteAbiertoHedge(Number(this.fechaVigenteEntero));
    
    this.subscriptionHedge = this.fretRealTimeService.getMessages().subscribe(message => {
      console.log('Mensaje recibido en el componente Delta:', message);
      message = "{" + message + "}"
      const data = JSON.parse(message);

      if(data.tipo == 'precios'){
        if (data.ticker.startsWith("MW")) {
          data.ticker = "MWE" + data.ticker.substring(2);
        }

        this.ListaHedgeabiertoTrigo.forEach(objRegistro => {
          if(!objRegistro["s374_Ifd"].includes("Papeles")){
            if (objRegistro["s374_Contrato"] == data.ticker.replace(/\s/g, '')) {
              objRegistro["precioAnterior"] = objRegistro["precioActual"];
              objRegistro["precioActual"] = data.precio;
  
              if(objRegistro["s374_Ifd"].includes("Futuro")){
                objRegistro["s374_M2M"] = ((objRegistro["precioActual"] - objRegistro["s374_Strike"]) * objRegistro["s374_NumeroContratos"] * 50)
              }
            }            
          }
        });
        this.ListaHedgeabiertoSoyCrush.forEach(objRegistro => {
          if(!objRegistro["s374_Ifd"].includes("Papeles")){
            if (objRegistro["s374_Contrato"] == data.ticker.replace(/\s/g, '')) {
              objRegistro["precioAnterior"] = objRegistro["precioActual"];
              objRegistro["precioActual"] = data.precio;
  
              if(objRegistro["s374_Ifd"].includes("Futuro")){
                objRegistro["s374_M2M"] = ((objRegistro["precioActual"] - objRegistro["s374_Strike"]) * objRegistro["s374_NumeroContratos"] * 50)
              }
            }
          }
          
        });
        this.ListaHedgeabiertoSBM.forEach(objRegistro => {
          if(!objRegistro["s374_Ifd"].includes("Papeles")){
            if (objRegistro["s374_Contrato"] == data.ticker.replace(/\s/g, '')) {
              objRegistro["precioAnterior"] = objRegistro["precioActual"];
              objRegistro["precioActual"] = data.precio;
  
              if(objRegistro["s374_Ifd"].includes("Futuro")){
                objRegistro["s374_M2M"] = ((objRegistro["precioActual"] - objRegistro["s374_Strike"]) * objRegistro["s374_NumeroContratos"] * 100)
              }
  
            }
          }
          
        });
        this.ListaHedgeabiertoBeans.forEach(objRegistro => {
          if(!objRegistro["s374_Ifd"].includes("Papeles")){
            if (objRegistro["s374_Contrato"] == data.ticker.replace(/\s/g, '')) {
              objRegistro["precioAnterior"] = objRegistro["precioActual"];
              objRegistro["precioActual"] = data.precio;
  
              if(objRegistro["s374_Ifd"].includes("Futuro")){
                objRegistro["s374_M2M"] = ((objRegistro["precioActual"] - objRegistro["s374_Strike"]) * objRegistro["s374_NumeroContratos"] * 50)
              }
            }
          }
        });
        this.ListaHedgeabiertoSBO.forEach(objRegistro => {
          if(!objRegistro["s374_Ifd"].includes("Papeles")){
            if (objRegistro["s374_Contrato"] == data.ticker.replace(/\s/g, '')) {
              objRegistro["precioAnterior"] = objRegistro["precioActual"];
              objRegistro["precioActual"] = data.precio;
  
              if(objRegistro["s374_Ifd"].includes("Futuro")){
                objRegistro["s374_M2M"] = ((objRegistro["precioActual"] - objRegistro["s374_Strike"]) * objRegistro["s374_NumeroContratos"] * 600)
              }
            }
          }
        });
        this.ListaHedgeabiertoCPO.forEach(objRegistro => {
          if(!objRegistro["s374_Ifd"].includes("Papeles")){
            if (objRegistro["s374_Contrato"] == data.ticker.replace(/\s/g, '')) {
              objRegistro["precioAnterior"] = objRegistro["precioActual"];
              objRegistro["precioActual"] = data.precio;
  
              if(objRegistro["s374_Ifd"].includes("Futuro")){
                objRegistro["s374_M2M"] = ((objRegistro["precioActual"] - objRegistro["s374_Strike"]) * objRegistro["s374_NumeroContratos"] * 25)
              }
            }            
          }
        });
  
      }else{

        let posicionespacio: number = data.ticker.indexOf(" ");
        let segundoEspacio: number = data.ticker.indexOf(" ", posicionespacio + 1);

        let ticker = data.ticker.slice(0, posicionespacio - 1);
        let strike = data.ticker.slice(posicionespacio + 1, segundoEspacio);

        if (ticker.startsWith("MW")) {
          ticker = "MWE" + ticker.substring(2);
        }
        // const filtradoPrima = response.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
        this.ListaHedgeabiertoSBM.forEach(objRegistro => {
          if((objRegistro["s374_Ifd"].includes("Put") || objRegistro["s374_Ifd"].includes("Call")) && objRegistro["s374_Contrato"] == ticker.replace(/\s/g, '') && 
              objRegistro["s374_Strike"]  ==  strike){

            objRegistro["s374_PrecioProeveedor"] = data.prima

            if(objRegistro["s374_Ifd"].includes("Call")){
              if(objRegistro["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
                objRegistro["s374_M2M"] = ((objRegistro["s374_PrecioProeveedor"] * - 1 - objRegistro["s374_PrimaPagada"]) * objRegistro["s374_NumeroContratos"] * 100)
              }else{
                objRegistro["s374_M2M"] = ((objRegistro["s374_PrecioProeveedor"] - objRegistro["s374_PrimaPagada"]) * objRegistro["s374_NumeroContratos"] * 100)
              }
            }else if(objRegistro["s374_Ifd"].includes("Put")){
              if(objRegistro["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
                objRegistro["s374_M2M"] = ((objRegistro["s374_PrecioProeveedor"] + objRegistro["s374_PrimaPagada"]) * objRegistro["s374_NumeroContratos"] * 100) * -1
              }else{
                objRegistro["s374_M2M"] = ((objRegistro["s374_PrecioProeveedor"] - objRegistro["s374_PrimaPagada"]) * objRegistro["s374_NumeroContratos"] * 100)
              }
            }
          }
          
        });

      }
    });

    
  }
  generateDisplayMeses(año: number): string[] {
      const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                     "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const añoCorto = año % 100; // Obtener los últimos dos dígitos del año
      return meses.map(mes => `${mes}-${añoCorto}`);
    }
  generateObjetoMeses(año: number): tipoMeses {
      const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                     "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const añoCorto = año % 100;
      const mesesObj: tipoMeses = {};  
      meses.forEach(mes => {
        const key = `${mes}-${añoCorto}`;
        mesesObj[key] = 0;
      });
      return mesesObj;
    }
 public cargaReporteLiquidHedge(fechafret:number){
    this.servicedataHedge.getlistahedge(fechafret).subscribe((response:ListaHedge[])=>{this.ListadataHedge=response;
      this.ListadataHedgeDS=new MatTableDataSource(this.ListadataHedge);this.ListadataHedgeDS.sort = this.sort;
      this.ListadataHedge = this.ListadataHedge.map(datos => ({...datos,nuevo_Mes_año: transFecha_mesaño(datos.s373_FechaUnwind)}));
      this.ListadataHedgeDS.sortingDataAccessor = (item, property) => {
        if (property === 's373_FechaTrade' || property === 's373_FechaUnwind' || property === 's373_FechaExpiracion') {
          const [day, month, year] = item[property].split('/');
          return new Date(`${year}-${month}-${day}`);
        }
        return item[property];
      };
      this.tabladinamica();
    })
  }
 public  cargaReporteAbiertoHedge(fechafret:number){
  this.servicedataHedge.getlistahedgeabierto(fechafret).subscribe((response:ListaHedgeAbierto[])=>{
    this.ListadataHedgeAbierto=response;
    this.ListadataHedgeAbiertoDS=new MatTableDataSource(this.ListadataHedgeAbierto);
    this.ListaHedgeabiertoTrigo=this.ListadataHedgeAbierto.filter(miitem=>miitem.commodity=='W');
    this.ListaHedgeabiertoSoyCrush=this.ListadataHedgeAbierto.filter(miitem=>miitem.commodity=='SCR');
    this.ListaHedgeabiertoSBM=this.ListadataHedgeAbierto.filter(miitem=>miitem.commodity=='SM');
    this.ListaHedgeabiertoBeans=this.ListadataHedgeAbierto.filter(miitem=>miitem.commodity=='S');
    this.ListaHedgeabiertoSBO=this.ListadataHedgeAbierto.filter(miitem=>miitem.commodity=='SBO');
    this.ListaHedgeabiertoCPO=this.ListadataHedgeAbierto.filter(miitem=>miitem.commodity=='CPO');
    
    this.ListaHedgeabiertoTrigo = this.ListaHedgeabiertoTrigo.map(objeto => {
      return { ...objeto, precioActual: objeto["precioActual"], precioAnterior: 0, };
    });
    this.ListaHedgeabiertoSoyCrush = this.ListaHedgeabiertoSoyCrush.map(objeto => {
      return { ...objeto, precioActual: objeto["precioActual"], precioAnterior: 0, };
    });
    this.ListaHedgeabiertoSBM = this.ListaHedgeabiertoSBM.map(objeto => {
      return { ...objeto, precioActual: objeto["precioActual"], precioAnterior: 0, };
    });
    this.ListaHedgeabiertoBeans = this.ListaHedgeabiertoBeans.map(objeto => {
      return { ...objeto, precioActual: objeto["precioActual"], precioAnterior: 0, };
    });
    this.ListaHedgeabiertoSBO = this.ListaHedgeabiertoSBO.map(objeto => {
      return { ...objeto, precioActual: objeto["precioActual"], precioAnterior: 0, };
    });
    this.ListaHedgeabiertoCPO = this.ListaHedgeabiertoCPO.map(objeto => {
      return { ...objeto, precioActual: objeto["precioActual"], precioAnterior: 0, };
    });

    this.inicializarUltimoPrecio();this.actualizarListasHedge();

  })
 }
displaycolumnaAbierto=[
  's374_fechatrade',
  's374_Broker',
  's374_Ficha', 
  's374_Sociedad',
  's374_Contrato',
  'precioActual',
  's374_Fechaexpiracion',
  's374_Cobertura',
  's374_NumeroContratos',
  's374_Delta',
  's374_Strike',
  's374_Ifd',
  's374_Estrategia',
  's374_PrimaPagada',
  's374_PrecioProeveedor',
  's374_M2M',
  's374_Comentarios'
]

nombreAbiertoHeaders: { [key: string]: string } = {
  's374_fechatrade': 'Fecha<br>Pacto',
  's374_Broker': 'Broker<br>Referencia',
  's374_Ficha': 'Ficha',
  's374_Sociedad': 'Sociedad',
  's374_Contrato': 'Contrato',
  'precioActual': 'Precio<br> Actual',
  's374_Fechaexpiracion': 'Fecha<br>Expiracion',
  's374_Cobertura': 'Cobertura',
  's374_NumeroContratos': 'Numero<br>Contratos',
  's374_Delta':'Delta',
  's374_Strike': 'Strike',
  's374_Ifd': 'Ifd',
  's374_Estrategia': 'Estrategia',
  's374_PrimaPagada': 'Prima<br>Pagada',
  's374_PrecioProeveedor':' Prima <br> Mercado',
  's374_M2M': 'MTM<br>(US$)',
  's374_Comentarios': 'Comentarios<br>FO'
};
displaycolumnaLiquidado=[
  's373_FechaUnwind',
  's373_FechaTrade',
  's373_Broker', 
  's373_Ficha',
  's373_Sociedad',
  's373_Contrato',
  's373_FechaExpiracion',
  's373_Cobertura',
  's373_NumeroContratos',
  's373_Strike',
  's373_Ifd',
  's373_Estrategia',
  's373_PrimaPagada',
  's373_PrecioProveedor',
  's373_M2M',
  's373_Comentarios'
]

nombreLiquidadoHeaders: { [key: string]: string } = {
  's373_FechaUnwind': 'F. Unwind',
  's373_FechaTrade': 'F. Trade',
  's373_Broker': 'Broker<br>Referencia',
  's373_Ficha': 'Ficha',
  's373_Sociedad': 'Sociedad',
  's373_Contrato': 'Contrato',
  's373_FechaExpiracion': 'Fecha<br>Expiracion',
  's373_Cobertura': 'Cobertura',
  's373_NumeroContratos': 'Numero<br>Contratos',
  's373_Strike': 'Strike',
  's373_Ifd': 'Ifd',
  's373_Estrategia': 'Estrategia',
  's373_PrimaPagada': 'Prima<br>Pagada',
  's373_PrecioProveedor':'Liquidación',
  's373_M2M': 'MTM<br>(US$)',
  's373_Comentarios': 'Comentarios<br>FO'
};
  public ResultadoSuma = {
    listaacumular: [] as string[],
  };
  tabladinamica(){
    
    let Columna_1_Agrupar = "s373_Commodity";
    let Columna_2_Agrupar = "nuevo_Mes_año";
    let Columna_Sumar = "s373_M2M";
    let totalMeses: { [key: string]: number } = {};
    this.ResultadoSuma = {
      listaacumular: [] as string[],
    };
  
    for(let index in this.ListadataHedge){
      const dato = this.ListadataHedge[index];
  
      // Verificar si el primer nivel de agrupación ya existe
      if(this.ResultadoSuma.listaacumular.indexOf(dato[Columna_1_Agrupar]) === -1){
        this.ResultadoSuma.listaacumular.push(dato[Columna_1_Agrupar]);
        this.ResultadoSuma[dato[Columna_1_Agrupar]] = {};
        this.ResultadoSuma[dato[Columna_1_Agrupar]].listaacumular = [];
      }
      // Verificar si el segundo nivel de agrupación ya existe
      if(this.ResultadoSuma[dato[Columna_1_Agrupar]].listaacumular.indexOf(dato[Columna_2_Agrupar]) === -1){
        this.ResultadoSuma[dato[Columna_1_Agrupar]].listaacumular.push(dato[Columna_2_Agrupar]);
        this.ResultadoSuma[dato[Columna_1_Agrupar]][dato[Columna_2_Agrupar]] = {};
        this.ResultadoSuma[dato[Columna_1_Agrupar]][dato[Columna_2_Agrupar]][Columna_Sumar] = 0;
      }
      this.ResultadoSuma[dato[Columna_1_Agrupar]][dato[Columna_2_Agrupar]][Columna_Sumar] += dato[Columna_Sumar];
    }


    const categorias = ["W", "SCR", "S", "SM", "SBO", "CPO"];
    const año = Math.floor(Number(this.fechaVigenteEntero) / 10000);
    const mesesPorCategoria = categorias.reduce((acc, categoria) => {acc[categoria] = this.generateMeses(año);
    return acc;}, {} as { [key: string]: tipoMeses });

    const resultadoFinal = {};

    for (const categoria of categorias) {
         if (this.ResultadoSuma[categoria] && this.ResultadoSuma[categoria].listaacumular) {
                 this[`meses${categoria}`] = this.generateMeses(año); // Inicializar con valores por defecto
    for (const mes of this.ResultadoSuma[categoria].listaacumular) {
      if (this.ResultadoSuma[categoria][mes]){this[`meses${categoria}`][mes]=this.ResultadoSuma[categoria][mes]["s373_M2M"] || 0;}
    }
    resultadoFinal[categoria] = this[`meses${categoria}`];
    } else {
    resultadoFinal[categoria] = mesesPorCategoria[categoria];}
    }

   for (const categoria of categorias) {if (resultadoFinal[categoria]) {mesesPorCategoria[categoria] = resultadoFinal[categoria];}}

// Construyo datasourcemeses con columnatotal y agregando resultado abierto
this.displaymeses = this.generateDisplayMeses(año);
console.log('Display meses:', this.displaymeses);
const ResultadoSuma_abierto=agruparYSumar("commodity","s374_M2M",this.ListadataHedgeAbierto);
console.log(ResultadoSuma_abierto);
this.displaymesescolumnas = ['categoria', ...this.displaymeses, 'totalSum', 'resultadoAbierto'];
this.dataSourceMeses = categorias.map(categoria => {
  const meses = this.initializeMeses(mesesPorCategoria[categoria], this.displaymeses);
  const totalSum = this.displaymeses.reduce((sum, mes) => sum + (meses[mes] || 0), 0);
  const resultadoAbierto = ResultadoSuma_abierto[categoria]?.s374_M2M || 0;
  return {
    categoria,
    meses,
    totalSum,
    resultadoAbierto};
}); 

const totalPorMes: tipoMeses = this.displaymeses.reduce((totales, mes) => {
  totales[mes] = this.dataSourceMeses.reduce((sum, item) => sum + (item.meses[mes] || 0), 0);
  return totales;
}, {} as tipoMeses);
const totalSumGeneral = this.dataSourceMeses.reduce((sum, item) => sum + item.totalSum, 0);

const totalResultadoAbiertoGeneral = this.dataSourceMeses.reduce((sum, item) => sum + item.resultadoAbierto, 0);

this.dataSourceMeses.push({
  categoria: 'US$ Total',
  meses: totalPorMes,
  totalSum: totalSumGeneral,
  resultadoAbierto: totalResultadoAbiertoGeneral
});
console.log('DataSourceMeses con fila de totales:', this.dataSourceMeses);
  }
  
  actualizarFecha(){
    
    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);
    this.cargaReporteLiquidHedge(Number(this.fechaVigenteEntero));
    this.cargaReporteAbiertoHedge(Number(this.fechaVigenteEntero));
  }

  dateToString = ((date) => {
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

 initializeMeses(mesesObj: tipoMeses, displayMeses: string[]): tipoMeses {
  const result = {};
  for (const mes of displayMeses) {
    result[mes] = mesesObj[mes] || 0;
  }
  console.log('Meses inicializados:', result);
  return result;
}

Formato_columna_MatTable(column: string, value: any): string {
  if (column === 's374_M2M' || column === 's373_M2M') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  if (column === 's374_Delta' || column === 's374_Strike' || column === 's374_PrimaPagada' || 
    column === 's374_PrecioProeveedor'|| column === 's373_Strike' || column === 's373_PrimaPagada' || 
    column === 's373_PrecioProeveedor') {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(value);
  }

  return value;
}

generateMeses(year: number): tipoMeses {
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  
  const result: tipoMeses = {};
  for (const month of months) {
    result[`${month}-${year % 100}`] = 0;
  }
  
  return result;
}
  //Eventos para sumar la tabla de categoria y meses
  selectionSum: number = 0;
  isSelecting: boolean = false;
  selectedCells: Set<string> = new Set(); // Usa un Set para manejar las celdas seleccionadas

  startSelection(event: MouseEvent, row: any, column: string) {
    event.preventDefault(); // Previene la selección de texto
    this.isSelecting = true;
    if(event.ctrlKey){this.addToSelection(event, row, column);}
    else{this.selectedCells.clear();this.addToSelection(event, row, column);}    
    this.updateSelectionSum();
  }

  addToSelection(event: MouseEvent, row: any, column: string) {
    if (this.isSelecting && column) {
      if (row.categoria !== undefined){this.selectedCells.add(`${row.categoria}|${column}`);}
      this.updateSelectionSum();
    }
  }

  endSelection() {
    this.isSelecting = false;
  }

  clearSelection(event: MouseEvent) {
    if (!event.ctrlKey) {
      this.selectedCells.clear();
      this.updateSelectionSum();
    }
  }

  updateSelectionSum() {
    // ['SM-Abr-24', 'SM-May-24', 'SM-Jun-24', 'SM-Jul-24']
    console.log("Selected Cells:", Array.from(this.selectedCells));
  this.selectionSum = Array.from(this.selectedCells).reduce((sum, cellKey) => {
    const [categoria, column] = cellKey.split('|');
    const element = this.dataSourceMeses.find(el => el.categoria === categoria);

    if (element) {
      // Sumar los valores de meses
      const value = element.meses[column];
      if (value !== undefined) {
        console.log(`Adding ${value} from ${categoria}-${column}`);
        sum += value;
      } else {
        console.warn(`Column ${column} not found in category ${categoria}`);
      }

      // También sumar totalSum y resultadoAbierto si la clave es especial
      if (column === 'totalSum') {
        sum += element.totalSum || 0;
      } else if (column === 'resultadoAbierto') {
        sum += element.resultadoAbierto || 0;
      }
    } else {
      console.warn(`Category ${categoria} not found`);
    }
    return sum;
  }, 0);
  console.log("Selection Sum:", this.selectionSum);
  }

  isCellSelected(row: any, column: string): boolean {
    return this.selectedCells.has(`${row.categoria}|${column}`);
  }
//SUMAR FILAS Y COLUMNAS PARA EL DETALLE DE LIQUIDACIONES

  empezarseleccion(event: MouseEvent, rowIndex: number, column: string) {
    event.preventDefault();
    this.isSelecting = true;
    if(event.ctrlKey){this.adicionar_a_seleccion(event, rowIndex, column);}
    else{this.selectedCells.clear();this.adicionar_a_seleccion(event, rowIndex, column);}
    this.updateSumListadataHedge();
  }
  adicionar_a_seleccion(event: MouseEvent, rowIndex: number, column: string) {
    if (this.isSelecting && column) {
      if (rowIndex !== undefined) {this.selectedCells.add(`${rowIndex}|${column}`);}
      this.updateSumListadataHedge();
    }
  }
  finalizarSeleccion() {
    this.isSelecting = false;
  }
  limpiarseleccion(event: MouseEvent) {
    if (!event.ctrlKey) {
      this.selectedCells.clear();
      this.updateSumListadataHedge();
    }
  }
    
  updateSumListadataHedge() {
    console.log("Selected Cells:", Array.from(this.selectedCells));
    this.selectionSum = Array.from(this.selectedCells).reduce((sum, cellKey) => {
      const [rowIndex, column] = cellKey.split('|');
      const index = parseInt(rowIndex, 10);
      const element = this.ListadataHedge[index];  
      if (element) {
        const value = element[column as keyof ListaHedge];
        if (typeof value === 'number') {
          sum += value;
        }
      }
      return sum;
    }, 0);
    console.log("Selection Sum:", this.selectionSum);
  }
  esCeldaSeleccionada(rowIndex: number, column: string): boolean {
    return this.selectedCells.has(`${rowIndex}|${column}`);
  }
 // Evento para sumas todas las tablas filtradas

selectedCells_1: Set<string> = new Set<string>();
currentTable: string = ''; 
isSelecting_1: boolean = false;
actualizarListasHedge() {
  this.listasHedge = {
    'Trigo': this.ListaHedgeabiertoTrigo,
    'SoyCrush': this.ListaHedgeabiertoSoyCrush,
    'Beans': this.ListaHedgeabiertoBeans,
    'SBM': this.ListaHedgeabiertoSBM,
    'SBO': this.ListaHedgeabiertoSBO,
    'CPO': this.ListaHedgeabiertoCPO
  };
}
empezarseleccion_1(event: MouseEvent, rowIndex: number, column: string, tableName: string) {
  event.preventDefault();
  this.currentTable = tableName;
  this.isSelecting_1 = true;
  if (event.ctrlKey) {
    this.adicionar_a_seleccion_1(event, rowIndex, column);
  } else {
    this.selectedCells_1.clear();
    this.adicionar_a_seleccion_1(event, rowIndex, column);
  }
  this.updateSelectionSum_1();
}
adicionar_a_seleccion_1(event: MouseEvent, rowIndex: number, column: string) {
  if (this.isSelecting_1 && column) {
    if (rowIndex !== undefined) {
      this.selectedCells_1.add(`${this.currentTable}|${rowIndex}|${column}`);
    }
    this.updateSelectionSum_1();
  }
}
finalizarSeleccion_1() {
  this.isSelecting_1 = false;
}
updateSelectionSum_1() {
  console.log("Selected Cells:", Array.from(this.selectedCells_1));
  this.selectionSum = Array.from(this.selectedCells_1).reduce((sum, cellKey) => {
    const [tableName, rowIndex, column] = cellKey.split('|');
    const index = parseInt(rowIndex, 10);
    const element = this.getElementByTableNameAndIndex(tableName, index);

    if (element) {
      const value = element[column as keyof ListaHedgeAbierto];
      if (typeof value === 'number') {
        sum += value;
      }
    }
    return sum;
  }, 0);
}
esCeldaSeleccionada_1(rowIndex: number, column: string, tableName: string): boolean {
  return this.selectedCells_1.has(`${tableName}|${rowIndex}|${column}`);
}

// Método para obtener el elemento de una tabla y un índice específicos
getElementByTableNameAndIndex(tableName: string, index: number): ListaHedgeAbierto | undefined {
  const dataList = this.listasHedge[tableName];
  return dataList ? dataList[index] : undefined;
}


  getColor(valor1:any , valor2:any):any {
    if (Number(valor1) > Number(valor2)) {
      return { backgroundColor: 'rgba(0, 100, 0, 0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2

    } else if (Number(valor1) < Number(valor2)) {
      return { backgroundColor: ' rgb(200, 0, 30,0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2

    }else {
      return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
    }
  }

  inicializarUltimoPrecio(){
    let precioActual: number | null;
    let primaActual: number | null;

    this.fretRealTimeService.obtenerUltimosPrecios_Hedge().subscribe(
      (response) => {   

        this.ListaHedgeabiertoTrigo.forEach(objDestino => {
          const filtrado = response.filter(item => item.Ticker === objDestino["s374_Contrato"])
          const filtradoPrima = response.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
          if (filtrado.length > 0) {
            precioActual = filtrado[0].PrecioActual;
          } else {
            precioActual = 0;
          }
          if (filtradoPrima.length > 0) {
            primaActual = filtradoPrima[0].PrecioActual;
          } else {
            primaActual = 0;
          }
          objDestino["precioActual"] = precioActual
          objDestino["s374_PrecioProeveedor"] = primaActual || 0
        });

        this.ListaHedgeabiertoSoyCrush.forEach(objDestino => {
          const filtrado = response.filter(item => item.Ticker === objDestino["s374_Contrato"])
          const filtradoPrima = response.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
          if (filtrado.length > 0) {
            precioActual = filtrado[0].PrecioActual;
          } else {
            precioActual = 0;
          }
          if (filtradoPrima.length > 0) {
            primaActual = filtradoPrima[0].PrecioActual;
          } else {
            primaActual = 0;
          }
          objDestino["precioActual"] = precioActual
          objDestino["s374_PrecioProeveedor"] = primaActual || 0
        });

        this.ListaHedgeabiertoSBM.forEach(objDestino => {
          const filtrado = response.filter(item => item.Ticker === objDestino["s374_Contrato"])
          const filtradoPrima = response.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
          if (filtrado.length > 0) {
            precioActual = filtrado[0].PrecioActual;
          } else {
            precioActual = 0;
          }
          if (filtradoPrima.length > 0) {
            primaActual = filtradoPrima[0].PrecioActual;
          } else {
            primaActual = 0;
          }
          objDestino["precioActual"] = precioActual
          objDestino["s374_PrecioProeveedor"] = primaActual || 0
        });

        this.ListaHedgeabiertoBeans.forEach(objDestino => {
          const filtrado = response.filter(item => item.Ticker === objDestino["s374_Contrato"])
          const filtradoPrima = response.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
          if (filtrado.length > 0) {
            precioActual = filtrado[0].PrecioActual;
          } else {
            precioActual = 0;
          }
          if (filtradoPrima.length > 0) {
            primaActual = filtradoPrima[0].PrecioActual;
          } else {
            primaActual = 0;
          }
          objDestino["precioActual"] = precioActual
          objDestino["s374_PrecioProeveedor"] = primaActual || 0
        });

        this.ListaHedgeabiertoSBO.forEach(objDestino => {
          if(objDestino["s374_Ifd"].includes("Papeles")){
            objDestino["precioActual"] = objDestino["s374_PrecioProeveedor"]
          }else{
            const filtrado = response.filter(item => item.Ticker === objDestino["s374_Contrato"])
            const filtradoPrima = response.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
            if (filtrado.length > 0) {
              precioActual = filtrado[0].PrecioActual;
            } else {
              precioActual = 0;
            }
            if (filtradoPrima.length > 0) {
              primaActual = filtradoPrima[0].PrecioActual;
            } else {
              primaActual = 0;
            }
            objDestino["precioActual"] = precioActual
            objDestino["s374_PrecioProeveedor"] = primaActual || 0
          }
          
        });

        this.ListaHedgeabiertoCPO.forEach(objDestino => {
          const filtrado = response.filter(item => item.Ticker === objDestino["s374_Contrato"])
          const filtradoPrima = response.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
          if (filtrado.length > 0) {
            precioActual = filtrado[0].PrecioActual;
          } else {
            precioActual = 0;
          }
          if (filtradoPrima.length > 0) {
            primaActual = filtradoPrima[0].PrecioActual;
          } else {
            primaActual = 0;
          }
          objDestino["precioActual"] = precioActual
          objDestino["s374_PrecioProeveedor"] = primaActual || 0
        });

        this.valorizar();

      });
    
  }

  valorizar(){
    this.ListaHedgeabiertoTrigo.forEach(objDestino => {
      if(objDestino["s374_Ifd"].includes("Call") || objDestino["s374_Ifd"].includes("Put")){
        if(objDestino["s374_Ifd"].includes("Call")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] * - 1 - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }
        }else if(objDestino["s374_Ifd"].includes("Put")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] + objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50) * -1
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }
        }
      }else if(!doesNotIncludeAny(objDestino["s374_Ifd"], ["Futuro","Swap"])){
        objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * 50)
      }
    })
    this.ListaHedgeabiertoSoyCrush.forEach(objDestino => {
      if(objDestino["s374_Ifd"].includes("Call") || objDestino["s374_Ifd"].includes("Put")){
        if(objDestino["s374_Ifd"].includes("Call")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] * - 1 - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }
        }else if(objDestino["s374_Ifd"].includes("Put")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] + objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50) * -1
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }
        }
      }else if(!doesNotIncludeAny(objDestino["s374_Ifd"], ["Futuro","Swap"])){
        objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * 50)
      }
    })
    this.ListaHedgeabiertoSBM.forEach(objDestino => {
      if(objDestino["s374_Ifd"].includes("Call") || objDestino["s374_Ifd"].includes("Put")){
        if(objDestino["s374_Ifd"].includes("Call")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] * - 1 - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 100)
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 100)
          }
        }else if(objDestino["s374_Ifd"].includes("Put")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] + objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 100) * -1
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 100)
          }
        }
      }else if(!doesNotIncludeAny(objDestino["s374_Ifd"], ["Futuro","Swap"])){
        objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * 100)
      }
    })
    this.ListaHedgeabiertoBeans.forEach(objDestino => {
      if(objDestino["s374_Ifd"].includes("Call") || objDestino["s374_Ifd"].includes("Put")){
        if(objDestino["s374_Ifd"].includes("Call")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] * - 1 - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }
        }else if(objDestino["s374_Ifd"].includes("Put")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] + objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50) * -1
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 50)
          }
        }
      }else if(!doesNotIncludeAny(objDestino["s374_Ifd"], ["Futuro","Swap"])){
        objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * 50)
      }
    })
    this.ListaHedgeabiertoSBO.forEach(objDestino => {
      if(objDestino["s374_Ifd"].includes("Call") || objDestino["s374_Ifd"].includes("Put")){
        if(objDestino["s374_Ifd"].includes("Call")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] * - 1 - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 600)
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 600)
          }
        }else if(objDestino["s374_Ifd"].includes("Put")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] + objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 600) * -1
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 600)
          }
        }
      }else if(!doesNotIncludeAny(objDestino["s374_Ifd"], ["Futuro","Swap"])){
        let factor = 600
        if(objDestino["s374_Contrato"].includes('FCPO')){
          factor = 25
        }
        objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * factor)
      }else if(objDestino["s374_Ifd"].includes("Papeles")){
        objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * 22.046)
      }
    })
    this.ListaHedgeabiertoCPO.forEach(objDestino => {
      if(objDestino["s374_Ifd"].includes("Call") || objDestino["s374_Ifd"].includes("Put")){
        if(objDestino["s374_Ifd"].includes("Call")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] * - 1 - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 25)
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 25)
          }
        }else if(objDestino["s374_Ifd"].includes("Put")){
          if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] + objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 25) * -1
          }else{
            objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * 25)
          }
        }
      }else if(!doesNotIncludeAny(objDestino["s374_Ifd"], ["Futuro","Swap"])){
        objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * 25)
      }
    })
  }

  valorizarMatlab(response: any){
    let data = JSON.parse(response);

    this.ListaHedgeabiertoTrigo.forEach(objDestino => {
      const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s374_GroupOtions"].toString());
      if (objOrigen) {
        const sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
        const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
        // const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
       if(doesNotIncludeAny(objDestino["s374_Ifd"],["Futuro","Swap","Put","Call"])){
        objDestino["s374_M2M"] = sumaCashnettoday.toFixed(2);
       }
        
        objDestino["s374_Delta"] = sumaDeltaCacks.toFixed(2);
      }
    })

    this.ListaHedgeabiertoSoyCrush.forEach(objDestino => {
      const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s374_GroupOtions"].toString());
      if (objOrigen) {
        const sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
        const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
        // const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
        if(doesNotIncludeAny(objDestino["s374_Ifd"],["Futuro","Swap","Put","Call"])){
          objDestino["s374_M2M"] = sumaCashnettoday.toFixed(2);
         }
        objDestino["s374_Delta"] = sumaDeltaCacks.toFixed(2);
      }
    })

    this.ListaHedgeabiertoSBM.forEach(objDestino => {
      const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s374_GroupOtions"].toString());
      if (objOrigen) {
        const sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
        const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
        // const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
        if(doesNotIncludeAny(objDestino["s374_Ifd"],["Futuro","Swap","Put","Call"])){
          objDestino["s374_M2M"] = sumaCashnettoday.toFixed(2);
         }
        objDestino["s374_Delta"] = sumaDeltaCacks.toFixed(2);
      }
    })

    this.ListaHedgeabiertoBeans.forEach(objDestino => {
      const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s374_GroupOtions"].toString());
      if (objOrigen) {
        const sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
        const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
        // const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
        if(doesNotIncludeAny(objDestino["s374_Ifd"],["Futuro","Swap","Put","Call"])){
          objDestino["s374_M2M"] = sumaCashnettoday.toFixed(2);
         }
        objDestino["s374_Delta"] = sumaDeltaCacks.toFixed(2);
      }
    })

    this.ListaHedgeabiertoSBO.forEach(objDestino => {
      const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s374_GroupOtions"].toString());
      if (objOrigen) {
        const sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
        const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
        // const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
        if(!objDestino["s374_Ifd"].includes("Papeles")){
          if(doesNotIncludeAny(objDestino["s374_Ifd"],["Futuro","Swap","Put","Call"])){
            objDestino["s374_M2M"] = sumaCashnettoday.toFixed(2);
           }
          objDestino["s374_Delta"] = sumaDeltaCacks.toFixed(2);
        }
      }
    })

    this.ListaHedgeabiertoCPO.forEach(objDestino => {
      const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s374_GroupOtions"].toString());
      if (objOrigen) {
        const sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
        const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
        // const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
        if(doesNotIncludeAny(objDestino["s374_Ifd"],["Futuro","Swap","Put","Call"])){
          objDestino["s374_M2M"] = sumaCashnettoday.toFixed(2);
         }
        objDestino["s374_Delta"] = sumaDeltaCacks.toFixed(2);
      }
    })

    
  }
selectedFilters: { [key: string]: Set<string> } = {};
toggleSelection(column: string, value: string, isSelected: boolean): void {
  if (!this.selectedFilters[column]) {
    this.selectedFilters[column] = new Set<string>();
  }
  if (isSelected) {
    this.selectedFilters[column].add(value);
  } else {
    this.selectedFilters[column].delete(value);
  }
console.log(this.selectedFilters);
  this.applyFilters();
}

applyFilters(): void {
  this.ListadataHedgeDS.filterPredicate = (data, filter) => {
    for (let column in this.selectedFilters) {
      if (this.selectedFilters[column].size > 0 && !this.selectedFilters[column].has(data[column])) {
        return false;
      }
    }
    return true;
  };
  this.ListadataHedgeDS.filter = JSON.stringify(this.selectedFilters);
}

getOptionsForColumn(column: string): string[] {
  const filteredData = this.ListadataHedgeDS.data.filter(data => {
    for (let col in this.selectedFilters) {
      if (col !== column && this.selectedFilters[col]?.size > 0) {
        if (!this.selectedFilters[col].has(data[col])) {
          return false; 
        }
      }
    }
    return true; 
  });
  const uniqueOptions = new Set(filteredData.map(item => item[column]));
  return Array.from(uniqueOptions);
}

isFilterApplied(column: string): boolean {
  return this.selectedFilters[column] && this.selectedFilters[column].size > 0;
}


}

function doesNotIncludeAny(str: string, values: string[]): boolean {
  return !values.some(value => str.includes(value));
}


function transFecha_mesaño(fecha: string): string {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const [dia, mes, año] = fecha.split('/');  
  const mesFormateado = meses[parseInt(mes, 10) - 1];
  const añoFormateado = año.slice(-2);
  return `${mesFormateado}-${añoFormateado}`;
}


function agruparYSumar(
  columnaAgrupar: string,
  columnaSumar: string,
  listaDatos: { [key: string]: any }[]
): { listaacumular: string[], [key: string]: any } {
  interface ResultadoSuma {
    listaacumular: string[];
    [key: string]: any;
  }
  const resultado: ResultadoSuma = {
    listaacumular: []
  };
  for (let index in listaDatos) {
    const dato = listaDatos[index];
    if (!resultado.listaacumular.includes(dato[columnaAgrupar])) {
      resultado.listaacumular.push(dato[columnaAgrupar]);
      resultado[dato[columnaAgrupar]] = {[columnaSumar]: 0};
    }
    if (resultado[dato[columnaAgrupar]]) {
      resultado[dato[columnaAgrupar]][columnaSumar] += dato[columnaSumar];
    }
  }
  return resultado;
}
