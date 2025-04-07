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
import { Pricing } from 'src/app/models/IFD/pricing';
import { LoadingService } from '../../loading.service';
import { ObjInitIFDModificar } from 'src/app/models/IFD/objInitIFDModificar';
import { TipoPromedio } from 'src/app/models/IFD/TipoPromedio';

@Component({
  
  selector: 'app-modificarIFD',
  templateUrl: './modificarIFD.component.html',
  styleUrls: ['./modificarIFD.component.scss']

  
})

export class modificarIFDComponent implements OnInit {

  public loading$= this.loader.loading$
  @Input() objForm: ObjInitIFDModificar;
  public objetoInitIFDModificar:ObjInitIFDModificar;
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
  date: NgbDateStruct;
  checked: any = [];  
  
  public operacionSQL: OperacionesSQL;
  public operacionSQL_Broker:OperacionSQL_Broker;
  public listaTipoContrato: TipoContrato[];
  public listaContratos: Contrato[];
  public listaBolsa: Bolsa[];
  public listaMesExpiracion: MesExpiracion[];
  public listaTipoLiquidacion: TipoLiquidacion[];
  public listaSellBuy: SellBuy[];
  public listaBroker: Broker[];
  public listaSociedad: Sociedad[];
  public listaSubordinateAccount: SubordinateAccount[];
  public listaBenchmark: Benchmark[];
  public listaInstrumento:CargarCombo[];
  public listaTipoOperacion: TypeOperation[];
  public contrato:Contrato;  
  public pNuevaFechaVcto:string="";
  public pNuevaFechaAvg:any;

  public idAsianOptionOriginal:string;
  public inicioAsianOption:string;
  

  public idAsianOption:string;
  public idBroker: string;
  public idBrokerOriginal: string;
  public brokerCode:string;
  public idSQL:number;
  public idUnderlying: string;
  public idTipoContrato: string;
  public idSubordinateAccount:string;
  public idContrato: string;
  public idBolsa: string;
  public idTicker: string;
  public idInstrumento: string;
  public idTipoLiquidacion: string;
  public idSellBuy: string;
  public idBrokerReference: string;
  public descdBrokerReference: string;
  public tipoBarerra: string;
  public precioBarrera: number;
  public precioBinary: number;
  public precioDailyBinary: number;
  public precioMostrarExoticoUSD:number;
  public precioMostrarExoticoCentUSD:number;
  public tipoPrecioExotico: string="";
  public idSociedad: string;
  public idBenchmark: string;
  public idTipoOperacion: string;
  public factorUnitMeasure:number;
  public contractInMetricTons:number;
  public descUnitMeasureUSD:string;
  public descUnitMeasureCent:string;
  public pricing:Pricing;
  public esNuevaOperacionT:Boolean;

  public listaTipoPromedio: TipoPromedio[];

  //public objetoInitIFDModificar:ObjInitIFDModificar;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myModal=false;


  modalReference: any;
  closeResult = '';

  @Input () visible: boolean;
  @Output () close: EventEmitter<boolean>= new EventEmitter();


