import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/components/loading.service';
import { ClosingPrice } from 'src/app/models/Fisico/ClosingPrice';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { objComprarFuturo } from 'src/app/models/Fisico/Consumo Masivo/objComprarFuturo';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comprar-futuro',
  templateUrl: './comprar-futuro.component.html',
  styleUrls: ['./comprar-futuro.component.scss']
})
export class ComprarFuturoComponent implements OnInit {

  @Output () closecomprarFuturo: EventEmitter<boolean>= new EventEmitter();
  flgBoton: boolean = true;
  fecha: NgbDateStruct;
  compraClosingPrice: ClosingPrice;
  precio: number;
  tickerPrice: string = "USD";
  comentarioFuturo: string = "";

  maxDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() + 5};
  minDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() - 1};

  @Input() objetoInitCompraFuturo:objComprarFuturo;


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

  constructor(private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private libroFisico: LibroFisicoService,
              private loader:LoadingService) { }

  ngOnInit(): void {
    this.compraClosingPrice = new ClosingPrice();
    this.compraClosingPrice = this.objetoInitCompraFuturo.nuevoClosingPrice; 
    this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    if(this.objetoInitCompraFuturo.comboFuturosCM.some(x => x.s204_Description.includes(this.libroFisico.futuroTicker) && x.s204_Description.includes(this.libroFisico.fisicoID.toString()))){
      this.compraClosingPrice.t072_Future = this.objetoInitCompraFuturo.comboFuturosCM.filter(x => x.s204_Description.includes(this.libroFisico.futuroTicker) && x.s204_Description.includes(this.libroFisico.fisicoID.toString()))[0]["s204_ID"];
    }

    this.obtenerTicker();
  }

  cerrarComprarFuturo() {
    this.closeModalComprarFuturo();
  }

  closeModalComprarFuturo(){
    this.closecomprarFuturo.emit(false); 
  }

  guardarCompraFuturo(){
    this.flgBoton = false;

    if(this.precio == undefined || this.compraClosingPrice.t072_VolumeContract == undefined || this.compraClosingPrice.t072_Future == undefined ){
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

    if(this.libroFisico.saldoFuturosComprar < Number(this.compraClosingPrice.t072_VolumeContract) ){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No es posible comprar futuros con caks mayores a '+ this.libroFisico.saldoFuturosComprar +'.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      this.loader.hide();
      this.flgBoton = true;
      return;
    }

    let ticker: string = this.objetoInitCompraFuturo.comboFuturosCM.filter(x => x.s204_ID == this.compraClosingPrice.t072_Future)[0]["s204_Description"];

    if(!this.objetoInitCompraFuturo.comboFuturosCM.some(x => x.s204_Description.includes(ticker) && x.s204_Description.includes(this.libroFisico.futuroTicker))){
      Swal.fire({
        icon: 'question',
        title: 'Aviso',
        html: 'Está Ingresando un futuro con diferente letra al barco, ¿Desea continuar?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
        }).then((result) => {
          if (result.isConfirmed) {
            this.ejecutarIngresoFuturo();
          }else{
            this.flgBoton = true;
            return;
          }
        })
      
    }else{
      this.ejecutarIngresoFuturo();
    }
  }

  ejecutarIngresoFuturo(){
    this.loader.show();
    this.compraClosingPrice.t072_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.compraClosingPrice.t072_Date = this.dateToString(this.fecha);
    let objetoGuardarCompra: objComprarFuturo = new objComprarFuturo();

    objetoGuardarCompra.nuevoClosingPrice = this.compraClosingPrice;
    objetoGuardarCompra.precio = this.precio;
    objetoGuardarCompra.underlyingID = this.libroFisico.subyacente;
    objetoGuardarCompra.comentario = this.comentarioFuturo
    
    this.libroFisico.crearClosingPriceCompra(objetoGuardarCompra).subscribe(
      data=>{
          Swal.fire({
            icon: 'success',
            title: 'Comprar Futuro',
            text: 'La Operación '+ data.t072_ID +' para el Futuro '+data.t072_Future+' fué ingresado correctamente.',
            confirmButtonColor: '#0162e8'
          });
          this.loader.hide();
          this.flgBoton = true;
          this.closeModalComprarFuturo();
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  obtenerTM(){
    if(this.compraClosingPrice.t072_VolumeContract == undefined || this.compraClosingPrice.t072_Future == undefined ){
      return;
    }

    this.libroFisico.transformarContratoXTM(this.compraClosingPrice.t072_VolumeContract, this.compraClosingPrice.t072_Future).subscribe(
      (response: string) => {
        this.compraClosingPrice.t072_MetricTons = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  obtenerTicker(){
    if(this.compraClosingPrice.t072_Future == undefined ){
      return;
    }

    this.libroFisico.obtenerTickerXFuturo(this.compraClosingPrice.t072_Future).subscribe(
      (response: string[]) => {
        this.tickerPrice = response[0];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }
}
