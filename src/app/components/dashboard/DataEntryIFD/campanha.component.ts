import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule, DatePipe } from '@angular/common';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PortafolioIFDMolienda } from 'src/app/models/IFD/portafolioIFDMolienda';
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


const moment =_moment;


@Component({
  
  selector: 'app-campanha',
  templateUrl: './campanha.component.html',
  styleUrls: ['./campanha.component.scss']

  
})

export class campanhaComponent implements OnInit {


  date1 = new FormControl(moment());

  public dialog: MatDialogModule;
  private _refresh$= new Subject<void>();
  public indice:number;
  suscription: Subscription;
  public keypressed;
  private wasInside = false;
  public usuario: string='';
  public fecha:number;
  date: NgbDateStruct;
  checked: any = [];  
  public listaSeason:CargarCombo[];
  public listaOptionClass:CargarCombo[];
  public listaSubyacente:CargarCombo[];
  public idOptionClass:string;
  public idSeason:string;
  public idSubyacente:string;
  public toneladasMetrica:number;
  public listaCampaign: Campaign [] = [];
  public campaign: Campaign;
  public pFechaInicio:string="";
  public pFechaFin:string="";
  public pAnho:string="";
  public pVolumenEsperado:string="";
  
  
public estadoRegistrarCampaign:boolean=false;

public estadoRegistroFO:boolean=false;
public estadoRegistroFOFisico:boolean=false;
public estadoMOValorizar:boolean=false;
public estadoMOAprobacion:boolean=false;
public estadoMOAprobacionFisico:boolean=false;
public estadoAdministrador:boolean=false;


  chosenYearDate : Date;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  
  
  myModal=false;
  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  //public  visible: boolean;

  displayedColumns: string[] = [
    't204_Actividad'
    ,'t204_DescSeason'
    ,'t204_DescUnderlying'
     ,'t204_Anho'
     ,'t204_FechaInicio'
     ,'t204_FechaFin'
     ,'t204_Descripcion'
     ,'t204_VolumenEsperado'
     ,'actions'
  ];

  dataSource: MatTableDataSource<Campaign>;
  selection = new SelectionModel<Campaign>(true, []);
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
      
