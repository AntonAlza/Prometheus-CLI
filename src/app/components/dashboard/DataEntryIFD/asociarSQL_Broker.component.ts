import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
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
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';


@Component({
  selector: 'app-asociarSQL_Broker',
  templateUrl: './asociarSQL_Broker.component.html',
  styleUrls: ['./asociarSQL_Broker.component.scss']
})

export class asociarSQL_BrokerComponent implements OnInit {
  
  
  
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
  public listaOperacionesRJO: listaoperacionesbrokers[] = [];
  public listaOperacionesRJO_SQL: listaoperacionesBroker_SQL[] = [];
  public operacionRJO:listaoperacionesbrokers;
  public pId_SQLPreregistro:number;
  public operacionRJO_IDSQL:ListaoperacionesBroker_IDSQL;
  public portafolio: PortafolioIFDMolienda[] = [];
  public listaasociarOperacionesSQL:AsociarSQL[]=[];
  public ticker:string;
  public tipopcion:string;
  public tipoOperacion:string;
  public tipoSoyCrush:number;
  public caks_utilizar:number;
  public strike:number;
  public listaOperacionesRJOSeleccionadas: listaoperacionesbrokers[] = [];
  public listaoperacionRJO_IDSQL:ListaoperacionesBroker_IDSQL[]=[];
  public indice:number;
  public fecha: number;
  date: NgbDateStruct;

  public IdInstrument:number;

  private _refresh$= new Subject<void>();
  suscription: Subscription;


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('MatPaginatorSQL', { static: true }) MatPaginatorSQL!: MatPaginator;
  @ViewChild('MatSortSQLFinal') MatSortSQLFinal!: MatSort;

  myModal=false;  
  

  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();
  
  //public  visible: boolean;

  displayedColumnsAsociarSQL: string[] = [
    'select',
    't373_IDSQL'
    ,'t373_state'

   ]

    
   checked: any = [];

   getCheckbox() {
     this.checked = this.listaasociarOperacionesSQL.filter(i => i.t373_elegir == true);
   }
 
   changeChkState(id) {
     this.listaasociarOperacionesSQL.forEach(chk => {
       if (chk.t373_IDSQL === id) {
         chk.t373_elegir = !chk.t373_elegir;
         this.getCheckbox();
       }
       else
       {
         chk.t373_elegir =false;
 
       }
     });
   }  
 

    @ViewChildren('checkBox') checkBox: QueryList<any>;
    
  
    dataSourceSQLFinal: MatTableDataSource<AsociarSQL>;
    selectionSQLFinal = new SelectionModel<AsociarSQL>(true, []);
    hiddenSQLFinal = false;
  
  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.alwaysShowCalendars = true;

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

  

 getformattedDate():number{
  this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
  return Number(this.dateToString(this.date));
}
  
  // ngOnDestroy() {
    //   clearInterval(this.obtenerEstado);
    // }
  
  ngOnInit(): void {
    
        
        //this.fecha=20220225;//20220307//20220225;
        //this.fecha=this.getformattedDate();
        this.fecha=this.portafolioMoliendaIFDService.fecha;
        this.visible=true;
        this.getListaAsociarOperacionesSQL(this.fecha);//(Number(this.dateToString(this.fecha))-4);
        this.portafolioMoliendaIFDService.refresh$.subscribe(() => {
        this.getListaAsociarOperacionesSQL(this.fecha);//(Number(this.dateToString(this.fecha))-4);
      });
      
  }

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceSQLFinal.filter = filterValue.trim().toLowerCase();
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
    
