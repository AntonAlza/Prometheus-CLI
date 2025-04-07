import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
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
import { ListaoperacionesBroker_IDSQL } from 'src/app/models/IFD/listaoperacionesBroker_IDSQL';
import { AsociarSQL } from 'src/app/models/IFD/asociarSQL';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { number } from 'echarts';
import { HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Campaign } from 'src/app/models/IFD/campaign';
import { IFDSinEstrategia } from 'src/app/models/IFD/ifdSinEstrategia';
import { Estrategia } from 'src/app/models/IFD/estrategia';
import { DetalleLimite } from 'src/app/models/IFD/detalleLimite';
import { AlertLimit } from 'src/app/models/IFD/alertLimit';
import { ModificarEstrategia } from 'src/app/models/IFD/modificarEstrategia';
import { Descripcion } from 'src/app/models/IFD/descripcion';


import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //required for 
import { BrowserModule } from '@angular/platform-browser';
import { Companias } from 'src/app/models/IFD/companias';


@Component({
  
  selector: 'app-registroEstrategia',
  templateUrl: './registroEstrategia.component.html',
  styleUrls: ['./registroEstrategia.component.scss']

  
})

export class registroEstrategiaComponent implements OnInit {

  styleElement: HTMLStyleElement;
  colors : Array<string> = ["#4b822d", "#f7ef09","#e2770d","#ff1100","#adacacf6"];
  data: Observable<any>;

  isLoading = false;
  typeSelected: string;
  isOverlay = false;




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

  public listaPortafolio:CargarCombo[];
  public listaEstrategia:CargarCombo[];
  public listaFicha:CargarCombo[];
  public listaProteccion:CargarCombo[];
  public listaCampaign: Campaign [] = [];
  public listaOptionClass:CargarCombo[];
  public listaSpecificLimit:CargarCombo[];
  public listaIFDSinEstrategia: IFDSinEstrategia[] = [];
  public listaIFDConEstrategia: IFDSinEstrategia[] = [];
  public siModificar:Boolean=false;

  public operacionIFDSinEstrategia: IFDSinEstrategia;
  public nuevaestrategia: Estrategia;
  public modificarEstrategia:ModificarEstrategia;
  public detalleLimite:DetalleLimite;
  public alertLimit:AlertLimit[]=[];
  

  public idEstrategia:string;
  public idTipoEstrategia:string;
  public idPortafolio:string;
  public idFicha:string
  public idProteccion:string
  public idCampaign:string
  public idOptionClass:string
  public idSpecificLimit:string
  public tmReferencia:number=0;
  public idEmpresa:number;
  public pNombreForm:string;
  public toneladasMetrica:number
  public TMLimite:number
  public TMSaldo:number
  public TMUtilizado :number
  public semaforo:string;
  public ratio:number;
  public limiteP2:number;
  public caksIguales:number;  
  public idNuevaFicha:string
  public existeEstrategia:boolean;  
  public noMostrarCampo:Boolean
  public esNuevaEstrategiaT:Boolean
  
  
  
  // @ViewChild('MatPaginator', { static: true }) MatPaginator!: MatPaginator;
  // @ViewChild('MatSort') MatSort!: MatSort;
  public compania: Companias  [] = [];



  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('MatPaginatorSQL', { static: true }) MatPaginatorSQL!: MatPaginator;
  @ViewChild('MatSortSQL') MatSortSQL!: MatSort;


  
  
  myModal=false;
  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  //public  visible: boolean;

  displayedColumnsSQL: string[] = [
    'selectSQL',
    'temp_idSQL'
    ,'temp_caks'
    ,'temp_instrumento'
    ,'temp_ticker'
    ,'temp_strike'
    ,'temp_prima'
    ,'temp_tipo'
    
   ];

   displayedColumns: string[] = [
    'select',
    'temp_idSQL'
    ,'temp_caks'
    ,'temp_instrumento'
    ,'temp_ticker'
    ,'temp_strike'
    ,'temp_prima'
    ,'temp_tipo'
    
   ];

   dataSource: MatTableDataSource<IFDSinEstrategia>;
   selection = new SelectionModel<IFDSinEstrategia>(true, []);
   hidden = false;

