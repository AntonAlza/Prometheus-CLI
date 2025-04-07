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
import { delay, tap } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { number } from 'echarts';
import { HostListener } from '@angular/core';
import { TypeOperation } from 'src/app/models/IFD/TypeOperation';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { PlanningByCampaign } from 'src/app/models/IFD/planningByCampaign';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { EstadoCierreIFD } from 'src/app/models/IFD/estadoCierrePortafolio';
import * as moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { SpinnerService } from '../../spinner.service';
import { LoadingService } from '../../loading.service';
import { cambiarEstadoIFDComponent } from './cambiarEstadoIFD.component';
import { Router } from '@angular/router';

@Component({
  
  selector: 'app-cierrePortafolio',
  templateUrl: './cierrePortafolio.component.html',
  styleUrls: ['./cierrePortafolio.component.scss']

  
})

export class cierrePortafolioComponent implements OnInit {

  public loading$= this.loader.loading$
  
  dateStart = new FormControl(moment());
  dateEnd = new FormControl(moment());

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
  public idEmpresa:number;
  public idSubyacente:number;

  public listaCierrePortafolio: EstadoCierreIFD[]=[];
  public listaCierrePortafolioOriginal: EstadoCierreIFD[]=[];
  
  public cierrePortafolio: EstadoCierreIFD;
  public flgCierrePortafolio: boolean = false;  
  public pNombreForm: string;  
  public pFechaInicio:string="";
  public pFechaFin:string="";  
  public  datePipe: DatePipe;
  public pPortafolioValidado:number=0;
  public disabled:Boolean=false;
  public disabledCurva:Boolean=false;
  public tipoCurva:number;

