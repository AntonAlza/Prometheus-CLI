import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { LoadingService } from 'src/app/components/loading.service';
import { ConsultaIFDsFret } from 'src/app/models/Fret/ConsultaIFDsFret';
import { ListaConsultaIFD } from 'src/app/models/Fret/ListaConsultaIFD';
import { ProductosFret } from 'src/app/models/Fret/ProductosFret';
import { FretService } from 'src/app/models/Fret/fret.service';
import { objTablas } from 'src/app/models/Fret/objTablas';
import { FretRealTimeService } from 'src/app/shared/services/FretRealTimeService';
import { DetalleFretComponent } from '../../detalle-fret/detalle-fret.component';
import { operacionFicticia } from 'src/app/models/Fret/Ficticio/operacionFicticia';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import Swal from 'sweetalert2';
import { objOperacionSimulada } from 'src/app/models/Fret/objOperacionSimulada';
import { estrategiasXComponente } from 'src/app/models/Fret/estrategiasXComponente';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { objInitTabPosicion } from 'src/app/models/Fret/objInitTabPosicion';
import { ListaHedgeAbierto } from 'src/app/models/IFD/datoshedgeabierto';
import { ListaHedge } from 'src/app/models/IFD/datoshedge';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { ColumnasIFD } from 'src/app/models/Fret/ColumnasIFD';

@Component({
  selector: 'app-fret-simulado',
  templateUrl: './fret-simulado.component.html',
  styleUrls: ['./fret-simulado.component.scss']
})
export class FretSimuladoComponent implements OnInit,OnDestroy {

  columnasResultados: Object [] = [];
  arrListaResultados:Object[]=[];
  arrListaResultadosComparativo:Object[]=[];
  arrListaMercado:Object[]=[];
  columnasPosicion: Object[] = [];
  listaTablasPosicion: objTablas[] = [];
  listaTablasResultados: objTablas[] = [];
  arrListaConsultaIFD:ListaConsultaIFD[]=[];
  columnasPapelesLiquidados: Object [] = [];
  arrListaConsultaPapelesLiquid:Object[]=[];
  factorContractInMetricTons: number;

  date: Date = new Date();
  fechaVigente: NgbDateStruct | null;
  fechaVigenteEntero: string;
  loading$= this.loader.loading$
  fechaOperacion: NgbDateStruct;
  fechaExpiracion: NgbDateStruct;
  listaTrigoXMes: string[][] = []
  flgExpiracion: boolean = false;
  flgDeltaMax: boolean = false;
  flgDeltaMin: boolean = false;
  flgResponsePrecio: boolean = true;
  tabSeleccionado: string; 
  flgCargando: boolean = false;
  listaProductosFret:ProductosFret[]=[];
  selectedOptions: string[];
  sortDirections: { [tablaIndex: number]: { [propiedad: string]: string } } = {};
  isLoading = false;
  myModal=false;
  mesCobertura: string;
  startDate: NgbDateStruct;

  mesModificacion: string | null
  columnaMesModificacion: number | null

  lotes: string;
  call: string;
  grupoIFD1: string[] = ['Cobertura Contable','Cobertura Economica','Pricing'];
  grupoIFD2: string[] = ['Caps','Floors'];
  listTipoOpcion: string[] = ['Call','Put', 'Futuro'];
  listaTipoOperacion: string[] = ['Compra','Venta'];
  listaCommodities:cargaCombo[] = [];
  listaTickers:cargaCombo[] = [];
  operacionSimulada: operacionFicticia = new operacionFicticia();
  // nuevoRegistroIFD: ConsultaIFDsFret = new ConsultaIFDsFret();
  stressFuturo?: string;
  stressFOB?: string;
  stressFlete?: string;
  stressBase?: string;
  commoditieSelected: number;
  flgProteccion: boolean= false;
  listaPrecioFOBPalma:Object[]=[];
  flgObtenerPrima: boolean = true;
  // ---------------EXPIRACION VALORES ORIGINALES-------------------
  arrListaConsultaIFD_RealTime: any;
  // arrListaConsultaIFD_RealTime: any;
  // ---------------------------------------------------------------

  flgConsultarCFR: boolean = true;
  flgActivarRealTime: boolean = true
  
  public obtenerFactores:any;

  jsonTicker: { ticker: any, precio: any }[] = [];
  factor: number;
  flgPrima: boolean = true;

  startIndexs: number[] = [];
  endIndexs: number[] = [];
  pageSize = 2;
  pageSizeOptions = [2, 10, 25];
  unidadMedida: string = ''

  constructor(private fretRealTimeService: FretRealTimeService,
              private loader:LoadingService,
              private fretService: FretService,
              public dialog: MatDialog,
              private modalService: NgbModal,
              private router: Router,
              private calendar: NgbCalendar,
              private portafolioMoliendaService: PortafolioMoliendaService,
              private blobService: AzureBlobStorageService,
              private portafolioIFDMoliendaService: PortafolioIFDMoliendaService) { 
                this.date = new Date();
                this.fechaVigente = {day: this.date.getDate(),month: this.date.getMonth() + 1,year: this.date.getFullYear()};
                this.fechaVigenteEntero = this.dateToString(this.fechaVigente);

                this.columnasResultados = this.fretRealTimeService.columnasResultados_SIM
                this.arrListaResultados = this.fretRealTimeService.arrListaResultados_SIM;
                this.arrListaResultadosComparativo = this.fretRealTimeService.arrListaResultadosComparativo_SIM
                this.arrListaMercado = this.fretRealTimeService.arrListaMercado_SIM
                this.columnasPosicion = this.fretRealTimeService.columnasPosicion_SIM
                this.listaTablasPosicion = this.fretRealTimeService.listaTablasPosicion_SIM;
                this.listaTablasResultados = this.fretRealTimeService.listaTablasResultados_SIM;
                this.arrListaConsultaIFD = this.fretRealTimeService.arrListaConsultaIFD_SIM;
                this.columnasPapelesLiquidados = this.fretRealTimeService.columnasPapelesLiquidados_SIM;
                this.arrListaConsultaPapelesLiquid = this.fretRealTimeService.arrListaConsultaPapelesLiquid_SIM;
                this.listaProductosFret = this.fretRealTimeService.listaProductosFret_SIM;
                this.tabSeleccionado = this.fretRealTimeService.tabSeleccionado_SIM;
                this.selectedOptions = this.fretRealTimeService.selectedOptions_SIM;
                this.factorContractInMetricTons = this.fretRealTimeService.factorContractInMetricTons_SIM;
                this.listaTrigoXMes = this.fretRealTimeService.listaTrigoXMes_SIM;
                this.unidadMedida = this.fretRealTimeService.unidadMedida_SIM
                // this.startDate = { year: this.calendar.getToday().year, month: this.calendar.getToday().month };

                // this.fretRealTimeService.flgHistorico = true;

                this.listaTablasPosicion.forEach((tabla) => {
                  if (tabla.nombreTabla === 'Llegadas Y Dias Giro') {
                    tabla.data = tabla.data.filter(tabladata => 
                      tabladata["Descripcion"].includes('Total TM') || 
                      tabladata["Descripcion"].includes('Días Giro')
                    );
                  }
                });

                for (let i = 1; i < Object.keys(this.arrListaMercado[0]).length - 3; i++) {
                  const obj = {
                    ticker: this.arrListaMercado[0][i],
                    precio: this.arrListaMercado[1][i]
                  };
                  this.jsonTicker.push(obj);
                }

              }

  ngOnDestroy(): void {
    if (this.obtenerFactores) {
      clearInterval(this.obtenerFactores);
      this.obtenerFactores = null; // O undefined
    }
  }

  ngOnInit(): void {
    this.fretRealTimeService.flgSimulacion = true;
    this.fretService.Fret_Sim_Factores(this.selectedOptions[0]).subscribe(
      data=>{
        this.factor = data;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

    //Obtener Precios y Primas
    this.fretRealTimeService.getMessages().subscribe(message => {

        message = "{" + message + "}"
        const data = JSON.parse(message);
        if(this.flgActivarRealTime){
          if(data.tipo == 'precios' && !this.flgExpiracion ){
            if (data.ticker.startsWith("MW")) {
              data.ticker = "MWE" + data.ticker.substring(2);
            } 
  
            if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
              this.arrListaConsultaIFD.forEach(objDestino => {
                if(objDestino.tipoIFD !== "Liquidadas"){
                    objDestino.dataIFD.forEach(objDestino => {
                      if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '') && objDestino["s303_Cobertura"] !== this.mesModificacion ) {
                          objDestino["precioAnterior"] = objDestino["precioActual"];
                          objDestino["precioActual"] = data.precio;
            
                          // if(objDestino["precioAnterior"] != objDestino["precioActual"]){
                          //   this.calculoResultadoIFD_MTM();
                          //   this.calcularCFRSIM();
                          //   this.calcularMTMPricingFisico();
                          // }
                      }
                          
                      if(objDestino["s303_Activador"] != 0 && objDestino["s303_Activador"] != null){
  
                        if(objDestino["s303_Ifd"].includes("Call")){
                          if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                            objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                          }else{
                            objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                          }
                        }else if(objDestino["s303_Ifd"].includes("Put")){
                          if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                            objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"]  ) * objDestino["s303_Activador"]) * -1
                          }else{
                            objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                          }
                        }else{
                          // objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                          if(objDestino["s303_Ifd"].substring(0,1) == '-'){
                            objDestino["s303_M2M"] = ((objDestino["s303_Strike"] - objDestino["precioActual"]) * objDestino["s303_Activador"])
                          }else{
                            objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                          }
                        }
                        // if(objOrigen[0].byportfolio.trim() == 'W' || objOrigen[0].byportfolio.trim() == 'BO'){
                        //   objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                        // }
                        try {
                          if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                            objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                          }
                        } catch (error) {}
                      }
  
                      if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '') && objDestino["s303_Cobertura"] !== this.mesModificacion ) {
                        if(objDestino["precioAnterior"] != objDestino["precioActual"]){
                          this.calculoResultadoIFD_MTM();
                          this.calcularCFRSIM();
                          this.calcularMTMPricingFisico();
                        }
                    }
                    }); 
                }
              });  
            }
  
            if(this.arrListaMercado != undefined && this.arrListaMercado.length > 0){
              (this.arrListaMercado[0] as string[]).map((element, index) => {
                if (element === data.ticker.replace(/\s/g, '') && index !== this.columnaMesModificacion ) {
                  this.arrListaMercado[1][index] = data.precio.toString();
                }
              }); 
            }
          }else if(data.tipo == 'prima' && !this.flgExpiracion ){
  
            let posicionespacio: number = data.ticker.indexOf(" ");
            let segundoEspacio: number = data.ticker.indexOf(" ", posicionespacio + 1);
  
            let ticker = data.ticker.slice(0, posicionespacio - 1);
            // let tipo = data.ticker.slice(posicionespacio - 1, posicionespacio);
            let strike = data.ticker.slice(posicionespacio + 1, segundoEspacio);
  
            if (ticker.startsWith("MW")) {
              ticker = "MWE" + ticker.substring(2);
            }
  
            if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
              this.arrListaConsultaIFD.forEach(objDestino => {
                if(objDestino.tipoIFD !== "Liquidadas"){
                    objDestino.dataIFD.forEach(objDestino => {
                      if((objDestino["s303_Ifd"].includes("Put") || objDestino["s303_Ifd"].includes("Call")) && objDestino["s303_Contrato"] == ticker.replace(/\s/g, '') && 
                            objDestino["s303_Strike"]  ==  strike  && objDestino["s303_Cobertura"] !== this.mesModificacion){
  
                              objDestino["s303_PrecioProveedor"] = data.prima
  
                              if(objDestino["s303_Ifd"].includes("Call")){
                                if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                                  objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_NumeroContratos"] * this.factor) // objDestino["s303_Activador"]
                                }else{
                                  objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_NumeroContratos"] * this.factor)// objDestino["s303_Activador"]
                                }
                              }else if(objDestino["s303_Ifd"].includes("Put")){
                                if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                                  objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"] ) * objDestino["s303_NumeroContratos"] * this.factor) * -1 // objDestino["s303_Activador"]
                                }else{
                                  objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_NumeroContratos"] * this.factor) // objDestino["s303_Activador"]
                                }
                              }
                              this.calculoResultadoIFD_MTM();
                              this.calcularCFRSIM();
                      }
                    }); 
                }
              });  
            }
          }
        }
         
    });

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



//  ------------------------------------------------------------------------

