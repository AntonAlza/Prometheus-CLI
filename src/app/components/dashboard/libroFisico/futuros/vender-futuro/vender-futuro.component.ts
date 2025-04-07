import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/components/loading.service';
import { ClosingPrice } from 'src/app/models/Fisico/ClosingPrice';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { objVenderFuturo } from 'src/app/models/Fisico/Consumo Masivo/objVenderFuturos';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vender-futuro',
  templateUrl: './vender-futuro.component.html',
  styleUrls: ['./vender-futuro.component.scss']
})
export class VenderFuturoComponent implements OnInit {

  @Output () closeVenderFuturo: EventEmitter<boolean>= new EventEmitter();
  @Input() objetoInitVentaFuturo:objVenderFuturo;
  flgBoton: boolean = true;
  ventaClosingPrice: ClosingPrice = new ClosingPrice();
  fecha: NgbDateStruct;
  codFisico: number;
  precioCosto: number;
  precioVenta: number;
  pnlVenta: number;
  titulo: string="Vender Futuro";
  comentarioFuturo: string = ""

  totalContratos: number;

  constructor(private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private libroFisico: LibroFisicoService,
              private loader:LoadingService) { }

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
    if(!this.libroFisico.flgIngresoOperacion){
      this.titulo = "Modificar Venta Futuro";
    }
    this.ventaClosingPrice = this.objetoInitVentaFuturo.nuevoClosingPrice;
    this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.codFisico = this.libroFisico.fisicoID
  }

  cerrarVenderFuturo() {
    this.closeModalVenderFuturo();
  }

  closeModalVenderFuturo(){
    this.closeVenderFuturo.emit(false); 
  }

  guardarVentaFuturo(){
    this.flgBoton = false;
    this.loader.show();
    if(this.ventaClosingPrice.t072_Future == undefined || this.precioVenta == undefined || this.ventaClosingPrice.t072_VolumeContract == undefined || this.ventaClosingPrice.t072_VolumeContract == "" ){
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

    if(Number(this.ventaClosingPrice.t072_VolumeContract) > this.totalContratos ){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Sólo se dispone en Stock como Máximo '+ this.totalContratos +' Contratos.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      this.loader.hide();
      this.flgBoton = true;
      return;
    }

    let objetoGuardarVenta: objVenderFuturo = new objVenderFuturo();

    this.ventaClosingPrice.t072_Date = this.dateToString(this.fecha);
    this.ventaClosingPrice.t072_RegisteredBy = this.portafolioMoliendaIFDService.usuario;

    objetoGuardarVenta.nuevoClosingPrice = this.ventaClosingPrice;
    objetoGuardarVenta.precioCosto = this.precioCosto;
    objetoGuardarVenta.precioVenta = this.precioVenta;
    objetoGuardarVenta.pnlVenta = this.pnlVenta;
    objetoGuardarVenta.fisicoID = this.codFisico;
    objetoGuardarVenta.underlyingID = this.libroFisico.subyacente;
    objetoGuardarVenta.comentario = this.comentarioFuturo

    this.libroFisico.guardarVentaFuturo(objetoGuardarVenta).subscribe(
      data=>{
          Swal.fire({
            icon: 'success',
            title: 'Venta de Futuro',
            text: 'Se Realizó la venta de Futuro '+ data.t072_Future +' para el barco '+ this.codFisico +' con precio '+ this.precioVenta +' para '+ data.t072_VolumeContract +' Contratos.',
            confirmButtonColor: '#0162e8'
          });
          this.loader.hide();
          this.closeModalVenderFuturo();
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });


  }

  calcularPNL(){
    this.flgBoton = false;

    if(this.ventaClosingPrice.t072_Future == "" || this.ventaClosingPrice.t072_Future == null || this.libroFisico.fisicoID == null || this.precioVenta == null 
      || this.precioCosto == null || this.ventaClosingPrice.t072_VolumeContract == null){
      this.pnlVenta = 0;
      return;
    }

    this.libroFisico.calcularPNLVentaFuturos(this.ventaClosingPrice.t072_Future, this.libroFisico.fisicoID, this.precioVenta, this.precioCosto, this.ventaClosingPrice.t072_VolumeContract).subscribe(
      (response: number) => {
        this.flgBoton = true;
        this.pnlVenta = response;
      },
      (error: HttpErrorResponse) => {
        this.flgBoton = true;
        alert(error.message);
      });    
  }

  obtenerTM(){
    if(this.ventaClosingPrice.t072_VolumeContract == "" || this.ventaClosingPrice.t072_VolumeContract == null || this.ventaClosingPrice.t072_Future == "" || this.ventaClosingPrice.t072_Future == null){
      this.ventaClosingPrice.t072_MetricTons = "";
      return;
    }

    this.libroFisico.transformarContratoXTM(this.ventaClosingPrice.t072_VolumeContract, this.ventaClosingPrice.t072_Future).subscribe(
      (response: string) => {
        this.ventaClosingPrice.t072_MetricTons = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  obtenerPrecioCosto_TotalContratos(){
    if(this.ventaClosingPrice.t072_Future == "" || this.ventaClosingPrice.t072_Future == null || this.libroFisico.fisicoID == null){
      this.totalContratos=0;
      this.precioCosto=0;
      return;
    }

    this.libroFisico.obtenerTotalContratosYPrecioCosto(this.ventaClosingPrice.t072_Future, this.libroFisico.fisicoID).subscribe(
      (response: number[]) => {
        this.totalContratos = response[0];
        this.precioCosto = response[1];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

}
