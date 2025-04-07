import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { ObjDescargaBarcoCM } from 'src/app/models/Fisico/Consumo Masivo/ObjDescargaBarcoCM';
import { objInitPasarTransito } from 'src/app/models/Fisico/Consumo Masivo/objInitPasarTransito';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { Unloading } from 'src/app/models/Fisico/Unloading';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pasar-transito',
  templateUrl: './pasar-transito.component.html',
  styleUrls: ['./pasar-transito.component.scss']
})
export class PasarTransitoComponent implements OnInit {

  @Input() objInitDescargar: objInitPasarTransito;
  @Output () closeDescarga: EventEmitter<boolean>= new EventEmitter();
  fecha: NgbDateStruct;
  precioFinal: number;
  pasarTransito:boolean = false;
  flgBoton: boolean = true;
  unloadingGuardar: Unloading = new Unloading();
  flgDescargaTransito: boolean;
  tmTransito: number;

  constructor(private libroFisico: LibroFisicoService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private portafolioMoliendaService: PortafolioMoliendaService) { }

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

  ngOnInit(): void {
    this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.flgDescargaTransito = this.libroFisico.flgDescargaBarcoTransito;
    this.tmTransito = this.libroFisico.tmTransito;
    if(!this.flgDescargaTransito){
      
    }
  }

