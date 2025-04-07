import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule, DatePipe } from '@angular/common';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { AsociarSQL } from 'src/app/models/IFD/asociarSQL';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { number } from 'echarts';
import { HostListener } from '@angular/core';
import { TypeOperation } from 'src/app/models/IFD/TypeOperation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { PlanningByCampaign } from 'src/app/models/IFD/planningByCampaign';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

import {MatTooltipModule} from '@angular/material/tooltip';





//import * as moment from 'moment';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};
import { format } from 'date-fns'
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment} from 'moment';
import { Campaign } from 'src/app/models/IFD/campaign';
import { AprobarEstrategia } from 'src/app/models/IFD/aprobarEstrategia';
import { Descripcion } from 'src/app/models/IFD/descripcion';
import { AprobarEstrategia_Estado } from 'src/app/models/IFD/aprobar_estrategia_estado';
import { AprobarOperacion } from 'src/app/models/IFD/aprobarOperacion';
import { AprobarOperacion_Estado } from 'src/app/models/IFD/aprobar_operation_estado';



const moment =_moment;


@Component({
  
  selector: 'app-aprobarOperacion',
  templateUrl: './aprobarOperacion.component.html',
  styleUrls: ['./aprobarOperacion.component.scss']

  
})

export class aprobarOperacionComponent implements OnInit {

  //positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  //position = new FormControl(this.positionOptions[0]);


  date1 = new FormControl(moment());

  public dialog: MatDialogModule;
  private _refresh$= new Subject<void>();
  public indice:number;
  suscription: Subscription;
  public keypressed;
  private wasInside = false;
  public usuario: string;
  public fecha:number;
  date: NgbDateStruct;
  checked: any = [];  


  public listaEstado:CargarCombo[];
  public idEstado:string;
  public rolUsuario:number;
  public rolesUsuario:CargarCombo[];
  public listaAprobarOperacion: AprobarOperacion []=[];
  public aprobarOperacionEstado:AprobarOperacion_Estado;
  public campaign: Campaign;
  public pFechaInicio:string="";
  public pFechaFin:string="";
  public pAnho:string="";
  public estadoAprobador:Boolean=false;
  chosenYearDate : Date;

  
  
public estadoAprobar:boolean=false;

public estadoRegistroFO:boolean=false;
public estadoMOValorizar:boolean=false;
public estadoMOAprobacion:boolean=false;
public estadoAdministrador:boolean=false;


  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  
  
  myModal=false;
  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  //public  visible: boolean;

  displayedColumns: string[] = [
    'temp_ID'
    ,'temp_Operation'
    //,'temp_Estrategia'
     ,'temp_Fecha'
     ,'temp_Hora'
     ,'temp_Solicitante'
     ,'temp_Estado'
     ,'temp_Campo'
     ,'temp_Inicial'
     ,'temp_Cambio'
     ,'actions'
  ];


  dataSource: MatTableDataSource<AprobarOperacion>;
  selection = new SelectionModel<AprobarOperacion>(true, []);
  hidden = false;

  formGroup : FormGroup;

  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.alwaysShowCalendars = true;

  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  

  closeModal(){
    //console.log("Emite cerrado");
    this.close.emit(false);
    
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

  contextMenuPosition = { x: '0px', y: '0px'};

  public titulo: string;



  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;


  
@HostListener('click') 
  clickInside() { 
    this.wasInside = true;
    //console.log('clic dentro de modal'); 
  } 
  
  @HostListener('document:click') 
  clickout() {
    if (!this.wasInside) { 
      //console.log('clic fuera de modal');
      this.closeModal();
    } 
    this.wasInside = false;
  
    ; 
  }



  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.keypressed = event.keyCode;
    if (this.keypressed=27){
      console.log('tecla'+this.keypressed);
      this.closeModal();
      //this.close.emit(true);
    }
  }
  
  setDefaultValue(){
    this.formGroup.patchValue({
      itemCtrl : '1'
    })
  }

  @ViewChild('teamDropdown') teamDropdown: MatSelect;
  ngAfterViewInit() {
    if(this.teamDropdown !=undefined){
      setTimeout(() => {
          this.teamDropdown.options.first.select();
          
      });
    }
  }

  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
  }

  ngOnInit(): void {
      
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.portafolioMoliendaIFDService.fecha ;
      this.visible=true;

      
      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
        this.estadoAdministrador=true;
      }else if(  this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_IFD") > -1){
        this.estadoMOValorizar=true;
      }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
        this.estadoMOAprobacion=true;
      }else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1 ){
          this.estadoRegistroFO = true;
      }
      //Aprobar
      if (this.estadoMOAprobacion || this.estadoAdministrador){
        this.estadoAprobar=true;
      }
      else{this.estadoAprobar=false;
      }


      this.getListaEstado();
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      //this.getListaEstrategiaAprobar()
      this.getListaOperacionesAprobar()
    
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


