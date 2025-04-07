import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { LoadingService } from 'src/app/components/loading.service';
import { ColumnasIFD } from 'src/app/models/Fret/ColumnasIFD';
import { ConsultaIFDsFret } from 'src/app/models/Fret/ConsultaIFDsFret';
import { ProductosFret } from 'src/app/models/Fret/ProductosFret';
import { listaConfirmacionInputs } from 'src/app/models/Fret/listaConfirmacionInputs';
import { listaDataEntry } from 'src/app/models/Fret/listaDataEntry';
import { objInitTabPosicion } from 'src/app/models/Fret/objInitTabPosicion';
import { objTablas } from 'src/app/models/Fret/objTablas';
import Swal from 'sweetalert2';
import { DetalleFretComponent } from '../detalle-fret/detalle-fret.component';
import { objInitFormDataEntry } from 'src/app/models/Fret/objInitFormDataEntry';
import { Observable, Subscription } from 'rxjs';
import { ListaConsultaIFD } from 'src/app/models/Fret/ListaConsultaIFD';
import { saveAs } from 'file-saver';
import { FretService } from 'src/app/models/Fret/fret.service';
import { FretRealTimeService } from 'src/app/shared/services/FretRealTimeService';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import * as ExcelJS from 'exceljs';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { ListaHedgeAbierto } from 'src/app/models/IFD/datoshedgeabierto';
import { ListaHedge } from 'src/app/models/IFD/datoshedge';
import { HedgestrategicComponent } from './hedgestrategic/hedgestrategic.component';
import { DetalleTipoTrigoComponent } from '../detalle-tipo-trigo/detalle-tipo-trigo.component';
import { simulacionPreciosService } from '../precio-commodity/simulacionPreciosService';
@Component({
  selector: 'app-fret-real-time',
  templateUrl: './fret-real-time.component.html',
  styleUrls: ['./fret-real-time.component.scss']
})
export class FretRealTimeComponent implements OnInit,OnDestroy {

  @ViewChild('otroComponenteTemplate', { read: TemplateRef }) otroComponenteTemplate: TemplateRef<any>;
  @ViewChild(HedgestrategicComponent) hedgestrategicComponent: HedgestrategicComponent;

  
  private subscription: Subscription;
  selectedOptions: string[] = [];
  fechaVigente: NgbDateStruct | null;
  fechaVigenteEntero: string;
  fechaVigenteString: string;
  date: Date = new Date();
  date1: NgbDateStruct;
  queryResult: any[];
  tabSeleccionado: string; 
  flgDisabled: boolean = false; 
  fecha: number;
  objDatosFret$!: Observable<objInitFormDataEntry>
  objInitFormulario: objInitFormDataEntry = new objInitFormDataEntry();

  listaProductosFret:ProductosFret[]=[];
  arrListaConsultaIFD:ListaConsultaIFD[]=[];
  arrListaMercado:Object[]=[];
  arrListaResultados:Object[]=[];
  arrListaResultadosComparativo:Object[]=[];
  listaPrecioFOBPalma:Object[]=[];
  flgConsultarCFR: boolean = true;
  listaTablasPosicion: objTablas[] = [];
  listaTablasResultados: objTablas[] = [];
  columnasPosicion: Object[] = [];

  columnasResultados: Object [] = [];

  columnasPrueba: any[] = [];
  datos: any[][] = [];
 
  startIndexs: number[] = [];
  endIndexs: number[] = [];
  pageSize = 2;
  pageSizeOptions = [2, 10, 25];
  sortDirections: { [tablaIndex: number]: { [propiedad: string]: string } } = {};

  isLoading = false;
  typeSelected: string;
  isOverlay = false;
  myModal=false;

  listaTablaPapelesLiquid: objTablas[] = [];
  arrListaConsultaPapelesLiquid:Object[]=[];
  columnasPapelesLiquidados: Object [] = [];

  fechaActual = new Date();

  flgHabilitarSimulacion: boolean = false
  listaTrigoXMes: string[][] = []

  spreadCPO: string[][] = []
  unidadMedida: string = ''

  // Obtiene la fecha en milisegundos
  // fechaEnMilisegundos = this.fechaActual.getTime();

  fechaFormateada = this.formatearFecha(this.fechaActual);

  formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);

    return `${año}${mes}${dia}`;
  }


  // Convierte la fecha en milisegundos a un número entero
  fechaEntera =  this.fechaFormateada//Math.floor(this.fechaEnMilisegundos / 1000);
  obtenerPrecio:any;
  
  obtenerValorizacion:any;

  loading$= this.loader.loading$

  flgResponsePrecio: boolean = true;
  flgResponseMTM: boolean = true;

  tablaDetalleConfirmaciones: listaConfirmacionInputs[]

  flgCargando: boolean = false;

  mostrarBotonPalma: boolean = false; 

  factorContractInMetricTons: number;
  factorContractInPrice: number;

  nCommoditiesExportados: number;

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

  public portafolioDS: MatTableDataSource<listaDataEntry>;
  //columnas: string[] = [];
  columnas: any[] = [];
  //displayedColumns: string[] = [];
  
  @ViewChild(MatPaginator, { static: true }) paginadoPortafolio!: MatPaginator;
  @ViewChild(MatSort) sortPortafolio!: MatSort;

  constructor(private fretService: FretService,
              private config: NgbDatepickerConfig,
              public dialog: MatDialog,
              private loader:LoadingService,
              private fretRealTimeService: FretRealTimeService,
              private modalService: NgbModal,
              private router: Router,
              private blobService: AzureBlobStorageService,
              private portafolioIFDMoliendaService: PortafolioIFDMoliendaService,
            private servicioSim: simulacionPreciosService) {
                this.config.markDisabled = (date: NgbDateStruct) => {
                  const day = new Date(date.year, date.month - 1, date.day).getDay();
                  return day === 0 || day === 6;
            };
               }

  ngOnInit(): void {
    this.obtenerProductosFret()
    this.suscribirSocket();
    
  }

  suscribirSocket(){
    this.date = new Date();
    this.fechaVigente = {day: this.date.getDate(),month: this.date.getMonth() + 1,year: this.date.getFullYear()};
    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);
    this.fechaVigenteString = this.fechaVigenteEntero.substring(7,2) + this.fechaVigenteEntero.substring(5,2) + this.fechaVigenteEntero.substring(1,4)

    this.fretRealTimeService.flgSimulacion = false;
    
    this.subscription = this.servicioSim.getMessages().subscribe(message => {

      
      if(this.fechaEntera.toString() == this.fechaVigenteEntero &&this.selectedOptions[0]!== 'Hedge Estratégico'){
        // console.log('Mensaje recibido en el componente Real Time:', message);
        message = "{" + message + "}"
        const data = JSON.parse(message);

        if('precios' == 'precios'){
          if (data.ticker.startsWith("MW")) {
            data.ticker = "MWE" + data.ticker.substring(2);
          } 
      
          if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
            this.arrListaConsultaIFD.forEach(objDestino => {
              if(objDestino.tipoIFD !== "Liquidadas"){
                  objDestino.dataIFD.forEach(objDestino => {
                    if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '')) {
                        objDestino["precioAnterior"] = objDestino["precioActual"];
                        objDestino["precioActual"] = data.precio;
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

                      try {
                        if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                          objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                        }
                      } catch (error) {}
                    }

                    if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '')) {
        
                      if(objDestino["precioAnterior"] != objDestino["precioActual"]){
                        // this.calculoResultadoIFD_MTM();
                        // this.calcularCFR();
                        // this.calcularMTMPricingFisico();
                      }
                    }
                  }); 
              }
            });  
          }

          if(this.arrListaMercado != undefined && this.arrListaMercado.length > 0){
            (this.arrListaMercado[0] as string[]).map((element, index) => {
              if (element === data.ticker.replace(/\s/g, '')) {
                this.arrListaMercado[1][index] = data.precio.toString();
              }
            }); 
          }
        }else{

          let posicionespacio: number = data.ticker.indexOf(" ");
          let segundoEspacio: number = data.ticker.indexOf(" ", posicionespacio + 1);
          let ticker = data.ticker.slice(0, posicionespacio - 1);
          let strike = data.ticker.slice(posicionespacio + 1, segundoEspacio);

          if (ticker.startsWith("MW")) {
            ticker = "MWE" + ticker.substring(2);
          }

          if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
            this.arrListaConsultaIFD.forEach(objDestino => {
              if(objDestino.tipoIFD !== "Liquidadas"){
                  objDestino.dataIFD.forEach(objDestino => {
                    if((objDestino["s303_Ifd"].includes("Put") || objDestino["s303_Ifd"].includes("Call")) && objDestino["s303_Contrato"] == ticker.replace(/\s/g, '') && 
                          objDestino["s303_Strike"]  ==  strike ){

                            objDestino["s303_PrecioProveedor"] = data.prima

                            if(objDestino["s303_Ifd"].includes("Call")){
                              if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                                objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                              }else{
                                objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                              }
                            }else if(objDestino["s303_Ifd"].includes("Put")){
                              if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                                objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"] ) * objDestino["s303_Activador"]) * -1
                              }else{
                                objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                              }
                            }
                            try {
                              if(['CORRECTOR', 'ECONOMICO', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                                objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                              }
                            } catch (error) {}
                    }
                  }); 
              }

              if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '')) {
        
                // if(objDestino["precioAnterior"] != objDestino["precioActual"]){
                //   this.calculoResultadoIFD_MTM();
                //   this.calcularCFR();
                //   this.calcularMTMPricingFisico();
                // }
              }
            }); 
          }
        }
      }


    });
    // this.subscription = this.fretRealTimeService.getMessages().subscribe(message => {

    //   // if(this.fechaEntera.toString() == this.fechaVigenteEntero &&this.selectedOptions[0]!== 'Hedge Estratégico'){
    //   //   // console.log('Mensaje recibido en el componente Real Time:', message);
    //   //   message = "{" + message + "}"
    //   //   const data = JSON.parse(message);

    //   //   if(data.tipo == 'precios'){
    //   //     if (data.ticker.startsWith("MW")) {
    //   //       data.ticker = "MWE" + data.ticker.substring(2);
    //   //     } 
      
    //   //     if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
    //   //       this.arrListaConsultaIFD.forEach(objDestino => {
    //   //         if(objDestino.tipoIFD !== "Liquidadas"){
    //   //             objDestino.dataIFD.forEach(objDestino => {
    //   //               if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '')) {
    //   //                   objDestino["precioAnterior"] = objDestino["precioActual"];
    //   //                   objDestino["precioActual"] = data.precio;
    //   //               }
                        
    //   //               if(objDestino["s303_Activador"] != 0 && objDestino["s303_Activador"] != null){

    //   //                 if(objDestino["s303_Ifd"].includes("Call")){
    //   //                   if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
    //   //                     objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
    //   //                   }else{
    //   //                     objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
    //   //                   }
    //   //                 }else if(objDestino["s303_Ifd"].includes("Put")){
    //   //                   if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
    //   //                     objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"]  ) * objDestino["s303_Activador"]) * -1
    //   //                   }else{
    //   //                     objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
    //   //                   }
    //   //                 }else{
    //   //                   // objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
    //   //                   if(objDestino["s303_Ifd"].substring(0,1) == '-'){
    //   //                     objDestino["s303_M2M"] = ((objDestino["s303_Strike"] - objDestino["precioActual"]) * objDestino["s303_Activador"])
    //   //                    }else{
    //   //                     objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
    //   //                    }
    //   //                 }

    //   //                 try {
    //   //                   if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
    //   //                     objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
    //   //                   }
    //   //                 } catch (error) {}
    //   //               }

    //   //               if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '')) {
        
    //   //                 if(objDestino["precioAnterior"] != objDestino["precioActual"]){
    //   //                   this.calculoResultadoIFD_MTM();
    //   //                   this.calcularCFR();
    //   //                   this.calcularMTMPricingFisico();
    //   //                 }
    //   //               }
    //   //             }); 
    //   //         }
    //   //       });  
    //   //     }

    //   //     if(this.arrListaMercado != undefined && this.arrListaMercado.length > 0){
    //   //       (this.arrListaMercado[0] as string[]).map((element, index) => {
    //   //         if (element === data.ticker.replace(/\s/g, '')) {
    //   //           this.arrListaMercado[1][index] = data.precio.toString();
    //   //         }
    //   //       }); 
    //   //     }
    //   //   }else{

    //   //     let posicionespacio: number = data.ticker.indexOf(" ");
    //   //     let segundoEspacio: number = data.ticker.indexOf(" ", posicionespacio + 1);
    //   //     let ticker = data.ticker.slice(0, posicionespacio - 1);
    //   //     let strike = data.ticker.slice(posicionespacio + 1, segundoEspacio);

    //   //     if (ticker.startsWith("MW")) {
    //   //       ticker = "MWE" + ticker.substring(2);
    //   //     }

    //   //     if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){
    //   //       this.arrListaConsultaIFD.forEach(objDestino => {
    //   //         if(objDestino.tipoIFD !== "Liquidadas"){
    //   //             objDestino.dataIFD.forEach(objDestino => {
    //   //               if((objDestino["s303_Ifd"].includes("Put") || objDestino["s303_Ifd"].includes("Call")) && objDestino["s303_Contrato"] == ticker.replace(/\s/g, '') && 
    //   //                     objDestino["s303_Strike"]  ==  strike ){

    //   //                       objDestino["s303_PrecioProveedor"] = data.prima

    //   //                       if(objDestino["s303_Ifd"].includes("Call")){
    //   //                         if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
    //   //                           objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
    //   //                         }else{
    //   //                           objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
    //   //                         }
    //   //                       }else if(objDestino["s303_Ifd"].includes("Put")){
    //   //                         if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
    //   //                           objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"] ) * objDestino["s303_Activador"]) * -1
    //   //                         }else{
    //   //                           objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
    //   //                         }
    //   //                       }
    //   //                       try {
    //   //                         if(['CORRECTOR', 'ECONOMICO', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
    //   //                           objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
    //   //                         }
    //   //                       } catch (error) {}
    //   //               }
    //   //             }); 
    //   //         }

    //   //         if (objDestino["s303_Contrato"] == data.ticker.replace(/\s/g, '')) {
        
    //   //           if(objDestino["precioAnterior"] != objDestino["precioActual"]){
    //   //             this.calculoResultadoIFD_MTM();
    //   //             this.calcularCFR();
    //   //             this.calcularMTMPricingFisico();
    //   //           }
    //   //         }
    //   //       }); 
    //   //     }
    //   //   }
    //   // }
    // });
  }
  actualizarFecha(){
    
    this.fechaVigenteEntero = this.dateToString(this.fechaVigente);

    this.cargarForm(this.tabSeleccionado);
  }

