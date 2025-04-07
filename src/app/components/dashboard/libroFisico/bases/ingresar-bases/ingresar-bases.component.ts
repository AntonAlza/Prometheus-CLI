import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ClosingBasis } from 'src/app/models/Fisico/ClosingBasis';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { objGuardarBase } from 'src/app/models/Fisico/Consumo Masivo/objGuardarBase';
import { objInitBase } from 'src/app/models/Fisico/Consumo Masivo/objInitBase';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar-bases',
  templateUrl: './ingresar-bases.component.html',
  styleUrls: ['./ingresar-bases.component.scss']
})
export class IngresarBasesComponent implements OnInit {

  flgIngresar: boolean = true;
  baseGuardar: ClosingBasis;
  fecha: NgbDateStruct ;
  flgBoton: boolean = true;
  comentarioBase: string = "";

  tolerancia: number;

  fechaModificar: Date = new Date();

  @Input() objInitIngresoBase: objInitBase;
  @Output () closeAgregarBase: EventEmitter<boolean>= new EventEmitter();
  
  constructor(private libroFisico: LibroFisicoService,
    private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    this.baseGuardar = new ClosingBasis();
    this.flgIngresar = this.libroFisico.flgIngresoBase;
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

  obtenerNumContrato(){
    if(this.baseGuardar.t095_MetricTons == undefined || this.baseGuardar.t095_Contract == undefined ){
      return;
    }

    this.libroFisico.transformarToneladasxContrato(this.baseGuardar.t095_MetricTons.toString().replace(".", "_"),this.baseGuardar.t095_Contract.toString()).subscribe(
      (response: string) => {
        this.baseGuardar.t095_VolumeContract = Math.round(Number(response)).toString();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  guardarBase(){

    if( this.baseGuardar.t095_MetricTons == undefined || this.baseGuardar.t095_MetricTons == '0' || this.baseGuardar.t095_BaseUSD == undefined || this.baseGuardar.t095_Contract == undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Modificar Base',
        text: 'Por favor, completar los datos.',
        confirmButtonColor: '#0162e8'
      });
      return;
    }

    if( Number(this.baseGuardar.t095_MetricTons) > this.objInitIngresoBase.saldo){
      Swal.fire({
        icon: 'warning',
        title: 'Modificar Base',
        text: 'No puede comprar mayor cantidad de ' + this.objInitIngresoBase.saldo + ' TM (Saldo de Bases).',
        confirmButtonColor: '#0162e8'
      });
      return;
    }

    this.flgBoton = false;
    this.baseGuardar.t095_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.baseGuardar.t095_Date = this.dateToString(this.fecha);
    let objBases: objGuardarBase = new objGuardarBase();

    objBases.closingBasis = this.baseGuardar;
    objBases.commentario = this.comentarioBase;

    this.libroFisico.guardarBase(objBases).subscribe(
      data=>{
          this.flgBoton = true;
          this.closeModalFactura();
          Swal.fire({
            icon: 'success',
            title: 'Guardar Base',
            text: 'Se guardó la Base ' + this.baseGuardar.t095_ID + ' con exito.',
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

  modificarBase(){
    if( this.baseGuardar.t095_MetricTons == undefined || this.baseGuardar.t095_MetricTons == '0' || this.baseGuardar.t095_BaseUSD == undefined || this.baseGuardar.t095_Contract == undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Modificar Base',
        text: 'Por favor, completar los datos.',
        confirmButtonColor: '#0162e8'
      });
      return;
    }

    if( Number(this.baseGuardar.t095_MetricTons) > this.objInitIngresoBase.saldo){
      Swal.fire({
        icon: 'warning',
        title: 'Modificar Base',
        text: 'No puede comprar mayor cantidad de ' + this.objInitIngresoBase.saldo + ' TM (Saldo de Bases).',
        confirmButtonColor: '#0162e8'
      });
      return;
    }
    this.baseGuardar.t095_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
    this.baseGuardar.t095_Date = this.dateToString(this.fecha);
    Swal.fire({
      icon: 'question',
      title: 'Modificar Base',
      html: '¿Desea modificar la Base ' + this.baseGuardar.t095_ID + '?' ,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {

        let objBases: objGuardarBase = new objGuardarBase();

        objBases.closingBasis = this.baseGuardar;
        objBases.commentario = this.comentarioBase;

        this.libroFisico.modificarBase(objBases).subscribe(
          data=>{
              this.flgBoton = true;
              this.closeModalFactura();
              Swal.fire({
                icon: 'success',
                title: 'Modificar Base',
                text: 'Se modificó la Base ' + this.baseGuardar.t095_ID + ' con exito.',
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

  ngOnInit(): void {
    if(this.flgIngresar){
      this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
      this.baseGuardar.t095_Physical = this.objInitIngresoBase.codFisico.toString();
      this.baseGuardar.t095_ID = this.objInitIngresoBase.nuevoID;
      this.baseGuardar.t095_Contract = this.objInitIngresoBase.comboContrato.filter(x => x.s204_Description == this.libroFisico.contrato)[0]["s204_ID"]
    }else{
      this.baseGuardar = this.objInitIngresoBase.baseModificar;
      this.comentarioBase = this.objInitIngresoBase.comentario;
      this.baseGuardar.t095_Contract = this.baseGuardar.t095_Contract.toString();

      this.baseGuardar.t095_Date=this.baseGuardar.t095_Date.toString().substring(0,4) +'-'+ this.baseGuardar.t095_Date.toString().substring(4,6) +'-'+ this.baseGuardar.t095_Date.toString().substring(6,8);
      this.fechaModificar = new Date(this.baseGuardar.t095_Date);
      this.fechaModificar.setDate( this.fechaModificar.getDate() + 1 );
      this.fecha = {day: this.fechaModificar.getDate(),month: this.fechaModificar.getMonth() + 1,year: this.fechaModificar.getFullYear()};
    }
    
  }

  cerrargestionOperacion() {
    this.closeModalFactura();
  }
  closeModalFactura(){
    this.closeAgregarBase.emit(false); 
  }

  

}
