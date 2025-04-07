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
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { InventarioTransitoACubrir } from 'src/app/models/IFD/InventarioTransitoACubrir';
import { ConsumoACubrir } from 'src/app/models/IFD/ConsumoCubrir';


@Component({
  selector: 'app-elegirConsumo',
  templateUrl: './elegirConsumo.component.html',
  styleUrls: ['./elegirConsumo.component.scss']
})

export class elegirConsumoComponent implements OnInit {
  
  
  
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
  public listaConsumo:ConsumoACubrir[] = [];
  public listaConsumoSeleccionadas: ConsumoACubrir[] = [];
  public consumo:ConsumoACubrir;
  
  public pId_SQLPreregistro:number;
  public operacionRJO_IDSQL:ListaoperacionesBroker_IDSQL;
  public portafolio: PortafolioIFDMolienda[] = [];
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
  public idPortafolio:number;
  public idEmpresa:number;
  public idEstrategia:number;
  public tmCubierta:number;
  

  date: NgbDateStruct;

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
    's263_Sociedad'
    ,'s263_Subyacente'
    ,'s263_Mes'
    ,'s263_TMCubrir'
    ,'s263_Asignados'
    ,'s263_Asignar'
    ,'s263_Estado'
    
   ]

    
   checked: any = [];

 
 
 

    @ViewChildren('checkBox') checkBox: QueryList<any>;
    
  
    dataSourceSQLFinal: MatTableDataSource<ConsumoACubrir>;
    selectionSQLFinal = new SelectionModel<ConsumoACubrir>(true, []);
    hiddenSQLFinal = false;
  
  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService, 
    public dialogRef: MatDialogRef<elegirConsumoComponent>) {
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

  

 getformattedDate():number{
  this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
  return Number(this.dateToString(this.date));
}
  
  // ngOnDestroy() {
    //   clearInterval(this.obtenerEstado);
    // }
  
  ngOnInit(): void {
    
        this.idEmpresa=this.portafolioMoliendaIFDService.codigoEmpresa;
        this.fecha=this.portafolioMoliendaIFDService.fecha;
        this.idPortafolio=this.portafolioMoliendaIFDService.codPortafolio;
        this.idEstrategia=Number(this.portafolioMoliendaIFDService.idEstrategia);
        this.tmCubierta=this.portafolioMoliendaIFDService.tmEstrategia;
        this.visible=true;
        this.getListaConsumo(this.idEmpresa,this.idPortafolio,this.idEstrategia);
        
        
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
    console.log("modal cerrado asociar");
    this.dialogRef.close();
    this.close.emit(false);  

  }
  

  

  public getListaConsumo(idEmpresa:number,idPortafolio:number,idEstrategia:number): void {
    
    this.portafolioMoliendaIFDService.getListaConsumo(idEmpresa,idPortafolio,idEstrategia ).subscribe(
    (response:  ConsumoACubrir[]) => {
      this.listaConsumo = response;

      for (let consumoCubrir of  this.portafolioMoliendaIFDService.consumoCubrir  ){
        for (let i = 0; i <this.listaConsumo.length ; i++) {  
            if (this.listaConsumo[i].s263_CodigoConsumo==consumoCubrir.s263_CodigoConsumo &&
              this.listaConsumo[i].s263_CodigoSociedad==consumoCubrir.s263_CodigoSociedad &&
              this.listaConsumo[i].s263_CodigoMes==consumoCubrir.s263_CodigoMes &&
              this.listaConsumo[i].s263_Estado==consumoCubrir.s263_Estado &&
              this.listaConsumo[i].s263_CodigoSubyacente==consumoCubrir.s263_CodigoSubyacente ){
              this.listaConsumo[i].s263_Asignar =consumoCubrir.s263_Asignar;
            }
        }
     }



      this.dataSourceSQLFinal = new MatTableDataSource(this.listaConsumo);
  
      this.selectionSQLFinal = new SelectionModel<ConsumoACubrir>(true, []);
  
      this.dataSourceSQLFinal.paginator = this.MatPaginatorSQL;
      this.dataSourceSQLFinal.sort = this.sort;
  



    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}
  
consumoRegistrar(){
    
  
  let totalTMAsignar:number;
  let totalTMAsignados:number;
  let totalTMAsignadosMarcados:number;
  let tipoPartida:string='';
  let tipoPartidaBD:string='';
  let totalTMQuitar:number=0;

  totalTMAsignar=0;
  totalTMAsignados=0;
  totalTMAsignadosMarcados=0;
  this.checked=[];
  this.portafolioMoliendaIFDService.consumoCubrir=[];
  if (this.selectionSQLFinal.selected.length>0){
    this.checked = this.selectionSQLFinal.selected;   
    for (let consumo of  this.listaConsumo  ){
      totalTMAsignados=totalTMAsignados+ consumo.s263_Asignados
      if(consumo.s263_Asignados>0){
        tipoPartida=consumo.s263_Estado
      }

    }
    for (let consumo of  this.checked ){

      totalTMAsignar=totalTMAsignar+consumo.s263_Asignar
      if (consumo.s263_Asignar==0){
        totalTMQuitar=totalTMQuitar+consumo.s263_Asignados
      }
      
      if (tipoPartida!='' && tipoPartida!=consumo.s263_Estado){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe tener el mismo tipo de partida.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',        
          }
        });
        return false;
      }
      tipoPartida=consumo.s263_Estado;
    }
    
    if (totalTMAsignar==0){
      for (let consumo of  this.checked ){
        totalTMAsignadosMarcados=totalTMAsignadosMarcados+consumo.s263_Asignados
      }
      if (totalTMAsignadosMarcados==totalTMAsignados){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe tener una partida con TM asignadas.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
      
          }
        });
        return false
      }
    }
    
    
    if ((totalTMAsignar+totalTMAsignados-totalTMQuitar)>this.tmCubierta){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Las TM asignadas tiene que ser menor al total.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',
    
        }
      });
      return false
    }
    else{
      this.portafolioMoliendaIFDService.consumoCubrir =this.checked
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se realizó la asignación.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
        container: 'my-swal',
        }
      });
      this.cerrar();
      return true
    }
  }
  else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'No ha seleccionado ninguna partida.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',
  
      }
    });
  }
  return true;
  }
  embarqueQuitar(){
    
    var totalTMAsignar:number;
    var totalTMAsignados:number;
    totalTMAsignar=0;
    totalTMAsignados=0;
    // this.portafolioMoliendaIFDService.embarquePricingACubrir=[];
    // if (this.selectionSQLFinal.selected.length>0){
    //   this.checked = this.selectionSQLFinal.selected;   
    //   for (let emmbarquePricing of  this.listaEmbarquePricing  ){
    //     totalTMAsignados=totalTMAsignados+ emmbarquePricing.s258_Asignados
    //   }
    //   for (let emmbarquePricing of  this.checked ){
    //       totalTMAsignar=totalTMAsignar+emmbarquePricing.s258_Asignar
    //   }
    //   if ((totalTMAsignar+totalTMAsignados)>this.tmCubierta){
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'error',
    //       title: 'Las TM asignadas tiene que ser menor al total.',
    //       confirmButtonColor: '#0162e8',
    //       customClass: {
    //       container: 'my-swal',
      
    //       }
    //     });
    //     // return false
    //   }
    //   else{
    //     this.portafolioMoliendaIFDService.embarquePricingACubrir=this.checked
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'success',
    //       title: 'Se realizó la asignación.',
    //       showConfirmButton: false,
    //       timer: 1500,
    //       customClass: {
    //       container: 'my-swal',
    //       }
    //     });
    //     this.cerrar();
    //     // return true
    //   }
    // }
    // else{
    //   Swal.fire({
    //     position: 'center',
    //     icon: 'error',
    //     title: 'No ha seleccionado ninguna partida.',
    //     confirmButtonColor: '#0162e8',
    //     customClass: {
    //     container: 'my-swal',
    
    //     }
    //   });
    // }
  }
  
}