valorizar(value: any = undefined, indexColumna: any = undefined, indexFila: any = undefined){
  // console.log(this.listaTablasPosicion)

  return new Promise<void>((resolve, reject) => {

    if(indexColumna !== undefined && indexFila !== undefined){
      let contrato = this.arrListaMercado[0][indexColumna]
      let valor = this.arrListaMercado[indexFila][indexColumna]
      this.mesModificacion = this.columnasResultados[indexColumna].toString()
      this.columnaMesModificacion = indexColumna
  
      for (let i = 0; i < this.jsonTicker.length; i++) {
    
        if(this.jsonTicker[i].ticker == contrato){
          this.jsonTicker[i].precio = valor
        }
      }
    }
    
    const resultadoJson = JSON.stringify(this.jsonTicker);

    this.fretRealTimeService.valorizacion_SIM(resultadoJson).subscribe(
      (response) => {
  
        this.fretRealTimeService.resultadoValorizacion = response
  
        let data = JSON.parse(response);
  
        // console.log(this.listaTablasPosicion)
        
        if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
  
          this.arrListaConsultaIFD.forEach(objDestinoPadre => {
            if(objDestinoPadre.tipoIFD !== "Liquidadas"){
              objDestinoPadre.dataIFD.forEach(objDestino => {
  
                const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s303_GroupOptions"].toString());
  
                if (objOrigen) {
  
                  if(objDestino["s303_Activador"] == 0 || objDestino["s303_Activador"] == null || objDestino["s303_Ifd"].includes("Put") || objDestino["s303_Ifd"].includes("Call")){//Condicional para OTC y Opciones Vainilla             
                    const mtmIndividual = data.filter(obj => obj["idsql"].toString() === objDestino["s303_Operacion"].toString());
  
                    if(((objDestino["s303_Ifd"].includes("Put") || objDestino["s303_Ifd"].includes("Call")) && objDestino["s303_Cobertura"] == this.mesModificacion && indexColumna !== undefined)
                      || !objDestino["s303_Ifd"].includes("Put") && !objDestino["s303_Ifd"].includes("Call")){ // Condicional para el act primas de Opciones Vainilla con mes modificado y OTC
  
                        if(mtmIndividual.length != 0){
                          if(['CORRECTOR', 'ECONOMICO', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                            objDestino["s303_PrecioProveedor"] = Math.abs(Number(mtmIndividual[0]["premiumtoday"].toFixed(2))) * 100;
                          }else{
                            objDestino["s303_PrecioProveedor"] = Math.abs(Number(mtmIndividual[0]["premiumtoday"].toFixed(2)));
                          }
                              
                        }else{
                          let sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
                          const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
      
                          if(objDestino["s303_Agrupacion"] == 1){
                            let mtmIndividual = data.filter(obj => obj["idsql"].toString() === (objDestino["s303_Operacion"]?.toString() ?? objDestino["s303_Operacion"]));
                            if(mtmIndividual.length != 0){

                              try {
                                if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                                  mtmIndividual[0]["cashnettoday"] = mtmIndividual[0]["cashnettoday"] * 100 
                                }
                              } catch (error) {}

                              objDestino["s303_M2M"] = mtmIndividual[0]["cashnettoday"].toFixed(2);
                              objDestino["s303_Delta"] = mtmIndividual[0]["deltacak"].toFixed(2);
                            }
                          }else{
                            try {
                              if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                                sumaCashnettoday = sumaCashnettoday * 100 
                              }
                            } catch (error) {}

                            objDestino["s303_M2M"] = sumaCashnettoday.toFixed(2);
                            objDestino["s303_Delta"] = sumaDeltaCacks.toFixed(2);
                          }
                          
                        }
      
                        if(['CORRECTOR', 'ECONOMICO', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                          objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                        }
                    }
                  }
                  
                  if(objDestino["s303_Activador"] != 0 && objDestino["s303_Activador"] != null && !this.flgExpiracion){ // recalculo de opciones vanilla y futuros
                    const mtmIndividual = data.filter(obj => obj["idsql"].toString() === objDestino["s303_Operacion"].toString());
  
                    if(mtmIndividual.length != 0){
                      if(['CORRECTOR', 'ECONOMICO', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                        objDestino["s303_Delta"] = mtmIndividual[0]["deltacak"].toFixed(2);
                        // objDestino["s303_PrecioProveedor"] = Math.abs(Number(mtmIndividual[0]["premiumtoday"].toFixed(2))) * 100; // ANTONY ALZA PENDIENTE
                      }else{
                        objDestino["s303_Delta"] = mtmIndividual[0]["deltacak"].toFixed(2);
                        // objDestino["s303_PrecioProveedor"] = Math.abs(Number(mtmIndividual[0]["premiumtoday"].toFixed(2)));
                      }
                    }
  
                    if(objDestino["s303_Ifd"].includes("Call")){
                      if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                        objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                      }else{
                        objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                      }
                    }else if(objDestino["s303_Ifd"].includes("Put")){
                      if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                        objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"]  ) * objDestino["s303_Activador"]) * -1
                      }else{
                        objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                      }
                    }else{
                      // objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                      if(objDestino["s303_Ifd"].substring(0,1) == '-'){
                        objDestino["s303_M2M"] = ((objDestino["s303_Strike"] - objDestino["precioActual"]) * objDestino["s303_Activador"])
                      }else{
                        objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                      }
                    }
                    try {
                      if(['CORRECTOR', 'ECONOMICO', 'NNA','SRW', 'SBO'].includes(this.selectedOptions[0])){
                        objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                      }
                    } catch (error) {}
                  }              
                }
              });          
            }
          
          }); 
        }
        this.recalculoCapsFloors();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.flgResponsePrecio = true;
      });
  });
  
}


toggleSelection(opcion: string): void {
  // this.flgHabilitarSimulacion = false;
  // if(opcion == 'CPO'){
  //   this.mostrarBotonPalma = true;
  // }else{
  //   this.mostrarBotonPalma = false;
  // }
  
  // //this.fretService._disconnect();
  // this.selectedOptions = [];
 
  // if (this.selectedOptions.includes(opcion)) {
  //   this.selectedOptions = this.selectedOptions.filter(item => item !== opcion);
  // } else {
  //   this.selectedOptions.push(opcion);
  // }
  // this.tabSeleccionado = opcion
  //  // Cargar formulario solo si la opción no es 'Hedge Estratégico'
  // if (opcion !== 'Hedge Estratégico') {
  //   // if (this.subscription.closed) {
  //   //   this.suscribirSocket();
  //   // }
  //   // this.flgHabilitarSimulacion = false;
  //   this.cargarForm(this.tabSeleccionado);
    
  // }else{
  //   // if (this.subscription) {
  //   //   this.subscription.unsubscribe();
  //   // }
  // }

  // //  this.flgResponseMTM = true; 
  //  this.flgResponsePrecio = true; 

}

spreadCPO: string[][] = []
columnas: any[] = [];
factorContractInPrice: number;
flgHabilitarSimulacion: boolean = false

cargarForm(opcion: string){
  this.loader.show();
  this.listaTrigoXMes = []
  this.spreadCPO = []
  this.flgCargando = true
  //Mercado
  let idOpcion:number;
  idOpcion=Number(this.listaProductosFret.find(x => x.descripcion==opcion)?.idProductFret)
  let sociedad:number =2
  this.columnas = [];
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
  const dia = fechaActual.getDate() < 10 ? `0${fechaActual.getDate()}` : `${fechaActual.getDate()}`;
  const fechaEntera = `${año}${mesFormateado}${dia}`;

  if( fechaEntera.toString() == this.fechaVigenteEntero){
    
    this.fretRealTimeService.flgHistorico = false;
    this.fretService.obtenerDatosPosicion(Number(this.fechaVigenteEntero),idOpcion.toString(),sociedad,opcion).subscribe(
      (response: objInitTabPosicion) => {
        this.unidadMedida = response.unidadMedida;
        this.factorContractInPrice = response.factorPrice;
        this.factorContractInMetricTons = response.factor;

        this.flgCargando = false
        this.listaTablasPosicion = response.listaData;

        this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];

        let ticker: string = "CPSR";
        
        this.columnasPosicion = response.columnas;

        const newData: Object[] =response.listaDataResumen.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
        this.arrListaResultados  = newData.map((item: any): any => item.slice(1));


        const newDataResumen: Object[] =response.listaDataResumenComparativo.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
        this.arrListaResultadosComparativo  = newDataResumen.map((item: any): any => item.slice(1));
        

        const newDataMercado: Object[] =response.listaDataMercado.sort((a: any, b: any) => a[0] - b[0]);
        this.arrListaMercado  = newDataMercado.map((item: any): any => item.slice(1));
        this.arrListaMercado[0][0]='Ticker'

        if(this.selectedOptions[0] == 'CPO'){
        const dataFOBPalma: Object[] =response.listaFOBPalma.sort((a: any, b: any) => a[0] - b[0]);
        this.listaPrecioFOBPalma  = dataFOBPalma.map((item: any): any => item.slice(1));
          this.actualizaPrecioPalma();
        }

        this.listaTablasResultados = response.listaDataResultado;
        this.columnasResultados =  response.columnasResultado;

        this.arrListaConsultaIFD = response.ifds

        for (let i = 0; i < this.listaTablasPosicion.length; i++) {
          const tabla = this.listaTablasPosicion[i];
          if (tabla.nombreTabla === 'Llegadas Y Dias Giro') {
            for(let columna of this.columnasResultados){
              if(columna.toString() != "Descripcion" && columna.toString() != "CE" && columna.toString() != "Total"){
                for (let j = 0; j < tabla.data.length; j++) {
                  const dataPosicion = tabla.data[j];
                  if (dataPosicion["Descripcion"].includes('Total TM')) {
                    i = this.listaTablasPosicion.length; 
                    break;
                  }
                  if(dataPosicion[columna.toString()] != null){
                    ticker = extractLastPart(dataPosicion["Descripcion"])
                  }
                }
                this.listaTrigoXMes.push([ticker,""]);
              } 
            }              
          }
        }

        if(this.arrListaConsultaIFD != undefined){
          this.arrListaConsultaIFD.forEach(objDestino => {
            if(objDestino.tipoIFD !== "Liquidadas"){
              objDestino.dataIFD = objDestino.dataIFD.map(objeto => {
                return { ...objeto, PrecioActual: objeto["precioActual"], PrecioAnterior: 0, };
              });
              
              objDestino.cabecera.splice(5,0,{
                ancho: "150px",
                descripcion: "PrecioActual",
                descripcionFO: "Precio <br> Actual",
                orden: 10,
                propiedad: "precioActual",
                status: true
              })
            }
            
          });

          // Inicializar los índices de inicio y fin para cada tabla
          for (let i = 0; i < this.arrListaConsultaIFD.length; i++) {
            this.startIndexs[i] = 0;
            this.endIndexs[i] = this.pageSize;
            this.sortDirections[i] = {};
          }
    
          //Se llenan las Columnas IFD
          if(this.columnas.length != 0){
            this.columnas = this.transposeArray(this.arrListaConsultaIFD[0].cabecera);
          }
        }

        this.arrListaConsultaPapelesLiquid = response.dataPapelesLiquid;
        this.columnasPapelesLiquidados = response.columnasPapelesLiquid;//[this.tabSeleccionado].concat(response.columnas);

        this.inicializarUltimoPrecio()
        
        this.loader.hide();

      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        this.flgCargando = false
        alert(error.message);
      });
  }
}

transposeArray(arr: ColumnasIFD[]): string[] {
  return arr.map(item => item.descripcion);
  // return arr.filter(item => item.status).map(item => item.descripcion);
}

