import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DateOfShipmentToProcess } from 'src/app/models/Fisico/DateOfShipmentToProcess';
import { DocumentDeliveryDateToCarriers } from 'src/app/models/Fisico/DocumentDeliveryDateToCarriers';
import { Dosed } from 'src/app/models/Fisico/Dosed';
import { objIngresarFactura } from 'src/app/models/Fisico/objIngresarFactura';
import { objInitIngresarFactura } from 'src/app/models/Fisico/objInitIngresarFactura';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { Truck } from 'src/app/models/Fisico/Truck';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar-factura',
  templateUrl: './ingresar-factura.component.html',
  styleUrls: ['./ingresar-factura.component.scss']
})
export class IngresarFacturaComponent implements OnInit {
  public flgIngresarFactura: boolean = true;
  public dosed: Dosed;
  public ingresarFacturaOBJ: objInitIngresarFactura;
  public objIngresoFactura: objIngresarFactura;
  public dateOfShipmentToProcess: DateOfShipmentToProcess;
  public documentDeliveryDateToCarriers: DocumentDeliveryDateToCarriers;
  public flgAgregarEmpresa: boolean = false;
  public txtNuevaEmpresa: string = "";
  public flgBoton: boolean = true;
  
  fecha: NgbDateStruct;
  fechaEnvioTramite: NgbDateStruct ;
  fechaEntregaDocumentoTransportista: NgbDateStruct ;

  fechaModificar: Date = new Date();
  fechaEnvioTramiteModificar: Date = new Date();
  fechaEntregaDocumentoTransportistaModificar: Date = new Date();
  
  @Output () closeIngresoFactura: EventEmitter<boolean>= new EventEmitter();
  
  constructor(private modalService: NgbModal, private portafolioMoliendaService: PortafolioMoliendaService, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.closeIngresoFactura = new EventEmitter<boolean>();
    this.objIngresoFactura = new objIngresarFactura();
    this.dosed = new Dosed();
    if(this.portafolioMoliendaService.flgIngresoFactura){
      this.ingresarFacturaModal();
    }else{
      this.modificarFacturaModal();
    }
   }

