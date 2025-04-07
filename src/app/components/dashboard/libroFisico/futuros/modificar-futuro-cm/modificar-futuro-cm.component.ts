import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from 'src/app/components/loading.service';
import { ClosingPrice } from 'src/app/models/Fisico/ClosingPrice';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { ObjModificarFuturo } from 'src/app/models/Fisico/Consumo Masivo/objModificarFuturo';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-futuro-cm',
  templateUrl: './modificar-futuro-cm.component.html',
  styleUrls: ['./modificar-futuro-cm.component.scss']
})
export class ModificarFuturoCMComponent implements OnInit {

  @Input() objetoInitModificarFuturo:ObjModificarFuturo;
  @Output () cerrarModificarFuturo: EventEmitter<boolean>= new EventEmitter();
  closingPrice: ClosingPrice;
  ticker: string;
  currencyMeasure: number;  
  flgBoton: boolean = true;
  numeroContratosInicial: number;
  comentarioFuturo: string="";

  constructor(private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private libroFisico: LibroFisicoService,
              private loader:LoadingService) { }

  ngOnInit(): void {
    this.closingPrice = this.objetoInitModificarFuturo.closingPrice;
    this.ticker = this.objetoInitModificarFuturo.ticker;
    this.currencyMeasure = this.objetoInitModificarFuturo.currencyMeasure;
    this.numeroContratosInicial = Number(this.closingPrice.t072_VolumeContract);
    this.closingPrice.t072_FutureUSD = this.objetoInitModificarFuturo.precioFuturo.toString();
    this.comentarioFuturo = this.objetoInitModificarFuturo.comentario;
  }

  cerrarModificacionFuturo() {
    this.closeModalModificarFuturo();
  }

  closeModalModificarFuturo(){
    this.cerrarModificarFuturo.emit(false); 
  }

  guardarModificacionFuturo(){
    this.flgBoton = false;
    this.loader.show();
    if(this.objetoInitModificarFuturo.ventaEnlazada){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'La operación de Compra tiene enlazada una Venta, no se puede realizar la modificación.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      this.loader.hide();
      this.flgBoton = true;
      return;
    }

    if(this.closingPrice.t072_FutureUSD == "" || this.closingPrice.t072_FutureUSD == undefined || this.closingPrice.t072_VolumeContract == "" || this.closingPrice.t072_VolumeContract == undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar los datos.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      this.loader.hide();
      this.flgBoton = true;
      return;
    }

    this.closingPrice.t072_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
    
    if(Number(this.closingPrice.t072_VolumeContract) < this.numeroContratosInicial){
      let saldo: number = this.numeroContratosInicial - Number(this.closingPrice.t072_VolumeContract);
      this.libroFisico.validarDisminucionPrice(Number(this.closingPrice.t072_Future), saldo).subscribe(
        (response: boolean) => {
          if(!response){
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'No se puede Modificar la cantidad de Contratos porque descuadraría el valor Asignado a Barcos.',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            });
            this.loader.hide();
            this.flgBoton = true;
            return;
          }

          Swal.fire({
            icon: 'question',
            title: 'Modificar Futuro',
            html: '¿Desea modificar el Futuro ' + this.closingPrice.t072_ID + '?' ,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            reverseButtons: true,
            confirmButtonColor: '#4b822d'
          }).then((result) => {
            if (result.isConfirmed) {
              let objModificacion: ObjModificarFuturo = new ObjModificarFuturo();
              objModificacion.closingPrice = this.closingPrice;
              objModificacion.underlyingID = this.libroFisico.subyacente;
              objModificacion.comentario = this.comentarioFuturo;
              this.libroFisico.modificarFuturo(objModificacion).subscribe(
                data=>{
                    Swal.fire({
                      icon: 'success',
                      title: 'Modificar Futuro',
                      text: 'Se modificó el futuro '+ this.closingPrice.t072_ID +'.',
                      confirmButtonColor: '#0162e8'
                    });
                    this.loader.hide();
                    this.flgBoton = true;
                    this.closeModalModificarFuturo();
                },
                (error: HttpErrorResponse) => {
                  this.loader.hide();
                  this.flgBoton = true;
                  alert(error.message);
                });
            }
            this.loader.hide();
          })

        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      Swal.fire({
        icon: 'question',
        title: 'Modificar Futuro',
        html: '¿Desea modificar el Futuro ' + this.closingPrice.t072_ID + '?' ,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
      }).then((result) => {
        if (result.isConfirmed) {
          let objModificacion: ObjModificarFuturo = new ObjModificarFuturo();
          objModificacion.closingPrice = this.closingPrice;
          objModificacion.underlyingID = this.libroFisico.subyacente;
          objModificacion.comentario = this.comentarioFuturo;
          this.libroFisico.modificarFuturo(objModificacion).subscribe(
            data=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modificar Futuro',
                  text: 'Se modificó el futuro '+ this.closingPrice.t072_ID +'.',
                  confirmButtonColor: '#0162e8'
                });
                this.loader.hide();
                this.flgBoton = true;
                this.closeModalModificarFuturo();
            },
            (error: HttpErrorResponse) => {
              this.loader.hide();
              this.flgBoton = true;
              alert(error.message);
            });
        }
      })
    }
    
  }

  obtenerTM(){
    if(this.closingPrice.t072_VolumeContract == "" || this.closingPrice.t072_VolumeContract == null || this.closingPrice.t072_Future == ""){
      this.closingPrice.t072_MetricTons = "";
      return;
    }

    this.libroFisico.transformarContratoXTM(this.closingPrice.t072_VolumeContract, this.closingPrice.t072_Future).subscribe(
      (response: string) => {
        this.closingPrice.t072_MetricTons = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

}