  public estadoValorizar:boolean=false;
  public estadoRegistro:boolean=false;
  public estadoValorizarT_N:boolean=false;
  public estadoValorizarT:boolean=false;
  
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
    'temp_fecha'
    //,'temp_ID'
    ,'temp_Ticker'
     ,'temp_Descripcion'
     ,'select'
    //,'estadoFactores'
    ,'estadoPrecio'
    ,'estadoVolatilidad'
    ,'estadoTasa'
    ,'estadoOperacion'
    ,'temp_fechaRegistro'
    ,'temp_Hora'

  ];

  dataSource: MatTableDataSource<EstadoCierreIFD>;
  selection = new SelectionModel<EstadoCierreIFD>(true, []);
  hidden = false;

  formGroup : FormGroup;

  constructor(private loader:LoadingService, private spinnerService:SpinnerService, private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
    private router: Router
  ) {
    // this.alwaysShowCalendars = true;

  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    this.checked = this.listaCierrePortafolioOriginal.filter(i => (i.temp_Estado )!==false );  
    const numRows = this.checked.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
        this.selection.clear() 
        // this.checked = this.listaCierrePortafolioOriginal.filter(i => (i.temp_Estado )===false );  
        // this.selection = new SelectionModel<EstadoCierreIFD>(true, this.checked);
        }
    else{    
        this.checked = this.listaCierrePortafolioOriginal.filter(i => (i.temp_Estado )!==false );  
        this.selection = new SelectionModel<EstadoCierreIFD>(true, this.checked);
          //this.dataSource.data.forEach(row => this.selection.select(row));
    }
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
      
      const a = new Date();
      this.dateStart = new FormControl(a);
      this.pFechaInicio=this.dateToString( { day: a.getDate(), month: a.getMonth()+1 , year: a.getFullYear()});
      this.dateEnd = new FormControl(a);
      this.pFechaFin=this.dateToString( { day: a.getDate(), month: a.getMonth()+1 , year: a.getFullYear()});
      
      this.disabled=false;
      //Cambiar a 1: Skew cuando se implemente
      // ATM:2
      this.tipoCurva=1
      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1  || this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
      //if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1) {
          this.disabledCurva = false;
        
      }
      else{
          this.disabledCurva = true;
      }
      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
        this.estadoAdministrador=true;
      }else if(  this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_IFD") > -1){
        this.estadoMOValorizar=true;
      }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
        this.estadoMOAprobacion=true;
      }else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1 ){
          this.estadoRegistroFO = true;
      }

      // Valorizar T-N y ATM
      if (this.estadoMOAprobacion || this.estadoAdministrador){
        this.estadoValorizarT_N=true;
      }
      else{this.estadoValorizarT_N=false;
      }




      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.getformattedDate();
      this.idEmpresa=this.portafolioMoliendaIFDService.codigoEmpresa;
      this.idSubyacente=this.portafolioMoliendaIFDService.producto;    
      //this.fecha=this.portafolioMoliendaIFDService.fecha;
      this.visible=true;
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      
      if (this.portafolioMoliendaIFDService.flagCierre){
          this.flgCierrePortafolio=true
          this.pNombreForm="Cierre de Portafolio " +" "+this.portafolioMoliendaIFDService.nombreFormulario
          this.getListaCierrePortafolio()    
          this.pPortafolioValidado=0;
      }
      else {
        this.flgCierrePortafolio=false
        this.pNombreForm="Deshacer cierre de Portafolio " +" "+this.portafolioMoliendaIFDService.nombreFormulario
        this.getListaDeshacerCierrePortafolio()
        this.pPortafolioValidado=0;
      }
      
    
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
    console.log("modal padre cerrado");
    this.getListaPlanningCampaign()

    this.myModal=false;
    
  }


  // getCheckbox() {
  //   this.checked = this.listaCierrePortafolio.filter(i => i.temp_Estado == true);
  // }

  // changeChkState(id) {
  //   this.listaCierrePortafolio.forEach(chk => {
  //     if (chk.temp_ID === id) {
  //       chk.temp_Estado = !chk.temp_Estado;
  //       this.getCheckbox();
  //     }
  //     else
  //     {
  //       chk.temp_Estado =false;

  //     }
  //   });
  // }  



 
  public getListaPlanningCampaign(): void {

      

  //   this.portafolioMoliendaIFDService.getListaPlanningCampaign().subscribe(
  //   (response: PlanningByCampaign[]) => {
  //     this.listaPlanningByCampaign = response;
  //     this.dataSource = new MatTableDataSource(this.listaPlanningByCampaign);

  //     this.selection = new SelectionModel<PlanningByCampaign>(true, []);
      
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;

  //   },
  //   (error: HttpErrorResponse) => {
  //     alert(error.message);
  //   }
  // );

}
public getListaCierrePortafolio(): void {


  if(Number(this.pFechaInicio<=this.pFechaFin))
  {
    this.portafolioMoliendaIFDService.getListaCierrePortafolio(Number(this.pFechaInicio),Number(this.pFechaFin),this.idEmpresa,this.tipoCurva).subscribe(
    (response: EstadoCierreIFD[]) => {
      this.listaCierrePortafolio = response;
      this.listaCierrePortafolioOriginal=[];
      this.listaCierrePortafolioOriginal = response;
      this.dataSource = new MatTableDataSource(this.listaCierrePortafolio);

      this.checked = this.listaCierrePortafolio.filter(i => (i.temp_Estado )!==false );  
      this.selection = new SelectionModel<EstadoCierreIFD>(true, this.checked);
      

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
  }
  else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar una fecha fin mayor a la fecha inicio.'  ,
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',
      }
    });
  }
}
public getListaDeshacerCierrePortafolio(): void {

      
if(Number(this.pFechaInicio)<=Number(this.pFechaFin))
{
  this.portafolioMoliendaIFDService.getListaDeshacerCierrePortafolio(Number(this.pFechaInicio),Number(this.pFechaFin),this.idEmpresa,this.tipoCurva).subscribe(
  (response: EstadoCierreIFD[]) => {
    this.listaCierrePortafolio = response;
    this.listaCierrePortafolioOriginal=[];
    this.listaCierrePortafolioOriginal = response;
    this.dataSource = new MatTableDataSource(this.listaCierrePortafolio);

    this.checked = this.listaCierrePortafolio.filter(i => (i.temp_Estado )!==false );  
    this.selection = new SelectionModel<EstadoCierreIFD>(true, this.checked);
    

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
);

}
else{
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Debe seleccionar una fecha fin mayor a la fecha inicio.'  ,
    confirmButtonColor: '#0162e8',
    customClass: {
    container: 'my-swal',
    }
  });
}

}


// eliminarLimiteEspecifico(fila: PlanningByCampaign){
  
