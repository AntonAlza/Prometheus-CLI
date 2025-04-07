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


@Component({
  
  selector: 'app-registrosOperacionesBrokerSinCuenta',
  templateUrl: './registrosOperacionesBrokerSinCuenta.component.html',
  styleUrls: ['./registrosOperacionesBrokerSinCuenta.component.scss']

  
})

export class registrosOperacionesBrokerSinCuentaComponent implements OnInit {



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
    //  'select'
    //  ,'selectsoycrush'
     's210_DescripcionBroker'
     ,'s210_IDBroker'
    //,'s210_FECHAREGISTRO'
     ,'s210_FECHATRADE'
     ,'s210_NROCUENTA'
     ,'s210_NOMBRECUENTA'
     ,'s210_NUMEROORDEN'
     ,'s210_Underlying'
     ,'s210_TICKER'
     ,'s210_TIPOOPCION'
     ,'s210_CAKSTOTAL'
     ,'s210_CAKSDISPONIBLE'
    //  ,'s210_CAKS_UTILIZAR'
     ,'s210_TIPOOPERACION'
     ,'s210_NOMBREOPCION'
     ,'s210_FECHAEXPIRACION'
     ,'s210_STRIKE'
     ,'s210_PRIMA'
    ];

    displayedColumnsSQL: string[] = [
      'selectSQL',
      's211_IDSQL'
      ,'s211_TradeDate'
      ,'s211_Ticker'
      ,'s211_Instrumento'
      ,'s211_TipoOperacion'
      ,'s211_caksLiquidar'
      ,'s211_caks'
      ,'s211_strike'
      ,'s211_prima'
      ,'s211_BrokerCode'
      ,'s211_TypeOperation'
      ,'s211_estado'
 
     ];


    @ViewChildren('checkBox') checkBox: QueryList<any>;

  dataSource: MatTableDataSource<listaoperacionesbrokers>;
  selection = new SelectionModel<listaoperacionesbrokers>(true, []);
  selectionSoyCrush = new SelectionModel<listaoperacionesbrokers>(true, []);
  hidden = false;

  dataSourceSQL: MatTableDataSource<listaoperacionesBroker_SQL>;
  selectionSQL = new SelectionModel<listaoperacionesBroker_SQL>(true, []);
  hiddenSQL = false;

  dataSourceSQLFinal: MatTableDataSource<AsociarSQL>;
  selectionSQLFinal = new SelectionModel<AsociarSQL>(true, []);
  hiddenSQLFinal = false;

  dataSourceSQLLiquidar: MatTableDataSource<PortafolioIFDMolienda>;
  selectionSQLLiquidar = new SelectionModel<PortafolioIFDMolienda>(true, []);
  hiddenSQLLiquidar = false;

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



  isAllSelectedSQL() {
    const numSelected = this.selectionSQL.selected.length;
    const numRows = this.dataSourceSQL.data.length;
    return numSelected === numRows;
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSQL() {
    this.isAllSelectedSQL() ?
        this.selectionSQL.clear() :
        this.dataSourceSQL.data.forEach(row => this.selectionSQL.select(row));
  }

  isAllSelectedSQLFinal() {
    const numSelected = this.selectionSQLFinal.selected.length;
    const numRows = this.dataSourceSQLFinal.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSQLFinal() {
    this.isAllSelectedSQLFinal() ?
        this.selectionSQLFinal.clear() :
        this.dataSourceSQLFinal.data.forEach(row => this.selectionSQLFinal.select(row));
  }

  isAllSelectedSQLLiquidar() {
    const numSelected = this.selectionSQLLiquidar.selected.length;
    const numRows = this.dataSourceSQLLiquidar.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSQLLiquidar() {
    this.isAllSelectedSQLLiquidar() ?
        this.selectionSQLLiquidar.clear() :
        this.dataSourceSQLLiquidar.data.forEach(row => this.selectionSQLLiquidar.select(row));
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

  public getListaBrokerOperacionesSinCuenta(empresa: number, subyacente:number, fecha:number,broker:number): void {

      

      this.portafolioMoliendaIFDService.getListaBrokerOperacionesSinCuenta(empresa,subyacente, fecha,broker).subscribe(
      (response: listaoperacionesbrokers[]) => {
        this.listaOperacionesBroker = response;
        this.dataSource = new MatTableDataSource(this.listaOperacionesBroker);

        this.selection = new SelectionModel<listaoperacionesbrokers>(true, []);
        this.selectionSoyCrush = new SelectionModel<listaoperacionesbrokers>(true, []);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

  }


  public getListaBroker_SQL_Operaciones(empresa: number, fecha:number): void {

    

    this.portafolioMoliendaIFDService.getListaBroker_SQL_Operaciones(empresa,fecha).subscribe(
    (response: listaoperacionesBroker_SQL[]) => {
      this.listaOperacionesBroker_SQL = response;
      this.dataSourceSQL = new MatTableDataSource(this.listaOperacionesBroker_SQL);

      this.selectionSQL = new SelectionModel<listaoperacionesBroker_SQL>(true, []);

      this.dataSourceSQL.paginator = this.MatPaginatorSQL;
      this.dataSourceSQL.sort = this.MatSortSQL;


    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
  
}


  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;


  opciones(event: MouseEvent, item: Item) {

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    // this.modalService.open(this.contextMenu ,{ scrollable: true,size: 'lg'});
    this.contextMenu.openMenu();
  }

  onContextMenu(event: MouseEvent, item: Item) {

     event.preventDefault();
    //  console.log('Posicion X:'+event.clientX);
    //  console.log('Posicion Y:'+event.clientY);
    //  console.log('Posicion BASE X:'+this.contextMenuPosition.x);



     this.contextMenuPosition.x =(event.clientX- event.clientX*0.30) + 'px';
     this.contextMenuPosition.y =(event.clientY-event.clientY*0.01)+  'px';

     //this.contextMenuPosition.x = (event.clientX-200) + 'px';
     //this.contextMenuPosition.y = (event.clientY-20)+  'px';

     this.contextMenu.menuData = { 'item': item };
     this.contextMenu.menu.focusFirstItem('mouse');
     this.contextMenu.openMenu();

  }

  onContextMenuAction() {
    alert(`Click on Action for ${this.contextMenu.menuData.item}`);//Aquí
 }





validarOperaciones():boolean{

  console.log(this.selection.selected);
  this.indice=0;
  this.existeOperacionBroker=false
  //console.log('ID_PRE-SQL'+this.pId_SQLPreregistro);
  this.operacionBroker= new listaoperacionesbrokers;
  if (this.selection.selected.length>0)
  {
   
     for (let operacionBroker of  this.selection.selected ){
        if(  operacionBroker != null )
        {
          if(operacionBroker.s210_CAKS_UTILIZAR>0 )
          {
            this.operacionBroker_IDSQL = new ListaoperacionesBroker_IDSQL();
            this.operacionBroker_IDSQL.operacionesBroker=operacionBroker;
            //this.operacionBroker_IDSQL.idBroker_SQL=this.pId_SQLPreregistro;
            this.operacionBroker_IDSQL.estado="Pre-Registro";

            this.listaoperacionBroker_IDSQL[this.indice]=new  ListaoperacionesBroker_IDSQL();
            this.listaoperacionBroker_IDSQL[this.indice]=this.operacionBroker_IDSQL;
            this.indice=this.indice+1;
            this.existeOperacionBroker=true;
          }
        }
   }
  }
  
  return this.existeOperacionBroker
}

validarOperacionesSoyCrush():boolean{

  console.log(this.selectionSoyCrush.selected);
  this.indice=0;
  //console.log('ID_PRE-SQL'+this.pId_SQLPreregistro);
  
  this.operacionBroker= new listaoperacionesbrokers;
  if (this.selectionSoyCrush.selected.length>0)
  {
   
     for (let operacionBroker of  this.selectionSoyCrush.selected )
     {
        if(  operacionBroker != null )
        {
          if(operacionBroker.s210_CAKS_UTILIZAR>0 )
          {
            this.operacionBroker_IDSQL = new ListaoperacionesBroker_IDSQL();
            this.operacionBroker_IDSQL.operacionesBroker=operacionBroker;
            
            //this.operacionBroker_IDSQL.idBroker_SQL=this.pId_SQLPreregistro;
            this.operacionBroker_IDSQL.estado="Pre-Registro";
            this.operacionBroker_IDSQL.soyCrush=1;

            this.listaoperacionBroker_IDSQL[this.indice]=new  ListaoperacionesBroker_IDSQL();
            this.listaoperacionBroker_IDSQL[this.indice]=this.operacionBroker_IDSQL;
            this.indice=this.indice+1;
          }
          
        }
    }
    //Validar que cumpla las caracteristicas de un SoyCrush
    
    //Validación Grano
    this.checked = this.listaoperacionBroker_IDSQL.filter(i => i.operacionesBroker.s210_Underlying === 'S');
    if (this.checked.length>0){
      this.caks_S=0;
      this.ticker_S=this.checked[0].operacionesBroker.s210_TICKER
      this.tipoOpcion_S=this.checked[0].operacionesBroker.s210_TIPOOPCION
      this.tipoSellBuy_S=this.checked[0].operacionesBroker.s210_SellBuy
      this.esSoyCrush_S=false
      for (let operacionBroker_IDSQL of  this.checked)
      {
          this.caks_S=this.caks_S+operacionBroker_IDSQL.operacionesBroker.s210_CAKS_UTILIZAR  
          //Validar que sean de mismo ticker, tipo de opcion y tipo de operacion (compra/venta)
          if(operacionBroker_IDSQL.operacionesBroker.s210_TICKER===this.ticker_S) this.esSoyCrush_S=true;
          else {this.esSoyCrush_S=false
              return false
          }
          if(operacionBroker_IDSQL.operacionesBroker.s210_TIPOOPCION===this.tipoOpcion_S) this.esSoyCrush_S=true;
          else {this.esSoyCrush_S=false
            return false
          }
          if(operacionBroker_IDSQL.operacionesBroker.s210_SellBuy===this.tipoSellBuy_S) this.esSoyCrush_S=true;
          else {this.esSoyCrush_S=false
            return false
          }
      }
      if (this.esSoyCrush_S){
          if (this.caks_S % this.factor_Subyacente_S ==0){
            this.caks_S= this.caks_S /this.factor_Subyacente_S 
            this.esSoyCrush_S=true
          }
      }
    }
    else return false

    //Validación Aceite Soya
    this.checked = this.listaoperacionBroker_IDSQL.filter(i => i.operacionesBroker.s210_Underlying === 'SBO');
    this.caks_SBO=0;
    if (this.checked.length>0){
     
        this.ticker_SBO=this.checked[0].operacionesBroker.s210_TICKER
        this.tipoOpcion_SBO=this.checked[0].operacionesBroker.s210_TIPOOPCION
        this.tipoSellBuy_SBO=this.checked[0].operacionesBroker.s210_SellBuy
        this.esSoyCrush_SBO=false
        for (let operacionBroker_IDSQL of  this.checked)
        {
            this.caks_SBO=this.caks_SBO+operacionBroker_IDSQL.operacionesBroker.s210_CAKS_UTILIZAR  
            //Validar que sean de mismo ticker, tipo de opcion y tipo de operacion (compra/venta)
            if(operacionBroker_IDSQL.operacionesBroker.s210_TICKER===this.ticker_SBO) this.esSoyCrush_SBO=true;
            else {this.esSoyCrush_SBO=false
              return false
            }
            if(operacionBroker_IDSQL.operacionesBroker.s210_TIPOOPCION===this.tipoOpcion_SBO) this.esSoyCrush_SBO=true;
            else {this.esSoyCrush_SBO=false
              return false
            }
            if(operacionBroker_IDSQL.operacionesBroker.s210_SellBuy===this.tipoSellBuy_SBO) this.esSoyCrush_SBO=true;
            else {this.esSoyCrush_SBO=false
              return false
            }
        }
        if (this.esSoyCrush_SBO){
            if (this.caks_SBO % this.factor_Subyacente_SBO ==0){
              this.caks_SBO= this.caks_SBO /this.factor_Subyacente_SBO   
              this.esSoyCrush_SBO=true
            }
        }
    }
    // no existe registro de grano
    else return false

    //Validación harina soya
    this.checked = this.listaoperacionBroker_IDSQL.filter(i => i.operacionesBroker.s210_Underlying === 'SM');
    if (this.checked.length>0){
      this.caks_SBM=0;
      this.ticker_SBM=this.checked[0].operacionesBroker.s210_TICKER
      this.tipoOpcion_SBM=this.checked[0].operacionesBroker.s210_TIPOOPCION
      this.tipoSellBuy_SBM=this.checked[0].operacionesBroker.s210_SellBuy
      this.esSoyCrush_SBM=false
      for (let operacionBroker_IDSQL of  this.checked)
      {
          this.caks_SBM=this.caks_SBM+operacionBroker_IDSQL.operacionesBroker.s210_CAKS_UTILIZAR  
          //Validar que sean de mismo ticker, tipo de opcion y tipo de operacion (compra/venta)
          if(operacionBroker_IDSQL.operacionesBroker.s210_TICKER===this.ticker_SBM) this.esSoyCrush_SBM=true;
          else {this.esSoyCrush_SBM=false
              break
          }
          if(operacionBroker_IDSQL.operacionesBroker.s210_TIPOOPCION===this.tipoOpcion_SBM) this.esSoyCrush_SBM=true;
          else {this.esSoyCrush_SBM=false
                break
          }
          if(operacionBroker_IDSQL.operacionesBroker.s210_SellBuy===this.tipoSellBuy_SBM) this.esSoyCrush_SBM=true;
          else {this.esSoyCrush_SBM=false
              break
          }
      }
      if (this.esSoyCrush_SBM){
          if (this.caks_SBM % this.factor_Subyacente_SBM ==0){
            this.caks_SBM= this.caks_SBM /this.factor_Subyacente_SBM 
            this.esSoyCrush_SBM=true
          }
      }
    }
    else return false

    if ((this.caks_S!=this.caks_SBM) || (this.caks_S!=this.caks_SBO)) {
        Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Debe seleccionar la cantidad equivalente de los componentes.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',

        }
      });
      return false
    }

    return this.esSoyCrush_S && this.esSoyCrush_SBM && this.esSoyCrush_SBO

  }
  else{
    // Swal.fire({
    //   icon: 'warning',
    //   title: 'Aviso',
    //   text: 'SoyCrush - No ha seleccionado ninguna operación Broker',
    //   confirmButtonColor: '#0162e8',
    //   customClass: {
    //     container: 'my-swal'
    //   }
    // })
    return false;
  }
}



GuardarOperacionesBroker(){

    // console.log(this.selection.selected);

    // Validar que exista registro
    if (this.selectionSoyCrush.selected.length>0 &&     this.selection.selected.length>0 ){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Debe seleccionar registros de soycrush o commodities normales',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.selection.clear();
      this.selectionSoyCrush.clear();
    
    }
    else
    {
        if (this.validarOperacionesSoyCrush()){
          
        this.portafolioMoliendaIFDService.guardarPreregistroSQL(this.listaoperacionBroker_IDSQL).subscribe(
            data=>{
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se realizó el pre-registro.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                container: 'my-swal',

                }
              });
          
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
        else if (this.validarOperaciones()) {
          this.portafolioMoliendaIFDService.guardarPreregistroSQL(this.listaoperacionBroker_IDSQL).subscribe(
            data=>{
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se realizó el pre-registro.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                container: 'my-swal',

                }
              });
          
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            });

        }
        this.closeModal();
        //descheked
        //this.selectionSoyCrush.clear();
        this.listaoperacionBroker_IDSQL = [];
    }
  }

  


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

//   autoCloseForDropdownCars(event) {
//     var target = event.target;
//     if (!target.closest(".DropdownCars")) { 
//         // do whatever you want here
//         console.log('entro clic');
//     }
// }



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
      //this.fecha=this.getformattedDate();
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.portafolioMoliendaIFDService.fecha;
      this.visible=true;
      this.getLista_TipoOperation();
      this.productoselected=this.portafolioMoliendaIFDService.producto;
      this.getPortafolioIFDMolienda(this.productoselected,this.portafolioMoliendaIFDService.codigoEmpresa);
      this.idBroker=this.portafolioMoliendaIFDService.brokerSinCuenta
      this.getBroker();
      this.portafolioMoliendaIFDService.refresh$.subscribe(() => {
          this.getListaBrokerOperacionesSinCuenta(this.portafolioMoliendaIFDService.codigoEmpresa,this.productoselected, this.fecha,Number(this.idBroker));
          //this.getListaBroker_SQL_Operaciones(this.portafolioMoliendaIFDService.codigoEmpresa,this.fecha);
          

      });
      this.getListaBrokerOperacionesSinCuenta(this.portafolioMoliendaIFDService.codigoEmpresa,this.productoselected,this.fecha,Number(this.idBroker));
      //this.getListaBroker_SQL_Operaciones(this.portafolioMoliendaIFDService.codigoEmpresa,this.fecha);

      // this.portafolioMoliendaIFDService.getCodigoPreRegistroSQL().subscribe(
      //   (response: string) => {
      //     this.pId_SQLPreregistro = Number(response);
      //   },
      //   (error: HttpErrorResponse) => {
      //     alert(error.message);
      //   }
      // );
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      this.MatPaginatorSQL._intl.itemsPerPageLabel="Registros por Página";
      this.dataSourceSQLLiquidar = new MatTableDataSource<PortafolioIFDMolienda>([]);

      //this.idBroker=2;
      

}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


applyFilterSQL(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceSQL.filter = filterValue.trim().toLowerCase();
}

applyFilterSQLLiquidar(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceSQLLiquidar.filter = filterValue.trim().toLowerCase();
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

  GuardarOperacionesSQL(){
    this.myModalAsociar=true;
    this.myModalLiquidar=true;
    console.log('Selecion de Operacion  SQL'+this.selectionSQL.selected);
    if (this.selectionSQL.selected.length>0)
    {
    
    this.operacionesBroker_SQL = new listaoperacionesBroker_SQL;
    this.indice=0;
    for (let operacionesBroker_SQL of  this.selectionSQL.selected ){
        if(  operacionesBroker_SQL != null  )
        {
          //   console.log('ID Contract:'+ operacionesBroker_SQL.s211_Contract );
          //   console.log('Estado SQL:'+ operacionesBroker_SQL.s211_estado );
          //   console.log('Valor ID SQL:'+ operacionesBroker_SQL.s211_IDSQL  );
          //   console.log('Valor  Instrumento:'+ operacionesBroker_SQL.s211_Instrumento );
            this.listaOperacionesBroker_SQLseleccionadas[this.indice]=new listaoperacionesBroker_SQL;
            operacionesBroker_SQL.s211_User=this.usuario;
            this.listaOperacionesBroker_SQLseleccionadas[this.indice]=operacionesBroker_SQL
            this.indice=this.indice+1;
            this.operacionBroker= new listaoperacionesbrokers;
          }
      } // FOR
      this.portafolioMoliendaIFDService.guardarOperacion_SQL(this.listaOperacionesBroker_SQLseleccionadas).subscribe(data=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se registro la operación en la base de datos',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
          container: 'my-swal',

          }
        });
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      });
  } //PRIMER IF
  else{
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'No ha seleccionado ninguna operación para registrar a la base datos',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
  }
  // this.closeModal();

  }


  asociarBroker_OperacionesSQL(){

    console.log('Menu Item '+this.contextMenu.menuData.item);
    this.operacionBroker_IDSQL = new ListaoperacionesBroker_IDSQL();
     this.operacionBroker= new listaoperacionesbrokers;
     this.indice=0;
     for (let operacionBroker of  this.selection.selected ){
        if(  operacionBroker != null )
        {
          if(operacionBroker.s210_CAKS_UTILIZAR>0 )
          {
              //console.log('Cod PreSQL asociar: '+this.contextMenu.menuData.item.t373_IDSQL);
              //console.log('CAKS Inicial: '+operacionBroker.s210_CAKS_UTILIZAR);
              this.operacionBroker_IDSQL = new ListaoperacionesBroker_IDSQL();
              this.operacionBroker_IDSQL.operacionesBroker=operacionBroker;
              this.operacionBroker_IDSQL.idBroker_SQL=this.contextMenu.menuData.item.t373_IDSQL;
              this.operacionBroker_IDSQL.estado=this.contextMenu.menuData.item.t373_state;


          this.listaoperacionBroker_IDSQL[this.indice]=this.operacionBroker_IDSQL
          this.portafolioMoliendaIFDService.guardarPreregistroSQL(this.listaoperacionBroker_IDSQL).subscribe(
             data=>{
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Se asocio la operación',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                    container: 'my-swal',

                    }
                  });
                },
                (error: HttpErrorResponse) => {
                    alert(error.message);
                });
                this.operacionBroker= new listaoperacionesbrokers;

              }
              else{
                  Swal.fire({
                    icon: 'warning',
                    title: 'Aviso',
                    text: 'Se ha utilizado el 100% de los contratos',
                    confirmButtonColor: '#0162e8',
                    customClass: {
                      container: 'my-swal'
                    }
                  })
                }

      } 
    }
    this.closeModal();
  }



  modalAsociarPreRegistro(detalleForm1:any){
    this.flagAsociar=false;
    
    
    if (this.selectionSoyCrush.selected.length>0 &&     this.selection.selected.length>0 ){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Debe seleccionar registros de soycrush o commodities normales',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    
    }
    else
    {
      if (this.validarOperaciones()) 
      {
        this.operacionesSimilares=false;
        this.operacionesSimilares=this.existeOperacionesSimilaresAsociar(this.selection.selected);
        if (this.operacionesSimilares)
        {
            if (this.selection.selected.length>0)
            {    this.myModalLiquidar=true;
              this.myModalAsociar=true;
                //this.modalService.open(detalleForm2,{windowClass : "my-class"});
                this.indice=0;
                this.operacionBroker= new listaoperacionesbrokers;

                for (let operacionBroker of  this.selection.selected )
                {
                    if(  operacionBroker != null )
                    {
                      if(operacionBroker.s210_CAKS_UTILIZAR>0 )
                      {
                        // Evaluar que operaciones que se eligieron tienen IFD similarea asociar
                        this.operacionBroker= new listaoperacionesbrokers;
                        this.flagAsociar=true;
                        this.portafolioMoliendaIFDService.listaOperacionesBrokerAsociar[this.indice]=operacionBroker;
                        this.portafolioMoliendaIFDService.esSoyCrush=0;
                        this.indice=this.indice+1;  
                        
                      }
                      else{
                        Swal.fire({
                          icon: 'warning',
                          title: 'Aviso',
                          text: 'Se ha utilizado el 100% de los contratos',
                          confirmButtonColor: '#0162e8',
                          customClass: {
                            container: 'my-swal'
                          }
                        })
                      }
                        

                    }
                }
                if (this.flagAsociar) {
                this.modalService.open(detalleForm1, { centered: true,size: 'lg' });
                }
                //clearInterval();
            }
            else{
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'No ha seleccionado5 ninguna operación Broker',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              })
            }
          }
          else{
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Debe seleccionar registros similares',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }
      }
      else if (this.validarOperacionesSoyCrush()) 
      {  //caso de SoyCrush
        // this.operacionesSimilaresSoyCrush=false;
        // this.operacionesSimilaresSoyCrush=this.existeOperacionesSimilares(this.selectionSoyCrush.selected);
        // if (this.operacionesSimilaresSoyCrush)
        // {
            if (this.selectionSoyCrush.selected.length>0)
            {    this.myModalLiquidar=true;
              this.myModalAsociar=true;
                //this.modalService.open(detalleForm2,{windowClass : "my-class"});
                this.indice=0;
                this.operacionBroker= new listaoperacionesbrokers;

                for (let operacionBroker of  this.selectionSoyCrush.selected )
                {
                    if(  operacionBroker != null )
                    {
                      if(operacionBroker.s210_CAKS_UTILIZAR>0 )
                      {
                        // Evaluar que operaciones que se eligieron tienen IFD similarea asociar
                        this.operacionBroker= new listaoperacionesbrokers;
                        this.flagAsociar=true;
                        this.portafolioMoliendaIFDService.listaOperacionesBrokerAsociar[this.indice]=operacionBroker;
                        this.portafolioMoliendaIFDService.esSoyCrush=1;
                        this.indice=this.indice+1;  
                        
                      }
                      else{
                        Swal.fire({
                          icon: 'warning',
                          title: 'Aviso',
                          text: 'Se ha utilizado el 100% de los contratos',
                          confirmButtonColor: '#0162e8',
                          customClass: {
                            container: 'my-swal'
                          }
                        })
                      }
                        

                    }
                }
                if (this.flagAsociar) {
                this.modalService.open(detalleForm1, { centered: true,size: 'lg' });
                }
                //clearInterval();
            }
            else{
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'No ha seleccionado 1 ninguna operación Broker',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              })
            }
          // }
          // else{
          //   Swal.fire({
          //     icon: 'warning',
          //     title: 'Aviso',
          //     text: 'Debe seleccionar registros similares',
          //     confirmButtonColor: '#0162e8',
          //     customClass: {
          //       container: 'my-swal'
          //     }
          //   })
          // }
      }
    }

  }



  modalLiquidarRegistroSQL(detalleForm2:any){
    
    this.flagLiquidacion=false;
    
    if (this.selectionSoyCrush.selected.length>0 &&     this.selection.selected.length>0 ){
      this.selectionSoyCrush.clear();
      this.selection.clear();
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Debe seleccionar registros de soycrush o commodities normales',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    
    }
    else
    {
      if (this.validarOperaciones()) 
      {
        this.operacionesSimilares=false;
        this.operacionesSimilares=this.existeOperacionesSimilaresLiquidar(this.selection.selected);
        if (this.operacionesSimilares)
        {
          if (this.selection.selected.length>0)
          {    this.myModalLiquidar=true;
            this.myModalAsociar=true;
              //this.modalService.open(detalleForm2,{windowClass : "my-class"});
              this.indice=0;
              this.operacionBroker= new listaoperacionesbrokers;
              for (let operacionBroker of  this.selection.selected )
              {
                  if(  operacionBroker != null )
                  {
                    if(operacionBroker.s210_CAKS_UTILIZAR>0 )
                    {
                      this.flagLiquidacion=true;
                      this.portafolioMoliendaIFDService.listaOperacionesBrokerLiquidar[this.indice]=operacionBroker;
                      this.portafolioMoliendaIFDService.esSoyCrush=0;
                      this.indice=this.indice+1;  
                      
                    }
                    else{
                      Swal.fire({
                        icon: 'warning',
                        title: 'Aviso',
                        text: 'Se ha utilizado el 100% de los contratos',
                        confirmButtonColor: '#0162e8',
                        customClass: {
                          container: 'my-swal'
                        }
                      })
                    }
                      

                  }
              }
              if (this.flagLiquidacion) {
              this.modalService.open(detalleForm2, { centered: true,size: 'lg' });
              }
              //clearInterval();
          }
          else{
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'No ha seleccionado2 ninguna operación Broker',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }
        }
        
      }
      else if (this.validarOperacionesSoyCrush()) 
      {
        if (this.selectionSoyCrush.selected.length>0)
        {    this.myModalLiquidar=true;
          this.myModalAsociar=true;
            //this.modalService.open(detalleForm2,{windowClass : "my-class"});
            this.indice=0;
            this.operacionBroker= new listaoperacionesbrokers;

            for (let operacionBroker of  this.selectionSoyCrush.selected )
            {
              if(  operacionBroker != null )
              {
                if(operacionBroker.s210_CAKS_UTILIZAR>0 )
                {
                  this.flagLiquidacion=true;
                  this.portafolioMoliendaIFDService.listaOperacionesBrokerLiquidar[this.indice]=operacionBroker;
                  this.portafolioMoliendaIFDService.esSoyCrush=1;
                  this.indice=this.indice+1;  
                }
                else{
                  Swal.fire({
                    icon: 'warning',
                    title: 'Aviso',
                    text: 'Se ha utilizado el 100% de los contratos',
                    confirmButtonColor: '#0162e8',
                    customClass: {
                      container: 'my-swal'
                    }
                  })
                }
              }
            }
            if (this.flagLiquidacion) {
            this.modalService.open(detalleForm2, { centered: true,size: 'lg' });
            }
            //clearInterval();
        }
        else{
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No ha seleccionado 1 ninguna operación Broker',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
        }
        
      }
    }//fin de else de existe soycrush y oper. normales
    
  }

  public getPortafolioIFDMolienda(producto:number,sociedad:number): void {
    this.portafolioMoliendaIFDService.getPortaIFDfolioMolienda(producto,sociedad,this.fecha).subscribe(
      (response: PortafolioIFDMolienda[]) => {
        this.portafolioLiquidar = response;

      
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  
  public existeOperacionesSimilaresAsociar(pListaOperacionesBroker: listaoperacionesbrokers[]):boolean{

    this.operacionBroker =pListaOperacionesBroker[0];
    if ((pListaOperacionesBroker.filter(i => i.s210_TICKER != this.operacionBroker.s210_TICKER).length>0)
    || (pListaOperacionesBroker.filter(i => i.s210_TIPOOPCION != this.operacionBroker.s210_TIPOOPCION).length>0 )
    ||(pListaOperacionesBroker.filter(i => i.s210_TIPOOPERACION != this.operacionBroker.s210_TIPOOPERACION).length>0)
    )
    {
                    return false;
    }
    else {
          //for (let operacionesBroker of  pListaOperacionesBroker ){
            for (let indice = 0; indice < pListaOperacionesBroker.length; indice++) {
              for (let j = 0; j < this.listaOperacionesBroker_SQL.length; j++) {
                  if ((this.listaOperacionesBroker_SQL[j].s211_Ticker ===pListaOperacionesBroker[indice].s210_TICKER)
                  && (this.listaOperacionesBroker_SQL[j].s211_Instrumento  ===pListaOperacionesBroker[indice].s210_TIPOOPCION)
                  && (this.listaOperacionesBroker_SQL[j].s211_TipoOperacion  ===pListaOperacionesBroker[indice].s210_TIPOOPERACION)
                  )
                  {
                          return true;
                  }
              }
            }
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'No existe pre-registro(s) para asociar',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
              })
      }
      return false;
  }
  public existeOperacionesSimilaresLiquidar(pListaOperacionesBroker: listaoperacionesbrokers[]):boolean{

    this.operacionBroker =pListaOperacionesBroker[0];
    this.caksLiquidar=0;
    

    this.listaOperacionesBrokerSeleccionadas=pListaOperacionesBroker.filter(i => i.s210_TIPOOPERACION != this.operacionBroker.s210_TIPOOPERACION);

    if ((pListaOperacionesBroker.filter(i => i.s210_TICKER != this.operacionBroker.s210_TICKER).length>0)
    || (pListaOperacionesBroker.filter(i => i.s210_TIPOOPCION != this.operacionBroker.s210_TIPOOPCION).length>0 )
    ||(pListaOperacionesBroker.filter(i => i.s210_TIPOOPERACION != this.operacionBroker.s210_TIPOOPERACION).length>0)
    )
    {
                return false;
    }
    else {
        for (let indice = 0; indice < pListaOperacionesBroker.length; indice++) {
          this.ticker=pListaOperacionesBroker[indice].s210_TICKER;
          this.tipopcion=pListaOperacionesBroker[indice].s210_TIPOOPCION;
          this.tipoOperacion=pListaOperacionesBroker[indice].s210_TIPOOPERACION;
          this.caksLiquidar=this.caksLiquidar+pListaOperacionesBroker[indice].s210_CAKS_UTILIZAR;
          if (this.tipoOperacion.toUpperCase()==='COMPRA'){this.tipoOperacion="VENTA"}
          else{this.tipoOperacion="COMPRA"}
          for (let j = 0; j < this.portafolioLiquidar.length; j++) {
            // if ((this.portafolioLiquidar[j].s208_Ticker ===this.ticker)
            // && (this.portafolioLiquidar[j].s208_TipoInstrumento  ===this.tipopcion)
            // && (this.portafolioLiquidar[j].s208_TipoOperacion===this.tipoOperacion)
            // && (this.portafolioLiquidar[j].s208_NumeroContratos>=this.caksLiquidar )
            // )
            // {
            //         return true;
            // }
            return true //quitar
          }

        }
  
      }  
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No existe registro(s) para liquidar',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
        })     
      return false;
  
    }
    public getBroker(): void {
      var dataBroker:number =1
      this.portafolioMoliendaIFDService.getBrokerDataOperaciones(dataBroker).subscribe(
        (response: Broker[]) => {
          this.listaBroker = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    onSelectBroker(id){
      if (typeof id !== 'undefined') {
       this.idBroker  =id;
       this.portafolioMoliendaIFDService.brokerSinCuenta=this.idBroker
       this.getListaBrokerOperacionesSinCuenta(this.portafolioMoliendaIFDService.codigoEmpresa,this.productoselected, this.fecha,Number(this.idBroker));
     }
    }

  }