    this.modalReference = this.modalService.open(content);
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    
    
      
  }
  cerrar() {
    console.log("modal cerrado liquidar");
    this.close.emit(false);  

  }
  

  
  liquidarRJO_OperacionesSQL(){

    console.log('Menu Item '+this.contextMenu.menuData.item);
    this.operacionRJO_IDSQL = new ListaoperacionesBroker_IDSQL();
     this.operacionRJO= new listaoperacionesbrokers;
     this.indice=0;
     for (let operacionRJO of  this.portafolioMoliendaIFDService.listaOperacionesBrokerLiquidar )
     {
        if(  operacionRJO != null )
        {
          if (operacionRJO.s210_CAKS_UTILIZAR>0 )
          {
              //console.log('Cod SQL Liquidar: '+this.contextMenu.menuData.item.s208_Operacion);
              //console.log('CAKS Inicial: '+operacionRJO.s210_CAKS_UTILIZAR);

              this.operacionRJO_IDSQL.operacionesBroker=operacionRJO;
              this.operacionRJO_IDSQL.idBroker_SQL=this.contextMenu.menuData.item.s208_Operacion;
              this.operacionRJO_IDSQL.estado="Pre-Liquidación";
          
          this.listaoperacionRJO_IDSQL[this.indice]=this.operacionRJO_IDSQL;
          this.operacionRJO= new listaoperacionesbrokers;
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
    this.portafolioMoliendaIFDService.guardarPreregistroSQL(this.listaoperacionRJO_IDSQL).subscribe(
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
    this.closeModal();
  }

  public getListaAsociarOperacionesSQL(fecha:number): void {
    
    


    this.operacionRJO= new listaoperacionesbrokers;
    this.listaOperacionesRJOSeleccionadas=this.portafolioMoliendaIFDService.listaOperacionesBrokerAsociar; 
    console.log('Valor selecionnado: '+this.listaOperacionesRJOSeleccionadas[0].s210_IDBroker);
    for (let item of  this.listaOperacionesRJOSeleccionadas ){
        if (item.s210_CAKS_UTILIZAR>0){
          this.ticker=item.s210_TICKER;
          this.tipopcion=item.s210_TIPOOPCION;
          this.tipoOperacion=item.s210_TIPOOPERACION;
          this.caks_utilizar=item.s210_CAKS_UTILIZAR
          this.tipoSoyCrush=this.portafolioMoliendaIFDService.esSoyCrush;
          this.IdInstrument=item.s210_Instrument;
          switch(item.s210_Underlying) { 
            case "SBO": { 
              this.strike=item.s210_STRIKE/100
               break; 
            } 
            case "SCRS": { 
              this.strike=item.s210_STRIKE/100
               break; 
            }
            case "S": { 
              this.strike=item.s210_STRIKE/100
               break; 
            }
            case "W": { 
              this.strike=item.s210_STRIKE/100
               break; 
            } 
            default: { 
              this.strike=item.s210_STRIKE
               break; 
            } 
         } 
          
        }
    }
    //AGREGAR Cantidad, para validar.
    this.portafolioMoliendaIFDService.getListaAsociarOperacionesSQL(
    this.ticker,this.IdInstrument,this.tipoOperacion,this.tipoSoyCrush, fecha,this.caks_utilizar,this.strike).subscribe(
    //this.portafolioMoliendaIFDService.getListaAsociarOperacionesSQL(fecha).subscribe(
    (response:  AsociarSQL[]) => {
      this.listaasociarOperacionesSQL = response;
      this.dataSourceSQLFinal = new MatTableDataSource(this.listaasociarOperacionesSQL);
  
      this.selectionSQLFinal = new SelectionModel<AsociarSQL>(true, []);
  
      this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
      this.dataSourceSQLFinal.sort = this.MatSortSQLFinal;
  
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}
  
  asociarRJO_OperacionesSQL(){
    
    this.checked = this.listaasociarOperacionesSQL.filter(i => i.t373_elegir == true);    
    console.log('Menu Item '+this.checked[0].t373_IDSQL );
    this.indice=0;
    this.operacionRJO_IDSQL = new ListaoperacionesBroker_IDSQL();
     this.operacionRJO= new listaoperacionesbrokers;
     this.listaoperacionRJO_IDSQL=[];
     for (let operacionRJO of  this.portafolioMoliendaIFDService.listaOperacionesBrokerAsociar ){
        if(  operacionRJO != null )
        {
          if(operacionRJO.s210_CAKS_UTILIZAR>0 )
          {

            //acá se debe validar que la operacion que se marque solo muestre operaciones de asociar similares.
            // 1er validación que las operaciones marcadas tienen que ser las mismas
            

              //console.log('Cod PreSQL asociar: '+this.contextMenu.menuData.item.t373_IDSQL);
              //console.log('CAKS Inicial: '+operacionRJO.s210_CAKS_UTILIZAR);


              this.operacionRJO_IDSQL.operacionesBroker=operacionRJO;
              this.operacionRJO_IDSQL.idBroker_SQL=this.checked[0].t373_IDSQL;
              this.operacionRJO_IDSQL.estado=this.checked[0].t373_state;
              this.operacionRJO_IDSQL.soyCrush=this.portafolioMoliendaIFDService.esSoyCrush;
              this.operacionRJO_IDSQL.liquidar=0;
              this.operacionRJO_IDSQL.asociar=1;
          this.listaoperacionRJO_IDSQL[this.indice]=this.operacionRJO_IDSQL
          this.portafolioMoliendaIFDService.guardarPreregistroSQL(this.listaoperacionRJO_IDSQL).subscribe(
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
                this.operacionRJO= new listaoperacionesbrokers;

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

}


