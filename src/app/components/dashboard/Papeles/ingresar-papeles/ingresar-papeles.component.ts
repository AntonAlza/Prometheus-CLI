import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { objHedgePapel } from 'src/app/models/Papeles/HedgePapel';
import { Paper } from 'src/app/models/Papeles/Paper';
import { objInitGestionOPapel } from 'src/app/models/Papeles/objInitGestionOPapel';
import { gestionPapelesService } from 'src/app/shared/services/gestion-papeles.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ingresar-papeles',
  templateUrl: './ingresar-papeles.component.html',
  styleUrls: ['./ingresar-papeles.component.scss']
})
export class IngresarPapelesComponent implements OnInit {

  papelGestion: Paper = new Paper();
  flgIngresarPapel: boolean = true;
  bolsaSelected: number | string;
  flgIndice: boolean = false;

  fechaPapelModificar: Date = new Date();
  fechaDesdeModificar: Date = new Date();
  fechaHastaModificar: Date = new Date();

  fechaPapel: NgbDateStruct;
  fechaDesde: NgbDateStruct;
  fechaHasta: NgbDateStruct;
  maxDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() + 2};
  minDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() - 2};
  flgBoton: boolean = true;
  public checkedHEDGE=false;
  public datohedgepapel: objHedgePapel = crearObjHedgePapelVacio();


  @Input() objForm: objInitGestionOPapel;
  @Input() subyacenteSelected: number;
  @Input() sociedadSelected: number;
  @Output () closegestionPapel: EventEmitter<boolean>= new EventEmitter();
  @Output() papelGuardado: EventEmitter<void> = new EventEmitter<void>(); 
  
  constructor(private gestionPapelesservicio: gestionPapelesService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) { }

  ngOnInit(): void {
    this.flgIngresarPapel = this.objForm.flgIngresarPapel;

    this.papelGestion = this.objForm.papelGestionado;
    this.gestionPapelesservicio.obtenerflagHedgepapel(this.objForm.papelGestionado.t271_ID).subscribe((flag: boolean) => {this.checkedHEDGE = flag});
   

    if(this.flgIngresarPapel == true){
      this.fechaPapel = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
      this.fechaDesde = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
      this.fechaHasta = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};

      if(this.subyacenteSelected == 8){
        this.papelGestion.t271_TypeOfBenchmark = '2'
        this.bolsaSelected  = '18'
        this.obtenerContratos();
        this.papelGestion.t271_Contract = '1758'
      }else if(this.subyacenteSelected == 5){
        this.papelGestion.t271_TypeOfBenchmark = '1'
        this.bolsaSelected  = '1'
        this.obtenerContratos();
      }

    }else{
      this.bolsaSelected = this.objForm.bolsaSeleccionada.toString();
      this.gestionPapelesservicio.obtenerListaContratos(this.subyacenteSelected, Number(this.bolsaSelected)).subscribe(
        (response: cargaCombo[]) => {
          this.objForm.comboContrato = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
      this.papelGestion.t271_MonthContract=this.papelGestion.t271_MonthContract.toString()
      this.papelGestion.t271_Campaign = this.papelGestion.t271_Campaign.toString()
      this.papelGestion.t271_SellBuy = this.papelGestion.t271_SellBuy.toString()
      this.papelGestion.t271_PhysicalSeller = this.papelGestion.t271_PhysicalSeller.toString()
      if(this.papelGestion.t271_Contract != null){
        this.papelGestion.t271_Contract = this.papelGestion.t271_Contract.toString()
      }
      if(this.papelGestion.t271_Index != null){
        this.papelGestion.t271_Index = this.papelGestion.t271_Index.toString()
      }
      this.papelGestion.t271_Country = this.papelGestion.t271_Country.toString()
      this.papelGestion.t271_TypeOfBenchmark = this.papelGestion.t271_TypeOfBenchmark.toString()
      this.papelGestion.t271_Incoterm = this.papelGestion.t271_Incoterm.toString()
      
      this.papelGestion.t271_Date=this.papelGestion.t271_Date.toString().substring(0,4) +'-'+ this.papelGestion.t271_Date.toString().substring(4,6) +'-'+ this.papelGestion.t271_Date.toString().substring(6,8);
      this.papelGestion.t271_DateFrom=this.papelGestion.t271_DateFrom.toString().substring(0,4) +'-'+ this.papelGestion.t271_DateFrom.toString().substring(4,6) +'-'+ this.papelGestion.t271_DateFrom.toString().substring(6,8);
      this.papelGestion.t271_DateUntil=this.papelGestion.t271_DateUntil.toString().substring(0,4) +'-'+ this.papelGestion.t271_DateUntil.toString().substring(4,6) +'-'+ this.papelGestion.t271_DateUntil.toString().substring(6,8);

      this.fechaPapelModificar = new Date(this.papelGestion.t271_Date);
      this.fechaDesdeModificar = new Date(this.papelGestion.t271_DateFrom);
      this.fechaHastaModificar = new Date(this.papelGestion.t271_DateUntil);

      this.fechaPapelModificar.setDate( this.fechaPapelModificar.getDate() + 1 );
      this.fechaDesdeModificar.setDate( this.fechaDesdeModificar.getDate() + 1 );
      this.fechaHastaModificar.setDate( this.fechaHastaModificar.getDate() + 1 );
  
      this.fechaPapel = {day: this.fechaPapelModificar.getDate(),month: this.fechaPapelModificar.getMonth() + 1,year: this.fechaPapelModificar.getFullYear()};
      this.fechaDesde = {day: this.fechaDesdeModificar.getDate(),month: this.fechaDesdeModificar.getMonth() + 1,year: this.fechaDesdeModificar.getFullYear()};
      this.fechaHasta = {day: this.fechaHastaModificar.getDate(),month: this.fechaHastaModificar.getMonth() + 1,year: this.fechaHastaModificar.getFullYear()};
    }

    
    
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

  cerrargestionPapel(){
    this.closegestionPapel.emit(false); 
  }
  validarCampos(paper: Paper): boolean { const camposObligatorios = { 
    't271_SellBuy': 'Compra/Venta', 
    't271_PhysicalSeller': 'Contraparte', 
    't271_Contract':'Contrato',
    't271_Country': 'Origen',
    't271_Index':'Indice',  
    't271_DateFrom': 'Fecha Desde', 
    't271_DateUntil': 'Fecha Hasta', 
    't271_Incoterm': 'Incoterm', 
    't271_Campaign': 'Campaña',
    't271_MonthContract': 'Mes de Cobertura',     
    't271_RegisteredBy': 'Registrado Por', 
    't271_MetricTons': 'Toneladas Métricas', 
    't271_Value': 'Precio', 
     };
     for (const campo in camposObligatorios) { 
      if (paper[campo] === null || paper[campo] === undefined || paper[campo] === '') 
        { Swal.fire({ 
          icon: 'error', 
          title: 'Campo obligatorio vacío', 
          html: `El campo <strong>${camposObligatorios[campo]}</strong> es obligatorio y no puede estar vacío.`, }); 
      return false; } } 
    return true; }
  guardarPapel(){
  
    this.papelGestion.t271_Date = Number(this.dateToString(this.fechaPapel));
    this.papelGestion.t271_Society =  this.sociedadSelected
    this.papelGestion.t271_PapersStatus = 1
    this.papelGestion.t271_DateFrom = Number(this.dateToString(this.fechaDesde));
    this.papelGestion.t271_DateUntil = Number(this.dateToString(this.fechaHasta));
    this.papelGestion.t271_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.papelGestion.t271_Status = 1;

    this.datohedgepapel.t512_IdPapel=this.objForm.papelGestionado.t271_ID;
    this.datohedgepapel.t512_Date=Number(this.dateToString(this.fechaPapel));
    this.datohedgepapel.t512_FlagHedge=this.checkedHEDGE ? 1 : 0;
    this.datohedgepapel.t512_FlagRBD=0;
    this.datohedgepapel.t512_RegisteredBy=this.portafolioMoliendaIFDService.usuario;

    if (this.validarCampos(this.papelGestion)) { // Procede con el guardado si todos los campos obligatorios están llenos 
      console.log('Todos los campos obligatorios están llenos. Procediendo con el guardado.'); // Lógica de guardado aquí... 
      } else { console.log('Existen campos obligatorios vacíos. No se puede proceder con el guardado.');
        return
       }

    this.gestionPapelesservicio.guardarPapel(this.papelGestion).subscribe(
      data=>{console.log(data);
        this.papelGuardado.emit();
      Swal.fire({position: 'center',icon: 'success',title: 'Se guardó exitosamente el papel ' + data.t271_ID.toString() ,
          showConfirmButton: false,timer: 1500,customClass: {container: 'my-swal',}});
          this.gestionPapelesservicio.guardarHedgePapel(this.datohedgepapel).subscribe(data=>{console.log(data)});  
    this.cerrargestionPapel();});   

  }

  modificarPapel(){

    this.papelGestion.t271_Date = Number(this.dateToString(this.fechaPapel));
    this.papelGestion.t271_DateFrom = Number(this.dateToString(this.fechaDesde));
    this.papelGestion.t271_DateUntil = Number(this.dateToString(this.fechaHasta));

    this.datohedgepapel.t512_IdPapel=this.objForm.papelGestionado.t271_ID;
    this.datohedgepapel.t512_Date=Number(this.dateToString(this.fechaPapel));
    this.datohedgepapel.t512_FlagHedge=this.checkedHEDGE ? 1 : 0;
    this.datohedgepapel.t512_FlagRBD=0;
    this.datohedgepapel.t512_RegisteredBy=this.portafolioMoliendaIFDService.usuario;
      
    this.gestionPapelesservicio.modificarPapel(this.papelGestion).subscribe(data=>{
      // this.gestionPapeles._send(this.sociedadSelected,this.subyacenteSelected);
      this.papelGuardado.emit();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se modificó exitosamente el papel ' + data.t271_ID.toString() ,
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            container: 'my-swal',
          }
        });
        this.gestionPapelesservicio.guardarHedgePapel(this.datohedgepapel).subscribe(data1=>{console.log(data1)});
        this.cerrargestionPapel();
      });

  }

  obtenerContratos(){
    this.objForm.comboContrato = []
    this.papelGestion.t271_Contract = null
    this.gestionPapelesservicio.obtenerListaContratos(this.subyacenteSelected, Number(this.bolsaSelected)).subscribe(
      (response: cargaCombo[]) => {
        this.objForm.comboContrato = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cambioOrigen(){
    if(this.papelGestion.t271_Country == 'AR'){
      this.papelGestion.t271_Index = '1'
      this.flgIndice = true;
    }else if(this.papelGestion.t271_Country == 'EU'){
      this.papelGestion.t271_Index = '2'
      this.flgIndice = true;
    }else{
      this.flgIndice = false;
      this.papelGestion.t271_Index = null
    }
  }


}

function crearObjHedgePapelVacio(): objHedgePapel {
  return {
    t512_IdPapel: 0,
    t512_Date: 0,
    t512_FlagHedge: 0,
    t512_FlagRBD: 0,
    t512_RegisteredBy: ''
  };
}