  ngOnInit(): void {
    
    
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

  cerrarIngresoFactura() {
    // this.closeIngresoFactura.closed();
    this.closeModalFactura();
    // this.modalService.dismissAll();
  }
  closeModalFactura(){
    console.log("Emite Factura cerrado");
    this.closeIngresoFactura.emit(false); 
  }

  ingresarFactura(){
    this.flgBoton = false;
    if(this.dosed.t260_Plant == undefined || this.dosed.t260_Loading == undefined || this.dosed.t260_Truck == undefined || this.dosed.t260_NetTons == undefined || this.dosed.t260_SAPAdvance == undefined){ // Confirmar las validaciones
        this.flgBoton = true;
        Swal.fire({
        title: 'Ingresar Factura',
        html: 'Es necesario completar los campos',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      return;
    }
    this.objIngresoFactura = new objIngresarFactura();
    let dateOfShipmentToProcess = new DateOfShipmentToProcess();
    let documentDeliveryDateToCarriers = new DocumentDeliveryDateToCarriers();

    this.dosed.t260_Date = this.dateToString(this.fecha);
    dateOfShipmentToProcess.t269_Date = this.dateToString(this.fechaEnvioTramite);
    documentDeliveryDateToCarriers.t270_Date = this.dateToString(this.fechaEntregaDocumentoTransportista);

    this.objIngresoFactura.dosed = this.dosed;
    this.objIngresoFactura.dateOfShipmentToProcess = dateOfShipmentToProcess;
    this.objIngresoFactura.documentDeliveryDateToCarriers = documentDeliveryDateToCarriers;

    this.portafolioMoliendaService.validarFactura(Number(this.dosed.t260_DosingCode),this.dosed.t260_ID,1).subscribe(
      (response: string[]) => {
        if(response.length == 0){
          this.portafolioMoliendaService.ingresarFactura(this.objIngresoFactura).subscribe(
            data=>{ 
              this.closeModalFactura();   // Actualizar
              if(data !== 1){
                (async () => {
                  const {} = await Swal.fire({
                    title: 'Ingresar Factura',
                    html: 'Se esta excediendo en TM programadas, actualmente cuenta con un saldo de <b>' + data + '</b>',
                    icon: 'warning',
                    confirmButtonColor: '#4b822d'
                  })
                  Swal.fire({
                    title: 'Ingresar Factura',
                    html: 'Se ingresó la factura <b>' + this.objIngresoFactura.dosed.t260_DosingCode + '</b>',
                    icon: 'success',
                    confirmButtonColor: '#4b822d'
                  })   
                  })()
              }else{
                Swal.fire({
                  title: 'Ingresar Factura',
                  html: 'Se ingresó la factura <b>' + this.objIngresoFactura.dosed.t260_DosingCode + '</b>',
                  icon: 'success',
                  confirmButtonColor: '#4b822d'
                }) 
              }        
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });          
        }else{
          this.flgBoton = true;
          Swal.fire({
            title: 'Modificar Factura',
            html: 'La factura <b>' + this.dosed.t260_DosingCode + '</b> ya existe',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
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

  modificarFactura(){
    this.flgBoton = false;
    if(this.dosed.t260_Plant == undefined || this.dosed.t260_Loading == undefined || this.dosed.t260_Truck == undefined || this.dosed.t260_NetTons == undefined || this.dosed.t260_SAPAdvance == undefined){ // Confirmar las validaciones
      this.flgBoton = true;
      Swal.fire({
        title: 'Modificar Factura',
        html: 'Es necesario completar los campos',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      return;
    }

    this.objIngresoFactura = new objIngresarFactura();
    let dateOfShipmentToProcess = new DateOfShipmentToProcess();
    let documentDeliveryDateToCarriers = new DocumentDeliveryDateToCarriers();

    this.dosed.t260_Date = this.dateToString(this.fecha);
    dateOfShipmentToProcess.t269_Date = this.dateToString(this.fechaEnvioTramite);
    documentDeliveryDateToCarriers.t270_Date = this.dateToString(this.fechaEntregaDocumentoTransportista);

    this.objIngresoFactura.dosed = this.dosed;
    this.objIngresoFactura.dateOfShipmentToProcess = dateOfShipmentToProcess;
    this.objIngresoFactura.documentDeliveryDateToCarriers = documentDeliveryDateToCarriers;
    this.portafolioMoliendaService.validarFactura(Number(this.dosed.t260_DosingCode),this.dosed.t260_ID,2).subscribe(
      (response: string[]) => {
        if(response.length == 0){
          this.portafolioMoliendaService.guardarModificacionFactura(this.objIngresoFactura).subscribe(
            data=>{ 
              this.closeModalFactura();    // Actualizar
              if(data !== 1){
                (async () => {
                  const {} = await Swal.fire({
                    title: 'Modificar Factura',
                    html: 'Se esta excediendo en TM programadas, actualmente cuenta con un saldo de <b>' + data + '</b>',
                    icon: 'warning',
                    confirmButtonColor: '#4b822d'
                  })
                  Swal.fire({
                    title: 'Modificar Factura',
                    html: 'Se modificó la factura <b>' + this.objIngresoFactura.dosed.t260_DosingCode + '</b>',
                    icon: 'success',
                    confirmButtonColor: '#4b822d'
                  })   
                  })()
      
              }else{
                Swal.fire({
                  title: 'Modificar Factura',
                  html: 'Se modificó la factura <b>' + this.objIngresoFactura.dosed.t260_DosingCode + '</b>',
                  icon: 'success',
                  confirmButtonColor: '#4b822d'
                }) 
              }        
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.flgBoton = true;
          Swal.fire({
            title: 'Modificar Factura',
            html: 'La factura <b>' + this.dosed.t260_DosingCode + '</b> ya existe',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
        }     
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }); 

    
  }

  modificarFacturaModal(){
    this.flgIngresarFactura = false;
    this.ingresarFacturaOBJ = new objInitIngresarFactura();
    this.dateOfShipmentToProcess = new DateOfShipmentToProcess();
    this.documentDeliveryDateToCarriers = new DocumentDeliveryDateToCarriers();

    this.portafolioMoliendaService.obtenerObjetosIngresarFactura().subscribe(
      (response: objInitIngresarFactura) => {
        this.ingresarFacturaOBJ = response

        this.portafolioMoliendaService.obtenerDatosModificarFactura(this.portafolioMoliendaService.codigoFactura).subscribe(
          (response: objIngresarFactura) => {

            this.dosed = response.dosed;
            this.dateOfShipmentToProcess = response.dateOfShipmentToProcess;
            this.documentDeliveryDateToCarriers = response.documentDeliveryDateToCarriers;
            if(this.dosed.t260_DosedStatus == '1'){
              const index = 2//this.ingresarFacturaOBJ.comboDosedStatus.indexOf(1, 0);
              if (index > -1) {
                this.ingresarFacturaOBJ.comboDosedStatus.splice(index, 1);
               }
            }else if(this.dosed.t260_DosedStatus == '3'){
              const index = 0 //this.ingresarFacturaOBJ.comboDosedStatus.indexOf(1, 0);
              if (index > -1) {
                this.ingresarFacturaOBJ.comboDosedStatus.splice(index, 1);
             }
            }

            this.dosed.t260_Date=this.dosed.t260_Date.toString().substring(0,4) +'-'+ this.dosed.t260_Date.toString().substring(4,6) +'-'+ this.dosed.t260_Date.toString().substring(6,8);
            this.fechaModificar = new Date(this.dosed.t260_Date);
            this.fechaModificar.setDate( this.fechaModificar.getDate() + 1 );
            this.fecha = {day: this.fechaModificar.getDate(),month: this.fechaModificar.getMonth() + 1,year: this.fechaModificar.getFullYear()};

            if(this.dateOfShipmentToProcess !== null){
              this.dateOfShipmentToProcess.t269_Date=this.dateOfShipmentToProcess.t269_Date.toString().substring(0,4) +'-'+ this.dateOfShipmentToProcess.t269_Date.toString().substring(4,6) +'-'+ this.dateOfShipmentToProcess.t269_Date.toString().substring(6,8);
              this.fechaEnvioTramiteModificar = new Date(this.dateOfShipmentToProcess.t269_Date);
              this.fechaEnvioTramiteModificar.setDate( this.fechaEnvioTramiteModificar.getDate() + 1 );
              this.fechaEnvioTramite = {day: this.fechaEnvioTramiteModificar.getDate(),month: this.fechaEnvioTramiteModificar.getMonth() + 1,year: this.fechaEnvioTramiteModificar.getFullYear()};
            }else{
              this.fechaEnvioTramite = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};                            
            }
            if(this.documentDeliveryDateToCarriers !== null){
              this.documentDeliveryDateToCarriers.t270_Date=this.documentDeliveryDateToCarriers.t270_Date.toString().substring(0,4) +'-'+ this.documentDeliveryDateToCarriers.t270_Date.toString().substring(4,6) +'-'+ this.documentDeliveryDateToCarriers.t270_Date.toString().substring(6,8);
              this.fechaEntregaDocumentoTransportistaModificar = new Date(this.documentDeliveryDateToCarriers.t270_Date);
              this.fechaEntregaDocumentoTransportistaModificar.setDate( this.fechaEntregaDocumentoTransportistaModificar.getDate() + 1 );
              this.fechaEntregaDocumentoTransportista = {day: this.fechaEntregaDocumentoTransportistaModificar.getDate(),month: this.fechaEntregaDocumentoTransportistaModificar.getMonth() + 1,year: this.fechaEntregaDocumentoTransportistaModificar.getFullYear()};
            }else{
              this.fechaEntregaDocumentoTransportista = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
            }
    
            this.dosed.t260_Loading = this.dosed.t260_Loading.toString();
            this.dosed.t260_Truck = this.dosed.t260_Truck.toString();
            this.dosed.t260_Plant = this.dosed.t260_Plant.toString();
            this.dosed.t260_DosedStatus = this.dosed.t260_DosedStatus.toString();

        
            if(!this.portafolioMoliendaService.flgEstadoPortafolio){
              // Swal.fire({
              //   icon: 'warning',
              //   title: 'Cancelación de Factura',
              //   text: 'Ocurrió un error en la cancelación de factura.',
              //   confirmButtonColor: '#0162e8',
              //   customClass: {
              //     container: 'my-swal'
              //   }
              // });
              //return;
            }
            // this.modalService.open(modificarFacturaForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
            
    
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }); 
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }); 
    
  }

  ingresarFacturaModal(){
    this.flgIngresarFactura = true;
    this.dosed = new Dosed();
    this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.fechaEnvioTramite = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.fechaEntregaDocumentoTransportista = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};

    this.portafolioMoliendaService.obtenerObjetosIngresarFactura().subscribe(
      (response: objInitIngresarFactura) => {
        this.ingresarFacturaOBJ = response
        this.dosed.t260_ID = this.ingresarFacturaOBJ.codigoPedido;
        this.dosed.t260_DosingCode = this.ingresarFacturaOBJ.codigoDosed.toString();
        this.dosed.t260_DosedStatus = "1" ;
        this.dosed.t260_SAPAdvance = 0;
        this.dosed.t260_SCLAdvance = 0;
        this.dosed.t260_Status = 1;
        this.dosed.t260_SalesContract = Number(this.portafolioMoliendaService.codigoContrato);
        this.dosed.t260_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
        
        const index = 0
        if (index > -1) {
          this.ingresarFacturaOBJ.comboDosedStatus.splice(index, 1);
        }
        
        if(!this.portafolioMoliendaService.flgEstadoPortafolio){
          // Swal.fire({
          //   icon: 'warning',
          //   title: 'Cancelación de Factura',
          //   text: 'Ocurrió un error en la cancelación de factura.',
          //   confirmButtonColor: '#0162e8',
          //   customClass: {
          //     container: 'my-swal'
          //   }
          // });
          // return;
        }
        // this.modalService.open(ingresarFacturaForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });   
  }

  guardarNuevaEmpresa(){
    if(this.txtNuevaEmpresa == ""){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar el nombre de la empresa',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    let nuevaEmpresa: Truck = new Truck;

    this.txtNuevaEmpresa = this.txtNuevaEmpresa.toUpperCase();

    nuevaEmpresa.t263_Description = this.txtNuevaEmpresa;
    nuevaEmpresa.t263_Status = 1;
    // nuevaEmpresa.t263_Society = 17;
    nuevaEmpresa.t263_Society = 21;
    
    Swal.fire({
      icon: 'warning',
      title: 'Consulta',
      html: '¿Desea ingresar la nueva empresa de transporte <b>' + this.txtNuevaEmpresa + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.guardarEmpresaTransporte(nuevaEmpresa).subscribe(
          (response: Truck) => {
            nuevaEmpresa = response;
            this.portafolioMoliendaService.obtenerObjetosIngresarFactura().subscribe(
              (response: objInitIngresarFactura) => {
                this.ingresarFacturaOBJ = response;
                this.dosed.t260_Truck = nuevaEmpresa.t263_ID.toString();
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });  
            Swal.fire({
              title: 'Empresa Agregada',
              html: 'Se guardó correctamente la empresa <b>' + nuevaEmpresa.t263_Description + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
          },
          (error: HttpErrorResponse) => {
            if(error.error.message.includes('ConstraintViolationException')){
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
    this.flgAgregarEmpresa = false;
  }

}