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
import { color, number } from 'echarts';
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
import { Underlying } from 'src/app/models/IFD/underlying';
import { ModalConfig } from './modal-config';
import {DragDrop} from '@angular/cdk/drag-drop';
import { DialogOverviewExampleDialog } from './dialog-overview-example';
import { elegirEmbarqueComponent } from './elegirEmbarque.component';
import { EmbarquePricingACubrir } from 'src/app/models/IFD/EmbarquePricingACubrir';
import { EstrategiaCM } from 'src/app/models/IFD/estrategiaCM';
import { elegirInventarioComponent } from './elegirInventario.component';
import { elegirConsumoComponent } from './elegirConsumo.component';
import jsPDF from 'jspdf';
import { Row, RowInput, UserOptions } from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import { PruebaStr } from 'src/app/models/IFD/PruebaStr';
import { WHITELIST_BUTTON_TYPES } from '@ks89/angular-modal-gallery/lib/model/buttons-config.interface';
import { AlignLeft, Bold } from 'angular-feather/icons';
import { Papeleta } from 'src/app/models/IFD/papeleta';
import { EstrategiaHEDGE } from 'src/app/models/IFD/estrategiaHEDGERBD';
import { objInitPoBo } from 'src/app/models/IFD/objInitPoBo';



interface jsPDFWithPlugin extends jsPDF {
  autoTable : (options: UserOptions) => jsPDF;
}

@Component({

  selector: 'app-registroEstrategiaCM',
  templateUrl: './registroEstrategiaCM.component.html',
  styleUrls: ['./registroEstrategiaCM.component.scss']


})



export class registroEstrategiaCMComponent implements OnInit {

  modalRef: any;
  modalOptions: NgbModalOptions = ModalConfig;


  styleElement: HTMLStyleElement;
  colors : Array<string> = ["#4b822d", "#f7ef09","#e2770d","#ff1100","#adacacf6"];
  data: Observable<any>;

  isLoading = false;
  typeSelected: string;
  isOverlay = false;




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
  public listaEstadio: CargarCombo [] = [];
  public productos:Underlying[];
  
  public listaAA: PruebaStr[];

  public listaIFDSinEstrategia: IFDSinEstrategia[] = [];
  public listaIFDConEstrategia: IFDSinEstrategia[] = [];
  public siModificar:Boolean=false;

  public operacionIFDSinEstrategia: IFDSinEstrategia;
  public nuevaestrategia: EstrategiaCM;
  public modificarEstrategia:ModificarEstrategia;
  public detalleLimite:DetalleLimite;
  public alertLimit:AlertLimit[]=[];


  public idEstrategia:string;
  public idTipoEstrategia:string;
  public idPortafolio:string;
  public idFicha:string
  public idProteccion:string
  public idCampaign:string
  public idEstadio:string
  public idOptionClass:string
  public idSubyacenteDerivado:string
  public tmReferencia:number=0;
  public idEmpresa:number;
  public pNombreForm:string;
  public toneladasMetrica:number
  public TMLimite:number
  public TMSaldo:number
  public tmAsignar:number
  public tmAsignados:number
  
  public TMUtilizado :number
  public semaforo:string;
  public ratio:number;
  public limiteP2:number;
  public caksIguales:number;
  public idNuevaFicha:string
  public existeEstrategia:boolean;
  public noMostrarCampo:Boolean
  public compania: Companias  [] = [];
  public esNuevaEstrategiaT:Boolean
  public noMostrarEstadio:Boolean=false;
  public idEstadioOriginal:string=""

  public listaEmbarquePricingSeleccionadas: EmbarquePricingACubrir[] = [];
  public nuevaestrategiaHEDGE:EstrategiaHEDGE;
  public FCPOhabilitar: boolean = false; // Inicialmente deshabilitado
  public checkedFCPO =false;
  public checkedHEDGE=false;
  public objDatosPoBo: objInitPoBo;
  public listaEstrategiaHEDGE: EstrategiaHEDGE[] = [];
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('MatPaginatorSQL', { static: true }) MatPaginatorSQL!: MatPaginator;
  @ViewChild('MatSortSQL') MatSortSQL!: MatSort;



  myModalInventario=false;
  myModalConsumo=false;
  myModalEmbarque=false;


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