//   this.myModal=true;
//     Swal.fire({
//       icon: 'warning',
//       title: 'Eliminar Límte especifico',
//       html: '¿Seguro que desea eliminar el límite <b>?',
//       showCancelButton: true,
//       cancelButtonText: 'Cancelar',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Continuar',
//       reverseButtons: true,
//       confirmButtonColor: '#4b822d'
//       }).then((result) => {
//       if (result.isConfirmed) {
//         this.planningByCampaign = new PlanningByCampaign;
//         this.indice=0;
//         this.planningByCampaign.t345_Season=Number(fila.t345_Season);
//         this.planningByCampaign.t345_OptionClass=Number(fila.t345_OptionClass);
//         this.planningByCampaign.t345_SpecificLimit=Number(fila.t345_SpecificLimit);
//         this.planningByCampaign.t345_Date=fila.t345_Date
//         this.planningByCampaign.t345_RegisteredBy=this.usuario;
//         this.planningByCampaign.t345_MetricTons=fila.t345_MetricTons;
//         this.planningByCampaign.t345_Status=0;

//         this.portafolioMoliendaIFDService.getEliminarLimiteEspecifico(this.planningByCampaign).subscribe(data=>{
//           Swal.fire({
//             position: 'center',
//             icon: 'success',
//             title: 'Se liquido la operación en la base de datos',
//             showConfirmButton: false,
//             timer: 1500,
//             customClass: {
//             container: 'my-swal',
      
//             }
//           });
//           this.cerrar();
//           this.getListaPlanningCampaign()
//           },
//           (error: HttpErrorResponse) => {
//               alert(error.message);
//           });
         
//         }
      