//selectedOptions: string[] = [];
toggleSelection(opcion: string): void {
  this.unidadMedida = ''
  this.flgHabilitarSimulacion = false;
  if(opcion == 'CPO'){
    this.mostrarBotonPalma = true;
  }else{
    this.mostrarBotonPalma = false;
  }
  
  //this.fretService._disconnect();
  this.selectedOptions = [];
 
  if (this.selectedOptions.includes(opcion)) {
    this.selectedOptions = this.selectedOptions.filter(item => item !== opcion);
  } else {
    this.selectedOptions.push(opcion);
  }
  this.tabSeleccionado = opcion
   // Cargar formulario solo si la opción no es 'Hedge Estratégico'
  if (opcion !== 'Hedge Estratégico') {
    if (this.subscription.closed) {
      this.suscribirSocket();
    }
    this.flgHabilitarSimulacion = false;
    this.cargarForm(this.tabSeleccionado);
    
  }else{
    this.valorizar();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

   this.flgResponseMTM = true; 
   this.flgResponsePrecio = true; 

}
  
  // getColumnas(): string[] {
  //   return this.columnas.map(columna => columna.descripcion);
  // }

  // onPageChange(event: any, tablaIndex: number): void {
  //   this.startIndexs[tablaIndex] = event.pageIndex * event.pageSize;
  //   this.endIndexs[tablaIndex] = this.startIndexs[tablaIndex] + event.pageSize;
  // }

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


  
  

  // notificarGuardadoAutomatico(){
  //   const Toast = Swal.mixin({
  //     toast: true,
  //     position: 'top-end',
  //     showConfirmButton: false,
  //     timer: 3000,
  //     timerProgressBar: true,
  //     didOpen: (toast) => {
  //       toast.addEventListener('mouseenter', Swal.stopTimer)
  //       toast.addEventListener('mouseleave', Swal.resumeTimer)
  //     }
  //   })
    
  //   Toast.fire({
  //     icon: 'success',
  //     title: 'Se guardó la información modificada.  '
  //   })
  // }
  
  // getBackgroundColor(element: any, column: any): string {
  //   return element[column.nombre_Columna + '_modified'] ? '#C80F1E' : '#1e5532';
  // }
  
  // formatNumber(value: string): string {
  //   const sanitizedValue = value.replace(/\./g, '').replace(/\,/g, ''); // Eliminar todos los puntos y comas existentes
  //   const numberValue = Number(sanitizedValue);
  //   if (isNaN(numberValue)) {
  //     return '';
  //   }
  //   const formattedValue = new Intl.NumberFormat().format(numberValue);
  //   return formattedValue;
  // }

 
  
  // esNumero(cadena: string): boolean {
  //   return !isNaN(+cadena);
  // }
  
  // _handleInput(value: string): string {

  //   if (!this.esNumero(value)){
  //     return  "";
  //   // }else if (!value) {
  //   //   return  value = "";
  //   }else{
  //     return  value;
  //   }
  //   // const cleaned = (value||"").replace(/\D/g,'');
  //   // const num : number = parseFloat(cleaned)/100;
  //   // const formatted = formatNumber(num, "en", "1.2-2")
  //   // return value = formatted;
  //   // this.onChange(num);
  // }






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
      // if(!this.fretRealTimeService.flgEstadoSocket && this.fretRealTimeService.flgEstadoSocket != undefined){
      //   this.fretRealTimeService.initWebSocket();
      // }
      
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
            // this.actualizaPrecioPalma();
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

          if(this.tabSeleccionado == 'CPO'){
            for (let i = 0; i < this.listaTablasPosicion.length; i++) {
              const tabla = this.listaTablasPosicion[i];
              let cont = 0
              if (tabla.nombreTabla === 'Flat') {
                for(let columna of this.columnasResultados){
                  if(columna.toString() != "Descripcion" && columna.toString() != "CE" && columna.toString() != "Total"){
                    if(tabla.data[0][columna.toString()] != 0 &&  tabla.data[1][columna.toString()] == 0){
                      tabla.data[1][columna.toString()] = this.arrListaMercado[5][cont].toString();
                    }
                  } 
                  cont++
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

          this.recalculoCapsFloors();
          this.calculoResultadoIFD_MTM();
          this.calcularMTMPricingFisico();
          
          this.calcularResumenBases();

          this.loader.hide();

        },
        (error: HttpErrorResponse) => {
          this.loader.hide();
          this.flgCargando = false
          alert(error.message);
        });
    }else{
      this.flgHabilitarSimulacion = false;
      this.fretRealTimeService.closeConnection();
      this.fretRealTimeService.flgHistorico = true;
      this.fretService.obtenerDatosFretHistorico(Number(this.fechaVigenteEntero),idOpcion.toString(),opcion).subscribe(
        (response: objInitTabPosicion) => {

          this.flgCargando = false

          this.listaTablasPosicion = response.listaData;
          this.columnasPosicion = response.columnas;

          const newData: Object[] =response.listaDataResumen.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
          this.arrListaResultados  = newData.map((item: any): any => item.slice(1));


          const newDataResumen: Object[] =response.listaDataResumenComparativo.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
          this.arrListaResultadosComparativo  = newDataResumen.map((item: any): any => item.slice(1));
          
          let ticker: string = "CPSR";

          const newDataMercado: Object[] =response.listaDataMercado.sort((a: any, b: any) => a[0] - b[0]);
          this.arrListaMercado  = newDataMercado.map((item: any): any => item.slice(1));
          if(this.arrListaMercado.length > 0){
            this.arrListaMercado[0][0]='Ticker'
          }

          if(this.selectedOptions[0] == 'CPO'){
            const dataFOBPalma: Object[] =response.listaFOBPalma.sort((a: any, b: any) => a[0] - b[0]);
            this.listaPrecioFOBPalma  = dataFOBPalma.map((item: any): any => item.slice(1));
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
                
                objDestino.dataIFD.map(objeto => {
                  objeto["precioActual"] = objeto.s303_Mkt;
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
           
            // console.log(this.arrListaConsultaIFD[0].cabecera)

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
          
          this.recalculoCapsFloors();
          this.calculoResultadoIFD_MTM();
          this.calcularCFR();
          this.calcularMTMPricingFisico();
          
          this.loader.hide();

        },
        (error: HttpErrorResponse) => {
          this.loader.hide();
          this.flgCargando = false
          alert(error.message);
      });

    }
  }



  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    // Prevent the tab from closing
    event.preventDefault();

    // Show the confirmation dialog
    const confirmationMessage = 'Are you sure you want to close the page?';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  inicializar(){
    // setTimeout(()=>{ this.fretService._send() }, 4000)
    this.objDatosFret$ = this.fretService.obtenerDatos();
  }

  obtenerProductosFret(){
    this.fretService.obtenerProductosFret().subscribe(
      (response: ProductosFret[]) => {
        this.listaProductosFret = response;
        this.tabSeleccionado=this.listaProductosFret[0].descripcion
        this.selectedOptions= [this.tabSeleccionado];
        if (this.tabSeleccionado !== 'Hedge Estratégico') {
          this.cargarForm(this.tabSeleccionado);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  transposeArray(arr: ColumnasIFD[]): string[] {
    return arr.map(item => item.descripcion);
    // return arr.filter(item => item.status).map(item => item.descripcion);
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
        this.notificarGuardadoAutomatico();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  obtenerConfirmacionInputs(modalDetalle:any){
    
    this.fretService.obtenerConfirmacionInputs().subscribe(
      (response: listaConfirmacionInputs[]) => {
        this.tablaDetalleConfirmaciones = response
        this.modalService.open(modalDetalle,{windowClass : "listaConfirmaciones",centered: true});
        // console.log(response)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  

  notificarGuardadoAutomatico(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Se guardó la información modificada.  '
    })
  }

  // onRightClick(event: MouseEvent, registro: any, columna: any): void {
  //   // Evita que se muestre el menú contextual predeterminado del navegador
  //   event.preventDefault();
  
  //   // Aquí puedes agregar la lógica específica que deseas realizar en el clic derecho
  //   console.log('Clic derecho realizado en:', registro[columna.propiedad]);
  // }

  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  onContextMenu(event: MouseEvent, item: Item, item2:Item) {

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item1': item , 'item2': item2 };
    this.contextMenu.menu.focusFirstItem('mouse');
    if(item2.toString() != 'Flete'){
      if(item2.toString() == 'Flat' && this.tabSeleccionado == 'NNA'){
        this.contextMenu.openMenu();
      }else if(item2.toString() != 'Flat'){
        this.contextMenu.openMenu();
      }
      
    }
    
  }

  
  modalDetalleIFD(detalleForm:any){
    //RESETEO DE EL MODELO

    this.isLoading = true;
    setTimeout( () => this.isLoading = false, 2000 );
    
    this.myModal=true;
    if (true && this.contextMenu.menuData.item2 !='Flat'){
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
      }else if(true && this.contextMenu.menuData.item2 =='Flat'){
        let idOpcion:number;
        idOpcion=Number(this.listaProductosFret.find(x => x.descripcion==this.tabSeleccionado)?.idProductFret)
        let dialogRef = this.dialog.open(DetalleTipoTrigoComponent, {width: '90%', data: { dato1: Number(this.fechaVigenteEntero), dato2:idOpcion //Abierto
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
    
    convertirDatos(datos) {
      return datos.map(row => {
        const newRow = {};
        Object.keys(row).forEach(key => {
          let valorOriginal;
          if(row[key] != null){
            if(row[key] == '-'){
              valorOriginal = 0;
            }else if(row[key].includes(',')){
              valorOriginal = row[key].replaceAll(',','');
            }else{
              valorOriginal = row[key];
            }
          }

          newRow[key] = !isNaN(Number(valorOriginal)) && valorOriginal !== "" ? Number(valorOriginal) : valorOriginal;
        });
        return newRow;
      });
    }

    convertirDatosPosicion(datos, columnas) {

      const propiedadesSinProcesar = Object.keys(datos[0]);

       const propiedadesOrdenadas = new Map<string, string>();
      columnas.forEach(([mes, tipo], index) => {
        const propiedadSinProcesar = propiedadesSinProcesar.find(p => p.includes(mes));
        if (propiedadSinProcesar) {
          propiedadesOrdenadas.set(propiedadSinProcesar, `${index}_${tipo}`);
        }
      });
      
      return datos.map(row => {
        const newRow = {};
        propiedadesOrdenadas.forEach((propiedadOrdenada, propiedadSinProcesar) => {
          let valorOriginal //= row[propiedadSinProcesar];
          if(row[propiedadSinProcesar] != null){
            if(row[propiedadSinProcesar] == '-'){
              valorOriginal = 0;
            }else if(row[propiedadSinProcesar].includes(',')){
              valorOriginal = row[propiedadSinProcesar].replaceAll(',','');
            }else{
              valorOriginal = row[propiedadSinProcesar];
            }
          }

          if (valorOriginal !== undefined) {
            // Aplicamos la conversión si el tipo es 'number'
            if (propiedadOrdenada.endsWith('_number')) {
              newRow[propiedadOrdenada] = !isNaN(Number(valorOriginal)) && valorOriginal !== "" ? Number(valorOriginal) : valorOriginal;
            } else {
              newRow[propiedadOrdenada] = valorOriginal;
            }
          }
        });
        return newRow;
      });

      // return datos.map(row => {
      //   const newRow = {};
      //   Object.keys(row).forEach(key => {
      //     const valorOriginal = row[key];
      //     newRow[key] = !isNaN(Number(valorOriginal)) && valorOriginal !== "" ? Number(valorOriginal) : valorOriginal;
      //   });
      //   return newRow;
      // });
    }

    convertirDatosIFD(datos, columnas) {

      const propiedadesSinProcesar = Object.keys(datos[0]);

       const propiedadesOrdenadas = new Map<string, string>();
      columnas.forEach(([mes, tipo], index) => {
        const propiedadSinProcesar = propiedadesSinProcesar.find(p => p.includes(mes));
        if (propiedadSinProcesar) {
          propiedadesOrdenadas.set(propiedadSinProcesar, `${index}_${tipo}`);
        }
      });
      
      return datos.map(row => {
        const newRow = {};
        propiedadesOrdenadas.forEach((propiedadOrdenada, propiedadSinProcesar) => {
          const valorOriginal = row[propiedadSinProcesar];
          if (valorOriginal !== undefined) {
            // Aplicamos la conversión si el tipo es 'number'
            if (propiedadOrdenada.endsWith('_number')) {
              newRow[propiedadOrdenada] = !isNaN(Number(valorOriginal)) && valorOriginal !== "" ? Number(valorOriginal) : valorOriginal;
            } else {
              newRow[propiedadOrdenada] = valorOriginal;
            }
          }
        });
        return newRow;
      });
    }
       
    

ngOnDestroy(): void {
  clearInterval(this.obtenerValorizacion)
  clearInterval(this.obtenerPrecio)
  clearTimeout(this.fretRealTimeService.timeoutId);
  this.fretRealTimeService.closeConnection();
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
  // this.fretOpcionesService.closeConnection()
}

getColor(valor1:any , valor2:any):any {
      if (Number(valor1) > Number(valor2)) {
        //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
        return { backgroundColor: 'rgba(0, 100, 0, 0.8)', color: 'white', transition: 'background-color 1s', align: 'center' }; // Cambia el color a verde si valor1 es mayor que valor2
  
      } else if (Number(valor1) < Number(valor2)) {
        //return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
        return { backgroundColor: ' rgb(200, 0, 30,0.8)', color: 'white', transition: 'background-color 1s', align: 'center' }; // Cambia el color a verde si valor1 es mayor que valor2
  
      }else {
        return { backgroundColor: 'white', color: 'black' }; // No cambia el color si valor1 no es mayor que valor2
      }
    }

  valorizar(){
    // console.log(this.listaTablasPosicion)
    this.flgCargando = true;
    this.flgHabilitarSimulacion = false
    this.fretRealTimeService.valorizacionDemanda().subscribe(
      (response) => {

        this.flgHabilitarSimulacion = true;
        this.fretRealTimeService.resultadoValorizacion = response

        let data = JSON.parse(response);
        
        if (this.hedgestrategicComponent && this.selectedOptions[0] == 'Hedge Estratégico') {
          this.hedgestrategicComponent.valorizarMatlab(response);
        }else{
          if(this.arrListaConsultaIFD != undefined && this.arrListaConsultaIFD.length > 0){

            this.arrListaConsultaIFD.forEach(objDestinoPadre => {
              if(objDestinoPadre.tipoIFD !== "Liquidadas"){
                objDestinoPadre.dataIFD.forEach(objDestino => {
  
                const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s303_GroupOptions"].toString());
                if (objOrigen) {
                  // objDestino["cashnettoday"] = objOrigen["cashnettoday"];
                  let sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
                  const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
                  const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
                  let sumaPremiumtodayNew = sumaPremiumtoday
                  try {
                    if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                      sumaCashnettoday = sumaCashnettoday * 100
                      sumaPremiumtodayNew = sumaPremiumtoday*100
                    }
                  } catch (error) {} 

                  // try {
                  //   if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                  //     sumaCashnettoday = sumaCashnettoday * 100
                  //   }
                  // } catch (error) {}

                  if(objDestino["s303_Activador"] != 0 && objDestino["s303_Activador"] != null){ 
                    
                    if(objDestino["s303_Ifd"].includes("Call") || objDestino["s303_Ifd"].includes("Put")){
                      // objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                      if(objDestino["s303_PrecioProveedor"] == 0 || objDestino["s303_Mkt"] == 1){  
                        
                        if(objDestino["s303_Agrupacion"] == 1){
                          let mtmIndividual = data.filter(obj => obj["idsql"].toString() === (objDestino["s303_Operacion"]?.toString() ?? objDestino["s303_Operacion"]));
                          if(mtmIndividual.length != 0){
                            try {
                              if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                                mtmIndividual[0]["cashnettoday"] = mtmIndividual[0]["cashnettoday"] * 100 
                              }
                            } catch (error) {}

                            objDestino["s303_M2M"] = mtmIndividual[0]["cashnettoday"].toFixed(2);
                            if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                              objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                            }else{
                              objDestino["s303_Delta"] = sumaDeltaCacks.toFixed(2);
                            }
                          }
                        }else{
                          objDestino["s303_M2M"] = sumaCashnettoday.toFixed(2);
                        }
                        objDestino["s303_PrecioProveedor"] = sumaPremiumtodayNew.toFixed(4);
                        objDestino["s303_Mkt"] = 1
                      }else if(objDestino["s303_Ifd"].includes("Call")){
                        if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                          objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                        }else{
                          objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                        }
                      }else if(objDestino["s303_Ifd"].includes("Put")){
                        if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                          objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"]) * -1
                        }else{
                          objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                        }
                      }
                    }else{
                      if(objDestino["s303_Ifd"].substring(0,1) == '-'){
                        objDestino["s303_M2M"] = ((objDestino["s303_Strike"] - objDestino["precioActual"]) * objDestino["s303_Activador"])
                      }else{
                        objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                      }
                    }
                    
                    let mtmIndividual = data.filter(obj => obj["idsql"].toString() === (objDestino["s303_Operacion"]?.toString() ?? objDestino["s303_Operacion"]));
                    
                    if(mtmIndividual.length != 0){
                      
                      if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                        objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                      }else{
                        objDestino["s303_Delta"] = mtmIndividual[0]["deltacak"].toFixed(2);
                      }
                    }else{
                      if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                        objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                      }else{
                        objDestino["s303_Delta"] = sumaDeltaCacks.toFixed(2);
                      }
                    }
  
                  }else{
                    
                    if(objDestino["s303_Agrupacion"] == 1){
                      let mtmIndividual = data.filter(obj => obj["idsql"].toString() === (objDestino["s303_Operacion"]?.toString() ?? objDestino["s303_Operacion"]));
                      
                      if(mtmIndividual.length != 0){
                        try {
                          if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                            mtmIndividual[0]["cashnettoday"] = mtmIndividual[0]["cashnettoday"] * 100 
                          }
                        } catch (error) {}

                        objDestino["s303_M2M"] = mtmIndividual[0]["cashnettoday"].toFixed(2);
                        if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                          objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                        }else{
                          objDestino["s303_Delta"] = mtmIndividual[0]["deltacak"].toFixed(2);
                        }
                        
                      }
                    }else{
                      objDestino["s303_M2M"] = sumaCashnettoday.toFixed(2);
                      if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                        objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                      }else{
                        objDestino["s303_Delta"] = sumaDeltaCacks.toFixed(2);
                      }
                      
                    }
                    
                    if(objDestino["s303_Ifd"].includes("Acum")){
                      objDestino["s303_PrecioProveedor"] = sumaPremiumtodayNew.toFixed(4);
                    }                  
                  }
  
                  try {
                    if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(this.selectedOptions[0])){
                      objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                    }
                  } catch (error) {} 
                }
  
                });             
  
                const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })
  
                Toast.fire({
                icon: 'success',
                title: 'Valorización finalizada.'
              })
              
              }
            });
  
          }
          this.recalculoCapsFloors();          
          this.calculoResultadoIFD_MTM();  
          this.calcularCFR();
          this.calcularMTMPricingFisico();
        }
        
        this.flgCargando = false;      
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.flgResponsePrecio = true;
        this.flgCargando = false;
      });
  }

  calcularCFR(){
    let flgPrimeraColumna = 0
    let flgPrimeraColumnaResult = 0

    if(this.flgConsultarCFR){
      this.flgConsultarCFR = false;
      this.fretRealTimeService.calculoCFR(this.arrListaMercado,this.listaTablasPosicion, this.listaTablasResultados, this.columnasPosicion,this.tabSeleccionado, this.listaTrigoXMes).subscribe(
        (response) => {

          // this.factorContractInPrice = response["Factor"]
          this.flgConsultarCFR = true
          this.listaTablasResultados[2].data.forEach(columnaMes => {
            if(columnaMes["Descripcion"] == 'CFR Compañia'){
              Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
                  if(mesResponse == mesTabla){
                    columnaMes[mesTabla] = Number(valorResponse).toFixed(0);
                  }
                } 
              });         
            }
            flgPrimeraColumna += 1
          });
  
          this.arrListaResultadosComparativo.forEach(dataComparativo => {
            if(dataComparativo[0].includes("CFR Compañia")){
              
              let contadorComp = 0
              for(let columna of this.columnasResultados){
                Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                  if(mesResponse == columna){
                    dataComparativo[contadorComp] = Number(valorResponse).toFixed(0); 
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
                        dataComparativo[index] = (Number(this.arrListaMercado[2][index]) + Number(this.arrListaMercado[4][index])).toFixed(0).toString()
                      }
                    }else if(this.selectedOptions[0] == 'DURUM' || this.selectedOptions[0] == 'SFO'){
                      dataComparativo[index] = (Number(this.arrListaMercado[2][index]) + Number(this.arrListaMercado[4][index])).toFixed(0).toString()
                    }else if(this.selectedOptions[0] == 'CPO'){
                      let indexFuturoC3: number = this.arrListaMercado.findIndex(obj => obj[0] === "Monthly avg c3 + Spread");
                      if(indexFuturoC3 > 0){
                        dataComparativo[index] = (this.arrListaMercado[indexFuturoC3][index] || 0)
                      }
                    }else{
                      if(this.arrListaMercado.length > 5){
                        dataComparativo[index] = (((Number(this.arrListaMercado[1][index]) + Number(this.arrListaMercado[3][index]) + Number(this.arrListaMercado[5][index])) * response["Factor"]) + Number(this.arrListaMercado[4][index])).toFixed(0).toString()
                      }else{
                        dataComparativo[index] = (((Number(this.arrListaMercado[1][index]) + Number(this.arrListaMercado[3][index])) * response["Factor"]) + Number(this.arrListaMercado[4][index])).toFixed(0).toString()
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

          this.calcularComparativo();
          
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.flgConsultarCFR = true
          this.flgResponsePrecio = true;
        });
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


  inicializarUltimoPrecio(){

    this.fretRealTimeService.obtenerUltimosPrecios().subscribe(
      (response) => {   
        
        Object.entries(response).forEach(([mesResponse, valorResponse]) => {
          if (typeof valorResponse === 'object' && valorResponse !== null) {
            (this.arrListaMercado[0] as string[]).map((element, index) => {
              if (element === valorResponse["Ticker"].replace(/\s/g, '')) {
                this.arrListaMercado[1][index] = valorResponse["PrecioActual"].toString();
              }
            });
          }
        })
        
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
                      let posicionespacio: number = valorResponse["Ticker"].indexOf(" ");

                      let ticker = valorResponse["Ticker"].slice(0, posicionespacio - 1);
                      let strike = valorResponse["Ticker"].slice(posicionespacio + 1);
                      let tipoOpcion = valorResponse["Ticker"].slice(posicionespacio - 1, posicionespacio)

                      if(((objData["s303_Ifd"].includes("Put") && tipoOpcion == 'P') || (objData["s303_Ifd"].includes("Call") && tipoOpcion == 'C'))
                       && objData["s303_Contrato"] == ticker.replace(/\s/g, '') && objData["s303_Strike"]  ==  Number(strike) ){
                        objData["s303_PrecioProveedor"] = valorResponse["PrecioActual"]
                      }
                    }
                    
                  }); 

                  
                }
              });
            }
          });  
        }
        this.valorizar(); 
      },
      (error) => {
        console.error('Error: ', error);
      }
    );    
  }

  modoSimulacion(modalDetalle:any){

    this.fretRealTimeService.columnasResultados_SIM = this.columnasResultados;
    this.fretRealTimeService.arrListaResultados_SIM = this.arrListaResultados;
    this.fretRealTimeService.arrListaResultadosComparativo_SIM = this.arrListaResultadosComparativo;
    this.fretRealTimeService.arrListaMercado_SIM = this.arrListaMercado;
    this.fretRealTimeService.columnasPosicion_SIM = this.columnasPosicion;
    this.fretRealTimeService.listaTablasPosicion_SIM = this.listaTablasPosicion;
    this.fretRealTimeService.listaTablasResultados_SIM = this.listaTablasResultados;
    this.fretRealTimeService.arrListaConsultaIFD_SIM = this.arrListaConsultaIFD;
    this.fretRealTimeService.columnasPapelesLiquidados_SIM = this.columnasPapelesLiquidados;
    this.fretRealTimeService.arrListaConsultaPapelesLiquid_SIM = this.arrListaConsultaPapelesLiquid;
    this.fretRealTimeService.listaProductosFret_SIM = this.listaProductosFret;
    this.fretRealTimeService.tabSeleccionado_SIM = this.tabSeleccionado;
    this.fretRealTimeService.selectedOptions_SIM = this.selectedOptions;
    this.fretRealTimeService.factorContractInMetricTons_SIM = this.factorContractInMetricTons
    this.fretRealTimeService.listaTrigoXMes_SIM = this.listaTrigoXMes
    this.fretRealTimeService.unidadMedida_SIM = this.unidadMedida
    
    // clearInterval(this.obtenerValorizacion)
    // clearInterval(this.obtenerPrecio)
    // this.fretRealTimeService.closeConnection();

    clearInterval(this.obtenerValorizacion)
    clearInterval(this.obtenerPrecio)
    clearTimeout(this.fretRealTimeService.timeoutId);
    this.fretRealTimeService.closeConnection();

    this.router.navigate(['/FretCMIFD-SIM']);
  }


  calculoResultadoIFD_MTM(){

    let dicMtMxMes = []

    if(this.arrListaConsultaIFD != null){
      this.arrListaConsultaIFD.forEach(objDestino => {
        if(objDestino.tipoIFD !== "Liquidadas"){
          objDestino.dataIFD.forEach(objData => {
            dicMtMxMes[objData["s303_Cobertura"]] = Number(dicMtMxMes[objData["s303_Cobertura"]] ?? 0) + Number(objData["s303_M2M"]);
          });
        }
      });
  
      let mtmAgrupado
  
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
        if (col !== 'mes' && this.columnasPosicion.includes(col)) {
          if (primeraFilaLlegadas[col] === '-' || primeraFilaLlegadas[col] === '') {
            primeraFilaLlegadas[col] = 0; // Puedes ajustar el valor por defecto según tu lógica
          } else {
            primeraFilaLlegadas[col] = parseFloat(primeraFilaLlegadas[col].replace(/,/g, ""));
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
                      const valorPnL = parseFloat(dataPnL[col[0]]);;
                      const valorMtM = parseFloat(mtmAgrupado[col[0]]);;
  
                    
                      objData[col[0]] = ((((valorPnL + valorMtM) * -1 )/ valorLlegadas) || 0).toFixed(10);
                    }catch(error){objData[col[0]] = '-'}
                    
                  } 
                } catch (error) {}
              });
  
            }
          });
  
        }
      });      
    }
  }

  recalculoCapsFloors(){
    let dictPricing = []
    let dicDeltasxMes_Caps = []
    let dicDeltasxMes_Floors = []

    const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    const primeraFilaFlat = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Flat')?.data.filter(obj => obj["Descripcion"].includes('FLAT (TM)'))[0];
    if(this.arrListaConsultaIFD != null){
      this.arrListaConsultaIFD.forEach(objDestino => {
        if(objDestino.tipoIFD == "Pricing"){
          dictPricing = this.fretRealTimeService.calculoPosicionPricing(objDestino.dataIFD, this.factorContractInMetricTons);
        }else if(objDestino.tipoIFD == "Caps"){
          dicDeltasxMes_Caps = this.fretRealTimeService.calculoDeltasCaps(objDestino.dataIFD, this.factorContractInMetricTons);
        }else if(objDestino.tipoIFD == "Floors"){
          dicDeltasxMes_Floors = this.fretRealTimeService.calculoDeltasFloors(objDestino.dataIFD, this.factorContractInMetricTons);
        }
      });
  
      
  
      this.listaTablasPosicion.forEach((tabla, index) => {
        if(tabla.nombreTabla == 'Caps'){
          Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {
  
            if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){
              try{
                tabla.data[3][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["tm"]
              }catch(error){
                tabla.data[3][nombreColumna] = '-'
              }
  
              try{
                tabla.data[4][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["precio"]
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
                  tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
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
  
          // Limpieza de tabla
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
                if(dicDeltasxMes_Floors.filter(obj => obj["mes"] === nombreColumna)[0]["tipo"] == "fijo"){
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
                  tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
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
                if(tabla.data[4][nombreColumna] == 'Infinity%'){
                  tabla.data[4][nombreColumna] = '0%'
                }
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
                
  
                let valorFlat = 0
                if (!primeraFilaFlat){
                  valorFlat = 0;
                }else{
                  valorFlat = parseFloat(primeraFilaFlat[nombreColumna] || 0) ;
                }
                

                try{
                  tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
                }catch(error){
                  tabla.data[6][nombreColumna] = '-'
                }
  
                this.columnasPosicion.forEach((col, indexPosicion) => {
                  if(col[0] == nombreColumna){
  
                    try {
                      this.arrListaResultados[3][indexPosicion] = ((((Number(tabla.data[1][nombreColumna]) + (valorFlat | 0)) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                      this.arrListaResultados[4][indexPosicion] = (((Number(tabla.data[3][nombreColumna]) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                      if(this.arrListaResultados[4][indexPosicion] == 'Infinity%'){
                        this.arrListaResultados[4][indexPosicion] = '0%'
                      }
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
  }

  calcularDeltaNetoResumen(){
    this.columnasPosicion.forEach((col, indexPosicion) => {
      if(col[0] !== 'Descripcion'){
        try {
          this.arrListaResultados[8][indexPosicion] = (Number(this.arrListaResultados[3][indexPosicion].replace('%','').replace(/^-\s*$/, '')) +
                                                      Number(this.arrListaResultados[4][indexPosicion].replace('%','').replace(/^-\s*$/, '')) + 
                                                      Number(this.arrListaResultados[5][indexPosicion].replace('%','').replace(/^-\s*$/, '')) + 
                                                      Number(this.arrListaResultados[6][indexPosicion].replace('%','').replace(/^-\s*$/, '')) ).toString() + '%'
        } catch (error) {
          // Manejo del error
          this.arrListaResultados[8][indexPosicion] = '-'
        } 
      }
    });
  }
  

  formatearRegistro(registro: any, columna: any): { valor: any, esNumero: boolean } {
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



  calcularComparativo(){

    
    const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    
    const cfrCompania = this.arrListaResultadosComparativo.find(tabla => tabla[0].includes('CFR Compañia'));
    const mercado = this.arrListaResultadosComparativo.find(tabla => tabla[0].includes('Mercado'))
    const proyectoBase = this.arrListaResultadosComparativo.find(tabla => tabla[0].startsWith('PB '))
    
    if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida
    if (!mercado) return; // Salir si no hay primera fila válida
    if (!cfrCompania) return; // Salir si no hay primera fila válida
    if (!proyectoBase) return; // Salir si no hay primera fila válida
    
    const obtenerTexto = (cadena: string): string => cadena.match(/^(\S+\s\S+)/)?.[1] ?? cadena;

    this.arrListaResultadosComparativo.forEach(dataComparativo => {
      if(dataComparativo[0].includes("CFR vs Mcdo")){
        let contadorComp = 0
        for(let columna of this.columnasResultados){
          if(contadorComp != 0){
            dataComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(mercado[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
          }
          contadorComp++
        }

      }else if(dataComparativo[0].includes("CFR vs PB")){
        let contadorComp = 0
        for(let columna of this.columnasResultados){
          if(contadorComp != 0){
            dataComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(proyectoBase[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
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
            if(contadorComp != 0){
              if(dataSubComparativo[0].startsWith('CFR vs '+proyecto)){
                dataSubComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(py_m[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
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

          let valorMtM = (Number(valoresMercado[contadorResultado]) - Number(pricingPrecio[columna.toString()])) * Math.round(Number(pricingTM[columna.toString()])/this.factorContractInMetricTons) * this.factorContractInPrice
          const formattedValue = valorMtM.toLocaleString('en-US');

          dataResultado[columna.toString()] = formattedValue
        }
        contadorResultado++
      }
    })
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


  selectionSum: number = 0;
  // tablaSelected: string = "";
  isSelecting: boolean = false;
  selectedCells: Set<string> = new Set(); // Usa un Set para manejar las celdas seleccionadas

  startSelection(event: MouseEvent, row: number, column: string, tabla: string) {
    event.preventDefault(); // Previene la selección de texto
    this.isSelecting = true;

    if(event.ctrlKey){this.addToSelection(event, row, column, tabla);}
    else{this.selectedCells.clear();this.addToSelection(event, row, column, tabla);} 

    // this.selectedCells.clear(); // Limpiar la selección previa
    // this.addToSelection(event, row, column, tabla);
    this.updateSelectionSum(tabla);
  }

  addToSelection(event: MouseEvent, row: any, column: string,tabla: string) {
    if (this.isSelecting && column) {
      this.selectedCells.add(`${row}|${column}|${tabla}`);
      this.updateSelectionSum(tabla);
    }
  }

  updateSelectionSum(tabla: string) {
    let element
    
    this.selectionSum = Array.from(this.selectedCells).reduce((sum, cellKey) => {
    const [fila, column, nombreTabla] = cellKey.split('|');
    if(nombreTabla == 'Resumen'){
      element = this.arrListaResultados[fila][column];
    }else if(nombreTabla == 'ResumenComparativo'){
      element = this.arrListaResultadosComparativo[fila][column];
    }else if(nombreTabla == 'Mercado'){
      element = this.arrListaMercado[fila][column];
    }else if(['Llegadas Y Dias Giro','Bases','Pricing','Flat','Flete','Caps','Floors'].includes(nombreTabla)){
      element = this.listaTablasPosicion.find(x => x.nombreTabla.toString() === nombreTabla.toString())?.data[fila][column.split(',')[0]];
    }else if(['Resultados Físico','Resultados IFDs','Comparativo'].includes(nombreTabla)){
      element = this.listaTablasResultados.find(x => x.nombreTabla.toString() === nombreTabla.toString())?.data[fila][column.split(',')[0]];
    }else if(['IFDs - Pricing','IFDs - Caps','IFDs - Floors','IFDs - Cobertura Económica','IFDs - Liquidadas'].includes(nombreTabla)){
      let newTabla = nombreTabla.replace('IFDs - ','')
      element = this.arrListaConsultaIFD.find(x => x.tipoIFD.toString() === newTabla.toString())?.dataIFD[fila][column.split(',')[0]];
      // console.log(element)
    }
    
    if(typeof element == 'number'){
      sum += (element || 0);
    }else{
      sum += (parseFloat(element.replace(/,/g, "").replace('%', '').replace(',','')) || 0);
    }
    
    
    return sum;
  }, 0);
  }

  endSelection() {
    this.isSelecting = false;
  }

  isCellSelected(row: number, column: string,tabla: string): boolean {
    return this.selectedCells.has(`${row}|${column}|${tabla}`);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.selectedCells.clear();
      this.selectionSum = 0;
    }
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

  async llenarExcel(workbook, tipoReporte, commoditie, arrListaMercado, listaTablasPosicion, listaTablasResultados, columnasPosicion, arrListaConsultaIFD, arrListaConsultaPapelesLiquid, listaPrecioFOBPalma){
    let sheetName = commoditie == 'NNA' ? 'VITAPRO' : commoditie;
    let worksheet = workbook.getWorksheet(sheetName);
    let nombreArchivo = '';
    if(!worksheet){
      this.nCommoditiesExportados++;
      if(this.nCommoditiesExportados == this.listaProductosFret.length){
        // Generar un nuevo Blob con los datos actualizados
        const updatedData = await workbook.xlsx.writeBuffer();
        const updatedBlob = new Blob([updatedData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Descargar el archivo actualizado
        nombreArchivo = (tipoReporte == 1 ? `${this.fechaVigenteEntero} FRET.xlsx` : `Compania W - SBM - SBO Position - ${this.fechaVigenteEntero}.xlsx`);
        saveAs(updatedBlob, nombreArchivo);
        this.loader.hide();
        this.flgCargando = false;
      }
      return;
    }
    let nombreProducto = worksheet.getCell('B2').value;

    //Llenando el Data Entry

    worksheet = workbook.getWorksheet('Data Entry');

    columnasPosicion.forEach((valFila, idxFila) => {
      worksheet.getCell(3, idxFila + 2).value = valFila[0]?.toString().replace('Sep', 'Set');
    });

    // MERCADO
    arrListaMercado?.forEach((valFila, idxFila) => {
      for(const valColumna in valFila){
        if(valFila[valColumna]){
          let fila = this.encontrarFilaDataEntry(worksheet, nombreProducto, valFila[0]);
          if (Number(valColumna) > 0 && fila > -1){
            let valorCelda = valFila[valColumna] == '-' ? 0 : valFila[valColumna];
            if(valorCelda){
              worksheet.getCell(fila, Number(valColumna) + 2).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
            }
          }
        }
      }
    });

    if(commoditie == 'CPO'){
      listaPrecioFOBPalma?.forEach((valFila) => {
        for(const valColumna in valFila){
          if(valFila[valColumna]){
            let fila = this.encontrarFilaDataEntry(worksheet, nombreProducto, valFila[0]);
            if (Number(valColumna) > 0 && fila > -1){
              let valorCelda = valFila[valColumna] == '-' ? 0 : valFila[valColumna];
              if(valorCelda){
                worksheet.getCell(fila, Number(valColumna) + 2).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
              }
            }
          }
        }
      });
    }

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
                worksheet.getCell(fila, Number(idxColumna) + 2).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
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
                worksheet.getCell(fila, Number(idxColumna) + 2).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
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
        , 'Cobertura': x.s303_Cobertura?.toString().replace('Sep', 'Set')
        , 'Numero Contratos': x.s303_NumeroContratos
        , 'Delta': x.s303_Delta
        , 'Strike': x.s303_Strike
        , 'Ifd': x.s303_Ifd?.toString().replace('Futuro', 'Future')
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
        , 'Precio/Prima Mercado': ((x.s303_Ifd?.toString().toLowerCase().includes('swap') || x.s303_Ifd?.toString().toLowerCase().includes('futuro')) ? x.precioActual : x.s303_PrecioProveedor)
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
            , 'Cobertura': x.s303_Cobertura?.toString().replace('Sep', 'Set')
            , 'Numero Contratos': x.s303_NumeroContratos
            , 'Delta': x.s303_Delta
            , 'Strike': x.s303_Strike
            , 'Ifd': x.s303_Ifd?.toString().replace('Futuro', 'Future')
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
            , 'Precio/Prima Mercado': ((x.s303_Ifd?.toString().toLowerCase().includes('swap') || x.s303_Ifd?.toString().toLowerCase().includes('futuro')) ? x.precioActual : x.s303_PrecioProveedor)
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
              worksheet.getCell(filaCabeceras + 1 + idxFila, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
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
            worksheet.getCell(filaCabeceras + 1 + idxFila, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
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

    this.nCommoditiesExportados++;

    if(this.nCommoditiesExportados == this.listaProductosFret.length){
      // Generar un nuevo Blob con los datos actualizados
      const updatedData = await workbook.xlsx.writeBuffer();
      const updatedBlob = new Blob([updatedData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // Descargar el archivo actualizado
      nombreArchivo = (tipoReporte == 1 ? `${this.fechaVigenteEntero} FRET.xlsx` : `Compania W - SBM - SBO Position - ${this.fechaVigenteEntero}.xlsx`);
      saveAs(updatedBlob, nombreArchivo);
      this.loader.hide();
      this.flgCargando = false;
    }
  }

  calcularResumenBases(){

    const primeraFilaLlegadas = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    const primeraFilaBases = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Bases')?.data.filter(obj => obj["Descripcion"].includes('Bases + Papeles (TM)'))[0];
    const primeraFilaFlat = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Flat')?.data.filter(obj => obj["Descripcion"].includes('FLAT (TM)'))[0];
    const primeraFilaFlete = this.listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Flete')?.data.filter(obj => obj["Descripcion"].includes('Volumen Cerrado TM'))[0];

    if (!primeraFilaLlegadas) return; 
    if (!primeraFilaBases) return; 
    if (!primeraFilaFlat) return; 
    if (!primeraFilaFlete) return; 

    this.columnasResultados.forEach((col, indexPosicion) => {
      let basesTM = Number(primeraFilaBases[col.toString()]) || 0
      let flatTM = Number(primeraFilaFlat[col.toString()]) || 0
      let llegada = Number(primeraFilaLlegadas[col.toString()]) || 0
      let flete = Number(primeraFilaFlete[col.toString()]) || 0

        try {
          if(indexPosicion != 0){
            if(llegada == 0){
              this.arrListaResultados[2][indexPosicion] = '0%'
              this.arrListaResultados[7][indexPosicion] = '0%'
            }else{
              this.arrListaResultados[2][indexPosicion] = (((basesTM + flatTM)/llegada) * 100).toFixed(0).toString() + '%'
              this.arrListaResultados[7][indexPosicion] = (((flete + flatTM)/llegada) * 100).toFixed(0).toString() + '%'
            }
            
          }
        } catch (error) {
          // Manejo del error
          this.arrListaResultados[2][indexPosicion] = '-'
        } 
    });
  }

  exportarCommoditieNoSeleccionado(workbook, tipoReporte, commoditie){
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
    const dia = fechaActual.getDate() < 10 ? `0${fechaActual.getDate()}` : `${fechaActual.getDate()}`;
    const fechaEntera = `${año}${mesFormateado}${dia}`;
    let sociedad: number = 2;
    if( fechaEntera.toString() == this.fechaVigenteEntero){
      this.fretService.obtenerDatosPosicion(Number(this.fechaVigenteEntero),commoditie.idProductFret.toString(),sociedad,commoditie.descripcion).subscribe(
        (response: objInitTabPosicion) => {
          //listas
          let listaTablasPosicion: objTablas[];
          let columnasPosicion: Object[];
          let arrListaResultados: Object[];
          let arrListaResultadosComparativo: Object[];
          let arrListaMercado: Object[];
          let listaPrecioFOBPalma:Object[]=[];
          let listaTablasResultados: objTablas[];
          let columnasResultados: Object[];
          let arrListaConsultaIFD: ListaConsultaIFD[];
          let startIndexs: number[] = [];
          let endIndexs: number[] = [];
          let sortDirections: {
            [tablaIndex: number]: {
              [propiedad: string]: string;
            };
          } = [];
          let columnas: any[] = [];
          let arrListaConsultaPapelesLiquid: Object[];
          let columnasPapelesLiquidados: Object[];
          let listaTrigoXMes: string[][] = [];
          let factorContractInPrice: number;
          let factorContractInMetricTons: number;

          factorContractInPrice = response.factorPrice;
          factorContractInMetricTons = response.factor;

          listaTablasPosicion = response.listaData;
          listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
          let ticker: string = "CPSR";
          columnasPosicion = response.columnas;

          const newData: Object[] =response.listaDataResumen.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
          arrListaResultados  = newData.map((item: any): any => item.slice(1));

          const newDataResumen: Object[] =response.listaDataResumenComparativo.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
          arrListaResultadosComparativo  = newDataResumen.map((item: any): any => item.slice(1));
          
          const newDataMercado: Object[] =response.listaDataMercado.sort((a: any, b: any) => a[0] - b[0]);
          arrListaMercado  = newDataMercado.map((item: any): any => item.slice(1));
          arrListaMercado[0][0]='Ticker'

          if(commoditie.descripcion == 'CPO'){
            const dataFOBPalma: Object[] =response.listaFOBPalma.sort((a: any, b: any) => a[0] - b[0]);
            listaPrecioFOBPalma  = dataFOBPalma.map((item: any): any => item.slice(1));

            //Actualizar precios Palma
            this.fretRealTimeService.obtenerPreciosPalma().subscribe(
              (response) => {        
                if(arrListaConsultaIFD != undefined && arrListaConsultaIFD.length > 0){
        
                  arrListaConsultaIFD.forEach(objDestino => {
                    if(objDestino.tipoIFD !== "Liquidadas"){
        
                      Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                        if (typeof valorResponse === 'object' && valorResponse !== null) {
                          objDestino.dataIFD.forEach(objData => {
        
                            if (objData["s303_Contrato"] == valorResponse["T503_Ticker"].replace(/\s/g, '')) {
                              objData["precioAnterior"] = objData["precioActual"];
                              objData["precioActual"] = valorResponse["T503_Value"];
                            }
                          }); 
        
                      (arrListaMercado[0] as string[]).map((element, index) => {
                        if (element === valorResponse["T503_Ticker"].replace(/\s/g, '')) {
                          arrListaMercado[1][index] = valorResponse["T503_Value"]?.toString();
                        }
                      });
                        }
                      });
                    }
                  });
                }
                  let precioCPO: number;
                  let futuro3CPO: number;
                  if(arrListaMercado != undefined && arrListaMercado.length > 0){
                    let indexFuturoC3: number = arrListaMercado.findIndex(obj => obj[0] === "Monthly avg c3 + Spread");
                    if(indexFuturoC3 > 0){
                      let indiceFuturo: number = arrListaMercado.findIndex(obj => obj[0] === "Futuro");
                      (arrListaMercado[0] as string[]).map((element, index) => {
                        if (index != 0) {
                          precioCPO = (Number(arrListaMercado[indiceFuturo][index]) || 0)
                          futuro3CPO = (Number(arrListaMercado[indexFuturoC3][index]) || 0)
                          if(futuro3CPO <= 100){
                            arrListaMercado[indexFuturoC3][index] =  futuro3CPO + precioCPO
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

          listaTablasResultados = response.listaDataResultado;
          columnasResultados =  response.columnasResultado;

          arrListaConsultaIFD = response.ifds;

          for (let i = 0; i < listaTablasPosicion.length; i++) {
            const tabla = listaTablasPosicion[i];
            if (tabla.nombreTabla === 'Llegadas Y Dias Giro') {
              for(let columna of columnasResultados){
                if(columna?.toString() != "Descripcion" && columna.toString() != "CE" && columna.toString() != "Total"){
                  for (let j = 0; j < tabla.data.length; j++) {
                    const dataPosicion = tabla.data[j];
                    if (dataPosicion["Descripcion"].includes('Total TM')) {
                      i = listaTablasPosicion.length; 
                      break;
                    }
                    if(dataPosicion[columna.toString()] != null){
                      ticker = extractLastPart(dataPosicion["Descripcion"])
                    }
                  }
                  listaTrigoXMes.push([ticker,""]);
                } 
              }              
            }
          }

          if(commoditie.descripcion == 'CPO'){
            for (let i = 0; i < listaTablasPosicion.length; i++) {
              const tabla = listaTablasPosicion[i];
              let cont = 0
              if (tabla.nombreTabla === 'Flat') {
                for(let columna of columnasResultados){
                  if(columna.toString() != "Descripcion" && columna.toString() != "CE" && columna.toString() != "Total"){
                    if(tabla.data[0][columna.toString()] != 0 &&  tabla.data[1][columna.toString()] == 0){
                      tabla.data[1][columna.toString()] = arrListaMercado[5][cont].toString();
                    }
                  } 
                  cont++
                }              
              }
            }
          }

          if(arrListaConsultaIFD != undefined){
            arrListaConsultaIFD.forEach(objDestino => {
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
            for (let i = 0; i < arrListaConsultaIFD.length; i++) {
              startIndexs[i] = 0;
              endIndexs[i] = this.pageSize;
              sortDirections[i] = {};
            }
      
            //Se llenan las Columnas IFD
            if(columnas.length != 0){
              columnas = this.transposeArray(arrListaConsultaIFD[0].cabecera);
            }
          }
  
          arrListaConsultaPapelesLiquid = response.dataPapelesLiquid;
          columnasPapelesLiquidados = response.columnasPapelesLiquid;//[this.tabSeleccionado].concat(response.columnas);

          //Obtener últimos precios
          this.fretRealTimeService.obtenerUltimosPrecios().subscribe(
            (response) => {        

              Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                if (typeof valorResponse === 'object' && valorResponse !== null) {
                  (arrListaMercado[0] as string[]).map((element, index) => {
                    if (element === valorResponse["Ticker"].replace(/\s/g, '')) {
                      arrListaMercado[1][index] = valorResponse["PrecioActual"].toString();
                    }
                  });
                }
              })

              if(arrListaConsultaIFD != undefined && arrListaConsultaIFD.length > 0){
                arrListaConsultaIFD.forEach(objDestino => {
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
                            let posicionespacio: number = valorResponse["Ticker"].indexOf(" ");
      
                            let ticker = valorResponse["Ticker"].slice(0, posicionespacio - 1);
                            let strike = valorResponse["Ticker"].slice(posicionespacio + 1);
                            let tipoOpcion = valorResponse["Ticker"].slice(posicionespacio - 1, posicionespacio);
      
                            if(((objData["s303_Ifd"].includes("Put") && tipoOpcion == 'P') || (objData["s303_Ifd"].includes("Call") && tipoOpcion == 'C'))
                              && objData["s303_Contrato"] == ticker.replace(/\s/g, '') && objData["s303_Strike"]  ==  Number(strike) ){
                               objData["s303_PrecioProveedor"] = valorResponse["PrecioActual"]
                             }
                          }
                          
                        });
                      }
                    });
                  }
                });
              }
              //Valorizar
              this.fretRealTimeService.valorizacionDemanda().subscribe(
                (response) => {
                  let data = JSON.parse(response);
                    if(arrListaConsultaIFD != undefined && arrListaConsultaIFD.length > 0){
                      arrListaConsultaIFD.forEach(objDestinoPadre => {
                        if(objDestinoPadre.tipoIFD !== "Liquidadas"){
                          objDestinoPadre.dataIFD.forEach(objDestino => {
                            const objOrigen = data.filter(obj => obj["idstrategy"].toString() === objDestino["s303_GroupOptions"].toString());
                            if (objOrigen){
                              
                              let sumaCashnettoday = objOrigen.reduce((acum, obj) => acum + (Number(obj["cashnettoday"]) || 0), 0);
                              const sumaDeltaCacks = objOrigen.reduce((acumDelta, obj) => acumDelta + (Number(obj["deltacak"]) || 0), 0);
                              const sumaPremiumtoday = objOrigen.reduce((acumPremiumtoday, obj) => acumPremiumtoday + (Number(obj["premiumtoday"]) || 0), 0);
                              let sumaPremiumtodayNew = sumaPremiumtoday
                              try {
                                if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(commoditie.descripcion)){
                                  sumaCashnettoday = sumaCashnettoday * 100
                                  sumaPremiumtodayNew = sumaPremiumtoday*100
                                }
                              } catch (error) {}
              
                              if(objDestino["s303_Activador"] != 0 && objDestino["s303_Activador"] != null){ 
                    
                                if(objDestino["s303_Ifd"].includes("Call") || objDestino["s303_Ifd"].includes("Put")){
                                  // objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                                  if(objDestino["s303_PrecioProveedor"] == 0 || objDestino["s303_Mkt"] == 1){    
                                    if(objDestino["s303_Agrupacion"] == 1){
                                      let mtmIndividual = data.filter(obj => obj["idsql"].toString() === (objDestino["s303_Operacion"]?.toString() ?? objDestino["s303_Operacion"]));
                                      if(mtmIndividual.length != 0){
                                        try {
                                          if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(commoditie.descripcion)){
                                            mtmIndividual[0]["cashnettoday"] = mtmIndividual[0]["cashnettoday"] * 100 
                                          }
                                        } catch (error) {}
                                        objDestino["s303_M2M"] = mtmIndividual[0]["cashnettoday"].toFixed(2);
                                        if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                                          objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                                        }else{
                                          objDestino["s303_Delta"] = sumaDeltaCacks.toFixed(2);
                                        }
                                      }
                                    }else{
                                      objDestino["s303_M2M"] = sumaCashnettoday.toFixed(2);
                                    }
                                    objDestino["s303_PrecioProveedor"] = sumaPremiumtodayNew.toFixed(4);
                                    objDestino["s303_Mkt"] = 1
                                  }else if(objDestino["s303_Ifd"].includes("Call")){
                                    if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] * - 1 - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                                    }else{
                                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                                    }
                                  }else if(objDestino["s303_Ifd"].includes("Put")){
                                    if(objDestino["s303_Ifd"].substring(0,1) == '-'){ //<---- Venta
                                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] + objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"]) * -1
                                    }else{
                                      objDestino["s303_M2M"] = ((objDestino["s303_PrecioProveedor"] - objDestino["s303_PrimaPagada"]) * objDestino["s303_Activador"])
                                    }
                                  }
                                }else{
                                  if(objDestino["s303_Ifd"].substring(0,1) == '-'){
                                    objDestino["s303_M2M"] = ((objDestino["s303_Strike"] - objDestino["precioActual"]) * objDestino["s303_Activador"])
                                  }else{
                                    objDestino["s303_M2M"] = ((objDestino["precioActual"] - objDestino["s303_Strike"]) * objDestino["s303_Activador"])
                                  }
                                }
                                
                                let mtmIndividual = data.filter(obj => obj["idsql"].toString() === (objDestino["s303_Operacion"]?.toString() ?? objDestino["s303_Operacion"]));

                                if(mtmIndividual.length != 0){
                                  if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                                    objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                                  }else{
                                    objDestino["s303_Delta"] = mtmIndividual[0]["deltacak"].toFixed(2);
                                  }
                                }else{
                                  if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                                    objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                                  }else{
                                    objDestino["s303_Delta"] = sumaDeltaCacks.toFixed(2);
                                  }
                                }
                              }else{
                                
                                if(objDestino["s303_Agrupacion"] == 1){
                                  let mtmIndividual = data.filter(obj => obj["idsql"].toString() === (objDestino["s303_Operacion"]?.toString() ?? objDestino["s303_Operacion"]));
                                  if(mtmIndividual.length != 0){

                                    try {
                                      if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(commoditie.descripcion)){
                                        mtmIndividual[0]["cashnettoday"] = mtmIndividual[0]["cashnettoday"] * 100 
                                      }
                                    } catch (error) {}

                                    objDestino["s303_M2M"] = mtmIndividual[0]["cashnettoday"].toFixed(2);
                                    if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                                      objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                                    }else{
                                      objDestino["s303_Delta"] = mtmIndividual[0]["deltacak"].toFixed(2);
                                    }
                                  }
                                }else{
                                  objDestino["s303_M2M"] = sumaCashnettoday.toFixed(2);
                                  if(objDestino["s303_Estrategia"] == "Long Protected Fixed Accumulating Trigger Double Daily"){
                                    objDestino["s303_Delta"] = objDestino["s303_SwapAcc"];
                                  }else{
                                    objDestino["s303_Delta"] = sumaDeltaCacks.toFixed(2);
                                  }
                                }

                                if(objDestino["s303_Ifd"].includes("Acum")){
                                  objDestino["s303_PrecioProveedor"] = sumaPremiumtodayNew.toFixed(4);
                                }
                                                 
                              }
                              
                              try {
                                if(['CORRECTOR', 'ECONOMICO', 'NNA', 'SRW', 'SBO'].includes(commoditie.descripcion)){
                                  objDestino["s303_M2M"] = objDestino["s303_M2M"]/100
                                }
                              } catch (error) {}
                            }
                          });
                        }
                      });
                    }



                  

                  //Recalculo Caps Floors
                  let dictPricing = []
                  let dicDeltasxMes_Caps = []
                  let dicDeltasxMes_Floors = []
              
                  const primeraFilaLlegadas = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
                  const primeraFilaFlat = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Flat')?.data.filter(obj => obj["Descripcion"].includes('FLAT (TM)'))[0];
                  
                  if(arrListaConsultaIFD != null){
                    arrListaConsultaIFD.forEach(objDestino => {
                      if(objDestino.tipoIFD == "Pricing"){
                        dictPricing = this.fretRealTimeService.calculoPosicionPricing(objDestino.dataIFD, factorContractInMetricTons);
                      }else if(objDestino.tipoIFD == "Caps"){
                        dicDeltasxMes_Caps = this.fretRealTimeService.calculoDeltasCaps(objDestino.dataIFD, factorContractInMetricTons);
                      }else if(objDestino.tipoIFD == "Floors"){
                        dicDeltasxMes_Floors = this.fretRealTimeService.calculoDeltasFloors(objDestino.dataIFD, factorContractInMetricTons);
                      }
                    });
                
                    
                
                    listaTablasPosicion.forEach((tabla, index) => {
                      if(tabla.nombreTabla == 'Caps'){
                        Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {
                
                          if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){
                            try{
                              tabla.data[3][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["tm"]
                            }catch(error){
                              tabla.data[3][nombreColumna] = '-'
                            }
                
                            try{
                              tabla.data[4][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["precio"]
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
                                tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
                              }catch(error){
                                tabla.data[6][nombreColumna] = '-'
                              }
                
                              columnasPosicion.forEach((col, indexPosicion) => {
                                if(col[0] == nombreColumna){
                                  try {
                                    arrListaResultados[5][indexPosicion] = tabla.data[6][nombreColumna]
                                  } catch (error) {
                                    // Manejo del error
                                    arrListaResultados[5][indexPosicion] = '-'
                                  } 
                                }
                              });
                          }
                        });
                      }else if(tabla.nombreTabla == 'Floors'){
                
                        // Limpieza de tabla
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
                              if(dicDeltasxMes_Floors.filter(obj => obj["mes"] === nombreColumna)[0]["tipo"] == "fijo"){
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
                                tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
                              }catch(error){
                                tabla.data[6][nombreColumna] = '-'
                              }
                
                              columnasPosicion.forEach((col, indexPosicion) => {
                                if(col[0] == nombreColumna){
                
                                  try {
                                    arrListaResultados[6][indexPosicion] = tabla.data[6][nombreColumna]
                                  } catch (error) {
                                    // Manejo del error
                                    arrListaResultados[6][indexPosicion] = '-'
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
                              if(tabla.data[4][nombreColumna] == 'Infinity%'){
                                tabla.data[4][nombreColumna] = '0%'
                              }
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
                
                              let valorFlat = 0
                              if (!primeraFilaFlat){
                                valorFlat = 0;
                              }else{
                                valorFlat = parseFloat(primeraFilaFlat[nombreColumna] || 0) ;
                              }

                              try{
                                tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
                              }catch(error){
                                tabla.data[6][nombreColumna] = '-'
                              }
                
                              columnasPosicion.forEach((col, indexPosicion) => {
                                if(col[0] == nombreColumna){
                                  try {
                                    arrListaResultados[3][indexPosicion] = ((((Number(tabla.data[1][nombreColumna]) + (valorFlat | 0)) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                                    arrListaResultados[4][indexPosicion] = (((Number(tabla.data[3][nombreColumna]) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                                    if(arrListaResultados[4][indexPosicion] == 'Infinity%'){
                                      arrListaResultados[4][indexPosicion] = '0%'
                                    }
                                  } catch (error) {
                                    // Manejo del error
                                    arrListaResultados[6][indexPosicion] = '-'
                                  }
                                }
                              });
                          }
                      });
                      }
                
                    });

                    //Calcular Delta Neto Resumen
                    columnasPosicion.forEach((col, indexPosicion) => {
                      if(col[0] !== 'Descripcion'){
                        try {
                          arrListaResultados[8][indexPosicion] = (Number(arrListaResultados[3][indexPosicion].replace('%','').replace(/^-\s*$/, '')) +
                                                                      Number(arrListaResultados[4][indexPosicion].replace('%','').replace(/^-\s*$/, '')) + 
                                                                      Number(arrListaResultados[5][indexPosicion].replace('%','').replace(/^-\s*$/, '')) + 
                                                                      Number(arrListaResultados[6][indexPosicion].replace('%','').replace(/^-\s*$/, '')) ).toString() + '%'
                        } catch (error) {
                          // Manejo del error
                          arrListaResultados[8][indexPosicion] = '-'
                        } 
                      }
                    });
  
                  }
                  //Cálculo Resultado IFD MTM
                  let dicMtMxMes = []
                  if(arrListaConsultaIFD != null){
                    arrListaConsultaIFD.forEach(objDestino => {
                      if(objDestino.tipoIFD !== "Liquidadas"){
                        objDestino.dataIFD.forEach(objData => {
                          dicMtMxMes[objData["s303_Cobertura"]] = Number(dicMtMxMes[objData["s303_Cobertura"]] ?? 0) + Number(objData["s303_M2M"]);
                        });
                      }
                    });
                    
                    let mtmAgrupado
                    
                    listaTablasResultados.forEach(objResultado => {
                      if(objResultado.nombreTabla == "Resultados IFDs"){
                        objResultado.data.forEach(objData => {
                          if(objData["Descripcion"] == "US$ - MTM"){
                            for(let item in dicMtMxMes){
                              objData[item] = (dicMtMxMes[item] as number).toLocaleString('en-US');
                            }
                            mtmAgrupado = JSON.parse(JSON.stringify(objData));
  
                            // Convertir valores de la primera fila de la tabla a números y reemplazar '-' por valores adecuados
                            columnasPosicion.forEach(col => {
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
  
                    const primeraFilaLlegadas2 = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
                    if (!primeraFilaLlegadas2) return; // Salir si no hay primera fila válida
                
                    // Convertir los valores de la primera fila de 'Llegadas Y Dias Giro' a números
                    Object.keys(primeraFilaLlegadas2).forEach(col => {
                      if (col !== 'mes' && columnasPosicion.includes(col)) {
                        if (primeraFilaLlegadas2[col] === '-' || primeraFilaLlegadas2[col] === '') {
                          primeraFilaLlegadas2[col] = 0; // Puedes ajustar el valor por defecto según tu lógica
                        } else {
                          primeraFilaLlegadas2[col] = parseFloat(primeraFilaLlegadas2[col].replace(/,/g, ""));
                        }
                      }
                    });
                
                    listaTablasResultados.forEach(objResultado => {
                      if(objResultado.nombreTabla == "Resultados IFDs"){
                        let dataPnL
                        objResultado.data.forEach(objData => {
                
                          if(objData["Descripcion"] == "US$ - P&L Realiz."){
                            dataPnL = JSON.parse(JSON.stringify(objData));
                            
                            // Convertir valores de la primera fila de la tabla a números y reemplazar '-' por valores adecuados
                            columnasPosicion.forEach(col => {
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
                            columnasPosicion.forEach(col => {
                              try {
                                if(col[0] !== 'Descripcion'){
                                  try{
                                    const valorLlegadas = parseFloat(primeraFilaLlegadas2[col[0]]) || 0;
                                    const valorPnL = parseFloat(dataPnL[col[0]]);;
                                    const valorMtM = parseFloat(mtmAgrupado[col[0]]);;
                
                                  
                                    objData[col[0]] = ((((valorPnL + valorMtM) * -1 )/ valorLlegadas) || 0).toFixed(10);
                                  }catch(error){objData[col[0]] = '-'}
                                  
                                } 
                              } catch (error) {}
                            });
                
                          }
                        });
                
                      }
                    });
                  }

                  //Calcular CFR
                  let flgPrimeraColumna = 0;
                  let flgPrimeraColumnaResult = 0;
                  this.fretRealTimeService.calculoCFR(arrListaMercado,listaTablasPosicion, listaTablasResultados, columnasPosicion,commoditie.descripcion, listaTrigoXMes).subscribe(
                    (response) => {
                      listaTablasResultados[2].data.forEach(columnaMes => {
                        if(columnaMes["Descripcion"] == 'CFR Compañia'){
                          Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                            for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
                              if(mesResponse == mesTabla){
                                columnaMes[mesTabla] = Number(valorResponse).toFixed(0);
                              }
                            } 
                          });         
                        }
                        flgPrimeraColumna += 1
                      });
              
                      arrListaResultadosComparativo.forEach(dataComparativo => {
                        if(dataComparativo[0].includes("CFR Compañia")){
                          
                          let contadorComp = 0
                          for(let columna of columnasResultados){
                            Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                              if(mesResponse == columna){
                                dataComparativo[contadorComp] = Number(valorResponse).toFixed(0); 
                              }
                            });
                            contadorComp++
                          }
                        }
                      })
                      
                      arrListaResultadosComparativo.forEach(dataComparativo => {
                        if(dataComparativo[0].includes("Mercado")){
                          
                          (dataComparativo as string[]).map((element, index) => {
                            if(index != 0 && index <= 18){
                              try {
                                if(commoditie.descripcion == 'ECONOMICO'){ // ['CORRECTOR', 'ECONOMICO', 'NNA','SRW', 'SBO']
                                  if(["CPSR","HRW"].includes(listaTrigoXMes[index - 1][0])){
                                    dataComparativo[index] = (((Number(arrListaMercado[1][index]) + Number(arrListaMercado[3][index])) * response["Factor"]) + Number(arrListaMercado[4][index])).toFixed(2).toString()
                                  }else{
                                    dataComparativo[index] = (Number(arrListaMercado[2][index]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                                  }
                                }else if(commoditie.descripcion == 'DURUM' || commoditie.descripcion == 'SFO'){
                                  dataComparativo[index] = (Number(arrListaMercado[2][index]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                                }else if(commoditie.descripcion == 'CPO'){
                                  let indexFuturoC3: number = arrListaMercado.findIndex(obj => obj[0] === "Monthly avg c3 + Spread");
                                  if(indexFuturoC3 > 0){
                                    dataComparativo[index] = (arrListaMercado[indexFuturoC3][index] || 0)
                                  }
                                }else{
                                  if(arrListaMercado.length > 5){
                                    dataComparativo[index] = (((Number(arrListaMercado[1][index]) + Number(arrListaMercado[3][index]) + Number(arrListaMercado[5][index])) * response["Factor"]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                                  }else{
                                    dataComparativo[index] = (((Number(arrListaMercado[1][index]) + Number(arrListaMercado[3][index])) * response["Factor"]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                                  }
                                }
                                listaTrigoXMes[index - 1][1] = dataComparativo[index]
                              } catch (error) {
                                // Manejo del error
                                dataComparativo[index] = '0'
                                listaTrigoXMes[index - 1][1] = dataComparativo[index]
                              } 
                            }
                          });
                          
                          listaTablasResultados[2].data.forEach(columnaMes => {
                            if(columnaMes["Descripcion"] == "Mercado"){
                              for(let columna of columnasResultados){
                                if(flgPrimeraColumnaResult != 0 && flgPrimeraColumnaResult <= 18){
                                  columnaMes[columna.toString()] = listaTrigoXMes[flgPrimeraColumnaResult - 1][1]
                                }
                                flgPrimeraColumnaResult += 1
                              }
                            }
                          });
                        }
                      });

                      //Calcular comparativo
                      const primeraFilaLlegadas = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    
                      const cfrCompania = arrListaResultadosComparativo.find(tabla => tabla[0].includes('CFR Compañia'));
                      const mercado = arrListaResultadosComparativo.find(tabla => tabla[0].includes('Mercado'))
                      const proyectoBase = arrListaResultadosComparativo.find(tabla => tabla[0].startsWith('PB '))
                      
                      if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida
                      if (!mercado) return; // Salir si no hay primera fila válida
                      if (!cfrCompania) return; // Salir si no hay primera fila válida
                      if (!proyectoBase) return; // Salir si no hay primera fila válida
                      
                      const obtenerTexto = (cadena: string): string => cadena.match(/^(\S+\s\S+)/)?.[1] ?? cadena;
                  
                      arrListaResultadosComparativo.forEach(dataComparativo => {
                        if(dataComparativo[0].includes("CFR vs Mcdo")){
                          let contadorComp = 0
                          for(let columna of columnasResultados){
                            if(contadorComp != 0){
                              dataComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(mercado[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
                            }
                            contadorComp++
                          }
                  
                        }else if(dataComparativo[0].includes("CFR vs PB")){
                          let contadorComp = 0
                          for(let columna of columnasResultados){
                            if(contadorComp != 0){
                              dataComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(proyectoBase[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
                            }
                            contadorComp++
                          }
                        }
                  
                        if(dataComparativo[0].startsWith("PY ")){
                          let proyecto = obtenerTexto(dataComparativo[0]);
                          const py_m = arrListaResultadosComparativo.find(tabla => tabla[0].startsWith(proyecto))
                  
                          if (!py_m) return;
                  
                          arrListaResultadosComparativo.forEach(dataSubComparativo => {
                            let contadorComp = 0
                            for(let columna of columnasResultados){
                              if(contadorComp != 0){
                                if(dataSubComparativo[0].startsWith('CFR vs '+proyecto)){
                                  dataSubComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(py_m[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
                                }
                              }
                              contadorComp++
                            }
                          })
                  
                        }
                        
                      })

                      //Calcular MTM Pricing Fisico
                    const valoresMercado = arrListaMercado[1];
                    const pricingTM = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Pricing')?.data[1]
                    const pricingPrecio = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Pricing')?.data[2]
                
                    if (!valoresMercado) return;
                    if (!pricingTM) return;
                    if (!pricingPrecio) return;
                
                    listaTablasResultados.find(tabla => tabla.nombreTabla === 'Resultados Físico')?.data.filter(obj => obj["Descripcion"].includes("MTM Prx proveed")).forEach(dataResultado => {
                      let contadorResultado = 0
                      for(let columna of columnasResultados){
                        if(contadorResultado != 0 && contadorResultado != 19 && contadorResultado != 20){
                
                          let valorMtM = (Number(valoresMercado[contadorResultado]) - Number(pricingPrecio[columna.toString()])) * Math.round(Number(pricingTM[columna.toString()])/factorContractInMetricTons) * factorContractInPrice
                          const formattedValue = valorMtM.toLocaleString('en-US');
                
                          dataResultado[columna.toString()] = formattedValue
                        }
                        contadorResultado++
                      }
                    })

                    //Calcular Resumen Bases
                    const primeraFilaLlegadas2 = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
                    const primeraFilaBases = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Bases')?.data.filter(obj => obj["Descripcion"].includes('Bases + Papeles (TM)'))[0];
                    const primeraFilaFlat = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Flat')?.data.filter(obj => obj["Descripcion"].includes('FLAT (TM)'))[0];
                    const primeraFilaFlete = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Flete')?.data.filter(obj => obj["Descripcion"].includes('Volumen Cerrado TM'))[0];
                
                    if (!primeraFilaLlegadas2 || !primeraFilaBases || !primeraFilaFlat || !primeraFilaFlete) {
                      this.llenarExcel(workbook, tipoReporte, commoditie.descripcion, arrListaMercado, listaTablasPosicion, listaTablasResultados, columnasPosicion, arrListaConsultaIFD, arrListaConsultaPapelesLiquid, listaPrecioFOBPalma);
                      return;
                    };
                
                    columnasResultados.forEach((col, indexPosicion) => {
                      let basesTM = Number(primeraFilaBases[col.toString()]) || 0
                      let flatTM = Number(primeraFilaFlat[col.toString()]) || 0
                      let llegada = Number(primeraFilaLlegadas2[col.toString()]) || 0
                      let flete = Number(primeraFilaFlete[col.toString()]) || 0
                        try {
                          if(indexPosicion != 0){
                            if(llegada == 0){
                              arrListaResultados[2][indexPosicion] = '0%'
                              arrListaResultados[7][indexPosicion] = '0%'
                            }else{
                              arrListaResultados[2][indexPosicion] = (((basesTM + flatTM)/llegada) * 100).toFixed(0).toString() + '%'
                              arrListaResultados[7][indexPosicion] = (((flete + flatTM)/llegada) * 100).toFixed(0).toString() + '%'
                            }
                            
                          }
                        } catch (error) {
                          // Manejo del error
                          arrListaResultados[2][indexPosicion] = '-'
                        } 
                    });

                    this.llenarExcel(workbook, tipoReporte, commoditie.descripcion, arrListaMercado, listaTablasPosicion, listaTablasResultados, columnasPosicion, arrListaConsultaIFD, arrListaConsultaPapelesLiquid, listaPrecioFOBPalma);

                    },
                    (error: HttpErrorResponse) => {
                      alert(error.message);
                    });

                    
                  
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
            },
            (error) => {
              console.error('Error: ', error);
            }
          );

          

        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      this.fretService.obtenerDatosFretHistorico(Number(this.fechaVigenteEntero),commoditie.idProductFret.toString(),commoditie.descripcion).subscribe(
        (response: objInitTabPosicion) => {
          //listas
          let listaTablasPosicion: objTablas[];
          let columnasPosicion: Object[];
          let arrListaResultados: Object[];
          let arrListaResultadosComparativo: Object[];
          let arrListaMercado: Object[];
          let listaPrecioFOBPalma:Object[]=[];
          let listaTablasResultados: objTablas[];
          let columnasResultados: Object[];
          let arrListaConsultaIFD: ListaConsultaIFD[];
          let startIndexs: number[] = [];
          let endIndexs: number[] = [];
          let listaTrigoXMes: string[][] = [];
          let sortDirections: {
            [tablaIndex: number]: {
              [propiedad: string]: string;
            };
          } = [];
          let columnas: any[] = [];
          let arrListaConsultaPapelesLiquid: Object[];
          let columnasPapelesLiquidados: Object[];
          let factorContractInMetricTons: number;
          let factorContractInPrice: number;

          listaTablasPosicion = response.listaData;
          columnasPosicion = response.columnas;
          factorContractInMetricTons = response.factor;
          factorContractInPrice = response.factorPrice;

          const newData: Object[] =response.listaDataResumen.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
          arrListaResultados  = newData.map((item: any): any => item.slice(1));

          const newDataResumen: Object[] =response.listaDataResumenComparativo.sort((a: any, b: any) => a[0] - b[0]);//ordenamiento
          arrListaResultadosComparativo  = newDataResumen.map((item: any): any => item.slice(1));
          
          let ticker: string = "CPSR";

          const newDataMercado: Object[] =response.listaDataMercado.sort((a: any, b: any) => a[0] - b[0]);
          arrListaMercado  = newDataMercado.map((item: any): any => item.slice(1));
          if(arrListaMercado.length > 0){
            arrListaMercado[0][0]='Ticker'
          }

          if(commoditie.descripcion == 'CPO'){
            const dataFOBPalma: Object[] =response.listaFOBPalma.sort((a: any, b: any) => a[0] - b[0]);
            listaPrecioFOBPalma  = dataFOBPalma.map((item: any): any => item.slice(1));
          }
          
          listaTablasResultados = response.listaDataResultado;
          columnasResultados =  response.columnasResultado;

          arrListaConsultaIFD = response.ifds

          for (let i = 0; i < listaTablasPosicion.length; i++) {
            const tabla = listaTablasPosicion[i];
            if (tabla.nombreTabla === 'Llegadas Y Dias Giro') {
              for(let columna of columnasResultados){
                if(columna.toString() != "Descripcion" && columna.toString() != "CE" && columna.toString() != "Total"){
                  for (let j = 0; j < tabla.data.length; j++) {
                    const dataPosicion = tabla.data[j];
                    if (dataPosicion["Descripcion"].includes('Total TM')) {
                      i = listaTablasPosicion.length; 
                      break;
                    }
                    if(dataPosicion[columna.toString()] != null){
                      ticker = extractLastPart(dataPosicion["Descripcion"])
                    }
                  }
                  listaTrigoXMes.push([ticker,""]);
                } 
              }              
            }
          }

          if(arrListaConsultaIFD != undefined){
            arrListaConsultaIFD.forEach(objDestino => {
              if(objDestino.tipoIFD !== "Liquidadas"){
                objDestino.dataIFD = objDestino.dataIFD.map(objeto => {
                  return { ...objeto, PrecioActual: objeto["precioActual"], PrecioAnterior: 0, };
                });
                
                objDestino.dataIFD.map(objeto => {
                  objeto["precioActual"] = objeto.s303_Mkt;
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
           
            // console.log(this.arrListaConsultaIFD[0].cabecera)

            // Inicializar los índices de inicio y fin para cada tabla
            for (let i = 0; i < arrListaConsultaIFD.length; i++) {
              startIndexs[i] = 0;
              endIndexs[i] = this.pageSize;
              sortDirections[i] = {};
            }
    
            //Se llenan las Columnas IFD
            if(columnas.length != 0){
              columnas = this.transposeArray(arrListaConsultaIFD[0].cabecera);
            }
          }
          arrListaConsultaPapelesLiquid = response.dataPapelesLiquid;
          columnasPapelesLiquidados = response.columnasPapelesLiquid;//[this.tabSeleccionado].concat(response.columnas);

          //Recalculo Caps Floors
          let dictPricing = []
          let dicDeltasxMes_Caps = []
          let dicDeltasxMes_Floors = []
      
          const primeraFilaLlegadas = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
          const primeraFilaFlat = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Flat')?.data.filter(obj => obj["Descripcion"].includes('FLAT (TM)'))[0];
          
          if(arrListaConsultaIFD != null){
            arrListaConsultaIFD.forEach(objDestino => {
              if(objDestino.tipoIFD == "Pricing"){
                dictPricing = this.fretRealTimeService.calculoPosicionPricing(objDestino.dataIFD, factorContractInMetricTons);
              }else if(objDestino.tipoIFD == "Caps"){
                dicDeltasxMes_Caps = this.fretRealTimeService.calculoDeltasCaps(objDestino.dataIFD, factorContractInMetricTons);
              }else if(objDestino.tipoIFD == "Floors"){
                dicDeltasxMes_Floors = this.fretRealTimeService.calculoDeltasFloors(objDestino.dataIFD, factorContractInMetricTons);
              }
            });
        
            
        
            listaTablasPosicion.forEach((tabla, index) => {
              if(tabla.nombreTabla == 'Caps'){
                Object.entries(tabla.data[3]).forEach(([nombreColumna, valor]) => {
        
                  if(nombreColumna !== 'Orden' && nombreColumna !== 'Descripcion'){
                    try{
                      tabla.data[3][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["tm"]
                    }catch(error){
                      tabla.data[3][nombreColumna] = '-'
                    }
        
                    try{
                      tabla.data[4][nombreColumna] = dicDeltasxMes_Caps.filter(obj => obj["mes"] === nombreColumna)[0]["precio"]
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
                        tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
                      }catch(error){
                        tabla.data[6][nombreColumna] = '-'
                      }
        
                      columnasPosicion.forEach((col, indexPosicion) => {
                        if(col[0] == nombreColumna){
                          try {
                            arrListaResultados[5][indexPosicion] = tabla.data[6][nombreColumna]
                          } catch (error) {
                            // Manejo del error
                            arrListaResultados[5][indexPosicion] = '-'
                          } 
                        }
                      });
                  }
                });
              }else if(tabla.nombreTabla == 'Floors'){
        
                // Limpieza de tabla
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
                      if(dicDeltasxMes_Floors.filter(obj => obj["mes"] === nombreColumna)[0]["tipo"] == "fijo"){
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
                        tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
                      }catch(error){
                        tabla.data[6][nombreColumna] = '-'
                      }
        
                      columnasPosicion.forEach((col, indexPosicion) => {
                        if(col[0] == nombreColumna){
        
                          try {
                            arrListaResultados[6][indexPosicion] = tabla.data[6][nombreColumna]
                          } catch (error) {
                            // Manejo del error
                            arrListaResultados[6][indexPosicion] = '-'
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
                      if(tabla.data[4][nombreColumna] == 'Infinity%'){
                        tabla.data[4][nombreColumna] = '0%'
                      }
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
        
                      let valorFlat = 0
                      if (!primeraFilaFlat){
                        valorFlat = 0;
                      }else{
                        valorFlat = parseFloat(primeraFilaFlat[nombreColumna] || 0) ;
                      }

                      try{
                        tabla.data[6][nombreColumna] = (((isFinite(Number(tabla.data[0][nombreColumna]) / valorLlegadas) ? (Number(tabla.data[0][nombreColumna]) / valorLlegadas) : 0) * 100).toFixed(0)).toString() + '%'
                      }catch(error){
                        tabla.data[6][nombreColumna] = '-'
                      }
        
                      columnasPosicion.forEach((col, indexPosicion) => {
                        if(col[0] == nombreColumna){
        
                          try {
                            arrListaResultados[3][indexPosicion] = ((((Number(tabla.data[1][nombreColumna]) + (valorFlat | 0)) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                            arrListaResultados[4][indexPosicion] = (((Number(tabla.data[3][nombreColumna]) / valorLlegadas || 0) * 100).toFixed(0)).toString() + '%'
                            if(arrListaResultados[4][indexPosicion] == 'Infinity%'){
                              arrListaResultados[4][indexPosicion] = '0%'
                            }
                          } catch (error) {
                            // Manejo del error
                            arrListaResultados[6][indexPosicion] = '-'
                          } 
                        }
                      });
                  }
              });
              }
        
            });

            //Calcular Delta Neto Resumen
            columnasPosicion.forEach((col, indexPosicion) => {
              if(col[0] !== 'Descripcion'){
                try {
                  arrListaResultados[8][indexPosicion] = (Number(arrListaResultados[3][indexPosicion].replace('%','').replace(/^-\s*$/, '')) +
                                                              Number(arrListaResultados[4][indexPosicion].replace('%','').replace(/^-\s*$/, '')) + 
                                                              Number(arrListaResultados[5][indexPosicion].replace('%','').replace(/^-\s*$/, '')) + 
                                                              Number(arrListaResultados[6][indexPosicion].replace('%','').replace(/^-\s*$/, '')) ).toString() + '%'
                } catch (error) {
                  // Manejo del error
                  arrListaResultados[8][indexPosicion] = '-'
                } 
              }
            });

          }

          //Cálculo resultado IFD MTM
          let dicMtMxMes = []

          if(arrListaConsultaIFD != null){
            arrListaConsultaIFD.forEach(objDestino => {
              if(objDestino.tipoIFD !== "Liquidadas"){
                objDestino.dataIFD.forEach(objData => {
                  dicMtMxMes[objData["s303_Cobertura"]] = Number(dicMtMxMes[objData["s303_Cobertura"]] ?? 0) + Number(objData["s303_M2M"]);
                });
              }
            });
        
            let mtmAgrupado
        
            listaTablasResultados.forEach(objResultado => {
              if(objResultado.nombreTabla == "Resultados IFDs"){
        
                objResultado.data.forEach(objData => {
                  if(objData["Descripcion"] == "US$ - MTM"){
                    for(let item in dicMtMxMes){
                      objData[item] = (dicMtMxMes[item] as number).toLocaleString('en-US');
                    }
        
                    mtmAgrupado = JSON.parse(JSON.stringify(objData));
                    
                    // Convertir valores de la primera fila de la tabla a números y reemplazar '-' por valores adecuados
                    columnasPosicion.forEach(col => {
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
        
            const primeraFilaLlegadas2 = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
            if (!primeraFilaLlegadas2) return; // Salir si no hay primera fila válida
        
            // Convertir los valores de la primera fila de 'Llegadas Y Dias Giro' a números
            Object.keys(primeraFilaLlegadas2).forEach(col => {
              if (col !== 'mes' && columnasPosicion.includes(col)) {
                if (primeraFilaLlegadas2[col] === '-' || primeraFilaLlegadas2[col] === '') {
                  primeraFilaLlegadas2[col] = 0; // Puedes ajustar el valor por defecto según tu lógica
                } else {
                  primeraFilaLlegadas2[col] = parseFloat(primeraFilaLlegadas2[col].replace(/,/g, ""));
                }
              }
            });
        
            listaTablasResultados.forEach(objResultado => {
              if(objResultado.nombreTabla == "Resultados IFDs"){
                let dataPnL
                objResultado.data.forEach(objData => {
        
                  if(objData["Descripcion"] == "US$ - P&L Realiz."){
                    dataPnL = JSON.parse(JSON.stringify(objData));
                    
                    // Convertir valores de la primera fila de la tabla a números y reemplazar '-' por valores adecuados
                    columnasPosicion.forEach(col => {
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
                    columnasPosicion.forEach(col => {
                      try {
                        if(col[0] !== 'Descripcion'){
                          try{
                            const valorLlegadas = parseFloat(primeraFilaLlegadas2[col[0]]) || 0;
                            const valorPnL = parseFloat(dataPnL[col[0]]);;
                            const valorMtM = parseFloat(mtmAgrupado[col[0]]);;
        
                          
                            objData[col[0]] = ((((valorPnL + valorMtM) * -1 )/ valorLlegadas) || 0).toFixed(10);
                          }catch(error){objData[col[0]] = '-'}
                          
                        } 
                      } catch (error) {}
                    });
        
                  }
                });
        
              }
            });
          }
          //Calcular CFR
          let flgPrimeraColumna = 0
          let flgPrimeraColumnaResult = 0
      
          this.fretRealTimeService.calculoCFR(arrListaMercado,listaTablasPosicion, listaTablasResultados, columnasPosicion,commoditie.descripcion, listaTrigoXMes).subscribe(
            (response) => {
    
              // this.factorContractInPrice = response["Factor"]
              listaTablasResultados[2].data.forEach(columnaMes => {
                if(columnaMes["Descripcion"] == 'CFR Compañia'){
                  Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                    for (const [mesTabla, valorTabla] of Object.entries(columnaMes)) {
                      if(mesResponse == mesTabla){
                        columnaMes[mesTabla] = Number(valorResponse).toFixed(0);
                      }
                    } 
                  });         
                }
                flgPrimeraColumna += 1
              });
      
              arrListaResultadosComparativo.forEach(dataComparativo => {
                if(dataComparativo[0].includes("CFR Compañia")){
                  
                  let contadorComp = 0
                  for(let columna of columnasResultados){
                    Object.entries(response).forEach(([mesResponse, valorResponse]) => {
                      if(mesResponse == columna){
                        dataComparativo[contadorComp] = Number(valorResponse).toFixed(0); 
                      }
                    });
                    contadorComp++
                  }
                }
              })
              
              arrListaResultadosComparativo.forEach(dataComparativo => {
                if(dataComparativo[0].includes("Mercado")){
                  
                  (dataComparativo as string[]).map((element, index) => {
                    if(index != 0 && index <= 18){
                      try {
                        if(commoditie.descripcion == 'ECONOMICO'){ // ['CORRECTOR', 'ECONOMICO', 'NNA','SRW', 'SBO']
                          if(["CPSR","HRW"].includes(listaTrigoXMes[index - 1][0])){
                            dataComparativo[index] = (((Number(arrListaMercado[1][index]) + Number(arrListaMercado[3][index])) * response["Factor"]) + Number(arrListaMercado[4][index])).toFixed(2).toString()
                          }else{
                            dataComparativo[index] = (Number(arrListaMercado[2][index]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                          }
                        }else if(commoditie.descripcion == 'DURUM' || commoditie.descripcion == 'SFO'){
                          dataComparativo[index] = (Number(arrListaMercado[2][index]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                        }else if(commoditie.descripcion == 'CPO'){
                          let indexFuturoC3: number = arrListaMercado.findIndex(obj => obj[0] === "Monthly avg c3 + Spread");
                          if(indexFuturoC3 > 0){
                            dataComparativo[index] = (arrListaMercado[indexFuturoC3][index] || 0)
                          }
                        }else{
                          if(arrListaMercado.length > 5){
                            dataComparativo[index] = (((Number(arrListaMercado[1][index]) + Number(arrListaMercado[3][index]) + Number(arrListaMercado[5][index])) * response["Factor"]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                          }else{
                            dataComparativo[index] = (((Number(arrListaMercado[1][index]) + Number(arrListaMercado[3][index])) * response["Factor"]) + Number(arrListaMercado[4][index])).toFixed(0).toString()
                          }
                        }
                        listaTrigoXMes[index - 1][1] = dataComparativo[index]
                      } catch (error) {
                        // Manejo del error
                        dataComparativo[index] = '0'
                        listaTrigoXMes[index - 1][1] = dataComparativo[index]
                      } 
                    }
                  });
                  
                  listaTablasResultados[2].data.forEach(columnaMes => {
                    if(columnaMes["Descripcion"] == "Mercado"){
                      for(let columna of columnasResultados){
                        if(flgPrimeraColumnaResult != 0 && flgPrimeraColumnaResult <= 18){
                          columnaMes[columna.toString()] = listaTrigoXMes[flgPrimeraColumnaResult - 1][1]
                        }
                        flgPrimeraColumnaResult += 1
                      }
                    }
                  });
                }
              });
    
              //Calcular comparativo
              const primeraFilaLlegadas = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Llegadas Y Dias Giro')?.data.filter(obj => obj["Descripcion"].includes('Total TM'))[0];
    
              const cfrCompania = arrListaResultadosComparativo.find(tabla => tabla[0].includes('CFR Compañia'));
              const mercado = arrListaResultadosComparativo.find(tabla => tabla[0].includes('Mercado'))
              const proyectoBase = arrListaResultadosComparativo.find(tabla => tabla[0].startsWith('PB '))
              
              if (!primeraFilaLlegadas) return; // Salir si no hay primera fila válida
              if (!mercado) return; // Salir si no hay primera fila válida
              if (!cfrCompania) return; // Salir si no hay primera fila válida
              if (!proyectoBase) return; // Salir si no hay primera fila válida
              
              const obtenerTexto = (cadena: string): string => cadena.match(/^(\S+\s\S+)/)?.[1] ?? cadena;
          
              arrListaResultadosComparativo.forEach(dataComparativo => {
                if(dataComparativo[0].includes("CFR vs Mcdo")){
                  let contadorComp = 0
                  for(let columna of columnasResultados){
                    if(contadorComp != 0){
                      dataComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(mercado[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
                    }
                    contadorComp++
                  }
          
                }else if(dataComparativo[0].includes("CFR vs PB")){
                  let contadorComp = 0
                  for(let columna of columnasResultados){
                    if(contadorComp != 0){
                      dataComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(proyectoBase[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
                    }
                    contadorComp++
                  }
                }
          
                if(dataComparativo[0].startsWith("PY ")){
                  let proyecto = obtenerTexto(dataComparativo[0]);
                  const py_m = arrListaResultadosComparativo.find(tabla => tabla[0].startsWith(proyecto))
          
                  if (!py_m) return;
          
                  arrListaResultadosComparativo.forEach(dataSubComparativo => {
                    let contadorComp = 0
                    for(let columna of columnasResultados){
                      if(contadorComp != 0){
                        if(dataSubComparativo[0].startsWith('CFR vs '+proyecto)){
                          dataSubComparativo[contadorComp] = (Math.round(Number(cfrCompania[contadorComp])) - Math.round(Number(py_m[contadorComp]))) * parseFloat(primeraFilaLlegadas[columna.toString()])
                        }
                      }
                      contadorComp++
                    }
                  })
                }
              })
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
          
          //Calcular MTM Pricing Físico
          const valoresMercado = arrListaMercado[1];
          const pricingTM = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Pricing')?.data[1]
          const pricingPrecio = listaTablasPosicion.find(tabla => tabla.nombreTabla === 'Pricing')?.data[2]
      
          if (!valoresMercado) return;
          if (!pricingTM) return;
          if (!pricingPrecio) return;
      
          listaTablasResultados.find(tabla => tabla.nombreTabla === 'Resultados Físico')?.data.filter(obj => obj["Descripcion"].includes("MTM Prx proveed")).forEach(dataResultado => {
            let contadorResultado = 0
            for(let columna of columnasResultados){
              if(contadorResultado != 0 && contadorResultado != 19 && contadorResultado != 20){
      
                let valorMtM = (Number(valoresMercado[contadorResultado]) - Number(pricingPrecio[columna.toString()])) * Math.round(Number(pricingTM[columna.toString()])/factorContractInMetricTons) * factorContractInPrice
                const formattedValue = valorMtM.toLocaleString('en-US');
      
                dataResultado[columna.toString()] = formattedValue
              }
              contadorResultado++
            }
          })

          this.llenarExcel(workbook, tipoReporte, commoditie.descripcion, arrListaMercado, listaTablasPosicion, listaTablasResultados, columnasPosicion, arrListaConsultaIFD, arrListaConsultaPapelesLiquid, listaPrecioFOBPalma);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
      });
    }
  }

  async llenarExcelHedgeEstrategico(workbook, tipoReporte, commoditie){
    this.portafolioIFDMoliendaService.getlistahedgeabierto(Number(this.fechaVigenteEntero)).subscribe((responseAbierto:ListaHedgeAbierto[])=>{
      this.fretRealTimeService.obtenerUltimosPrecios().subscribe((responseUltPrecio) => {
          this.portafolioIFDMoliendaService.getlistahedge(Number(this.fechaVigenteEntero)).subscribe((responseHedge:ListaHedge[])=>{
            this.fretRealTimeService.valorizacionDemanda().subscribe(async (responseValoorizacionDemanda) => {
              let listasHedgeAbiertoOriginal = responseAbierto.map(objeto => {
                return { ...objeto, precioActual: objeto["precioActual"], precioAnterior: 0, };
              });
              let precioActual: number | null;
              let primaActual: number | null;
              
              listasHedgeAbiertoOriginal.forEach(objDestino => {
                const filtrado = responseUltPrecio.filter(item => item.Ticker === objDestino["s374_Contrato"])
                const filtradoPrima = responseUltPrecio.filter(item => item.Ticker === objDestino["s374_Contrato"] + objDestino["s374_Ifd"].slice(2,3) + ' ' + objDestino["s374_Strike"])
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

              listasHedgeAbiertoOriginal.forEach(objDestino => {
                if(objDestino["s374_Ifd"].includes("Call") || objDestino["s374_Ifd"].includes("Put")){
                  let factor = 0;
                  switch (objDestino.commodity){
                    case 'W': case 'SCR': case 'S':
                      factor = 50;
                      break;
                    case 'SM':
                      factor = 100;
                      break;
                    case 'SBO':
                      factor = 600;
                      break;
                    case 'CPO':
                      factor = 25;
                      break;
                  }
                  if(objDestino["s374_Ifd"].includes("Call")){
                    if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
                      objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] * - 1 - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * factor)
                    }else{
                      objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * factor)
                    }
                  }else if(objDestino["s374_Ifd"].includes("Put")){
                    if(objDestino["s374_Ifd"].substring(0,1) == '-'){ //<---- Venta
                      objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] + objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * factor) * -1
                    }else{
                      objDestino["s374_M2M"] = ((objDestino["s374_PrecioProeveedor"] - objDestino["s374_PrimaPagada"]) * objDestino["s374_NumeroContratos"] * factor)
                    }
                  }else if(objDestino["s374_Ifd"].includes("Futuro")){
                    objDestino["s374_M2M"] = ((objDestino["precioActual"] - objDestino["s374_Strike"]) * objDestino["s374_NumeroContratos"] * factor)
                  }
                }
              })
  
              let listasHedgeAbierto = listasHedgeAbiertoOriginal.map((x) => {return {
                'commodity' : x.commodity
                , 'Fecha Pacto': x.s374_fechatrade
                , 'Broker Referencia': x.s374_Broker
                , 'Ficha': x.s374_Ficha
                , 'Sociedad': x.s374_Sociedad
                , 'Contrato': x.s374_Contrato
                , 'Fecha Expiracion': x.s374_Fechaexpiracion
                , 'Cobertura': x.s374_Cobertura?.toString().replace('Sep', 'Set')
                , 'Numero Contratos': x.s374_NumeroContratos
                , 'Delta': x.s374_Delta
                , 'Strike': x.s374_Strike
                , 'Ifd': x.s374_Ifd?.toString().replace('Futuro', 'Future')
                , 'Estrategia': x.s374_Estrategia
                , 'Prima Pagada': x.s374_PrimaPagada
                , 'Precio/Prima Mercado': ((x.s374_Ifd?.toString().toLowerCase().includes('swap') || x.s374_Ifd?.toString().toLowerCase().includes('futuro')) ? x.precioActual : x.s374_PrecioProeveedor)
                , 'Comentarios FO': x.s374_Comentarios
              }});
  
              let listaDataHedge = responseHedge.map((x) => {return {
                'F. Unwind': x.s373_FechaUnwind
                , 'F. Trade': x.s373_FechaTrade
                , 'Broker Referencia': x.s373_Broker
                , 'Ficha': x.s373_Ficha
                , 'Sociedad': x.s373_Sociedad
                , 'Contrato': x.s373_Contrato
                , 'Fecha Expiracion': x.s373_FechaExpiracion
                , 'Cobertura': x.s373_Cobertura?.toString().replace('Sep', 'Set')
                , 'Numero Contratos': x.s373_NumeroContratos
                , 'Strike': x.s373_Strike
                , 'Ifd': x.s373_Ifd?.toString().replace('Futuro', 'Future')
                , 'Estrategia': x.s373_Estrategia
                , 'Prima Pagada': x.s373_PrimaPagada
                , 'Liquidación': x.s373_PrecioProveedor
                , 'Comentarios FO': x.s373_Comentarios
              }});
      
              let worksheet = workbook.getWorksheet(commoditie);
              let nombreArchivo = '';
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
                        worksheet.getCell(filaCabeceras + nFilasXCommoditie, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
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
                        worksheet.getCell(filaCabeceras + 1 + idxFila, Number(columnaHoja)).value = Number.isFinite(Number(valorCelda?.toString().replace(/,/g, ''))) ? Number(valorCelda?.toString().replace(/,/g, '')) : valorCelda;
                      }
                    }
                  }
                });
  
                //Ocultar filas vacías TRIGOS
                let filaInicio = this.encontrarFilaPorColumna(worksheet, 1, 'TRIGOS INI');
                let filaFin = this.encontrarFilaPorColumna(worksheet, 1, 'TRIGOS FIN');
                for(let fila = filaInicio; fila <= filaFin; fila++){
                  if(!worksheet.getCell(fila, 2).value){
                    worksheet.getRow(fila).hidden = true; // Ocultar la fila
                  }
                }
  
                //Ocultar filas vacías SOYCRUSH
                filaInicio = this.encontrarFilaPorColumna(worksheet, 1, 'SOYCRUSH INI');
                filaFin = this.encontrarFilaPorColumna(worksheet, 1, 'SOYCRUSH FIN');
                for(let fila = filaInicio; fila <= filaFin; fila++){
                  if(!worksheet.getCell(fila, 2).value){
                    worksheet.getRow(fila).hidden = true; // Ocultar la fila
                  }
                }
  
                //Ocultar filas vacías BEANS
                filaInicio = this.encontrarFilaPorColumna(worksheet, 1, 'BEANS INI');
                filaFin = this.encontrarFilaPorColumna(worksheet, 1, 'BEANS FIN');
                for(let fila = filaInicio; fila <= filaFin; fila++){
                  if(!worksheet.getCell(fila, 2).value){
                    worksheet.getRow(fila).hidden = true; // Ocultar la fila
                  }
                }
  
                //Ocultar filas vacías SBM
                filaInicio = this.encontrarFilaPorColumna(worksheet, 1, 'SBM INI');
                filaFin = this.encontrarFilaPorColumna(worksheet, 1, 'SBM FIN');
                for(let fila = filaInicio; fila <= filaFin; fila++){
                  if(!worksheet.getCell(fila, 2).value){
                    worksheet.getRow(fila).hidden = true; // Ocultar la fila
                  }
                }
  
                //Ocultar filas vacías SBO
                filaInicio = this.encontrarFilaPorColumna(worksheet, 1, 'SBO INI');
                filaFin = this.encontrarFilaPorColumna(worksheet, 1, 'SBO FIN');
                for(let fila = filaInicio; fila <= filaFin; fila++){
                  if(!worksheet.getCell(fila, 2).value){
                    worksheet.getRow(fila).hidden = true; // Ocultar la fila
                  }
                }
  
                //Ocultar filas vacías CPO
                filaInicio = this.encontrarFilaPorColumna(worksheet, 1, 'CPO INI');
                filaFin = this.encontrarFilaPorColumna(worksheet, 1, 'CPO FIN');
                for(let fila = filaInicio; fila <= filaFin; fila++){
                  if(!worksheet.getCell(fila, 2).value){
                    worksheet.getRow(fila).hidden = true; // Ocultar la fila
                  }
                }
  
                //Ocultar filas vacías Liquidaciones
                filaInicio = this.encontrarFilaPorColumna(worksheet, 1, 'Liquidaciones INI');
                filaFin = this.encontrarFilaPorColumna(worksheet, 1, 'Liquidaciones FIN');
                for(let fila = filaInicio; fila <= filaFin; fila++){
                  if(!worksheet.getCell(fila, 2).value){
                    worksheet.getRow(fila).hidden = true; // Ocultar la fila
                  }
                }
              }
      
              this.nCommoditiesExportados++;
      
              if(this.nCommoditiesExportados == this.listaProductosFret.length){
                // Generar un nuevo Blob con los datos actualizados
                const updatedData = await workbook.xlsx.writeBuffer();
                const updatedBlob = new Blob([updatedData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                // Descargar el archivo actualizado
                nombreArchivo = (tipoReporte == 1 ? `${this.fechaVigenteEntero} FRET.xlsx` : `Compania W - SBM - SBO Position - ${this.fechaVigenteEntero}.xlsx`);
                saveAs(updatedBlob, nombreArchivo);
                this.loader.hide();
                this.flgCargando = false;
              }
            });
          });
        });
    });
  }

  exportarReporte(tipoReporte: number){//1: FRET, 2: Cargill
    this.loader.show();
    this.flgCargando = true;
    this.blobService.downloadFileBlob(`FRET/${(tipoReporte == 1 ? 'FRET_Plantilla.xlsx' : 'FRET_Cargill_Plantilla.xlsx')}`, blob => {
      this.nCommoditiesExportados = 0;
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(e.target.result);
        let worksheet = workbook.getWorksheet('Data Entry');

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
              if (this.nCommoditiesExportados == 0 && tabla.nombreTabla == 'Comparativo' && valFila['Descripcion'].startsWith('PY ')){
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
            if (this.nCommoditiesExportados == 0 && tabla.nombreTabla == 'Comparativo' && valFila['Descripcion'].startsWith('PY ')){
              nFilaPY++;
              if(worksheet){
                worksheet.getCell('A' + nFilaPY.toString()).value = valFila['Descripcion'];
              }
            }
          });
        });

        this.listaProductosFret.forEach(commoditie => {
          switch(commoditie.descripcion){
            case 'Hedge Estratégico':
              this.llenarExcelHedgeEstrategico(workbook, tipoReporte, commoditie.descripcion);
              break;
            case this.tabSeleccionado:
              this.llenarExcel(workbook, tipoReporte, commoditie.descripcion, this.arrListaMercado, this.listaTablasPosicion, this.listaTablasResultados, this.columnasPosicion, this.arrListaConsultaIFD, this.arrListaConsultaPapelesLiquid, this.listaPrecioFOBPalma);
              break;
            default:
              this.exportarCommoditieNoSeleccionado(workbook, tipoReporte, commoditie);
              break;
          }
        });        
      };

      reader.readAsArrayBuffer(blob);
    });
  }

  
}

const extractLastPart = (input: string): string => {
  const match = input.match(/-\s*(\w+)$/);
  return match ? match[1] : '';
};