  constructor(private spinnerService: NgxSpinnerService,  private modalService: NgbModal, public dialog: MatDialog,
                  private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
                  ) {
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
      if(this.idTipoEstrategia == '1' ||this.idTipoEstrategia == '2' || this.idTipoEstrategia == '38' || this.idTipoEstrategia =='47'){
          if( instrumentoAnt==operacionIFDSinEstrategia.temp_instrumento ){
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
        else{
          this.tmReferencia=volumenTMAnt
          volumenTMAnt=this.tmReferencia;
        }
    
    }
    this.checked = this.listaIFDConEstrategia.filter(i => (i.temp_tipo )=="CC" );
    if (this.checked.length>0){
      this.noMostrarEstadio=false;
      this.idEstadio=this.idEstadioOriginal;
    }
    else{
      this.noMostrarEstadio=true;

      this.idEstadio="";

    }



}
SingleSelectionSQL(row2, event){
    const numSelected = this.selectionSQL.selected.length;
    this.tmReferencia=0;
    var numFila:number
    var instrumentoAnt:string='';
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

      if (this.listaIFDConEstrategia.length>0){
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
        this.checked = this.listaIFDConEstrategia.filter(i => (i.temp_tipo )=="CC" );
        if (this.checked.length>0){
          this.noMostrarEstadio=false;
          this.idEstadio=this.idEstadioOriginal;
        }
        else{
          this.noMostrarEstadio=true;
          this.idEstadio="";
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


      //this.fecha=20220225;//20220307;//20220225;
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.getformattedDate();
      this.getCompanias();
      this.idEmpresa= this.portafolioMoliendaIFDService.codigoEmpresa;
      this.idSubyacenteDerivado = this.portafolioMoliendaIFDService.producto.toString()
      this.portafolioMoliendaIFDService.embarquePricingACubrir=[];
      this.portafolioMoliendaIFDService.inventarioTransitoACubrir=[];
      this.portafolioMoliendaIFDService.consumoCubrir=[];
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
      this.getListaSubyacenteDerivado();
      this.getListaEstadio();
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
    this.portafolioMoliendaIFDService.getListaProteccion().subscribe(
      (response: CargarCombo[]) => {
        this.listaProteccion = response;
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



public getListaSubyacenteDerivado(): void {
    this.portafolioMoliendaIFDService.getproductos(this.idEmpresa,).subscribe(
      (response: Underlying[]) => {
        this.productos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }




public getListaEstadio(): void {
  this.portafolioMoliendaIFDService.getListaEstadio("T111_ToBeCovered").subscribe(
    (response: CargarCombo[]) => {
      this.listaEstadio = response;
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


onSelectSubyacente(id:string){
  if (typeof id !== 'undefined') {
   this.idSubyacenteDerivado=id.toString();
   this.getListaIFDSinEstrategiaCM(this.idEmpresa,Number(this.idSubyacenteDerivado));
   this.getListaIFDConEstrategia(Number(this.idEstrategia));
  }
}

onSelectEstadio(id:string){
  if (typeof id !== 'undefined') {
   this.idEstadio=id.toString();
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

onSelectEstrategia(id:string, modalPapel: any){

  if (typeof id !== 'undefined') {
   this.idTipoEstrategia=id.toString();
   this.activarSemaforo()
   //ver el tipo de caks si son iguales

   this.estrategiaCaksIguales(Number(this.idTipoEstrategia))

   if(id == '40'){
    if(this.listaIFDConEstrategia.filter(obj => obj["temp_instrumento"] == "Papel").length){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Ya existe un papel asignado.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
        container: 'my-swal',
        }
      });

      return;
    }

    this.portafolioMoliendaIFDService.obtener_DatosPoBo(0,Number(this.idEstrategia)).subscribe(
      (response: objInitPoBo) => {
        this.objDatosPoBo = response
        this.modalService.open(modalPapel,{windowClass : "modal_AgregarPapel"});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
   }

  }
}

onSelectPortafolio(id:string){
  if (id) {
    this.FCPOhabilitar = id !== '6';
    }
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
  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
  );
}

guardarEstrategia(){
  this.myModal=true;
  console.log('Selecion de Operacion  SQL'+this.listaIFDConEstrategia.length);

  this.siModificar=false;
  
  if (this.validarEstrategia()){
    if (this.listaIFDConEstrategia.length>0)
    {
        
        this.nuevaestrategia = new EstrategiaCM;
        this.nuevaestrategia.codEstrategia=Number(this.idEstrategia)
        this.nuevaestrategia.idTipoEstrategia=Number(this.idTipoEstrategia)
        this.nuevaestrategia.idPortafolio=Number(this.idPortafolio)
        this.nuevaestrategia.idTipoCobertura=Number(this.idProteccion)
        this.nuevaestrategia.idEstadio=Number(this.idEstadio)


        this.nuevaestrategia.idFicha=Number(this.idFicha)
        this.nuevaestrategia.nuevaFicha=this.idNuevaFicha
        this.nuevaestrategia.usuario=this.usuario
        this.nuevaestrategia.fecha=this.fecha
        this.nuevaestrategia.operacionesSQL =this.listaIFDConEstrategia


        this.nuevaestrategia.coberturaEmbarque=this.portafolioMoliendaIFDService.embarquePricingACubrir;
        this.nuevaestrategia.coberturaInventario=this.portafolioMoliendaIFDService.inventarioTransitoACubrir;
        this.nuevaestrategia.coberturaConsumo=this.portafolioMoliendaIFDService.consumoCubrir;
        this.nuevaestrategiaHEDGE = new EstrategiaHEDGE;
        this.nuevaestrategiaHEDGE.t510_IdEstrategia=Number(this.idEstrategia);
        this.nuevaestrategiaHEDGE.t510_Date=this.fecha;
        this.nuevaestrategiaHEDGE.t510_FlagHedge=this.checkedHEDGE ? 1 : 0;
        this.nuevaestrategiaHEDGE.t510_FlagRBD=this.checkedFCPO ? 1 : 0;
        this.nuevaestrategiaHEDGE.t510_Operation=this.listaIFDConEstrategia.map(d=>d.temp_idSQL); 
        this.nuevaestrategiaHEDGE.t510_RegisteredBy=this.usuario
        console.log(this.nuevaestrategiaHEDGE)

        this.portafolioMoliendaIFDService.guardarEstrategiaHEDGE(this.nuevaestrategiaHEDGE).subscribe(
          // data=>{Swal.fire({position: 'center',icon: 'success',title: 'HedgeGuardada',confirmButtonText: "Aceptar",
          // confirmButtonColor: '#4b822d'}); },
          // (error: HttpErrorResponse) => {alert(error.message);}
          )
          
        
        // guardar si es nuevo
        //modiificar el dia  dia T
        //if(this.portafolioMoliendaIFDService.nombreFormulario.toUpperCase()!=="Modificar".toUpperCase())
        if (this.esNuevaEstrategiaT)
        { //dd
            this.portafolioMoliendaIFDService.guardarEstrategiaCM(this.nuevaestrategia).subscribe(data=>{
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
                  title: 'Se registro la estrategia.',
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                  container: 'my-swal',
                  }
                });
                this.cerrar()
              }
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
            // this.cargarValoresIniciales()
            //this.cargarValoresEstrategia();

        }
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
              this.portafolioMoliendaIFDService.actualizarEstrategiaCM(this.nuevaestrategia).subscribe(data=>{
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
                this.portafolioMoliendaIFDService.actualizarEstrategiaCM(this.nuevaestrategia).subscribe(data=>{
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
let caks:number;
let tickerInicial:string;
let tipoCoberturaOperacion:string="";
let tipoCoberturaContable:Boolean=false
let operacionesDiferentesTipo:Boolean=false

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
    
  }
}
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

if (this.listaIFDConEstrategia.length>0)
{
   caks=Math.abs(this.listaIFDConEstrategia[0].temp_caks);
   tickerInicial=this.listaIFDConEstrategia[0].temp_ticker.toString();
   tipoCoberturaOperacion=this.listaIFDConEstrategia[0].temp_tipo.toString();
   for (let operaciones  of  this.listaIFDConEstrategia ){
      if(  operaciones != null )
      {
        if(tipoCoberturaOperacion!=operaciones.temp_tipo){
                  operacionesDiferentesTipo=true
                  break;

        }
        tipoCoberturaOperacion=operaciones.temp_tipo
        //inicio de validar cobertura contable y económica
        // if(operaciones.temp_tipo==='CE'){
        //     if (this.idProteccion==='4'   )
        //     {
        //         this.existeEstrategia=true;
        //     }
        //     else{
        //       Swal.fire({
        //         position: 'center',
        //         icon: 'error',
        //         title: 'El tipo de cobertura de la estrategia tiene que ser igual al de los componentes.',
        //         confirmButtonColor: '#0162e8',
        //         customClass: {
        //         container: 'my-swal',
      
        //         }
        //       });
        //       return false; 
        //     }
        // }
        // else{
        //   if(operaciones.temp_tipo==='FP'){
        //       if (this.idProteccion==='3'   )
        //       {
        //         this.existeEstrategia=true;
        //       }
        //       else{
        //         Swal.fire({
        //           position: 'center',
        //           icon: 'error',
        //           title: 'El tipo de cobertura de la estrategia tiene que ser igual al de los componentses.',
        //           confirmButtonColor: '#0162e8',
        //           customClass: {
        //           container: 'my-swal',
        
        //           }
        //         });
        //         return false; 
        //       } 
        //   }
        //   else{
        //     if(operaciones.temp_tipo==='CC'){
        //         if (this.idProteccion==='1' || this.idProteccion==='2'  )
        //         {
        //           this.existeEstrategia=true;
        //         }
        //         else{
        //           Swal.fire({
        //             position: 'center',
        //             icon: 'error',
        //             title: 'El tipo de cobertura de la estrategia tiene que ser igual al de los componentses.',
        //             confirmButtonColor: '#0162e8',
        //             customClass: {
        //             container: 'my-swal',
          
        //             }
        //           });
        //           return false; 
        //         } 
        //     }
        //   }
        // }
      }
    }//fin for //fin de validar cobertura contable y económica
    if (operacionesDiferentesTipo){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Los componentes deben tener el mismo tipo de cobertura.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',
    
        }
      });
      return false
    }
    else if(tipoCoberturaOperacion==='CC'){
      if (this.idEstadio ==undefined || this.idEstadio ==''){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar una partida a cubrir.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
      
          }
        });
        return false
      }
      else{
          if (this.esNuevaEstrategiaT && (this.tmAsignar  ==undefined || this.tmAsignar==0  )){
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Debe tener TM asignadas.',
              confirmButtonColor: '#0162e8',
              customClass: {
              container: 'my-swal',
          
              }
            });
            return false
            }
            else{
              if (this.tmAsignados==0 && (this.tmAsignar  ==undefined || this.tmAsignar==0)){
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Debe tener TM asignadas.',
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
if (this.idProteccion==='4'   ){
  this.checked = this.alertLimit.filter(i => (i.t109_Start)<=this.detalleLimite[0].s052_Ratio && (i.t109_End)> this.detalleLimite[0].s052_Ratio);
  
  if (this.checked.length>0 )
      this.semaforo=this.checked[0].t109_Description;
      this.ratio=this.detalleLimite[0].s052_Ratio
    if (this.ratio>1)
    {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El ratio al T-1 es .'+ this.ratio  ,
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',

        }
      });
      // no permite guardar la estrategia.
      return false
      
    }
  else{
    this.existeEstrategia=true;
  }
}
//caso de c.c o pricing
else{
  if(this.ratio>1){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'El ratio al T-1 es .'+ this.ratio  ,
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;

  }
}
return true;
}
cargarValoresIniciales(){
    this.getListaTipoEstrategia();
    this.getListaPortafolio();
    this.getListaFicha();
    this.getListaProteccion();
    this.getListaSubyacenteDerivado();
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
  // this.styleElement.innerHTML = '';
  // this.styleElement.type = 'text/css';
  // this.styleElement.appendChild(document.createTextNode(css));
  // head.appendChild(this.styleElement);

}

public cargarValoresEstrategia(): void {



  this.portafolioMoliendaIFDService.getValoresEstrategia(Number(this.idEstrategia)).subscribe(
  (response: ModificarEstrategia) => {
    this.modificarEstrategia = response;
    this.idEstrategia=this.modificarEstrategia.temp_codEstrategia.toString()
    this.idTipoEstrategia=this.modificarEstrategia.temp_tipoEstrategia.toString()
    this.idPortafolio=this.modificarEstrategia.temp_idPortfolio.toString()
    this.FCPOhabilitar = this.idPortafolio !== '6';
    this.idProteccion=this.modificarEstrategia.temp_idProteccion.toString()
   
    this.idEstadio=this.modificarEstrategia.temp_Cobertura==null?"":this.modificarEstrategia.temp_Cobertura.toString();
    this.idEstadioOriginal=this.idEstadio;
    this.tmAsignados=this.modificarEstrategia.temp_TMAsignadas==null?0:this.modificarEstrategia.temp_TMAsignadas;
    this.tmReferencia=this.modificarEstrategia.temp_tmCubrir==null?0:this.modificarEstrategia.temp_tmCubrir
   
    this.idFicha=this.modificarEstrategia.temp_idFicha.toString()
    

    this.getListaIFDConEstrategia(Number(this.idEstrategia))
    this.estrategiaCaksIguales(Number(this.idTipoEstrategia))

    this.getIFDHedgeEstrategicioRBD(Number(this.idEstrategia))

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
  );
}
public getListaIFDConEstrategia(estrategia: number): void {
  let instrumentoAnt:string='';
    let volumenTMAnt:number=0;
  this.portafolioMoliendaIFDService.getListaIFDConEstrategia(estrategia).subscribe(
  (response: IFDSinEstrategia[]) => {

    this.listaIFDConEstrategia = response;
    this.dataSourceSQL = new MatTableDataSource(this.listaIFDConEstrategia);
    this.selectionSQL = new SelectionModel<IFDSinEstrategia>(true, []);
    this.dataSourceSQL.paginator = this.MatPaginatorSQL;
    this.dataSourceSQL.sort = this.MatSortSQL;
    
    
    instrumentoAnt=this.listaIFDConEstrategia[0].temp_instrumento
    volumenTMAnt=this.listaIFDConEstrategia[0].temp_VolumeTons
    for (let operacionIFDSinEstrategia of  this.listaIFDConEstrategia ){
        if(this.idTipoEstrategia == '1' ||this.idTipoEstrategia == '2' || this.idTipoEstrategia == '38' || this.idTipoEstrategia =='47'){
            if( instrumentoAnt==operacionIFDSinEstrategia.temp_instrumento ){
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
          else{
            this.tmReferencia=volumenTMAnt
            volumenTMAnt=this.tmReferencia;
          }
      
      }

    this.checked = this.listaIFDConEstrategia.filter(i => (i.temp_tipo )=="CC" );
    if (this.checked.length>0){
      this.noMostrarEstadio=false;
    }
    else{
      this.noMostrarEstadio=true;
    }

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
  );
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


public getListaIFDSinEstrategiaCM(empresa: number, producto:number): void {



  this.portafolioMoliendaIFDService.getListaIFDSinEstrategiaCM(empresa,producto).subscribe(
  (response: IFDSinEstrategia[]) => {

        this.listaIFDSinEstrategia = response;
        this.dataSource = new MatTableDataSource(this.listaIFDSinEstrategia);
        this.selection = new SelectionModel<IFDSinEstrategia>(true, []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
      );
  }
  modalElegirPartida(detalleFormInventario:any,detalleFormEmbarque:any,detalleFormConsumo:any){
    //RESETEO DE EL MODELO


    this.isLoading = true;
    setTimeout( () => this.isLoading = false, 2000 );

    console.log("modal abierto");
    this.myModal=true;
    //prpio de modal
        if(this.idPortafolio ==undefined || this.idPortafolio=='' || this.idPortafolio=='0' ){
          Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar una portafolio',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      } else if(this.idEstadio ==undefined || this.idEstadio=='' || this.idEstadio=='0' ){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar una partida a cubrir',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }
      else if(this.listaIFDConEstrategia.length==0){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar un IFD',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }
      else{

            if(this.portafolioMoliendaIFDService.operacionSQL==undefined ||this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoEstrategia==0 ){
              this.portafolioMoliendaIFDService.idEstrategia='0';
            }
            else{
                this.portafolioMoliendaIFDService.idEstrategia=this.idEstrategia;
            }

            this.portafolioMoliendaIFDService.codPortafolio =Number(this.idPortafolio);
            this.portafolioMoliendaIFDService.fecha=this.fecha;
            this.portafolioMoliendaIFDService.idEstrategia=this.idEstrategia;
            this.portafolioMoliendaIFDService.tmEstrategia=  this.tmReferencia
            // this.portafolioMoliendaIFDService.nombreFormulario="Registrar"

            // -------- INVENTARIO
            // --exec S071_InventarioACubrir 3,1  COD:1
            // --exec S101_TransitoACubrir 3,1 -- COD:2
            if (Number(this.idEstadio)==1){
              //const modalRef =this.modalService.open(detalleFormInventario,{windowClass : "my-classRegistrarEstrategia"});
              let dialogRef = this.dialog.open(elegirInventarioComponent, {width: '70%'});
              dialogRef.afterClosed().subscribe(result => {
                var totalTMAsignar:number;
                let totalTMNoAsignadas:number;
                let totalTMAsignados:number;
                let totalTMQuitar:number;
                totalTMAsignar=0;
                totalTMNoAsignadas=0;
                totalTMAsignados=0;
                totalTMQuitar=0;
                for (let inventarioTransito of  this.portafolioMoliendaIFDService.inventarioTransitoACubrir  ){
                     totalTMAsignar=totalTMAsignar+ inventarioTransito.s262_Asignar
                     totalTMNoAsignadas=totalTMNoAsignadas+ inventarioTransito.s262_Asignados
                     if (inventarioTransito.s262_Asignar==0){
                      totalTMQuitar=totalTMQuitar+ inventarioTransito.s262_Asignados
                     }
                }
                this.tmAsignar=totalTMAsignar
                this.tmAsignados=this.modificarEstrategia.temp_TMAsignadas==null?0:this.modificarEstrategia.temp_TMAsignadas
                                  +totalTMAsignar-totalTMNoAsignadas
                });
            }
            // ---------EMBARQUE
            // --exec S072_EmbarqueACubrir 3,1 COD:4
            // --exec S102_PricingACubrir 3,1  COD:5
            else if (Number(this.idEstadio)==4){
              //const modalRef =this.modalService.open(detalleFormEmbarque,{windowClass : "my-classElegirEmbarque"});
              let dialogRef = this.dialog.open(elegirEmbarqueComponent, {width: '70%'});
              dialogRef.afterClosed().subscribe(result => {
                let  totalTMAsignar:number;
                let totalTMNoAsignadas:number;
                let totalTMAsignados:number;
                let totalTMQuitar:number;
                totalTMAsignar=0;
                totalTMNoAsignadas=0;
                totalTMAsignados=0;
                totalTMQuitar=0;
                for (let emmbarquePricing of  this.portafolioMoliendaIFDService.embarquePricingACubrir  ){
                     totalTMAsignar=totalTMAsignar+ emmbarquePricing.s258_Asignar
                     totalTMNoAsignadas=totalTMNoAsignadas+ emmbarquePricing.s258_Asignados
                     if (emmbarquePricing.s258_Asignar==0){
                      totalTMQuitar=totalTMQuitar+ emmbarquePricing.s258_Asignados
                     }
                }
                this.tmAsignar=totalTMAsignar
                this.tmAsignados=this.modificarEstrategia.temp_TMAsignadas==null?0:this.modificarEstrategia.temp_TMAsignadas
                                  +totalTMAsignar-totalTMNoAsignadas-totalTMQuitar
                });
              }
            // ---- CONSUMO
            // --exec S103_ConsumoACubrir 3,1
            else if (Number(this.idEstadio)==3){
              //const modalRef =this.modalService.open(detalleFormConsumo,{windowClass : "my-classRegistrarEstrategia"});
              let dialogRef = this.dialog.open(elegirConsumoComponent, {width: '70%'});
              dialogRef.afterClosed().subscribe(result => {
                var totalTMAsignar:number;
                let totalTMNoAsignadas:number;
                let totalTMAsignados:number;
                let totalTMQuitar:number;
                totalTMAsignar=0;
                totalTMNoAsignadas=0;
                totalTMAsignados=0;
                totalTMQuitar=0;
                for (let consumo of  this.portafolioMoliendaIFDService.consumoCubrir  ){
                     totalTMAsignar=totalTMAsignar+ consumo.s263_Asignar
                     totalTMNoAsignadas=totalTMNoAsignadas+ consumo.s263_Asignados
                     if (consumo.s263_Asignar==0){
                      totalTMQuitar=totalTMQuitar+ consumo.s263_Asignados
                     }
                    }
                this.tmAsignar=totalTMAsignar
                this.tmAsignados=this.modificarEstrategia.temp_TMAsignadas==null?0:this.modificarEstrategia.temp_TMAsignadas
                                  +totalTMAsignar-totalTMNoAsignadas-totalTMQuitar
                });
            }

         }
  }//fin de método

  cerrarModalEmbarque(modal: any){
    console.log("modal hijo cerrado asociar");
    this.myModalEmbarque=false;
    modal.close();

  }

  cerrarModalPapel(modal: any){
    // this.myModalEmbarque=false;
    modal.close();

  }

  generarPapeleta(){
    let papeleta:Papeleta
     //let : DatosCierreComercial;   
     let caracteristicaCierre: string[][]; 
     let y = 0;
     let indice = 0;
     let yTitulo=0
     let contadorOperaciones=0
      //const doc = new  jsPDF('p', 'mm', 'a4', false) as jsPDFWithPlugin
      const doc = new  jsPDF() as jsPDFWithPlugin
      //jsPDF('p', 'mm', 'a4', true);
      doc.setDocumentProperties

      const columns = [['', '', '']];
      //numero de operaciones
      const data = [
      ['', ' ', ''],
      ['', ' ', '']
      ];

      papeleta=new Papeleta();

      papeleta.nombre_trader=this.usuario

      if (this.modificarEstrategia!=undefined )
      {
        papeleta.fecha=this.modificarEstrategia.temp_fecha.toString()
      }
      else{
        papeleta.fecha=this.fecha.toString()
      }
      //instrumento
      papeleta.operacion="122"
      papeleta.instrumento=this.listaIFDConEstrategia[0].temp_instrumento
      papeleta.contraparte="CRM"
      papeleta.nocional="599"
      papeleta.vencimiento="20220224"
      papeleta.subyacente="BOZ1"
      papeleta.posicion="Long"
      papeleta.strike="56"
      papeleta.prima="3.050"
      papeleta.posicionDeltaCierre=""
      papeleta.sociedad="Sociedad 1"
      papeleta.tipoPortafolio="Cobertura Contable"
      papeleta.trimestreCubierto="1Q22"
      papeleta.estrategia="Converting Put Spread"
      papeleta.posibilidadDesarme="SI"
      papeleta.fechaDesarme=""
      papeleta.razonDesarme=""
      papeleta.mtm=""

      
      let datosFinales:RowInput[]=[]
      const data1 = [
        ['1. Nombre Trader:', ''],
        ['2. Fecha:', ''],
        ['3. Instrumento Financiero:', ''],
        ['4. Nombre Contraparte:', ''],
        ['5. Nocional:', ''],
        ['6. Vencimiento Operación:', ''],
        ['7. Subyacente:', ''],
        ['8. Posición [Long/Short]:', ''],
        ['9. Precio Strike:', ''],
        ['10. Prima pagada:', ''],
        ['11. Posición Delta tn cierre contratación:', ''],
        ['12. Sociedad:', ''],
        ['13. Tipo de portafolio:', ''],
        ['14. Trimestre cubierto:', ''],
        ['15. Estrategia de Cobertura:', ''],
        ['16. ¿Existe la posabilidad de desarmar?:', ''],
        ['17. Fecha de desarme:', ''],
        ['18. Razón del desarme:', ''],
        ['19. Mark to Market al cierre de la posición:', ''],
        ];
        data1[0][1]=papeleta.nombre_trader
        data1[1][1]=papeleta.fecha
        data1[2][1]=papeleta.instrumento
        data1[3][1]=papeleta.contraparte
        data1[4][1]=papeleta.nocional
        data1[5][1]=papeleta.vencimiento
        data1[6][1]=papeleta.subyacente
        data1[7][1]=papeleta.posicion
        data1[8][1]=papeleta.strike
        data1[9][1]=papeleta.prima
        data1[10][1]=papeleta.posicionDeltaCierre
        data1[11][1]=papeleta.sociedad
        data1[12][1]=papeleta.tipoPortafolio
        data1[13][1]=papeleta.trimestreCubierto
        data1[14][1]=papeleta.estrategia
        data1[15][1]=papeleta.posibilidadDesarme
        data1[16][1]=papeleta.fechaDesarme
        data1[17][1]=papeleta.razonDesarme
        data1[18][1]=papeleta.mtm

        datosFinales.push(data1);
        datosFinales.push(data1);
        datosFinales.push(data1);
        datosFinales.push(data1);

        let operacion1:string[]=[]
        operacion1[0]="123"
        operacion1[1]="897"
        operacion1[2]="658"
        operacion1[3]="456"

        var image1 = new Image();
        image1.src ="../../assets/images/brand/Alicorp1.png "
        



      doc.setFont('times',"italic").setFontSize(11);
      
      indice=-1;
      yTitulo=-100;//inicio de cuadro
      y=10;
      contadorOperaciones=0
      for (let i = 1; i < 2; i++) {  
        
        doc.autoTable({
                 
                  body: data,
                  startY:y+2,
                  styles:{
                    fontSize:10,
                    fillColor:'#FFFFFF',
                    halign: 'left'
                    ,cellPadding:1
                    ,minCellHeight:130 //tamaño de cuadro
                    ,cellWidth:90
                    
                    // cellWidth:'wrap',
                    
                  },
                  columnStyles:{
                    0:{//cellWidth:'wrap',
                    
                    
                    //cellPadding:20,
                    fillColor:'#FFFFFF',
                    halign:'left'
                    

                   },
                   1:{cellWidth:'wrap',
                   //cellWidth:10,
                   //minCellWidth:10,
                   //cellPadding:0,
                   fillColor:'#FFFFFF'
                   
                  },
                  2:{//cellWidth:'wrap',
                  //minCellWidth:40,
                  //cellPadding:20,
                  
                  fillColor:'#FFFFFF'
                 }
                  },
                  bodyStyles: {
                    //minCellHeight: 10,
                    fillColor:'#FFFFFF',
                    halign: 'left'
                    
                  },
                  //theme: 'grid', muestra las lineas de la tabla
                  
                  // tableWidth: 'wrap',
                didDrawCell: function (data) {
                                contadorOperaciones=contadorOperaciones+1;
                                //if (data.column.dataKey === 0 && data.cell.section === 'body') {
                                  if(Number(contadorOperaciones)%3==1 ){
                                    yTitulo=yTitulo+130; //inicio de cuadro
                                  }
                                if ( Number(data.column.dataKey)%2==0 && data.cell.section == 'body') {
                                  indice=indice+ 1
                                   
                                    doc.autoTable({
                                      
                                      body:  datosFinales[indice] as RowInput[] ,
                                        //componente de la estrategia
                                        columnStyles:{
                                          
                                          0:{ fillColor:'#b5b5b5',
                                              halign:'left'
                                              ,fontStyle:'bold'
                                              
                                            }
                                        },
                                        startY: yTitulo+6,
                                        margin: {left: data.cell.x + data.cell.padding('left')},
                                        tableWidth: 'wrap',
                                        bodyStyles: {
                                          //minCellHeight: 200
                                          fillColor:'#FFFFFF',
                                          halign: 'left'
                                          
                                        },
                                        theme: 'grid',
                                        styles: {
                                            fontSize: 8,
                                            halign: 'left'
                                            ,cellPadding: 1,//tamaño de celda de la operación
                                        },
                                        didDrawPage: (dataArg) => { 
                                          doc.setFont('times','bold').setFontSize(11);
                                          doc.text('ID de Operación '+operacion1[indice] , dataArg.settings.margin.left, yTitulo);
                                          doc.setFillColor(219, 237, 220);
                                          doc.setTextColor(0, 128, 0);
                                          doc.setFont('times','bold')
                                          doc.rect(dataArg.settings.margin.left,  yTitulo+1, 30, 5,'F')
                                          doc.text(' vigente' , dataArg.settings.margin.left, yTitulo+4);
                                          
                                          }
                                    });
                                    
                                }
                              },
                didDrawPage: (dataArg) => { 
                doc.addImage(image1, 'JPEG', dataArg.settings.margin.left, y,30, 10); // Agregar la imagen al PDF (X, Y, Width, Height)
                doc.setFont('times',"italic").setFontSize(11);
                doc.text('Ficha', dataArg.settings.margin.left, y+15);
                }
          }); 
        y =y+ 40;
        
      }
      

      // doc.autoTable( {
      //         head: columns,
      //         body: data,
      //         startY:60,
      //         styles:{
      //           fontSize:14,
      //           cellWidth:'wrap'
      //         },
      //         columnStyles:{
      //           1:{cellWidth:'auto'}
      //           ,5: {cellWidth: 20}
      //         },
      //         bodyStyles: {
      //           minCellHeight: 30
      //         },
      //         didDrawCell: function (data) {
      //               if (data.column.dataKey === 0 && data.cell.section === 'body') {
      //                   doc.autoTable({
      //                     head: columns,
      //                     body: data1,
      //                       // head: [["One", "Two", "Three", "Four"]],
      //                       // body: [
      //                       //     ["1", "2", "3", "4"],
      //                       //     ["1", "2", "3", "4"],
      //                       //     ["1", "2", "3", "4"],
      //                       //     ["1", "2", "3", "4"]
      //                       // ],
      //                       startY: data.cell.y + 2,
      //                       margin: {left: data.cell.x + data.cell.padding('left')},
      //                       tableWidth: 'wrap',
      //                       theme: 'grid',
      //                       styles: {
      //                           fontSize: 7,
      //                           cellPadding: 1,
      //                       }
      //                   });
      //               }
      //               if (data.column.dataKey === 2 && data.cell.section === 'body') {
      //                 doc.autoTable({
      //                   head: columns,
      //                   body: data1,
      //                     // head: [["One", "Two", "Three", "Four"]],
      //                     // body: [
      //                     //     ["1", "2", "3", "4"],
      //                     //     ["1", "2", "3", "4"],
      //                     //     ["1", "2", "3", "4"],
      //                     //     ["1", "2", "3", "4"]
      //                     // ],
      //                     startY: data.cell.y + 2,
      //                     margin: {left: data.cell.x + data.cell.padding('left')},
      //                     tableWidth: 'wrap',
      //                     theme: 'grid',
      //                     styles: {
      //                         fontSize: 7,
      //                         cellPadding: 1,
      //                     }
      //                 });
      //             }
                
      //             }
                
               
            

      // });
      // autoTable(doc, {
      //       head: columns,
      //       body: data,
      //       didDrawPage: (dataArg) => { 
      //       doc.text('PAGE', dataArg.settings.margin.left, 10);
      //       }
      // }); 

      doc.save('table.pdf');

  }

  public getIFDHedgeEstrategicioRBD(estrategia: number): void {
    
    this.portafolioMoliendaIFDService.getIFDHedgeEstrategicioRBD(estrategia).subscribe(
    (response: EstrategiaHEDGE[]) => {
  
      this.listaEstrategiaHEDGE = response;
      this.checkedHEDGE=!!this.listaEstrategiaHEDGE[0].t510_FlagHedge
      this.checkedFCPO=!!this.listaEstrategiaHEDGE[0].t510_FlagRBD
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
  }

}

