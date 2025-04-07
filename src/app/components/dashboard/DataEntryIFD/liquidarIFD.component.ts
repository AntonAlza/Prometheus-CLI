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
import { LoadingService } from '../../loading.service';
import { PoBo_Paper } from 'src/app/models/IFD/PoBo_Paper';
import { objLiquidarPoBo } from 'src/app/models/IFD/objLiquidarPoBo';

@Component({
  selector: 'app-liquidarIFD',
  templateUrl: './liquidarIFD.component.html',
  styleUrls: ['./liquidarIFD.component.scss']

  
})

export class liquidarIFDComponent implements OnInit {


  public loading$= this.loader.loading$
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
  date: NgbDateStruct;
  checked: any = [];  
  
  public operacionSQL: OperacionesSQL;
  public operacionLiquidar:OperacionLiquidar;
  public operacionSQL_Broker:OperacionSQL_Broker;
  public listaMotivo: CargarCombo[];
  public papelPobo: PoBo_Paper;
  

  public idSQL:number;
  public idContrato: string;
  public idBolsa: string;
  public idUnderlying:number;
  public idInstrumento: number;
  public precioUSD: number;
  public precioCent: number;
  public contratos:number;
  public mtm: number;
  public mtm_sincosto: number;
  public precioFuturo: number;
  public idMotivo: string;
  public comentario:string;
  public factorUnitMeasure:number;
  public contractInMetricTons:number
  public idSellBuy: string;
  public descUnitMeasureUSD:string;
  public descUnitMeasureCent:string;
  public maxCAKS:number;
  public existeFechaLiquidacion:Boolean=false;
  public pFechaLiquidacion: string;
  public disabledLiquidar:Boolean=false; 
  public factor_TMPrice: number;
  public basePoBo: number;
  public flgPoBo: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myModal=false;


  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();


