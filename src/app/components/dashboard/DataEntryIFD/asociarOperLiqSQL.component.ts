import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { listaoperacionesbrokers } from 'src/app/models/IFD/listaoperacionesbrokers';
import { ListaoperacionesBroker_Liquidar } from 'src/app/models/IFD/listaOperacionesBrokerLiquidar';
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

import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { PortafolioIFDMoliendaLiquidar } from 'src/app/models/IFD/portafolioIFDMoliendaLiquidar';
import { OperacionLiquidada } from 'src/app/models/IFD/operacionLiquidada';

@Component({
  selector: 'app-asociarOperLiqSQL',
  templateUrl: './asociarOperLiqSQL.component.html',
  styleUrls: ['./asociarOperLiqSQL.component.scss']
})

export class asociarOperLiqSQLComponent implements OnInit {
  
  
  
  public listaPreciosBase: number;
  public listaPreciosFuturo: number;
  public listaPreciosFlat: number;
  public tipo: string;
  public caksInt: number=0;
  public factorMetricTonPrice: number;
  public destinoSelected: string;
  public conceptoSelected: string;
  public signoSelected: string;
  public contador: number;
  public orden: number;
  public totalUSDTM: number;
  public totalprecio: number;
  public dialog: MatDialogModule;
  public listaOperacionesBroker: listaoperacionesbrokers[] = [];
  public listaOperacionesBroker_SQL: listaoperacionesBroker_SQL[] = [];
  public operacionBroker:listaoperacionesbrokers;
  public pId_SQLPreregistro:number;
  public operacionBroker_IDSQL:ListaoperacionesBroker_IDSQL;
  public operacionBroker_Liquidar:ListaoperacionesBroker_Liquidar;
  public listaoperacionBroker_IDSQL:ListaoperacionesBroker_IDSQL[]=[];
  public portafolioLiquidar: PortafolioIFDMoliendaLiquidar[] = [];

  private _refresh$= new Subject<void>();
  suscription: Subscription;

  public ticker:string;
  public tipopcion:string;
  public tipoOperacion:string;
  public productoLiquidar :number;
  public caksLiquidar:number;
  public listaOperacionesBrokerSeleccionadas: listaoperacionesbrokers[] = [];
  public listaOperacionesBrokerSeleccionadasLiquidar: ListaoperacionesBroker_Liquidar[] = [];
  public indice: number;
  public fecha: number;
  date: NgbDateStruct;

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
  
  displayedColumnsAsociarLiquidar: string[] = [ 
    'select',
    's212_Operacion'
    ,'s212_Ticker'
    ,'s212_CodigoBroker'
    ,'s212_Ficha'
    ,'s212_Instrumento'
    ,'s212_CompraVenta'
    ,'s212_NumeroContratos'
    ,'s212_PrecioEjercicio'

  ];

     
    @ViewChildren('checkBox') checkBox: QueryList<any>;
    
  
    dataSourceSQLLiquidar: MatTableDataSource<PortafolioIFDMoliendaLiquidar>;
    selectionSQLLiquidar = new SelectionModel<PortafolioIFDMoliendaLiquidar>(false, []);
    hiddenSQLLiquidar = false;
  
  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.alwaysShowCalendars = true;

  }

  checked: any = [];

  getCheckbox() {
    this.checked = this.portafolioLiquidar.filter(i => i.s212_elegir == true);
  }

  changeChkState(id) {
    this.portafolioLiquidar.forEach(chk => {
      if (chk.s212_Operacion === id) {
        chk.s212_elegir = !chk.s212_elegir;
        this.getCheckbox();
      }
      else
      {
        chk.s212_elegir =false;

      }
    });
  }  

  
  
  // isAllSelectedSQLLiquidar() {
  //   const numSelected = this.selectionSQLLiquidar.selected.length;
  //   const numRows = this.dataSourceSQLLiquidar.data.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggleSQLLiquidar() {
  //   //this.isAllSelectedSQLLiquidar() ?
  //       this.selectionSQLLiquidar.clear();
  //   //    this.dataSourceSQLLiquidar.data.forEach(row => this.selectionSQLLiquidar.select(row));
  // }



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

  

  
  // ngOnDestroy() {
    //   clearInterval(this.obtenerEstado);
    // }
  
 getformattedDate():number{
  this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
  return Number(this.dateToString(this.date));
}
  
  ngOnInit(): void {
       
       this.visible=true;
       //this.fecha=20220307;
       //this.fecha=this.getformattedDate();
       
       this.fecha=this.portafolioMoliendaIFDService.fecha;
       this.getPortafolioIFDMoliendaLiquidar(this.portafolioMoliendaIFDService.producto,this.portafolioMoliendaIFDService.codigoEmpresa);
       this.portafolioMoliendaIFDService.refresh$.subscribe(() => {
            this.getPortafolioIFDMoliendaLiquidar(this.portafolioMoliendaIFDService.producto,this.portafolioMoliendaIFDService.codigoEmpresa);
    //     // Generar codigo SQL_PreRegistro        
    //     this.portafolioMoliendaIFDService.getCodigoPreRegistroSQL().subscribe(
    //       (response: string) => {
    //         this.pId_SQLPreregistro =Number(response);
    //       },
    //       (error: HttpErrorResponse) => {
    //         alert(error.message);
    //       }
    // );
      });
      // this.portafolioMoliendaIFDService.getCodigoPreRegistroSQL().subscribe(
      //   (response: string) => {
      //     this.pId_SQLPreregistro = Number(response);
      //   },
      //   (error: HttpErrorResponse) => {
      //     alert(error.message);
      //   }
      // );
}