      //this.fecha=20220225;//20220307;//20220225;
      this.fecha=this.getformattedDate();
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      //this.fecha=this.portafolioMoliendaIFDService.fecha;


      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
        this.estadoAdministrador=true;
      }else if(  this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_IFD") > -1){
        this.estadoMOValorizar=true;
      }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
        this.estadoMOAprobacion=true;
      }else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1 ){
          this.estadoRegistroFO = true;
      }
      else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_Fisico_RegistroOperacion") > -1 ){
        this.estadoRegistroFOFisico = true;
      }
      else if (this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_Aprobacion") > -1 ){
        this.estadoMOAprobacionFisico = true;
      }

      //Registrar Límite
      if (this.estadoMOAprobacion || this.estadoAdministrador || this.estadoRegistroFO || this.estadoRegistroFOFisico || this.estadoMOAprobacionFisico ){
        this.estadoRegistrarCampaign=true;
      }
      else{this.estadoRegistrarCampaign=false;
      }



      this.visible=true;
      this.getListaSeason();
      this.getListaOptionClass();
      this.getListaSubyacente();
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      this.getListaCampaign()
    
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
    this.getListaCampaign()
  }

  public getListaSeason(): void {
    this.portafolioMoliendaIFDService.getListaSeason().subscribe(
      (response: CargarCombo[]) => {
        this.listaSeason = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaOptionClass(): void {
    this.portafolioMoliendaIFDService.getListaOptionClass().subscribe(
      (response: CargarCombo[]) => {
        this.listaOptionClass = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaSubyacente(): void {
    this.portafolioMoliendaIFDService.getListaSubyacente().subscribe(
      (response: CargarCombo[]) => {
        this.listaSubyacente = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getListaCampaign(): void {



    this.portafolioMoliendaIFDService.getListaCampaign().subscribe(
    (response: Campaign[]) => {
      this.listaCampaign = response;
      this.dataSource = new MatTableDataSource(this.listaCampaign);

      this.selection = new SelectionModel<Campaign>(true, []);
      
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

AgregarCampanha(){
  this.myModal=true;
  this.campaign= new Campaign();
  var descSeason:string='';
  var descSubyacente:string='';

  for (var i=0, iLen=this.listaSeason.length; i<iLen; i++) {
   if (this.listaSeason[i].s114_Codigo ==Number(this.idSeason)) 
        descSeason=this.listaSeason[i].s114_Descripcion;
  }
  for (var i=0, iLen=this.listaSubyacente.length; i<iLen; i++) {
    if (this.listaSubyacente[i].s114_Codigo ==Number(this.idSubyacente)) 
         descSubyacente=this.listaSubyacente[i].s114_Descripcion;
   }
    this.campaign.t204_Season =Number(this.idSeason);
    this.campaign.t204_DescSeason=descSeason;
    this.campaign.t204_Underlying =Number(this.idSubyacente );
    this.campaign.t204_DescUnderlying=descSubyacente;
    this.campaign.t204_Anho=Number(this.pAnho);
    this.campaign.t204_FechaInicio=this.pFechaInicio;
    this.campaign.t204_FechaFin=this.pFechaFin;
    this.campaign.t204_Status=1;
    this.campaign.t204_VolumenEsperado=Number(this.pVolumenEsperado);
    this.portafolioMoliendaIFDService.guardarCampanha(this.campaign).subscribe(data=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se registro la campaña en la base de datos',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
        container: 'my-swal',

        }
      });
      this.getListaCampaign()
    },
    (error: HttpErrorResponse) => {
        alert(error.message);
    });

}

eliminarCampanha(fila: Campaign){
  
  this.myModal=true;
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar campaña',
      html: '¿Seguro que desea eliminar la campaña <b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
      }).then((result) => {
      if (result.isConfirmed) {
        this.campaign = new Campaign;
        this.campaign.t204_Season =Number(fila.t204_Season);
        this.campaign.t204_Underlying =Number(fila.t204_Underlying);
        this.campaign.t204_Anho=Number(fila.t204_Anho);
        this.campaign.t204_FechaInicio=fila.t204_FechaInicio;
        this.campaign.t204_FechaFin=fila.t204_FechaFin;
        this.campaign.t204_Id=fila.t204_Id;
        this.campaign.t204_Status=0;
        
        this.portafolioMoliendaIFDService.getEliminarCampanha(this.campaign).subscribe(data=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se eliminó la camapaña en la base de datos',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
            container: 'my-swal',
      
            }
          });
          this.cerrar();
          this.getListaCampaign()
          },
          (error: HttpErrorResponse) => {
              alert(error.message);
          });
 
        }
      
      })
  }
  editarCampanha(detalleForm:any, campaign: Campaign){

    //RESETEO DE EL MODELO
    console.log("modal abierto");
    this.portafolioMoliendaIFDService.fecha=this.fecha;
    this.portafolioMoliendaIFDService.campaign =campaign;
    const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classEditarCampanha"});
    //clearInterval()
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

    inhabilitarCampania(fila : Campaign, event: any){
      
      let activo : number = 0;
      activo = event.checked ? 1 : 0;

      if(event.checked === false){
        Swal.fire({
          icon: 'warning',
          title: 'Inhabilitar Campaña',
          html: `¿Seguro que desea inhabilitar la <b>campaña:</b> ${fila.t204_Descripcion} y <b>subyacente:</b> ${fila.t204_DescUnderlying} para MTM Molienda?`,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
          }).then((result) => {
          if (result.isConfirmed) {
            // activo = 0;
            this.campaign = new Campaign;
            this.campaign.t204_Season = Number(fila.t204_Season);
            this.campaign.t204_Underlying = Number(fila.t204_Underlying);
            this.campaign.t204_Anho = Number(fila.t204_Anho);
            this.campaign.t204_FechaInicio = fila.t204_FechaInicio;
            this.campaign.t204_FechaFin = fila.t204_FechaFin;
            this.campaign.t204_Id = fila.t204_Id;
            this.campaign.t204_Status = 1;
            this.campaign.t204_Actividad = 0;
            
            this.portafolioMoliendaIFDService.getInhabilitarCampania(this.campaign).subscribe(data=>{
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se inhabilito la campaña en la base de datos para MTM Molienda',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                container: 'my-swal',
                }
              });
              this.getListaCampaign()
              },
              (error: HttpErrorResponse) => {
                  alert(error.message);
              });
            }else{
              activo = 1;
              this.getListaCampaign()
            }
          });
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Habilitar Campaña',
          html: `¿Seguro que desea habilitar la <b>campaña:</b> ${fila.t204_Descripcion} y <b>subyacente:</b> ${fila.t204_DescUnderlying} para MTM Molienda?`,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
          }).then((result) => {
          if (result.isConfirmed) {
            // activo = 1;
            this.campaign = new Campaign;
            this.campaign.t204_Season = Number(fila.t204_Season);
            this.campaign.t204_Underlying = Number(fila.t204_Underlying);
            this.campaign.t204_Anho = Number(fila.t204_Anho);
            this.campaign.t204_FechaInicio = fila.t204_FechaInicio;
            this.campaign.t204_FechaFin = fila.t204_FechaFin;
            this.campaign.t204_Id = fila.t204_Id;
            this.campaign.t204_Status = 1;
            this.campaign.t204_Actividad = 1;
            
            this.portafolioMoliendaIFDService.getHabilitarCampania(this.campaign).subscribe(data=>{
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se habilito la campaña en la base de datos para MTM Molienda',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                container: 'my-swal',
                }
              });
              this.getListaCampaign()
              },
              (error: HttpErrorResponse) => {
                  alert(error.message);
              });
            }else{
              // activo = 0;
              this.getListaCampaign();
            }
          });
      }
    }

}




