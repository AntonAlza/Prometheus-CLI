import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { ConsultaDosificadas } from 'src/app/models/Fisico/ConsultaDosificadas';
import { consultaHistoricaDosificada } from 'src/app/models/Fisico/consultaHistoricaDosificada';
import { DateOfShipmentToProcess } from 'src/app/models/Fisico/DateOfShipmentToProcess';
import { datosFacturas } from 'src/app/models/Fisico/datosFacturas';
import { DocumentDeliveryDateToCarriers } from 'src/app/models/Fisico/DocumentDeliveryDateToCarriers';
import { Dosed } from 'src/app/models/Fisico/Dosed';
import { listaAvanceSAPDosed } from 'src/app/models/Fisico/listaAvanceSAPDosed';
import { listaPedidosDosificada } from 'src/app/models/Fisico/listaPedidosDosificada';
import { objIngresarFactura } from 'src/app/models/Fisico/objIngresarFactura';
import { objInitDosificada } from 'src/app/models/Fisico/objInitDosificada';
import { objInitIngresarFactura } from 'src/app/models/Fisico/objInitIngresarFactura';
import { Order } from 'src/app/models/Fisico/Order';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../loading.service';
import * as XLSX from 'xlsx';
import { objInitConsultaHistoricaFactura } from 'src/app/models/Fisico/objInitConsultaHistoricaFactura';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-dosificadas',
  templateUrl: './dosificadas.component.html',
  styleUrls: ['./dosificadas.component.scss']
})


export class DosificadasComponent implements OnInit {

  public portafolioPendiente: ConsultaDosificadas[];
  public portafolioDosificadas: ConsultaDosificadas[];
  public portafolioDespachadas: ConsultaDosificadas[];
  public portafolioPendienteDS: MatTableDataSource<ConsultaDosificadas>;
  public portafolioDosificadasDS: MatTableDataSource<ConsultaDosificadas>;
  public portafolioDespachadasDS: MatTableDataSource<ConsultaDosificadas>;
  public listaAvanceSAP: listaAvanceSAPDosed[];
  public listapedidos: listaPedidosDosificada[];
  public inicioPeriodo: string;
  public finPeriodo: string;
  public factura: string;
  public listaOrder: Order[];
  public ingresarFacturaOBJ: objInitIngresarFactura;
  public objIngresoFactura: objIngresarFactura;
  public dosed: Dosed;
  public dateOfShipmentToProcess: DateOfShipmentToProcess;
  public datosFactura: datosFacturas;
  public documentDeliveryDateToCarriers: DocumentDeliveryDateToCarriers;
  public flgIngresarFactura: boolean = true;
  public seleccionarTodo: boolean;
  public pasaraFacturada: boolean = false;
  fecha: NgbDateStruct;
  fechaEnvioTramite: NgbDateStruct ;
  fechaEntregaDocumentoTransportista: NgbDateStruct ;
  fechInicio: NgbDateStruct ;
  fechFin: NgbDateStruct ;
  public flgFechaConsultaHistorica: boolean = false;
  public combosConsultaHistorica: objInitConsultaHistoricaFactura;
  public codigoSAP: string;
  public flgBoton: boolean = true;

  consultaCliente: string;
  consultaProducto: string;
  consultaDestino: string;
  consultaContratoVenta: string;
  consultaPuestoPlanific: string;


  fechaModificar: Date = new Date();
  fechaEnvioTramiteModificar: Date = new Date();
  fechaEntregaDocumentoTransportistaModificar: Date = new Date();


  @ViewChild('MatPaginatorIngreso', { static: true }) MatPaginatorIngreso!: MatPaginator;
  @ViewChild('MatSortIngreso') MatSortIngreso!: MatSort;

  @ViewChild('MatPaginatorDespachada', { static: true }) MatPaginatorDespachada!: MatPaginator;
  @ViewChild('MatSortDespachada') MatSortDespachada!: MatSort;

  @ViewChild('MatPaginatorPendiente', { static: true }) MatPaginatorPendiente!: MatPaginator;
  @ViewChild('MatSortPendiente') MatSortPendiente!: MatSort;

  @ViewChild(MatMenuTrigger)
  contextmenu!: MatMenuTrigger;