   dataSourceSQL: MatTableDataSource<IFDSinEstrategia>;
   selectionSQL = new SelectionModel<IFDSinEstrategia>(true, []);
   hiddenSQL = false;
 
  formGroup : FormGroup;

  constructor(private spinnerService: NgxSpinnerService,  private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.alwaysShowCalendars = true;
    

  }
  

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    var unavez:Boolean=false
    return numSelected === numRows;
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isSomeSelected()) {
      this.selection.clear();
      this.tmReferencia=0;
    } else {
    if (this.isAllSelected()){
      this.selectionSQL.clear()   
    }
    else{
      this.dataSource.data.forEach(row => this.selection.select(row));
      for (let operacionIFDSinEstrategia of  this.selection.selected ){
              this.tmReferencia=this.tmReferencia+ operacionIFDSinEstrategia.temp_VolumeTons
            }
      
    }
    

  } 
} 


isAllSelectedSQL() {
  const numSelected = this.selectionSQL.selected.length;
  const numRows = this.dataSourceSQL.data.length;
  var unavez:Boolean=false
  return numSelected === numRows;
}


/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggleSQL() {
  if (this.isSomeSelected()) {
    this.selectionSQL.clear();
    this.tmReferencia=0;
  } else {
  if (this.isAllSelectedSQL()){
    this.selectionSQL.clear()   
  }
  // else{
  //   this.dataSourceSQL.data.forEach(row => this.selectionSQL.select(row));
  //   for (let operacionIFDSinEstrategia of  this.selectionSQL.selected ){
  //           this.tmReferencia=this.tmReferencia+ operacionIFDSinEstrategia.temp_VolumeTons
  //         }
  // }
  

} 
} 