  constructor(private loader:LoadingService,private modalService: NgbModal, private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
     
    
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
      this.productoselected=this.portafolioMoliendaIFDService.producto;
      this.visible=true;
      this.idSQL=this.portafolioMoliendaIFDService.operacionSQL.s208_Operacion;
      this.idUnderlying=this.portafolioMoliendaIFDService.operacionSQL.s208_Underlying.toString();
      this.idInstrumento=this.portafolioMoliendaIFDService.operacionSQL.s208_IdInstrumento.toString();
      this.idTipoOperacion=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTipoOperacion.toString();
      this.idBrokerReference=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBrokerReference.toString();
      this.brokerCode=this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoBroker.toString();
      this.descdBrokerReference=this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoBroker.toString();
      this.idBroker=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBroker.toString();
      this.idBrokerOriginal=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBroker.toString();
      this.idTipoLiquidacion=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTipoLiquidacion.toString();
      this.idSellBuy=this.portafolioMoliendaIFDService.operacionSQL.s208_IdCompraVenta.toString();
      this.idSociedad=this.portafolioMoliendaIFDService.operacionSQL.s208_IdSociedad.toString();
      this.idBenchmark=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBenchmark.toString();
      this.idTipoContrato=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTypeContract.toString();
      this.idBolsa=this.portafolioMoliendaIFDService.operacionSQL.s208_IdExchange.toString();
      this.idContrato=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTicker.toString();
      this.tipoBarerra=this.portafolioMoliendaIFDService.operacionSQL.s208_TipoBarrera.toString() ;
      this.precioBarrera=this.portafolioMoliendaIFDService.operacionSQL.s208_Barrera;
      this.precioBinary=this.portafolioMoliendaIFDService.operacionSQL.s208_Binary;
      this.precioDailyBinary=this.portafolioMoliendaIFDService.operacionSQL.s208_DailyBinary;
      this.idAsianOption=this.portafolioMoliendaIFDService.operacionSQL.s208_AsianOption.toString();
      this.idAsianOptionOriginal=this.idAsianOption;

      

      const year = Number(this.portafolioMoliendaIFDService.operacionSQL.s208_InicioAsianOption.toString().substring(0, 4));
      const month = Number(this.portafolioMoliendaIFDService.operacionSQL.s208_InicioAsianOption.toString().substring(5, 6));
      const day = Number(this.portafolioMoliendaIFDService.operacionSQL.s208_InicioAsianOption.toString().substring(7, 8));
      this.pNuevaFechaAvg={year: year,
                           month: month,
                           day: day};
      this.getOperacionPricing(this.idSQL)

      if (this.precioBarrera!=0){
            this.precioMostrarExoticoUSD=this.precioBarrera;
            this.precioMostrarExoticoCentUSD=this.precioBarrera*100;
            this.tipoPrecioExotico="BI"
        }
      else if (this.precioBinary!=0){
        this.precioMostrarExoticoUSD=this.precioBinary;
        this.precioMostrarExoticoCentUSD=this.precioBinary*100;
        this.tipoPrecioExotico="DA"
      }
      else if (this.precioDailyBinary!=0){
        this.precioMostrarExoticoUSD=this.precioDailyBinary;
        this.precioMostrarExoticoCentUSD=this.precioDailyBinary*100;
        this.tipoPrecioExotico="DB"
      }
      
      if(this.portafolioMoliendaIFDService.operacionSQL.s208_Estado==undefined || this.portafolioMoliendaIFDService.operacionSQL.s208_Estado=="Nuevo"){
          this.esNuevaOperacionT=true;
      }
      else{
          this.esNuevaOperacionT=false;
      }
      this.cargaInicial();


      // this.loader.show();
      // this.usuario=this.portafolioMoliendaIFDService.usuario;
      // this.fecha=this.portafolioMoliendaIFDService.fecha;
      // this.productoselected=this.portafolioMoliendaIFDService.producto;
      // this.visible=true;
      // this.idSQL=this.portafolioMoliendaIFDService.operacionSQL.s208_Operacion;
      // this.idUnderlying=this.portafolioMoliendaIFDService.operacionSQL.s208_Underlying.toString();
      // this.idInstrumento=this.portafolioMoliendaIFDService.operacionSQL.s208_IdInstrumento.toString();
      // this.idTipoOperacion=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTipoOperacion.toString();
      // this.idBrokerReference=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBrokerReference.toString();
      // this.brokerCode=this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoBroker.toString();
      // this.descdBrokerReference=this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoBroker.toString();
      // this.idBroker=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBroker.toString();
      // this.idBrokerOriginal=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBroker.toString();
      // this.idTipoLiquidacion=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTipoLiquidacion.toString();
      // this.idSellBuy=this.portafolioMoliendaIFDService.operacionSQL.s208_IdCompraVenta.toString();
      // this.idSociedad=this.portafolioMoliendaIFDService.operacionSQL.s208_IdSociedad.toString();
      // this.idBenchmark=this.portafolioMoliendaIFDService.operacionSQL.s208_IdBenchmark.toString();
      // this.idTipoContrato=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTypeContract.toString();
      // this.idBolsa=this.portafolioMoliendaIFDService.operacionSQL.s208_IdExchange.toString();
      // this.idContrato=this.portafolioMoliendaIFDService.operacionSQL.s208_IdTicker.toString();
      // this.tipoBarerra=this.portafolioMoliendaIFDService.operacionSQL.s208_TipoBarrera.toString() ;
      // this.precioBarrera=this.portafolioMoliendaIFDService.operacionSQL.s208_Barrera;
      // this.precioBinary=this.portafolioMoliendaIFDService.operacionSQL.s208_Binary;
      // this.precioDailyBinary=this.portafolioMoliendaIFDService.operacionSQL.s208_DailyBinary;
      // this.getOperacionPricing(this.idSQL)

      // if (this.precioBarrera!=0){
      //       this.precioMostrarExoticoUSD=this.precioBarrera;
      //       this.precioMostrarExoticoCentUSD=this.precioBarrera*100;
      //       this.tipoPrecioExotico="BI"
      //   }
      // else if (this.precioBinary!=0){
      //   this.precioMostrarExoticoUSD=this.precioBinary;
      //   this.precioMostrarExoticoCentUSD=this.precioBinary*100;
      //   this.tipoPrecioExotico="DA"
      // }
      // else if (this.precioDailyBinary!=0){
      //   this.precioMostrarExoticoUSD=this.precioDailyBinary;
      //   this.precioMostrarExoticoCentUSD=this.precioDailyBinary*100;
      //   this.tipoPrecioExotico="DB"
      // }
      
      // if(this.portafolioMoliendaIFDService.operacionSQL.s208_Estado==undefined || this.portafolioMoliendaIFDService.operacionSQL.s208_Estado=="Nuevo"){
      //     this.esNuevaOperacionT=true;
      // }
      // else{
      //     this.esNuevaOperacionT=false;
      // }
      
      // this.cargaInicial();
      //this.getSubordinateAccount_SQL(this.idSQL);

      // this.loader.hide();


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


  GuardarOperacionesSQL(){
    this.myModal=true;
    // this.portafolioMoliendaIFDService.guardarOperacion_SQL(this.listaOperacionesRJO_SQLseleccionadas).subscribe(data=>{
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'success',
    //       title: 'Se registro la operación en la base de datos',
    //       showConfirmButton: false,
    //       timer: 1500,
    //       customClass: {
    //       container: 'my-swal',

    //       }
    //     });
    //   },
    //   (error: HttpErrorResponse) => {
    //       alert(error.message);
    //   });
  } 
 
  public getOperacion_SQL(idSQL: number): void {
    this.portafolioMoliendaIFDService.getOperacion_SQL(idSQL).subscribe(
      (response: OperacionesSQL) => {
        this.operacionSQL = response;
        this.idContrato=this.operacionSQL.t005_Contract.toString();
        this.getContractInMetricTons(Number(this.idContrato),Number(this.idBolsa))
        

        this.getTicker_Contrato(Number(this.idContrato));
        this.getTipoContrato();
        this.getBolsa();
        



      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getSubordinateAccount_SQL(idSQL: number)  {
    this.portafolioMoliendaIFDService.getSubordinateAccount_SQL(idSQL).subscribe(
      (response: Descripcion) => {
        this.idSubordinateAccount = (response.temp_descripcion);
        this.getTipoContrato_SQL(this.idSQL);
      
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getContractInMetricTons(idContrato:number, idBolsa:number)  {
    this.portafolioMoliendaIFDService.getContractInMetricTons(idContrato, idBolsa).subscribe(
      (response: string) => {
        this.contractInMetricTons = Number(response);
        this.getfactorUnitMeasure(Number(this.idContrato),Number(this.idBolsa))
        this.getDescUnidadMedida(Number(this.idContrato),Number(this.idBolsa))
        this.getTipoLiquidacion();
        this.getSellBuy();
        this.getBroker();
        this.getInstrumento();
        this.getSociedad();
        this.getBenchmark();
        this.getLista_TipoOperation();
        
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
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


  public getTipoContrato_SQL(idSQL: number)  {
    this.portafolioMoliendaIFDService.getTipoContrato_SQL(idSQL).subscribe(
      (response: Descripcion) => {
        this.idTipoContrato = (response.temp_descripcion);
        this.getBolsa_SQL(this.idSQL);
  
      
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getBolsa_SQL(idSQL: number): void {
    this.portafolioMoliendaIFDService.getBolsa_SQL(idSQL).subscribe(
      (response: Descripcion) => {
        this.idBolsa =(response.temp_descripcion);
        this.getOperacion_SQL(this.idSQL);
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  public getTicker_Contrato(idContrato: number): void {
    this.portafolioMoliendaIFDService.getTicker_Contrato(idContrato).subscribe(
      (response: Descripcion) => {
        this.ticker = response.temp_descripcion;
        this.getContrato(Number(this.idUnderlying), this.fecha, Number(this.idBolsa),Number(this.idTipoContrato) )      
        this.getMesExpiracion(Number(this.idBolsa),Number(this.idTipoContrato),this.ticker)

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getTipoContrato(): void {
    this.portafolioMoliendaIFDService.getTipoContrato().subscribe(
      (response: TipoContrato[]) => {
        this.listaTipoContrato = response;
        
        console.log(this.listaTipoContrato);

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getBolsa(): void {
    this.portafolioMoliendaIFDService.getBolsa().subscribe(
      (response: Bolsa[]) => {
        this.listaBolsa = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getContrato(underlying:number,fecha:number, exchange:number, typeContract:number  ): void {
    //CAMBIAR FECHA
    this.portafolioMoliendaIFDService.getContrato(underlying,fecha, exchange, typeContract).subscribe(
      (response: Contrato[]) => {
        this.listaContratos = response;
    if (this.listaContratos.length>0){
        for (let index = 0; index < this.listaContratos.length; index++) {
            if ( this.listaContratos[index].t004_Nomenclature ===this.ticker) {
                this.idTicker=this.listaContratos[index].t004_ID.toString();
                //obtener id contrato

                break;
              
            }
          }
        if (this.ticker===""){
          this.ticker=this.listaContratos[0].t004_Nomenclature;
          this.idTicker=this.listaContratos[0].t004_ID.toString();
          this.getMesExpiracion(Number(this.idBolsa),Number(this.idTipoContrato),this.ticker)
        }
    }  
      


        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getMesExpiracion(exchange:number, typeContract:number, ticker:string  ): void {
    this.portafolioMoliendaIFDService.getMesExpiracion( exchange, typeContract,ticker).subscribe(
      (response: MesExpiracion[]) => {
        this.listaMesExpiracion = response;
        if (this.idContrato===""){
          this.idContrato=this.listaMesExpiracion[0].t004_ID.toString()}



      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getTipoLiquidacion(): void {
    this.portafolioMoliendaIFDService.getTipoLiquidacion().subscribe(
      (response: TipoLiquidacion[]) => {
        this.listaTipoLiquidacion = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getSellBuy(): void {
    this.portafolioMoliendaIFDService.getSellBuy().subscribe(
      (response: SellBuy[]) => {
        this.listaSellBuy = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getBroker(): void {
    this.portafolioMoliendaIFDService.getBroker().subscribe(
      (response: Broker[]) => {
        this.listaBroker = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getInstrumento(): void {
    this.portafolioMoliendaIFDService.getInstrumento("T007_Instrument").subscribe(
      (response: CargarCombo[]) => {
        this.listaInstrumento = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getSociedad(): void {
    this.portafolioMoliendaIFDService.getSociedad().subscribe(
      (response: Sociedad[]) => {
        this.listaSociedad = response;
        this.getSubordinateAccount(Number(this.idSociedad),Number(this.idBroker));
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getSubordinateAccount(idSociedad:number, idBroker:number): void {
    this.portafolioMoliendaIFDService.getSubordinateAccount(idSociedad,idBroker).subscribe(
      (response: SubordinateAccount[]) => {
        this.listaSubordinateAccount = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getBenchmark(): void {
    this.portafolioMoliendaIFDService.getBenchmark().subscribe(
      (response: Benchmark[]) => {
        this.listaBenchmark = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getLista_TipoOperation(): void {

  this.portafolioMoliendaIFDService.getLista_TipoOperation().subscribe(
    (response: TypeOperation[]) => {
      this.listaTipoOperacion = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}
  obtenerTipoContrato(id:number){
    // this.portafolioMoliendaIFDService.getNuevoContrato(this.companiaSelected.toString(),id.toString()).subscribe(
    //   (response: cargaCombo[]) => {
    //     this.nuevoContrato.t218_ContractBySociety = response[0]['s114_Codigo'];
    //   },
    //   (error: HttpErrorResponse) => {
    //     alert(error.message);
    //   });
  }
  onSelectTipoContrato(id:string){
    if (typeof id !== 'undefined') {
     this.idTipoContrato=id.toString();
     this.ticker=""
     this.idContrato=""
     //CargarComboTicker
     this.getContrato(Number(this.idUnderlying), this.fecha, Number(this.idBolsa), Number(this.idTipoContrato) )
     

   }
 }
 onSelectBolsa(idBolsa:string):void{
//   if (typeof idBolsa !== 'undefined') {
//    this.idBolsa=idBolsa;
//    this.idTicker="0";
//    this.listaMesExpiracion=[];

   
//    //CargarComboTicker
//     this.getContrato(Number(this.idUnderlying),this.fecha,Number(this.idBolsa),Number(this.idTipoContrato))
//     this.getMesExpiracion(Number(this.idBolsa),Number(this.idTipoContrato),this.ticker)
//      if (this.listaMesExpiracion.length>0){
//        this.idContrato=this.listaMesExpiracion[0].t004_ID.toString();
//      }
//  }
   
 }


onSelectTicker(idTicker:string):void{
   
    if (typeof idTicker !== 'undefined') {
      this.idTicker=idTicker;
      this.idContrato="";
      this.listaMesExpiracion=[];
      //CargarComboTicker
      for (let index = 0; index < this.listaContratos.length; index++) {
          if ( this.listaContratos[index].t004_ID.toString() ===this.idTicker) {
              this.ticker =this.listaContratos[index].t004_Nomenclature;
              break;
          }
        }
        this.getMesExpiracion(Number(this.idBolsa),Number(this.idTipoContrato),this.ticker)
        if (this.listaMesExpiracion.length>0){
          this.idContrato=this.listaMesExpiracion[0].t004_ID.toString();
        }
    }
  }
  onSelectBroker(idBroker:string):void{
   
    if (typeof idBroker !== 'undefined') {
      this.idBroker=idBroker;
      if (this.portafolioMoliendaIFDService.operacionSQL.s208_IdBroker.toString()===this.idBroker){
        this.descdBrokerReference=this.portafolioMoliendaIFDService.operacionSQL.s208_CodigoBroker.toString();
        this.operacionSQL.t005_BrokerReference=Number(this.idBrokerReference)
      }
      else{
          this.descdBrokerReference=""
          this.operacionSQL.t005_BrokerReference=0
      }
    }

  }
  onSelectCantidad(){
    
      this.operacionSQL.t005_VolumeUnitMeasure=this.operacionSQL.t005_VolumeContract*this.factorUnitMeasure;
      this.operacionSQL.t005_VolumeTons=this.operacionSQL.t005_VolumeContract*this.contractInMetricTons;
      this.operacionSQL.t005_TotalPremiumUSD=this.operacionSQL.t005_VolumeUnitMeasure*(this.operacionSQL.t005_PremiumUSD+this.operacionSQL.t005_CostUSD)

   
 }
 onSelectPrecioUSD(){
  this.operacionSQL.t005_StrikePriceCent=this.operacionSQL.t005_StrikePriceUSD*100

 }
 onSelectPrecioCent(){
  this.operacionSQL.t005_StrikePriceUSD=this.operacionSQL.t005_StrikePriceCent/100

 }

 onSelectPremiumUSD(){
  this.operacionSQL.t005_PremiumCent=this.operacionSQL.t005_PremiumUSD*100
  this.operacionSQL.t005_TotalPremiumUSD=this.operacionSQL.t005_VolumeUnitMeasure*(this.operacionSQL.t005_PremiumUSD+this.operacionSQL.t005_CostUSD)

 }
 onSelectPremiumCent(){
  this.operacionSQL.t005_PremiumUSD =this.operacionSQL.t005_PremiumCent/100
  this.operacionSQL.t005_TotalPremiumUSD=this.operacionSQL.t005_VolumeUnitMeasure*(this.operacionSQL.t005_PremiumUSD+this.operacionSQL.t005_CostUSD)
 }

 onSelectCostUSD(){
  this.operacionSQL.t005_CostCent=this.operacionSQL.t005_CostUSD*100
  this.operacionSQL.t005_TotalPremiumUSD=this.operacionSQL.t005_VolumeUnitMeasure*(this.operacionSQL.t005_PremiumUSD+this.operacionSQL.t005_CostUSD)
 }

 onSelectCostCent(){
  this.operacionSQL.t005_CostUSD =this.operacionSQL.t005_CostCent/100
  this.operacionSQL.t005_TotalPremiumUSD=this.operacionSQL.t005_VolumeUnitMeasure*(this.operacionSQL.t005_PremiumUSD+this.operacionSQL.t005_CostUSD)
 }
 onSelectBrokerCode(){
  if (this.idBroker!=this.idBrokerOriginal){
      this.operacionSQL.t005_BrokerReference=0
  }
  else if (this.descdBrokerReference.toString()!==this.brokerCode){
      this.operacionSQL.t005_BrokerReference=0
  }
  
 }
 onSelectTipoOperacion(detalleForm:any, id){
  if (typeof id !== 'undefined') {
   this.operacionSQL.t005_TypeOperation =Number(id.value);
   if (Number(id.value)==3){
      //Cargar registro de Pricing
      console.log("modal abierto");
      this.portafolioMoliendaIFDService.idUnderlying=Number(this.idUnderlying)
      const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classRegistroPricing"});
      //this.modalService.open(detalleForm, { centered: true,size: 'lg' });

   }

 }
}

onSelectSellBuy(id){
  if (typeof id !== 'undefined') {
   this.operacionSQL.t005_SellBuy  =Number(id);

 }
}

onSelectInstrumento(id){
  let descripcionInstrumento:string=""
  if (typeof id !== 'undefined') {
    this.operacionSQL.t005_Instrument  =Number(id);
    switch (Number(id)) {
          //Barrera y Binaria
          case 7:
          case 6:
          case 13:
          case 14:
          case 17:
                    descripcionInstrumento=this.listaInstrumento.filter(instrumento => instrumento.s114_Codigo== Number(id))[0]["s114_Descripcion"]
                    this.tipoBarerra=descripcionInstrumento;
                    this.tipoPrecioExotico="BI";
                    break;
                  
          case 8:
          case 9:
                    descripcionInstrumento=this.listaInstrumento.filter(instrumento => instrumento.s114_Codigo== Number(id))[0]["s114_Descripcion"]
                    this.tipoBarerra=descripcionInstrumento;
                    this.tipoPrecioExotico="DA";
                    break;
          case 11:
          case 12:
                    descripcionInstrumento=this.listaInstrumento.filter(instrumento => instrumento.s114_Codigo== Number(id))[0]["s114_Descripcion"]
                    this.tipoBarerra=descripcionInstrumento;
                    this.tipoPrecioExotico="DB"
                    break;
          default:
                    this.tipoBarerra="";
                    this.tipoPrecioExotico=""
                    break;
      }
  }
}

onSelectTipoLiquidacion(id){
  if (typeof id !== 'undefined') {
   this.operacionSQL.t005_TypeSettlement =Number(id);
   
  }
}

onSelectBenchmark(id){
  if (typeof id !== 'undefined') {
   this.operacionSQL.t005_HasBenchmark =Number(id);

 }
}




 ActualizarRegistro(){
  this.operacionSQL_Broker=new OperacionSQL_Broker();
  this.operacionSQL_Broker.operacionesSQL=new OperacionesSQL();
  let fechaAvg:string;
  
  if(this.validarOperacion()){
      this.operacionSQL_Broker.operacionesSQL=this.operacionSQL
      if (this.portafolioMoliendaIFDService.pricing!=undefined){
        this.pricing=this.portafolioMoliendaIFDService.pricing;
      }
      this.operacionSQL_Broker.pricing=this.pricing;
      this.operacionSQL_Broker.codEmpresa=this.portafolioMoliendaIFDService.codigoEmpresa.toString();
      this.operacionSQL_Broker.idbroker=this.idBroker
      this.operacionSQL_Broker.brokercode=this.descdBrokerReference
      this.operacionSQL_Broker.cuentaBroker=this.idSubordinateAccount
      this.operacionSQL_Broker.usuario=this.usuario;
      this.operacionSQL_Broker.precioBarrera=this.precioBarrera;
      this.operacionSQL_Broker.precioBinary=this.precioBinary;
      if (this.pNuevaFechaAvg!==""){
        fechaAvg=this.dateToString(this.pNuevaFechaAvg);
        this.operacionSQL_Broker.pNuevaFechaAvg=Number(fechaAvg);      
      }

      this.operacionSQL_Broker.idAsianOption=Number(this.idAsianOption);
      this.operacionSQL_Broker.precioDailyBinary=this.precioDailyBinary;
      this.operacionSQL_Broker.idTipoContrato=Number(this.idTipoContrato);
      if (this.pNuevaFechaVcto!==""){
        this.pNuevaFechaVcto=this.dateToString(this.pNuevaFechaVcto);
        this.operacionSQL_Broker.operacionesSQL.t005_Contract=0;      
      }
      else{
        this.operacionSQL_Broker.operacionesSQL.t005_Contract=Number(this.idContrato);
      }
      this.operacionSQL_Broker.ticker=this.ticker
      this.operacionSQL_Broker.fechaVcto=this.pNuevaFechaVcto
      this.operacionSQL_Broker.esNuevaOperacionT= this.esNuevaOperacionT;
      if (this.esNuevaOperacionT){
        this.portafolioMoliendaIFDService.actualizarOperacion_SQL(this.operacionSQL_Broker).subscribe(data=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se actualizo la operación',
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
      //this.cerrar();
    }
    else if (!this.esNuevaOperacionT){
      
      this.portafolioMoliendaIFDService.actualizarOperacion_SQL(this.operacionSQL_Broker).subscribe((response: Boolean) => {
      //this.portafolioMoliendaIFDService.actualizarOperacion_SQL(this.operacionSQL_Broker).subscribe(data=>{
      if (response){
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se envió para aprobar la modificación de la operación',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
        container: 'my-swal',

        }
      });
      this.cerrar();
    }
    },
    (error: HttpErrorResponse) => {
        alert(error.message);
    });
  }
  
}
  
}
 aprobacionFechaExpiracion(){
  
  var descripcionTicker:string
  // Se tiene que guardar
  if (this.pNuevaFechaVcto!==""){
    this.pNuevaFechaVcto=this.dateToString(this.pNuevaFechaVcto);
    

    this.portafolioMoliendaIFDService.enviarSolicitudCambioFecha(this.pNuevaFechaVcto,this.idContrato,this.idSQL,this.usuario).subscribe(data=>{
   Swal.fire({
     position: 'center',
     icon: 'success',
     title: 'Se envío la solicitud para la aprobación',
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
  else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe registrar una fecha de expiración',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
      container: 'my-swal',
 
      }
    });   
  }
 
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

onSelectExoticoUSD(){
    this.precioMostrarExoticoCentUSD=this.precioMostrarExoticoUSD*100
    if (this.tipoPrecioExotico=="BI"){
      this.precioBarrera=this.precioMostrarExoticoUSD;
    }
    else if (this.tipoPrecioExotico=="DA"){
      this.precioBinary=this.precioMostrarExoticoUSD;
    }
    else if (this.tipoPrecioExotico=="DB"){
      this.precioDailyBinary=this.precioMostrarExoticoUSD;
    }
}

 onSelectExoticoCent(){
  this.precioMostrarExoticoUSD =this.precioMostrarExoticoCentUSD/100
  if (this.tipoPrecioExotico=="BI"){
    this.precioBarrera=this.precioMostrarExoticoUSD;
  }
  else if (this.tipoPrecioExotico=="DA"){
    this.precioBinary=this.precioMostrarExoticoUSD;
  }
  else if (this.tipoPrecioExotico=="DB"){
    this.precioDailyBinary=this.precioMostrarExoticoUSD;
  } 

}
public getOperacionPricing(id:number):void{

  this.portafolioMoliendaIFDService.getOperacionPricing(id ).subscribe(
      (response: Pricing) => {
        this.pricing = response;
  },
  (error: HttpErrorResponse) => {
    alert(error.message);
  }
)
}
validarOperacion():boolean{
  var caks:number;
  var tickerInicial:string;
  
  if (this.idTipoContrato ==undefined){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar el tipo de contrato.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
      return false
  }
  else{
    if (this.idBolsa ==undefined){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar el mercado bursátil.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',
  
        }
      });
      return false
    }
    else{
      if (this.idTicker ==undefined){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar el contrato.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
    
          }
        });
        return false
      }
      else{
        if (this.idContrato ==undefined && (this.pNuevaFechaVcto=="" || this.pNuevaFechaVcto==undefined )){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Debe seleccionar la fecha de expiración del contrato.',
            confirmButtonColor: '#0162e8',
            customClass: {
            container: 'my-swal',
      
            }
          });
          return false
        }
      else{
        if (this.idSociedad ==undefined ){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Debe seleccionar la sociedad.',
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
  }
  if (this.idSubordinateAccount ==undefined){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar la cuenta del broker.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;
  }
  else{
    if (this.idInstrumento ==undefined){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar el instrumento.',
        confirmButtonColor: '#0162e8',
        customClass: {
        container: 'my-swal',
  
        }
      });
      return false
    }
    else{
      if (this.idTipoLiquidacion==undefined){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar el tipo de liquidación.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',
    
          }
        });
        return false
      }
      else{
        if (this.idSellBuy==undefined){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Debe seleccionar el tipo de operación.',
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



  if (this.idBenchmark==undefined)
  {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar el benchmark.',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal',

          }
        });
        return false;
  }
  if (this.idTipoOperacion ==undefined   )
  {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar el tipo de cobertura.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;
  }
  if (this.idBroker ==undefined   )
  {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe seleccionar el broker.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;
  }
  if (this.descdBrokerReference ==undefined || this.descdBrokerReference =="" )
  {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe escribir el número de referencia.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;
  }
  if (this.operacionSQL.t005_VolumeContract ==undefined || this.operacionSQL.t005_VolumeContract==0   )
  {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe registrar una cantidad de lotes.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;
  }
  if (this.operacionSQL.t005_StrikePriceCent ==undefined || this.operacionSQL.t005_StrikePriceCent ==0  )
  {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Debe registrar un precio.',
      confirmButtonColor: '#0162e8',
      customClass: {
      container: 'my-swal',

      }
    });
    return false;
  }
 
  return true;
}
public cargaInicial(){
  
      this.objetoInitIFDModificar = this.objForm;
      this.idSubordinateAccount = this.objetoInitIFDModificar.subordinateAccount_SQL.temp_descripcion
      this.idTipoContrato = this.objetoInitIFDModificar.tipoContrato_SQL.temp_descripcion
      this.idBolsa =this.objetoInitIFDModificar.bolsa_SQL.temp_descripcion
      this.operacionSQL = this.objetoInitIFDModificar.operacion_SQL;
      this.contractInMetricTons = this.objetoInitIFDModificar.contractInMetricTons;
      this.factorUnitMeasure = this.objetoInitIFDModificar.factorUnitMeasure;
      switch (this.objetoInitIFDModificar.descUnidadMedida.temp_descripcion.substring(0,1)){
        case '¢':
                    this.descUnitMeasureUSD ='$'  +this.objetoInitIFDModificar.descUnidadMedida.temp_descripcion.substring(1,50);
                    this.descUnitMeasureCent = this.objetoInitIFDModificar.descUnidadMedida.temp_descripcion;
                    break
        case '$':
                    this.descUnitMeasureCent ='¢'  +this.objetoInitIFDModificar.descUnidadMedida.temp_descripcion.substring(1,50);
                    this.descUnitMeasureUSD = this.objetoInitIFDModificar.descUnidadMedida.temp_descripcion;
                    break
        
      }

      this.listaTipoLiquidacion = this.objetoInitIFDModificar.comboTipoLiquidacion;
      this.listaSellBuy = this.objetoInitIFDModificar.comboSellBuy;
      this.listaBroker = this.objetoInitIFDModificar.comboBroker;
      this.listaInstrumento = this.objetoInitIFDModificar.comboInstrumento;
      this.listaSociedad = this.objetoInitIFDModificar.comboSociedad;
      this.listaSubordinateAccount = this.objetoInitIFDModificar.comboSubordinateAccount;
      this.listaBenchmark = this.objetoInitIFDModificar.comboBenckmark;
      this.listaTipoOperacion = this.objetoInitIFDModificar.comboTypeOperation;
      this.ticker = this.objetoInitIFDModificar.ticker_Contrato.temp_descripcion;
      this.listaContratos = this.objetoInitIFDModificar.comboContrato;
      if (this.listaContratos.length>0){
        for (let index = 0; index < this.listaContratos.length; index++) {
            if ( this.listaContratos[index].t004_Nomenclature ===this.ticker) {
                this.idTicker=this.listaContratos[index].t004_ID.toString();
                //obtener id contrato

                break;
              
            }
          }
        if (this.ticker===""){
          this.ticker=this.listaContratos[0].t004_Nomenclature;
          this.idTicker=this.listaContratos[0].t004_ID.toString();
        }
      } 

      this.getTipoPromedio();

      this.listaMesExpiracion = this.objetoInitIFDModificar.comboMesExpiracion;
      this.listaTipoContrato = this.objetoInitIFDModificar.comboTipoContrato;
      this.listaBolsa = this.objetoInitIFDModificar.comboBolsa;

      this.loader.hide();  
    }
    onSelectTipoPromedio(id){
      if (typeof id !== 'undefined') {
       this.idAsianOption =id.value;
    
     }
    }
    public getTipoPromedio(): void {
      this.portafolioMoliendaIFDService.getTipoPromedio().subscribe(
        (response: TipoPromedio[]) => {
          this.listaTipoPromedio = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }  
}