//       })
//   }
  
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
       
      if (this.portafolioMoliendaIFDService.flagCierre){
        this.getListaCierrePortafolio()    
       }
      else {
        this.getListaDeshacerCierrePortafolio()
      }
    
  }    
  dateRangeChange(s, e) {
    var pFechaInicio
    var pFechaFin
  
    if(s.value !=='undefined'){
        pFechaInicio=s.value
        s.value = pFechaInicio.split('/')[1];
    }
    else {
      s.value=''
    }
    if( e.value !=='undefined'){
      pFechaFin=e.value
      e.value = pFechaFin.split('/')[1];
    }
    else{
      e.value=''
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
     if (this.portafolioMoliendaIFDService.flagCierre){
      this.getListaCierrePortafolio()    
     }
    else {
      this.getListaDeshacerCierrePortafolio()
    }
  }  
  public cierrePortafolioMatlab(): void {
    var flagCierre:number=0;
    var cierreExistoso:Boolean=true;
    var subyacenteError:String="";
    var cantSubyacente:number;
    var totalSubyacente:number=0;  
    var cantSubyacenteSeleccionado:number;
    var arrFecha:number[]=[];
    var arrSubyacente:number[]=[];
    var indice:number=0;
    var opcion:number=0;
    arrFecha[0]=Number(this.pFechaInicio)
    arrFecha[1]=Number(this.pFechaFin)
    cantSubyacente=this.listaCierrePortafolio.length    
    cantSubyacenteSeleccionado=this.selection.selected.length



    this.checked = this.listaCierrePortafolioOriginal.filter(i => (i.temp_Estado )!==false);

    this.loader.show();

    setTimeout(() => {
      this.cerrar();
      this.router.navigate(['/ResultadoMetricaRiesgo']);
    }, 3000); // Delay de 2 segundos

    this.loader.hide();

    

  //   if (this.checked.length>0)
  //   {
  //     this.pPortafolioValidado=this. ValidarFactoresRiesgo();
  //     if (this.pPortafolioValidado==1)
  //     {
  //       if (cantSubyacenteSeleccionado===0){

  //         Swal.fire({
  //           position: 'center',
  //           icon: 'success',
  //           title: 'No se seleccionó ningún subyacente',
  //           showConfirmButton: false,
  //           timer: 1500,
  //           customClass: {
  //           container: 'my-swal',

  //           }
  //         });
  //         return


  //       }
  //       else {
  //         this.disabled=true;
  //         this.loader.show();
  //         for (let subyacenteCerrar of  this.selection.selected ){
  //           totalSubyacente=0
  //           if(  subyacenteCerrar != null  )
  //           { 
  //             arrSubyacente[0]=subyacenteCerrar.temp_ID
              
  //           }

  //           // if(  subyacenteCerrar != null  )
  //           // {
  //           //   arrSubyacente[indice]=subyacenteCerrar.temp_ID
  //           //   indice=indice+1
  //           // }
  //         // }
          
  //         // if (cantSubyacente==cantSubyacenteSeleccionado){
  //         //   totalSubyacente=1000 //Todos
  //         // }
  //         // else{
  //         //   totalSubyacente=0
  //         // }
  //       // }
  //       if (arrSubyacente.length>0)
  //       {
  //            // 0: ATM y tipo de curva 2
  //           // 1: Skew    y tipo de curva 1
  //           if(this.tipoCurva==1){
  //             opcion=1
  //           }else{
  //             opcion=0
  //           }

  //           if (this.portafolioMoliendaIFDService.flagCierre){
  //             if (this.pFechaInicio==this.pFechaFin && this.pFechaFin==this.fecha.toString()){
  //               // caso de cierre de portafolio el mismo día
  //               // this.disabled=true;
  //               // this.loader.show();
  //               this.portafolioMoliendaIFDService.getCierrePortafolioMatlab(arrFecha, this.idEmpresa,totalSubyacente ,arrSubyacente ,opcion,this.usuario).subscribe(
  //                   (response: number) => {
  //                     flagCierre =response;
  //                     indice=indice+1
  //                      //Mensaje de Cierre de Portafolio o error
  //                      cierreExistoso=flagCierre==1?true:false;
  //                      subyacenteError= flagCierre==1?"":subyacenteCerrar.temp_Ticker ;
  //                      this.getListaCierrePortafolio();
  //                      if (cantSubyacenteSeleccionado==indice){
  //                          if(cierreExistoso ){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'success',
  //                            title: 'Se realizó el cierre del portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                        else if (subyacenteError!=""){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'error',
  //                            title: 'Error en la valorización del portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                          this.disabled=false;
  //                          this.loader.hide();
  //                          this.getListaCierrePortafolio();
  //                      }
  //                   },
  //                   (error: HttpErrorResponse) => {
  //                     alert(error.message);
  //                   }
  //                 );    
  //               }
  //               else{
  //                 // falta validar el perfil del usuario
  //                 // reproceso se debe utilizar tabla temporal los datos de los dias T-n.
  //                 // this.disabled=true;
  //                 // this.loader.show();
  //                 this.portafolioMoliendaIFDService.getReprocesoPortafolioMatlab(arrFecha, this.idEmpresa,totalSubyacente ,arrSubyacente ,opcion,this.usuario).subscribe(
  //                   (response: number) => {
  //                     flagCierre =response;
  //                     indice=indice+1
  //                      //Mensaje de Cierre de Portafolio o error
  //                      cierreExistoso=flagCierre==1?true:false;
  //                      subyacenteError= flagCierre==1?"":subyacenteCerrar.temp_Ticker ;
  //                      this.getListaCierrePortafolio();
  //                      if (cantSubyacenteSeleccionado==indice){
  //                          if(cierreExistoso ){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'success',
  //                            title: 'Se realizó el cierre del portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                        else if (subyacenteError!=""){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'error',
  //                            title: 'Error en la valorización del portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                          this.disabled=false;
  //                          this.loader.hide();
  //                          this.getListaCierrePortafolio();
  //                      }
  //                   //   if (flagCierre==1){
  //                   //   //Mensaje de Cierre de Portafolio o error
  //                   //   Swal.fire({
  //                   //     position: 'center',
  //                   //     icon: 'success',
  //                   //     title: 'Se realizó el reproceso del portafolio',
  //                   //     showConfirmButton: false,
  //                   //     timer: 1500,
  //                   //     customClass: {
  //                   //     container: 'my-swal',
  //                   //     }
                        
  //                   //   });
  //                   // }
  //                   // else{
  //                   //   Swal.fire({
  //                   //     position: 'center',
  //                   //     icon: 'error',
  //                   //     title: 'Error en la valorización del portafolio',
  //                   //     showConfirmButton: false,
  //                   //     timer: 1500,
  //                   //     customClass: {
  //                   //     container: 'my-swal',
  //                   //     }
                        
  //                   //   });
  //                   // }
  //                   //   this.disabled=false;
  //                   //   this.loader.hide();
  //                   //   this.getListaCierrePortafolio();
  //                   },
  //                   (error: HttpErrorResponse) => {
  //                     alert(error.message);
  //                   }
  //                 );
  //               }
  //             }
  //             // caso deshacer cierre
  //             else{
  //               if (this.pFechaInicio==this.pFechaFin && this.pFechaFin==this.fecha.toString()){
  //                 this.portafolioMoliendaIFDService.getDeshacerCierrePortafolioMatlab(arrFecha, this.idEmpresa,totalSubyacente ,arrSubyacente ,0,this.usuario).subscribe(
  //                   (response: number) => {
  //                     flagCierre =response;
  //                     indice=indice+1
  //                      //Mensaje de Cierre de Portafolio o error
  //                      cierreExistoso=flagCierre==1?true:false;
  //                      subyacenteError= flagCierre==1?"":subyacenteCerrar.temp_Ticker ;
  //                      this.getListaDeshacerCierrePortafolio();
  //                      if (cantSubyacenteSeleccionado==indice){
  //                          if(cierreExistoso ){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'success',
  //                            title: 'Se volvio abrir el portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                        else if (subyacenteError!=""){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'error',
  //                            title: 'Error al volver abrir el portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                          this.disabled=false;
  //                          this.loader.hide();
  //                          this.getListaDeshacerCierrePortafolio();
  //                      }
  //                     // flagCierre =response;
  //                     // //Mensaje de Cierre de Portafolio o error
  //                     // Swal.fire({
  //                     //   position: 'center',
  //                     //   icon: 'success',
  //                     //   title: 'Se volvio abrir el portafolio',
  //                     //   showConfirmButton: false,
  //                     //   timer: 1500,
  //                     //   customClass: {
  //                     //   container: 'my-swal',
  //                     //   }
  //                     // });
  //                     // this.getListaDeshacerCierrePortafolio();
  //                     // this.disabled=false;
  //                     // this.loader.hide();
  //                   },
  //                   (error: HttpErrorResponse) => {
  //                     alert(error.message);
  //                   }
  //                 );
  //               }
  //               else{
  //                 // falta validar el perfil del usuario
  //                 // reproceso se debe guardar en tabla temporal los datos de los dias T-n.
  //                 this.portafolioMoliendaIFDService.getDeshacerReprocesoPortafolioMatlab(arrFecha, this.idEmpresa,totalSubyacente ,arrSubyacente ,opcion,this.usuario).subscribe(
  //                   (response: number) => {
  //                     flagCierre =response;
  //                     indice=indice+1
  //                      //Mensaje de Cierre de Portafolio o error
  //                      cierreExistoso=flagCierre==1?true:false;
  //                      subyacenteError= flagCierre==1?"":subyacenteCerrar.temp_Ticker ;
  //                      this.getListaDeshacerCierrePortafolio();
  //                      if (cantSubyacenteSeleccionado==indice){
  //                          if(cierreExistoso ){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'success',
  //                            title: 'Se volvio abrir el portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                        else if (subyacenteError!=""){
  //                          Swal.fire({
  //                            position: 'center',
  //                            icon: 'error',
  //                            title: 'Error al volver abrir el portafolio',
  //                            showConfirmButton: false,
  //                            timer: 1500,
  //                            customClass: {
  //                            container: 'my-swal',
  //                            }
                             
  //                          });
  //                        }
  //                          this.disabled=false;
  //                          this.loader.hide();
  //                          this.getListaDeshacerCierrePortafolio();
  //                      }
  //                     // flagCierre =response;
  //                     // //Mensaje de Cierre de Portafolio o error
  //                     // Swal.fire({
  //                     //   position: 'center',
  //                     //   icon: 'success',
  //                     //   title: 'Se volvio abrir el portafolio para el reproceso',
  //                     //   showConfirmButton: false,
  //                     //   timer: 1500,
  //                     //   customClass: {
  //                     //   container: 'my-swal',
  //                     //   }
  //                     // });
  //                     // this.getListaDeshacerCierrePortafolio();
  //                     // this.disabled=false;
  //                     // this.loader.hide();
  //                   },
  //                   (error: HttpErrorResponse) => {
  //                     alert(error.message);
  //                   }
  //                 );
  //               }
  //             }
  //       } 
  //       else{
  //           Swal.fire({
  //           position: 'center',
  //           icon: 'error',
  //           title: 'Debe seleccionar algún subyacente.'  ,
  //           confirmButtonColor: '#0162e8',
  //           customClass: {
  //           container: 'my-swal',
  //           }
  //         });
  //       }
  //     }//fin for
  //     // if(flagCierre==1 ){
  //     //     Swal.fire({
  //     //       position: 'center',
  //     //       icon: 'success',
  //     //       title: 'Se realizó el cierre del portafolio',
  //     //       showConfirmButton: false,
  //     //       timer: 1500,
  //     //       customClass: {
  //     //       container: 'my-swal',
  //     //       }
            
  //     //     });
  //     //   }
  //     //   else{
  //     //     Swal.fire({
  //     //       position: 'center',
  //     //       icon: 'error',
  //     //       title: 'Error en la valorización del portafolio',
  //     //       showConfirmButton: false,
  //     //       timer: 1500,
  //     //       customClass: {
  //     //       container: 'my-swal',
  //     //       }
            
  //     //     });
  //     //   }
  //     //   this.disabled=false;
  //     //   this.loader.hide();
  //     //   this.getListaCierrePortafolio();
  //     }
  // }
  // // else{
  // //     Swal.fire({
  // //     position: 'center',
  // //     icon: 'error',
  // //     title: 'Debe validar el portafolio antes de valorizar.'  ,
  // //     confirmButtonColor: '#0162e8',
  // //     customClass: {
  // //     container: 'my-swal',
  // //     }
  // //   });
  // // }
  //   }
  }


  public ValidarFactoresRiesgo(): number {
    
    
    this.pPortafolioValidado=0;
    //Valida cuando se quiere realizar cierre de portafolio
    
    this.checked=[];
    if (this.portafolioMoliendaIFDService.flagCierre){    
      this.checked = this.selection.selected.filter(i => (i.temp_CierrePrecio)===false );  
      if (this.checked.length>0 ){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Revisar la carga de los precios.'  ,
            confirmButtonColor: '#0162e8',
            customClass: {
            container: 'my-swal',
            }
          });
        return 0;
      }
      this.checked = this.selection.selected.filter(i => (i.temp_CierreVolatilidad)===false );  
      if (this.checked.length>0 ){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Revisar la carga de las volatilidades.'  ,
            confirmButtonColor: '#0162e8',
            customClass: {
            container: 'my-swal',
            }
          });
          return 0;
      }
      this.checked = this.selection.selected.filter(i => (i.temp_CierreTasa)===false );  
        if (this.checked.length>0 ){
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Revisar la carga de las tasas.'  ,
              confirmButtonColor: '#0162e8',
              customClass: {
              container: 'my-swal',
              }
            });
            //return 0;
        }
        this.checked = this.selection.selected.filter(i => (i.temp_CierreOperacion)===false );  
        if (this.checked.length>0 ){
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Revisar que las operaciones tengan estrategias asociadas.'  ,
              confirmButtonColor: '#0162e8',
              customClass: {
              container: 'my-swal',
              }
            });
            return 0;
        }
           
    }
    //caso deshacer de cierre de portafolio
    else{
      //para el deshacer el cierre no importa si tiene los factores de riesgo cargados
      return 1;
    }
    return 1;
  }

  modalCambiarEstadoIFD(detalleForm:any){
  
            console.log("modal abierto");
            this.myModal=true;
            this.portafolioMoliendaIFDService.nombreFormulario="Cambiar Estado IFD"
            this.portafolioMoliendaIFDService.tipoCurva=this.tipoCurva
            const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classCambiarEstadoIFD"});
            //const modalRef =this.modalService.open(cambiarEstadoIFDComponent,{windowClass : "my-classCambiarEstadoIFD"});
            //clearInterval()
          
    }//fin de método      
    onCheckChangeCheck(event){
       if(event.target.checked){
        // SKEW =1
        this.tipoCurva=1
      //   this.tituloTabla="Ventas Molienda Diferidas";
      //   this.postCierre=true;
      //   this.getPortafolioMoliendaCierre(this.companiaSelected)
      }
      else{
        //ATM=2
        this.tipoCurva=2
      }
      if (this.portafolioMoliendaIFDService.flagCierre){
        this.getListaCierrePortafolio()    
     }
      else {
      this.getListaDeshacerCierrePortafolio()
     }
    }
  
  }