applyFilterSQL(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  //this.dataSourceSQL.filter = filterValue.trim().toLowerCase();
}

  cerrar() {
    //this.modalReference.close();
    this.closeModal();
    this.modalService.dismissAll();
  }


  cerrarModal(e){
    console.log("modal hijo cerrado asociar");
    this.myModal=false;
    //this.getListaCampaign()
    this.getListaOperacionesAprobar()
  }


  public getListaEstado(): void {
    this.portafolioMoliendaIFDService.getListaEstado().subscribe(
      (response: CargarCombo[]) => {
        this.listaEstado = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
public getListaOperacionesAprobar(): void {

  if (typeof this.idEstado == 'undefined') {
      this.idEstado='3'
    }
    if (typeof this.pFechaInicio == 'undefined' || this.pFechaInicio==='' ) {
      this.pFechaInicio='20220101'
    }
    if (typeof this.pFechaFin == 'undefined'  || this.pFechaFin==='' ) {
      this.pFechaFin='29001231'
    }
  
  this.portafolioMoliendaIFDService.getListaOperacionesAprobar(Number(this.idEstado),Number(this.pFechaInicio),Number(this.pFechaFin)).subscribe(
  (response: AprobarOperacion[]) => {
    this.listaAprobarOperacion = response;
    this.dataSource = new MatTableDataSource(this.listaAprobarOperacion);

    this.selection = new SelectionModel<AprobarOperacion>(true, []);
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
);

}

chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
   const ctrlValue = this.date1.value;
  // const fecha=  String(normalizedYear)
  // this.date1.setValue(normalizedYear)
  // fecha.substring(10,14)

  

  
  ctrlValue(normalizedYear);
  
  this.date1.setValue(ctrlValue);
  datepicker.close();
  

}

BuscarAprobacion(){
  this.getListaOperacionesAprobar()
  
}

noAprobar(fila: AprobarOperacion):boolean{
  var mensaje:string;
  var estado:number;
  if (fila.temp_Estado=='Por Aprobar'){
    this.portafolioMoliendaIFDService.getRolUsuario(this.usuario).subscribe(
      (response: CargarCombo[]) => {
      this.rolesUsuario = response;
      mensaje='¿Esta seguro que no desea aprobar la operación '
      estado=2 //1:Aprobado; 2:No Aprobado
      this.validarUsuario(mensaje,fila,estado);
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }
  else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'El registro no tiene el estado por aprobar.',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
      container: 'my-swal',
      }
    });
  }
  return true;  
}

aprobar(fila: AprobarOperacion){
  var mensaje:string;
  var estado:number;
  if (fila.temp_Estado=='Por Aprobar'){
    this.portafolioMoliendaIFDService.getRolUsuario(this.usuario).subscribe(
      (response: CargarCombo[]) => {
      this.rolesUsuario = response;
      mensaje='¿Esta seguro que desea aprobar la operación '
      estado=1 //1:Aprobado; 2:No Aprobado
      this.validarUsuario(mensaje,fila,estado);
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }
  else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'El registro no tiene el estado por aprobar.',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
      container: 'my-swal',
      }
    });
}
  return true;  



  }

