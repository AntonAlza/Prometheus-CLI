import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { listaoperacionesbrokers } from 'src/app/models/IFD/listaoperacionesbrokers';
import {listaoperacionesBroker_SQL} from 'src/app/models/IFD/listaOperacionesBroker_SQL';
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
import { ListaoperacionesBroker_IDSQL } from 'src/app/models/IFD/listaoperacionesBroker_IDSQL';
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
import { Broker } from 'src/app/models/IFD/broker';
import { ListaOperacionesxVencer } from 'src/app/models/IFD/listaOperacionesxVencer';


@Component({
  
  selector: 'app-operacionesxVencer',
  templateUrl: './operacionesxVencer.component.html',
  styleUrls: ['./operacionesxVencer.component.scss']

  
})

export class operacionesxVencerComponent implements OnInit {



  public listaPreciosBase: number;
  public listaPreciosFuturo: number;
  public listaPreciosFlat: number;
  public tipo: string;
  public caksInt: number=0;
  public factorMetricTonPrice: number;
  public destinoSelected: string;
  public conceptoSelected: string;
  public signoSelected: string;
  public ticker: string;
  public contador: number;
  public orden: number;
  public totalUSDTM: number;
  public totalprecio: number;
  public dialog: MatDialogModule;
  public listaOperacionesBroker: listaoperacionesbrokers[] = [];
  public listaOperacionesxVencer: ListaOperacionesxVencer[]=[];
  public listaOperacionesBroker_SQL: listaoperacionesBroker_SQL[] = [];
  public operacionBroker:listaoperacionesbrokers;
  //public pId_SQLPreregistro:number;
  public operacionBroker_IDSQL:ListaoperacionesBroker_IDSQL;

  public listaOperacionesBroker_SQLseleccionadas: listaoperacionesBroker_SQL[] = [];
  public listaoperacionBroker_IDSQL:ListaoperacionesBroker_IDSQL[]=[];
  public listaasociarOperacionesSQL:AsociarSQL[]=[];
  public asociarOperacionesSQL:AsociarSQL;
  public operacionesBroker_SQL: listaoperacionesBroker_SQL;
  private _refresh$= new Subject<void>();
  public portafolio: PortafolioIFDMolienda[] = [];
  public indice:number;
  public flagLiquidacion: boolean=false;
  public flagAsociar: boolean=false;
  public operacionesSimilares:boolean;
  public operacionesSimilaresSoyCrush:boolean;
  public listaOperacionesBrokerSeleccionadas: listaoperacionesbrokers[] = [];
  public productoselected:number;
  suscription: Subscription;
  public keypressed;
  private wasInside = false;
  public listatipoOperacion:TypeOperation[]=[]
  public usuario: string;
  public fecha:number;
  date: NgbDateStruct;
  checked: any = [];  
  public factor_Subyacente_S:number=10;
  public factor_Subyacente_SBO:number=9;
  public factor_Subyacente_SBM:number=11;
  public caks_S:number;
  public caks_SBO:number;
  public caks_SBM:number;
  public ticker_S:string;
  public ticker_SBO:string;
  public ticker_SBM:string;
  public tipoOpcion_S:string;
  public tipoOpcion_SBO:string;
  public tipoOpcion_SBM:string;
  public tipoSellBuy_S:string;
  public tipoSellBuy_SBO:string;
  public tipoSellBuy_SBM:string;

  public esSoyCrush_S:boolean;
  public esSoyCrush_SBO:boolean;
  public esSoyCrush_SBM:boolean;

  public existeOperacionBroker:boolean
  public portafolioLiquidar: PortafolioIFDMolienda[] = [];
  public tipopcion:string;
  public tipoOperacion:string;
  public caksLiquidar:number;
  public listaBroker: Broker[];
  public idBroker  :string;
  

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('MatPaginatorSQL', { static: true }) MatPaginatorSQL!: MatPaginator;
  @ViewChild('MatSortSQL') MatSortSQL!: MatSort;

  @ViewChild('MatSortSQLFinal') MatSortSQLFinal!: MatSort;


  //@ViewChild('MatPaginatorSQLLiquidar', { static: true }) MatPaginatorSQLLiquidar!: MatPaginator;
  @ViewChild('MatSortSQLLiquidar') MatSortSQLLiquidar!: MatSort;
  @ViewChildren('MatPaginatorSQLLiquidar') MatPaginatorSQLLiquidar = new QueryList<MatPaginator>();

  @ViewChild('paginatorU') paginatorU: MatPaginator;



  myModalLiquidar=false;
  myModalAsociar=false;


  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();

  //public  visible: boolean;

  displayedColumns: string[] = [
      's255_idSQL'
      ,'s255_tradedate'
      ,'s255_compania'
      ,'s255_sociedad'
      ,'s255_commodity'
      ,'s255_Instrument'
      ,'s255_ficha'
      ,'s255_Estrategia'
      ,'s255_Ticker'
       ,'s255_caks'
       ,'s255_strikeUSD'
       //,'s255_strikeCent'
       ,'s255_FechaVcto'
       ,'s255_diasExpiracion'
    
    ];



    @ViewChildren('checkBox') checkBox: QueryList<any>;

  dataSource: MatTableDataSource<ListaOperacionesxVencer>;
  selection = new SelectionModel<ListaOperacionesxVencer>(true, []);
  selectionSoyCrush = new SelectionModel<ListaOperacionesxVencer>(true, []);
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedSoyCrush() {
    const numSelected = this.selectionSoyCrush.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSoyCrush() {
    this.isAllSelectedSoyCrush() ?
        this.selectionSoyCrush.clear() :
        this.dataSource.data.forEach(row => this.selectionSoyCrush.select(row));
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

  public getLista_TipoOperation(): void {

    

    this.portafolioMoliendaIFDService.getLista_TipoOperation().subscribe(
      (response: TypeOperation[]) => {
        this.listatipoOperacion = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  
  }


  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
  }

  ngOnInit(): void {
      
      //this.fecha=20220225;//20220307;//20220225;
      //this.fecha=this.getformattedDate();
      this.fecha=this.portafolioMoliendaIFDService.fecha;
      this.getListaOperacionesxVencer(this.fecha);
      

}
public getListaOperacionesxVencer( fecha:number): void {

  this.portafolioMoliendaIFDService.getListaOperacionesxVencer( fecha).subscribe(
  (response: ListaOperacionesxVencer[]) => {
    this.listaOperacionesxVencer = response;
    this.dataSource = new MatTableDataSource(this.listaOperacionesxVencer);

        this.selection = new SelectionModel<ListaOperacionesxVencer>(true, []);
        

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
);
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}





private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  open(content: any, options?: NgbModalOptions) {

    const modalRef =this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
  }

  cerrar() {
    //this.modalReference.close();
    this.closeModal();
    this.modalService.dismissAll();
  }


  cerrarModalAsociar(modal: any){
    console.log("modal hijo cerrado asociar");
    this.myModalAsociar=false;
    modal.close();

  }

  cerrarModalLiquidar(modal: any){
    console.log("modal hijo cerrado liquidar");
    this.myModalLiquidar=false;
    modal.close();

  }


}