SingleSelection(row2, event){
  const numSelected = this.selectionSQL.selected.length;
  this.tmReferencia=0;
// aca me quedo
    // if (numSelected>0){
    //         if (numSelected==1){
    //           if (event.checked){
    //             this.tmReferencia=this.selectionSQL.selected[0].temp_VolumeTons;
    //           }  
    //           else{
    //             this.tmReferencia=0;
    //           }
    //         }
    //         else{
    //           if (event.checked){
    //                   this.tmReferencia=this.selectionSQL.selected[0].temp_VolumeTons;
    //           }
    //           else{
    //             if (row2.temp_VolumeTons!=this.selectionSQL.selected[0].temp_VolumeTons ){
    //               this.tmReferencia=this.selectionSQL.selected[0].temp_VolumeTons;
    //             }
    //             else{
    //               this.tmReferencia=this.selectionSQL.selected[1].temp_VolumeTons;
    //             }
    //           }
    //         }
    // }
    // else{
    //       if (event.checked){
    //         this.tmReferencia=this.tmReferencia+ row2.temp_VolumeTons
    //       }
    // }
    // //caso seleccionar de un lado a otro
    // if (event.checked){
      this.tmReferencia=0;

      var numFila:number
      var instrumentoAnt:string="";
      var volumenTMAnt:number=0;
      
      
      numFila=this.listaIFDConEstrategia.length
      this.listaIFDConEstrategia[numFila]=new IFDSinEstrategia();
      this.listaIFDConEstrategia[numFila]=row2;
      this.dataSourceSQL = new MatTableDataSource(this.listaIFDConEstrategia);
      this.selectionSQL = new SelectionModel<IFDSinEstrategia>(true, []);
      this.dataSourceSQL.paginator = this.MatPaginatorSQL;
      this.dataSourceSQL.sort = this.MatSortSQL;

      this.checked = this.listaIFDSinEstrategia.filter(i => (i.temp_idSQL)!==row2.temp_idSQL );  
      this.listaIFDSinEstrategia=this.checked;
      this.dataSource = new MatTableDataSource(this.listaIFDSinEstrategia);
      this.selection = new SelectionModel<IFDSinEstrategia>(true, []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    // }
    instrumentoAnt=this.listaIFDConEstrategia[0].temp_instrumento
    volumenTMAnt=this.listaIFDConEstrategia[0].temp_VolumeTons
    for (let operacionIFDSinEstrategia of  this.listaIFDConEstrategia ){
        if( instrumentoAnt==operacionIFDSinEstrategia.temp_instrumento && operacionIFDSinEstrategia.temp_caks>0){
           this.tmReferencia=this.tmReferencia+ operacionIFDSinEstrategia.temp_VolumeTons
           volumenTMAnt=this.tmReferencia;
           instrumentoAnt=operacionIFDSinEstrategia.temp_instrumento
        }
        else{
          if (volumenTMAnt<=operacionIFDSinEstrategia.temp_VolumeTons)
          this.tmReferencia =operacionIFDSinEstrategia.temp_VolumeTons
          instrumentoAnt=operacionIFDSinEstrategia.temp_instrumento
        }
    }
    
  
}
SingleSelectionSQL(row2, event){
    const numSelected = this.selectionSQL.selected.length;
    this.tmReferencia=0;
    var numFila:number
    var instrumentoAnt:string="";
    var volumenTMAnt:number=0;
    //if (event.checked){
      
      var numFila:number
      numFila=this.listaIFDSinEstrategia.length
      this.listaIFDSinEstrategia[numFila]=new IFDSinEstrategia();
      this.listaIFDSinEstrategia[numFila]=row2;
      this.dataSource = new MatTableDataSource(this.listaIFDSinEstrategia);
      this.selection = new SelectionModel<IFDSinEstrategia>(true, []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.checked = this.listaIFDConEstrategia.filter(i => (i.temp_idSQL)!==row2.temp_idSQL );  
      this.listaIFDConEstrategia=this.checked;
      this.dataSourceSQL = new MatTableDataSource(this.listaIFDConEstrategia);
      this.selectionSQL = new SelectionModel<IFDSinEstrategia>(true, []);
      this.dataSourceSQL.paginator = this.MatPaginatorSQL;
      this.dataSourceSQL.sort = this.MatSortSQL

      instrumentoAnt=this.listaIFDConEstrategia[0].temp_instrumento
      volumenTMAnt=this.listaIFDConEstrategia[0].temp_VolumeTons
      for (let operacionIFDSinEstrategia of  this.listaIFDConEstrategia ){
          //if( instrumentoAnt==operacionIFDSinEstrategia.temp_instrumento){
           if( instrumentoAnt==operacionIFDSinEstrategia.temp_instrumento && operacionIFDSinEstrategia.temp_caks>0){
            this.tmReferencia=this.tmReferencia+ operacionIFDSinEstrategia.temp_VolumeTons
            volumenTMAnt=this.tmReferencia;
            instrumentoAnt=operacionIFDSinEstrategia.temp_instrumento
          }
          else{
            if (volumenTMAnt<=operacionIFDSinEstrategia.temp_VolumeTons)
            this.tmReferencia =operacionIFDSinEstrategia.temp_VolumeTons
            instrumentoAnt=operacionIFDSinEstrategia.temp_instrumento
          }
      }
      
    
}


  isSomeSelected() {
    console.log(this.selectionSQL.selected);
    return this.selectionSQL.selected.length > 0;
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
    
    
    this.typeSelected = 'ball-clip-rotate';

    this.styleElement = document.createElement('style');
      //this.fecha=20220225;//20220307;//20220225;
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.getformattedDate();
      this.getCompanias();
      this.idEmpresa= this.portafolioMoliendaIFDService.codigoEmpresa;
      if (this.portafolioMoliendaIFDService.operacionSQL!=undefined){
        if(this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoEstrategia==undefined || this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoEstrategia==0){
          this.esNuevaEstrategiaT=true;
        }else{
          this.esNuevaEstrategiaT=false;
        }
      }
      else {
        this.esNuevaEstrategiaT=true;
      }

            
      //this.fecha=this.portafolioMoliendaIFDService.fecha;
      this.visible=true;
      this.getListaTipoEstrategia();
      this.getListaPortafolio();
      this.getListaFicha();
      this.getListaProteccion();
      this.getListaCampaign()
      this.getListaOptionClass();
      this.getListaSpecificLimit();
      this.getListaIFDSinEstrategia(this.idEmpresa);
      this.getListaLimiteGeneral();
      this.getAlertLimit();
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      this.MatPaginatorSQL._intl.itemsPerPageLabel="Registros por Página";
      if(this.portafolioMoliendaIFDService.nombreFormulario.toUpperCase()==="Modificar".toUpperCase()){
        this.idEstrategia=this.portafolioMoliendaIFDService.idEstrategia
        this.noMostrarCampo=false;
        this.cargarValoresEstrategia();
      }
      else{
          //// Generar codigo Estrategia
          this.noMostrarCampo=false;
          this.getNuevoCodigoEstrategia();
      }
}


public getCompanias(): void {
  this.portafolioMoliendaIFDService.getCompanias().subscribe(
    (response: Companias[]) => {
      this.compania = response;
      this.pNombreForm=this.compania.find(x=>x.t060_ID==this.idEmpresa)?.t060_Description +" - "+  this.portafolioMoliendaIFDService.nombreFormulario + ' Estrategia';
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}


applyFilterSQL(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceSQL.filter = filterValue.trim().toLowerCase();
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  cerrar() {
    //this.modalReference.close();
    this.closeModal();
    this.modalService.dismissAll();
  }


  cerrarModal(e){
    console.log("modal padre cerrado");
    //this.getListaPlanningCampaign()
    this.myModal=false;
    e.close();

    
  }


  public getListaTipoEstrategia(): void {
    this.portafolioMoliendaIFDService.getListaTipoEstrategia().subscribe(
      (response: CargarCombo[]) => {
        this.listaEstrategia = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getListaPortafolio(): void {
    this.portafolioMoliendaIFDService.getListaPortafolio(this.idEmpresa).subscribe(
      (response: CargarCombo[]) => {
        this.listaPortafolio = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaFicha(): void {
    this.portafolioMoliendaIFDService.getListaFicha().subscribe(
      (response: CargarCombo[]) => {
        this.listaFicha = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getListaProteccion(): void {
    this.portafolioMoliendaIFDService.getListaProteccionMolienda().subscribe(
      (response: CargarCombo[]) => {
        this.listaProteccion = response;
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
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );

}

public getNuevoCodigoEstrategia(): void {
  this.portafolioMoliendaIFDService.getNuevoCodigoEstrategia().subscribe(
          (response: string) => {
            this.idEstrategia =response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
    );
}

public getTMTotalLimite(idCampaign:number,idOptionClass:number,idSpecificLimit:number): void {
  this.portafolioMoliendaIFDService.getTMTotalLimite(idCampaign,idOptionClass,idSpecificLimit).subscribe(
          (response: string) => {
            this.TMLimite =Number(response);
            this.getTMUtilizado(Number(this.idOptionClass) ,Number(this.idCampaign))
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
    );
}

public getTMUtilizado(idOptionClass:number,idCampaign:number,): void {
    this.portafolioMoliendaIFDService.getTMUtilizado(idOptionClass,idCampaign).subscribe(
          (response: string) => {
            this.TMUtilizado =Number(response.toString().substring(0,response.toString().indexOf('.',1)+3))
            //this.TMSaldo=this.TMLimite-this.TMUtilizado
            this.activarSemaforo()
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

public getListaSpecificLimit(): void {
  this.portafolioMoliendaIFDService.getListaSpecificLimit().subscribe(
    (response: CargarCombo[]) => {
      this.listaSpecificLimit = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}
public getListaLimiteGeneral(): void {
//cambiar fecha 
  this.portafolioMoliendaIFDService.getListaLimiteGeneral(20220510, this.idEmpresa ).subscribe(
    (response: DetalleLimite) => {
      this.detalleLimite = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public getAlertLimit(): void {

  this.portafolioMoliendaIFDService.getAlertLimit().subscribe(
    (response: AlertLimit[]) => {
      this.alertLimit = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}


onSelectProteccion(id:string){
  if (typeof id !== 'undefined') {
   this.idProteccion=id.toString();
   this.activarSemaforo();
  }
  
}

public activarSemaforo():void{
  //validar semaforo
  this.ratio=0;
  if (this.idProteccion==='4'   ){
    this.checked = this.alertLimit.filter(i => (i.t109_Start)<=this.detalleLimite[0].s052_Ratio && (i.t109_End)> this.detalleLimite[0].s052_Ratio);
    this.limiteP2=Math.abs(this.detalleLimite[0].s052_Objetivo)
    if (this.checked.length>0 ){
        this.semaforo=this.checked[0].t109_Description;
        this.ratio=this.detalleLimite[0].s052_Ratio
    }
  }
  //caso de c.c o pricing
  else{
    var ratio:number
    ratio=this.TMUtilizado/this.TMLimite  
    this.checked = this.alertLimit.filter(i => (i.t109_Start)<=ratio && (i.t109_End)> ratio);
    if (this.checked.length>0 ){
        this.semaforo=this.checked[0].t109_Description;
        this.ratio=ratio
    }

  }
  this.changeColors()
}

onSelectEstrategia(id:string){
  if (typeof id !== 'undefined') {
   this.idTipoEstrategia=id.toString();
   this.activarSemaforo()
   //ver el tipo de caks si son iguales
   
   this.estrategiaCaksIguales(Number(this.idTipoEstrategia))
  }
}
onSelectPortafolio(id:string){
  if (typeof id !== 'undefined') {
   this.idPortafolio=id.toString();
   this.activarSemaforo()
  }
}

onSelectFicha(id:string){
  if (typeof id !== 'undefined') {
   this.idFicha=id.toString();
   this.siModificar=true;
  }
}

onSelectCampaign(id:string){
  if (typeof id !== 'undefined') {
   this.idCampaign=id.toString();
   this.siModificar=true;
  }
  if(typeof this.idCampaign!== 'undefined')
   if(typeof this.idOptionClass!== 'undefined')
   if (typeof this.idSpecificLimit!== 'undefined'){
      this.getTMTotalLimite(Number(this.idCampaign),Number(this.idOptionClass), Number(this.idSpecificLimit))
      
   }

}
onSelectClaseOption(id:string){
  if (typeof id !== 'undefined') {
   this.idOptionClass=id.toString();
  }
  if(typeof this.idCampaign!== 'undefined')
   if(typeof this.idOptionClass!== 'undefined')
   if (typeof this.idSpecificLimit!== 'undefined'){
    this.getTMTotalLimite(Number(this.idCampaign),Number(this.idOptionClass), Number(this.idSpecificLimit))
    
    
  }
}

onSelectLimitSpecific(id:string){
  if (typeof id !== 'undefined') {
   this.idSpecificLimit=id.toString();
  }
  if(typeof this.idCampaign!== 'undefined')
   if(typeof this.idOptionClass!== 'undefined')
   if (typeof this.idSpecificLimit!== 'undefined'){
    this.getTMTotalLimite(Number(this.idCampaign),Number(this.idOptionClass), Number(this.idSpecificLimit))
    
    
  }
}

public showSpinner(): void {
  this.spinnerService.show();

  setTimeout(() => {
    this.spinnerService.hide();
  }, 5000); // 5 seconds
}


public getListaIFDSinEstrategia(empresa: number): void {

    

  this.portafolioMoliendaIFDService.getListaIFDSinEstrategia(empresa).subscribe(
  (response: IFDSinEstrategia[]) => {
    


    
    this.listaIFDSinEstrategia = response;
    this.dataSource = new MatTableDataSource(this.listaIFDSinEstrategia);
    this.selection = new SelectionModel<IFDSinEstrategia>(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.listaIFDConEstrategia = [];
    this.dataSourceSQL = new MatTableDataSource(this.listaIFDConEstrategia);
    this.selectionSQL = new SelectionModel<IFDSinEstrategia>(true, []);
    this.dataSourceSQL.paginator = this.MatPaginatorSQL;
    this.dataSourceSQL.sort = this.MatSortSQL;

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
  );
}


guardarEstrategia(){
    this.myModal=true;
    console.log('Selecion de Operacion  SQL'+this.listaIFDConEstrategia.length);

    this.siModificar=false
    
    if (this.validarEstrategia()){
      if (this.listaIFDConEstrategia.length>0)
      {
          this.nuevaestrategia = new Estrategia;
          this.nuevaestrategia.codEstrategia=Number(this.idEstrategia)
          this.nuevaestrategia.idTipoEstrategia=Number(this.idTipoEstrategia)
          this.nuevaestrategia.idPortafolio=Number(this.idPortafolio)
          this.nuevaestrategia.idFicha=Number(this.idFicha)
          this.nuevaestrategia.nuevaFicha=this.idNuevaFicha
          this.nuevaestrategia.idTipoCobertura=Number(this.idProteccion)
          if (this.idProteccion==='4'){
            // this.nuevaestrategia.idCampanha=NaN
            // this.nuevaestrategia.idClaseOpcion =NaN
            // this.nuevaestrategia.idLimiteEspecifico =NaN
            this.nuevaestrategia.idCampanha=0
            this.nuevaestrategia.idClaseOpcion =0
            this.nuevaestrategia.idLimiteEspecifico =0
          }
          else{
            this.nuevaestrategia.idCampanha=Number(this.idCampaign )
            this.nuevaestrategia.idClaseOpcion =Number(this.idOptionClass)
            this.nuevaestrategia.idLimiteEspecifico =Number(this.idSpecificLimit)
          }
          this.nuevaestrategia.tmCubrir=Number(this.tmReferencia);
          this.nuevaestrategia.usuario=this.usuario
          this.nuevaestrategia.fecha=this.fecha
          this.nuevaestrategia.ifdSinEstrategia =this.listaIFDConEstrategia
          
   
          // guardar si es nuevo
          // guardar si es nuevo
          //modiificar el dia  dia T
          //if(this.portafolioMoliendaIFDService.nombreFormulario.toUpperCase()!=="Modificar".toUpperCase())
          if (this.esNuevaEstrategiaT)
          { //dd
              this.portafolioMoliendaIFDService.guardarEstrategia(this.nuevaestrategia).subscribe(data=>{
                this.portafolioMoliendaIFDService.actualizarVistaFret(this.nuevaestrategia.codEstrategia,this.nuevaestrategia.usuario).subscribe(
                  (response: boolean) => {
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  }
                );
                if(this.portafolioMoliendaIFDService.nombreFormulario.toUpperCase()!=="Modificar".toUpperCase()){
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Se registro la estrategia en la base de datos',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                    container: 'my-swal',
                    }
                  });
                }
                else{
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Se actualizó la estrategia en la base de datos',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                    container: 'my-swal',
                    }
                  });
                }
              //this.cargarValoresIniciales()
              this.cerrar();
              //this.cargarValoresEstrategia();
              },
              (error: HttpErrorResponse) => {
                if(error.error.message.includes('ConstraintViolationException')){
                  //this.flgBontonContrato = true;
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
          //caso guardar el modificar luego del dia T
          //caso guardar el modificar en el dia T+n
        else{
          // caso que fecha sea T+n
          //this.fecha=this.fecha-1;
          if (this.modificarEstrategia.temp_fecha!=this.fecha)
          {
            this.siModificar=true
          }
          if (this.siModificar){ 
            this.nuevaestrategia.modificacionT=false;
            this.portafolioMoliendaIFDService.actualizarEstrategia(this.nuevaestrategia).subscribe(data=>{
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se envió para aprobar la modificación de la estrategia',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
            container: 'my-swal',
            }
          });
          this.cerrar();
          //this.cargarValoresEstrategia()
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        }
        //caso guardar el modificar en el dia T+1
        else{
            if (this.modificarEstrategia.temp_fecha==this.fecha){
              this.nuevaestrategia.modificacionT=true;
              this.portafolioMoliendaIFDService.actualizarEstrategia(this.nuevaestrategia).subscribe(data=>{
              Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se actualizó la estrategia.',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
              container: 'my-swal',
              }
              });
              this.cerrar();
              //this.cargarValoresEstrategia()
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
            }
        }
      }
        
      } //PRIMER IF
      else{
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No ha seleccionado ninguna estrategia para registrar a la base datos',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
      }
    }
    this.closeModal();
}
validarEstrategia():boolean{
  var caks:number;
  var tickerInicial:string;
  console.log(this.selectionSQL.selected);
  this.indice=0;
  this.existeEstrategia=false
  this.operacionIFDSinEstrategia= new IFDSinEstrategia;

  if (this.idTipoEstrategia ==undefined){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar el tipo de estrategia.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
      return false
  }
  else{
    if (this.idPortafolio ==undefined){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar el portafolio.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',
  
        }
      });
      return false
    }
    else{
      if (this.idFicha ==undefined && (this.idNuevaFicha===undefined || this.idNuevaFicha==='')){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar una ficha o escribir una nueva.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
    
          }
        });
        return false
      }
    }
  }

  if (this.idProteccion ==undefined){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar el tipo de protección.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;
  }
  else{
    if (this.idProteccion !=='4' && this.idCampaign ==undefined){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar la campaña.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',
  
        }
      });
      return false
    }
    else{
      if (this.idProteccion !=='4' && this.idOptionClass ==undefined){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar el tipo de opción.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
    
          }
        });
        return false
      }
      else{
        if (this.idProteccion !=='4' && this.idSpecificLimit ==undefined){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Debe seleccionar el límite específico.',
            confirmButtonColor: '#0162e8',
            customClass: {
            container: 'my-swal',
      
            }
          });
          return false
        }
      } 
    }
  }


  if (this.listaIFDConEstrategia.length>0)
  {
     caks=Math.abs(this.listaIFDConEstrategia[0].temp_caks);
     tickerInicial=this.listaIFDConEstrategia[0].temp_ticker.toString();
     for (let operacionSinEstrategia of  this.listaIFDConEstrategia ){
        if(  operacionSinEstrategia != null )
        {
          //inicio de validar cobertura contable y económica
          if(operacionSinEstrategia.temp_tipo==='CE'){
              if (this.idProteccion==='4'   )
              {
                  this.existeEstrategia=true;
              }
              else{
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'El tipo de cobertura de la estrategia tiene que ser igual al de los componentses.',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                  container: 'my-swal',
        
                  }
                });
                return false; 
              }
          }
          else{
            if(operacionSinEstrategia.temp_tipo==='FP'){
                if (this.idProteccion==='3'   )
                {
                  this.existeEstrategia=true;
                }
                else{
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'El tipo de cobertura de la estrategia tiene que ser igual al de los componentses.',
                    confirmButtonColor: '#0162e8',
                    customClass: {
                    container: 'my-swal',
          
                    }
                  });
                  return false; 
                } 
            }
            else{
              if(operacionSinEstrategia.temp_tipo==='CC'){
                  if (this.idProteccion==='1' || this.idProteccion==='2'  )
                  {
                    this.existeEstrategia=true;
                  }
                  else{
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: 'El tipo de cobertura de la estrategia tiene que ser igual al de los componentses.',
                      confirmButtonColor: '#0162e8',
                      customClass: {
                      container: 'my-swal',
            
                      }
                    });
                    return false; 
                  } 
              }
            }
          }
        }
      }//fin de validar cobertura contable y económica
      //inicio validar ticker de operaciones
        //  this.checked = this.listaIFDConEstrategia.filter(i => i.temp_ticker.toString()!==tickerInicial);
        //  if (this.checked.length>0){
        //     Swal.fire({
        //       position: 'center',
        //       icon: 'error',
        //       title: 'Debe seleccionar operaciones del mismo commodity.',
        //       confirmButtonColor: '#0162e8',
        //       customClass: {
        //       container: 'my-swal',
        
        //       }
        //     });
        //     return false
        //  }
        //  else{
        //   this.existeEstrategia=true;
        //  }
      
      //fin validar ticker de operaciones

    if(this.caksIguales==1){
      //inicio validar que las operaciones tengan cantidades  iguales
      if (this.listaIFDConEstrategia.length>1){
         this.checked = this.listaIFDConEstrategia.filter(i => Math.abs(i.temp_caks)!==caks);
         if (this.checked.length>0){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Debe seleccionar operaciones con el mismo numero de contratos.',
            confirmButtonColor: '#0162e8',
            customClass: {
            container: 'my-swal',
      
            }
          });
          return false
         }
         else{
           this.existeEstrategia=true;
         }
      }
      else{
       this.existeEstrategia=true
      }
    }   // fin validar que las operaciones tengan cantidades  iguales
    
  }
  else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar los componentes de la estrategia.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',

          }
        });
        return false;
  }
  // if (this.idProteccion==='4'   ){
  //   this.checked = this.alertLimit.filter(i => (i.t109_Start)<=this.detalleLimite[0].s052_Ratio && (i.t109_End)> this.detalleLimite[0].s052_Ratio);
    
  //   if (this.checked.length>0 )
  //       this.semaforo=this.checked[0].t109_Description;
  //       this.ratio=this.detalleLimite[0].s052_Ratio
  //     if (this.ratio>1)
  //     {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: 'El ratio al T-1 es .'+ this.ratio  ,
  //         confirmButtonColor: '#0162e8',
  //         customClass: {
  //         container: 'my-swal',

  //         }
  //       });
  //       // no permite guardar la estrategia.
  //       return false
        
  //     }
  //   else{
  //     this.existeEstrategia=true;
  //   }
  // }

  //caso de c.c o pricing
  // else{
  //   if(this.ratio>1){
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'El ratio al T-1 es .'+ this.ratio  ,
  //       confirmButtonColor: '#0162e8',
  //       customClass: {
  //       container: 'my-swal',

  //       }
  //     });
  //     return false;

  //   }
  // }
  return true;
}

