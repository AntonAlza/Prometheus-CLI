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
import { CargaCtaBrokerAsociada } from 'src/app/models/IFD/cargaCtaBrokerAsociada';
import { AccountBrokerCampign } from 'src/app/models/IFD/accountBrokerCampign';


const moment =_moment;


@Component({
  
  selector: 'app-registroCuentaBrokerCampanha',
  templateUrl: './registroCuentaBrokerCampanha.component.html',
  styleUrls: ['./registroCuentaBrokerCampanha.component.scss']

  
})

export class registroCuentaBrokerCampanhaComponent implements OnInit {


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
  public listaSociedadAdministradora:CargarCombo[];
  public listaCuentaBroker:CargarCombo[];
  public listaSociedadAdministrada:CargarCombo[];
  public listaCampanha:CargarCombo[];
  public listaProducto :CargarCombo[];
  public listaContratoMarco :CargarCombo[];
  
  
  public idSociedadAdministradora:string;
  public idSociedadAdministrada:string;  
  public idCuentaBroker:string;
  public idCampanha:string;
  public idProducto:string;
  public idContratoMarco:string;

  public idSeason:string;
  public idSubyacente:string;
  public toneladasMetrica:number;
  public listaCampaign: Campaign [] = [];
  public listaCtaBrokerAsociada:CargaCtaBrokerAsociada []=[];

  public campaign: Campaign;
  public cuentaBrokerAsociada:AccountBrokerCampign;
  public pFechaInicio:string="";
  public pFechaFin:string="";
  public pAnho:string="";

 
public estadoRegistrarCuentaBrokerCampaign:boolean=false;

public estadoRegistroFO:boolean=false;
public estadoMOValorizar:boolean=false;
public estadoMOAprobacion:boolean=false;
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
    's252_SociedadAdministradora'
    ,'s252_CtaBroker'
    ,'s252_SociedadAdministrada'
    ,'s252_Campanha'
    ,'s252_Producto'
    ,'s252_ContratoMarco'
    ,'s252_Descripcion'
    ,'s252_Status'
    ,'actions'
  ];

  dataSource: MatTableDataSource<CargaCtaBrokerAsociada>;
  selection = new SelectionModel<CargaCtaBrokerAsociada>(true, []);
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

      
      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
        this.estadoAdministrador=true;
      }else if(  this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_IFD") > -1){
        this.estadoMOValorizar=true;
      }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
        this.estadoMOAprobacion=true;
      }else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1 ){
          this.estadoRegistroFO = true;
      }
      //Registrar Límite
      if (this.estadoRegistroFO || this.estadoMOAprobacion || this.estadoAdministrador){
        this.estadoRegistrarCuentaBrokerCampaign=true;
      }
      else{this.estadoRegistrarCuentaBrokerCampaign=false;
      }




      //this.fecha=this.portafolioMoliendaIFDService.fecha;
      this.visible=true;
      this.getListaSociedadAdministradora()
      this.getListaSociedadAdministrada()
      this.getListaContratoMarco()
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      this.getListaCuentaBrokerProductoCampanha()
      
    
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
    this.getListaCuentaBrokerProductoCampanha()
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
  
  
chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
   const ctrlValue = this.date1.value;
  // const fecha=  String(normalizedYear)
  // this.date1.setValue(normalizedYear)
  // fecha.substring(10,14)

  

  
  ctrlValue(normalizedYear);
  
  this.date1.setValue(ctrlValue);
  datepicker.close();
  

}

AgregarCuentaBrokerAsociada(){
  
  this.myModal=true;
  this.cuentaBrokerAsociada= new AccountBrokerCampign(); 
  var descSeason:string='';
  var descSubyacente:string='';

    this.cuentaBrokerAsociada.t378_SubordinateAccount=Number(this.idCuentaBroker);
    this.cuentaBrokerAsociada.t378_SocietyManage=Number(this.idSociedadAdministrada);
    this.cuentaBrokerAsociada.t378_Campaign=Number(this.idCampanha);
    this.cuentaBrokerAsociada.t378_Product=Number(this.idProducto);
    this.cuentaBrokerAsociada.t378_ContractFramework=Number(this.idContratoMarco);
    this.cuentaBrokerAsociada.t378_Status= 1;
    this.cuentaBrokerAsociada.t378_Usuario=this.usuario;
    this.cuentaBrokerAsociada.t378_FechaRegistro=this.fecha;

    this.portafolioMoliendaIFDService.guardarCuentaBrokerAsociada(this.cuentaBrokerAsociada).subscribe(data=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se registro la cuenta del broker asociada en la base de datos',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
        container: 'my-swal',

        }
      });
      this.getListaCuentaBrokerProductoCampanha()
    },
    (error: HttpErrorResponse) => {
        alert(error.message);
    });

}