  guardarDescarga(){
    if(this.objInitDescargar.tm == 0 || this.objInitDescargar.tm == undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Pasar a Transito',
        text: 'Por favor, ingrese el número de toneladas metricas.',
        confirmButtonColor: '#0162e8'
      });
      return;
    }
    if(this.objInitDescargar.fisico.t039_Freight == 0){
      Swal.fire({
        icon: 'warning',
        title: 'Pasar a Transito',
        text: 'La Embarcación no puede pasar a Tránsito porque no tiene Flete asignado.',
        confirmButtonColor: '#0162e8'
      });
      return;
    }
    if(this.pasarTransito == true){
      if(this.precioFinal == 0 || this.precioFinal == undefined || this.unloadingGuardar.t115_DownloadSupport == '' || this.unloadingGuardar.t115_DownloadSupport == undefined){
        Swal.fire({
          icon: 'warning',
          title: 'Pasar a Transito',
          text: 'Por favor, completar los campos.',
          confirmButtonColor: '#0162e8'
        });
        return;
      }

      if(this.objInitDescargar.fisico.t039_FlatPrice == 0){
        if(!this.objInitDescargar.flgBasesAsignadas){
          Swal.fire({
            icon: 'warning',
            title: 'Pasar a Transito',
            text: 'La Embarcación no puede pasar a Tránsito porque no tiene Bases asignadas.',
            confirmButtonColor: '#0162e8'
          });
          return;
        }
      }
    }

    let objpasarTransito: ObjDescargaBarcoCM = new ObjDescargaBarcoCM();

    this.unloadingGuardar.t115_Physical = Number(this.objInitDescargar.fisico.t039_ID); 
    this.unloadingGuardar.t115_RegisteredBy = this.portafolioMoliendaIFDService.usuario; 
    this.unloadingGuardar.t115_Date = Number(this.dateToString(this.fecha)); 
    this.unloadingGuardar.t115_MetricTons = this.objInitDescargar.tm; 
    if(this.pasarTransito){
      this.unloadingGuardar.t115_TypeOfDischarge = 2
    }else{
      this.unloadingGuardar.t115_TypeOfDischarge = 1
    }

    objpasarTransito.fisico = this.objInitDescargar.fisico;
    objpasarTransito.precioFinal = this.precioFinal;
    objpasarTransito.unloading = this.unloadingGuardar;

    Swal.fire({
      icon: 'question',
      title: 'Pasar a Transito',
      html: '¿Desea Descargar ' + this.unloadingGuardar.t115_MetricTons + ' TM del Embarque '+ this.unloadingGuardar.t115_Physical +'?' ,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.libroFisico.pasarTransito(objpasarTransito).subscribe(
          data=>{
              this.unloadingGuardar = data.unloading;
              let mensaje: string;
              if(this.pasarTransito){
                mensaje = 'La descarga ' + this.unloadingGuardar.t115_ID + ' para la Embarcación ' + this.unloadingGuardar.t115_Physical + ' fué ingresada correctamente y el Barco pasó a Tránsito.';
              }else{
                mensaje = 'La descarga a Tránsito ' + this.unloadingGuardar.t115_ID + ' para la Embarcación ' + this.unloadingGuardar.t115_Physical + ' fué ingresada correctamente';
              }
              this.flgBoton = true;
              this.closeModalFactura();
              Swal.fire({
                icon: 'success',
                title: 'Pasar a Transito',
                text: mensaje,
                confirmButtonColor: '#0162e8'
              });
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
  }

  obtenerNumContratos(){
    if(this.objInitDescargar.tm == undefined || this.objInitDescargar.fisico.t039_Contract == undefined){
      return;
    }
    this.portafolioMoliendaService.getToneladasContratos(this.objInitDescargar.tm.toString().replace(".", "_"),this.objInitDescargar.fisico.t039_Contract.toString()).subscribe(
      (response: string) => {
        // this.objInitDescargar.numContratos = Math.round(Number(response));
        this.objInitDescargar.numContratos = Number(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  obtenerPrecioFOB(){
    if(this.pasarTransito){
      this.precioFinal = this.libroFisico.fobFijado;
    }else{
      this.precioFinal = 0;
    }
  }

  guardarPasajeInventario(){
    if(this.objInitDescargar.tm == 0 || this.objInitDescargar.tm == undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Pasar a Inventario',
        text: 'Por favor, ingrese el número de toneladas metricas.',
        confirmButtonColor: '#0162e8'
      });
      return;
    }

    if(this.objInitDescargar.tm > this.libroFisico.tmTransito){
      Swal.fire({
        icon: 'warning',
        title: 'Pasar a Inventario',
        text: 'No puede descargar mayor cantidad de '+ this.libroFisico.tmTransito +' TM (TM en Tránsito).',
        confirmButtonColor: '#0162e8'
      });
      return;
    }

    let objpasarTransito: ObjDescargaBarcoCM = new ObjDescargaBarcoCM();

    this.unloadingGuardar.t115_Physical = Number(this.objInitDescargar.fisico.t039_ID); 
    this.unloadingGuardar.t115_RegisteredBy = this.portafolioMoliendaIFDService.usuario; 
    this.unloadingGuardar.t115_Date = Number(this.dateToString(this.fecha)); 
    this.unloadingGuardar.t115_MetricTons = this.objInitDescargar.tm; 

    if(this.objInitDescargar.tm == this.libroFisico.tmTransito){
      this.unloadingGuardar.t115_TypeOfDischarge = 4
    }else{
      this.unloadingGuardar.t115_TypeOfDischarge = 1
    }

    objpasarTransito.fisico = this.objInitDescargar.fisico;
    objpasarTransito.precioFinal = this.precioFinal;
    objpasarTransito.unloading = this.unloadingGuardar;
    objpasarTransito.tmTransito = this.tmTransito;

    Swal.fire({
      icon: 'question',
      title: 'Pasar a Inventario',
      html: '¿Desea Descargar ' + this.unloadingGuardar.t115_MetricTons + ' TM del Embarque '+ this.unloadingGuardar.t115_Physical +'?' ,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.libroFisico.pasarBarcoInventario(objpasarTransito).subscribe(
          data=>{
              this.unloadingGuardar = data.unloading;
              let mensaje: string;
              if(this.unloadingGuardar.t115_MetricTons == this.libroFisico.tmTransito){
                mensaje = 'La descarga ' + this.unloadingGuardar.t115_ID + ' para la Embarcación ' + this.unloadingGuardar.t115_Physical + ' fué ingresada correctamente y el Barco pasó a Inventario.';
              }else{
                mensaje = 'La descarga a Inventario ' + this.unloadingGuardar.t115_ID + ' para la Embarcación ' + this.unloadingGuardar.t115_Physical + ' fué ingresada correctamente';
              }
              this.flgBoton = true;
              this.closeModalFactura();
              Swal.fire({
                icon: 'success',
                title: 'Pasar a Transito',
                text: mensaje,
                confirmButtonColor: '#0162e8'
              });
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
  }

  cerrarDescargaOperacion() {
    this.closeModalFactura();
  }
  closeModalFactura(){
    this.closeDescarga.emit(false); 
  }

}