cargarValoresIniciales(){
    this.getListaTipoEstrategia();
    this.getListaPortafolio();
    this.getListaFicha();
    this.getListaProteccion();
    this.getListaCampaign()
    this.getListaOptionClass();
    this.getListaSpecificLimit();
    this.getListaIFDSinEstrategia(this.idEmpresa);
    //// Generar codigo Estrategia
    this.getNuevoCodigoEstrategia();
    

}
changeColors() {
  const head = document.getElementsByTagName('head')[0];
  const css = `
  .verde .mat-progress-bar-fill::after {
    background-color: ${this.colors[0]} !important;
  }
  .amarillo .mat-progress-bar-fill::after {
    background-color:  ${this.colors[1]} !important;
  }
  .naranja .mat-progress-bar-fill::after {
    background-color:  ${this.colors[2]} !important;
  }
  .rojo .mat-progress-bar-fill::after {
    background-color:  ${this.colors[3]} !important;
  }
  .rojo .mat-progress-bar-buffer {
    background-color:  ${this.colors[4]} !important;
  }


  `;
  this.styleElement.innerHTML = '';
  this.styleElement.type = 'text/css';
  this.styleElement.appendChild(document.createTextNode(css));
  head.appendChild(this.styleElement);

}

public cargarValoresEstrategia(): void {

    

  this.portafolioMoliendaIFDService.getValoresEstrategia(Number(this.idEstrategia)).subscribe(
  (response: ModificarEstrategia) => {
    this.modificarEstrategia = response;
    this.idEstrategia=this.modificarEstrategia.temp_codEstrategia.toString()
    this.idTipoEstrategia=this.modificarEstrategia.temp_tipoEstrategia.toString()
    this.idPortafolio=this.modificarEstrategia.temp_idPortfolio.toString()
    this.idFicha=this.modificarEstrategia.temp_idFicha.toString()
    this.idProteccion=this.modificarEstrategia.temp_idProteccion.toString()
    this.idCampaign=this.modificarEstrategia.temp_idCampanha.toString()
    this.idOptionClass=this.modificarEstrategia.temp_idClaseOpcion.toString()
    this.idSpecificLimit=this.modificarEstrategia.temp_idLimiteEspecifico.toString()
    this.tmReferencia=this.modificarEstrategia.temp_tmCubrir
    this.getTMTotalLimite(Number(this.idCampaign),Number(this.idOptionClass),Number(this.idSpecificLimit))
    //Cargar Listado de Operaciones 
    this.getListaIFDConEstrategia(Number(this.idEstrategia))
    this.estrategiaCaksIguales(Number(this.idTipoEstrategia))
  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
  );
}
public getListaIFDConEstrategia(estrategia: number): void {
  this.portafolioMoliendaIFDService.getListaIFDConEstrategia(estrategia).subscribe(
  (response: IFDSinEstrategia[]) => {

    this.listaIFDConEstrategia = response;
    this.dataSourceSQL = new MatTableDataSource(this.listaIFDConEstrategia);
    this.selectionSQL = new SelectionModel<IFDSinEstrategia>(true, []);
    this.dataSourceSQL.paginator = this.MatPaginatorSQL;
    this.dataSourceSQL.sort = this.MatSortSQL;

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
  );

  
  for (let operacionIFDSinEstrategia of  this.listaIFDConEstrategia ){
    this.tmReferencia=this.tmReferencia+ operacionIFDSinEstrategia.temp_VolumeTons
  }
  
}
public estrategiaCaksIguales(idEstrategia: number): void {
  this.portafolioMoliendaIFDService.getEstrategiaCaksIguales(idEstrategia).subscribe(
  (response: Descripcion) => {

    this.caksIguales =Number(response.temp_descripcion);
    
  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
  );
}


}