eliminarCuentaBrokerAsociada(fila: CargaCtaBrokerAsociada){
  
  this.myModal=true;
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar campaña',
      html: '¿Seguro que desea eliminar la cuenta del Broker asociada a la campaña <b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
      }).then((result) => {
      if (result.isConfirmed) {
        // //this.campaign = new Campaign;
        // this.campaign.t204_Season =Number(fila.t204_Season);
        // this.campaign.t204_Underlying =Number(fila.t204_Underlying);
        // this.campaign.t204_Anho=Number(fila.t204_Anho);
        // this.campaign.t204_FechaInicio=fila.t204_FechaInicio;
        // this.campaign.t204_FechaFin=fila.t204_FechaFin;
        // this.campaign.t204_Id=fila.t204_Id;
        // this.campaign.t204_Status=0;
        
        this.cuentaBrokerAsociada= new AccountBrokerCampign;
        this.cuentaBrokerAsociada.t378_ID=fila.s252_Id;
        this.cuentaBrokerAsociada.t378_SubordinateAccount=fila.s252_IdCtaBroker;
        this.cuentaBrokerAsociada.t378_SocietyManage=fila.s252_IdSociedadAdministrada;
        this.cuentaBrokerAsociada.t378_Campaign=fila.s252_IdCampanha;
        this.cuentaBrokerAsociada.t378_Product=fila.s252_IdProducto;
        this.cuentaBrokerAsociada.t378_ContractFramework=fila.s252_IdContratoMarco;
        this.cuentaBrokerAsociada.t378_Status=0;
        this.cuentaBrokerAsociada.t378_Usuario=this.usuario;
        this.cuentaBrokerAsociada.t378_FechaRegistro=this.fecha;



        this.portafolioMoliendaIFDService.getEliminarCuentaBrokerAsociada(this.cuentaBrokerAsociada).subscribe(data=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se elimino la cuenta asociada.',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
            container: 'my-swal',
      
            }
          });
          this.cerrar();
          this.getListaCuentaBrokerProductoCampanha()
          },
          (error: HttpErrorResponse) => {
              alert(error.message);
          });
 
        }
      
      })
  }
  editarCuentaBrokerAsociada(detalleForm:any, cuentaBrokerAsociada: CargaCtaBrokerAsociada){

    //RESETEO DE EL MODELO
    console.log("modal abierto");
    this.portafolioMoliendaIFDService.fecha=this.fecha;
    this.portafolioMoliendaIFDService.cuentaBrokerAsociada =cuentaBrokerAsociada;
    const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classEditarCuentaBrokerAsociada"});
    // clearInterval()
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
    public getListaSociedadAdministradora(): void {
      this.portafolioMoliendaIFDService.getListaSociedadAdministradora().subscribe(
        (response: CargarCombo[]) => {
          this.listaSociedadAdministradora = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    public getListaCuentaBroker(): void {
      this.portafolioMoliendaIFDService.getListaCuentaBroker(Number(this.idSociedadAdministradora)).subscribe(
        (response: CargarCombo[]) => {
          this.listaCuentaBroker = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    public getListaSociedadAdministrada(): void {
      this.portafolioMoliendaIFDService.getListaSociedadAdministrada().subscribe(
        (response: CargarCombo[]) => {
          this.listaSociedadAdministrada = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    public getListaCampanha(): void {
      this.portafolioMoliendaIFDService.getListaCampanha(Number(this.idSociedadAdministrada)).subscribe(
        (response: CargarCombo[]) => {
          this.listaCampanha = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }  
    public getListaProducto(): void {
      this.portafolioMoliendaIFDService.getListaProducto(Number(this.idCampanha)).subscribe(
        (response: CargarCombo[]) => {
          this.listaProducto = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }  
    public getListaContratoMarco(): void {
      this.portafolioMoliendaIFDService.getListaContratoMarco().subscribe(
        (response: CargarCombo[]) => {
          this.listaContratoMarco = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }  


    onSelectSociedadAdministradora(idSociedadAdministradora:number):void{
      if (typeof idSociedadAdministradora !== 'undefined') {
       this.idSociedadAdministradora=idSociedadAdministradora.toString();
       this.getListaCuentaBroker();
       
     }else{
       this.idSociedadAdministradora="0";
       
     }
   }
   

   onSelectSociedadAdministrada(idSociedadAdministrada:number):void{
    if (typeof idSociedadAdministrada !== 'undefined') {
     this.idSociedadAdministrada=idSociedadAdministrada.toString();
     this.getListaCampanha();
     
   }else{
     this.idSociedadAdministrada="0";
     
   }
 }


   onSelectCampanha(idCampanha:number):void{
    if (typeof idCampanha !== 'undefined') {
     this.idCampanha=idCampanha.toString();
     this.getListaProducto();
     
   }else{
     this.idCampanha="0";
     
   }
 }

 public getListaCuentaBrokerProductoCampanha(): void {

  this.portafolioMoliendaIFDService.getListaCuentaBrokerProductoCampanha().subscribe(
  (response: CargaCtaBrokerAsociada[]) => {
    this.listaCtaBrokerAsociada = response;
    this.dataSource = new MatTableDataSource(this.listaCtaBrokerAsociada);

    this.selection = new SelectionModel<CargaCtaBrokerAsociada>(true, []);
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
);

}


}




