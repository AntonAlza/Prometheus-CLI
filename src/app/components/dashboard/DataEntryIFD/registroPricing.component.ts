import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input, Output, OnChanges, SimpleChanges, ElementRef, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {NgbDateStruct, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HostListener } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { OperacionesSQL } from 'src/app/models/IFD/operacionSQL';
import { TipoContrato } from 'src/app/models/IFD/tipoContrato';
import { Bolsa } from 'src/app/models/IFD/bolsa';
import { Contrato } from 'src/app/models/IFD/Contrato';
import { MesExpiracion } from 'src/app/models/IFD/mesExpiracion';
import { TipoLiquidacion } from 'src/app/models/IFD/tipoLiquidacion';
import { SellBuy } from 'src/app/models/IFD/sellbuy';
import { Broker } from 'src/app/models/IFD/broker';
import { Sociedad } from 'src/app/models/IFD/sociedad';
import { Benchmark } from 'src/app/models/IFD/benchmark';
import { TypeOperation } from 'src/app/models/IFD/TypeOperation';
import { Descripcion } from 'src/app/models/IFD/descripcion';
import { NgSelectModule } from '@ng-select/ng-select';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { SubordinateAccount } from 'src/app/models/IFD/subordinateAccount';
import { OperacionSQL_Broker } from 'src/app/models/IFD/operacionSQL_Broker';
import { OperacionLiquidar } from 'src/app/models/IFD/operacionLiquidar';
import { PlanningByCampaign } from 'src/app/models/IFD/planningByCampaign';
import { Pricing } from 'src/app/models/IFD/pricing';

@Component({
  selector: 'app-registroPricing',
  templateUrl: './registroPricing.component.html',
  styleUrls: ['./registroPricing.component.scss']

  
})

export class registroPricingComponent implements OnInit {


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
  public ticker:string;
  public tipopcion:string;
  public tipoOperacion:string;
  public tipoSoyCrush:number;
  public caks_utilizar:number;
  public indice:number;
  public fecha: number;
  public guardoPricing:Boolean;
  date: NgbDateStruct;


  public usuario: string;
  public operacionSQL: OperacionesSQL;
  public operacionLiquidar:OperacionLiquidar;
  public operacionSQL_Broker:OperacionSQL_Broker;

  public listaMotivo: CargarCombo[];
  public pricing:Pricing;
  public listaMeses:CargarCombo[];
  public listaTipoProducto:CargarCombo[];
  public listaDestino:CargarCombo[];

  public idMes:string;
  public idTipoProducto: string="";
  public idSubyacente: number;
  public idDestino: string;
  public idSQL:number



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
    
   checked: any = [];

 

    hiddenSQLFinal = false;
  
  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    // this.alwaysShowCalendars = true;

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
    
        
    this.usuario=this.portafolioMoliendaIFDService.usuario;
    this.fecha=this.portafolioMoliendaIFDService.fecha;
    this.idSubyacente=Number(this.portafolioMoliendaIFDService.idUnderlying);
    this.getOperacionPricing();
    this.visible=true;
        
      
  }

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  
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
    console.log("modal cerrado pricing");
    this.close.emit(false);  

  }
  

  cerrarModal(e){
    
    console.log("modal cerrado asociar");
    this.myModal=false;
    this.modalReference.close();  
  }

 
  
  liquidarRJO_OperacionesSQL(){

    this.closeModal();
  }

  onSelectMes(id){
    if (typeof id !== 'undefined') {
     this.idMes  =id.value;
    
     }
     
  }

  onSelectTipoProducto(id){
    if (typeof id !== 'undefined') {
     this.idTipoProducto  =id.value;
    
     }
     
  }
  
  onSelectDestino(id){
    if (typeof id !== 'undefined') {
     this.idDestino  =id.value;
    
     }
    }
  public getOperacionPricing():void{

    if (typeof this.portafolioMoliendaIFDService.operacionSQL.s208_Operacion   !== 'undefined') {
        this.idSQL=this.portafolioMoliendaIFDService.operacionSQL.s208_Operacion  
    }
    else{
      this.idSQL=this.portafolioMoliendaIFDService.idSQL        
    }
        
        this.portafolioMoliendaIFDService.getOperacionPricing(this.idSQL ).subscribe(
          (response: Pricing) => {
            this.pricing = response;
            if (this.pricing !== null ){
                this.idTipoProducto=this.pricing.t201_UnderlyingClassification.toString();
                this.idMes=this.pricing.t201_MonthContract.toString();
                this.idDestino= this.pricing.t201_Destination.toString();
            }
            else{
                this.idMes=this.fecha.toString().substring(0,6); //Inicializar mes.
                this.idDestino= "1" // inicializar
            }
            this.getListaTipoProducto();
            this.getListaDestino();
            this.getListaMes();
      
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getListaMes(): void {
    this.portafolioMoliendaIFDService.getListaMes(Number(this.fecha.toString().substring(0,6)) ).subscribe(
      (response: CargarCombo[]) => {
        this.listaMeses = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  } 
  public getListaTipoProducto(): void {
    this.portafolioMoliendaIFDService.getListaTipoProducto(this.idSubyacente ).subscribe(
      (response: CargarCombo[]) => {
        this.listaTipoProducto = response;
        if (this.idTipoProducto===""){
          this.idTipoProducto=this.listaTipoProducto[0].s114_Codigo.toString();
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  } 
  public getListaDestino(): void {
    this.portafolioMoliendaIFDService.getListaDestino().subscribe(
      (response: CargarCombo[]) => {
        this.listaDestino = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  } 
  public guardarOperacionPricing(): void {
    this.pricing=new Pricing

    this.pricing.t201_Operation=this.idSQL
    this.pricing.t201_MonthContract=Number(this.idMes)
    this.pricing.t201_UnderlyingClassification=Number(this.idTipoProducto)
    this.pricing.t201_Date=this.fecha
    this.pricing.t201_RegisteredBy=this.usuario
    this.pricing.t201_Status=1
    this.pricing.t201_Destination=Number(this.idDestino)

    this.portafolioMoliendaIFDService.pricing=this.pricing;
    
    //verificar si viene del preregistro o del modiifcar.
    if (typeof this.portafolioMoliendaIFDService.operacionSQL.s208_Operacion    == 'undefined') {
    //if (this.portafolioMoliendaIFDService.operacionSQL.s208_Operacion    == undefined) {
        this.portafolioMoliendaIFDService.guardarPricing(this.pricing).subscribe(
        data=>{
        },

        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    
    this.closeModal();    



    
  } 


}