public validarUsuario(mensaje:string, fila:AprobarOperacion,estado:number):void{
  
  //6: MO_IFD_Aprobacion
  if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
    this.estadoAprobador=true;
  }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
    this.estadoAprobador=true;
  }


  if( this.estadoAprobador){
    this.myModal=true;
    Swal.fire({
      icon: 'warning',
      title: 'Aprobación Operación',
      html: mensaje+'<b> '+ fila.temp_Operation   +'?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
      }).then((result) => {
      if (result.isConfirmed) {
        this.aprobarOperacionEstado= new AprobarOperacion_Estado();
        this.aprobarOperacionEstado.aprobarOperacion=fila;
        this.aprobarOperacionEstado.estado=estado
        this.aprobarOperacionEstado.aprobarOperacion.temp_approvalUser=this.usuario;
        this.aprobarOperacionEstado.aprobarOperacion.temp_approvalDate=this.fecha;
        this.portafolioMoliendaIFDService.getActualizarOperacion(this.aprobarOperacionEstado).subscribe(data=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se realizó el cambio solicitado',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
            container: 'my-swal',
            }
          });
          this.getListaOperacionesAprobar()
          },
          (error: HttpErrorResponse) => {
              alert(error.message);
          });
        }
      })
  }
  else{
    
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'El usuario con rol administrador puede aprobar o no aprobar el cambio solicitado',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
  }

}


    setDateInicio(date:string) {
      var pDia:string
      var pMes:string
      var pAnho:string
      var posicion:number
      var posicion2:number

      posicion=date.indexOf("/",1)
      posicion2=date.indexOf( "/",posicion+1)

      pMes=date.substring(0,posicion)
      pDia=date.substring(posicion+1, posicion2)
      pAnho=date.substring(posicion2+1)


      if(Number(pDia)<10 && Number(pMes)<10){
        this.pFechaInicio= `${pAnho}0${pMes}0${pDia}`.toString(); 
       }else if (Number(pDia)<10 ){
        this.pFechaInicio= `${pAnho}${pMes}0${pDia}`.toString(); 
       }else if (Number(pMes)<10){
        this.pFechaInicio= `${pAnho}0${pMes}${pDia}`.toString(); 
       }else{
        this.pFechaInicio= `${pAnho}${pMes}${pDia}`.toString();
       }
    }  

    setDateFin(date: string) {
      var pDia:string
      var pMes:string
      var pAnho:string
      var posicion:number
      var posicion2:number

      posicion=date.indexOf("/",1)
      posicion2=date.indexOf( "/",posicion+1)
      pMes=date.substring(0,posicion)
      pDia=date.substring(posicion+1, posicion2)
      pAnho=date.substring(posicion2+1)


      if(Number(pDia)<10 && Number(pMes)<10){
        this.pFechaFin= `${pAnho}0${pMes}0${pDia}`.toString(); 
       }else if (Number(pDia)<10 ){
        this.pFechaFin= `${pAnho}${pMes}0${pDia}`.toString(); 
       }else if (Number(pMes)<10){
        this.pFechaFin= `${pAnho}0${pMes}${pDia}`.toString(); 
       }else{
        this.pFechaFin= `${pAnho}${pMes}${pDia}`.toString();
       }
    }  
    eliminarPeticion(fila: AprobarOperacion):boolean{
      var mensaje:string;
      var estado:number;
      if (fila.temp_Estado=='Por Aprobar'){
        this.portafolioMoliendaIFDService.getRolUsuario(this.usuario).subscribe(
          (response: CargarCombo[]) => {
          this.rolesUsuario = response;
          mensaje='¿Esta seguro que desea cancelar la solicitud de la operación '
          estado=4 //1:Aprobado; 2:No Aprobado; 4:Cancelado solicitud
          this.validarUsuarioELiminarPeticion(mensaje,fila,estado);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
      }
      else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El registro no tiene el estado por aprobar.',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
          container: 'my-swal',
          }
        });
      }
      return true;  
    }
    public validarUsuarioELiminarPeticion(mensaje:string, fila:AprobarOperacion,estado:number):void{
  
      //6: MO_IFD_Aprobacion
      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
        this.estadoAprobador=true;
      }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
        this.estadoAprobador=true;
      }
      else if(this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1){
        this.estadoAprobador=true;
      }
      else if(this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_Aprobacion") > -1){
        this.estadoAprobador=true;
      }
    
    
      if( this.estadoAprobador){
        this.myModal=true;
        Swal.fire({
          icon: 'warning',
          title: 'Cancelar solicitud operación',
          html: mensaje+'<b> '+ fila.temp_Operation   +'?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
          }).then((result) => {
          if (result.isConfirmed) {
            this.aprobarOperacionEstado= new AprobarOperacion_Estado();
            this.aprobarOperacionEstado.aprobarOperacion=fila;
            this.aprobarOperacionEstado.estado=estado
            this.aprobarOperacionEstado.aprobarOperacion.temp_approvalUser=this.usuario;
            this.aprobarOperacionEstado.aprobarOperacion.temp_approvalDate=this.fecha;
            this.portafolioMoliendaIFDService.getActualizarOperacion(this.aprobarOperacionEstado).subscribe(data=>{
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se realizó el cambio solicitado',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                container: 'my-swal',
                }
              });
              this.getListaOperacionesAprobar()
              },
              (error: HttpErrorResponse) => {
                  alert(error.message);
              });
            }
          })
      }
      else{
        
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El usuario con rol administrador puede aprobar o no aprobar el cambio solicitado',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
    
          }
        });
      }
    
    }
        


}




