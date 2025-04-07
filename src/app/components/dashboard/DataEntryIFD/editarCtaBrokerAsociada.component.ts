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
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { SubordinateAccount } from 'src/app/models/IFD/subordinateAccount';
import { OperacionSQL_Broker } from 'src/app/models/IFD/operacionSQL_Broker';
import { OperacionLiquidar } from 'src/app/models/IFD/operacionLiquidar';
import { Campaign } from 'src/app/models/IFD/campaign';
import { FormControl } from '@angular/forms';
import { AccountBrokerCampign } from 'src/app/models/IFD/accountBrokerCampign';

@Component({
  selector: 'app-editarCtaBrokerAsociada',
  templateUrl: './editarCtaBrokerAsociada.component.html',
  styleUrls: ['./editarCtaBrokerAsociada.component.scss']

  
})

export class editarCtaBrokerAsociadaComponent implements OnInit {



  public tipo: string;
  public ticker: string;
  public contador: number;
  public orden: number;
  public totalUSDTM: number;
  public totalprecio: number;
  public dialog: MatDialogModule;
  private _refresh$= new Subject<void>();
  public productoselected:number;
  suscription: Subscription;
  public keypressed;
  private wasInside = false;
  public usuario: string;
  public fecha:number;
  public operLiquidada:Boolean;
  public campaign: Campaign;

  date: NgbDateStruct;
  checked: any = [];  
  
  public operacionSQL: OperacionesSQL;
  public operacionLiquidar:OperacionLiquidar;
  public operacionSQL_Broker:OperacionSQL_Broker;
  public listaMotivo: CargarCombo[];
  
  public desSociedadAdministradora: string;
  public desCuentaBrokerAsociada: string;
  public desSociedadAdministrada: string;
  public desCampanha: string;
  public desProducto: string;
  public desContratoMarco: string;
  public desTipoCuenta: string;
  public cuentaBrokerAsociada:AccountBrokerCampign;

  public pFechaInicio: string;
  public pFechaFin: string;
  
  public flgEstado:Boolean;  
  public dateInicio:any;
  public dateFin:any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myModal=false;


  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();


  constructor(private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
  
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
      
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.portafolioMoliendaIFDService.fecha;
      
      this.desSociedadAdministradora=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_SociedadAdministradora;
      this.desCuentaBrokerAsociada=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_CtaBroker;
      this.desSociedadAdministrada=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_SociedadAdministrada;
      this.desCampanha=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_Campanha;
      this.desProducto=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_Producto;
      this.desContratoMarco=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_ContratoMarco;
      this.desTipoCuenta=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_Descripcion;
      this.flgEstado=Boolean(this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_Status)

      
      
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


  cerrarModal(e){
    console.log("modal hijo cerrado asociar");
    this.myModal=false;

  }

  actualizarCuentaBroker(){
  
    this.myModal=true;
    this.campaign = new  Campaign;
    
    
    this.cuentaBrokerAsociada= new AccountBrokerCampign(); 
    var descSeason:string='';
    var descSubyacente:string='';
  
      this.cuentaBrokerAsociada.t378_SubordinateAccount=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_IdCtaBroker;
      this.cuentaBrokerAsociada.t378_SocietyManage=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_IdSociedadAdministrada;
      this.cuentaBrokerAsociada.t378_Campaign=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_IdCampanha;
      this.cuentaBrokerAsociada.t378_Product=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_IdProducto;
      this.cuentaBrokerAsociada.t378_ContractFramework=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_IdContratoMarco;
      this.cuentaBrokerAsociada.t378_Usuario=this.usuario;
      this.cuentaBrokerAsociada.t378_FechaRegistro=this.fecha;
      this.cuentaBrokerAsociada.t378_Status=Number(this.flgEstado);
      this.cuentaBrokerAsociada.t378_ID=this.portafolioMoliendaIFDService.cuentaBrokerAsociada.s252_Id;

      this.portafolioMoliendaIFDService.guardarCuentaBrokerAsociada(this.cuentaBrokerAsociada).subscribe(data=>{
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se actualizó la cuenta del broker asociada.',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
              container: 'my-swal',
        
              }
            });
            this.cerrar();
            
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            });

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

  }