  public loading$= this.loader.loading$

  // @ViewChild(MatMenuTrigger)
  // contextmenuPedido!: MatMenuTrigger;
  
  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextmenu.menuData = { 'item': item };
    this.contextmenu.menu.focusFirstItem('mouse');
    // this.contextmenu.openMenu();
  }
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

  // onPedidotMenu(event: MouseEvent, item: Item, menu: any) {
  //   event.preventDefault();
  //   this.contextmenuPedido.menuData = { 'item': item };
  //   this.contextmenuPedido.menu.focusFirstItem('mouse');
  //   this.modalService.open(menu,{windowClass : "my-class"});      
  // }

  displayedColumnsEnProceso: string[] = [
   'flgPase'
   ,'opciones'
   ,'s234_Factura'
   ,'s234_Fecha'
   ,'s234_Pedidos'
   ,'s234_ToneladasNetas'
   ,'s234_AvanceSAP'
   ,'s234_AvanceSCL'
   ,'s234_PuestoPlanificacion'
   ,'s234_Destino'
   ,'s234_Cliente'
   ,'s234_Producto'
   ,'s234_Contrato'
   ,'s234_Precio'
   ,'s234_EmpresaTransporte'
   ,'s234_Flete'
   ,'s234_FechaEnvioTramite'
   ,'s234_FechaEntregaDocumento'
   ,'s234_Comentarios'
   ,'s234_SalesContract'
   ,'s234_Usuario'
   ,'s234_Barco'
   ,'s234_AnimalNutrition'
   ,'s234_Caks'
   ,'s234_FOB'];

   displayedColumns: string[] = [
    //   's234_Contador'
    //  ,'s234_Codigo',
     'opciones',
     's234_Factura'
     ,'s234_Fecha'
     ,'s234_Pedidos'
     ,'s234_ToneladasNetas'
     ,'s234_AvanceSAP'
     ,'s234_AvanceSCL'
     ,'s234_PuestoPlanificacion'
     ,'s234_Destino'
     ,'s234_Cliente'
     ,'s234_Producto'
     ,'s234_Contrato'
     ,'s234_Precio'
     ,'s234_EmpresaTransporte'
     ,'s234_Flete'
     ,'s234_FechaEnvioTramite'
     ,'s234_FechaEntregaDocumento'
     ,'s234_Comentarios'
     ,'s234_SalesContract'
     ,'s234_Usuario'
     ,'s234_Barco'
     ,'s234_AnimalNutrition'
     ,'s234_Caks'
     ,'s234_FOB'];

  @Output () close: EventEmitter<boolean>= new EventEmitter();
  
  constructor(private loader:LoadingService,private portafolioMoliendaService: PortafolioMoliendaService, private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.close = new EventEmitter<boolean>();
   }

  ngOnInit(): void {
    this.obtenerPortafolioDosificadas();
    this.codigoSAP = this.portafolioMoliendaService.codSAP;
  }

  closeModal(){
    console.log("Emite cerrado Dosed");
    this.close.emit(false); 
  }
  cerrar() {
    // this.close.emit.();
    this.closeModal();
    this.modalService.dismissAll();
  }

  obtenerPortafolioDosificadas(){
    this.datosFactura = new datosFacturas();
    
    this.portafolioMoliendaService.obtenerDosificadas(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: objInitDosificada) => {
        this.portafolioDosificadas = response.portafolioDosificadas;
        this.portafolioDespachadas = response.portafolioDespachadas;
        this.portafolioPendiente = response.portafoliopendiente;
        this.portafolioDosificadasDS = new MatTableDataSource(this.portafolioDosificadas);
        this.portafolioDosificadasDS.paginator = this.MatPaginatorIngreso;
        this.portafolioDosificadasDS.sort = this.MatSortIngreso;
        this.portafolioDespachadasDS = new MatTableDataSource(this.portafolioDespachadas);
        this.portafolioDespachadasDS.paginator = this.MatPaginatorDespachada;
        this.portafolioDespachadasDS.sort = this.MatSortDespachada;
        this.portafolioPendienteDS = new MatTableDataSource(this.portafolioPendiente);
        this.portafolioPendienteDS.paginator = this.MatPaginatorPendiente;
        this.portafolioPendienteDS.sort = this.MatSortPendiente;

        this.inicioPeriodo = response.inicioPeriodo.substring(8, 10) + '/' + response.inicioPeriodo.substring(5, 7)+ '/' + response.inicioPeriodo.substring(0, 4);
        this.finPeriodo = response.finPeriodo.substring(8, 10) + '/' + response.finPeriodo.substring(5, 7)+ '/' + response.finPeriodo.substring(0, 4); 
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

      this.portafolioMoliendaService.obtenerdatosFacturas(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
        (response: datosFacturas) => {
          this.datosFactura =  response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }); 
  }

  ConsultarAvanceSAP(AvanceSAPModal: any){
    this.listaAvanceSAP = [];
    this.portafolioMoliendaService.buscarAvanceSAPDosed(Number(this.contextmenu.menuData.item)).subscribe(
      (response: listaAvanceSAPDosed[]) => {
        this.listaAvanceSAP =  response;    
        this.modalService.open(AvanceSAPModal,{windowClass : "my-class",centered: true});       
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });    
  }

  CancelarFactura(){
    let fila = this.portafolioDosificadas.filter(tabla => tabla.s234_Codigo == this.contextmenu.menuData.item);

    Swal.fire({
      icon: 'question',
      title: 'Cancelación de Factura',
      html: '¿Esta seguro que desea cancelar la operacion <b>' + fila[0]["s234_Factura"] + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.cancelarOperacionDosificada(Number(this.contextmenu.menuData.item)).subscribe(
          (response: boolean) => {  
            if(response){
              this.obtenerPortafolioDosificadas(); 
              Swal.fire({
                title: 'Cancelación de Factura',
                html: 'Se canceló la operación <b>' + fila[0]["s234_Factura"] + '</b>',
                icon: 'success',
                confirmButtonColor: '#4b822d'
              })
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'Cancelación de Factura',
                text: 'Ocurrió un error en la cancelación de factura.',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              });
            }               
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });  
        }
      });
  }

  DuplicarFactura(){
    let fila = this.portafolioDosificadas.filter(tabla => tabla.s234_Codigo == this.contextmenu.menuData.item);
    
    Swal.fire({
      icon: 'question',
      title: 'Duplicación de Factura',
      html: '¿Desea duplicar la operación <b>' + fila[0]["s234_Factura"] + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.DuplicarDosificada(Number(this.contextmenu.menuData.item)).subscribe(
          (response: boolean) => {  
            if(response){
              this.obtenerPortafolioDosificadas(); 
              Swal.fire({
                title: 'Duplicación de Factura',
                html: 'Se duplicó la operación <b>' + fila[0]["s234_Factura"] + '</b>',
                icon: 'success',
                confirmButtonColor: '#4b822d'
              }) 
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'Duplicación de Factura',
                text: 'Ocurrió un error en la duplicación de factura.',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              });
            }  
          },
          (error: HttpErrorResponse) => {
            if(error.error.message.includes('ConstraintViolationException')){
              this.flgBoton = true;
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'Error de Concurrencia, por favor volver a guardar.',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              });
            }else{
              alert(error.message);
            }
          });  
        }
      });
  }

  obtenerPedidos(PedidosModal: any){
    this.factura = this.contextmenu.menuData.item;
    this.listapedidos = [];
    this.portafolioMoliendaService.buscarPedidosDosificadas(Number(this.contextmenu.menuData.item)).subscribe(
      (response: listaPedidosDosificada[]) => {
        this.listapedidos = response
        this.modalService.open(PedidosModal,{windowClass : "my-class",centered: true});     
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  RegresarDosificada(){
    let fila = this.portafolioDespachadas.filter(tabla => tabla.s234_Codigo == this.contextmenu.menuData.item);

    Swal.fire({
      icon: 'question',
      title: 'Regresar Factura',
      html: '¿Esta seguro que desea pasar a "En Proceso" la factura <b>' + fila[0]["s234_Factura"] + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.RegresarDosificada(Number(this.contextmenu.menuData.item)).subscribe(
          (response: boolean) => {  
            if(response){
              this.obtenerPortafolioDosificadas(); 
              Swal.fire({
                title: 'Regresar Factura',
                html: 'Se regresó a "En Proceso" la factura <b>' + fila[0]["s234_Factura"] + '</b>',
                icon: 'success',
                confirmButtonColor: '#4b822d'
              }) 
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'Regresar Factura',
                text: 'Ocurrió un error en el regreso a "En Proceso".',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              });
            }  
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });  
        }
      });
  }

  ingresarNuevoPedido(){
    this.factura = this.contextmenu.menuData.item;

    (async () => {

      const { value: fruit } = await Swal.fire({
        icon: 'question',
        title: 'Nuevo Pedido',
        html: 'Por favor ingrese el código de pedido de 10 dígitos',
        input: 'number',
        inputPlaceholder: 'Número de Pedido',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#4b822d',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value.length == 10) {
              this.portafolioMoliendaService.listarOrder(Number(this.contextmenu.menuData.item)).subscribe(
                (response: Order[]) => {
                  this.listaOrder = response
                  let order: Order;
                  order = new Order;
                  order.t265_Status = 1;
                  order.t265_SCLAdvance = 0;
                  order.t265_Dosed = Number(this.factura);
                  order.t265_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                  order.t265_DesPedidoSAP = value;
      
                  if(this.listaOrder.filter( element => element.t265_DesPedidoSAP == order.t265_DesPedidoSAP).length > 0 ){
                    Swal.fire({
                      icon: 'question',
                      title: 'Nuevo Pedido',
                      html: '¿El pedido <b>' + order.t265_DesPedidoSAP + '</b> para la factura '+ order.t265_Dosed +' ya existe, aún desea ingresarlo?',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Continuar',
                      reverseButtons: true,
                      confirmButtonColor: '#4b822d'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.portafolioMoliendaService.guardarPedidoDosificada(order).subscribe(
                          data=>{ 
                            this.obtenerPortafolioDosificadas();    
                            Swal.fire({
                              title: 'Nuevo Pedido',
                              html: 'Se ingresó el pedido <b>' + order.t265_DesPedidoSAP + '</b>',
                              icon: 'success',
                              confirmButtonColor: '#4b822d'
                            })           
                          },
                          (error: HttpErrorResponse) => {
                            if(error.error.message.includes('ConstraintViolationException')){
                              this.flgBoton = true;
                              Swal.fire({
                                icon: 'warning',
                                title: 'Aviso',
                                text: 'Error de Concurrencia, por favor volver a guardar.',
                                confirmButtonColor: '#0162e8',
                                customClass: {
                                  container: 'my-swal'
                                }
                              });
                            }else{
                              alert(error.message);
                            }
                          });
                      }
                    })
                  }else{
                    this.portafolioMoliendaService.guardarPedidoDosificada(order).subscribe(
                      data=>{     
                        this.obtenerPortafolioDosificadas();
                        Swal.fire({
                          title: 'Nuevo Pedido',
                          html: 'Se ingresó el pedido <b>' + order.t265_DesPedidoSAP + '</b>',
                          icon: 'success',
                          confirmButtonColor: '#4b822d'
                        })           
                      },
                      (error: HttpErrorResponse) => {
                        if(error.error.message.includes('ConstraintViolationException')){
                          this.flgBoton = true;
                          Swal.fire({
                            icon: 'warning',
                            title: 'Aviso',
                            text: 'Error de Concurrencia, por favor volver a guardar.',
                            confirmButtonColor: '#0162e8',
                            customClass: {
                              container: 'my-swal'
                            }
                          });
                        }else{
                          alert(error.message);
                        }
                      });
                  }  
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
            } else {
              resolve("debe de ingresar 10 dígitos");
            }
          })
        }
      })
      })()
  }

  cancelarPedido(pedido: number){
    
    Swal.fire({
      icon: 'question',
      title: 'Cancelar Pedido',
      html: '¿Desea cancelar el pedido <b>' + pedido + '</b> ?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.cancelarPedidoDosificada(pedido).subscribe(
          data=>{    
            Swal.fire({
              title: 'Cancelar Pedido',
              html: 'Se canceló el pedido <b>' + pedido + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })   
            this.obtenerPortafolioDosificadas();  
            this.factura = this.contextmenu.menuData.item;
            this.listapedidos = [];
            this.portafolioMoliendaService.buscarPedidosDosificadas(Number(this.contextmenu.menuData.item)).subscribe(
              (response: listaPedidosDosificada[]) => {
                this.listapedidos = response   
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });      
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
    })
  }
  ingresarFacturaModal(ingresarFacturaForm: any){
    this.portafolioMoliendaService.flgIngresoFactura = true;
    this.modalService.open(ingresarFacturaForm,{windowClass : "my-class-Facturas",centered: true,backdrop : 'static',keyboard : false});
  }

  ejecutarAvanceSCL(){
    this.loader.show();
    this.flgBoton = false;
    this.portafolioMoliendaService.ejecutarAvanceSCL().subscribe(
      (response: boolean) => {
        this.flgBoton = true;
        this.loader.hide();

        if(response == true){
          this.obtenerPortafolioDosificadas();
          Swal.fire({
            title: 'Avance SCL',
            html: 'Se actualizó el avance SCL',
            icon: 'success',
            confirmButtonColor: '#4b822d'
          })
        }else{
          Swal.fire({
            title: 'Avance SCL',
            html: 'Ocurrió un error al actualizar el avance SCL.',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
        }
           
      },
      (error: HttpErrorResponse) => {
        this.flgBoton = true;
        this.loader.hide();
        alert(error.message);
      });   
  }

  cerrarContrato(){
    this.loader.show();
    this.flgBoton = false;
    if(this.portafolioDosificadas.length !== 0 || this.portafolioPendiente.length !== 0){
      this.loader.hide(); 
      this.flgBoton = true;
      Swal.fire({
        title: 'Cerrar Contrato',
        html: 'Aún no se han despachado todas las facturas',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      return;
    }

    Swal.fire({
      icon: 'question',
      title: 'Cerrar Contrato',
      html: '¿Esta seguro que desea cerrar el contrato <b>' + Number(this.portafolioMoliendaService.codigoContrato) + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.facturarContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
          data=>{ 
            this.flgBoton = true;
            this.loader.hide(); 
            this.portafolioMoliendaService.flgActualizar=true;
            this.modalService.dismissAll(); 
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        }else{
          this.flgBoton = true;
        }
      });

    // this.loader.show();
    // this.loader.hide(); 
  }

  modificarFacturaModal(modificarFacturaForm: any){
    this.portafolioMoliendaService.flgIngresoFactura = false;
    this.portafolioMoliendaService.codigoFactura = Number(this.contextmenu.menuData.item);
    this.modalService.open(modificarFacturaForm,{windowClass : "my-class-Facturas",centered: true,backdrop : 'static',keyboard : false});    
  }

  seleccionarTodoCierre(){
    for (let item of this.portafolioDosificadas){
      item.flgPase = this.seleccionarTodo;
    }

    if(this.seleccionarTodo){
      this.pasaraFacturada = true;
    }else{
      this.pasaraFacturada = false;
    }
  }

  pasarAFacturada(){
    this.loader.show();
       
    const result = this.portafolioDosificadas.filter((obj) => {
      return obj.flgPase === true;
    });
    let listaFacturas: number[] = result.map(d => d.s234_Codigo)
    console.log(listaFacturas);

    this.portafolioMoliendaService.pasaraFacturadaDosedMasiva(listaFacturas).subscribe(
      data=>{ 
        this.obtenerPortafolioDosificadas();
        // this.masterToggle();
        this.selection.clear()
        this.pasaraFacturada = false;
        this.loader.hide();
        Swal.fire({
          title: 'Despachar Facturas',
          html: 'Se pasó a despachada las facturas seleccionadas.',
          icon: 'success',
          confirmButtonColor: '#4b822d'
        })       
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });

  }

  seleccionFactura(row2, event){
    const numSelected = this.selection.selected.length;

    if(event !== undefined){
      let index = this.portafolioDosificadas.findIndex(x => x.s234_Contador == row2.s234_Contador);

      if(index !== undefined){
        // let index = this.portafolioDosificadas.indexOf(updateItem);
        this.portafolioDosificadas[index].flgPase = event.checked;
        // this.portafolioDosificadasDS = new MatTableDataSource(this.portafolioDosificadas);
      }
    }
     
    if(numSelected == 0){
      this.pasaraFacturada = false;

      if(event == undefined){
        for (let item of this.portafolioDosificadas){
          item.flgPase = false;
        }
      }
    }else{
      this.pasaraFacturada = true;

      if(event == undefined){
        for (let item of this.portafolioDosificadas){
          item.flgPase = true;
        }
      }
    }
    // for (let item of this.portafolioDosificadas){
    //   console.log(item.flgPase);
    //   if(item.flgPase){
        
    //     return;
    //   }else{
        
    //   }
    // }
  }

  cerrarModalFactura(modal: any){
    // console.log("Actualizar Portafolio");
    modal.close();
    this.obtenerPortafolioDosificadas();
  }

  applyFilterDosificada(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portafolioDosificadasDS.filter = filterValue.trim().toLowerCase();
  }
  applyFilterDespachada(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portafolioDespachadasDS.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPendiente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portafolioDespachadasDS.filter = filterValue.trim().toLowerCase();
  }

  consultaHistoricaModal(modalConsulta: any){
    this.consultaCliente = '';
    this.consultaContratoVenta = '';
    this.consultaDestino = '';
    this.consultaProducto = '';
    this.consultaPuestoPlanific = '';
    this.flgFechaConsultaHistorica = false;

    this.combosConsultaHistorica = new objInitConsultaHistoricaFactura();

    this.portafolioMoliendaService.obtenerObjetosConsultaHistoricaFactura().subscribe(
      (response: objInitConsultaHistoricaFactura) => {
        this.combosConsultaHistorica = response
        this.modalService.open(modalConsulta,{windowClass : "claseConsulta",centered: true,backdrop : 'static',keyboard : false});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  exportarConsulta(modal: any){
    let fechaInicio = 0;
    let fechaFin = 0;

    if(this.flgFechaConsultaHistorica){
      fechaInicio = Number(this.dateToString(this.fechInicio));
      fechaFin = Number(this.dateToString(this.fechFin));
      if(fechaInicio>fechaFin){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'La fecha de inicio no puede ser mayor a la fecha fin',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
        return;
      }
    }

    this.portafolioMoliendaService.consultaHistoricaFacturas(this.consultaCliente,this.consultaProducto,this.consultaDestino,this.consultaContratoVenta,this.consultaPuestoPlanific, fechaInicio,fechaFin).subscribe(
      (response: consultaHistoricaDosificada[]) => {
        if(response.length > 0 ){
          let consultaHistorica = response; 
          const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(consultaHistorica);
  
          ws['A1'].v = 'Indice';
          ws['B1'].v = 'Código';
          ws['C1'].v = 'Factura';
          ws['D1'].v = 'Inicio Período Dosificación';
          ws['E1'].v = 'Fin Período Dosificación';
          ws['F1'].v = 'Fecha Dosificada';
          ws['G1'].v = 'Toneladas Netas';
          ws['H1'].v = 'Avance SAP';
          ws['I1'].v = 'Avance SCL';
          ws['J1'].v = 'Puesto de Planificación';
          ws['K1'].v = 'Destino';
          ws['L1'].v = 'Cliente';
          ws['M1'].v = 'Producto';
          ws['N1'].v = 'Contrato';
          ws['O1'].v = 'Precio';
          ws['P1'].v = 'Empresa de Transporte';
          ws['Q1'].v = 'Flete';
          ws['R1'].v = 'Fecha envío Trámite';
          ws['S1'].v = 'Fecha entrega Documento';
          ws['T1'].v = 'Comentarios';
          ws['U1'].v = 'Estado';
          ws['V1'].v = 'Pedidos';
          ws['W1'].v = 'Tipo de Carga';
            
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'ConsultaHistorica');
  
          modal.close();
    
          /* save to file */  
          XLSX.writeFile(wb, "ReporteHistoricoFacturas.xlsx");
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No se encontró información',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
        }
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });


  }

  selection = new SelectionModel<ConsultaDosificadas>(true, []);

  isAllSelected() {
    let numSelected: number = this.selection.selected.length;
    let numRows: number = this.portafolioDosificadasDS.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.portafolioDosificadasDS.data.forEach(row => this.selection.select(row));
  }


}