calcularCFRSIM(){
    let flgPrimeraColumna = 0
    let flgPrimeraColumnaResult = 0

    if(this.flgConsultarCFR){
      this.flgConsultarCFR = false;

      this.fretRealTimeService.calculoCFR_Stress(this.arrListaMercado,this.listaTablasPosicion, this.listaTablasResultados, this.columnasPosicion,this.tabSeleccionado,this.listaTrigoXMes).subscribe(
        (response) => {
        
          this.flgConsultarCFR = true
  
          this.listaTablasResultados[2].data.forEach(columnaMes => {
            if(columnaMes["Descripcion"] == 'CFR Alicorp'){
              Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
                  if(mesResponse == mesTabla){
                    columnaMes[mesTabla] = Number(valorResponse).toFixed(2);
                  }
                } 
              });         
            }
            flgPrimeraColumna += 1
          });
  
          this.arrListaResultadosComparativo.forEach(dataComparativo => {
            if(dataComparativo[0].includes("CFR Alicorp")){
              
              let contadorComp = 0
              for(let columna of this.columnasResultados){
                Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                  if(mesResponse == columna){
                    dataComparativo[contadorComp] = Number(valorResponse).toFixed(2); 
                  }
                });
                contadorComp++
              }
            }
          })
          
          this.arrListaResultadosComparativo.forEach(dataComparativo => {
            if(dataComparativo[0].includes("Mercado")){
              
              (dataComparativo as string[]).map((element, index) => {
                if(index != 0 && index <= 18){
                  try {
                    if(this.selectedOptions[0] == 'ECONOMICO'){ // ['CORRECTOR', 'ECONOMICO', 'NNA','SRW', 'SBO']
                      if(["CPSR","HRW"].includes(this.listaTrigoXMes[index - 1][0])){
                        dataComparativo[index] = (((Number(this.arrListaMercado[1][index]) + Number(this.arrListaMercado[3][index])) * response["Factor"]) + Number(this.arrListaMercado[4][index])).toFixed(2).toString()
                      }else{
                        dataComparativo[index] = (Number(this.arrListaMercado[2][index]) + Number(this.arrListaMercado[4][index])).toFixed(2).toString()
                      }
                    }else if(this.selectedOptions[0] == 'DURUM' || this.selectedOptions[0] == 'SFO'){
                      dataComparativo[index] = (Number(this.arrListaMercado[2][index]) + Number(this.arrListaMercado[4][index])).toFixed(2).toString()
                    }else if(this.selectedOptions[0] == 'CPO'){
  
                    }else{
                      if(this.arrListaMercado.length > 5){
                        dataComparativo[index] = (((Number(this.arrListaMercado[1][index]) + Number(this.arrListaMercado[3][index]) + Number(this.arrListaMercado[5][index])) * response["Factor"]) + Number(this.arrListaMercado[4][index])).toFixed(2).toString()
                      }else{
                        dataComparativo[index] = (((Number(this.arrListaMercado[1][index]) + Number(this.arrListaMercado[3][index])) * response["Factor"]) + Number(this.arrListaMercado[4][index])).toFixed(2).toString()
                      }
                    }
                    this.listaTrigoXMes[index - 1][1] = dataComparativo[index]
                  } catch (error) {
                    // Manejo del error
                    dataComparativo[index] = '0'
                    this.listaTrigoXMes[index - 1][1] = dataComparativo[index]
                  } 
                }
              });
              
              this.listaTablasResultados[2].data.forEach(columnaMes => {
                if(columnaMes["Descripcion"] == "Mercado"){
                  for(let columna of this.columnasResultados){
                    if(flgPrimeraColumnaResult != 0 && flgPrimeraColumnaResult <= 18){
                      columnaMes[columna.toString()] = this.listaTrigoXMes[flgPrimeraColumnaResult - 1][1]
                    }
                    flgPrimeraColumnaResult += 1
                  }
                }
              });
            }
          });
  
          (this.arrListaResultadosComparativo[5] as string[]).map((element, index) => {
            if(index != 0 && index <= 18){
              try { //CFR vs PB ¢/bu
                this.arrListaResultadosComparativo[8][index] = parseFloat(((this.arrListaResultadosComparativo[0][index] - Number(this.arrListaResultadosComparativo[1][index].replace('-','0'))) * Number(this.arrListaResultados[0][index].replace(',','')) ).toFixed(2)).toLocaleString('en-US')
              } catch (error) {
                this.arrListaResultadosComparativo[8][index] = '0'
              } 
  
              try { //CFR vs Mcdo ¢/bu
                this.arrListaResultadosComparativo[7][index] = parseFloat(((this.arrListaResultadosComparativo[0][index] - Number(this.arrListaResultadosComparativo[4][index].replace('-','0'))) * Number(this.arrListaResultados[0][index].replace(',','')) ).toFixed(2)).toLocaleString('en-US')
              } catch (error) {
                this.arrListaResultadosComparativo[7][index] = '0'
              } 
  
              try { //CFR vs PY Jun-24 ¢/bu
                this.arrListaResultadosComparativo[6][index] = parseFloat(((this.arrListaResultadosComparativo[0][index] - Number(this.arrListaResultadosComparativo[3][index].replace('-','0'))) * Number(this.arrListaResultados[0][index].replace(',','')) ).toFixed(2)).toLocaleString('en-US')
              } catch (error) {
                this.arrListaResultadosComparativo[6][index] = '0'
              } 
  
              try { //CFR vs PY Jul-24 ¢/bu
                this.arrListaResultadosComparativo[5][index] = parseFloat(((this.arrListaResultadosComparativo[0][index] - Number(this.arrListaResultadosComparativo[2][index].replace('-','0'))) * Number(this.arrListaResultados[0][index].replace(',','')) ).toFixed(2)).toLocaleString('en-US')
              } catch (error) {
                this.arrListaResultadosComparativo[5][index] = '0'
              } 
            }
          });
  
          this.calcularComparativo();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.flgResponsePrecio = true;
        });
    }
  }

  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  onContextMenu(event: MouseEvent, item: Item, item2:Item) {

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item1': item , 'item2': item2 };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onSortColumn(prop: string, tablaIndex: number): void {
    // Obtener la dirección actual del ordenamiento para la columna de la tabla actual
    const currentDirection = this.sortDirections[tablaIndex][prop] || 'asc';

    // Cambiar la dirección del ordenamiento
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    this.sortDirections[tablaIndex][prop] = newDirection;

    // Ordenar los datos en la dirección correspondiente para la tabla actual
    this.arrListaConsultaIFD[tablaIndex].dataIFD.sort((a, b) => {
      const aValue = a[prop];
      const bValue = b[prop];

      if (aValue < bValue) {
        return newDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return newDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  guardadoAutomatico(element: any, column: any, tipoIFD:string): void {
    // this.fretService._connect();

    // console.log(element);
    let consultaIFDsFret: ConsultaIFDsFret = new ConsultaIFDsFret();
    consultaIFDsFret.s303_ID=element.s303_ID;
    consultaIFDsFret.s303_CodFretboardClassification=element.s303_CodFretboardClassification;
    consultaIFDsFret.s303_ComentariosFO=element.s303_ComentariosFO;

    this.fretService.guardarComentarioFO(consultaIFDsFret).subscribe(
      data=>{
        //this.fretService._send(planificacion.t331_Date,this.tabSeleccionado)
        // this.notificarGuardadoAutomatico();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  
  }

  getColor(valor1:any , valor2:any):any {
    if (Number(valor1) > Number(valor2)) {
      //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
      return { backgroundColor: 'rgba(0, 100, 0, 0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2

    } else if (Number(valor1) < Number(valor2)) {
      //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
      return { backgroundColor: ' rgb(200, 0, 30,0.8)', color: 'white', transition: 'background-color 1s' }; // Cambia el color a verde si valor1 es mayor que valor2

    }else {
      return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
    }
  }

  modalDetalleIFD(detalleForm:any){
    //RESETEO DE EL MODELO
    this.isLoading = true;
    setTimeout( () => this.isLoading = false, 2000 );

    this.myModal=true;
    if (true){
              let dialogRef = this.dialog.open(DetalleFretComponent, {width: '90%', data: { dato1: this.contextMenu.menuData.item1, dato2:this.contextMenu.menuData.item2 //Abierto
                 }});
              dialogRef.afterClosed().subscribe(result => {
                var totalTMAsignar:number;
                let totalTMNoAsignadas:number;
                let totalTMAsignados:number;
                let totalTMQuitar:number;
                totalTMAsignar=0;
                totalTMNoAsignadas=0;
                totalTMAsignados=0;
                totalTMQuitar=0;
                
                });
      }
  }//fin de método

  // esNumero(cadena: string): boolean {
  //   return !isNaN(+cadena);
  // }

  _handleInput(value: string): string {
    // if (!this.esNumero(value)){
    //   return  "";
    // }else{
      return  value;
    // }
  }

  agregarOperacion(modalOperaciones: any){

    this.flgObtenerPrima = true;
    this.date = new Date();
    this.date.setDate( this.date.getDate() + 1 );

    this.fretService.obtenerCommodities().subscribe(
      data=>{
        this.listaCommodities = data
        this.fechaOperacion = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
        this.fechaExpiracion = {day: this.date.getDate(),month: this.date.getMonth() + 2,year: new Date().getFullYear()};
        this.modalService.open(modalOperaciones,{windowClass : "agregarOperSIM",centered: true});
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  

  modificarConfiguracion(modalConfiguracion: any){
    this.stressFuturo = undefined;
    this.stressFOB = undefined;
    this.stressFlete = undefined;
    this.stressBase = undefined;
    this.modalService.open(modalConfiguracion,{windowClass : "configuracionSIM",centered: true});
  }

  modificarFactores(){

    this.arrListaMercado.forEach(columnaMes => {

      if(this.stressFuturo != undefined){
        this.flgActivarRealTime = false
        if(columnaMes[0] == 'Futuro'){  
          for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
            if(Number(mesTabla) != 0 && Number(mesTabla) < 19){
              columnaMes[mesTabla] = (Number(columnaMes[mesTabla]) + this.stressFuturo).toString()
              if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
                this.arrListaConsultaIFD.forEach(objDestino => {
                  if(objDestino.tipoIFD !== "Liquidadas"){
                      
                        objDestino.dataIFD.forEach(objData => {
                          if(this.arrListaMercado[0][mesTabla] == objData["s303_Contrato"]){
                            objData["precioAnterior"] = objData["precioActual"];
                            objData["precioActual"] = columnaMes[mesTabla];
                          }
                        }); 
                  }
                });  
              }
            }
          }
          this.valorizar();
          if(!this.flgExpiracion){
            this.recalculoCapsFloors();          
            this.calculoResultadoIFD_MTM();  
            this.calcularCFRSIM();
            this.calcularMTMPricingFisico(); 
          }
        }
      }else{
        this.flgActivarRealTime = true
        this.mesModificacion = null
        this.columnaMesModificacion = null
        this.inicializarUltimoPrecio();
      }

      if(this.stressFOB != undefined){
        if(columnaMes[0] == 'FOB'){       
          for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
            if(Number(mesTabla) != 0 && Number(mesTabla) < 19){
              columnaMes[mesTabla] = (Number(columnaMes[mesTabla]) + this.stressFOB).toString()
            }
          }   
        }
      }

      if(this.stressFlete != undefined){
        if(columnaMes[0] == 'Flete'){    
          for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
            if(Number(mesTabla) != 0 && Number(mesTabla) < 19){
              columnaMes[mesTabla] = (Number(columnaMes[mesTabla]) + this.stressFlete).toString()
            }
          }      
        }
      }

      if(this.stressBase != undefined){
        if(columnaMes[0] == 'Base'){     
          for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
            if(Number(mesTabla) != 0 && Number(mesTabla) < 19){
              columnaMes[mesTabla] = (Number(columnaMes[mesTabla]) + this.stressBase).toString()
            }
          }     
        }
      }
      

    });
    // this.actualizaPreciosIFD();
    this.valorizar();
    this.calculoResultadoIFD_MTM();
    this.calcularCFRSIM();
    this.calcularMTMPricingFisico();
    this.calcularMTMBasesFisico();

    Swal.fire({
      icon: 'success',
      title: 'Configuración de Simulación',
      text: 'Se agregó el spread solicitado.',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })

    this.modalService.dismissAll();

  }

  regresarFret(){
    this.router.navigate(['/FretCMIFD']);
  }

  modificacionFactor(value: string, tipo: string, indexColumna: string, indexFila: string): number {

    const sanitizedValue = value.replace(/,/g, '');
    let numberValue = parseFloat(sanitizedValue);
    if (isNaN(numberValue)) {
      value = '0'
      numberValue = 0
      this.arrListaMercado[indexFila][indexColumna] = value
    }
    
    this.actualizaPreciosIFD(value,tipo,indexColumna,indexFila) // NO EXPIRACION // SOLO ACTUALIZA PUT Y CALL

    if(!this.flgExpiracion){
      if(tipo != 'Posicion'){
        this.valorizar(value, indexColumna, indexFila) // NO EXPIRACION  
      }
      this.calculoResultadoIFD_MTM();
      this.calcularCFRSIM()
      this.calcularMTMPricingFisico();
      this.calcularMTMBasesFisico();
    }else{
      this.onExpirationChange()
    }
    
    if(tipo == 'Posicion'){
      //actualización de dependencias de  llegadas (Resumen y % de posiciones)
      // this.actualizarPorcentajesPosicion(numberValue.toLocaleString('en-US'), indexColumna);
      this.actualizarPorcentajesPosicion(numberValue.toString(), indexColumna);
    }

    // const formattedValue = numberValue.toLocaleString('en-US');
    // const formattedValue = numberValue.toString();
    return numberValue;
  }

  actualizaPreciosIFD(value: string, tipo: string, indexColumna: string, indexFila: string){
    if(this.arrListaMercado[indexFila][0] == 'Futuro'){
      let contrato = this.arrListaMercado[0][indexColumna]
      if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
        this.arrListaConsultaIFD.forEach(objDestino => {
          if(objDestino.tipoIFD !== "Liquidadas"){
              objDestino.dataIFD.forEach(objDestino => {
                if (objDestino["s303_Contrato"] == contrato) {
                    objDestino["precioAnterior"] = objDestino["precioActual"];
                    objDestino["precioActual"] = value;
                }
                    
                if(objDestino["s303_Activador"] != 0 && objDestino["s303_Activador"] != null && !objDestino["s303_Ifd"].includes("Put") && !objDestino["s303_Ifd"].includes("Call") 
                && !this.flgExpiracion){

                  // if(objDestino["s303_Ifd"].includes("Call") || objDestino["s303_Ifd"].includes("Put")){
                  //   objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                  // }else{
                  //   objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"]) 
                  // }
                  if(objDestino["s303_Ifd"].includes("Call")){
                    if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                    }else{
                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                    }
                  }else if(objDestino["s303_Ifd"].includes("Put")){
                    if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"]  ) * objDestino["s303_Activador"]) * -1
                    }else{
                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                    }
                  }else{
                    // objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                    if(objDestino["s303_Ifd"].substring(0,1) == '-'){
                      objDestino["s303_M2M"] = ((objDestino["s303_Strike"] - objDestino["precioActual"]) * objDestino["s303_Activador"])
                     }else{
                      objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                     }
                  }
                  try {
                    // if(objDestino[0].byportfolio.trim() == 'W' || objDestino[0].byportfolio.trim() == 'BO'){
                    //   objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                    // }
                    if(['CORRECTOR', 'ECONOMICO', 'NNA','SRW', 'SBO'].includes(this.selectedOptions[0])){
                      objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                    }
                  } catch (error) {}
                }
              }); 
          }
        });  
      }
    }
  }

  actualizarPorcentajesPosicion(llegadaFormateada: string, indexColumna: string){
   // Obtener la primera fila de 'Llegadas Y Dias Giro' para los cálculos
   const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
   if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida

   // Convertir los valores de la primera fila de 'Llegadas Y Dias Giro' a números
   Object.keys(primeraFilaLlegadas).forEach(col => {
     if (col !== 'Descripcion' && col !== 'Orden' && this.columnasPosicion.some(subArray => subArray[0] === col)) {
       if (primeraFilaLlegadas[col] === '-' || primeraFilaLlegadas[col] === '') {
         primeraFilaLlegadas[col] = 0; // Puedes ajustar el valor por defecto según tu lógica
       } else {
         primeraFilaLlegadas[col] = !isNaN(parseFloat((primeraFilaLlegadas[col] || '').toString().replace(/,/g, ""))) ? parseFloat(primeraFilaLlegadas[col].toString().replace(/,/g, "")) : primeraFilaLlegadas[col];
       }
     }
   });

   // Recorrer las otras tablas y aplicar la operación solo en la última fila
   this.listaTablasPosicion.forEach(tabla => {
     if (tabla.nombreTabla !== 'Llegadas Y Dias Giro' && tabla.data.length > 0) {

      const primeraFilaTabla = JSON.parse(JSON.stringify(tabla.data[0]));

       // Convertir valores de la primera fila de la tabla a números y reemplazar '-' por valores adecuados
       this.columnasPosicion.forEach(col => {
        try {
          if(col[0] !== 'Descripcion'){
            if (primeraFilaTabla[col[0]] === '-' || primeraFilaTabla[col[0]] === '' || primeraFilaTabla[col[0]] === null) {
              primeraFilaTabla[col[0]] = 0; // Puedes ajustar el valor por defecto según tu lógica
            } else {
              primeraFilaTabla[col[0]] = parseFloat(primeraFilaTabla[col[0]].replace(/,/g, "").replace('%', ''));
            }
          } 
        } catch (error) {
          // Manejo del error
          tabla.data[tabla.data.length - 1][col[0]] = '-'
        }        
       });

       // Realizar los cálculos basados en la primera fila de 'Llegadas Y Dias Giro'
       this.columnasPosicion.forEach((col, indexPosicion) => {
        if(col[0] != 'Descripcion'){

          try {
            // const valorLlegadas = parseFloat(primeraFilaLlegadas[col[0]].replace(/,/g, "").replace('-','0'));
            const valorLlegadas = parseFloat(primeraFilaLlegadas[col[0]]);
            const valorTabla = primeraFilaTabla[col[0]];
            if (valorTabla !== 0) {
              tabla.data[tabla.data.length - 1][col[0]] = (((valorTabla/valorLlegadas) * 100).toFixed(0)).toString() + '%';
            } else {
              tabla.data[tabla.data.length - 1][col[0]] = '-';
            }

            // se asigna porcentajes a resumen / Se considera orden Llegadas -> DG -> Bases -> Prx provee -> Prx IFDs -> Caps -> Floors, Flete -> ->->->->->
            if(tabla.nombreTabla == 'Bases'){
              this.arrListaResultados[2][indexPosicion] = tabla.data[tabla.data.length - 1][col[0]]
            }else if(tabla.nombreTabla == 'Pricing'){
              this.arrListaResultados[3][indexPosicion] = (Math.round((tabla.data[1][col[0]]/valorLlegadas) * 100) || 0).toString() + '%'
              this.arrListaResultados[4][indexPosicion] = (Math.round((tabla.data[3][col[0]]/valorLlegadas) * 100) || 0).toString() + '%'
            }else if(tabla.nombreTabla == 'Flete'){
              this.arrListaResultados[7][indexPosicion] = tabla.data[tabla.data.length - 1][col[0]]
            }else if(tabla.nombreTabla == 'Caps'){
              this.arrListaResultados[5][indexPosicion] = tabla.data[tabla.data.length - 1][col[0]]
            }else if(tabla.nombreTabla == 'Floors'){
              this.arrListaResultados[19][indexPosicion] = tabla.data[tabla.data.length - 1][col[0]]
            }

            //Se asigna la llegada al resumen
            this.arrListaResultados[0][indexColumna] = llegadaFormateada

          } catch (error) {
            // Manejo del error
            tabla.data[tabla.data.length - 1][col[0]] = '-'
          } 
          
        }
         
       });
     }
    });

    this.calcularDeltaNetoResumen();
  }

  calcularDeltaNetoResumen(){
    this.columnasPosicion.forEach((col, indexPosicion) => {
      if(col[0] !== 'Descripcion'){
        try {
          this.arrListaResultados[8][indexPosicion] = (Number(this.arrListaResultados[3][indexPosicion].replace('%','').replace('-','')) +
                                                      Number(this.arrListaResultados[4][indexPosicion].replace('%','').replace('-','')) + 
                                                      Number(this.arrListaResultados[5][indexPosicion].replace('%','').replace('-','')) + 
                                                      Number(this.arrListaResultados[6][indexPosicion].replace('%','').replace('-','')) ).toString() + '%'
        } catch (error) {
          // Manejo del error
          this.arrListaResultados[8][indexPosicion] = '-'
        } 
      }
    });
  }
  
  // esInputResaltado: boolean = true;

  // // Por ejemplo, puedes activar el resaltado al enfocar el input
  // activarResaltado() {
  //   this.esInputResaltado = true;
  // }

  // // Y desactivar el resaltado al perder el foco del input
  // desactivarResaltado() {
  //   this.esInputResaltado = false;
  // }

  calculoResultadoIFD_MTM(){

    let dicMtMxMes = []
    let mtmAgrupado

    this.arrListaConsultaIFD.forEach(objDestino => {
      if(objDestino.tipoIFD !== "Liquidadas"){
        objDestino.dataIFD.forEach(objData => {
          dicMtMxMes[objData["s303_Cobertura"]] = Number(dicMtMxMes[objData["s303_Cobertura"]] ?? 0) + Number(objData["s303_M2M"]);
        });
      }
    });

    this.listaTablasResultados.forEach(objResultado => {
      if(objResultado.nombreTabla == "Resultados IFDs"){

        objResultado.data.forEach(objData => {
          if(objData["Descripcion"] == "US$ - MTM"){
            for(let item in dicMtMxMes){
              objData[item] = (dicMtMxMes[item] as number).toLocaleString('en-US');
            }

            mtmAgrupado = JSON.parse(JSON.stringify(objData));
            
            // Convertir valores de la primera fila de la tabla a números y reemplazar '-' por valores adecuados
            this.columnasPosicion.forEach(col => {
              try {
                if(col[0] !== 'Descripcion'){
                  if (mtmAgrupado[col[0]] === '-' || mtmAgrupado[col[0]] === '' || mtmAgrupado[col[0]] === null) {
                    mtmAgrupado[col[0]] = 0; 
                  } else {
                    mtmAgrupado[col[0]] = parseFloat(mtmAgrupado[col[0]].replace(/,/g, "").replace('%', ''));
                  }
                } 
              } catch (error) {}
            }); 

          }
        }); 
      }
    });

    const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida

    // Convertir los valores de la primera fila de 'Llegadas Y Dias Giro' a números
    Object.keys(primeraFilaLlegadas).forEach(col => {
      if (col !== 'Descripcion' && col !== 'Orden' && this.columnasPosicion.some(subArray => subArray[0] === col)) {
        if (primeraFilaLlegadas[col] === '-' || primeraFilaLlegadas[col] === '') {
          primeraFilaLlegadas[col] = 0; // Puedes ajustar el valor por defecto según tu lógica
        } else {
          // primeraFilaLlegadas[col] = parseFloat(primeraFilaLlegadas[col].replace(/,/g, ""));
          primeraFilaLlegadas[col] = !isNaN(parseFloat((primeraFilaLlegadas[col] || '').toString().replace(/,/g, ""))) ? parseFloat(primeraFilaLlegadas[col].toString().replace(/,/g, "")) : primeraFilaLlegadas[col];
        }
      }
    });

    this.listaTablasResultados.forEach(objResultado => {
      if(objResultado.nombreTabla == "Resultados IFDs"){
        let dataPnL
        objResultado.data.forEach(objData => {

          if(objData["Descripcion"] == "US$ - P&L Realiz."){
            dataPnL = JSON.parse(JSON.stringify(objData));
            
            // Convertir valores de la primera fila de la tabla a números y reemplazar '-' por valores adecuados
            this.columnasPosicion.forEach(col => {
              try {
                if(col[0] !== 'Descripcion'){
                  if (dataPnL[col[0]] === '-' || dataPnL[col[0]] === '' || dataPnL[col[0]] === null) {
                    dataPnL[col[0]] = 0; 
                  } else {
                    dataPnL[col[0]] = parseFloat(dataPnL[col[0]].replace(/,/g, "").replace('%', ''));
                  }
                } 
              } catch (error) {}  
            }); 
          }

          if(dataPnL != null && mtmAgrupado != null && objData["Descripcion"] == "US$/TM"){
            this.columnasPosicion.forEach(col => {
              try {
                if(col[0] !== 'Descripcion'){
                  try{
                    const valorLlegadas = parseFloat(primeraFilaLlegadas[col[0]]) || 0;
                    const valorPnL = parseFloat(dataPnL[col[0]]);
                    const valorMtM = parseFloat(mtmAgrupado[col[0]]);

                    objData[col[0]] = ((((valorPnL + valorMtM) * -1 )/ valorLlegadas) || 0).toFixed(0);
                  }catch(error){objData[col[0]] = '-'}
                  
                } 
              } catch (error) {}
            });

          }
        });

      }
    });

  }
  
  onExpirationChange(){

    if(this.flgExpiracion){

      // this.arrListaConsultaIFD_RealTime = [...this.arrListaConsultaIFD]; 
      this.arrListaConsultaIFD_RealTime = JSON.parse(JSON.stringify(this.arrListaConsultaIFD));

      let primaPagada: number
      let mtmFuturo: number
      let deltasXEstrategiaCaps: string[][] = []
      let deltasXEstrategiaFloors: string[][] = []

      this.arrListaConsultaIFD.forEach(objDestino => {
        if(objDestino.tipoIFD !== "Liquidadas"){

          if(objDestino.tipoIFD == "Caps"){
            deltasXEstrategiaFloors = []
            deltasXEstrategiaCaps = this.fretRealTimeService.recalculoDeltaExpiracionCaps(objDestino.dataIFD);
          }else if(objDestino.tipoIFD == "Floors"){
            deltasXEstrategiaCaps = []
            deltasXEstrategiaFloors = this.fretRealTimeService.recalculoDeltaExpiracionFloors(objDestino.dataIFD);
          }
          
          if(objDestino.tipoIFD == "Caps" || objDestino.tipoIFD == "Floors"){
            objDestino.dataIFD.forEach( objData => {

              if(deltasXEstrategiaCaps.length > 0){
                if(estrategiasXComponente.includes(objData["s303_Estrategia"])){
                  objData["s303_Delta"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Operacion"].toString())[0][1])
                  objData["s303_Strike"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Operacion"].toString())[0][2])
                }else{
                  objData["s303_Delta"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Ficha"])[0][1])
                  objData["s303_Strike"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Ficha"])[0][2])
                }
              }else if(deltasXEstrategiaFloors.length > 0){
                objData["s303_Delta"] = Number(deltasXEstrategiaFloors.filter(obj => obj[0] === objData["s303_Ficha"])[0][1])
                objData["s303_Strike"] = Number(deltasXEstrategiaFloors.filter(obj => obj[0] === objData["s303_Ficha"])[0][2])
              }
  
              primaPagada = Math.abs(objData["s303_NumeroContratos"]) * Math.abs(objData["s303_PrimaPagada"]) * this.factor ;
              mtmFuturo = (objData["precioActual"] - objData["s303_Strike"]) * Math.abs(objData["s303_NumeroContratos"]) * this.factor;
              
              // CALL
              if(objData["s303_Ifd"].includes("Swap") || objData["s303_Ifd"].includes("Forward")){
                objData["s303_M2M"] = mtmFuturo
              }else if(objData["s303_Ifd"].includes("Call")){
                if(objData["s303_Ifd"].substring(0,1) == '+'){ //<---- Compra
                  objData["s303_M2M"] = (objData["precioActual"] < objData["s303_Strike"]) ? primaPagada * -1 : primaPagada * -1 + mtmFuturo;  
                }else if(objData["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                  objData["s303_M2M"] = (objData["precioActual"] < objData["s303_Strike"]) ? primaPagada : primaPagada + mtmFuturo * -1; 
                }
              }else if(objData["s303_Ifd"].includes("Put")){
                if(objData["s303_Ifd"].substring(0,1) == '+'){ //<---- Compra
                  objData["s303_M2M"] = (objData["precioActual"] > objData["s303_Strike"]) ? primaPagada * -1 : primaPagada * -1 + mtmFuturo * -1;  
                }else if(objData["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                  objData["s303_M2M"] = (objData["precioActual"] > objData["s303_Strike"]) ? primaPagada : primaPagada + mtmFuturo; 
                } 
              }
            })
          }
          
        } 
      })

      
      this.recalculoCapsFloors();
      this.calculoResultadoIFD_MTM();
      this.calcularCFRSIM();
    }else{
      
      // this.arrListaConsultaIFD_RealTime
      this.arrListaConsultaIFD = [...this.arrListaConsultaIFD_RealTime]; 

      this.recalculoCapsFloors()
      // this.valorizar();
      this.calculoResultadoIFD_MTM();
      this.calcularCFRSIM();
    }
    
  }

  // async ejecutarFuncionesEnSecuencia() {
  //   try {
  //     await this.valorizar();
  //     this.recalculoCapsFloors();
  //   } catch (error) {}
  // }
  

  selectTipoCobertura(){
    if(this.operacionSimulada.tipoCobertura == "Pricing" || this.operacionSimulada.tipoCobertura == "Cobertura Economica"){
      this.operacionSimulada.proteccion = "";
      this.flgProteccion = true;
    }else{
      this.flgProteccion = false;
    }
  }

  seleccionCommoditie(idCommoditie: number){

    this.fretService.obtenerTickerXCommodities(idCommoditie).subscribe(
      data=>{
        this.listaTickers = data;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

  }

  recalculoCapsFloors(){
    let dictPricing = []
    let dicDeltasxMes_Caps = []
    let dicDeltasxMes_Floors = []

    const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];

    this.arrListaConsultaIFD.forEach(objDestino => {
      if(this.flgExpiracion){
        if(objDestino.tipoIFD == "Pricing"){
          dictPricing = this.fretRealTimeService.calculoPosicionPricing(objDestino.dataIFD, this.factorContractInMetricTons);
        }else if(objDestino.tipoIFD == "Caps"){
          dicDeltasxMes_Caps = this.fretRealTimeService.calculoDeltasCaps_Expiracion(objDestino.dataIFD, this.factorContractInMetricTons);
        }else if(objDestino.tipoIFD == "Floors"){
          dicDeltasxMes_Floors = this.fretRealTimeService.calculoDeltasFloors_Expiracion(objDestino.dataIFD, this.factorContractInMetricTons);
        }
      }else{
        if(objDestino.tipoIFD == "Pricing"){
          dictPricing = this.fretRealTimeService.calculoPosicionPricing(objDestino.dataIFD, this.factorContractInMetricTons);
        }else if(objDestino.tipoIFD == "Caps"){
          dicDeltasxMes_Caps = this.fretRealTimeService.calculoDeltasCaps(objDestino.dataIFD, this.factorContractInMetricTons);
        }else if(objDestino.tipoIFD == "Floors"){
          dicDeltasxMes_Floors = this.fretRealTimeService.calculoDeltasFloors(objDestino.dataIFD, this.factorContractInMetricTons);
        }
      }
    });

    this.listaTablasPosicion.forEach((tabla, index) => {
      if(tabla.nombreTabla == 'Caps'){

        Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {
          if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){
            tabla.data[0][nombreColumna] = '-'
            tabla.data[1][nombreColumna] = '-'
            tabla.data[2][nombreColumna] = '-'
            tabla.data[3][nombreColumna] = '-'
            tabla.data[4][nombreColumna] = '-'
            tabla.data[5][nombreColumna] = '-'
            tabla.data[6][nombreColumna] = '-'
          }
        })

        let filaDelta = 3;
        let filaPrecio = 4;

        Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {

          if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){

            try{
              if(dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["tipo"] == "fijo"){
                filaDelta = 1;
                filaPrecio = 2;
              }
              tabla.data[filaDelta][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["tm"]
            }catch(error){
              tabla.data[filaDelta][nombreColumna] = '-'
            }

            try{
              tabla.data[filaPrecio][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["precio"]
            }catch(error){
              tabla.data[filaPrecio][nombreColumna] = '-'
            }

            tabla.data[0][nombreColumna] = Number(tabla.data[3][nombreColumna] !== "-" ? tabla.data[3][nombreColumna] : 0) + 
                                            Number(tabla.data[1][nombreColumna] !== "-" ? tabla.data[1][nombreColumna] : 0)
              try{
                tabla.data[5][nombreColumna] = (((tabla.data[1][nombreColumna] !== "-" ? Number(tabla.data[1][nombreColumna]) : 0) *
                                              (tabla.data[2][nombreColumna] !== "-" ? Number(tabla.data[2][nombreColumna]) : 0) +
                                              ((tabla.data[3][nombreColumna] !== "-" ? Number(tabla.data[3][nombreColumna]) : 0)) *
                                              (tabla.data[4][nombreColumna] !== "-" ? Number(tabla.data[4][nombreColumna]) : 0)))/
                                              (tabla.data[0][nombreColumna] !== "-" ? Number(tabla.data[0][nombreColumna]) : 0)
                
              }catch(error){
                tabla.data[5][nombreColumna] = '-'
              }

              if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida
              const valorLlegadas = parseFloat(primeraFilaLlegadas[nombreColumna]);

              try{
                tabla.data[6][nombreColumna] = ((((Number(tabla.data[0][nombreColumna]) / valorLlegadas) || 0) * 100).toFixed(0)).toString() + '%'
              }catch(error){
                tabla.data[6][nombreColumna] = '-'
              }

              this.columnasPosicion.forEach((col, indexPosicion) => {
                if(col[0] == nombreColumna){
                  try {
                    this.arrListaResultados[5][indexPosicion] = tabla.data[6][nombreColumna]
                  } catch (error) {
                    // Manejo del error
                    this.arrListaResultados[5][indexPosicion] = '-'
                  } 
                }
              });
          }
        });
      }else if(tabla.nombreTabla == 'Floors'){
        Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {
          if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){
            tabla.data[0][nombreColumna] = '-'
            tabla.data[1][nombreColumna] = '-'
            tabla.data[2][nombreColumna] = '-'
            tabla.data[3][nombreColumna] = '-'
            tabla.data[4][nombreColumna] = '-'
            tabla.data[5][nombreColumna] = '-'
            tabla.data[6][nombreColumna] = '-'
          }
        })
        
        let filaDelta = 3;
        let filaPrecio = 4;

        Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {
          if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){
            try{

              if(dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["tipo"] == "fijo"){
                filaDelta = 1;
                filaPrecio = 2;
              }

              tabla.data[filaDelta][nombreColumna] = dicDeltasxMes_Floors.filter(obj => obj["mes"] === nombreColumna)[0]["tm"]
            }catch(error){
              tabla.data[filaDelta][nombreColumna] = '-'
            }

            try{
              tabla.data[filaPrecio][nombreColumna] = dicDeltasxMes_Floors.filter(obj => obj["mes"] === nombreColumna)[0]["precio"]
            }catch(error){
              tabla.data[filaPrecio][nombreColumna] = '-'
            }

            tabla.data[0][nombreColumna] = Number(tabla.data[3][nombreColumna] !== "-" ? tabla.data[3][nombreColumna] : 0) + 
                                            Number(tabla.data[1][nombreColumna] !== "-" ? tabla.data[1][nombreColumna] : 0)
              try{
                tabla.data[5][nombreColumna] = (((tabla.data[1][nombreColumna] !== "-" ? Number(tabla.data[1][nombreColumna]) : 0) *
                                              (tabla.data[2][nombreColumna] !== "-" ? Number(tabla.data[2][nombreColumna]) : 0) +
                                              ((tabla.data[3][nombreColumna] !== "-" ? Number(tabla.data[3][nombreColumna]) : 0)) *
                                              (tabla.data[4][nombreColumna] !== "-" ? Number(tabla.data[4][nombreColumna]) : 0)))/
                                              (tabla.data[0][nombreColumna] !== "-" ? Number(tabla.data[0][nombreColumna]) : 0)

              }catch(error){
                tabla.data[5][nombreColumna] = '-'
              }

              if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida
              const valorLlegadas = parseFloat(primeraFilaLlegadas[nombreColumna]);

              try{
                tabla.data[6][nombreColumna] = (((Number(tabla.data[0][nombreColumna]) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
              }catch(error){
                tabla.data[6][nombreColumna] = '-'
              }

              this.columnasPosicion.forEach((col, indexPosicion) => {
                if(col[0] == nombreColumna){

                  try {
                    this.arrListaResultados[6][indexPosicion] = tabla.data[6][nombreColumna]
                  } catch (error) {
                    // Manejo del error
                    this.arrListaResultados[6][indexPosicion] = '-'
                  } 
                }
              });
          }
        });
      }else if(tabla.nombreTabla == 'Pricing'){
        Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {
          if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){
            try{
              tabla.data[3][nombreColumna] = Math.abs(dictPricing.filter(obj => obj["mesCobertura"] === nombreColumna)[0]["tm"])
            }catch(error){
              tabla.data[3][nombreColumna] = '-'
            }

            try{
              tabla.data[4][nombreColumna] = dictPricing.filter(obj => obj["mesCobertura"] === nombreColumna)[0]["precioPromedioPonderado"]
            }catch(error){
              tabla.data[4][nombreColumna] = '-'
            }

            tabla.data[0][nombreColumna] = Number(tabla.data[3][nombreColumna] !== "-" ? tabla.data[3][nombreColumna] : 0) + 
                                          Number(tabla.data[1][nombreColumna] !== "-" ? tabla.data[1][nombreColumna] : 0)
              try{
                tabla.data[5][nombreColumna] = (((tabla.data[1][nombreColumna] !== "-" ? Number(tabla.data[1][nombreColumna]) : 0) *
                                              (tabla.data[2][nombreColumna] !== "-" ? Number(tabla.data[2][nombreColumna]) : 0) +
                                              ((tabla.data[3][nombreColumna] !== "-" ? Number(tabla.data[3][nombreColumna]) : 0)) *
                                              (tabla.data[4][nombreColumna] !== "-" ? Number(tabla.data[4][nombreColumna]) : 0)))/
                                              (tabla.data[0][nombreColumna] !== "-" ? Number(tabla.data[0][nombreColumna]) : 0)

              }catch(error){
                tabla.data[5][nombreColumna] = '-'
              }

              if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida
              const valorLlegadas = parseFloat(primeraFilaLlegadas[nombreColumna]);

              try{
                tabla.data[6][nombreColumna] = (((Number(tabla.data[0][nombreColumna]) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
              }catch(error){
                tabla.data[6][nombreColumna] = '-'
              }

              this.columnasPosicion.forEach((col, indexPosicion) => {
                if(col[0] == nombreColumna){

                  try {
                    this.arrListaResultados[3][indexPosicion] = (((Number(tabla.data[1][nombreColumna]) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                    this.arrListaResultados[4][indexPosicion] = (((Number(tabla.data[3][nombreColumna]) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                  } catch (error) {
                    // Manejo del error
                    this.arrListaResultados[6][indexPosicion] = '-'
                  } 
                }
              });
          }
      });
      }

    });

    this.calcularDeltaNetoResumen();
    
  }

  
  // @ViewChild('monthYearPicker', { static: true }) monthYearPicker: TemplateRef<any>;
  // @ViewChild('monthYearPickerContainer', { static: true }) monthYearPickerContainer: ElementRef;


  // openMonthYearPicker() {
  //   const monthYearPickerContainer = this.monthYearPickerContainer.nativeElement;
  //   if (monthYearPickerContainer) {
  //     monthYearPickerContainer.classList.toggle('d-none');
  //   } else {
  //     console.error('Element with id "monthYearPickerContainer" not found');
  //   }
  // }

  // onDateSelection(date: NgbDateStruct, datepicker) {
  //   this.mesCobertura = `${date.year}-${('0' + date.month).slice(-2)}`;
  //   this.toggleMonthYearPicker();
  // }

  // toggleMonthYearPicker() {
  //   const container = this.monthYearPickerContainer.nativeElement;
  //   if (container) {
  //     container.classList.toggle('d-none');
  //   }
  // }

  // closeMonthYearPicker() {
  //   const monthYearPickerContainer = this.monthYearPickerContainer.nativeElement;
  //   if (monthYearPickerContainer) {
  //     monthYearPickerContainer.classList.add('d-none');
  //   }
  // }

  obtenerCaks(){

    if(this.operacionSimulada.ticker == null || this.operacionSimulada.tm == null){
      this.operacionSimulada.contratos = null
      return;
    }

    this.portafolioMoliendaService.getToneladasContratos(this.operacionSimulada.tm.toString().replace(".", "_"),this.operacionSimulada.ticker.toString()).subscribe(
    (response: string) => {
      this.operacionSimulada.contratos = Math.round(Number(response));
      this.calcularCotizacion();
      // this.nuevoContrato.t218_VolumeContract = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  obtenerTM(){

    if(this.operacionSimulada.ticker == null || this.operacionSimulada.contratos == null){
      this.operacionSimulada.tm = null
      return;
    }
    this.calcularCotizacion();

    this.portafolioMoliendaService.getContratosTM(this.operacionSimulada.contratos.toString().replace(".", "_"),this.operacionSimulada.ticker.toString()).subscribe(
      (response: string) => {
        // this.nuevoContrato.t218_MetricTons = Math.round(Number(response));
        this.operacionSimulada.tm = Number(Number(response).toFixed(2));
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  seleccionTicker(){

    this.obtenerTM();
    const tickerSeleccionado = this.listaTickers.find(item => item["s204_ID"] === this.operacionSimulada.ticker.toString());

    if(tickerSeleccionado)
    this.fretService.obtenerPrecioOperacion_SIM(tickerSeleccionado["s204_Description"], 'precio').subscribe(
      data=>{
        this.operacionSimulada.strike = data;
        this.obtenerPrima();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  obtenerPrima(){
    this.flgObtenerPrima = true;
    const tickerSeleccionado = this.listaTickers.find(item => item["s204_ID"] === this.operacionSimulada.ticker.toString());
    let tickerPrima: string
    if(tickerSeleccionado && (this.operacionSimulada.tipoOpcion == 'Put' || this.operacionSimulada.tipoOpcion == 'Call') && this.operacionSimulada.strike !== null){
      
      tickerPrima = tickerSeleccionado["s204_Description"] + this.operacionSimulada.tipoOpcion.substring(0,1) +' '+ this.operacionSimulada.strike.toString()

      if (this.obtenerFactores) {
        clearInterval(this.obtenerFactores);
        this.obtenerFactores = null; // O undefined
      }
      
      this.obtenerFactores = setInterval(()=> { this.obtenerPrimas(tickerPrima) }, 4 * 1000);
    }
    

  }

  obtenerPrimas(tickerPrima: string){
    if(this.flgObtenerPrima){
      this.fretService.obtenerPrecioOperacion_SIM(tickerPrima, 'prima').subscribe(
        data=>{
          this.operacionSimulada.prima = data;
          this.calcularCotizacion();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }
        
  }

  seleccionTipoOpcion(){
    if(this.operacionSimulada.tipoOpcion == 'Futuro'){
      this.flgPrima = true;
      this.operacionSimulada.prima = null
    }else{
      this.flgPrima = false;
      this.obtenerPrima();
    }
    this.calcularCotizacion();
  }

  modificarPrima(){
    this.flgObtenerPrima = false;
    this.calcularCotizacion();
  }

  calcularCotizacion(){
    if(this.operacionSimulada.tipoOpcion == 'Futuro'){
      this.operacionSimulada.cotizacion = 0 //this.operacionSimulada.strike * (this.operacionSimulada.contratos ?? 0)
    }else if(this.operacionSimulada.tipoOpcion == 'Call' || this.operacionSimulada.tipoOpcion == 'Put'){
      this.operacionSimulada.cotizacion = (this.operacionSimulada.prima ?? 0) * (this.operacionSimulada.contratos ?? 0) * this.factor
    }
  }


  transform(value: string): string {
    const [year, month] = value.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthIndex = parseInt(month, 10) - 1;

    if (monthIndex >= 0 && monthIndex < 12) {
      return `${months[monthIndex]}-${year.slice(-2)}`;
    } else {
      return value; // Retorna el valor original si el mes no es válido
    }
  }

  agregarOperacionLista(){

    this.operacionSimulada.fechaExpiracion = Number(this.dateToString(this.fechaExpiracion));
    this.operacionSimulada.fechaOperacion = Number(this.dateToString(this.fechaOperacion));

    if(this.operacionSimulada.contratos == null || this.operacionSimulada.tm == null || this.operacionSimulada.fechaExpiracion == null || 
      this.operacionSimulada.fechaOperacion == null || this.operacionSimulada.strike == null ||
      this.operacionSimulada.ticker == null || this.operacionSimulada.tipoCobertura == null || this.operacionSimulada.tipoOpcion == null ||
      this.operacionSimulada.tipoOperacion == null){

        Swal.fire({
          icon: 'warning',
          title: 'Validar Inputs',
          text: 'Es necesario completar todos los campos',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
        return;

    }

    if(this.operacionSimulada.tipoCobertura == 'Cobertura Contable' && this.operacionSimulada.proteccion == null){
      Swal.fire({
        icon: 'warning',
        title: 'Validar Inputs',
        text: 'Es necesario completar todos los campos',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    const tickerSeleccionado = this.listaTickers.find(item => item["s204_ID"] === this.operacionSimulada.ticker.toString());

    let objOperacion : objOperacionSimulada =  new objOperacionSimulada();

    objOperacion.fechaOperacion = this.operacionSimulada.fechaOperacion;
    objOperacion.fechaExpiracion = this.operacionSimulada.fechaExpiracion;
    objOperacion.idUnderlying = this.commoditieSelected;
    objOperacion.prima = this.operacionSimulada.prima || 0;
    objOperacion.strike = this.operacionSimulada.strike || 0;
    objOperacion.caks = this.operacionSimulada.contratos;
    objOperacion.idContrato = this.operacionSimulada.ticker;

    if(this.operacionSimulada.tipoOperacion == 'Venta'){
      objOperacion.compraVenta = 1;
    }else{
      objOperacion.compraVenta = 2;
    }
    
    objOperacion.estrategia = this.operacionSimulada.tipoOpcion;

    if(tickerSeleccionado)
    objOperacion.tickerLargo = tickerSeleccionado["s204_Description"] || '';

    this.fretService.registrarOperacionFicticia(objOperacion).subscribe(
      data=>{
        const nuevoRegistroIFD: ConsultaIFDsFret = new ConsultaIFDsFret();
        nuevoRegistroIFD.s303_BrokerReferencia = 'SIM'
        nuevoRegistroIFD.s303_Ficha = 'SIM'
        nuevoRegistroIFD.s303_Sociedad = 'Alicorp Uruguay S.R.L.'
        if(tickerSeleccionado)
        nuevoRegistroIFD.s303_Contrato = tickerSeleccionado["s204_Description"]
        nuevoRegistroIFD["precioActual"] = 0
        nuevoRegistroIFD["PrecioActual"] = 0
        nuevoRegistroIFD["precioAnterior"] = 0
        nuevoRegistroIFD["PrecioAnterior"] = 0
        
        let signo: string;

        if(this.operacionSimulada.tipoOperacion == 'Venta'){
          signo = '-'
          nuevoRegistroIFD.s303_Estrategia = 'Short ' + this.operacionSimulada.tipoOpcion
        }else{
          signo = '+'
          nuevoRegistroIFD.s303_Estrategia = 'Long ' + this.operacionSimulada.tipoOpcion
        }
        
        nuevoRegistroIFD.s303_NumeroContratos = Number(this.operacionSimulada.contratos)
        nuevoRegistroIFD.s303_Activador = nuevoRegistroIFD.s303_NumeroContratos * this.factor
        nuevoRegistroIFD.s303_Delta = 0
        nuevoRegistroIFD.s303_Strike = this.operacionSimulada.strike
        nuevoRegistroIFD.s303_Ifd = signo + this.operacionSimulada.tipoOpcion // -------------------------
        nuevoRegistroIFD.s303_PrecioProveedor = Number(this.operacionSimulada.prima)
        nuevoRegistroIFD.s303_M2M = 0
        nuevoRegistroIFD.s303_FechaExpiracion = this.operacionSimulada.fechaExpiracion.toString().substr(6)+'/'+this.operacionSimulada.fechaExpiracion.toString().substr(4,2)+'/'+this.operacionSimulada.fechaExpiracion.toString().substr(0,4)
        nuevoRegistroIFD.s303_FechaPacto = this.operacionSimulada.fechaOperacion.toString().substr(6)+'/'+this.operacionSimulada.fechaOperacion.toString().substr(4,2)+'/'+this.operacionSimulada.fechaOperacion.toString().substr(0,4)
        nuevoRegistroIFD.s303_PrimaPagada = Number(this.operacionSimulada.prima)
        nuevoRegistroIFD.s303_GroupOptions = data.idGroupOption
        nuevoRegistroIFD.s303_Operacion = data.idGroupOption
        
        if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
          this.arrListaConsultaIFD.forEach(objDestino => {
            if(objDestino.tipoIFD == "Cobertura Económica" && this.operacionSimulada.tipoCobertura == 'Cobertura Economica'){
              nuevoRegistroIFD.s303_Cobertura = 'CE'
              objDestino.dataIFD.push(nuevoRegistroIFD);
            }else if(objDestino.tipoIFD == "Pricing" && this.operacionSimulada.tipoCobertura == 'Pricing'){
              nuevoRegistroIFD.s303_Cobertura = this.transform(this.mesCobertura);
              objDestino.dataIFD.push(nuevoRegistroIFD);
            }else if(this.operacionSimulada.proteccion == 'Floors' && objDestino.tipoIFD == 'Floors'){
              nuevoRegistroIFD.s303_Cobertura = this.transform(this.mesCobertura);
              objDestino.dataIFD.push(nuevoRegistroIFD);
            }else if(this.operacionSimulada.proteccion == 'Caps' && objDestino.tipoIFD == 'Caps'){
              nuevoRegistroIFD.s303_Cobertura = this.transform(this.mesCobertura);
              objDestino.dataIFD.push(nuevoRegistroIFD);
            }
            
          });  
        }

        this.inicializarUltimoPrecio();

        Swal.fire({
          icon: 'success',
          title: 'Operación Agregada',
          text: 'Se agregó la operación ficticia correctamente.',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
        
        if (this.obtenerFactores) {
          clearInterval(this.obtenerFactores);
          this.obtenerFactores = null; // O undefined
        }
        this.modalService.dismissAll();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

    // this.nuevoRegistroIFD
    
  }

  inicializarUltimoPrecio(){

    this.fretRealTimeService.obtenerUltimosPrecios().subscribe(
      (response) => {        
        if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
          this.arrListaConsultaIFD.forEach(objDestino => {
            if(objDestino.tipoIFD !== "Liquidadas"){

              Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                if (typeof valorResponse === 'object' && valorResponse !== null) {
                  objDestino.dataIFD.forEach(objData => {
                    if(valorResponse["tipo"] == 'precio'){
                      if (objData["s303_Contrato"] == valorResponse["Ticker"].replace(/\s/g, '')) {
                        objData["precioAnterior"] = objData["precioActual"];
                        objData["precioActual"] = valorResponse["PrecioActual"];
                      }
                    }else{
                      // if(valorResponse["Ticker"] == 'MWEU4C 670'){
                      //   console.log('')
                      // }
                      // if(objData["s303_Contrato"] == 'MWEU4' && objData["s303_Strike"] == 670){
                      //   console.log('')
                      // }

                      let posicionespacio: number = valorResponse["Ticker"].indexOf(" ");
                      let segundoEspacio: number = valorResponse["Ticker"].indexOf(" ", posicionespacio + 1);

                      let ticker = valorResponse["Ticker"].slice(0, posicionespacio - 1);
                      let strike = valorResponse["Ticker"].slice(posicionespacio + 1);
                      let tipoOpcion = valorResponse["Ticker"].slice(posicionespacio - 1, posicionespacio)

                      // if (ticker.startsWith("MW")) {
                      //   ticker = "MWE" + ticker.substring(2);
                      // }

                      // if (objData["s303_Ficha"] == '1241') {
                      //   console.log('')
                      // } 

                      if(((objData["s303_Ifd"].includes("Put") && tipoOpcion == 'P') || (objData["s303_Ifd"].includes("Call") && tipoOpcion == 'C'))
                       && objData["s303_Contrato"] == ticker.replace(/\s/g, '') && objData["s303_Strike"]  ==  Number(strike) ){
                        objData["s303_PrecioProveedor"] = valorResponse["PrecioActual"]
                      }
                    }
                    
                  }); 

                  (this.arrListaMercado[0] as string[]).map((element, index) => {
                    if (element === valorResponse["Ticker"].replace(/\s/g, '')) {
                      this.arrListaMercado[1][index] = valorResponse["PrecioActual"].toString();
                    }
                  });
                }
              });
            }
          });  
          this.valorizar();
          if(!this.flgExpiracion){
            this.recalculoCapsFloors();          
            this.calculoResultadoIFD_MTM();  
            this.calcularCFRSIM();
            this.calcularMTMPricingFisico(); 
          }
        }
      },
      (error) => {
        console.error('Error: ', error);
      }
    );    
  }


  calcularComparativo(){

    
    const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    
    const cfrAlicorp = this.arrListaResultadosComparativo.find(tabla => tabla[0].includes('CFR Alicorp'));
    const mercado = this.arrListaResultadosComparativo.find(tabla => tabla[0].includes('Mercado'))
    const proyectoBase = this.arrListaResultadosComparativo.find(tabla => tabla[0].startsWith('PB '))
    
    if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida
    if (!mercado) return; // Salir si no hay primera fila válida
    if (!cfrAlicorp) return; // Salir si no hay primera fila válida
    if (!proyectoBase) return; // Salir si no hay primera fila válida
    
    const obtenerTexto = (cadena: string): string => cadena.match(/^(\S+\s\S+)/)?.[1] ?? cadena;

    this.arrListaResultadosComparativo.forEach(dataComparativo => {
      if(dataComparativo[0].includes("CFR vs Mcdo")){
        let contadorComp = 0
        for(let columna of this.columnasResultados){
          if(contadorComp != 0 && contadorComp != 19 && contadorComp != 20){
            dataComparativo[contadorComp] = (Math.round(Number(cfrAlicorp[contadorComp])) - Math.round(Number(mercado[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
          }
          contadorComp++
        }

      }else if(dataComparativo[0].includes("CFR vs PB")){
        let contadorComp = 0
        for(let columna of this.columnasResultados){
          if(contadorComp != 0 && contadorComp != 19 && contadorComp != 20){
            dataComparativo[contadorComp] = (Math.round(Number(cfrAlicorp[contadorComp])) - Math.round(Number(proyectoBase[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
          }
          contadorComp++
        }
      }

      if(dataComparativo[0].startsWith("PY ")){
        let proyecto = obtenerTexto(dataComparativo[0]);
        const py_m = this.arrListaResultadosComparativo.find(tabla => tabla[0].startsWith(proyecto))

        if (!py_m) return;

        this.arrListaResultadosComparativo.forEach(dataSubComparativo => {
          let contadorComp = 0
          for(let columna of this.columnasResultados){
            if(contadorComp != 0 && contadorComp != 19 && contadorComp != 20){
              if(dataSubComparativo[0].startsWith('CFR vs '+proyecto)){
                dataSubComparativo[contadorComp] = (Math.round(Number(cfrAlicorp[contadorComp])) - Math.round(Number(py_m[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
              }
            }
            contadorComp++
          }
        })

      }
      
    })
  }
  
  calcularMTMPricingFisico(){
    // const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    const valoresMercado = this.arrListaMercado[1];
    const pricingTM = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Pricing')?.data[1]
    const pricingPrecio = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Pricing')?.data[2]

    if (!valoresMercado) return;
    if (!pricingTM) return;
    if (!pricingPrecio) return;

    this.listaTablasResultados.find(tabla => tabla.nombreTabla === 'Resultados Físico')?.data.filter(obj => obj["Descripcion"].includes("MTM Prx proveed")).forEach(dataResultado => {
      let contadorResultado = 0
      for(let columna of this.columnasResultados){
        if(contadorResultado != 0 && contadorResultado != 19 && contadorResultado != 20){
          let valorMtM = (Number(valoresMercado[contadorResultado]) - Number(pricingPrecio[columna.toString()])) * Math.round(Number(pricingTM[columna.toString()])/this.factorContractInMetricTons) * this.factor
          const formattedValue = Math.round(valorMtM).toLocaleString('en-US');
          dataResultado[columna.toString()] = formattedValue
        }
        contadorResultado++
      }
    })
    
  }

  calcularMTMBasesFisico(){
    // const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    const valoresMercado = this.arrListaMercado[3];
    const BasesTM = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Bases')?.data[1]
    const BasesPrecio = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Bases')?.data[2]

    if (!valoresMercado) return;
    if (!BasesTM) return;
    if (!BasesPrecio) return;

    this.listaTablasResultados.find(tabla => tabla.nombreTabla === 'Resultados Físico')?.data.filter(obj => obj["Descripcion"].includes("MTM Bases")).forEach(dataResultado => {
      let contadorResultado = 0
      for(let columna of this.columnasResultados){
        if(contadorResultado != 0 && contadorResultado != 19 && contadorResultado != 20){
          let valorMtM = (Number(valoresMercado[contadorResultado]) - Number(BasesPrecio[columna.toString()])) * Math.round(Number(BasesTM[columna.toString()])/this.factorContractInMetricTons) * this.factor
          const formattedValue = Math.round(valorMtM).toLocaleString('en-US');
          dataResultado[columna.toString()] = formattedValue
        }
        contadorResultado++
      }
    })
    
  }

  formatearRegistro(registro: any, columna: any, fila: number): { valor: any, esNumero: boolean } {
    const valor = registro[columna[0]];
    
    if (valor === undefined || valor === null) {
      return { valor: '-', esNumero: false };
    }
  
    if (valor === '-' || (typeof valor === 'string' && valor.includes('%'))) {
      return { valor, esNumero: false };
    }
  
    if (typeof valor === 'number') {
      return { valor, esNumero: true };
    }
  
    if (typeof valor === 'string') {
      const numero = parseFloat(valor.replace(/,/g, ""));
      if (!isNaN(numero)) {
        return { valor: numero, esNumero: true };
      }
    }
    
    return { valor: String(valor), esNumero: false };
  }

  encontrarColumnaPorFila(worksheet, nFila, textoBuscar){
    let colIndex = -1;

    // Iterar sobre las celdas de la fila específica
    worksheet.getRow(nFila).eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // Comparar el valor de la celda con el texto buscado
      if (cell.value && cell.value.toString().trim() === textoBuscar.toString().trim()) {
          colIndex = colNumber; // ExcelJS usa un índice basado en 1 para las columnas
      }
    });

    return colIndex;
  }

  encontrarFilaPorColumna(worksheet, nColumna, textBuscar): number{
    let rowIndex = -1;
    // Iterar sobre las filas de la hoja de cálculo
    worksheet.eachRow((row, rowNumber) => {
      // Obtener el valor de la celda en la columna especificada
      const cellValue = row.getCell(nColumna).value;
  
      // Comparar el valor de la celda con el texto buscado
      if (cellValue && cellValue.toString().trim() === textBuscar.toString().trim()) {
        rowIndex = rowNumber;
      }
    });
    return rowIndex;
  }
  
  encontrarFilaDataEntry(worksheet, nombreProducto, columnaValor): number{
    let rowIndex = -1;
    // Iterar sobre las filas de la hoja de cálculo
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      // Obtener los valores de las columnas A y B en la fila actual
      const valorColumnaA = row.getCell(1).value; // Columna A (índice 1 en ExcelJS)
      const valorColumnaB = row.getCell(2).value; // Columna B (índice 2 en ExcelJS)

      // Comparar los valores con los valores buscados
      if (valorColumnaA && valorColumnaB && valorColumnaA.toString().trim() === nombreProducto.toString().trim() && valorColumnaB.toString().trim() === columnaValor.toString().trim()) {
        rowIndex = rowNumber; // Índice de fila basado en 1
        return; // Salir de la iteración
      }
    });

    return rowIndex;
  }

  async llenarExcel(workbook, commoditie, arrListaMercado, listaTablasPosicion, listaTablasResultados, columnasPosicion, arrListaConsultaIFD, arrListaConsultaPapelesLiquid, listaTablasPosicionNNA_DH){
    let sheetName;
    let worksheet;
    let nombreProducto;

    //NNA DH
    if(listaTablasPosicionNNA_DH){
      worksheet = workbook.getWorksheet('VITAPRO_DH');
      if(!worksheet){
        alert(`La hoja ${sheetName} no existe en la plantilla Excel`);
        this.loader.hide();
        this.flgCargando = false;
        return;
      }
      nombreProducto = worksheet.getCell('B2').value;
      worksheet = workbook.getWorksheet('Data Entry');
      
      listaTablasPosicionNNA_DH?.forEach((tabla) => {
        tabla.data.forEach((valFila, idxFila) => {
          columnasPosicion.forEach((valColumna, idxColumna) => {
            if(valFila[valColumna[0]]){
              let fila = this.encontrarFilaDataEntry(worksheet, nombreProducto, valFila[columnasPosicion[0][0]]);
              if (Number(idxColumna) > 0 && fila > -1){
                let valorCelda = valFila[valColumna[0]] == '-' ? 0 : valFila[valColumna[0]];
                if(valorCelda){
                  worksheet.getCell(fila, Number(idxColumna) + 2).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
                }
              }
            }
          });
        });
      });
    }

    //Hedge Estrategico
    this.portafolioIFDMoliendaService.getlistahedgeabierto(Number(this.fechaVigenteEntero)).subscribe((response:ListaHedgeAbierto[])=>{
      let listasHedgeAbierto = response.map((x) => {return {
        'commodity' : x.commodity
        , 'Fecha Pacto': x.s374_fechatrade
        , 'Broker Referencia': x.s374_Broker
        , 'Ficha': x.s374_Ficha
        , 'Sociedad': x.s374_Sociedad
        , 'Contrato': x.s374_Contrato
        , 'Fecha Expiracion': x.s374_Fechaexpiracion
        , 'Cobertura': x.s374_Cobertura.toString().replace('Sep', 'Set')
        , 'Numero Contratos': x.s374_NumeroContratos
        , 'Delta': x.s374_Delta
        , 'Strike': x.s374_Strike
        , 'Ifd': x.s374_Ifd.toString().replace('Futuro', 'Future')
        , 'Estrategia': x.s374_Estrategia
        , 'Prima Pagada': x.s374_PrimaPagada
        , 'Precio/Prima Mercado': ((x.s374_Ifd.toString().toLowerCase().includes('swap') || x.s374_Ifd.toString().toLowerCase().includes('future')) ? x.s374_PrecioProeveedor : x.s374_PrecioProeveedor)
        , 'Comentarios FO': x.s374_Comentarios
      }});
      
      this.portafolioIFDMoliendaService.getlistahedge(Number(this.fechaVigenteEntero)).subscribe((response:ListaHedge[])=>{
        let listaDataHedge = response.map((x) => {return {
          'F. Unwind': x.s373_FechaUnwind
          , 'F. Trade': x.s373_FechaTrade
          , 'Broker Referencia': x.s373_Broker
          , 'Ficha': x.s373_Ficha
          , 'Sociedad': x.s373_Sociedad
          , 'Contrato': x.s373_Contrato
          , 'Fecha Expiracion': x.s373_FechaExpiracion
          , 'Cobertura': x.s373_Cobertura.toString().replace('Sep', 'Set')
          , 'Numero Contratos': x.s373_NumeroContratos
          , 'Strike': x.s373_Strike
          , 'Ifd': x.s373_Ifd.toString().replace('Futuro', 'Future')
          , 'Estrategia': x.s373_Estrategia
          , 'Prima Pagada': x.s373_PrimaPagada
          , 'Liquidación': x.s373_PrecioProveedor
          , 'Comentarios FO': x.s373_Comentarios
        }});

        let worksheet = workbook.getWorksheet(commoditie);
        if(worksheet){
          let filaCabeceras = -1;
          let columnaHoja = -1;
          let commoditiesHedgeAbiertos: string[] = [];
          let nFilasXCommoditie = 0;
          listasHedgeAbierto.forEach((valFila) => {
            commoditiesHedgeAbiertos.push(valFila.commodity);
            nFilasXCommoditie = commoditiesHedgeAbiertos.filter(e => e == valFila.commodity).length;
            filaCabeceras = this.encontrarFilaPorColumna(worksheet, 1, valFila.commodity) + 1;
            for(let valColumna in valFila){
              columnaHoja = this.encontrarColumnaPorFila(worksheet, filaCabeceras, valColumna);
              if (filaCabeceras > -1 && columnaHoja > -1){
                let valorCelda = valFila[valColumna];
                if(valorCelda){
                  worksheet.getCell(filaCabeceras + nFilasXCommoditie, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
                }
              }
            }
          });
          
          //Llenar Liquidaciones
          filaCabeceras = this.encontrarFilaPorColumna(worksheet, 2, 'Liquidaciones') + 1;
          listaDataHedge?.forEach((valFila, idxFila) => {
            for(let valColumna in valFila){
              columnaHoja = this.encontrarColumnaPorFila(worksheet, filaCabeceras, valColumna);
              if (filaCabeceras > -1 && columnaHoja > -1){
                let valorCelda = valFila[valColumna];
                if(valorCelda){
                  worksheet.getCell(filaCabeceras + 1 + idxFila, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
                }
              }
            }
          });
        }
      })
    });


    //Commoditie simulado
    sheetName = commoditie == 'NNA' ? 'VITAPRO' : commoditie;
    worksheet = workbook.getWorksheet(sheetName);
    if(!worksheet){
      alert(`La hoja ${sheetName} no existe en la plantilla Excel`);
      this.loader.hide();
      this.flgCargando = false;
      return;
    }
    nombreProducto = worksheet.getCell('B2').value;

    //Llenando el Data Entry

    worksheet = workbook.getWorksheet('Data Entry');

    columnasPosicion.forEach((valFila, idxFila) => {
      worksheet.getCell(3, idxFila + 2).value = valFila[0].toString().replace('Sep', 'Set');
    });

    // MERCADO
    arrListaMercado?.forEach((valFila, idxFila) => {
      for(const valColumna in valFila){
        if(valFila[valColumna]){
          let fila = this.encontrarFilaDataEntry(worksheet, nombreProducto, valFila[0]);
          if (Number(valColumna) > 0 && fila > -1){
            let valorCelda = valFila[valColumna] == '-' ? 0 : valFila[valColumna];
            if(valorCelda){
              worksheet.getCell(fila, Number(valColumna) + 2).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
            }
          }
        }
      }
    });

    //POSICION
    let llegadasObtenidas: string[] = [];
    listaTablasPosicion?.forEach((tabla) => {
      tabla.data.forEach((valFila, idxFila) => {
        columnasPosicion.forEach((valColumna, idxColumna) => {
          if(valFila[valColumna[0]]){
            let fila = this.encontrarFilaDataEntry(worksheet, nombreProducto, valFila[columnasPosicion[0][0]]);
            if (Number(idxColumna) > 0 && fila > -1){
              let valorCelda = valFila[valColumna[0]] == '-' ? 0 : valFila[valColumna[0]];
              if(valorCelda){
                worksheet.getCell(fila, Number(idxColumna) + 2).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
              }
            }

            if (valFila[columnasPosicion[0][0]].startsWith('Llegada - ') && !llegadasObtenidas.includes(valFila[columnasPosicion[0][0]])){
              llegadasObtenidas.push(valFila[columnasPosicion[0][0]]);
            }
          }
        });
      });
    });

    //RESULTADOS
    listaTablasResultados?.forEach((tabla) => {
      tabla.data.forEach((valFila, idxFila) => {
        columnasPosicion.forEach((valColumna, idxColumna) => {
          if(valFila[valColumna[0]]){
            let fila = this.encontrarFilaDataEntry(worksheet, nombreProducto, valFila[columnasPosicion[0][0]]);
            if (Number(idxColumna) > 0 && fila > -1){
              let valorCelda = valFila[valColumna[0]] == '-' ? 0 : valFila[valColumna[0]];
              if(valorCelda){
                worksheet.getCell(fila, Number(idxColumna) + 2).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
              }
            }
          }
        });
      });
    });

    //Llenando las hojas de cada commoditie (IFDs y Liquidaciones)
    worksheet = workbook.getWorksheet(sheetName);

    //IFDs
    arrListaConsultaIFD?.forEach((tabla) => {
      let filaCabeceras = this.encontrarFilaPorColumna(worksheet, (tabla.tipoIFD == 'Liquidadas' ? 1 : 2), (tabla.tipoIFD == 'Liquidadas' ? '6. Liquidaciones' : tabla.tipoIFD)) + 1;
      let tablaIFDs = tabla.dataIFD.map((x) => {return {
        'Fecha Pacto': x.s303_FechaPacto
        , 'Broker Referencia': x.s303_BrokerReferencia
        , 'Ficha': x.s303_Ficha
        , 'Sociedad': x.s303_Sociedad
        , 'Contrato': x.s303_Contrato
        , 'Fecha Expiracion': x.s303_FechaExpiracion
        , 'Cobertura': x.s303_Cobertura
        , 'Numero Contratos': x.s303_NumeroContratos
        , 'Delta': x.s303_Delta
        , 'Strike': x.s303_Strike
        , 'Ifd': x.s303_Ifd.toString().replace('Futuro', 'Future')
        , 'Estrategia': (tabla.tipoIFD == 'Pricing' ? 'Pricing' : x.s303_Estrategia)
        , 'Prima Pagada': x.s303_PrimaPagada
        , 'Comentarios FO': x.s303_ComentariosFO
        , 'Swap Acc': x.s303_SwapAcc
        , 'CallPutAcc': x.s303_CallPutAcc
        , 'F. Unwind': x.s303_FechaPacto
        , 'Liquidación': x.s303_PrecioProveedor
        , 'Precio Acc.': x.s303_PreAcc
        , 'Nivel Acum': x.s303_NivelAcum
        , 'Nivel Doble': x.s303_NivelDoble
        , 'Nivel Call': x.s303_NivelCall
        , 'Caks x día': x.s303_CaksxDia
        , 'Dias Res.': x.s303_DiasRest
        , 'Activador': x.s303_Activador
        , 'Precio/Prima Mercado': ((x.s303_Ifd.toString().toLowerCase().includes('swap') || x.s303_Ifd.toString().toLowerCase().includes('future')) ? x.precioActual : x.s303_PrecioProveedor)
      }});
      
      if(tabla.tipoIFD == 'Caps' || tabla.tipoIFD == 'Floors'){
        if(arrListaConsultaIFD.filter(tabla => tabla.tipoIFD == 'Cobertura Económica').length > 0){
          let tablaCE =  arrListaConsultaIFD.filter(tabla => tabla.tipoIFD == 'Cobertura Económica')[0].dataIFD;
          tablaCE = tablaCE.filter(x => (tabla.tipoIFD == 'Caps' ? x.s303_Delta > 0 : x.s303_Delta < 0)).map((x) => {return {
            'Fecha Pacto': x.s303_FechaPacto
            , 'Broker Referencia': x.s303_BrokerReferencia
            , 'Ficha': x.s303_Ficha
            , 'Sociedad': x.s303_Sociedad
            , 'Contrato': x.s303_Contrato
            , 'Fecha Expiracion': x.s303_FechaExpiracion
            , 'Cobertura': x.s303_Cobertura
            , 'Numero Contratos': x.s303_NumeroContratos
            , 'Delta': x.s303_Delta
            , 'Strike': x.s303_Strike
            , 'Ifd': x.s303_Ifd.toString().replace('Futuro', 'Future')
            , 'Estrategia': (tabla.tipoIFD == 'Pricing' ? 'Pricing' : x.s303_Estrategia)
            , 'Prima Pagada': x.s303_PrimaPagada
            , 'Comentarios FO': x.s303_ComentariosFO
            , 'Swap Acc': x.s303_SwapAcc
            , 'CallPutAcc': x.s303_CallPutAcc
            , 'F. Unwind': x.s303_FechaPacto
            , 'Liquidación': x.s303_PrecioProveedor
            , 'Precio Acc.': x.s303_PreAcc
            , 'Nivel Acum': x.s303_NivelAcum
            , 'Nivel Doble': x.s303_NivelDoble
            , 'Nivel Call': x.s303_NivelCall
            , 'Caks x día': x.s303_CaksxDia
            , 'Dias Res.': x.s303_DiasRest
            , 'Activador': x.s303_Activador
            , 'Precio/Prima Mercado': ((x.s303_Ifd.toString().toLowerCase().includes('swap') || x.s303_Ifd.toString().toLowerCase().includes('future')) ? x.precioActual : x.s303_PrecioProveedor)
          }});
  
          tablaIFDs.push(...tablaCE);
        }
      }
      
      tablaIFDs.forEach((valFila, idxFila) => {
        for(const valColumna in valFila){
          let columnaHoja = this.encontrarColumnaPorFila(worksheet, filaCabeceras, valColumna);
          if (filaCabeceras > -1 && columnaHoja > -1){
            let valorCelda = valFila[valColumna];
            if(valorCelda){
              worksheet.getCell(filaCabeceras + 1 + idxFila, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
            }
          }
        }
      });
    });

    //Papeles Liquidados
    let filaCabeceras = this.encontrarFilaPorColumna(worksheet, 1, '7. Papeles Liquidados') + 1;

    arrListaConsultaPapelesLiquid?.forEach((valFila, idxFila) => {
      this.columnasPapelesLiquidados.forEach((valColumna, idxColumna) => {
        let columnaHoja = this.encontrarColumnaPorFila(worksheet, filaCabeceras, valColumna[1]);
        if(filaCabeceras > -1 && columnaHoja > -1){
          let valorCelda
          if(idxColumna == 0){
            let [year, month, day] = valFila[idxColumna].split('T')[0].split('-');
            valorCelda = `${day}/${month}/${year}`;
          }
          else{
            valorCelda = valFila[idxColumna];
          }
          if(valorCelda){
            worksheet.getCell(filaCabeceras + 1 + idxFila, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda.toString().replace(/,/g, ''))) ? Number(valorCelda.toString().replace(/,/g, '')) : valorCelda;
          }
        }
      });
    });

    //Ocultar filas vacias Llegadas
    let filaInicio = this.encontrarFilaPorColumna(worksheet, 1, '3. Posición') + 3;
    let filaFin = this.encontrarFilaPorColumna(worksheet, 2, 'Total TM') - 1;
    for(let fila = filaInicio; fila <= filaFin; fila++){
      if(!llegadasObtenidas.includes(worksheet.getCell(fila, 2).value)){
        worksheet.getRow(fila).hidden = true; // Ocultar la fila
      }
    }

    //Ocultar filas vacías Pricing
    filaInicio = this.encontrarFilaPorColumna(worksheet, 2, 'Pricing') + 2;
    filaFin = this.encontrarFilaPorColumna(worksheet, 2, 'Caps') - 3;
    for(let fila = filaInicio; fila <= filaFin; fila++){
      if(!worksheet.getCell(fila, 2).value){
        worksheet.getRow(fila).hidden = true; // Ocultar la fila
      }
    }
    
    //Ocultar filas vacías Caps
    filaInicio = this.encontrarFilaPorColumna(worksheet, 2, 'Caps') + 2;
    filaFin = this.encontrarFilaPorColumna(worksheet, 2, 'Floors') - 3;
    for(let fila = filaInicio; fila <= filaFin; fila++){
      if(!worksheet.getCell(fila, 2).value){
        worksheet.getRow(fila).hidden = true; // Ocultar la fila
      }
    }

    //Ocultar filas vacías Floors
    filaInicio = this.encontrarFilaPorColumna(worksheet, 2, 'Floors') + 2;
    switch(sheetName){
      case 'CORRECTOR':
      case 'ECONOMICO':
        filaFin = this.encontrarFilaPorColumna(worksheet, 2, 'Ventas Diferidas') - 3;
        break;
      case 'CPO':
        filaFin = this.encontrarFilaPorColumna(worksheet, 2, 'Inventario') - 3;
        break;
      default:
        filaFin = this.encontrarFilaPorColumna(worksheet, 1, '6. Liquidaciones') - 3;
        break;
    }
    
    for(let fila = filaInicio; fila <= filaFin; fila++){
      if(!worksheet.getCell(fila, 2).value){
        worksheet.getRow(fila).hidden = true; // Ocultar la fila
      }
    }

    //Ocultar filas vacías Ventas Diferidas o Inventario
    if(['CORRECTOR', 'ECONOMICO', 'CPO'].includes(sheetName)){
      filaInicio = this.encontrarFilaPorColumna(worksheet, 2, ['CORRECTOR', 'ECONOMICO'].includes(sheetName) ? 'Ventas Diferidas' : 'Inventario') + 2;
      filaFin = this.encontrarFilaPorColumna(worksheet, 1, '6. Liquidaciones') - 3;
      for(let fila = filaInicio; fila <= filaFin; fila++){
        if(!worksheet.getCell(fila, 2).value){
          worksheet.getRow(fila).hidden = true; // Ocultar la fila
        }
      }
    }

    //Ocultar filas vacías Liquidaciones
    filaInicio = this.encontrarFilaPorColumna(worksheet, 1, '6. Liquidaciones') + 2;
    filaFin = this.encontrarFilaPorColumna(worksheet, 1, '7. Papeles Liquidados') - 3;
    for(let fila = filaInicio; fila <= filaFin; fila++){
      if(!worksheet.getCell(fila, 2).value){
        worksheet.getRow(fila).hidden = true; // Ocultar la fila
      }
    }

    if (worksheet) {
      workbook.views = [{ state: 'frozen', xSplit: 0, ySplit: 0, topLeftCell: 'A1', activeCell: 'A1', showGridLines: true }];
      workbook.views[0].activeTab = workbook.worksheets.indexOf(worksheet);
    }

    workbook.eachSheet((sheet) => {
      if (sheet.name !== sheetName) {
        sheet.state = 'hidden';
      }
    });

    // Generar un nuevo Blob con los datos actualizados
    const updatedData = await workbook.xlsx.writeBuffer();
    const updatedBlob = new Blob([updatedData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // Descargar el archivo actualizado
    saveAs(updatedBlob, `${this.fechaVigenteEntero} FRET_SIM ${commoditie}.xlsx`);
    this.loader.hide();
    this.flgCargando = false;
  }

  obtenerDatosNNA_DH(workbook){
    let sociedad:number = 2;
    let idOpcion = '4';
    let opcion = 'NNA';
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
    const dia = fechaActual.getDate() < 10 ? `0${fechaActual.getDate()}` : `${fechaActual.getDate()}`;
    const fechaEntera = `${año}${mesFormateado}${dia}`;
    if( fechaEntera.toString() == this.fechaVigenteEntero){
      this.fretService.obtenerDatosPosicion(Number(this.fechaVigenteEntero),idOpcion,sociedad,opcion).subscribe(
        (response: objInitTabPosicion) => {
          let listaTablasPosicionNNA_DH: objTablas[];
          listaTablasPosicionNNA_DH = response.listaData;
          listaTablasPosicionNNA_DH.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
          this.llenarExcel(workbook, this.tabSeleccionado, this.arrListaMercado, this.listaTablasPosicion, this.listaTablasResultados, this.columnasPosicion, this.arrListaConsultaIFD, this.arrListaConsultaPapelesLiquid, listaTablasPosicionNNA_DH);
        },
        (error: HttpErrorResponse) => {
          this.loader.hide();
          this.flgCargando = false;
          alert(error.message);
        });
    }else{
      this.fretService.obtenerDatosFretHistorico(Number(this.fechaVigenteEntero),idOpcion,opcion).subscribe(
        (response: objInitTabPosicion) => {
          let listaTablasPosicionNNA_DH: objTablas[];
          listaTablasPosicionNNA_DH = response.listaData;
          this.llenarExcel(workbook, this.tabSeleccionado, this.arrListaMercado, this.listaTablasPosicion, this.listaTablasResultados, this.columnasPosicion, this.arrListaConsultaIFD, this.arrListaConsultaPapelesLiquid, listaTablasPosicionNNA_DH);
        },
        (error: HttpErrorResponse) => {
          this.loader.hide();
          this.flgCargando = false;
          alert(error.message);
      });

    }
  }

  exportarReporte(){
    this.loader.show();
    this.flgCargando = true;
    this.blobService.downloadFileBlob('FRET/FRET_SIM_Plantilla.xlsx', blob => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(e.target.result);
        let worksheet = workbook.getWorksheet('Data Entry');
        
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = fechaActual.getMonth() + 1;
        const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
        const dia = fechaActual.getDate() < 10 ? `0${fechaActual.getDate()}` : `${fechaActual.getDate()}`;
        const fechaEntera = `${año}${mesFormateado}${dia}`;
        let sociedad: number = 2;

        if(worksheet){
          // Extrae los datos de la hoja
          const rows = worksheet.getSheetValues();
          
          // Convierte las filas a JSON
          const json = rows.map(row => {
            // Asegúrate de que 'row' es un array
            if (Array.isArray(row)) {
              return row.map(cell => {
                // Maneja 'cell' si es undefined o null
                return cell != null ? cell.toString() : '';
              });
            } else {
                return []; // En caso de que 'row' sea null o undefined, retorna un array vacío
            }
          });

          const filasActualPY: number[] = [];
          const filasAnteriorPY: number[] = [];
  
          json.forEach((row, index) => {
            if (row[2] && typeof row[2] === 'string') {
              if (row[2] == 'PY_M') {
                filasActualPY.push(index);
              } else if (row[2] == 'PY_M-1') {
                filasAnteriorPY.push(index);
              }
            }
          });
  
          let flgPrimeraFilaPY: boolean = true;
          this.listaTablasResultados.forEach((tabla) => {
            tabla.data.forEach((valFila, idxFila) => {
              if (tabla.nombreTabla == 'Comparativo' && valFila['Descripcion'].startsWith('PY ')){
                if(flgPrimeraFilaPY){
                  filasActualPY.forEach((nFilaPY) => {
                    if(worksheet){
                      worksheet.getCell('B' + nFilaPY.toString()).value = valFila['Descripcion'];
                    }
                  });
                  flgPrimeraFilaPY = false;
                }
                else{
                  filasAnteriorPY.forEach((nFilaPY) => {
                    if(worksheet){
                      worksheet.getCell('B' + nFilaPY.toString()).value = valFila['Descripcion'];
                    }
                  });
                }
              }
            });
          });
        }
        
        worksheet = workbook.getWorksheet('Datos');
        let nFilaPY = 0;
        this.listaTablasResultados.forEach((tabla) => {
          tabla.data.forEach((valFila, idxFila) => {
            if (tabla.nombreTabla == 'Comparativo' && valFila['Descripcion'].startsWith('PY ')){
              nFilaPY++;
              if(worksheet){
                worksheet.getCell('A' + nFilaPY.toString()).value = valFila['Descripcion'];
              }
            }
          });
        });

        if(['CORRECTOR', 'ECONOMICO'].includes(this.tabSeleccionado)){
          this.obtenerDatosNNA_DH(workbook);
        } 
        else{
          this.llenarExcel(workbook, this.tabSeleccionado, this.arrListaMercado, this.listaTablasPosicion, this.listaTablasResultados, this.columnasPosicion, this.arrListaConsultaIFD, this.arrListaConsultaPapelesLiquid, null);
        }
      };

      reader.readAsArrayBuffer(blob);
    });
  }
  onDeltaMaxChange(){
    if(this.flgDeltaMax){

      // this.arrListaConsultaIFD_RealTime = [...this.arrListaConsultaIFD]; 
      this.arrListaConsultaIFD_RealTime = JSON.parse(JSON.stringify(this.arrListaConsultaIFD));

      let primaPagada: number
      let mtmFuturo: number
      let deltasXEstrategiaCaps: string[][] = []
      let deltasXEstrategiaFloors: string[][] = []

      this.arrListaConsultaIFD.forEach(objDestino => {
        if(objDestino.tipoIFD !== "Liquidadas"){
          objDestino.dataIFD.forEach( objData => {
            objData["precioActual"] = 10000
          })
        }
      })

      this.arrListaConsultaIFD.forEach(objDestino => {
        if(objDestino.tipoIFD !== "Liquidadas"){

          if(objDestino.tipoIFD == "Caps"){
            deltasXEstrategiaFloors = []
            deltasXEstrategiaCaps = this.fretRealTimeService.recalculoDeltaExpiracionCaps(objDestino.dataIFD);
          }else if(objDestino.tipoIFD == "Floors"){
            deltasXEstrategiaCaps = []
            deltasXEstrategiaFloors = this.fretRealTimeService.recalculoDeltaExpiracionFloors(objDestino.dataIFD);
          }
          
          if(objDestino.tipoIFD == "Caps" || objDestino.tipoIFD == "Floors"){
            objDestino.dataIFD.forEach( objData => {

              if(deltasXEstrategiaCaps.length > 0){
                if(estrategiasXComponente.includes(objData["s303_Estrategia"])){
                  objData["s303_Delta"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Operacion"].toString())[0][1])
                  objData["s303_Strike"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Operacion"].toString())[0][2])
                }else{
                  objData["s303_Delta"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Ficha"])[0][1])
                  objData["s303_Strike"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Ficha"])[0][2])
                }
              }else if(deltasXEstrategiaFloors.length > 0){
                objData["s303_Delta"] = Number(deltasXEstrategiaFloors.filter(obj => obj[0] === objData["s303_Ficha"])[0][1])
                objData["s303_Strike"] = Number(deltasXEstrategiaFloors.filter(obj => obj[0] === objData["s303_Ficha"])[0][2])
              }
  
              primaPagada = Math.abs(objData["s303_NumeroContratos"]) * Math.abs(objData["s303_PrimaPagada"]) * this.factor ;
              mtmFuturo = (objData["precioActual"] - objData["s303_Strike"]) * Math.abs(objData["s303_NumeroContratos"]) * this.factor;
              
              // CALL
              if(objData["s303_Ifd"].includes("Swap") || objData["s303_Ifd"].includes("Forward")){
                objData["s303_M2M"] = mtmFuturo
              }else if(objData["s303_Ifd"].includes("Call")){
                if(objData["s303_Ifd"].substring(0,1) == '+'){ //<---- Compra
                  objData["s303_M2M"] = (objData["precioActual"] < objData["s303_Strike"]) ? primaPagada * -1 : primaPagada * -1 + mtmFuturo;  
                }else if(objData["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                  objData["s303_M2M"] = (objData["precioActual"] < objData["s303_Strike"]) ? primaPagada : primaPagada + mtmFuturo * -1; 
                }
              }else if(objData["s303_Ifd"].includes("Put")){
                if(objData["s303_Ifd"].substring(0,1) == '+'){ //<---- Compra
                  objData["s303_M2M"] = (objData["precioActual"] > objData["s303_Strike"]) ? primaPagada * -1 : primaPagada * -1 + mtmFuturo * -1;  
                }else if(objData["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                  objData["s303_M2M"] = (objData["precioActual"] > objData["s303_Strike"]) ? primaPagada : primaPagada + mtmFuturo; 
                } 
              }
            })
          }
          
        } 
      })
      this.recalculoCapsFloors();
      this.calculoResultadoIFD_MTM();
      this.calcularCFRSIM();
    }else{
      
      // this.arrListaConsultaIFD_RealTime
      this.arrListaConsultaIFD = [...this.arrListaConsultaIFD_RealTime]; 

      this.recalculoCapsFloors()
      // this.valorizar();
      this.calculoResultadoIFD_MTM();
      this.calcularCFRSIM();
    }
  }

  onDeltaMinChange(){
    if(this.flgDeltaMin){

      // this.arrListaConsultaIFD_RealTime = [...this.arrListaConsultaIFD]; 
      this.arrListaConsultaIFD_RealTime = JSON.parse(JSON.stringify(this.arrListaConsultaIFD));

      let primaPagada: number
      let mtmFuturo: number
      let deltasXEstrategiaCaps: string[][] = []
      let deltasXEstrategiaFloors: string[][] = []

      this.arrListaConsultaIFD.forEach(objDestino => {
        if(objDestino.tipoIFD !== "Liquidadas"){
          objDestino.dataIFD.forEach( objData => {
            objData["precioActual"] = 0
          })
        }
      })

      this.arrListaConsultaIFD.forEach(objDestino => {
        if(objDestino.tipoIFD !== "Liquidadas"){

          if(objDestino.tipoIFD == "Caps"){
            deltasXEstrategiaFloors = []
            deltasXEstrategiaCaps = this.fretRealTimeService.recalculoDeltaExpiracionCaps(objDestino.dataIFD);
          }else if(objDestino.tipoIFD == "Floors"){
            deltasXEstrategiaCaps = []
            deltasXEstrategiaFloors = this.fretRealTimeService.recalculoDeltaExpiracionFloors(objDestino.dataIFD);
          }
          
          if(objDestino.tipoIFD == "Caps" || objDestino.tipoIFD == "Floors"){
            objDestino.dataIFD.forEach( objData => {

              if(deltasXEstrategiaCaps.length > 0){
                if(estrategiasXComponente.includes(objData["s303_Estrategia"])){
                  objData["s303_Delta"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Operacion"].toString())[0][1])
                  objData["s303_Strike"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Operacion"].toString())[0][2])
                }else{
                  objData["s303_Delta"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Ficha"])[0][1])
                  objData["s303_Strike"] = Number(deltasXEstrategiaCaps.filter(obj => obj[0] === objData["s303_Ficha"])[0][2])
                }
              }else if(deltasXEstrategiaFloors.length > 0){
                objData["s303_Delta"] = Number(deltasXEstrategiaFloors.filter(obj => obj[0] === objData["s303_Ficha"])[0][1])
                objData["s303_Strike"] = Number(deltasXEstrategiaFloors.filter(obj => obj[0] === objData["s303_Ficha"])[0][2])
              }
  
              primaPagada = Math.abs(objData["s303_NumeroContratos"]) * Math.abs(objData["s303_PrimaPagada"]) * this.factor ;
              mtmFuturo = (objData["precioActual"] - objData["s303_Strike"]) * Math.abs(objData["s303_NumeroContratos"]) * this.factor;
              
              // CALL
              if(objData["s303_Ifd"].includes("Swap") || objData["s303_Ifd"].includes("Forward")){
                objData["s303_M2M"] = mtmFuturo
              }else if(objData["s303_Ifd"].includes("Call")){
                if(objData["s303_Ifd"].substring(0,1) == '+'){ //<---- Compra
                  objData["s303_M2M"] = (objData["precioActual"] < objData["s303_Strike"]) ? primaPagada * -1 : primaPagada * -1 + mtmFuturo;  
                }else if(objData["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                  objData["s303_M2M"] = (objData["precioActual"] < objData["s303_Strike"]) ? primaPagada : primaPagada + mtmFuturo * -1; 
                }
              }else if(objData["s303_Ifd"].includes("Put")){
                if(objData["s303_Ifd"].substring(0,1) == '+'){ //<---- Compra
                  objData["s303_M2M"] = (objData["precioActual"] > objData["s303_Strike"]) ? primaPagada * -1 : primaPagada * -1 + mtmFuturo * -1;  
                }else if(objData["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                  objData["s303_M2M"] = (objData["precioActual"] > objData["s303_Strike"]) ? primaPagada : primaPagada + mtmFuturo; 
                } 
              }
            })
          }
          
        } 
      })
      this.recalculoCapsFloors();
      this.calculoResultadoIFD_MTM();
      this.calcularCFRSIM();
    }else{
      
      // this.arrListaConsultaIFD_RealTime
      this.arrListaConsultaIFD = [...this.arrListaConsultaIFD_RealTime]; 

      this.recalculoCapsFloors()
      // this.valorizar();
      this.calculoResultadoIFD_MTM();
      this.calcularCFRSIM();
    }
  }

  actualizaPrecioPalma(){

    this.fretRealTimeService.obtenerPreciosPalma().subscribe(
      (response) => {
        console.log(response);

        if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){

          this.arrListaConsultaIFD.forEach(objDestino => {
            if(objDestino.tipoIFD !== "Liquidadas"){

              Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                if (typeof valorResponse === 'object' && valorResponse !== null) {
                  objDestino.dataIFD.forEach(objData => {

                    if (objData["s303_Contrato"] == valorResponse["T503_Ticker"].replace(/\s/g, '')) {
                      objData["precioAnterior"] = objData["precioActual"];
                      objData["precioActual"] = valorResponse["T503_Value"];
                    }
                  }); 

              (this.arrListaMercado[0] as string[]).map((element, index) => {
                if (element === valorResponse["T503_Ticker"].replace(/\s/g, '')) {
                  this.arrListaMercado[1][index] = valorResponse["T503_Value"].toString();
                }
              });
                }

              });

              
            }
           
          });

        }
        
        this.spreadCPO = []
          let precioCPO: number;
          let futuro3CPO: number;
          if(this.arrListaMercado != undefined && this.arrListaMercado.length > 0){
            let indexFuturoC3: number = this.arrListaMercado.findIndex(obj => obj[0] === "Monthly avg c3 + Spread");
            if(indexFuturoC3 > 0){
              let indiceFuturo: number = this.arrListaMercado.findIndex(obj => obj[0] === "Futuro");
              (this.arrListaMercado[0] as string[]).map((element, index) => {
                if (index != 0) {
                  precioCPO = (Number(this.arrListaMercado[indiceFuturo][index]) || 0)
                  futuro3CPO = (Number(this.arrListaMercado[indexFuturoC3][index]) || 0)
                  this.spreadCPO.push([futuro3CPO.toString(),""]);
                  if(futuro3CPO <= 100){
                    this.arrListaMercado[indexFuturoC3][index] =  futuro3CPO + precioCPO
                  }
                }
              }); 
            }
          }

      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }

}

const extractLastPart = (input: string): string => {
  const match = input.match(/-\s*(\w+)$/);
  return match ? match[1] : '';
};