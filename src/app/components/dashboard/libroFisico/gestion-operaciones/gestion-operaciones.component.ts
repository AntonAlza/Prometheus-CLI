import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild,Input } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnimalNutrition } from 'src/app/models/Fisico/AnimalNutrition';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { objIngresarOperacion } from 'src/app/models/Fisico/Consumo Masivo/objIngresarOperacion';
import { objInitGestionOperacion } from 'src/app/models/Fisico/Consumo Masivo/objInitGestionOperacion';
import { Physical } from 'src/app/models/Fisico/Physical';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { Shipment } from 'src/app/models/Fisico/Shipment';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';
import { ventasMoliendaComponent } from '../../ventasMolienda/ventasMolienda.component';
import { libroFisicoComponent } from '../libroFisico.component';
import { HumanConsumption } from 'src/app/models/Fisico/Consumo Masivo/HumanConsumption';

@Component({
  selector: 'app-gestion-operaciones',
  templateUrl: './gestion-operaciones.component.html',
  styleUrls: ['./gestion-operaciones.component.scss']
})
export class GestionOperacionesComponent implements OnInit {

  flgIngresarOperacion: boolean = true;
  @Input() objForm: objInitGestionOperacion;
  nuevoFisico: Physical;
  nutricionAnimal: AnimalNutrition;
  consumoHumano: HumanConsumption;
  objetoRegistro: objIngresarOperacion;
  fecha: NgbDateStruct;
  fechaIniCarga: NgbDateStruct;
  fechaFinCarga: NgbDateStruct;
  fechaLlegada: NgbDateStruct;
  txtNumeroDeContratos: number;
  bolsa?: string;
  flgBoton: boolean = true;
  flgFlat: boolean = false;
  flgBolsaFlat: boolean = false;
  flgNutricionAnimal: boolean = false;
  date: Date = new Date();
  currency: string;
  flgAgregarEmbarque: boolean = false;
  txtNuevoEmbarque: string = "";
  nuevoEmbarque: Shipment;
  maxDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() + 2};
  minDate: NgbDateStruct = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() - 2};
  
  @Input() tmFijadasBases: Number;
  @Input() contratosFijadasFuturos: Number;

    // valorHijo!: any;
  

  @ViewChild(libroFisicoComponent) componenteHijo!: libroFisicoComponent;

  fechaModificar: Date = new Date();
  fechaInicioModificar: Date = new Date();
  fechaFinModificar: Date = new Date();
  fechaEstimadaModificar: Date = new Date();

  constructor(private portafolioMoliendaService: PortafolioMoliendaService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private libroFisico: LibroFisicoService,
              private deteccionCambios: ChangeDetectorRef) {
    // this.objForm = new objInitGestionOperacion();
    this.nuevoFisico = new Physical();
    this.nutricionAnimal = new AnimalNutrition();
    this.consumoHumano = new HumanConsumption();
    this.flgIngresarOperacion = this.libroFisico.flgIngresoOperacion;
    // this.obtenerDatosForm();
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

  @Output () closegestionOperacion: EventEmitter<boolean>= new EventEmitter();

  ngOnInit(): void {
    this.obtenerDatosForm();
    // console.log("Valor hijo 1",this.valorHijo);
  }

 

  obtenerDatosForm(){
    if(this.flgIngresarOperacion){
      this.date = new Date();
      this.date.setDate( this.date.getDate() + 1 );
      this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
      this.fechaIniCarga = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
      this.fechaFinCarga = {day: this.date.getDate(),month: this.date.getMonth() + 1,year: this.date.getFullYear()};
      this.fechaLlegada = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
      this.nuevoFisico.t039_ID = this.objForm.nuevoID.toString();
      this.nuevoFisico.t039_Location = '4';
      // console.log("Valor hijo 0",this.valorHijo);
      // this.libroFisico.obtenerobjInitGestionOperacion(this.libroFisico.subyacente).subscribe(
      //   (response: objInitGestionOperacion) => {
      //     this.nuevoFisico.t039_ID = response.nuevoID.toString();
      //     this.objForm = new objInitGestionOperacion();
      //     this.objForm = response;
      //   },
      //   (error: HttpErrorResponse) => {
      //     alert(error.message);
      //   });
    }else{
      // this.libroFisico.obtenerobjInitModificacionOperacion(this.libroFisico.fisicoID,this.libroFisico.subyacente).subscribe(
      //   (response: objInitGestionOperacion) => {
          
          
      //   },
      //   (error: HttpErrorResponse) => {
      //     alert(error.message);
      //   });
      this.nuevoFisico = this.objForm.fisico;
      this.nuevoFisico.t039_Destination = this.nuevoFisico.t039_Destination.toString();
          this.nuevoFisico.t039_PhysicalSeller = this.nuevoFisico.t039_PhysicalSeller.toString();
          this.nuevoFisico.t039_Shipment = this.nuevoFisico.t039_Shipment.toString();
          this.nuevoFisico.t039_FreightBasis = this.nuevoFisico.t039_FreightBasis.toString();
          this.nuevoFisico.t039_PriceType = this.nuevoFisico.t039_PriceType.toString();
          this.nuevoFisico.t039_LoadingPort = this.nuevoFisico.t039_LoadingPort.toString();
          this.nuevoFisico.t039_UnderlyingClassification = this.nuevoFisico.t039_UnderlyingClassification.toString();
          this.nuevoFisico.t039_Location = this.nuevoFisico.t039_Location.toString();
          this.nuevoFisico.t039_Contract = this.nuevoFisico.t039_Contract?.toString();
          this.bolsa = this.objForm.contrato;
          // this.objForm = new objInitGestionOperacion();
          this.nutricionAnimal = new AnimalNutrition();
          // this.objForm = response;
          

          if(this.objForm.nutricionAnimal !== null){
            this.nutricionAnimal = this.objForm.nutricionAnimal;
            this.nutricionAnimal.t170_Society = this.nutricionAnimal.t170_Society?.toString();
            // this.flgNutricionAnimal = true;
          }else if(this.objForm.consumoHumano !== null){
            this.consumoHumano = this.objForm.consumoHumano;
            this.consumoHumano.t478_Society = this.consumoHumano.t478_Society?.toString();
          }

          if(this.nuevoFisico.t039_Destination.toString() == '1'){ // Validar que se ingrese N.A.Sociedad
            this.flgNutricionAnimal = true;
          }else{
            this.flgNutricionAnimal = false;
          }
          
          this.nuevoFisico.t039_Date=this.nuevoFisico.t039_Date.toString().substring(0,4) +'-'+ this.nuevoFisico.t039_Date.toString().substring(4,6) +'-'+ this.nuevoFisico.t039_Date.toString().substring(6,8);
          this.nuevoFisico.t039_ChargingStart=this.nuevoFisico.t039_ChargingStart.toString().substring(0,4) +'-'+ this.nuevoFisico.t039_ChargingStart.toString().substring(4,6) +'-'+ this.nuevoFisico.t039_ChargingStart.toString().substring(6,8);
          this.nuevoFisico.t039_EndLoad=this.nuevoFisico.t039_EndLoad.toString().substring(0,4) +'-'+ this.nuevoFisico.t039_EndLoad.toString().substring(4,6) +'-'+ this.nuevoFisico.t039_EndLoad.toString().substring(6,8);
          this.nuevoFisico.t039_ArrivalDate=this.nuevoFisico.t039_ArrivalDate.toString().substring(0,4) +'-'+ this.nuevoFisico.t039_ArrivalDate.toString().substring(4,6) +'-'+ this.nuevoFisico.t039_ArrivalDate.toString().substring(6,8);


          this.fechaModificar = new Date(this.nuevoFisico.t039_Date);
          this.fechaInicioModificar = new Date(this.nuevoFisico.t039_ChargingStart);
          this.fechaFinModificar = new Date(this.nuevoFisico.t039_EndLoad);
          this.fechaEstimadaModificar = new Date(this.nuevoFisico.t039_ArrivalDate);

          this.fechaModificar.setDate( this.fechaModificar.getDate() + 1 );
          this.fechaInicioModificar.setDate( this.fechaInicioModificar.getDate() + 1 );
          this.fechaFinModificar.setDate( this.fechaFinModificar.getDate() + 1 );
          this.fechaEstimadaModificar.setDate( this.fechaEstimadaModificar.getDate() + 1 );

          this.fecha = {day: this.fechaModificar.getDate(),month: this.fechaModificar.getMonth() + 1,year: this.fechaModificar.getFullYear()};
          this.fechaIniCarga = {day: this.fechaInicioModificar.getDate(),month: this.fechaInicioModificar.getMonth() + 1,year: this.fechaInicioModificar.getFullYear()};
          this.fechaFinCarga = {day: this.fechaFinModificar.getDate(),month: this.fechaFinModificar.getMonth() + 1,year: this.fechaFinModificar.getFullYear()};
          this.fechaLlegada = {day: this.fechaEstimadaModificar.getDate(),month: this.fechaEstimadaModificar.getMonth() + 1,year: this.fechaEstimadaModificar.getFullYear()};
          
          this.obtenerContratos(Number(this.bolsa));
          this.obtenerNumContratos();
          if(this.nuevoFisico.t039_PriceType == '1' || this.nuevoFisico.t039_PriceType == '3'){
            this.flgFlat = true;
            if(this.nuevoFisico.t039_PriceType == '1'){
              this.flgBolsaFlat = true;
              this.bolsa = '18';
              // this.obtenerContratos(Number(this.bolsa));
            }
          }else{
            this.flgFlat = false;
            this.flgBolsaFlat = false;
          }
    } 
  }

  guardarOperacion(){

    this.flgBoton = false;
    if(Number(this.dateToString(this.fechaIniCarga)) > Number(this.dateToString(this.fechaFinCarga))){
      Swal.fire({
        title: 'Ingresar Operación',
        html: 'La fecha de Inicio de Carga no puede ser mayor a la fecha Fin de Carga',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      this.flgBoton = true;
      return;
    }

    if(Number(this.dateToString(this.fechaLlegada)) < Number(this.dateToString(this.fechaIniCarga))){
      Swal.fire({
        title: 'Ingresar Operación',
        html: 'La fecha de Arribo Estimado no puede ser menor a la fecha de Inicio de Carga',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      this.flgBoton = true;
      return;
    }

    // Validación de campos
    if(this.nuevoFisico.t039_Contract == undefined || this.nuevoFisico.t039_Destination == undefined || this.nuevoFisico.t039_PhysicalSeller == undefined
      || this.nuevoFisico.t039_Shipment == undefined || this.nuevoFisico.t039_UnderlyingClassification == undefined || this.bolsa == undefined
      || this.nuevoFisico.t039_PriceType == undefined || this.nuevoFisico.t039_ProteinLevel == undefined || this.nuevoFisico.t039_VolumeMetricTons == undefined
      || this.txtNumeroDeContratos == undefined || this.nuevoFisico.t039_LoadingPort == undefined
      || this.nuevoFisico.t039_Tolerance == undefined || this.nuevoFisico.t039_FreightBasis == undefined){
      Swal.fire({
        title: 'Ingresar Operación',
        html: 'Es necesario completar los campos',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      this.flgBoton = true;
      return;
    }

    if(this.nuevoFisico.t039_PriceType == '1'){ //|| this.nuevoFisico.t039_PriceType == '3'
      if(this.bolsa !== '18'){
        this.flgBoton = true;
        Swal.fire({
          title: 'Ingresar Operación',
          html: 'Inconsistencia en Tipo De Precio Flat y Bolsa.',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        return;
      }
    }else{
      if(this.bolsa == '18'){
        this.flgBoton = true;
        Swal.fire({
          title: 'Ingresar Operación',
          html: 'Inconsistencia en Tipo De Precio Bases o Flat/Bases y Bolsa Flat',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        return;
      }
    }

    if(this.nuevoFisico.t039_Destination.toString() == '1'){ // Validar que se ingrese N.A.Sociedad
      if(this.nutricionAnimal.t170_Society == undefined){
        Swal.fire({
          title: 'Ingresar Operación',
          html: 'Es necesario completar los campos',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
    }else{
      if(this.consumoHumano.t478_Society == undefined){
        Swal.fire({
          title: 'Ingresar Operación',
          html: 'Es necesario completar los campos',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
    }

    if(this.nuevoFisico.t039_PriceType == '1' || this.nuevoFisico.t039_PriceType == '3'){ // Validar que se ingrese Flat
      if(this.nuevoFisico.t039_FlatPrice == undefined){
        Swal.fire({
          title: 'Ingresar Operación',
          html: 'Es necesario completar los campos',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
    }

    this.objetoRegistro = new objIngresarOperacion();
    this.nuevoFisico.t039_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.nuevoFisico.t039_ChargingStart = this.dateToString(this.fechaIniCarga);
    this.nuevoFisico.t039_EndLoad = this.dateToString(this.fechaFinCarga);
    this.nuevoFisico.t039_Date = this.dateToString(this.fecha);
    this.nuevoFisico.t039_ArrivalDate = this.dateToString(this.fechaLlegada);

    this.nuevoFisico.t039_Society = this.libroFisico.sociedad;
    this.objetoRegistro.fisico = this.nuevoFisico;
    this.objetoRegistro.nutricionAnimal = this.nutricionAnimal;
    this.objetoRegistro.consumoHumano = this.consumoHumano;

    this.libroFisico.guardarNuevaOperacion(this.objetoRegistro).subscribe(
      data=>{
          this.flgBoton = true;
          this.closeModalFactura();
          Swal.fire({
            icon: 'success',
            title: 'Guardar Operacion',
            text: 'Se guardó la operación ' + data.fisico.t039_ID + ' con exito.',
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
  obtenerContratos(id:number){
    this.bolsa = id.toString();
    this.libroFisico.obtenerContratosxBolsa(Number(this.bolsa),this.libroFisico.subyacente).subscribe(
      (response: cargaCombo[]) => {
        this.objForm.comboContratos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cerrargestionOperacion() {
    this.closeModalFactura();
  }

  obtenerCodificacionInterna(){
    if(this.nuevoFisico.t039_PhysicalSeller !== undefined && this.nuevoFisico.t039_UnderlyingClassification !== undefined){
      let proveedor = this.objForm.comboProveedor.filter(item => item.s204_ID.toString() == this.nuevoFisico.t039_PhysicalSeller.toString())[0];
      let subyacente = this.objForm.comboTipoSubyacenete.filter(item => item.s204_ID.toString() == this.nuevoFisico.t039_UnderlyingClassification.toString())[0];
      this.nuevoFisico.t039_InternalCode = subyacente.s204_Description.split('|')[0].trim() + proveedor.s204_Description.substring(0,1) + this.zfill(this.nuevoFisico.t039_ID, 4) ;
    }else{
      this.nuevoFisico.t039_InternalCode = "";
    }
  }

  modificarTipoPrecio(){
    if(this.nuevoFisico.t039_PriceType == '1' || this.nuevoFisico.t039_PriceType == '3'){
      this.flgFlat = true;
      if(this.nuevoFisico.t039_PriceType == '1'){
        this.flgBolsaFlat = true;
        this.bolsa = '18';
        this.nuevoFisico.t039_Contract = undefined;
        this.obtenerContratos(Number(this.bolsa));
      }
    }else{
      this.flgFlat = false;
      this.flgBolsaFlat = false;
      this.nuevoFisico.t039_FlatPrice = undefined;
      this.bolsa = undefined;
    }
  }
  modificarDestino(){
    if(this.nuevoFisico.t039_Destination.toString() == '1'){ // Validar que se ingrese N.A.Sociedad
      this.flgNutricionAnimal = true;
      this.consumoHumano.t478_Society = undefined;
    }else{
      this.flgNutricionAnimal = false;
      this.nutricionAnimal.t170_Society = undefined;
    }
  }

  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
}
obtenerNumContratos(){
  if(this.nuevoFisico.t039_Contract == undefined || this.nuevoFisico.t039_VolumeMetricTons == undefined ){
    return;
  }
  this.portafolioMoliendaService.getToneladasContratos(this.nuevoFisico.t039_VolumeMetricTons.toString().replace(".", "_"),this.nuevoFisico.t039_Contract.toString()).subscribe(
    (response: string) => {
      // this.txtNumeroDeContratos = Math.round(Number(response));
      this.txtNumeroDeContratos = Math.round(Number(response));
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

    this.libroFisico.obtenerCurrency(Number(this.nuevoFisico.t039_Contract)).subscribe(
    (response: string) => {
      this.currency = response;
    },
    (error: HttpErrorResponse) => {
      // alert(error.message);
      this.currency = error.error.text
    });

}

modificarFactura(){
  this.flgBoton = false;
    if(Number(this.dateToString(this.fechaIniCarga)) > Number(this.dateToString(this.fechaFinCarga))){
      Swal.fire({
        title: 'Modificar Embarque',
        html: 'La fecha de Inicio de Carga no puede ser mayor a la fecha Fin de Carga',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      this.flgBoton = true;
      return;
    }

    if(this.nuevoFisico.t039_PriceType != '1' ){

      if((Math.round(Number(this.tmFijadasBases))  - Math.round(Number(this.nuevoFisico.t039_VolumeMetricTons))) > 1){
        Swal.fire({
          title: 'Modificar Embarque',
          html: 'Es necesario primero reducir Bases y/o Futuros.',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
  
      if((Math.round(Number(this.contratosFijadasFuturos)) - Math.round(Number(this.txtNumeroDeContratos))) > 1){
        Swal.fire({
          title: 'Modificar Embarque',
          html: 'Es necesario primero reducir Bases y/o Futuros.',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
      
    }
    

    // Validación de campos
    if(this.nuevoFisico.t039_Contract == undefined || this.nuevoFisico.t039_Destination == undefined || this.nuevoFisico.t039_PhysicalSeller == undefined
      || this.nuevoFisico.t039_Shipment == undefined || this.nuevoFisico.t039_UnderlyingClassification == undefined || this.bolsa == undefined
      || this.nuevoFisico.t039_PriceType == undefined || this.nuevoFisico.t039_ProteinLevel == undefined || this.nuevoFisico.t039_VolumeMetricTons == undefined
      || this.txtNumeroDeContratos == undefined || this.nuevoFisico.t039_Freight == undefined || this.nuevoFisico.t039_LoadingPort == undefined
      || this.nuevoFisico.t039_Tolerance == undefined || this.nuevoFisico.t039_FreightBasis == undefined){
      Swal.fire({
        title: 'Modificar Embarque',
        html: 'Es necesario completar los campos',
        icon: 'warning',
        confirmButtonColor: '#4b822d'
      })
      this.flgBoton = true;
      return;
    }

    if(this.nuevoFisico.t039_PriceType == '1'){ //|| this.nuevoFisico.t039_PriceType == '3'
      if(this.bolsa !== '18'){
        this.flgBoton = true;
        Swal.fire({
          title: 'Modificar Embarque',
          html: 'Inconsistencia en Tipo De Precio Flat y Bolsa.',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        return;
      }
    }else{
      if(this.bolsa == '18'){
        this.flgBoton = true;
        Swal.fire({
          title: 'Modificar Embarque',
          html: 'Inconsistencia en Tipo De Precio Bases o Flat/Bases y Bolsa Flat',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        return;
      }
    }

    if(this.nuevoFisico.t039_Destination.toString() == '1'){ // Validar que se ingrese N.A.Sociedad
      if(this.nutricionAnimal.t170_Society == undefined){
        Swal.fire({
          title: 'Modificar Embarque',
          html: 'Es necesario completar el campo "N.A.Sociedad"',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
    }else{
      if(this.consumoHumano.t478_Society == undefined){
        Swal.fire({
          title: 'Ingresar Operación',
          html: 'Es necesario completar los campos',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
    }
    if(this.nuevoFisico.t039_PriceType == '1' || this.nuevoFisico.t039_PriceType == '3'){ // Validar que se ingrese Flat
      if(this.nuevoFisico.t039_FlatPrice == undefined){
        Swal.fire({
          title: 'Modificar Embarque',
          html: 'Es necesario ingresar flat',
          icon: 'warning',
          confirmButtonColor: '#4b822d'
        })
        this.flgBoton = true;
        return;
      }
    }

  Swal.fire({
    icon: 'question',
    title: 'Modificar Embarque',
    html: '¿Desea modificar la Operación ' + this.nuevoFisico.t039_ID + '?' ,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Continuar',
    reverseButtons: true,
    confirmButtonColor: '#4b822d'
  }).then((result) => {
    if (result.isConfirmed) {
      this.nuevoFisico.t039_ChargingStart = this.dateToString(this.fechaIniCarga);
      this.nuevoFisico.t039_EndLoad = this.dateToString(this.fechaFinCarga);
      this.nuevoFisico.t039_Date = this.dateToString(this.fecha);
      this.nuevoFisico.t039_ArrivalDate = this.dateToString(this.fechaLlegada);
      this.nuevoFisico.t039_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
      this.objetoRegistro = new objIngresarOperacion();
      this.objetoRegistro.fisico = this.nuevoFisico;
      this.objetoRegistro.nutricionAnimal = this.nutricionAnimal;
      this.objetoRegistro.consumoHumano = this.consumoHumano;
      
      this.libroFisico.guardarModificacionBarco(this.objetoRegistro).subscribe(
        data=>{
          this.flgBoton = true;
          Swal.fire({
            icon: 'success',
            title: 'Modificar Embarque',
            text: 'Se realizó la modificación de embarque con éxito.',
            confirmButtonColor: '#0162e8'
          });
          this.closeModalFactura();           
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

obtenerToneladasMetricas(){
  if(this.txtNumeroDeContratos == undefined || this.nuevoFisico.t039_Contract == undefined ){
    return;
  }

  this.portafolioMoliendaService.getContratosTM(this.txtNumeroDeContratos.toString().replace(".", "_"),this.nuevoFisico.t039_Contract.toString()).subscribe(
    (response: string) => {
      // this.nuevoContrato.t218_MetricTons = Math.round(Number(response));
      this.nuevoFisico.t039_VolumeMetricTons = Number(response);
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
}

closeModalFactura(){
  this.closegestionOperacion.emit(false); 
}

guardarNuevoEmbarque(){
  if(this.txtNuevoEmbarque === undefined || this.txtNuevoEmbarque === ''){
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Por favor indique el nombre del nuevo embarque',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    });
  }

  this.nuevoEmbarque = new Shipment();
  this.nuevoEmbarque.t051_Description = this.txtNuevoEmbarque;
  this.nuevoEmbarque.t051_RegisteredBy = this.portafolioMoliendaIFDService.usuario;

  let filtroEmbarque = this.objForm.comboEmbarque.filter( x => x.s204_Description == this.txtNuevoEmbarque);

  if(filtroEmbarque.length > 0){
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Embarcación ya Existe, por favor revisar lista de Embarcaciones.',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    });
    return;
  }

  this.libroFisico.guardarBarco(this.nuevoEmbarque).subscribe(
    data=>{
      Swal.fire({
        icon: 'success',
        title: 'Guardar Embarque',
        text: 'Se guardo el embarque exitosamente.',
        confirmButtonColor: '#0162e8'
      });  

      this.portafolioMoliendaService.getCombo('embarqueCM').subscribe(
        (response: cargaCombo[]) => {
          this.flgAgregarEmbarque = false;
          this.objForm.comboEmbarque = response;
          let filtroEmbarque = this.objForm.comboEmbarque.filter( x => x.s204_Description == this.txtNuevoEmbarque);
          this.nuevoFisico.t039_Shipment = filtroEmbarque[0]['s204_ID'];
          this.txtNuevoEmbarque = '';
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
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

}