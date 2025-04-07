import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { PortafolioIFDMolienda } from 'src/app/models/IFD/portafolioIFDMolienda';
import { Companias } from 'src/app/models/IFD/companias';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Item } from 'angular2-multiselect-dropdown';
import { ClosingControl } from 'src/app/models/Fisico/closingControl';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import Swal from 'sweetalert2';
import { SalesContract } from 'src/app/models/Fisico/SalesContract';
import { Physical } from 'src/app/models/Fisico/Physical';
import { Society } from 'src/app/models/Fisico/Society';
import { Usuario } from 'src/app/models/IFD/Usuario';
import { MatTableDataSource } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { listaoperacionesbrokers } from 'src/app/models/IFD/listaoperacionesbrokers';
import { getDate } from 'date-fns';
import * as XLSX from 'xlsx';
import { CargaMasivaIFD } from 'src/app/models/IFD/cargaMasivaIFD';
import { FormControl, Validators } from '@angular/forms';
import { Descripcion } from 'src/app/models/IFD/descripcion';
import { TransitionCheckState } from '@angular/material/checkbox';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Observable} from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';
import { CargarCombo } from 'src/app/models/IFD/cargarCombo';
import { SpinnerService } from '../../spinner.service';
import { NgxSpinnerModule} from 'ngx-spinner'
import * as moment from 'moment';
import { LoadingService } from '../../loading.service';
import { CantOperBroker } from 'src/app/models/IFD/cantOperBroker';
import { OperacionesSQL } from 'src/app/models/IFD/operacionSQL';
import { ListaOperacionesxVencer } from 'src/app/models/IFD/listaOperacionesxVencer';
import {operacionesxVencerComponent } from 'src/app/components/dashboard/DataEntryIFD/operacionesxVencer.component';
import {registroEstrategiaComponent } from 'src/app/components/dashboard/DataEntryIFD/registroEstrategia.component';
import {registroEstrategiaCMComponent } from 'src/app/components/dashboard/DataEntryIFD/registroEstrategiaCM.component';

import { ModalConfig } from 'src/app/components/dashboard/DataEntryIFD/modal-config';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Pricing } from 'src/app/models/IFD/pricing';
import { Underlying } from 'src/app/models/IFD/underlying';
import { ObjInitIFDModificar } from 'src/app/models/IFD/objInitIFDModificar';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LimiteService } from 'src/app/models/Limites/LimiteService.service';

type AOA = any[][];


@Component({
  selector: 'app-DataEntryIFD',
  templateUrl: './DataEntryIFD.component.html',
  styleUrls: ['./DataEntryIFD.component.scss']
})

export class IFDMoliendaComponent implements OnInit {

  data2: Observable<any>;
  public loading$= this.loader.loading$
  date1 = new FormControl(moment());
  modalOptions: NgbModalOptions = ModalConfig;

  loading: boolean = false;
  isLoading = true;
  typeSelected: string;

  public portafolio: PortafolioIFDMolienda[] = [];
  public selectedcompania: Companias[] = [];
  public selectedProducto: Underlying[] = [];
  public selectedProductoModal: Underlying[] = [];
  public compania: Companias  [] = [];
  public productos: Underlying  [] = [];
  public estadoPortafolio: ClosingControl  [] = [];
  public companiaSelected: number  = 0;
  public productoSelected: number  = 0;
  public productoSelectedModal: number  = 0;
  public companiasBarcos: Society[] = [];

  public bolsaSelectedModal: string  = "";
  public nuevoFlat: string  = "";
  public nuevoFuturo: string  = "";
  public nuevaBase: string  = "";
  public operacionFuturo: string  = "";
  public pFechaReporte:string="";
  public ultimoItemSeleccionado: number=0;
  public caksInt: number=0;
  public postCierre: boolean=false;
  public tituloTabla: string="Portafolio Compañia";

 public productosMolienda: Underlying[]=[];
 public campania: cargaCombo[]=[];
 public producto: cargaCombo[]=[];
 checked: any = [];  
 public rolesUsuario:CargarCombo[];
 public tipoPrecio: cargaCombo[]=[];
 public obtenerEstado:any;
 public tipoArchivo:number;

 public operacionBroker:listaoperacionesbrokers;
 public listaOperacionesBroker: listaoperacionesbrokers[] = [];
 public listaOperacionesxVencer: ListaOperacionesxVencer[] = [];
 public indice:number;
 public cargaMasivaIFD:CargaMasivaIFD;
 public listacargaMasivaIFD: CargaMasivaIFD[] = [];

 public  encendido:Boolean=false;
 public currentDate: any;
 public targetDate: any;
 public cDateMillisecs: any;
 public tDateMillisecs: any;
 public arrayBuffer:any;
 public  data: AOA = [[1, 2], [3, 4]];
 wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
 fileName: string = 'SheetJS.xlsx';
 public usuario: string;
 csvRecords: any[] = [];
 public records: any[] = [];  
public idTipoContrato:number;
public idBolsa:number;
public estadoCierre:boolean=false;
public estadoDividir:boolean=false;
public estadoValorizar:boolean=false;
public estadoRegistro:boolean=false;
public estadoValorizarT_N:boolean=false;
public estadoValorizarT:boolean=false;

public estadoRegistroFO:boolean=false;
public estadoMOValorizar:boolean=false;
public estadoMOAprobacion:boolean=false;
public estadoAdministrador:boolean=false;
public estadoEjecucionLimiteDiario:boolean=false;

public listaIFDMasivoValidado:number=0;
public pricing:Pricing;

public objetoInitPadre:ObjInitIFDModificar;

 @ViewChild('csvReader') csvReader: any; 
 @ViewChild('fileImportInput') fileImportInput: any;

 display: FormControl = new FormControl("", Validators.required);
 file_store: FileList;
 file_list: Array<string> = [];

 public operacionSQL:  PortafolioIFDMolienda;

 public fecha: number;
 date: NgbDateStruct;
public valorDefectoProducto:number=3;
  

  myModal=false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  