  constructor(private loader:LoadingService,    private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
    this.flgPoBo = this.portafolioMoliendaIFDService.flgPoBo;
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
      
      //this.fecha=20220225;//20220307;//20220225;
      //this.fecha=this.getformattedDate();
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.fecha=this.portafolioMoliendaIFDService.fecha;
      this.productoselected=this.portafolioMoliendaIFDService.producto;
      this.visible=true;
      this.idSQL=this.portafolioMoliendaIFDService.operacionSQL.s208_Operacion;
      this.idUnderlying=Number(this.portafolioMoliendaIFDService.operacionSQL.s208_Underlying);
      this.idContrato=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTicker.toString();
      this.idBolsa=this.portafolioMoliendaIFDService.operacionSQL.s208_IdExchange.toString();
      this.idSellBuy=this.portafolioMoliendaIFDService.operacionSQL.s208_IdCompraVenta.toString();
      this.idInstrumento=Number(this.portafolioMoliendaIFDService.operacionSQL.s208_IdInstrumento);
      this.maxCAKS=this.portafolioMoliendaIFDService.operacionSQL.s208_NumeroContratos
      this.contratos=this.maxCAKS;
      if(this.portafolioMoliendaIFDService.flgPoBo){
        // this.getOperacion_SQL(this.idSQL);
        this.operacionSQL = new OperacionesSQL()
        this.obtenerDatosPoBo(this.idSQL,Number(this.idContrato),Number(this.idBolsa))
        // this.getPoBo_Paper(this.idSQL);
        
      }else{
        this.getOperacion_SQL(this.idSQL);
        this.getfactorUnitMeasure(Number(this.idContrato),Number(this.idBolsa))
      }
      
      this.getLista_SettlementReason();
      this.getContractInMetricTons(Number(this.idContrato),Number(this.idBolsa))
      this.getDescUnidadMedida(Number(this.idContrato),Number(this.idBolsa))
      this.getFechaLiquidacion(this.idSQL);
      this.disabledLiquidar=false;

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


 
  public getOperacion_SQL(idSQL: number): void {
    this.portafolioMoliendaIFDService.getOperacion_SQL(idSQL).subscribe(
      (response: OperacionesSQL) => {
        this.operacionSQL = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // public getPoBo_Paper(idSQL: number): void {
  //   this.portafolioMoliendaIFDService.getPoBo_Paper(idSQL).subscribe(
  //     (response: PoBo_Paper) => {
  //       this.papelPobo = response;
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   );
  // }


  public getLista_SettlementReason(): void {

  this.portafolioMoliendaIFDService.getLista_SettlementReason("T202_SettlementReason").subscribe(
    (response:CargarCombo[]) => {
      this.listaMotivo = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

 onSelectPrecioUSD(){
  this.precioCent=this.precioUSD *100
  var SIGNO:number
  var PRECIO:number=0;
  var PRECIO_SIN_COSTO:number=0;

  if (Number(this.idSellBuy)==1) SIGNO=1
  else SIGNO=-1

  switch (Number(this.idInstrumento)) {
    case 3:   
              PRECIO =this.operacionSQL.t005_StrikePriceUSD + (SIGNO *this.operacionSQL.t005_CostUSD);
              PRECIO_SIN_COSTO=this.operacionSQL.t005_StrikePriceUSD 
              break;
    case 4:   
              PRECIO =this.operacionSQL.t005_StrikePriceUSD + (SIGNO *this.operacionSQL.t005_CostUSD);
              PRECIO_SIN_COSTO=this.operacionSQL.t005_StrikePriceUSD
              break;

    default:  PRECIO =this.operacionSQL.t005_PremiumUSD+ this.operacionSQL.t005_CostUSD
              PRECIO_SIN_COSTO=this.operacionSQL.t005_PremiumUSD
  }
  this.mtm=this.factorUnitMeasure*SIGNO*this.contratos*(this.precioUSD- PRECIO);
  this.mtm_sincosto=this.factorUnitMeasure*SIGNO*this.contratos*(this.precioUSD- PRECIO_SIN_COSTO);

}
 
 
 
 onSelectPrecioCent(){
  this.precioUSD =this.precioCent/100
  var SIGNO:number
  var PRECIO:number=0;
  var PRECIO_SIN_COSTO:number=0;

  if (Number(this.idSellBuy)==1) SIGNO=1
  else SIGNO=-1

  switch (Number(this.idInstrumento)) {
    case 3:   
              PRECIO =this.operacionSQL.t005_StrikePriceUSD + (SIGNO *this.operacionSQL.t005_CostUSD);
              PRECIO_SIN_COSTO=this.operacionSQL.t005_StrikePriceUSD 
              break;
    case 4:   
              PRECIO =this.operacionSQL.t005_StrikePriceUSD + (SIGNO *this.operacionSQL.t005_CostUSD);
              PRECIO_SIN_COSTO=this.operacionSQL.t005_StrikePriceUSD
              break;

    default:  PRECIO =this.operacionSQL.t005_PremiumUSD+ this.operacionSQL.t005_CostUSD
              PRECIO_SIN_COSTO=this.operacionSQL.t005_PremiumUSD
  }
  if(!this.portafolioMoliendaIFDService.flgPoBo){
    this.mtm=this.factorUnitMeasure*SIGNO*this.contratos*(this.precioUSD- PRECIO);
    this.mtm_sincosto=this.factorUnitMeasure*SIGNO*this.contratos*(this.precioUSD- PRECIO_SIN_COSTO);
  }else{
    // this.mtm=((this.precioCent - this.basePoBo) * SIGNO *this.factor_TMPrice * this.papelPobo.t522_VolumeTons) || 0;
    this.mtm = ((this.precioUSD - this.papelPobo.t522_StrikePriceUSD) * SIGNO * this.factor_TMPrice * this.papelPobo.t522_VolumeTons ) || 0 ;
  }
  

}
 
 
 onSelectCantidad(){
    
  var SIGNO:number
  var PRECIO:number=0;
  var PRECIO_SIN_COSTO:number=0;

  if (Number(this.idSellBuy)==1) SIGNO=1
  else SIGNO=-1

  switch (Number(this.idInstrumento)) {
    case 3:   
              PRECIO =this.operacionSQL.t005_StrikePriceUSD + (SIGNO *this.operacionSQL.t005_CostUSD);
              PRECIO_SIN_COSTO=this.operacionSQL.t005_StrikePriceUSD 
              break;
    case 4:   
              PRECIO =this.operacionSQL.t005_StrikePriceUSD + (SIGNO *this.operacionSQL.t005_CostUSD);
              PRECIO_SIN_COSTO=this.operacionSQL.t005_StrikePriceUSD
              break;

    default:  PRECIO =this.operacionSQL.t005_PremiumUSD+ this.operacionSQL.t005_CostUSD
              PRECIO_SIN_COSTO=this.operacionSQL.t005_PremiumUSD
  }
  this.mtm=this.factorUnitMeasure*SIGNO*this.contratos*(this.precioUSD- PRECIO);
  this.mtm_sincosto=this.factorUnitMeasure*SIGNO*this.contratos*(this.precioUSD- PRECIO_SIN_COSTO);

}
validarCampos():Boolean{
  
  if (!(this.idInstrumento>=3 && this.idInstrumento<=4)){  
      if (typeof this.precioFuturo == 'undefined' && !this.flgPoBo) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe ingresar el precio del futuro.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
  
          }
        });
          return false
      }
      if (typeof this.precioCent == 'undefined' || typeof this.precioUSD == 'undefined'  ) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe ingresar la prima.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
    
          }
        });
          return false
      }
  }
  else
  {
      if (typeof this.precioCent == 'undefined' || typeof this.precioUSD == 'undefined'  ) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe ingresar el precio del futuro.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',
  
        }
      });
        return false
    } 
  }
  if (typeof this.contratos == 'undefined') {
    Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Debe ingresar el número de contrato.',
    confirmButtonColor: '#0162e8',
    customClass: {
    container: 'my-swal',
  
    }
  });
    return false
  }
  
  
  if (typeof this.precioUSD == 'undefined') {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe ingresar el precio USD.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',
  
      }
    });
      return false
  }
  
  if (typeof this.factorUnitMeasure == 'undefined' && !this.flgPoBo) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'No se tiene factor de medida registrado.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',
  
      }
    });
      return false
  }
  
  if (typeof this.idMotivo == 'undefined') {
     Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar el motivo de la liquidación.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',
  
      }
    });
      return false
  }
  
  if (typeof this.idInstrumento == 'undefined') {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar el tipo de instrumento.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',
  
      }
    });
      return false
  }
  if (typeof this.comentario == 'undefined') {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe ingresar un comentario.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',
  
      }
    });
      return false
  }
  return true;
  }


  liquidarOperacion(){
  
  if (this.validarCampos()){

    if(this.flgPoBo){

      this.papelPobo

      let liquidarPobo = new objLiquidarPoBo();
      liquidarPobo.temp_idSQL=this.idSQL;
      liquidarPobo.poBoPaper = this.papelPobo;
      if (this.pFechaLiquidacion!=undefined){
        liquidarPobo.temp_fecha=Number(this.pFechaLiquidacion);
      }
      else{
        liquidarPobo.temp_fecha=this.fecha
      }
      
      liquidarPobo.temp_caksLiquidar=this.contratos
      liquidarPobo.temp_precioFuturo=this.precioFuturo
      liquidarPobo.temp_precioOpcion=this.precioUSD
      // liquidarPobo.temp_totalPrima=this.contratos*this.factorUnitMeasure*this.operacionSQL.t005_PremiumUSD;
      liquidarPobo.temp_SettlementReasoon=Number(this.idMotivo)
      // liquidarPobo.temp_IdInstrument=Number(this.idInstrumento)
      liquidarPobo.temp_Usuario=this.usuario
      liquidarPobo.temp_CodSettlement=this.comentario
      // liquidarPobo.temp_Contract=Number(this.idContrato)
      liquidarPobo.temp_M2M=this.mtm;
      // liquidarPobo.temp_M2MSinCosto=this.mtm_sincosto;

      this.disabledLiquidar=true;  

      this.loader.show();
      this.portafolioMoliendaIFDService.liquidarPapelPoBo(liquidarPobo).subscribe(data=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se liquido la operación en la base de datos',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
          container: 'my-swal',

          }
        });
        this.cerrar();
        this.disabledLiquidar=false;   
        this.loader.hide();

        },
        (error: HttpErrorResponse) => {
            alert(error.message);
        });




    }else{
      this.operacionLiquidar= new OperacionLiquidar();
      this.operacionLiquidar.temp_idSQL=this.idSQL;
      
      if (this.pFechaLiquidacion!=undefined){
        this.operacionLiquidar.temp_fecha=Number(this.pFechaLiquidacion);
      }
      else{
      this.operacionLiquidar.temp_fecha=this.fecha
      }
      
      this.operacionLiquidar.temp_caksLiquidar=this.contratos
      this.operacionLiquidar.temp_precioFuturo=this.precioFuturo
      this.operacionLiquidar.temp_precioOpcion=this.precioUSD
      this.operacionLiquidar.temp_totalPrima=this.contratos*this.factorUnitMeasure*this.operacionSQL.t005_PremiumUSD;
      this.operacionLiquidar.temp_SettlementReasoon=Number(this.idMotivo)
      this.operacionLiquidar.temp_IdInstrument=Number(this.idInstrumento)
      this.operacionLiquidar.temp_Usuario=this.usuario
      this.operacionLiquidar.temp_CodSettlement=this.comentario
      this.operacionLiquidar.temp_Contract=Number(this.idContrato)
      this.operacionLiquidar.temp_M2M=this.mtm;
      this.operacionLiquidar.temp_M2MSinCosto=this.mtm_sincosto;

      this.disabledLiquidar=true;   
      this.loader.show();
      this.portafolioMoliendaIFDService.getLiquidarOperacionSQL(this.operacionLiquidar).subscribe(data=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se liquido la operación en la base de datos',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
          container: 'my-swal',

          }
        });
        this.cerrar();
        this.disabledLiquidar=false;   
        this.loader.hide();

        },
        (error: HttpErrorResponse) => {
            alert(error.message);
        });
    }
  
  }
}

 public getContractInMetricTons(idContrato:number, idBolsa:number)  {
  this.portafolioMoliendaIFDService.getContractInMetricTons(idContrato, idBolsa).subscribe(
    (response: string) => {
      this.contractInMetricTons = Number(response);
      
      
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
  return true;
}

public getfactorUnitMeasure(idContrato:number, idBolsa:number)  {
  this.portafolioMoliendaIFDService.getfactorUnitMeasure(idContrato, idBolsa).subscribe(
    (response: string) => {
      this.factorUnitMeasure = Number(response);
      
      
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public obtenerDatosPoBo(idPoBo: number,idContrato:number, idBolsa:number)  {
  this.portafolioMoliendaIFDService.obtenerObjLiquidarPoBo(idPoBo,idContrato, idBolsa).subscribe(
    (response: objLiquidarPoBo) => {

      this.papelPobo = response.poBoPaper;    
      this.factor_TMPrice = Number(response.factorTM_Price);      
      // this.basePoBo = Number(response.base);      
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}



public getDescUnidadMedida(idContrato:number, idBolsa:number)  {
  this.portafolioMoliendaIFDService.getDescUnidadMedida(idContrato, idBolsa).subscribe(
    (response: Descripcion) => {
      switch (response.temp_descripcion.substring(0,1)){
        case '¢':
                    this.descUnitMeasureUSD ='$'  +response.temp_descripcion.substring(1,50);
                    this.descUnitMeasureCent = response.temp_descripcion;
                    break
        case '$':
                    this.descUnitMeasureCent ='¢'  +response.temp_descripcion.substring(1,50);
                    this.descUnitMeasureUSD = response.temp_descripcion;
                    break
        
    }
      
      
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public getFechaLiquidacion(idSQL:number)  {
  this.portafolioMoliendaIFDService.getFechaLiquidacion(idSQL).subscribe(
    (response: string) => {
      this.pFechaLiquidacion =response;
      if (this.pFechaLiquidacion!=undefined){
          this.existeFechaLiquidacion=true;
      }
      
      
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

}