applyFilter(event: Event) {
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
  
  JoinAndClose() {
    this.modalReference.close();
  }
   
  open(content: any, options?: NgbModalOptions) {
    
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    //this.getPortafolioIFDMolienda(4,7);//(Number(this.dateToString(this.fecha))-4);
    
  }

  cerrar() {
    console.log("modal cerrado liquidar");
    this.close.emit(false);  

  }
  

  cerrarModal(e){
    
    console.log("modal cerrado asociar");
    this.myModal=false;
    this.modalReference.close();  
  }

 
  
  public getPortafolioIFDMoliendaLiquidar(producto:number,sociedad:number): void {
    
    this.operacionBroker= new listaoperacionesbrokers;
    this.operacionBroker_Liquidar=new ListaoperacionesBroker_Liquidar
    this.listaOperacionesBrokerSeleccionadas=this.portafolioMoliendaIFDService.listaOperacionesBrokerLiquidar; 
    this.caksLiquidar=0;
    this.indice=0;
    if (this.portafolioMoliendaIFDService.esSoyCrush){
      for (let operacionBroker of  this.listaOperacionesBrokerSeleccionadas ){
        
              this.listaOperacionesBrokerSeleccionadasLiquidar[this.indice]=new ListaoperacionesBroker_Liquidar;
              this.operacionBroker_Liquidar.operacionesBroker=operacionBroker;
              this.operacionBroker_Liquidar.codEmpresa=this.portafolioMoliendaIFDService.codigoEmpresa;
              this.listaOperacionesBrokerSeleccionadasLiquidar[this.indice]=this.operacionBroker_Liquidar
              this.operacionBroker= new listaoperacionesbrokers;
              this.operacionBroker_Liquidar= new ListaoperacionesBroker_Liquidar;
              this.indice=this.indice+1;

        

      }
      this.portafolioMoliendaIFDService.getPortafolioLiquidarSoyCrush(this.listaOperacionesBrokerSeleccionadasLiquidar).subscribe(
        (response: PortafolioIFDMoliendaLiquidar[]) => {
          this.portafolioLiquidar = response;
          
          this.dataSourceSQLLiquidar = new MatTableDataSource(this.portafolioLiquidar);
          this.selectionSQLLiquidar = new SelectionModel<PortafolioIFDMoliendaLiquidar>(true, []);
          this.dataSourceSQLLiquidar.paginator = this.MatPaginatorSQL;
          this.dataSourceSQLLiquidar.sort = this.MatSortSQL;
      },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    else{
        
        for (let item of  this.listaOperacionesBrokerSeleccionadas ){
            if (item.s210_CAKS_UTILIZAR>0){
              this.ticker=item.s210_TICKER;
              this.tipopcion=item.s210_TIPOOPCION;
              this.tipoOperacion=item.s210_TIPOOPERACION;
              this.caksLiquidar=this.caksLiquidar+item.s210_CAKS_UTILIZAR;
              this.productoLiquidar=item.s210_ID_Underlying;
            }
        }
        if (this.tipoOperacion.toUpperCase()==='COMPRA'){this.tipoOperacion="VENTA"}
        else{this.tipoOperacion="COMPRA"}
        this.portafolioMoliendaIFDService.getPortaIFDLiquidarfolioMolienda(this.ticker,this.tipopcion,this.tipoOperacion,
                                                                          this.caksLiquidar, this.productoLiquidar,sociedad).subscribe(
          (response: PortafolioIFDMoliendaLiquidar[]) => {
            this.portafolioLiquidar = response;
            
            this.dataSourceSQLLiquidar = new MatTableDataSource(this.portafolioLiquidar);
            this.selectionSQLLiquidar = new SelectionModel<PortafolioIFDMoliendaLiquidar>(true, []);
            this.dataSourceSQLLiquidar.paginator = this.MatPaginatorSQL;
            this.dataSourceSQLLiquidar.sort = this.MatSortSQL;
            
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );

      }
    

  }

  liquidarBroker_OperacionesSQL(){
    
    this.listaoperacionBroker_IDSQL=[];
    this.checked = this.portafolioLiquidar.filter(i => i.s212_elegir == true);    
    console.log('Menu Item '+this.checked[0].s212_Operacion );
    this.operacionBroker_IDSQL = new ListaoperacionesBroker_IDSQL();
     this.operacionBroker= new listaoperacionesbrokers;
     this.indice=0;
     for (let operacionBroker of  this.portafolioMoliendaIFDService.listaOperacionesBrokerLiquidar )
     {
        if(  operacionBroker != null )
        {
          if (operacionBroker.s210_CAKS_UTILIZAR>0 )
          {
              this.listaoperacionBroker_IDSQL[this.indice]=new ListaoperacionesBroker_IDSQL;
              this.operacionBroker_IDSQL.operacionesBroker=operacionBroker;
              this.operacionBroker_IDSQL.idBroker_SQL=this.checked[0].s212_Operacion;
              this.operacionBroker_IDSQL.estado="Pre-Liquidación";
              this.operacionBroker_IDSQL.soyCrush=this.portafolioMoliendaIFDService.esSoyCrush;
              this.operacionBroker_IDSQL.liquidar=1;
              this.operacionBroker_IDSQL.asociar=0;
              this.listaoperacionBroker_IDSQL[this.indice]=this.operacionBroker_IDSQL
              this.operacionBroker= new listaoperacionesbrokers;
              this.operacionBroker_IDSQL= new ListaoperacionesBroker_IDSQL;
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
    this.portafolioMoliendaIFDService.guardarPreregistroSQL(this.listaoperacionBroker_IDSQL).subscribe(
      data=>{
           Swal.fire({
             position: 'center',
             icon: 'success',
             title: 'Se registro la operación a liquidar',
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
    this.closeModal();
  }


}