  displayedColumns: string[] = [ 
    's208_Estado'
    ,'s208_Operacion'
    ,'s208_FechaPacto'
    ,'s208_Ficha'
    ,'s208_CodigoBroker'
    ,'s208_Sociedad'
    ,'s208_Portfolio'
    ,'s208_DescUnderlying'
    ,'s208_Ticker'
    ,'s208_FechaExpiracion'
    ,'s208_Broker'
    ,'s208_CuentaBroker'
    ,'s208_Cobertura'
    ,'s208_MesEstrategia'
    ,'s208_NumeroContratos'
    ,'s208_PrecioEjercicio'
    ,'s208_CompraVenta'
    ,'s208_Instrumento'
    ,'s208_Estrategia'
    ,'s208_Prima'
    ,'s208_TipoInstrumento'
    ,'s208_DescBenchmark'
    ,'s208_TipoLiquidacion'
    ,'s208_Bushels'
    ,'s208_MesContrato'
    ,'s208_Costo'
    ,'s208_CodigoEstrategia'
    //,'s208_TipoCobertura'
    ,'s208_M2M'
//    ,'s208_Barrera'
//    ,'s208_TipoBarrera'
    ,'s208_TipoOperacion'
    // ,'s208_Base'
    // ,'s208_AcumulacionEstrategia'
    // ,'s208_AcumulacionOperacion'
    
    ,'s208_Trimestre'
    ,'s208_ByAgrupDelta'
    ,'s208_ByApertura'
    ,'s208_HedgeType'
    ,'s208_VolumeNetTM'
    ,'s208_VolumeMaxTM'    
    ,'s208_Limit'
    
];

displayedColumnsFechaExpiracion: string[] = [];

customOptions!: OwlOptions
owlCarouselData = [
  { id: 1, src: '../../assets/images/crypto-currencies/round-outline/AquariusCoin.svg', name:'USD', value1: '$0.025' , value2: '-0.78%',arrow:'down-c' },
  { id: 2, src: '../../assets/images/crypto-currencies/round-outline/Augur.svg', name:'USD', value1: '$45.25', value2: '12.85%',arrow:'up-c' },
  { id: 3, src: '../../assets/images/crypto-currencies/round-outline/Bitcoin.svg', name:'USD', value1: '$15.45' , value2: '-0.78%',arrow:'up-c' },
  { id: 4, src: '../../assets/images/crypto-currencies/round-outline/BitConnect.svg', name:'USD', value1: '$5.15', value2: '-11.85%',arrow:'down-c' },
  { id: 5, src: '../../assets/images/crypto-currencies/round-outline/BitShares.svg', name:'USD', value1:'$135.25', value2: '-0.78%',arrow:'ip-c' },
  { id: 6, src: '../../assets/images/crypto-currencies/round-outline/Bytecoin.svg', name:'USD', value1: '$34.65', value2:'-0.32%' ,arrow:'down-c'},
  { id: 7, src: '../../assets/images/crypto-currencies/round-outline/Dash.svg', name:'USD' , value1: '$67.35', value2: '-0.78%',arrow:'up-c' },
  { id: 8, src: '../../assets/images/crypto-currencies/round-outline/EOS.svg', name:'USD', value1: '$7.55', value2: '-1.42%' ,arrow:'down-c'},
  { id: 9, src: '../../assets/images/crypto-currencies/round-outline/Ethereum.svg', name:'USD', value1: '$4.25', value2: '-0.78%' ,arrow:'up-c'},
  { id: 10, src: '../../assets/images/crypto-currencies/round-outline/Golem.svg', name:'USD', value1: '$6.05', value2: '-0.78%',arrow:'down-c' },
  { id: 11, src: '../../assets/images/crypto-currencies/round-outline/Iconomi.svg', name:'USD', value1: '$34.65', value2:'-0.32%',arrow:'up-c' },
  { id: 12, src: '../../assets/images/crypto-currencies/round-outline/IOTA.svg', name:'USD', value1: '$67.325', value2: '-0.78%',arrow:'down-c' },
  { id: 13, src: '../../assets/images/crypto-currencies/round-outline/LanaCoin.svg', name:'USD', value1: '$7.25', value2: '-1.42%' ,arrow:'up-c'},
  { id: 14, src: '../../assets/images/crypto-currencies/round-outline/Ethereum.svg', name:'USD', value1: '$4.35', value2: '-0.78%' ,arrow:'down-c'},
  { id: 15, src: '../../assets/images/crypto-currencies/round-outline/Litecoin.svg', name:'USD', value1: '$5.55', value2: '-1.32%',arrow:'up-c' },
  { id: 16, src: '../../assets/images/crypto-currencies/round-outline/Monero.svg', name:'USD', value1: '$6.25', value2: '-0.78%',arrow:'down-c' },
  { id: 17, src: '../../assets/images/crypto-currencies/round-outline/NEM.svg', name:'USD', value1: '$6.05', value2: '-0.78%' },

]







  dataSource: MatTableDataSource<PortafolioIFDMolienda>;
  hidden = false;
  public cantOperBroker: CantOperBroker;
  public pOperaciones: number=0;
  public pOperacionesSinCuenta: number=0;
  public idBroker:string;


  dataSourceFechaExpiracion: MatTableDataSource<ListaOperacionesxVencer>;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(private loader:LoadingService,private spinnerService: SpinnerService, private http: HttpClient,tokenService: TokenService,private portafolioMoliendaIFDService: PortafolioIFDMoliendaService, private modalService: NgbModal, private limiteService: LimiteService) {  

    this.typeSelected = 'ball-fussion';
  
        
  
  }
  
  getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));
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


    ngOnInit(){

      this.customOptions = {
        loop: true,
        autoplay: true,
        slideTransition: 'linear',
        autoplaySpeed: 4900,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        center: true,
        margin: 12,
        dots: false,
        rewind: false,
        lazyLoad: false,
        nav:false,
        responsive: {
          0 : {
            items : 1
          },
          300: {
            items: 1.5
          },
          
          400: {
            items: 2
          },
          640 : {
            items: 3
          },
          768 : {
            items : 3
          },
    
          900 : {
            items: 5
          },
          1200: {
            items: 6
          },
          1600: {
            items: 7
          }
        }
    }

      const a = new Date();
      this.date1 = new FormControl(a);
      this.pFechaReporte=this.dateToString( { day: a.getDate(), month: a.getMonth()+1 , year: a.getFullYear()});
      if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_RegistroLimites") > -1){
        this.estadoEjecucionLimiteDiario = true;
      }
      if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1){
        this.estadoAdministrador=true;
      }else if(  this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_IFD") > -1){
        this.estadoMOValorizar=true;
      }else if(this.portafolioMoliendaIFDService.perfiles.indexOf("MO_IFD_Aprobacion") > -1){
        this.estadoMOAprobacion=true;
      }else if (this.portafolioMoliendaIFDService.perfiles.indexOf("FO_IFD_RegistroOperacion") > -1 ){
          this.estadoRegistroFO = true;
      }
      //Registro Operaciones
      if (this.estadoRegistroFO || this.estadoAdministrador){
          this.estadoRegistro=true;
      }
      else{this.estadoRegistro=false;
      }
      //Valorizar Portafolio T
      if (this.estadoMOValorizar || this.estadoMOAprobacion || this.estadoAdministrador){
        this.estadoValorizarT=true;
      }
      else{this.estadoValorizarT=false;
      }
      // Valorizar T-N y ATM
      if (this.estadoMOAprobacion || this.estadoAdministrador){
        this.estadoValorizarT_N=true;
      }
      else{this.estadoValorizarT_N=false;
      }

      this.estadoDividir=false;
      //this.listacargaMasivaIFD=[]
      
      
      this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected, Number(this.pFechaReporte));
      this.getCompanias();
      this.fecha=20250328//20240223//20230106//20230113//20230110//20221206//20221214//20221014//20221018//20221122//20221125//20221110//20221122//20221109//20221025//20221108//20221004//20220923//20220824//20220608//20220829;//20220411;//20220307;//20220225;
      // this.fecha=this.getformattedDate();
      this.portafolioMoliendaIFDService.operacionSQL=new PortafolioIFDMolienda()
      this.usuario=this.portafolioMoliendaIFDService.usuario;
      this.portafolioMoliendaIFDService.fecha=this.fecha;
      this.getCantRegistroBroker(this.companiaSelected,this.productoSelected, this.fecha);
      this.getCantRegistroBrokerSinCuenta(this.companiaSelected,this.productoSelected, this.fecha);
      //1000: Caso de todos los brokers
      this.getListaBrokerOperaciones(this.companiaSelected,this.productoSelected, this.fecha,1000);
      this.obtenerEstado = setInterval(()=> { 
      this.getListaBrokerOperaciones(this.companiaSelected,this.productoSelected, this.fecha,1000),
      console.log("Ejecutado") }, 8 * 1000); //8 min: 8x60 =480 -- se mide en segundo
      this.paginator._intl.itemsPerPageLabel="Registros por Página";
      //this.getRolUsuario()
      
      this.portafolioMoliendaIFDService.refreshPrincipal$.subscribe(() => {
          this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected, Number(this.pFechaReporte));
      });

      //ventana con operaciones por vencer
      // if (!this.portafolioMoliendaIFDService.estadoFechaExpiracion){
      //   this.getListaOperacionesxVencer(this.fecha)
      //   this.portafolioMoliendaIFDService.estadoFechaExpiracion=true;
      // }

      // this.getListaOperacionesxVencer(this.fecha);


    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  ngOnDestroy() {
    clearInterval(this.obtenerEstado);
  }


  
   ngAfterViewInit() {
  


    //this.myTimer();
   }

  myTimer() {
    this.currentDate = new Date();
    this.cDateMillisecs = this.currentDate.getTime();
    if (this.cDateMillisecs%3==0) this.encendido=true;
    else this.encendido=false;
    //document.getElementById('encendido').innerText = this.encendido;
    setInterval(this.myTimer, 3000);
    console.log('encendido: '+this.encendido);

  }
  


  public getPortafolioIFDMolienda(producto:number,empresa:number, fecha:number): void {
    this.loader.show();
    this.portafolioMoliendaIFDService.getPortaIFDfolioMolienda(producto,empresa,fecha).subscribe(
      (response: PortafolioIFDMolienda[]) => {
        this.portafolio = response;
        this.dataSource = new MatTableDataSource(this.portafolio);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.loader.hide();
  }

  public getCantRegistroBroker(empresa:number, subyacente:number, fecha:number): void {
    this.portafolioMoliendaIFDService.getCantRegistroBroker(empresa, subyacente, fecha).subscribe(
      
      (response: CantOperBroker) => {
        this.cantOperBroker=response
        this.pOperaciones = this.cantOperBroker.temp_cantidad;
        this.idBroker=this.cantOperBroker.temp_ID.toString();
        this.portafolioMoliendaIFDService.broker=this.idBroker;
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getCantRegistroBrokerSinCuenta(empresa:number, subyacente:number, fecha:number): void {
    this.portafolioMoliendaIFDService.getCantRegistroBrokerSinCuenta(empresa, subyacente, fecha).subscribe(
      
      (response: CantOperBroker) => {
        this.cantOperBroker=response
        this.pOperacionesSinCuenta = this.cantOperBroker.temp_cantidad;
        this.idBroker=this.cantOperBroker.temp_ID.toString();
        this.portafolioMoliendaIFDService.brokerSinCuenta=this.idBroker;
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaBrokerOperaciones(empresa: number, subyacente:number, fecha:number,broker:number): void {

      

    this.portafolioMoliendaIFDService.getListaBrokerOperaciones(empresa,subyacente, fecha,broker).subscribe(
    (response: listaoperacionesbrokers[]) => {
      this.listaOperacionesBroker = response;
 
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
  this.getCantRegistroBrokerSinCuenta(this.companiaSelected,this.productoSelected, this.fecha);
  this.getCantRegistroBroker(this.companiaSelected,this.productoSelected, this.fecha);
  this.getEstado(this.companiaSelected,this.productoSelected)

}


  public getPortafolioIFDCierre(sociedad:number): void {
    this.portafolioMoliendaIFDService.getPortafolioMoliendaCierre(sociedad).subscribe(
      (response: PortafolioIFDMolienda[]) => {
        this.portafolio = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getProductos(sociedad:number): void {
    this.portafolioMoliendaIFDService.getproductos(sociedad).subscribe(
      (response: Underlying[]) => {
        this.productos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getCompanias(): void {
    this.portafolioMoliendaIFDService.getCompanias().subscribe(
      (response: Companias[]) => {
        this.compania = response;
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getEstado(sociedad:number,producto:number): void{
    this.portafolioMoliendaIFDService.getEstado(this.companiaSelected,this.productoSelected,this.fecha).subscribe(
      (response: ClosingControl[]) => {
        this.estadoPortafolio = response;
        if (this.estadoPortafolio.length>0){
          if (this.estadoMOAprobacion || this.estadoAdministrador){
            this.estadoCierre=false;
          }
          else{
            this.estadoCierre=true;
          }

          this.portafolioMoliendaIFDService.estadoCierre=this.estadoCierre;
          
        }else{
          this.portafolioMoliendaIFDService.estadoCierre=this.estadoCierre;
          this.estadoCierre=false
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
 onSelectCompania(idEmpresa:number):void{
    if (typeof idEmpresa !== 'undefined') {
        this.selectedProducto = [];
        this.selectedProductoModal=[];
        this.companiaSelected = idEmpresa;
        this.productoSelectedModal=0;
        this.productoSelected=0;
        

      if(!this.postCierre){
        this.getPortafolioIFDMolienda(this.productoSelected,idEmpresa, this.fecha);
        this.getProductos(idEmpresa);
        this.getEstado(idEmpresa,this.productoSelected);
       }else{
        this.getPortafolioIFDCierre(this.companiaSelected)
      }
      
    }else{
      this.productos = []
      this.companiaSelected=0
    }
    this.getCantRegistroBroker(this.companiaSelected,this.productoSelected, this.fecha);
    this.getCantRegistroBrokerSinCuenta(this.companiaSelected,this.productoSelected, this.fecha);
    
    this.tituloTabla='Portafolio ' + this.compania.filter(compania => compania.t060_ID== this.companiaSelected)[0]["t060_Description"]
  }

   onSelectSubyacente(idSubyacente:number):void{
     if (typeof idSubyacente !== 'undefined') {
      this.productoSelectedModal=idSubyacente;
      this.productoSelected=idSubyacente;
      this.getPortafolioIFDMolienda(idSubyacente,this.companiaSelected,this.fecha);
      this.getEstado(this.companiaSelected,idSubyacente);
      this.selectedProductoModal=this.selectedProducto;
      this.getCantRegistroBroker(this.companiaSelected,idSubyacente, this.fecha);
      this.getCantRegistroBrokerSinCuenta(this.companiaSelected,idSubyacente, this.fecha);
    }else{
      this.productoSelectedModal=0;
      this.productoSelected=0;
      this.selectedProductoModal=[]
    }
  }

  
  cerrarModal(e){
    console.log("modal padre cerrado");
    this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected,this.fecha);
    this.getEstado(this.companiaSelected,this.productoSelected)
    this.myModal=false;
    
  }


  modalIngresoOperacion(detalleForm:any){

    //RESETEO DE EL MODELO
    console.log("modal abierto");
    this.myModal=true;
    
    
    if(this.pOperaciones ==0){
      Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'No se tiene operaciones del Broker',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
  }else{

        //prpio de modal
        if(this.companiaSelected==0){
          Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar una empresa',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }else if(this.productoSelectedModal==0){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar un subyacente',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }
      else{
          this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
          this.portafolioMoliendaIFDService.tipo="OperacionesBroker";
          this.portafolioMoliendaIFDService.producto=this.productoSelected;
          this.portafolioMoliendaIFDService.fecha=this.fecha;
          const modalRef =this.modalService.open(detalleForm,{windowClass : "my-class"});
          //const modalRef =this.modalService.open(detalleForm,this.modalOptions);
          
        // clearInterval()
      }
    }
  }
  
  
  
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  onContextMenu(event: MouseEvent, item: Item) {

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuAction() {
    alert(`Click on Action for ${this.contextMenu.menuData.item}`);
  }

  fileChangeListener($event: any): void {

    
    const  l: FileList=$event.srcElement.files;  
    this.file_store = $event.srcElement.files;  
    if (l.length) {
    const f = l[0];
    const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
    this.display.patchValue('  '+`${f.name}${count}`);
    } else {
    this.display.patchValue("");
    }


    let text = [];  
    let files = $event.srcElement.files;  
    
    if (this.isValidFile(files[0])==1) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  


        
         let csvData = reader.result;  
         let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
         let headersRow = this.getHeaderArray(csvRecordsArray);  
        
        //this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  

      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } 
    //xlsx
    else if (this.isValidFile(files[0])==2) {  
          /* wire up file reader */
        const target: DataTransfer = <DataTransfer>($event.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
          this.getDataRecordsArrayFromXLSFile();  

        };
        reader.readAsBinaryString(target.files[0]);
    }
      
    else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
      $event.target.value = ''


}
getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
  let csvArr = [];  
  this.cargaMasivaIFD=new CargaMasivaIFD;
  this.listacargaMasivaIFD=[]
  this.indice=0;

  if (csvRecordsArray[0][0]==="F"){
      for (let i = 1; i < csvRecordsArray.length; i++) {  
        let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
        if (curruntRecord.length == headerLength) {  
            this.listacargaMasivaIFD[this.indice]=new CargaMasivaIFD;
            if (typeof curruntRecord[1]!= 'undefined'){
              this.cargaMasivaIFD.temp_mercado= curruntRecord[1].trim();
              this.cargaMasivaIFD.temp_contrato= curruntRecord[2].trim();
              this.cargaMasivaIFD.temp_instrumento= curruntRecord[3].trim();
              this.cargaMasivaIFD.temp_SellBuy= curruntRecord[4].trim();
              this.cargaMasivaIFD.temp_Broker= curruntRecord[5].trim();
              this.cargaMasivaIFD.temp_CuentaBroker= curruntRecord[6].trim();
              this.cargaMasivaIFD.temp_CodigoBroker= curruntRecord[7].trim();
              this.cargaMasivaIFD.temp_Sociedad= curruntRecord[8].trim();
              this.cargaMasivaIFD.temp_caks=Number(curruntRecord[9].trim());
              this.cargaMasivaIFD.temp_medida= curruntRecord[10].trim();
              this.cargaMasivaIFD.temp_Strike=Number(curruntRecord[11].trim());
              this.cargaMasivaIFD.temp_Prima= Number(curruntRecord[12].trim());
              this.cargaMasivaIFD.temp_Costo=isNaN(Number(curruntRecord[13].trim()))===true?0:Number(curruntRecord[13].trim());
              this.cargaMasivaIFD.temp_Benchmark= curruntRecord[14].trim();
              this.cargaMasivaIFD.temp_TipoOperacion= curruntRecord[15].trim();
              
              this.cargaMasivaIFD.temp_SubyacentePricing= curruntRecord[16].trim();
              this.cargaMasivaIFD.temp_MesPricing= isNaN(Number(curruntRecord[17].trim()))===true?0:Number(curruntRecord[17].trim());
              this.cargaMasivaIFD.temp_DestinoPricing== curruntRecord[18].trim();
              this.cargaMasivaIFD.temp_PrecioBarrera=isNaN(Number(curruntRecord[19].trim()))===true?0:Number(curruntRecord[19].trim());
              this.cargaMasivaIFD.temp_TipoBarrera=curruntRecord[20].trim();
              this.cargaMasivaIFD.temp_CashBinaria=isNaN(Number(curruntRecord[21].trim()))===true?0:Number(curruntRecord[21].trim());
              this.cargaMasivaIFD.temp_RebateBinaria=isNaN(Number(curruntRecord[22].trim()))===true?0:Number(curruntRecord[22].trim());
              this.cargaMasivaIFD.temp_TipoBinaria=curruntRecord[23].trim();
              this.cargaMasivaIFD.temp_AvgAsianOption=curruntRecord[24].trim();
              this.cargaMasivaIFD.temp_FechaPromedioAsiatica=isNaN(Number(curruntRecord[25].trim()))===true?0:Number(curruntRecord[25].trim());
              
              this.cargaMasivaIFD.temp_TradeDate=Number(curruntRecord[0].trim());
              this.cargaMasivaIFD.temp_usuario=this.usuario;
              this.listacargaMasivaIFD[this.indice]=this.cargaMasivaIFD;
              this.cargaMasivaIFD=new CargaMasivaIFD;
              this.indice=this.indice+1;
            }
        }  
      }
  }  
  //return csvArr;  
}  
getDataRecordsArrayFromXLSFile() {  
  this.cargaMasivaIFD=new CargaMasivaIFD;
  this.listacargaMasivaIFD=[];
  this.indice=0;
  
  if (this.data[0][0]==="Fecha"){
      for (let i = 1; i < this.data.length; i++) {  
            let curruntRecord = this.data[i]; 
            if(typeof curruntRecord[1]!= 'undefined'){ 
              this.listacargaMasivaIFD[this.indice]=new CargaMasivaIFD;
              this.cargaMasivaIFD.temp_mercado= curruntRecord[1];
              this.cargaMasivaIFD.temp_contrato= curruntRecord[2];
              this.cargaMasivaIFD.temp_instrumento= curruntRecord[3];
              this.cargaMasivaIFD.temp_SellBuy= curruntRecord[4];
              this.cargaMasivaIFD.temp_Broker= curruntRecord[5];
              this.cargaMasivaIFD.temp_CuentaBroker= curruntRecord[6];
              this.cargaMasivaIFD.temp_CodigoBroker= curruntRecord[7];
              this.cargaMasivaIFD.temp_Sociedad= curruntRecord[8];
              this.cargaMasivaIFD.temp_caks=curruntRecord[9];
              this.cargaMasivaIFD.temp_medida= curruntRecord[10];
              this.cargaMasivaIFD.temp_Strike=curruntRecord[11];
              this.cargaMasivaIFD.temp_Prima= curruntRecord[12];
              this.cargaMasivaIFD.temp_Costo= Number(curruntRecord[13]);
              this.cargaMasivaIFD.temp_Benchmark= curruntRecord[14];
              this.cargaMasivaIFD.temp_TipoOperacion= curruntRecord[15];
              
              this.cargaMasivaIFD.temp_SubyacentePricing= curruntRecord[16];
              this.cargaMasivaIFD.temp_MesPricing= isNaN(Number(curruntRecord[17]))===true?0:Number(curruntRecord[17]);
              this.cargaMasivaIFD.temp_DestinoPricing= curruntRecord[18];
              this.cargaMasivaIFD.temp_PrecioBarrera=isNaN(Number(curruntRecord[19]))===true?0:Number(curruntRecord[19]);
              this.cargaMasivaIFD.temp_TipoBarrera=curruntRecord[20];
              this.cargaMasivaIFD.temp_CashBinaria=isNaN(Number(curruntRecord[21]))===true?0:Number(curruntRecord[21]);
              this.cargaMasivaIFD.temp_RebateBinaria=isNaN(Number(curruntRecord[22]))===true?0:Number(curruntRecord[22]);
              this.cargaMasivaIFD.temp_TipoBinaria=curruntRecord[23];
              this.cargaMasivaIFD.temp_AvgAsianOption=curruntRecord[24];
              this.cargaMasivaIFD.temp_FechaPromedioAsiatica=isNaN(Number(curruntRecord[25]))===true?0:Number(curruntRecord[25]);

              this.cargaMasivaIFD.temp_TradeDate= curruntRecord[0];
              this.cargaMasivaIFD.temp_usuario=this.usuario;
              this.listacargaMasivaIFD[this.indice]=this.cargaMasivaIFD;
              this.cargaMasivaIFD=new CargaMasivaIFD;
              this.indice=this.indice+1;
            }
      }
    }  
}  


isValidFile(file: any):number {  


  if (file.name.endsWith(".csv")){
    this.tipoArchivo =1
  }
  else if (file.name.endsWith(".xls")){
    this.tipoArchivo=2
  }
  else if (file.name.endsWith(".xlsx")){
    this.tipoArchivo=2
  }
  return this.tipoArchivo

}  


fileReset() {  
  this.csvReader.nativeElement.value = "";  
  this.records = [];  
  this.data=[];
  
}

handleFileInputChange(l: FileList): void {
  this.file_store = l;
  if (l.length) {
    const f = l[0];
    const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
    this.display.patchValue(`${f.name}${count}`);
  } else {
    this.display.patchValue("");
  }
}

GuardarCargaMasiva(): void {
 //Cargar Informacion a BD.
    console.log(this.data);
    console.log("final...."+this.listacargaMasivaIFD.length);  
    this.listaIFDMasivoValidado=this.validarCargaMasiva()
    //this.listaIFDMasivoValidado=1

    if (this.listaIFDMasivoValidado>0){
    if(this.listaIFDMasivoValidado==2){
      Swal.fire({
        icon: 'warning',
        title: 'Registro de IFDs',
        html: '¿Seguro que desea registrar el IFD?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
      }).then((result) => {
        if (result.isConfirmed) {
          this.portafolioMoliendaIFDService.guardarCargaMasiva_SQL(this.listacargaMasivaIFD).subscribe(data=>{
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se proceso la carga masiva con éxito',
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
      })
    }
    else{
      if(this.listaIFDMasivoValidado==1){
        this.portafolioMoliendaIFDService.guardarCargaMasiva_SQL(this.listacargaMasivaIFD).subscribe(data=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se proceso la carga masiva con éxito',
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
    }
    
    
    //this.listacargaMasivaIFD=[]
  }
  else
  {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Se encontro un error en el archivo elegido.',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
  }
    
}


getHeaderArray(csvRecordsArr: any) {  
  const headerArray : string[] = [];

  let headers = (<string>csvRecordsArr[0]).split(',');  
  
  //let headerArray = [];

  for (let j = 0; j < headers.length; j++) {  
    headerArray.push(headers[j]);  
  }  
  return headerArray;  
}  

modalModificarIFD(detalleForm:any):boolean {

  //RESETEO DE EL MODELO
  console.log("modal abierto");
  this.myModal=true;
  console.log('Cod PreSQL asociar: '+this.contextMenu.menuData.item.s208_Operacion);
  
  
  if(this.contextMenu.menuData.item.s208_Operacion ==0){
    Swal.fire({
    icon: 'warning',
    title: 'Aviso',
    text: 'No se tiene operaciones para modificar',
    confirmButtonColor: '#0162e8',
    customClass: {
      container: 'my-swal'
    }
  })
}else{

      //prpio de modal
      if(this.companiaSelected==0){
        Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar una empresa',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }else if(this.productoSelectedModal==0){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar un subyacente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }
    else{
      //fijar fecha de modificación y rol de usuario
      // si es dentro del día se puede modificar
      // rol de usuario dia posterior al registro  
      //this.checked = this.rolesUsuario.filter(i => i.s114_Codigo.toString()==='6');
      
      //if( !this.estadoRegistro || this.contextMenu.menuData.item.s208_Estado != 'Nuevo' ){
      if( !this.estadoRegistro && this.contextMenu.menuData.item.s208_Estado != 'Nuevo' ){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            //text: 'La operación no es nueva es necesario ser administrador para modificar los campos',
            text: 'La operación no es nueva, no se puede modificar.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return false;
        }
      }

      this.loader.show();
      this.portafolioMoliendaIFDService.getInitIFDModificar(this.contextMenu.menuData.item.s208_Operacion, Number(this.contextMenu.menuData.item.s208_IdTicker),
                                                            Number(this.contextMenu.menuData.item.s208_IdExchange), Number(this.contextMenu.menuData.item.s208_IdSociedad),
                                                       Number(this.contextMenu.menuData.item.s208_IdBroker), Number(this.contextMenu.menuData.item.s208_Underlying),
                                                        this.fecha, Number(this.contextMenu.menuData.item.s208_IdTypeContract) ).subscribe(
      (response: ObjInitIFDModificar) => {
          this.objetoInitPadre = response
          this.loader.hide();
          this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
          this.portafolioMoliendaIFDService.producto=this.productoSelected;
          this.portafolioMoliendaIFDService.fecha=this.fecha;
          this.portafolioMoliendaIFDService.operacionSQL=this.contextMenu.menuData.item;
          //  this.modalService.open(modificarOperacionForm,{windowClass : "my-class-Operacion",centered: true,backdrop : 'static',keyboard : false});     
          const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classModificarIFD"});

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

        

      //this.modalService.open(detalleForm,{ centered: true,size: 'lg' });
      

    }
    return true;

  }

public getTipoContrato_SQL(idSQL: number)  {
  this.portafolioMoliendaIFDService.getTipoContrato_SQL(idSQL).subscribe(
    (response: Descripcion) => {
      this.idTipoContrato = Number(response.temp_descripcion);
      
      
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}
public getBolsa_SQL(idSQL: number): void {
  this.portafolioMoliendaIFDService.getBolsa_SQL(idSQL).subscribe(
    (response: Descripcion) => {
      this.idBolsa =Number(response.temp_descripcion);
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public modalCancelarIFD(){

  //Validar Portafolio Cerrado
  //Operación del día
  var fechaCancelar:String;
  fechaCancelar=this.contextMenu.menuData.item.s208_FechaPacto.replace(new RegExp("-",'g'),"").toString();
  
  //if ((this.fecha).toString()==fechaCancelar){
    //caso que no sea el mismo día la cancelación
  if ((this.fecha).toString()!==fechaCancelar){
    Swal.fire({
      icon: 'warning',
      title: 'IFD',
      html: '¿Seguro que desea cancelar el IFD <b>' + this.contextMenu.menuData.item.s208_Operacion.toString() + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
      }).then((result) => {
      if (result.isConfirmed) {
        if((this.portafolio.filter(obj => obj["s208_CodigoBroker"] == 'BASES' && obj["s208_Operacion"] == this.contextMenu.menuData.item.s208_Operacion).length > 0)){ //POBO
          this.portafolioMoliendaIFDService.cancelarIFD_PoBo(this.contextMenu.menuData.item.s208_Operacion, this.fecha, this.usuario).subscribe(
            (response: string) => {
              Swal.fire({
                title: 'IFD',
                html: 'Se canceló la operación <b>' + this.contextMenu.menuData.item.s208_Operacion.toString() + '</b>',
                icon: 'success',
                confirmButtonColor: '#4b822d'
              })
              this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected, this.fecha);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.portafolioMoliendaIFDService.enviarSolicitudCancelarIFD(this.contextMenu.menuData.item.s208_Operacion, this.fecha, this.usuario).subscribe(
            (response: string) => {
              Swal.fire({
                title: 'IFD',
                html: 'Se envío la solicitud para cancelar la operación <b>' + this.contextMenu.menuData.item.s208_Operacion.toString() + '</b>',
                icon: 'success',
                confirmButtonColor: '#4b822d'
              })
              this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected, this.fecha);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }
        
        }
      })
    // Swal.fire({
    //   icon: 'warning',
    //   title: 'Aviso',
    //   text: 'Solo se puede cancelar operaciones ingresadas hoy',
    //   confirmButtonColor: '#0162e8',
    //   customClass: {
    //     container: 'my-swal'
    //   }
    // })
  }

  //caso que sea el mismo dia la cancelación
  else{
    Swal.fire({
    icon: 'warning',
    title: 'IFD',
    html: '¿Seguro que desea cancelar el IFD <b>' + this.contextMenu.menuData.item.s208_Operacion.toString() + '</b>?',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Continuar',
    reverseButtons: true,
    confirmButtonColor: '#4b822d'
    }).then((result) => {
    if (result.isConfirmed) {
      if((this.portafolio.filter(obj => obj["s208_CodigoBroker"] == 'BASES' && obj["s208_Operacion"] == this.contextMenu.menuData.item.s208_Operacion).length > 0)){ //POBO

        this.portafolioMoliendaIFDService.cancelarIFD_PoBo(this.contextMenu.menuData.item.s208_Operacion, this.fecha, this.usuario).subscribe(
          (response: string) => {
            Swal.fire({
              title: 'IFD',
              html: 'Se canceló la operación <b>' + this.contextMenu.menuData.item.s208_Operacion.toString() + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
            this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected, this.fecha);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });

      }else{
        this.portafolioMoliendaIFDService.cancelarIFD(this.contextMenu.menuData.item.s208_Operacion, this.fecha, this.usuario).subscribe(
          (response: string) => {
            Swal.fire({
              title: 'IFD',
              html: 'Se canceló la operación <b>' + this.contextMenu.menuData.item.s208_Operacion.toString() + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
            this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected, this.fecha);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
      }
    })
  }
}

modalLiquidarIFD(detalleForm:any){

  //RESETEO DE EL MODELO
  console.log("modal abierto");
  this.myModal=true;
  console.log('Cod PreSQL asociar: '+this.contextMenu.menuData.item.s208_Operacion);
  if(this.contextMenu.menuData.item.s208_Operacion ==0){
    Swal.fire({
    icon: 'warning',
    title: 'Aviso',
    text: 'No se tiene operaciones para liquidar',
    confirmButtonColor: '#0162e8',
    customClass: {
      container: 'my-swal'
    }
  })
}else{

      //prpio de modal
      if(this.companiaSelected==0){
        Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar una empresa',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }else if(this.productoSelectedModal==0){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar un subyacente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }
    else{
      Swal.fire({
        icon: 'warning',
        title: 'Liquidar IFD',
        html: '¿Seguro que desea liquidar el IFD <b>' + this.contextMenu.menuData.item.s208_Operacion.toString() + '</b>?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
        }).then((result) => {
        if (result.isConfirmed) {

          // if(this.portafolio.filter(obj => obj["s208_CodigoBroker"] == 'BASES' && obj["s208_Operacion"] == this.contextMenu.menuData.item.s208_Operacion).length > 0){
          //   this.portafolioMoliendaIFDService.flgPoBo = true;
          // }else{
          //   this.portafolioMoliendaIFDService.flgPoBo = false;
          // }

          this.portafolioMoliendaIFDService.flgPoBo = (this.portafolio.filter(obj => obj["s208_CodigoBroker"] == 'BASES' && obj["s208_Operacion"] == this.contextMenu.menuData.item.s208_Operacion).length > 0);

          this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
          this.portafolioMoliendaIFDService.producto=this.productoSelected;
          this.portafolioMoliendaIFDService.fecha=this.fecha;
          this.portafolioMoliendaIFDService.operacionSQL=this.contextMenu.menuData.item;
          const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classLiquidarIFD"});
         
        }  
        })

      
    }
  }

  }//fin de método
  
  modalLimiteCampanha(detalleForm:any){

    //RESETEO DE EL MODELO
    this.myModal=true;
    if(this.contextMenu.menuData.item.s208_Operacion ==0){
      Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'No se tiene operaciones para liquidar',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
    })
  }else{
  
        //prpio de modal
        if(this.companiaSelected==0){
          Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar una empresa',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }else if(this.productoSelectedModal==0){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar un subyacente',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }
            const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classLimiteIFD"});
            // clearInterval()
      }
    
  
    }//fin de método
  


modalCampanha(detalleForm:any){

  //RESETEO DE EL MODELO
  this.myModal=true;
  if(this.contextMenu.menuData.item.s208_Operacion ==0){
    Swal.fire({
    icon: 'warning',
    title: 'Aviso',
    text: 'No se tiene campañas a registrar',
    confirmButtonColor: '#0162e8',
    customClass: {
      container: 'my-swal'
    }
  })
}else{

      //prpio de modal
      if(this.companiaSelected==0){
        Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar una empresa',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }else if(this.productoSelectedModal==0){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar un subyacente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }
          const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classCampanhaIFD"});
          // clearInterval()
    }
  

  }//fin de método

  // public showSpinner(): void {
  //   this.spinnerService.show();
  
  //   setTimeout(() => {
  //     this.spinnerService.hide();
  //   }, 5000); // 5 seconds
  // }
  

  modalRegistrarEstrategia(detalleForm:any,detalleFormCM:any){
    //RESETEO DE EL MODELO

    
    this.isLoading = true;
    setTimeout( () => this.isLoading = false, 2000 );

    console.log("modal abierto");
    this.myModal=true;
    //prpio de modal
        if(this.companiaSelected==0){
          Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar una empresa',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }else if(this.productoSelectedModal==0){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario seleccionar un subyacente',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }
      else{
            
            this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania);
            this.portafolioMoliendaIFDService.producto=this.productoSelected;
            this.portafolioMoliendaIFDService.fecha=this.fecha;
            this.portafolioMoliendaIFDService.nombreFormulario="Registrar"
            this.portafolioMoliendaIFDService.operacionSQL=new PortafolioIFDMolienda();
            if (Number(this.selectedcompania)==7){
              const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classRegistrarEstrategia"});
            }
            else{
              const modalRef =this.modalService.open(detalleFormCM,{windowClass : "my-classRegistrarEstrategiaCM"});
            }
          
        }
  }//fin de método


    modalModificarEstrategia(detalleForm:any,detalleFormCM:any){
      // this.contextMenu.menuData.item.s208_Operacion, Number(this.contextMenu.menuData.item.s208_IdTicker),
      //                                                       Number(this.contextMenu.menuData.item.s208_IdExchange), Number(this.contextMenu.menuData.item.s208_IdSociedad),
      //                                                  Number(this.contextMenu.menuData.item.s208_IdBroker), Number(this.contextMenu.menuData.item.s208_Underlying),
      //                                                   this.fecha, Number(this.contextMenu.menuData.item.s208_IdTypeContract)
      //RESETEO DE EL MODELO
      console.log("modal abierto");
      this.myModal=true;
      console.log('Cod PreSQL asociar: '+this.contextMenu.menuData.item.s208_Operacion);
      if(this.contextMenu.menuData.item.s208_Operacion ==0){
        Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se tiene operaciones para modificar estrategia',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }else{
    
          //prpio de modal
          if(this.companiaSelected==0){
            Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Es necesario seleccionar una empresa',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
        }else if(this.productoSelectedModal==0){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Es necesario seleccionar un subyacente',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
        }
        else{
              //fijar fecha de modificación y rol de usuario
              // si es dentro del día se puede modificar
              // rol de usuario dia posterior al registro  
              //if( !this.estadoRegistro || this.contextMenu.menuData.item.s208_Estado != 'Nuevo' ){  
              if( !this.estadoRegistro && this.contextMenu.menuData.item.s208_Estado != 'Nuevo' ){
                  Swal.fire({
                    icon: 'warning',
                    title: 'Aviso',
                    //text: 'La operación no es nueva es necesario ser administrador para modificar los campos',
                    text: 'La operación no es nueva, no se puede modificar la estrategia.',
                    confirmButtonColor: '#0162e8',
                    customClass: {
                      container: 'my-swal'
                    }
                  })
                  return false;
                }
              }
              this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
              this.portafolioMoliendaIFDService.producto=this.productoSelected;
              this.portafolioMoliendaIFDService.fecha=this.fecha;
              this.portafolioMoliendaIFDService.operacionSQL=this.contextMenu.menuData.item;
              this.portafolioMoliendaIFDService.nombreFormulario="Modificar"
              this.portafolioMoliendaIFDService.idUnderlying = this.contextMenu.menuData.item.s208_Underlying
              this.portafolioMoliendaIFDService.tipoContrato = this.contextMenu.menuData.item.s208_IdTypeContract
              this.portafolioMoliendaIFDService.bolsa = this.contextMenu.menuData.item.s208_IdExchange
              if (typeof this.contextMenu.menuData.item.s208_CodigoEstrategia !== 'undefined' && this.contextMenu.menuData.item.s208_CodigoEstrategia !== 0 ) {
                this.portafolioMoliendaIFDService.idEstrategia=this.contextMenu.menuData.item.s208_CodigoEstrategia  
                
                  if (Number(this.selectedcompania)==7){
                    const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classRegistrarEstrategia"});
                  }
                  else{
                    const modalRef =this.modalService.open(detalleFormCM,{windowClass : "my-classRegistrarEstrategiaCM"});
                  }
                
                
              }
              else{
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: 'La operación seleccionada no tiene estrategia para modificar.',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
              }
      }
      return true;
      }//fin de método
      cierrePortafolio(detalleForm:any){
        //RESETEO DE EL MODELO
    
        //this.showSpinner();
        
    
        this.isLoading = true;
        setTimeout( () => this.isLoading = false, 2000 );
    
        console.log("modal abierto");
        this.myModal=true;
        //prpio de modal
            if(this.companiaSelected==0){
              Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar una empresa',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }else if(this.productoSelectedModal==0){
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar un subyacente',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }
          else{
                this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
                this.portafolioMoliendaIFDService.producto=this.productoSelected;
                this.portafolioMoliendaIFDService.fecha=this.fecha;
                this.portafolioMoliendaIFDService.flagCierre=true;
                this.checked = this.compania.filter(i => (i.t060_ID )===Number(this.companiaSelected) );  
                this.portafolioMoliendaIFDService.nombreFormulario=this.checked[0].t060_Description

                const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classCierreIFD"});
                // clearInterval()
              
            }
      }//fin de método
      deshacercierrePortafolio(detalleForm:any){
        //RESETEO DE EL MODELO
    
        //this.showSpinner();
        
    
        this.isLoading = true;
        setTimeout( () => this.isLoading = false, 2000 );
    
        console.log("modal abierto");
        this.myModal=true;
        //prpio de modal
            if(this.companiaSelected==0){
              Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar una empresa',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }else if(this.productoSelectedModal==0){
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar un subyacente',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }
          else{
                this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
                this.portafolioMoliendaIFDService.producto=this.productoSelected;
                this.portafolioMoliendaIFDService.fecha=this.fecha;
                this.portafolioMoliendaIFDService.flagCierre=false;
                this.checked = this.compania.filter(i => (i.t060_ID )===Number(this.companiaSelected));  
                this.portafolioMoliendaIFDService.nombreFormulario=this.checked[0].t060_Description

                const modalRef =this.modalService.open(detalleForm,{windowClass : "my-classCierreIFD"});
                // clearInterval()
              
            }
      }//fin de método
      

      public cierrePortafolioMatlab(): void {
        var flagCierre:number
        
        //this.spinnerService.llamarSpinner();
        // 0: ATM
        // 1: Skew
        var varArrFecha:number[]=[];
        varArrFecha[0]=Number(this.pFechaReporte)
        varArrFecha[1]=Number(this.pFechaReporte)


        // this.portafolioMoliendaIFDService.getCierrecierrePortafolioMatlab(varArrFecha, this.companiaSelected ,this.productoSelected ,0,this.usuario).subscribe(
        //   (response: number) => {
        //     flagCierre =response;
        //     this.getPortafolioIFDMolienda(this.productoSelected,this.companiaSelected, Number(this.pFechaReporte));
        //   },
        //   (error: HttpErrorResponse) => {
        //     alert(error.message);
        //   }
        // );
        

      }

      public getRolUsuario(){
        this.portafolioMoliendaIFDService.getRolUsuario(this.usuario).subscribe(
          (response: CargarCombo[]) => {
          this.rolesUsuario = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
      
      }
    
      setDateReporte(date: string) {
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
          this.pFechaReporte= `${pAnho}0${pMes}0${pDia}`.toString(); 
         }else if (Number(pDia)<10 ){
          this.pFechaReporte= `${pAnho}${pMes}0${pDia}`.toString(); 
         }else if (Number(pMes)<10){
          this.pFechaReporte= `${pAnho}0${pMes}${pDia}`.toString(); 
         }else{
          this.pFechaReporte= `${pAnho}${pMes}${pDia}`.toString();
         }
      }  
      public validarCargaMasiva(): number {
    
        var resultado:number=0
        this.listaIFDMasivoValidado =0;
        //Valida cuando se quiere realizar cierre de portafolio
        
        this.checked=[];
        if (this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1  ){    
              //this.checked = this.listacargaMasivaIFD.filter(i => (i.temp_TradeDate)!=this.fecha );  
              //if (this.checked.length>0 ){
              resultado=2
              //}
          }
          else{
            if (this.estadoRegistro){
              this.checked = this.listacargaMasivaIFD.filter(i => (i.temp_TradeDate)!=this.fecha );  
              if (this.checked.length>0 ){
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Existe operaciones con fecha diferente a hoy, solo puede registrar el administrador.'  ,
                    confirmButtonColor: '#0162e8',
                    customClass: {
                    container: 'my-swal',
                    }
                  });
                  resultado=0;
              }
              else{
                resultado=1
              }
            }
          }
        return resultado;
      }
      modalCambiarEstadoIFD(detalleForm:any){
        //RESETEO DE EL MODELO
    
        //this.showSpinner();
        
    
        this.isLoading = true;
        setTimeout( () => this.isLoading = false, 2000 );
    
        console.log("modal abierto");
        this.myModal=true;
        //prpio de modal
            if(this.companiaSelected==0){
              Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar una empresa',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }else if(this.productoSelectedModal==0){
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar un subyacente',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }
          else{
                this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
                this.portafolioMoliendaIFDService.producto=this.productoSelected;
                this.portafolioMoliendaIFDService.fecha=this.fecha;
                this.portafolioMoliendaIFDService.nombreFormulario="Cambiar Estado IFD"
                const modalRef =this.modalService.open(detalleForm,{backdrop: 'static', windowClass : "my-classCambiarEstadoIFD"});
                // clearInterval()
              
            }
      }//fin de método      
    modalIngresoOperacionSinCuenta(detalleForm:any){

      //RESETEO DE EL MODELO
      console.log("modal abierto");
      this.myModal=true;
        
      if(this.pOperacionesSinCuenta ==0){
          Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'No se tiene operaciones del Broker',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
      }else{
    
            //prpio de modal
            if(this.companiaSelected==0){
              Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar una empresa',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }else if(this.productoSelectedModal==0){
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Es necesario seleccionar un subyacente',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
          }
          else{
            
    
              this.portafolioMoliendaIFDService.codigoEmpresa=Number(this.selectedcompania)//this.selectedcompania()
              this.portafolioMoliendaIFDService.tipo="OperacionesBroker";
              this.portafolioMoliendaIFDService.producto=this.productoSelected;
              this.portafolioMoliendaIFDService.fecha=this.fecha;
              
            //this.modalService.open(detalleForm,{ centered: true,size: 'lg' });
            const modalRef =this.modalService.open(detalleForm,{windowClass : "my-class"});
            // clearInterval()
          }
        }
      }
      ModaldividirContrato(){
            if(!this.validarpermisos("Usted no cuenta con permisos para dividir contrato")){
              this.estadoDividir=true;
              return;
            }
        
            if(this.estadoPortafolio.length > 0) {
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'El Portafolio se encuentra Cerrado.',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              })
              return;
            }
            this.dividirContrato();
      }
      dividirContrato(){
      var tm: string;
      this.operacionSQL=this.contextMenu.menuData.item;
      Swal.fire({
          icon: 'question',
          title: 'División de IFD',
          html: 'El IFD <b>' + this.operacionSQL.s208_Operacion.toString() + '</b> contiene <b>' + this.operacionSQL.s208_NumeroContratos.toString() + ' lotes</b>, ¿cuantos lotes tendrá el nuevo IFD?',
          input: 'number',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#4b822d',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true
    
        }).then((result) => {
          if (result.isConfirmed) {
            tm = result.value;
            if(this.operacionSQL.s208_NumeroContratos < result.value){
              Swal.fire({
                icon: 'error',
                title: 'División de Contrato',
                text: 'Los lotes ingresados superan al contrato seleccionado.',
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false
              })
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'División de Contrato',
                html: '¿Seguro que desea dividir el ifd <b>' + this.operacionSQL.s208_Operacion.toString() + '</b>?',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                reverseButtons: true,
                confirmButtonColor: '#4b822d'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.portafolioMoliendaIFDService.realizarSplit(this.operacionSQL.s208_Operacion,Number(tm)).subscribe(
                    (response: string) => {
                      //this.portafolioMoliendaIFDService.flgActualizar=true
                      Swal.fire({
                        title: 'División de Contrato!',
                        html: 'Se realizó la división de contrato. Nuevo contrato <b>' + response + '</b>',
                        icon: 'success',
                        confirmButtonColor: '#4b822d'
                      })
                    },
                    (error: HttpErrorResponse) => {
                      alert(error.message);
                    });
                }
              })
            }
          }
        })
      }
    
      validarpermisos(comentario: string): boolean{
        if(!this.estadoRegistro){
          Swal.fire({
            icon: 'error',
            title: 'Permiso denegado',
            text: comentario,
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return false;
        }else{
          return true;
        }
      }

      modalOperacionesxVencer(){
        const modalRef =this.modalService.open(operacionesxVencerComponent,{windowClass : "my-class"});
        // clearInterval()
      }


    //   public getListaOperacionesxVencer( fecha:number): void {

      

    //     this.portafolioMoliendaIFDService.getListaOperacionesxVencer( fecha).subscribe(
    //     (response: ListaOperacionesxVencer[]) => {
    //       this.listaOperacionesxVencer = response;
    //       if (this.listaOperacionesxVencer.length>0){
    //         this.modalOperacionesxVencer();
    //       }
    //     },
    //     (error: HttpErrorResponse) => {
    //       alert(error.message);
    //     }
    //   );
    // }

    public getListaOperacionesxVencer( fecha:number): void {

      this.portafolioMoliendaIFDService.getListaOperacionesxVencer( fecha).subscribe(
      (response: ListaOperacionesxVencer[]) => {

        this.listaOperacionesxVencer = response;
        this.displayedColumnsFechaExpiracion.push('s255_MonthTicker')
        for (let operacionesxVencer of  this.listaOperacionesxVencer )
        {
          this.checked=[];
          if (operacionesxVencer.s255_ExpirateWc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateWc1')
            if(this.checked.length==0){
                  this.displayedColumnsFechaExpiracion.push('s255_ExpirateWc1')}
          }
          if (operacionesxVencer.s255_ExpirateKWc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateKWc1')
            if(this.checked.length==0){
                this.displayedColumnsFechaExpiracion.push('s255_ExpirateKWc1')}
          }
          if (operacionesxVencer.s255_ExpirateMWEc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateMWEc1')
            if(this.checked.length==0){
                this.displayedColumnsFechaExpiracion.push('s255_ExpirateMWEc1')}
          }
          if (operacionesxVencer.s255_ExpirateBOc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateBOc1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_ExpirateBOc1')}
          }
          if (operacionesxVencer.s255_ExpirateBOc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateSMc1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_ExpirateSMc1')}
          }
          if (operacionesxVencer.s255_ExpirateFCPOc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateFCPOc1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_ExpirateFCPOc1')}
          }
          if (operacionesxVencer.s255_ExpirateBL2c1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateBL2c1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_ExpirateBL2c1')}
          }
          if (operacionesxVencer.s255_ExpirateSc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateSc1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_ExpirateSc1')}
          }
          if (operacionesxVencer.s255_ExpirateBWFc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateBWFc1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_ExpirateBWFc1')}
          }
          if (operacionesxVencer.s255_Expirate2BXCc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_Expirate2BXCc1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_Expirate2BXCc1')}
          }
          if (operacionesxVencer.s255_ExpirateCc1!='') {
            this.checked=this.displayedColumnsFechaExpiracion.filter(e => e=='s255_ExpirateCc1')
            if(this.checked.length==0){
              this.displayedColumnsFechaExpiracion.push('s255_ExpirateCc1')}
          }
        }
        this.dataSourceFechaExpiracion = new MatTableDataSource(this.listaOperacionesxVencer);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    


      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
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

    ejecutarLimites(){
      Swal.fire({
        icon: 'question',
        title: 'Aviso',
        html: '¿Desea ejecutar los límites de hoy?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
      }).then((result) => {
        if (result.isConfirmed){
          console.log("Se ejecutan los límites");
          let datos:any;
          datos=[]
          datos.push('1') //empresa
          datos.push(this.fecha.toString())
          datos.push(this.usuario)
  
          this.limiteService.ejecutarCierre(datos).subscribe(data =>
            {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se realizó la ejecución de los límites CM.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#4b822d'
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
      });
    }
  
  
    ejecucionLimites(){
      console.log(Number(this.selectedcompania), this.fecha);
      if (Number(this.selectedcompania) != 1){
      }
      else{
        this.limiteService.validarCierre(Number(this.selectedcompania), this.fecha).subscribe(
          (response: String) => {
            if(response.length>0){//Si hubiesen observaciones en la validación, se muestran mensajes de alerta
              if(response.toString().includes('[CONFIRMAR]') || response.toString().includes('[ALERTAR]')){//Algunas validaciones requieren mostrar varios mensajes secuenciales y permiten la posibilidad de continuar con el proceso
                let listMensajes: string[] = response.toString().split(';');
                this.mostrarListaDeAlertas(listMensajes);
              }
              else{//Algunas validaciones solo muestran un mensaje e impiden que se continúe con el proceso
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: response.toString(),
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                });
              }
            }
            else{
              this.ejecutarLimites();
            }
          },
          (error: HttpErrorResponse) => {
            if(error.error.message.includes('ConstraintViolationException')){
              console.log('entro error')
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
      
    }//fin de método
  
    mostrarListaDeAlertas(mensajes) {
      if (mensajes.length > 0) {
        const mensaje = mensajes.shift(); // Sacar la primera alerta del arreglo
        if (mensaje.startsWith('[ALERTAR]')) {
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: mensaje.replace('[ALERTAR]', ''),
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          }).then(() => {
            // Llamar recursivamente para mostrar la próxima alerta
            if(mensajes.length > 0){
              this.mostrarListaDeAlertas(mensajes);
            }
            else{
              this.ejecutarLimites();
            }
          });
        } else if (mensaje.startsWith('[CONFIRMAR]')) {
          // Mostrar alerta de confirmación
          Swal.fire({
            icon: 'question',
            title: 'Aviso',
            html: mensaje.replace('[CONFIRMAR]', ''),
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            reverseButtons: true,
            confirmButtonColor: '#4b822d'
          }).then((result) => {
            // Llamar recursivamente solo si se confirma la acción
            if (result.isConfirmed) {
              if(mensajes.length > 0){
                this.mostrarListaDeAlertas(mensajes);
              }
              else{
                this.ejecutarLimites();
              }
            }
            else{
              return;
            }
          });
        }
      }
    }
  
  }

function ngOnDestroy(): number {
  throw new Error('Function not implemented.');
}

  
