import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { objFactorPapel } from 'src/app/models/Papeles/FactorPapel';
import { PaperClearance } from 'src/app/models/Papeles/PaperClearance';
import { objLiquidarPapel } from 'src/app/models/Papeles/objLiquidarPapel';
import { gestionPapelesService } from 'src/app/shared/services/gestion-papeles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liquidar-papeles',
  templateUrl: './liquidar-papeles.component.html',
  styleUrls: ['./liquidar-papeles.component.scss']
})
export class LiquidarPapelesComponent implements OnInit {

  papelLiquidar: PaperClearance = new PaperClearance()
  @Output () closeLiquidarPapel: EventEmitter<boolean>= new EventEmitter();
  flgBoton: boolean = true;
  maxDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() + 2};
  minDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() - 2};
  fechaLiquidacion: NgbDateStruct;
  operacion: string;
  sociedadSelected: number;
  subyacenteSelected: number;
  datofactor:number;
  datopricevalue:number;

  @Input() objLiquidar: objLiquidarPapel;
  @Output() papelGuardado: EventEmitter<void> = new EventEmitter<void>(); 
  
  constructor(private gestionPapelesservicio: gestionPapelesService,
    private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) { }

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
    this.papelLiquidar.t275_ID = this.objLiquidar.paperClearance.t275_ID;

    this.papelLiquidar.t275_Paper = this.objLiquidar.paper.t271_ID;
  
    if(this.objLiquidar.paper.t271_SellBuy == 1){
      this.operacion = "Venta"
      this.papelLiquidar.t275_SellBuy=2
    }else{
      this.operacion = "Compra"
      this.papelLiquidar.t275_SellBuy=1
    }
    console.log(this.operacion)
    this.fechaLiquidacion = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.sociedadSelected = this.objLiquidar.sociedad;
    this.subyacenteSelected = this.objLiquidar.subyacente;
    this.papelLiquidar.t275_MetricTons=this.objLiquidar.saldoLiquidar
    this.papelLiquidar.t275_Value=this.objLiquidar.paper.t271_Value
    this.papelLiquidar.t275_ProfitOrLoss=this.papelLiquidar.t275_Value-this.objLiquidar.paper.t271_Value
  
    this.gestionPapelesservicio.obtenerdatoFactor(this.subyacenteSelected).subscribe((response:objFactorPapel)=>{this.datofactor=response.t135_FactorMetricTonPrice;console.log(this.datofactor)});
   
  }


  cerrarLiquidarPapel(){
    this.closeLiquidarPapel.emit(false); 
  }
  calcularProfitOrLoss() {
    const { t275_MetricTons, t275_Value } = this.papelLiquidar;
    if(this.objLiquidar.paper.t271_SellBuy == 1){
      this.papelLiquidar.t275_ProfitOrLoss =parseFloat(((t275_Value-this.objLiquidar.paper.t271_Value)*this.datofactor*t275_MetricTons).toFixed(3));
    }else{
      this.papelLiquidar.t275_ProfitOrLoss =parseFloat(((this.objLiquidar.paper.t271_Value-t275_Value)*this.datofactor*t275_MetricTons).toFixed(3));
    }
   ;
  }

  liquidarPapel(){
    this.papelLiquidar.t275_Date = Number(this.dateToString(this.fechaLiquidacion));
    this.papelLiquidar.t275_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.papelLiquidar.t275_CostPrice = this.objLiquidar.paper.t271_Value;

    if( this.objLiquidar.saldoLiquidar < this.papelLiquidar.t275_MetricTons){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Excede a ' + this.objLiquidar.saldoLiquidar.toString() + ' TM.',
        confirmButtonColor: '#0162e8',
        customClass: { container: 'my-swal' }
      })
      return;
    };
    console.log(this.papelLiquidar)
    this.gestionPapelesservicio.guardarLiquidacion(this.papelLiquidar).subscribe(
      data=>{
        this.papelGuardado.emit();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ingresó la liquidación ' +data.t275_ID.toString() ,
          showConfirmButton: false,
          timer: 1500,
          customClass: {container: 'my-swal',}
        }); 
        this.cerrarLiquidarPapel();
      });
  }
  

}