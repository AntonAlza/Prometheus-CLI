import { Component, OnInit, ViewChild,Input } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { PortafolioMolienda } from 'src/app/models/Fisico/portafolioMolienda';
import { Companias } from 'src/app/models/Fisico/companias';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuTrigger } from '@angular/material/menu';
import { Item } from 'angular2-multiselect-dropdown';
import { Underlying } from 'src/app/models/Fisico/underlying';
import { ClosingControl } from 'src/app/models/Fisico/closingControl';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import Swal from 'sweetalert2';
import { SalesContract } from 'src/app/models/Fisico/SalesContract';
import { Physical } from 'src/app/models/Fisico/Physical';
import { Society } from 'src/app/models/Fisico/Society';
import { AnimalNutrition } from 'src/app/models/Fisico/AnimalNutrition';
import { FlatForSale } from 'src/app/models/Fisico/FlatForSale';
import { ContratoCross } from 'src/app/models/Fisico/ContratoCross';
import { BaseForSale } from 'src/app/models/Fisico/BaseForSale';
import { PriceForSale } from 'src/app/models/Fisico/PriceForSale';
import { BaseProfitAndLoss } from 'src/app/models/Fisico/BaseProfitAndLoss';
import { ClosingBasis } from 'src/app/models/Fisico/ClosingBasis';
import { FutureBetweenCompany } from 'src/app/models/Fisico/FutureBetweenCompany';
import { Future } from 'src/app/models/Fisico/Future';
import { ClosingPrice } from 'src/app/models/Fisico/ClosingPrice';
import { ClosingPriceBetweenCompany } from 'src/app/models/Fisico/ClosingPriceBetweenCompany';
import { RelationshipBetweenShipAndFuture } from 'src/app/models/Fisico/RelationshipBetweenShipAndFuture';
import { guardarBaseCross } from 'src/app/models/Fisico/guardarBaseCross';
import { ClosingBasisBetweenCompany } from 'src/app/models/Fisico/ClosingBasisBetweenCompany';
import { listaPlanificacionConsumo } from 'src/app/models/Fisico/listaPlanificacionConsumo';
import { PartialContractDownload } from 'src/app/models/Fisico/PartialContractDownload';
import { Unloading } from 'src/app/models/Fisico/Unloading';
import { UnloadingBetweenCompany } from 'src/app/models/Fisico/UnloadingBetweenCompany';
import { objVentaParcialIntercompany } from 'src/app/models/Fisico/objVentaParcialIntercompany';
import { listaDescargasParciales } from 'src/app/models/Fisico/listaDescargasParciales';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PriceMonth } from 'src/app/models/Fisico/PriceMonth';
import { ControlCierresVentasMolienda } from 'src/app/models/Fisico/ControlCierresVentasMolienda';
import jsPDF from 'jspdf';
import { DatosCierreComercial } from 'src/app/models/Fisico/DatosCierreComercial';
import * as XLSX from 'xlsx';
import { Shipment } from 'src/app/models/Fisico/Shipment';
import { ConsumptionPlanning } from 'src/app/models/Fisico/ConsumptionPlanning';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { consultaHistorica } from 'src/app/models/Fisico/consultaHistorica';
import { consultaHistoricaEspecifica } from 'src/app/models/Fisico/consultaHistoricaEspecifica';
import { filterValues } from 'src/app/models/Fisico/ventasMoliendaFilter';
import { MatSelectChange } from '@angular/material/select';
import { FormGroup, FormControl } from '@angular/forms';
import { TokenService } from 'src/app/shared/services/token.service';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { IngresaFactura } from 'src/app/models/Fisico/IngresaFactura';
import { HumanConsumption } from 'src/app/models/Fisico/Consumo Masivo/HumanConsumption';
import { objComboSociedades } from 'src/app/models/Fisico/objComboSociedades';
import { objAnimalNutrition_ConsumoH } from 'src/app/models/Fisico/objAnimalNutrition_ConsumoH';

@Component({
  selector: 'app-ventasMolienda',
  templateUrl: './ventasMolienda.component.html',
  styleUrls: ['./ventasMolienda.component.scss']
})

export class ventasMoliendaComponent implements OnInit {

  
  public portafolioDS: MatTableDataSource<PortafolioMolienda>;
  public portafolio: PortafolioMolienda[] = [];
  public selectedcompania: Companias[] = [];
  public selectedProducto: Underlying[] = [];
  public selectedProductoModal: Underlying[] = [];
  public compania: Companias  [] = [];
  public productos: Underlying  [] = [];
  public estadoPortafolio: ClosingControl  [] = [];
  public estadosCierresXSociedad: ClosingControl  [] = [];
  public companiaSelected: number  = 0;
  public productoSelected: number  = 0;
  public productoSelectedModal: number  = 0;
  public companiasBarcos: Society[] = [];
  public campagnasSeleccionadas: number[];
  public seleccionarTodo:boolean = false;
  public consumoHumano: HumanConsumption;
  public bolsaSelectedModal: string  = "";

  public ultimoItemSeleccionado: number=0;
  public caksInt: number=0;
  public postCierre: boolean=false;
  public tituloTabla: string="Portafolio Ventas Molienda";
  public codigoSeleccionado: string;

 public productosMolienda: Underlying[]=[];
 public barcos: cargaCombo[]=[];
 public origen: cargaCombo[]=[];
 public campania: cargaCombo[]=[];
 public ConsultaHistoricacampania: cargaCombo[]=[];
 public producto: cargaCombo[]=[];
 public cliente: cargaCombo[]=[];
 public zona: cargaCombo[]=[];
 public incoterm: cargaCombo[]=[];
 public puertoOrigen: cargaCombo[]=[];
 public puertoDestino: cargaCombo[]=[];
 public bolsa: cargaCombo[]=[];

 public mercado: cargaCombo[]=[];
 public compraventa: cargaCombo[]=[];
 public comboFactura: cargaCombo[]=[];
 public washout: cargaCombo[]=[];
 public market: cargaCombo[]=[];
 public tipoPrecio: cargaCombo[]=[];
 public contrato: cargaCombo[]=[];
 public nuevoContrato: SalesContract = new SalesContract();
 public priceMonth: PriceMonth = new PriceMonth();
 public nuevoFisico: Physical = new Physical();
 public nuevoNutricionAnimal: AnimalNutrition = new AnimalNutrition();
 public nuevoFlat: FlatForSale  = new FlatForSale();
 public nuevaBase: BaseForSale  = new BaseForSale();
 public nuevoFuturo: PriceForSale  = new PriceForSale();
 public contratoCross: ContratoCross  = new ContratoCross();
 public BaseCross: guardarBaseCross  = new guardarBaseCross();
 public baseProfitAndLoss: BaseProfitAndLoss  = new BaseProfitAndLoss();
 public closingBasis: ClosingBasis  = new ClosingBasis();
 public closingBasisBetweenCompany: ClosingBasisBetweenCompany  = new ClosingBasisBetweenCompany();
 public future: Future  = new Future();
 public futureBetweenCompany: FutureBetweenCompany  = new FutureBetweenCompany();
 public closingPrice: ClosingPrice  = new ClosingPrice();
 public closingPriceBetweenCompany: ClosingPriceBetweenCompany  = new ClosingPriceBetweenCompany();
 public relationshipBetweenShipAndFuture: RelationshipBetweenShipAndFuture  = new RelationshipBetweenShipAndFuture();
 public nuevoPartialContractDownload: PartialContractDownload  = new PartialContractDownload();
 public nuevoUnloading: Unloading = new Unloading();
 public nuevoUnloadingBetweenCompany: UnloadingBetweenCompany = new UnloadingBetweenCompany();
 public planificacionConsumo: listaPlanificacionConsumo[];
 public descargasParciales: listaDescargasParciales[];
 public objVentaParcialCross: objVentaParcialIntercompany  = new objVentaParcialIntercompany();
 public txtPrecioFinalVP: number;

 public nuevoIngresoFactura: IngresaFactura = new IngresaFactura();
 public ifd: number;
 public fob: number;
 public flete: number;
 public obtenerEstado:any;

 public locacionBarco: cargaCombo[]=[];
 public destinoBarco: cargaCombo[]=[];
 public premioCalidad_Base: string='0';
 public fleteMaritimo_Base: string='0';
 public washOut_Base: boolean=false;
 public pasarFacturadaVP: boolean=false;
 public interCompany: boolean=false;
 public flgGuardarContrato: boolean=false;
 public mtoTotal: number;
 public tickerPortafolio: string;
 public fechaString: string;
 public listaCierreVentasMolienda: ControlCierresVentasMolienda[];
 public listaPlanificacion: ConsumptionPlanning[] = [];
 public codigosConsultaHistorica: string;
 public comboSociedadesConsumoHumano: cargaCombo[];
//  public saldoBasesPadre: number;
//  public saldoFuturosPadre: number;

 public tmFijadasBases: number;
 public contratosFijadasFuturos: number;

 public ConsultaFactura: string| null;
 public ConsultaSociedad: string| null;
 public flgFechaConsultaHistorica: boolean = false;
 flgAgregarBarco: boolean = false;
 flgModificarTipoPrecio: boolean = true;
 txtNuevoBarco: string = "";
 flgGuardarCalendario: boolean = false;

 filtroCliente: string[] = []
 filtroProducto: string[] = []
 filtroDestino: string[] = []
 clientefiltrado: string[] 
 productofiltrado: string[] 
 destinofiltrado: string[] 

filterValue: filterValues;

 public objetoPasarFacturada: string[];
 public SociedadString: string;
 public filtro: string;
  date: Date = new Date();
  fechaModificar: Date = new Date();
  fechaInicioModificar: Date = new Date();
  fechaFinModificar: Date = new Date();
  fechaBarcoModificar: Date = new Date();

  flgBontonBarco: Boolean = true;
  flgBontonContrato: Boolean = true;
  flgBontongenerico: Boolean = true;

  public flgDeshacerCierre: boolean = false;
  usuarioRegistra: Boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginadoPortafolio!: MatPaginator;
  @ViewChild(MatSort) sortPortafolio!: MatSort;

  flgModal = false;
  flgIngresarContrato = false;
  flgLoading = false;
  flgLoadingCierres = false;

  tmContratoInicial: number;
  // basesInicial: number;


  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  private regex: RegExp = new RegExp(/^\d*\.?\d{0,6}$/g);
  numberOnly(event,max, campo): boolean {
    let value = event.target.value;
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return true;
    }
     let current: string = value;
      const position = event.target.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex)) {
       event.preventDefault();
      }
      if (value>max){
        event.target.value= 0;
        if(campo == 'TM'){
          this.nuevoContrato.t218_MetricTons = 0
        }else if(campo == 'Tolerancia'){
          this.nuevoContrato.t218_Tolerance = ''
        }
        return true;
      }
      return true;
  }


  displayedColumns: string[] = [
     's118_Parent'
    ,'s118_Producto'
    ,'s118_Codigo'
    ,'s118_Split'
    ,'s118_contrato_sociedad'
    ,'s118_contrato_externo'
    ,'s118_codigo_barco'
    ,'s118_nombre_barco'
    ,'s118_Comentario'
    ,'s118_Fecha'
    ,'s118_compra_venta'
    ,'s118_Cliente'
    ,'s118_Zona'
    ,'s118_SociedadNA'
    // ,'s118_Origen'
    ,'s118_Inicio'
    ,'s118_Fin'
    ,'s118_Contrato'
    ,'s118_puerto_origen'
    ,'s118_puerto_destino'
    ,'s118_Incoterm'
    ,'s118_TMTotal'
    ,'s118_tmpor_facturar'
    ,'s118_AvanceSAP'
    ,'s118_tipo_precio'
    ,'s118_Campania'
    ,'s118_precio_flat'
    // ,'s118_fecha_flat'
    ,'s118_fijado_flattm'
    ,'s118_saldo_flattm'
    // ,'s118_fijado_flat_caks'
    // ,'s118_saldo_flat_caks'
    ,'s118_precio_futuro'
    // ,'s118_fecha_futuro'
    // ,'s118_fijado_futurotm'
    // ,'s118_saldo_futurotm'
    ,'s118_fijado_futuro_caks'
    ,'s118_saldo_futuro_caks'
    ,'s118_precio_base'
    // ,'s118_fecha_base'
    ,'s118_fijado_basetm'
    ,'s118_saldo_basetm'
    // ,'s118_fijado_base_caks'
    // ,'s118_saldo_base_caks'
    ,'s118_Otros'
    ,'s118_Precio'
    ,'s118_PnLAsignado'
    ,'s118_FOB'
    ,'s118_Flete'
    ,'s118_CFR'];
  
    constructor(private portafolioMoliendaService: PortafolioMoliendaService, 
                private modalService: NgbModal,
                private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
                private bnIdle: BnNgIdleService,
                private tokenService: TokenService,
                private router: Router) {
      this.consumoHumano = new HumanConsumption();
  }
  ngOnInit(){
    this.portafolioMoliendaService.flgActualizar=true;
    this.getPortafolioMolienda(this.companiaSelected,this.productoSelected);
    this.getCompanias();
    this.date = new Date();
    this.date.setDate( this.date.getDate() + 7 );
    this.paginadoPortafolio._intl.itemsPerPageLabel="Registros por Página";
    this.paginadoPortafolio._intl.nextPageLabel ="Siguiente";
    this.paginadoPortafolio._intl.previousPageLabel ="Anterior";
    if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("FO_Fisico_RegistroOperacion") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_Controller") > -1){
      this.usuarioRegistra = true;
    }else{
      this.usuarioRegistra = false;
    }
    this.filterValue = new filterValues();

    // this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut) {
    //     this.tokenService.logOut();
    //     this.modalService.dismissAll();
    //      this.router.navigate(['/auth/login']);
    //      this.bnIdle.stopTimer();
    //   }
    // });

    this.getFormsValue();

    this.obtenerEstado = setInterval(()=> {
       // this.getPortafolioMolienda(this.companiaSelected,this.productoSelected) }, 3 * 1000);
       this.getEstado(this.companiaSelected,this.productoSelected),this.getPortafolioMolienda(this.companiaSelected,this.productoSelected) }, 3 * 1000);
  }
  
  ngOnDestroy() {
    clearInterval(this.obtenerEstado);
    // this.bnIdle.stopTimer();
  }

  fecha: NgbDateStruct;
  fechInicio: NgbDateStruct ;
  fechFin: NgbDateStruct ;
  fechaModal: NgbDateStruct ;
  fechaBarco: NgbDateStruct ;

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
  public getPortafolioMolienda(sociedad:number,producto:number): void {

    if(this.portafolioMoliendaService.flgActualizar==true){
      this.portafolio = [];
      this.portafolioDS = new MatTableDataSource(this.portafolio);
      if(!this.postCierre){
        this.portafolioMoliendaService.getPortafolioMolienda(sociedad,producto).subscribe(
          (response: PortafolioMolienda[]) => {
            this.portafolio = response;
            this.portafolioDS = new MatTableDataSource(this.portafolio);
            this.portafolioDS.paginator = this.paginadoPortafolio;
            this.portafolioDS.sort = this.sortPortafolio;
            // this.applyFilter();
            
            this.getFormsValue();
            
            this.filtroProducto = Array.from(new Set(this.portafolio.map(x => x["s118_Producto"])))
            this.filtroCliente = Array.from(new Set(this.portafolio.map(x => x.s118_Cliente)))
            this.filtroDestino = Array.from(new Set(this.portafolio.map(x => x.s118_puerto_destino)))

            

            // this.empFilters=[];

            // this.empFilters.push({name:'s118_Cliente',options:this.filtroCliente,defaultValue:this.defaultValue});
            // this.empFilters.push({name:'s118_puerto_destino',options:this.filtroDestino,defaultValue:this.defaultValue});
            // this.empFilters.push({name:'s118_Producto',options:this.filtroProducto,defaultValue:this.defaultValue});
            // this.flgLoading = false;

            // this.formSubscribe();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }else{
        this.getPortafolioMoliendaCierre(sociedad);
      }
      
      this.portafolioMoliendaService.flgActualizar=false;
    }
  }
  applyFilter() {
    const filterValue = this.filtro;
    // if(this.filtro !== undefined && this.filtro !== null){
      this.filterValue.s118_Codigo = this.filtro;
      this.portafolioDS.filter = JSON.stringify(this.filterValue);

      // this.filterDictionary.set(this.filtro);
      // this.portafolioDS.filter = filterValue.trim().toLowerCase();
    // }else{
    //   this.filterValue.s118_Codigo = undefined;
    //   this.portafolioDS.filter = JSON.stringify(this.filterValue);
    // }
    this.getFormsValue();
  }

  public getPortafolioMoliendaCierre(sociedad:number): void {
    this.portafolioMoliendaService.getPortafolioMoliendaCierre(sociedad).subscribe(
      (response: PortafolioMolienda[]) => {
        this.portafolio = response;
        this.portafolioDS = new MatTableDataSource(this.portafolio);
        this.portafolioDS.paginator = this.paginadoPortafolio;
        this.portafolioDS.sort = this.sortPortafolio;
        // this.applyFilter();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public getProductos(sociedad:number): void {
    this.portafolioMoliendaService.getproductos(sociedad,).subscribe(
      (response: Underlying[]) => {
        this.productos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public getCompanias(): void {
    this.portafolioMoliendaService.getCompanias().subscribe(
      (response: Companias[]) => {
        this.compania = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public getEstado(sociedad:number,producto:number): void{
    this.portafolioMoliendaService.getEstado(sociedad,producto).subscribe(
      (response: ClosingControl[]) => {
        this.estadoPortafolio = response;
        if(this.estadoPortafolio.length > 0) {
          this.portafolioMoliendaService.flgEstadoPortafolio = false;
        }else{
          this.portafolioMoliendaService.flgEstadoPortafolio = true;
        }
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  onSelectCompania(id:number):void{
    this.clientefiltrado = [];
    this.productofiltrado = [];
    this.destinofiltrado = [];

    if (typeof id !== 'undefined') {
        this.selectedProducto = [];
        this.selectedProductoModal=[];
        this.companiaSelected = id;
        this.productoSelectedModal=0;
        this.productoSelected=0;
      if(!this.postCierre){
        this.portafolioMoliendaService.flgActualizar=true;
        this.getPortafolioMolienda(id,this.productoSelected);
        this.getProductos(id);
        this.getEstado(id,this.productoSelected);
      }else{
        this.getPortafolioMoliendaCierre(this.companiaSelected)
      }
    }else{
      this.productos = []
      this.companiaSelected=0
    }
  }

  onSelectSubyacente(id:number):void{
    this.clientefiltrado = [];
    this.productofiltrado = [];
    this.destinofiltrado = [];

    if (typeof id !== 'undefined') {
      this.productoSelectedModal=id;
      this.productoSelected=id;
      this.portafolioMoliendaService.flgActualizar=true;
      this.getPortafolioMolienda(this.companiaSelected,id);
      this.getEstado(this.companiaSelected,id);
      this.selectedProductoModal=this.selectedProducto;
      this.portafolioMoliendaService.obtenerTickerXProducto(id.toString()).subscribe(
        (response: string[]) => {
          this.tickerPortafolio = response[0];
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      this.productoSelectedModal=0;
      this.productoSelected=0;
      this.selectedProductoModal=[]
    }
  }
  modalModificarContrato(modificarContrato:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para modificar contrato")){
      return;
    }

    this.flgGuardarCalendario = false;

    let fila = this.portafolio.filter(tabla => tabla.s118_Codigo == this.contextMenu.menuData.item);

    if(fila[0]['s118_tipo_precio'] == 'Flat'){
      if(fila[0]['s118_precio_flat'] == 0 && fila[0]['s118_fijado_flattm'] == 0 && (fila[0]['s118_fecha_flat'].toString() == '1900-01-01T05:08:36.000+00:00' || fila[0]['s118_fecha_flat'].toString() == '1900-01-01T00:00:00.000+00:00' || fila[0]['s118_fecha_flat'].toString() == '1900-01-01 00:00:00.0')){
        this.flgModificarTipoPrecio = true;
      }else{
        this.flgModificarTipoPrecio = false;
      }
    }else{
      if(fila[0]['s118_precio_futuro'] == 0 && fila[0]['s118_fijado_futurotm'] == 0 && fila[0]['s118_precio_base'] == 0 && fila[0]['s118_fijado_basetm'] == 0
              && (fila[0]['s118_fecha_base'].toString() == '1900-01-01T05:08:36.000+00:00' || fila[0]['s118_fecha_futuro'].toString() == '1900-01-01T05:08:36.000+00:00' || fila[0]['s118_fecha_base'].toString() == '1900-01-01 00:00:00.0'
              || fila[0]['s118_fecha_base'].toString() == '1900-01-01T00:00:00.000+00:00' || fila[0]['s118_fecha_futuro'].toString() == '1900-01-01T00:00:00.000+00:00' || fila[0]['s118_fecha_futuro'].toString() == '1900-01-01 00:00:00.0')){
        this.flgModificarTipoPrecio = true;
      }else{
        this.flgModificarTipoPrecio = false;
      }
    }

    this.contratosFijadasFuturos = fila[0]["s118_fijado_futuro_caks"]
    this.tmFijadasBases = fila[0]["s118_fijado_basetm"]

    this.flgIngresarContrato = false;
    this.flgBontonContrato = true
    this.validarPortafolioCerrado();

    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        this.nuevoFisico = new Physical();
        this.nuevoNutricionAnimal = new AnimalNutrition();
        this.consumoHumano = new HumanConsumption();
        this.caksInt=Number(this.nuevoContrato.t218_VolumeContract);

        this.tmContratoInicial=this.nuevoContrato.t218_MetricTons;


        this.getProductosMolienda();
        this.getCombosContrato(this.productoSelectedModal);

        this.nuevoContrato.t218_Date=this.nuevoContrato.t218_Date.toString().substring(0,4) +'-'+ this.nuevoContrato.t218_Date.toString().substring(4,6) +'-'+ this.nuevoContrato.t218_Date.toString().substring(6,8);
        this.nuevoContrato.t218_StartDate=this.nuevoContrato.t218_StartDate.toString().substring(0,4) +'-'+ this.nuevoContrato.t218_StartDate.toString().substring(4,6) +'-'+ this.nuevoContrato.t218_StartDate.toString().substring(6,8);
        this.nuevoContrato.t218_EndDate=this.nuevoContrato.t218_EndDate.toString().substring(0,4) +'-'+ this.nuevoContrato.t218_EndDate.toString().substring(4,6) +'-'+ this.nuevoContrato.t218_EndDate.toString().substring(6,8);

        this.fechaModificar = new Date(this.nuevoContrato.t218_Date);
        this.fechaInicioModificar = new Date(this.nuevoContrato.t218_StartDate);
        this.fechaFinModificar = new Date(this.nuevoContrato.t218_EndDate);

        this.nuevoContrato.t218_Tolerance = (Number(this.nuevoContrato.t218_Tolerance) * 100).toString();

        this.fechaModificar.setDate( this.fechaModificar.getDate() + 1 );
        this.fechaInicioModificar.setDate( this.fechaInicioModificar.getDate() + 1 );
        this.fechaFinModificar.setDate( this.fechaFinModificar.getDate() + 1 );

        this.nuevoContrato.t218_Market = this.nuevoContrato.t218_Market.toString();
        this.nuevoContrato.t218_SellBuy = this.nuevoContrato.t218_SellBuy.toString();
        this.nuevoContrato.t218_Campaign = this.nuevoContrato.t218_Campaign.toString();
        this.nuevoContrato.t218_Incoterm = this.nuevoContrato.t218_Incoterm.toString();
        this.nuevoContrato.t218_GrindingCustomer = this.nuevoContrato.t218_GrindingCustomer.toString();

        if(this.nuevoContrato.t218_IDZona !== null){
          this.nuevoContrato.t218_IDZona = this.nuevoContrato.t218_IDZona.toString();
        }
        this.nuevoContrato.t218_PortFrom = this.nuevoContrato.t218_PortFrom.toString();
        this.nuevoContrato.t218_PortUp = this.nuevoContrato.t218_PortUp.toString();
        this.nuevoContrato.t218_PriceType = this.nuevoContrato.t218_PriceType.toString();
        this.nuevoContrato.t218_GrindingProduct = this.nuevoContrato.t218_GrindingProduct.toString();
        this.nuevoContrato.t218_Shipment = this.nuevoContrato.t218_Shipment.toString();
        this.nuevoContrato.t218_Contract = this.nuevoContrato.t218_Contract.toString();

        this.fecha = {day: this.fechaModificar.getDate(),month: this.fechaModificar.getMonth() + 1,year: this.fechaModificar.getFullYear()};
        this.fechInicio = {day: this.fechaInicioModificar.getDate(),month: this.fechaInicioModificar.getMonth() + 1,year: this.fechaInicioModificar.getFullYear()};
        this.fechFin = {day: this.fechaFinModificar.getDate(),month: this.fechaFinModificar.getMonth() + 1,year: this.fechaFinModificar.getFullYear()};

        this.portafolioMoliendaService.buscarPlanificacion(Number(this.nuevoContrato.t218_ID)).subscribe(
          (response: ConsumptionPlanning[]) => {

            let cont = 0;
            for (let item of response){
              this.planificacionConsumo[cont] = new listaPlanificacionConsumo();
              this.planificacionConsumo[cont].s176_TM = item.t337_Value.toString();
              this.planificacionConsumo[cont].s176_CodigoMes = item.t337_MonthContract.toString();
              cont+=1;
            }
            
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });

        this.portafolioMoliendaService.obtenerPriceMonth(this.contextMenu.menuData.item).subscribe(
          (response: PriceMonth) => {
             this.priceMonth = response;
             this.bolsaSelectedModal = this.priceMonth.t050_Exchange.toString();
             this.getContratosModificar(Number(this.bolsaSelectedModal));

             if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
              if(this.estadoPortafolio.length > 0) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: 'No se puede modificar contrato intercompany con el portafolio cerrado',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
                return;
              }

              this.portafolioMoliendaService.IntercompanyCerrado(this.nuevoContrato.t218_ID).subscribe(
                (response: string) => {
                  if(Number(response) > 0){
                    Swal.fire({
                      icon: 'warning',
                      title: 'Aviso',
                      text: 'El portafolio intercompany se encuentra cerrado',
                      confirmButtonColor: '#0162e8',
                      customClass: {
                        container: 'my-swal'
                      }
                    })
                  }else{

                    this.interCompany=true;

                    this.portafolioMoliendaService.obtenerFisico(this.nuevoContrato.t218_ID).subscribe(
                      (response: Physical) => {
                        this.nuevoFisico = response;

                        this.fechaString = this.nuevoFisico.t039_ArrivalDate.toString().substring(0,4) +'-'+ this.nuevoFisico.t039_ArrivalDate.toString().substring(4,6) +'-'+ this.nuevoFisico.t039_ArrivalDate.toString().substring(6,8);

                        this.fechaBarcoModificar = new Date(this.fechaString);

                        this.fechaBarcoModificar.setDate( this.fechaBarcoModificar.getDate() + 1 );

                        this.fechaBarco = {day: this.fechaBarcoModificar.getDate(),month: this.fechaBarcoModificar.getMonth() + 1,year: this.fechaBarcoModificar.getFullYear()};

                      },
                      (error: HttpErrorResponse) => {
                        alert(error.message);
                      });

                    this.portafolioMoliendaService.obtenerNutricionAnimal_CH(this.nuevoContrato.t218_ID).subscribe(
                      (response: objAnimalNutrition_ConsumoH) => {
                          this.nuevoNutricionAnimal = response.nutricionAnimal;
                          this.consumoHumano = response.consumoHumano;
                      },
                      (error: HttpErrorResponse) => {
                          alert(error.message);
                      });
                      this.modalService.open(modificarContrato,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
                  }
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
             }else{
              this.modalService.open(modificarContrato,{ centered: true,size: 'lg' ,backdrop : 'static',keyboard : false});
              this.interCompany=false;
             }

          // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
          //   (response: string) => {
          //     if(response.length > 0){ //INTERCOMPANY                
          //     }else{
          //     }
          //   },
          //   (error: HttpErrorResponse) => {
          //     alert(error.message);
          //   });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });


      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });



  }
  modalIngresarFlat(IngresarFlatForm:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar flat")){
      return;
    }
    
    this.flgBontongenerico = true;
    // this.validarPortafolioCerrado();

    this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.nuevoContrato = new SalesContract();
    this.nuevoFlat = new FlatForSale();
    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
          if(!this.portafolioMoliendaService.flgEstadoPortafolio) {
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'El Portafolio se encuentra Cerrado.',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
            this.modalService.dismissAll();
            return;
          }
          this.portafolioMoliendaService.IntercompanyCerrado(this.nuevoContrato.t218_ID).subscribe(
            (response: string) => {
              if(Number(response) > 0){
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: 'El portafolio intercompany se encuentra cerrado',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
                this.modalService.dismissAll();
                return;
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.validarPortafolioCerrado();
        }

        this.nuevoContrato.t218_VolumeContract = Math.round(Number(this.nuevoContrato.t218_VolumeContract)).toString();
        if(this.nuevoContrato.t218_PriceType == '1'){
          this.portafolioMoliendaService.obtenerNuevoID("T230_FlatForSale","T230_ID").subscribe(
            (response: string[]) => {
              this.nuevoFlat.t230_ID = Number(response[0]);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
          this.fechaModal = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
          this.modalService.open(IngresarFlatForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'El tipo de precio debe de ser Flat',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  GuardarFlat(modalFlat:any, flat: FlatForSale){
    this.flgBontongenerico = false;
    if(typeof flat.t230_FlatUSD !== 'undefined' && flat.t230_FlatUSD != null && Number(flat.t230_FlatUSD) > 0 &&
    typeof this.nuevoContrato.t218_VolumeContract !== 'undefined' && this.nuevoContrato.t218_VolumeContract != null  ) { //&& Number(this.nuevoContrato.t218_VolumeContract) > 0
      this.portafolioMoliendaService.precioContratoVenta(parseInt(this.nuevoContrato.t218_ID),9).subscribe(
        (response: string[]) => {
          if(Number(response[0]) >= this.nuevoContrato.t218_MetricTons){
            flat.t230_SellBuy = 1;
            flat.t230_SalesContract = Number(this.nuevoContrato.t218_ID);
            flat.t230_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
            flat.t230_MetricTons = this.nuevoContrato.t218_MetricTons.toString();
            flat.t230_VolumeContract = this.nuevoContrato.t218_VolumeContract.toString();
            flat.t230_Status = 1;
            flat.t230_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
            flat.t230_Date = Number(this.dateToString(this.fecha));
            this.portafolioMoliendaService.crearFlat(flat).subscribe(
              data=>{
                if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
                  this.portafolioMoliendaService.actualizarFlatPriceFisico(Number(this.nuevoContrato.t218_ID)).subscribe(
                    data=>{
                    },
                    (error: HttpErrorResponse) => {
                        alert(error.message);
                    });
                }
                // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
                //   (response: string) => {
                //     if(response.length > 0){
                //     }
                //     },
                //     (error: HttpErrorResponse) => {
                //       alert(error.message);
                //   });
                this.portafolioMoliendaService.flgActualizar=true;
                Swal.fire({
                  icon: 'success',
                  title: 'Flat Agregado',
                  text: 'Se agregó el flat ' + flat.t230_ID.toString() + ' con exito!',
                  confirmButtonColor: '#0162e8'
                });
                  this.flgBontongenerico = true;
                  this.modalService.dismissAll(modalFlat);
              },
              (error: HttpErrorResponse) => {
                if(error.error.message.includes('ConstraintViolationException')){
                  this.flgBontongenerico = true;
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
          }else{
            this.flgBontongenerico = true;
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'El saldo Flat Excede al del Contrato de Venta',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            });
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      this.flgBontongenerico = true;
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario completar los campos correctamente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    }
  }
  GuardarFuturo(modalFuturo:any, futuro: PriceForSale){
    this.flgBontongenerico = false;
    if( futuro.t227_FutureUSD != null && futuro.t227_FutureUSD != ''
       && this.nuevoContrato.t218_VolumeContract != null && this.nuevoContrato.t218_VolumeContract != '' && futuro.t227_SellBuy != null && futuro.t227_SellBuy != ''){
        this.portafolioMoliendaService.SaldoFuturo(Number(this.nuevoContrato.t218_ID)).subscribe(
          (response: string[]) => {
            if(Number(response[0].split(",")[0]) == 0 && Number(response[0].split(",")[1]) < Number(this.nuevoContrato.t218_VolumeContract) && futuro.t227_SellBuy.toString() == '1'){
              this.flgBontongenerico = true;
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'El saldo Futuro excede al del Contrato de Venta',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }});
                return
            }else{
              futuro.t227_SalesContract = this.nuevoContrato.t218_ID
              futuro.t227_RegisteredBy =this.portafolioMoliendaIFDService.usuario
              futuro.t227_ModifiedBy =this.portafolioMoliendaIFDService.usuario
              futuro.t227_Status = '1'
              futuro.t227_Date = this.dateToString(this.fechaModal);
              futuro.t227_MetricTons = this.nuevoContrato.t218_MetricTons.toString()
              futuro.t227_VolumeContract = this.nuevoContrato.t218_VolumeContract

              this.AgregarFuturo(modalFuturo , futuro);
            }
          },
            (error: HttpErrorResponse) => {
              alert(error.message);
          });

       }else{
        this.flgBontongenerico = true
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Por favor ingresar los datos',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }});
       }

  }

  AgregarFuturo(modalFuturo:any,futuro: PriceForSale){
    this.portafolioMoliendaService.guardarFuturo(futuro).subscribe(
      data=>{
        this.portafolioMoliendaService.flgActualizar=true
        Swal.fire({
          icon: 'success',
          title: 'Futuro Agregado',
          text: 'Se agregó el futuro ' + futuro.t227_ID.toString() + ' con exito!',
          confirmButtonColor: '#0162e8'
        });
          this.modalService.dismissAll(modalFuturo);
          this.flgBontongenerico = true
      },
      (error: HttpErrorResponse) => {
        if(error.error.message.includes('ConstraintViolationException')){
          this.flgBontongenerico = true;
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
  
  calcularMontoTotal(){
    if(this.nuevaBase.t228_SellBuy == 1 ){
      this.portafolioMoliendaService.precioContratoVenta(parseInt(this.nuevoContrato.t218_ID),8).subscribe(
        (response: string[]) => {
          this.mtoTotal = Math.round(Number(response[0]))
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      this.portafolioMoliendaService.precioContratoVenta(parseInt(this.nuevoContrato.t218_ID),5).subscribe(
        (response: string[]) => {
          this.mtoTotal = Math.round(Number(response[0]))
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }
  GuardarBase(modalBase:any, base: BaseForSale){
    this.flgBontongenerico = false;
    if(base.t228_SellBuy != null && typeof base.t228_SellBuy != 'number' && base.t228_BaseUSD != null && base.t228_BaseUSD != ''
       && this.nuevoContrato.t218_VolumeContract != null && this.nuevoContrato.t218_VolumeContract != ''){

      base.t228_SalesContract = Number(this.nuevoContrato.t218_ID)
      base.t228_RegisteredBy = this.portafolioMoliendaIFDService.usuario
      base.t228_MetricTons = this.nuevoContrato.t218_MetricTons.toString()
      base.t228_VolumeContract = this.nuevoContrato.t218_VolumeContract
      base.t228_Status = '1'
      base.t228_ModifiedBy = this.portafolioMoliendaIFDService.usuario
      base.t228_Date = this.dateToString(this.fechaModal);
    if(base.t228_SellBuy == 1 ){
          if(this.mtoTotal < Number(base.t228_MetricTons)){
            this.flgBontongenerico = true
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'La Base comprada excede al contrato de venta',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }});
              return;
          }
    // }else{
    //       if( this.mtoTotal < Number(base.t228_MetricTons)){
    //         Swal.fire({
    //           icon: 'warning',
    //           title: 'Aviso',
    //           text: 'La Base vendida excede a las Bases compradas',
    //           confirmButtonColor: '#0162e8',
    //           customClass: {
    //             container: 'my-swal'
    //           }});
    //           this.flgBontongenerico = true
    //           return;
    //       }
    }
      this.portafolioMoliendaService.guardarBaseForSale(base).subscribe(
        data=>{
          this.baseProfitAndLoss.t340_BaseForSale=data.t228_ID

          if(base.t228_SellBuy == 2 ){
            this.baseProfitAndLoss.t340_Price=base.t228_BaseUSD
            this.portafolioMoliendaService.guardarBaseProfitAndLoss(this.baseProfitAndLoss).subscribe(
              data=>{
                if(this.washOut_Base == true){
                  this.portafolioMoliendaService.CalculoWashOut(base.t228_SalesContract,this.portafolioMoliendaIFDService.usuario).subscribe(
                    data=>{
                    },
                    (error: HttpErrorResponse) => {
                        alert(error.message);
                    });
                }
              },
              (error: HttpErrorResponse) => {
                  alert(error.message);
              });
          }else{
            if(this.washOut_Base == true){
              this.portafolioMoliendaService.CalculoWashOut(base.t228_SalesContract,this.portafolioMoliendaIFDService.usuario).subscribe(
                data=>{
                },
                (error: HttpErrorResponse) => {
                    alert(error.message);
                });
            }
          }

          if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
            this.BaseCross = new guardarBaseCross;
                this.portafolioMoliendaService.obtenerNuevoID("T095_ClosingBasis","T095_ID").subscribe(
                  (response: string[]) => {
                    this.closingBasis.t095_ID = Number(response[0]);
                    //Se guarda ClosingBasis y ClosingPriceBetweenCompany
                    this.portafolioMoliendaService.obtenerBarco(Number(this.nuevoContrato.t218_ID)).subscribe(
                      (response: string[]) => {
                        this.closingBasis.t095_Physical = response[0];
                        this.closingBasis.t095_Contract = this.nuevoContrato.t218_Contract;
                        this.BaseCross.closingBasis = this.closingBasis
                        this.closingBasisBetweenCompany.t240_BaseForSale = base.t228_ID
                        this.BaseCross.closingBasisBetweenCompany = this.closingBasisBetweenCompany
                        this.BaseCross.comentario = this.nuevaBase.t228_Comment
                        this.portafolioMoliendaService.crearBasesCross(this.BaseCross).subscribe(
                          data=>{
                          },
                          (error: HttpErrorResponse) => {
                            if(error.error.message.includes('ConstraintViolationException')){
                              this.flgBontongenerico = true;
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
                      },
                      (error: HttpErrorResponse) => {
                          alert(error.message);
                      });
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
          }
          // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
          //   (response: string) => {
          //     if(response.length > 0){ //INTERCOMPANY
                
          //     }
          //   },
          //   (error: HttpErrorResponse) => {
          //     alert(error.message);
          //   });
          this.portafolioMoliendaService.flgActualizar=true
          Swal.fire({
            icon: 'success',
            title: 'Base Agregada',
            text: 'Se agregó la base ' + base.t228_ID.toString() + ' con exito!',
            confirmButtonColor: '#0162e8'
          });
            this.flgBontongenerico = true
            this.modalService.dismissAll(modalBase);
        },
        (error: HttpErrorResponse) => {
          if(error.error.message.includes('ConstraintViolationException')){
            this.flgBontongenerico = true;
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

    }else{
      this.flgBontongenerico = true
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Por favor ingresar los datos',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }});
    }

  }

  modalIngresarFuturo(IngresarFuturotForm:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar futuro")){
      return;
    }
    this.flgBontongenerico = true;
    // this.validarPortafolioCerrado();
    this.nuevoContrato = new SalesContract();
    this.nuevoFuturo  = new PriceForSale();
    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        
        if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
          if(!this.portafolioMoliendaService.flgEstadoPortafolio) {
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'El Portafolio se encuentra Cerrado.',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
            this.modalService.dismissAll();
            return;
          }
          this.portafolioMoliendaService.IntercompanyCerrado(this.nuevoContrato.t218_ID).subscribe(
            (response: string) => {
              if(Number(response) > 0){
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: 'El portafolio intercompany se encuentra cerrado',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
                this.modalService.dismissAll();
                return;
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.validarPortafolioCerrado();
        }

        this.nuevoContrato.t218_VolumeContract = Math.round(Number(this.nuevoContrato.t218_VolumeContract)).toString();
        if(this.nuevoContrato.t218_PriceType != '1'){
          this.portafolioMoliendaService.obtenerNuevoID("T227_PriceForSale","T227_ID").subscribe(
            (response: string[]) => {
              this.calcularCaksXContratos();
              this.nuevoFuturo.t227_ID = Number(response[0]);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
          this.portafolioMoliendaService.getComboXTabla('T008_SellBuy').subscribe(
            (response: cargaCombo[]) => {
              this.compraventa = response;
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });

          this.fechaModal = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
          this.modalService.open(IngresarFuturotForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'El tipo de precio no debe de ser Flat',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }
  modalpactarBase(calendarioForm:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar base")){
      return;
    }
    this.flgBontongenerico = true;
    // this.validarPortafolioCerrado();
    this.washOut_Base = false;

    this.closingBasis = new ClosingBasis();
    this.closingBasisBetweenCompany = new ClosingBasisBetweenCompany();
    this.BaseCross= new guardarBaseCross();
    this.baseProfitAndLoss= new BaseProfitAndLoss();
    this.nuevoContrato = new SalesContract();
    this.nuevaBase = new BaseForSale();
    this.fechaModal = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        this.nuevoContrato.t218_MetricTons = Math.round(this.nuevoContrato.t218_MetricTons);

        if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
          if(!this.portafolioMoliendaService.flgEstadoPortafolio) {
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'El Portafolio se encuentra Cerrado.',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
            this.modalService.dismissAll();
            return;
          }
          this.portafolioMoliendaService.IntercompanyCerrado(this.nuevoContrato.t218_ID).subscribe(
            (response: string) => {
              if(Number(response) > 0){
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: 'El portafolio intercompany se encuentra cerrado',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
                this.modalService.dismissAll();
                return;
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.validarPortafolioCerrado();
        }
        this.nuevoContrato.t218_VolumeContract = Math.round(Number(this.nuevoContrato.t218_VolumeContract)).toString();
        if(this.nuevoContrato.t218_PriceType != '1'){
          this.portafolioMoliendaService.precioContratoVenta(parseInt(this.nuevoContrato.t218_ID),2).subscribe(
            (response: string[]) => {
              this.baseProfitAndLoss.t340_Cost = response[0];
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
          this.portafolioMoliendaService.precioOtrosXConcepto(parseInt(this.nuevoContrato.t218_ID),15,2).subscribe(
            (response: string[]) => {
              this.premioCalidad_Base = response[0];
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
          this.portafolioMoliendaService.precioOtrosXConcepto(parseInt(this.nuevoContrato.t218_ID),8,2).subscribe(
            (response: string[]) => {
              this.fleteMaritimo_Base = response[0];
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
            this.portafolioMoliendaService.obtenerNuevoID("T228_BaseForSale","T228_ID").subscribe(
              (response: string[]) => {
                this.nuevaBase.t228_ID = Number(response[0]);
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
            this.portafolioMoliendaService.getComboXTabla('T008_SellBuy').subscribe(
              (response: cargaCombo[]) => {
                this.compraventa = response;
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
            this.fechaModal = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
            this.modalService.open(calendarioForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'El tipo de precio no debe de ser Flat',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  modalMostrarCalendario(calendarioForm:any){
    if(this.nuevoContrato.t218_MetricTons != 0 && typeof this.nuevoContrato.t218_MetricTons == 'number'){
      if(!this.flgGuardarCalendario){
        this.portafolioMoliendaService.listaPlanificacionConsumo(this.nuevoContrato.t218_ID.toString(),this.dateToString(this.fechInicio),this.dateToString(this.fechFin),this.nuevoContrato.t218_MetricTons.toString()).subscribe(
          (response: listaPlanificacionConsumo[]) => {
            this.planificacionConsumo = response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }

      this.modalService.open(calendarioForm,{ centered: true,size: 'sm',backdrop : 'static',keyboard : false });
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar toneladas metricas',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }
  }

  modalIngresoContrato(userForm:any){
    
    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar contrato")){
      return;
    }
  this.flgBontonContrato = true;
    this.flgGuardarCalendario = false;
    this.flgModificarTipoPrecio = true;
    this.txtNuevoBarco = "";
    this.planificacionConsumo = [];
    //RESETEO DE EL MODELO
    this.flgIngresarContrato = true;

    if(this.companiaSelected==0){
      Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Es necesario seleccionar una Sociedad',
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
  }else{

    this.validarPortafolioCerrado();

    this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.fechInicio = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.fechFin = {day: this.date.getDate(),month: this.date.getMonth() + 1,year: this.date.getFullYear()};

    this.nuevoContrato = new SalesContract();
    this.nuevoFisico = new Physical();
    this.nuevoNutricionAnimal = new AnimalNutrition();
    this.consumoHumano = new HumanConsumption();
    this.selectedProductoModal=this.selectedProducto
    this.getProductosMolienda();

    this.productoSelectedModal=this.productoSelectedModal
    this.nuevoContrato= new SalesContract();
    this.nuevoContrato.t218_Shipment = "699";
    this.nuevoContrato.t218_Market = "1";
    this.nuevoContrato.t218_MetricTons=0;
    this.nuevoContrato.t218_VolumeContract='';
    this.nuevoContrato.t218_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    this.caksInt=0;
    this.nuevoContrato.t218_Contract  = "";
    this.bolsaSelectedModal  = "";

    if(this.companiaSelected == 15){
      this.nuevoContrato.t218_Market = "3";
      this.nuevoContrato.t218_SellBuy = "2";
      this.nuevoContrato.t218_Tolerance = "10";//0.1
      this.nuevoContrato.t218_Incoterm = "5";
    }else{
      this.nuevoContrato.t218_IDZona = "6"
    }

    this.nuevoContrato.t218_Country = "BO";
    
    // this.obtenerContrato(1);
    this.obtenerContrato(Number(this.nuevoContrato.t218_Market));
    this.portafolioMoliendaService.getNuevoCodigo().subscribe(
      (response: string) => {
        this.nuevoContrato.t218_ID = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.getCombosContrato(this.productoSelectedModal);
    this.modalService.open(userForm,{ centered: true,size: 'lg', backdrop : 'static',keyboard : false});
    // clearInterval()
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

  listarFlats(detalleForm:any) {
    this.flgModal=true;

    this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
    this.portafolioMoliendaService.producto=this.productoSelected.toString();
    this.portafolioMoliendaService.compania=this.companiaSelected.toString();
    if(this.estadoPortafolio.length > 0){
      this.portafolioMoliendaService.flgEstadoPortafolio = false;
    }else{
      this.portafolioMoliendaService.flgEstadoPortafolio = true;
    }
    
    this.portafolioMoliendaService.tipo="FLAT";
    this.codigoSeleccionado = this.contextMenu.menuData.item;
    // this.modalService.open(detalleForm,{ centered: true,size: 'lg' });

    this.modalService.open(detalleForm,{windowClass : "my-class",centered: true});
    //  clearInterval()
  }

  listarFuturos(detalleForm:any) {
    
    this.flgModal=true;
    this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
    this.portafolioMoliendaService.producto=this.productoSelected.toString();
    this.portafolioMoliendaService.compania=this.companiaSelected.toString();
    if(this.estadoPortafolio.length > 0){
      this.portafolioMoliendaService.flgEstadoPortafolio = false;
    }else{
      this.portafolioMoliendaService.flgEstadoPortafolio = true;
    }
    this.portafolioMoliendaService.tipo="FUTURO";
    this.codigoSeleccionado = this.contextMenu.menuData.item;
    // this.modalService.open(detalleForm,{ centered: true,size: 'lg' });

    this.modalService.open(detalleForm,{windowClass : "my-class",centered: true});
    // clearInterval()
  }

  listarHijos(detalleForm:any, codigo: string) {
    this.flgModal=true;
    this.portafolioMoliendaService.codigoContrato=codigo;
    this.portafolioMoliendaService.tipo="HIJOS";
    this.codigoSeleccionado = codigo;

    let fila = this.portafolio.filter(tabla => tabla.s118_Codigo == Number(codigo));

    if(fila[0]["s118_codigo_barco"] != 0){
      this.portafolioMoliendaService.flgIntercompany = true;
    }else{
      this.portafolioMoliendaService.flgIntercompany = false;
    }
    
    this.modalService.open(detalleForm,{windowClass : "my-class",centered: true});
    // clearInterval()
  }

  listarBases(detalleForm:any) {
    this.flgModal=true;
    this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
    this.portafolioMoliendaService.producto=this.productoSelected.toString();
    this.portafolioMoliendaService.compania=this.companiaSelected.toString();
    if(this.estadoPortafolio.length > 0){
      this.portafolioMoliendaService.flgEstadoPortafolio = false;
    }else{
      this.portafolioMoliendaService.flgEstadoPortafolio = true;
    }
    this.portafolioMoliendaService.tipo="BASES";

    this.codigoSeleccionado = this.contextMenu.menuData.item;
    // this.modalService.open(detalleForm,{ centered: true,size: 'lg' });
    this.modalService.open(detalleForm,{windowClass : "my-class",centered: true});
    // clearInterval()
  }
  listarFormacionPrecios(detalleForm:any) {

    this.flgModal = true;

    this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
    this.portafolioMoliendaService.producto=this.productoSelected.toString();
    this.portafolioMoliendaService.compania=this.companiaSelected.toString();
    this.portafolioMoliendaService.tipo="FORMACIONPRECIOS";
    this.codigoSeleccionado = this.contextMenu.menuData.item;
    // this.modalService.open(detalleForm,{ centered: true,size: 'lg' });

    this.modalService.open(detalleForm,{windowClass : "my-class",centered: true});
    //  clearInterval()
  }
  cerrarFacturaRT(){
    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        this.validarPortafolioCerrado();

        this.portafolioMoliendaService.cerrarContrato_RT(this.contextMenu.menuData.item).subscribe(
          (response: number) => {
            Swal.fire({
              title: 'Cerrar Factura',
              html: 'Se pasó a facturado el contrato <b>' + response + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
            this.portafolioMoliendaService.flgActualizar=true
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }
  mostratGrupoRT(detalleForm:any) {
    this.flgModal = true;
    this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
    this.portafolioMoliendaService.producto=this.productoSelected.toString();
    this.portafolioMoliendaService.compania=this.companiaSelected.toString();
    this.portafolioMoliendaService.tipo="mostrarGrupoRT";
    this.codigoSeleccionado = this.contextMenu.menuData.item;
    this.modalService.open(detalleForm,{windowClass : "my-class",centered: true});
    //  clearInterval()
  }
  mostratAvanceSAP(detalleForm:any) {
    this.flgModal = true;
    this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
    this.portafolioMoliendaService.producto=this.productoSelected.toString();
    this.portafolioMoliendaService.compania=this.companiaSelected.toString();
    this.portafolioMoliendaService.tipo="mostratAvanceSAP";
    this.codigoSeleccionado = this.contextMenu.menuData.item;
    this.modalService.open(detalleForm,{windowClass : "my-class",centered: true});
    //  clearInterval()
  }

  onContextMenuAction() {
     alert(`Click on Action for ${this.contextMenu.menuData.item}`);//Aquí
  }

  ModaldividirContrato(){
    if(!this.validarpermisos("Usted no cuenta con permisos para dividir contrato")){
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

    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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

          this.portafolioMoliendaService.IntercompanyCerrado(this.nuevoContrato.t218_ID).subscribe(
            (response: string) => {
              if(Number(response) > 0){
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: 'El portafolio intercompany se encuentra cerrado',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
                return;
              }else{
                this.dividirContrato();
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.dividirContrato();
        }
        // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
        //   (response: string) => {
        //     if(response.length > 0){ //INTERCOMPANY
        //     }else{
        //     }
        //   },
        //   (error: HttpErrorResponse) => {
        //     alert(error.message);
        //   });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  dividirContrato(){

    var tm: string;

    Swal.fire({
      icon: 'question',
      title: 'División de Contrato',
      html: 'El contrato <b>' + this.nuevoContrato.t218_ID.toString() + '</b> contiene <b>' + this.nuevoContrato.t218_MetricTons.toString() + ' TM</b>, ¿cuantas TM tendrá el nuevo contrato?',
      input: 'text',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4b822d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        tm = result.value;
        if(this.nuevoContrato.t218_MetricTons < result.value){
          Swal.fire({
            icon: 'error',
            title: 'División de Contrato',
            text: 'Las TM ingresadas superan al contrato seleccionado.',
            timer: 2000,
            showCancelButton: false,
            showConfirmButton: false
          })
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'División de Contrato',
            html: '¿Seguro que desea dividir el contrato <b>' + this.nuevoContrato.t218_ID.toString() + '</b>?',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            reverseButtons: true,
            confirmButtonColor: '#4b822d'
          }).then((result) => {
            if (result.isConfirmed) {
              this.portafolioMoliendaService.realizarSplit(this.nuevoContrato.t218_ID,tm).subscribe(
                (response: string) => {
                  this.portafolioMoliendaService.flgActualizar=true
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

  ModalduplicarContrato(){
    if(!this.validarpermisos("Usted no cuenta con permisos para duplicar contrato")){
      return;
    }

    this.validarPortafolioCerrado();

    setTimeout(() => {
      console.log("1 Segundo esperado")
    }, 5000);

    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
          if(this.estadoPortafolio.length > 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Aviso Intercompany',
              text: 'El Portafolio se encuentra Cerrado.',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }
            })
            return;
          }

          this.portafolioMoliendaService.IntercompanyCerrado(this.nuevoContrato.t218_ID).subscribe(
            (response: string) => {
              if(Number(response) > 0){
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso Intercompany',
                  text: 'El portafolio intercompany se encuentra cerrado',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
                return;
              }else{
                this.duplicarContrato();
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.duplicarContrato();
        }
        // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
        //   (response: string) => {
        //     if(response.length > 0){ //INTERCOMPANY
        //     }else{
              
        //     }
        //   },
        //   (error: HttpErrorResponse) => {
        //     alert(error.message);
        //   });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  duplicarContrato(){

    Swal.fire({
      icon: 'question',
      title: 'Duplicación de Contrato',
      html: '¿Esta seguro que desea duplicar el contrato <b>' + this.nuevoContrato.t218_ID.toString() + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.realizarDuplicado(this.nuevoContrato.t218_ID,this.portafolioMoliendaIFDService.usuario).subscribe(
          (response: string) => {
            this.portafolioMoliendaService.flgActualizar=true
            Swal.fire({
              title: 'Duplicación de Contrato!',
              html: 'Se realizó la duplicación de contrato. Nuevo contrato <b>' + response + '</b>',
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

  ModalcancelarContrato(){
    if(!this.validarpermisos("Usted no cuenta con permisos para cancelar contrato")){
      return;
    }

    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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

          this.portafolioMoliendaService.IntercompanyCerrado(this.nuevoContrato.t218_ID).subscribe(
            (response: string) => {
              if(Number(response) > 0){
                Swal.fire({
                  icon: 'warning',
                  title: 'Aviso',
                  text: 'El portafolio intercompany se encuentra cerrado',
                  confirmButtonColor: '#0162e8',
                  customClass: {
                    container: 'my-swal'
                  }
                })
                return;
              }else{
                this.cancelarContrato(true);
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.validarPortafolioCerrado();
          this.cancelarContrato(false);
        }
        // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
        //   (response: string) => {
        //     if(response.length > 0){ //INTERCOMPANY
        //     }else{
        //     }
        //   },
        //   (error: HttpErrorResponse) => {
        //     alert(error.message);
        //   });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cancelarContrato(intercompany: boolean){
    this.portafolioMoliendaService.cantidadFacturasDespachadas(this.nuevoContrato.t218_ID).subscribe(
      (response: number) => {
        if(response > 0){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Existen Facturas Despachadas en Dosdificadas con este Contrato',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }

        Swal.fire({
          icon: 'question',
          title: 'Cancelación de Contrato',
          html: '¿Desea cancelar el Contrato Venta <b>' + this.nuevoContrato.t218_ID.toString() + '</b>?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
        }).then((result) => {
          if (result.isConfirmed) {
            let fila = this.portafolio.filter(tabla => tabla.s118_Codigo == this.contextMenu.menuData.item);

            if(fila[0]['s118_tipo_precio'] == 'Flat'){
              if(fila[0]['s118_precio_flat'] == 0 && fila[0]['s118_fijado_flattm'] == 0 && (fila[0]['s118_fecha_flat'].toString() == '1900-01-01T05:08:36.000+00:00' || fila[0]['s118_fecha_flat'].toString() == '1900-01-01T00:00:00.000+00:00' || fila[0]['s118_fecha_flat'].toString() == '1900-01-01 00:00:00.0')){
                
                this.portafolioMoliendaService.cancelarContrato(Number(this.nuevoContrato.t218_ID),intercompany,this.portafolioMoliendaIFDService.usuario).subscribe(
                  (response: boolean) => {
                    this.portafolioMoliendaService.flgActualizar=true
                    Swal.fire({
                      title: 'Cancelación de Contrato!',
                      html: 'Se realizó la cancelación de contrato <b>' + this.nuevoContrato.t218_ID.toString() + '</b>',
                      icon: 'success',
                      confirmButtonColor: '#4b822d'
                    })
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
              }else{
                Swal.fire({
                  icon: 'question',
                  title: 'Cancelación de Contrato',
                  html: 'El contrato tiene Flats Asignados ¿Está seguro que desea cancelar el Contrato Venta <b>' + this.nuevoContrato.t218_ID.toString() + '</b>?',
                  showCancelButton: true,
                  cancelButtonText: 'Cancelar',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Continuar',
                  reverseButtons: true,
                  confirmButtonColor: '#4b822d'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.portafolioMoliendaService.cancelarContrato(Number(this.nuevoContrato.t218_ID),intercompany,this.portafolioMoliendaIFDService.usuario).subscribe(
                      (response: boolean) => {
                        this.portafolioMoliendaService.flgActualizar=true
                        Swal.fire({
                          title: 'Cancelación de Contrato!',
                          html: 'Se realizó la cancelación de contrato <b>' + this.nuevoContrato.t218_ID.toString() + '</b>',
                          icon: 'success',
                          confirmButtonColor: '#4b822d'
                        })
                      },
                      (error: HttpErrorResponse) => {
                        alert(error.message);
                      });
                    }
                  });
              }
            }else{
              if(fila[0]['s118_precio_futuro'] == 0 && fila[0]['s118_fijado_futurotm'] == 0 && fila[0]['s118_precio_base'] == 0 && fila[0]['s118_fijado_basetm'] == 0
              && (fila[0]['s118_fecha_base'].toString() == '1900-01-01T05:08:36.000+00:00' || fila[0]['s118_fecha_futuro'].toString() == '1900-01-01T05:08:36.000+00:00' || fila[0]['s118_fecha_base'].toString() == '1900-01-01 00:00:00.0'
              || fila[0]['s118_fecha_base'].toString() == '1900-01-01T00:00:00.000+00:00' || fila[0]['s118_fecha_futuro'].toString() == '1900-01-01T00:00:00.000+00:00' || fila[0]['s118_fecha_futuro'].toString() == '1900-01-01 00:00:00.0')){
                this.portafolioMoliendaService.cancelarContrato(Number(this.nuevoContrato.t218_ID),intercompany,this.portafolioMoliendaIFDService.usuario).subscribe(
                  (response: boolean) => {
                    this.portafolioMoliendaService.flgActualizar=true
                    Swal.fire({
                      title: 'Cancelación de Contrato!',
                      html: 'Se realizó la cancelación de contrato <b>' + this.nuevoContrato.t218_ID.toString() + '</b>',
                      icon: 'success',
                      confirmButtonColor: '#4b822d'
                    })
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
              }else{
                Swal.fire({
                  icon: 'question',
                  title: 'Cancelación de Contrato',
                  html: 'El contrato tiene Bases y/o Futuros Asignados ¿Está seguro que desea cancelar el Contrato Venta <b>' + this.nuevoContrato.t218_ID.toString() + '</b>?',
                  showCancelButton: true,
                  cancelButtonText: 'Cancelar',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Continuar',
                  reverseButtons: true,
                  confirmButtonColor: '#4b822d'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.portafolioMoliendaService.cancelarContrato(Number(this.nuevoContrato.t218_ID),intercompany,this.portafolioMoliendaIFDService.usuario).subscribe(
                      (response: boolean) => {
                        this.portafolioMoliendaService.flgActualizar=true
                        Swal.fire({
                          title: 'Cancelación de Contrato!',
                          html: 'Se realizó la cancelación de contrato <b>' + this.nuevoContrato.t218_ID.toString() + '</b>',
                          icon: 'success',
                          confirmButtonColor: '#4b822d'
                        })
                      },
                      (error: HttpErrorResponse) => {
                        alert(error.message);
                      });
                    }
                  });
              }
            }
            }
          }
        )
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  onCheckChangeCheck(event){
    if(event.target.checked){
      this.tituloTabla="Ventas Molienda Diferidas";
      this.postCierre=true;
      this.getPortafolioMoliendaCierre(this.companiaSelected)
    }else{
      this.tituloTabla="Portafolio Ventas Molienda";
      this.portafolioMoliendaService.flgActualizar=true;
      this.postCierre=false;
      this.getPortafolioMolienda(this.companiaSelected,this.productoSelected)      
    }
  }

  getProductosMolienda(): void {
    this.portafolioMoliendaService.getproductosMolienda().subscribe(
      (response: Underlying[]) => {
        this.productosMolienda = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  obtenerContrato(id:number){
    this.portafolioMoliendaService.getNuevoContrato(this.companiaSelected.toString(),id.toString()).subscribe(
      (response: cargaCombo[]) => {
        this.nuevoContrato.t218_ContractBySociety = response[0]['s114_Codigo'];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public getCombosContrato(id:number): void {

    this.portafolioMoliendaService.getCombo('barco').subscribe(
      (response: cargaCombo[]) => {
        this.barcos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('origen').subscribe(
      (response: cargaCombo[]) => {
        this.origen = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboParam1('campaña',id.toString()).subscribe(
      (response: cargaCombo[]) => {
        this.campania = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboParam1('producto',id.toString()).subscribe(
      (response: cargaCombo[]) => {
        this.producto = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboParam1('cliente',this.companiaSelected.toString()).subscribe(
      (response: cargaCombo[]) => {
        this.cliente = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('zona').subscribe(
      (response: cargaCombo[]) => {
        this.zona = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('incoterm').subscribe(
      (response: cargaCombo[]) => {
        this.incoterm = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboParam1('puertoOrigen',this.companiaSelected.toString()).subscribe(
      (response: cargaCombo[]) => {
        this.puertoOrigen = response;
        if(this.flgIngresarContrato){
          if(this.puertoOrigen.find(x => x.s204_ID == "16") != undefined){
            this.nuevoContrato.t218_PortFrom = "16";
          }else{
            this.nuevoContrato.t218_PortFrom = "";
          }
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboParam1('puertoDestino',this.companiaSelected.toString()).subscribe(
      (response: cargaCombo[]) => {
        this.puertoDestino = response;
        if(this.flgIngresarContrato){
          if(this.puertoDestino.find(x => x.s204_ID == "16") != undefined){
            this.nuevoContrato.t218_PortUp = "16";
          }else{
          this.nuevoContrato.t218_PortUp = "";
          }
        }
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('bolsa').subscribe(
      (response: cargaCombo[]) => {
        this.bolsa = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('tipoprecio').subscribe(
      (response: cargaCombo[]) => {
        this.tipoPrecio = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboXTabla('T338_WashOut').subscribe(
      (response: cargaCombo[]) => {
        this.washout = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboXTabla('T008_SellBuy').subscribe(
      (response: cargaCombo[]) => {
        this.compraventa = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getComboXTabla('T282_Market').subscribe(
      (response: cargaCombo[]) => {
        this.market = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public getContratos(id:number): void {
    this.portafolioMoliendaService.getComboParam2('contrato',this.productoSelectedModal.toString(),id.toString()).subscribe(
      (response: cargaCombo[]) => {
        this.contrato = response;
        if(id==18){
          this.nuevoContrato.t218_Contract=this.contrato[0]["s204_ID"]
          this.calcularCaks()
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }
  public getContratosModificar(id:number): void {
    this.portafolioMoliendaService.getComboParam3('contrato-Modificar',this.productoSelectedModal.toString(),id.toString(),this.nuevoContrato.t218_Contract).subscribe(
      (response: cargaCombo[]) => {
        this.contrato = response;
        if(id==18){
          this.nuevoContrato.t218_Contract=this.contrato[0]["s204_ID"]
          this.calcularCaks()
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cambioTipoPrecio(id:number){
    if(id==1){
      this.getContratos(18)
      this.bolsaSelectedModal="18"

    }else if(id==2){
      this.bolsaSelectedModal="1"
      this.nuevoContrato.t218_Contract = ""
      this.getContratos(1)
    }

  }

  calcularCaks(){
    this.planificacionConsumo = [];
    if(this.nuevoContrato.t218_Contract != null && this.nuevoContrato.t218_Contract != "" && this.nuevoContrato.t218_MetricTons!= 0 && this.nuevoContrato.t218_MetricTons!= null){
      this.portafolioMoliendaService.getToneladasContratos(this.nuevoContrato.t218_MetricTons.toString().replace(".", "_"),this.nuevoContrato.t218_Contract.toString()).subscribe(
        (response: string) => {
          this.caksInt = Math.round(Number(response));
          this.nuevoContrato.t218_VolumeContract = response;
          
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      this.nuevoContrato.t218_VolumeContract='';
      this.caksInt = 0;
    }
  }

  transformarTMXContratos(){
    this.portafolioMoliendaService.getToneladasContratos(this.nuevoPartialContractDownload.t229_MetricTons.toString().replace(".", "_"),this.nuevoContrato.t218_Contract.toString()).subscribe(
      (response: string) => {
        // this.nuevoPartialContractDownload.t229_NumberOfContracts = (Math.round(Number(response))).toString();
        this.nuevoPartialContractDownload.t229_NumberOfContracts = (Number(response)).toString();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  calcularCaksXContratos(){

    if(this.nuevoContrato.t218_Contract != null && this.nuevoContrato.t218_Contract != "" && this.nuevoContrato.t218_VolumeContract != '' && this.nuevoContrato.t218_VolumeContract!= null){
      this.portafolioMoliendaService.getContratosTM(this.nuevoContrato.t218_VolumeContract.toString().replace(".", "_"),this.nuevoContrato.t218_Contract.toString()).subscribe(
        (response: string) => {
          // this.nuevoContrato.t218_MetricTons = Math.round(Number(response));
          this.nuevoContrato.t218_MetricTons = Number(response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      this.nuevoContrato.t218_MetricTons=0;
    }
  }

  ActualizarContrato(salesContract: SalesContract,modifyForm:any){
    this.flgBontonContrato = false;
    salesContract.t218_Society=this.companiaSelected.toString()
    salesContract.t218_Date = this.dateToString(this.fecha);
    salesContract.t218_EndDate = this.dateToString(this.fechFin);
    salesContract.t218_StartDate = this.dateToString(this.fechInicio);
    salesContract.t218_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    
    if(this.nuevoContrato.t218_PriceType != '1'){
      
      if((Math.round(Number(this.tmFijadasBases))  - Math.round(Number(salesContract.t218_MetricTons))) > 1 || 
          (Math.round(Number(this.contratosFijadasFuturos)) - Math.round(Number(salesContract.t218_VolumeContract))) > 1){
        Swal.fire({
          icon: 'warning',
          title: 'Modificación de Contrato',
          text: 'Para hacer esta reducción de TM, por favor primero modificar los futuros y/o bases pactadas',
          confirmButtonColor: '#0162e8'
        });
        this.flgBontonContrato = true;
        return
      }

    }
    

    if(typeof this.nuevoContrato.t218_SellBuy !== 'undefined' && this.nuevoContrato.t218_SellBuy != null && this.nuevoContrato.t218_GrindingProduct  !== 'undefined' && this.nuevoContrato.t218_GrindingProduct != null
    && this.nuevoContrato.t218_GrindingCustomer  !== 'undefined' && this.nuevoContrato.t218_GrindingCustomer != null && this.nuevoContrato.t218_GrindingCustomer != "" && typeof this.nuevoContrato.t218_MetricTons  !== 'string' && this.nuevoContrato.t218_MetricTons != null
    && this.nuevoContrato.t218_Tolerance !== "" && this.nuevoContrato.t218_Tolerance != null  && this.nuevoContrato.t218_Contract != null && this.nuevoContrato.t218_Contract != "" && this.nuevoContrato.t218_PortFrom != null && this.nuevoContrato.t218_PortUp != null && this.nuevoContrato.t218_PortFrom != '' && this.nuevoContrato.t218_PortUp != ''){

      if(!this.interCompany){
        this.portafolioMoliendaService.modificarContrato(salesContract).subscribe(
            data=>{
              Swal.fire({
                icon: 'success',
                title: 'Contrato Agregado',
                text: 'Se modificó el contrato ' + salesContract.t218_ID.toString() + ' con exito!',
                confirmButtonColor: '#0162e8'
              });
              this.flgGuardarContrato=true;
              this.productoSelected=this.productoSelectedModal
              this.portafolioMoliendaService.flgActualizar=true;
              this.getProductos(this.companiaSelected);
              this.getPortafolioMolienda(this.companiaSelected,this.productoSelected);
              // this.selectedProducto=this.selectedProductoModal;
              this.modalService.dismissAll(modifyForm);

              let planificacion: ConsumptionPlanning[] = [];
              let cont = 0;
              for (let item of this.planificacionConsumo){
                planificacion[cont] = new ConsumptionPlanning();
                planificacion[cont].t337_SalesContract = Number(salesContract.t218_ID);
                planificacion[cont].t337_MonthContract = Number(item.s176_CodigoMes);
                planificacion[cont].t337_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                planificacion[cont].t337_Value = Number(item.s176_TM);
                planificacion[cont].t337_Status = 1;
                cont+=1;
              }
  
              if(planificacion.length>0){
                this.portafolioMoliendaService.guardarPlanificacion(planificacion).subscribe(
                  data=>{                
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
              }
              this.flgBontonContrato = true;

            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.portafolioMoliendaService.obtenerUnderlyingClassification(Number(this.nuevoContrato.t218_GrindingProduct)).subscribe(
            (response: string[]) => {
              this.nuevoFisico.t039_UnderlyingClassification = Number(response[0]).toString();
              this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
                (response: string) => {
                  this.nuevoFisico.t039_Society = Number(response[0]["t231_Society"]);
                  this.portafolioMoliendaService.getEstadoCrossCompany(Number(this.nuevoFisico.t039_UnderlyingClassification),this.nuevoFisico.t039_Society).subscribe(
                    (response: ClosingControl[]) => {
                      if(response.length>0){
                        Swal.fire({
                          icon: 'warning',
                          title: 'Aviso',
                          text: 'No puede realizar esta Operación porque el Portafolio Cross Company ya se encuentra cerrado.',
                          confirmButtonColor: '#0162e8',
                          customClass: {
                            container: 'my-swal'
                          }
                        });
                      }else{
                        this.nuevoFisico.t039_ArrivalDate = this.dateToString(this.fechaBarco);
                        this.contratoCross.physical=this.nuevoFisico
                        this.contratoCross.consumoHumano=this.consumoHumano
                        this.contratoCross.salesContract=salesContract
                        this.contratoCross.animalNutrition= this.nuevoNutricionAnimal

                        this.portafolioMoliendaService.modificarContratoCross(this.contratoCross).subscribe(
                          data=>{//AQUI
                            if(Boolean(data) == true){
                                    Swal.fire({
                                      icon: 'success',
                                      title: 'Contrato Agregado',
                                      text: 'Se modificó el contrato ' + salesContract.t218_ID.toString() + ' con exito!',
                                      confirmButtonColor: '#0162e8'
                                    });
                                    this.flgGuardarContrato=true;
                                    this.productoSelected=this.productoSelectedModal
                                    this.portafolioMoliendaService.flgActualizar=true;
                                    this.getProductos(this.companiaSelected);
                                    this.getPortafolioMolienda(this.companiaSelected,this.productoSelected);
                                    // this.selectedProducto=this.selectedProductoModal;
                                    this.modalService.dismissAll(modifyForm);
                                    this.flgBontonContrato = true;

                                    let planificacion: ConsumptionPlanning[] = [];
                                    let cont = 0;
                                    for (let item of this.planificacionConsumo){
                                      planificacion[cont] = new ConsumptionPlanning();
                                      planificacion[cont].t337_SalesContract = Number(salesContract.t218_ID);
                                      planificacion[cont].t337_MonthContract = Number(item.s176_CodigoMes);
                                      planificacion[cont].t337_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                                      planificacion[cont].t337_Value = Number(item.s176_TM);
                                      planificacion[cont].t337_Status = 1;
                                      cont+=1;
                                    }

                                    if(planificacion.length>0){
                                      this.portafolioMoliendaService.guardarPlanificacion(planificacion).subscribe(
                                        data=>{                
                                        },
                                        (error: HttpErrorResponse) => {
                                          alert(error.message);
                                        });
                                    }   
                            }else{
                              Swal.fire({
                                icon: 'warning',
                                title: 'Aviso',
                                text: 'Ocurrió un error en el registro.',
                                confirmButtonColor: '#0162e8',
                                customClass: {
                                  container: 'my-swal'
                                }
                              })  
                              this.flgBontonContrato = true;
                            }

                          },
                          (error: HttpErrorResponse) => {
                            alert(error.message);
                          });
                      }
                    },
                    (error: HttpErrorResponse) => {
                      alert(error.message);
                    });
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }

    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar los datos.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBontonContrato = true;
      this.flgGuardarContrato=false;
    }

  }

  GuardarContrato(salesContract: SalesContract,userForm:any){

    // No puede realizar esta Operación porque el Portafolio Cross Company ya se encuentra cerrado
    this.flgBontonContrato = false;
    salesContract.t218_Society=this.companiaSelected.toString()
    salesContract.t218_Date = this.dateToString(this.fecha);
    salesContract.t218_EndDate = this.dateToString(this.fechFin);
    salesContract.t218_StartDate = this.dateToString(this.fechInicio);

    this.portafolioMoliendaService.getNuevoCodigo().subscribe(
      (response: string) => {
        this.nuevoContrato.t218_ID = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

    if(typeof this.nuevoContrato.t218_SellBuy !== 'undefined' && this.nuevoContrato.t218_SellBuy != null && this.nuevoContrato.t218_GrindingProduct  !== 'undefined' && this.nuevoContrato.t218_GrindingProduct != null
    && this.nuevoContrato.t218_GrindingCustomer  !== 'undefined' && this.nuevoContrato.t218_GrindingCustomer != null && this.nuevoContrato.t218_GrindingCustomer != "" && typeof this.nuevoContrato.t218_MetricTons  !== 'string' && this.nuevoContrato.t218_MetricTons != null  && this.nuevoContrato.t218_MetricTons != 0
    && this.nuevoContrato.t218_Tolerance != null && this.nuevoContrato.t218_Tolerance !== '' && this.nuevoContrato.t218_Contract != null && this.nuevoContrato.t218_Contract != "" && this.nuevoContrato.t218_PortFrom != null && this.nuevoContrato.t218_PortUp != null && this.nuevoContrato.t218_PortFrom != '' && this.nuevoContrato.t218_PortUp != ''){
      if(!this.interCompany){
        this.portafolioMoliendaService.crearContrato(salesContract).subscribe(
          data=>{
            salesContract = data;
            Swal.fire({
              icon: 'success',
              title: 'Contrato Agregado',
              text: 'Se agregó el contrato ' + salesContract.t218_ID.toString() + ' con exito!',
              confirmButtonColor: '#0162e8'
            });
            this.flgGuardarContrato=true;
            this.productoSelected=this.productoSelectedModal
            this.portafolioMoliendaService.flgActualizar=true;
            this.getProductos(this.companiaSelected);
            this.getPortafolioMolienda(this.companiaSelected,this.productoSelected);
            // this.selectedProducto=this.selectedProductoModal;
            this.modalService.dismissAll(userForm);
            this.flgBontonContrato = true;

            let planificacion: ConsumptionPlanning[] = [];
            let cont = 0;
            for (let item of this.planificacionConsumo){
              planificacion[cont] = new ConsumptionPlanning();
              planificacion[cont].t337_SalesContract = Number(salesContract.t218_ID);
              planificacion[cont].t337_MonthContract = Number(item.s176_CodigoMes);
              planificacion[cont].t337_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
              planificacion[cont].t337_Value = Number(item.s176_TM);
              planificacion[cont].t337_Status = 1;
              cont+=1;
            }

            if(planificacion.length>0){
              this.portafolioMoliendaService.guardarPlanificacion(planificacion).subscribe(
                data=>{                
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
            }
          },
          (error: HttpErrorResponse) => {
            if(error.error.message.includes('ConstraintViolationException')){
              this.flgBontonContrato = true;
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

      }else{
        if(this.nuevoFisico.t039_ID == undefined || this.nuevoFisico.t039_Destination == undefined || this.nuevoFisico.t039_Location == undefined){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Por favor completar campos intercompany.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
          this.flgBontonContrato = true;
          return;
        }

        if(this.nuevoFisico.t039_Destination == '1' && this.nuevoNutricionAnimal.t170_Society == undefined){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Por favor completar campos intercompany.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
          this.flgBontonContrato = true;
          return;
        }

        this.portafolioMoliendaService.obtenerUnderlyingClassification(Number(this.nuevoContrato.t218_GrindingProduct)).subscribe(
          (response: string[]) => {
            this.nuevoFisico.t039_UnderlyingClassification = Number(response[0]).toString();
            this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
              (response: string) => {
                this.nuevoFisico.t039_Society = Number(response[0]["t231_Society"]);
                this.portafolioMoliendaService.getEstadoCrossCompany(Number(this.nuevoFisico.t039_UnderlyingClassification),this.nuevoFisico.t039_Society).subscribe(
                  (response: ClosingControl[]) => {
                    if(response.length>0){
                      Swal.fire({
                        icon: 'warning',
                        title: 'Aviso',
                        text: 'No puede realizar esta Operación porque el Portafolio Cross Company ya se encuentra cerrado.',
                        confirmButtonColor: '#0162e8',
                        customClass: {
                          container: 'my-swal'
                        }
                      });
                      this.flgBontonContrato = true;
                    }else{
                      this.nuevoFisico.t039_ArrivalDate = this.dateToString(this.fechaBarco);
                      this.contratoCross.physical=this.nuevoFisico
                      this.contratoCross.salesContract=salesContract
                      this.contratoCross.animalNutrition= this.nuevoNutricionAnimal
                      this.contratoCross.consumoHumano=this.consumoHumano

                      this.portafolioMoliendaService.crearContratoCross(this.contratoCross).subscribe(
                        data=>{//AQUI
                          salesContract = data;
                          let planificacion: ConsumptionPlanning[] = [];
                          let cont = 0;
                          for (let item of this.planificacionConsumo){
                            planificacion[cont] = new ConsumptionPlanning();
                            planificacion[cont].t337_SalesContract = Number(salesContract.t218_ID);
                            planificacion[cont].t337_MonthContract = Number(item.s176_CodigoMes);
                            // planificacion[cont].t337_Date = Number(salesContract.t218_ID);
                            planificacion[cont].t337_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                            planificacion[cont].t337_Value = Number(item.s176_TM);
                            planificacion[cont].t337_Status = 1;
              
                            cont+=1;
                          }
              
                          if(planificacion.length>0){
                            this.portafolioMoliendaService.guardarPlanificacion(planificacion).subscribe(
                              data=>{                
                              },
                              (error: HttpErrorResponse) => {
                                alert(error.message);
                              });
                          }
                          if(Boolean(data) == true){
                            this.portafolioMoliendaService.ControlFisicoEnFret(Number(this.nuevoFisico.t039_ID),this.portafolioMoliendaIFDService.usuario).subscribe(
                              (response: boolean) => {
                                if(response == true){
                                  Swal.fire({
                                    icon: 'success',
                                    title: 'Contrato Agregado',
                                    text: 'Se agregó el contrato ' + salesContract.t218_ID.toString() + ' con exito!',
                                    confirmButtonColor: '#0162e8'
                                  });
                                  this.flgGuardarContrato=true;
                                  this.productoSelected=this.productoSelectedModal
                                  this.portafolioMoliendaService.flgActualizar=true;
                                  this.getProductos(this.companiaSelected);
                                  this.getPortafolioMolienda(this.companiaSelected,this.productoSelected);
                                  // this.selectedProducto=this.selectedProductoModal;
                                  this.modalService.dismissAll(userForm);
                                  this.flgBontonContrato = true;
                                }else{
                                  Swal.fire({
                                    icon: 'warning',
                                    title: 'Aviso',
                                    text: 'Ocurrió un error en el registro de control.',
                                    confirmButtonColor: '#0162e8',
                                    customClass: {
                                      container: 'my-swal'
                                    }
                                  })
                                  this.flgBontonContrato = true;
                                }
                              },
                              (error: HttpErrorResponse) => {
                                alert(error.message);
                              });
                          }else{
                            Swal.fire({
                              icon: 'warning',
                              title: 'Aviso',
                              text: 'Ocurrió un error en el registro.',
                              confirmButtonColor: '#0162e8',
                              customClass: {
                                container: 'my-swal'
                              }
                            })
                            this.flgBontonContrato = true;
                          }

                        },
                        (error: HttpErrorResponse) => {
                          if(error.error.message.includes('ConstraintViolationException')){
                            this.flgBontonContrato = true;
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
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar los datos.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.flgBontonContrato = true;
      this.flgGuardarContrato=false;
    }
  }

  gananciaPerdidaBases(){
    if(typeof this.nuevaBase.t228_BaseUSD !== 'undefined' && this.nuevaBase.t228_BaseUSD != null && this.baseProfitAndLoss.t340_Cost  !== 'undefined' && this.baseProfitAndLoss.t340_Cost != null
    && this.nuevoContrato.t218_MetricTons  !== 0 && this.nuevoContrato.t218_MetricTons != null){
      this.portafolioMoliendaService.factorMetricTonPrice(Number(this.nuevoContrato.t218_ID)).subscribe(
        (response: string[]) => {
          if(this.washOut_Base == true){
            this.baseProfitAndLoss.t340_ProfitAndLoss= ((Number(this.nuevaBase.t228_BaseUSD) - (Number(this.baseProfitAndLoss.t340_Cost) + Number(this.premioCalidad_Base) + Number(this.fleteMaritimo_Base))) * this.nuevoContrato.t218_MetricTons * Number(response[0])).toString();
          }else{
            this.baseProfitAndLoss.t340_ProfitAndLoss=((Number(this.nuevaBase.t228_BaseUSD) - Number(this.baseProfitAndLoss.t340_Cost))* this.nuevoContrato.t218_MetricTons * Number(response[0])).toString();
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });

    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar los datos.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    }
  }
  GuardarIntercompany(formularioBarco:any){
    this.flgBontonBarco = false;
    this.portafolioMoliendaService.obtenerNuevoID("T039_Physical","T039_ID").subscribe(
      (response: string[]) => {
        if(this.flgIngresarContrato || this.nuevoFisico.t039_ID == undefined){ //No se ejecuta en la modificación
          this.nuevoFisico.t039_ID = response[0];
        }

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.nuevoFisico.t039_PhysicalState = 1;
    this.nuevoFisico.t039_Hedgeable = 1;
    this.nuevoFisico.t039_ArrivalDate = this.dateToString(this.fechaBarco);
    // formularioBarco.close();
  }

  selectCliente(id:number, formularioBarco:any){
    if(this.companiaSelected.toString() !== "14" || this.nuevoContrato.t218_GrindingCustomer !== '1' || this.nuevoContrato.t218_SellBuy !== '2'){
      this.interCompany= false;
      if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1'){
        if(typeof this.nuevoContrato.t218_SellBuy == 'undefined' || typeof this.nuevoContrato.t218_SellBuy !== 'string') {
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Es necesario seleccionar el Tipo de Operación "Compra/Venta"',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          }),
          this.nuevoContrato.t218_GrindingCustomer="";
        }
      }
      return;
    }
    if (typeof id == 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar un Cliente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      this.interCompany= false;
    }else{
      this.portafolioMoliendaService.listarComprasEntreCompanias(id).subscribe(
        (response: string) => {
          if(response.length > 0){
            if(typeof this.nuevoContrato.t218_Incoterm == 'undefined' || typeof this.nuevoContrato.t218_Incoterm !== 'string') {
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'Es necesario seleccionar Incoterm',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              }),
              this.nuevoContrato.t218_GrindingCustomer="";
            }else{
              this.interCompany= true;
              this.portafolioMoliendaService.nuevoContratoBarco(this.companiaSelected,this.productoSelectedModal).subscribe(
                (response: string[]) => {

                        if(this.estadoPortafolio.length > 0) {
                          Swal.fire({
                            icon: 'warning',
                            title: 'Aviso',
                            text: 'El Portafolio ya se encuentra cerrado, no se pueden realizar operaciones Cross Company',
                            confirmButtonColor: '#0162e8',
                            customClass: {
                              container: 'my-swal'
                            }
                          })
                          this.nuevoContrato.t218_GrindingCustomer = ""
                          return;
                        }             

                        if(!this.flgIngresarContrato){ //Se ejecuta en la modificación
                          if (this.nuevoFisico != undefined){
                            
                            if(this.nuevoFisico.t039_ArrivalDate != undefined){
                              this.nuevoFisico.t039_Destination = this.nuevoFisico.t039_Destination;
                            }

                            if(this.nuevoFisico.t039_Location != undefined){
                              this.nuevoFisico.t039_Location = this.nuevoFisico.t039_Location;
                            }

                            if(this.nuevoNutricionAnimal !== null){
                              if(this.nuevoNutricionAnimal.t170_Society !== undefined){
                                this.nuevoNutricionAnimal.t170_Society = this.nuevoNutricionAnimal.t170_Society.toString();
                              }
                            }else if(this.consumoHumano !== null){
                              if(this.consumoHumano.t478_Society !== undefined){
                                this.consumoHumano.t478_Society = this.consumoHumano.t478_Society.toString();
                              }
                              this.nuevoNutricionAnimal = new AnimalNutrition();
                            }
                            
                            
                            if(this.nuevoFisico.t039_ArrivalDate != undefined){
                              this.fechaString = this.nuevoFisico.t039_ArrivalDate.toString().substring(0,4) +'-'+ this.nuevoFisico.t039_ArrivalDate.toString().substring(4,6) +'-'+ this.nuevoFisico.t039_ArrivalDate.toString().substring(6,8);
          
                              this.fechaBarcoModificar = new Date(this.fechaString);
            
                              this.fechaBarcoModificar.setDate( this.fechaBarcoModificar.getDate() + 1 );
            
                              this.fechaBarco = {day: this.fechaBarcoModificar.getDate(),month: this.fechaBarcoModificar.getMonth() + 1,year: this.fechaBarcoModificar.getFullYear()};
                              this.flgBontonBarco = true;
                              this.modalService.open(formularioBarco,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
                            }
                            
                          }else{
                            this.nuevoFisico = new Physical();
                            this.nuevoNutricionAnimal = new AnimalNutrition();
                            this.nuevoFisico.t039_InternalCode = response[0];
                            this.fechaBarco = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
                            this.flgBontonBarco = true;
                            this.modalService.open(formularioBarco,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
                          }
                        }else{
                          this.nuevoFisico = new Physical();
                          this.nuevoNutricionAnimal = new AnimalNutrition();
                          this.nuevoFisico.t039_InternalCode = response[0];
                          this.fechaBarco = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
                          this.flgBontonBarco = true;
                          this.modalService.open(formularioBarco,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
                        }

                  this.portafolioMoliendaService.getComboXTabla('T169_Destination').subscribe(
                    (response: cargaCombo[]) => {
                      this.destinoBarco = response;
                    },
                    (error: HttpErrorResponse) => {
                      alert(error.message);
                    });
                  this.portafolioMoliendaService.getComboXTabla('T185_Location').subscribe(
                    (response: cargaCombo[]) => {
                      this.locacionBarco = response;
                    },
                    (error: HttpErrorResponse) => {
                      alert(error.message);
                    });
                  this.portafolioMoliendaService.getCompaniasBarcos().subscribe(
                    (response: objComboSociedades) => {
                      this.companiasBarcos = response.comboSociedadesNA;
                      this.comboSociedadesConsumoHumano = response.comboSociedadesConsumoHumano;
                    },
                    (error: HttpErrorResponse) => {
                      alert(error.message);
                    });
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
              
            }
          }else{
            this.interCompany= false;
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }
  
  ModalVentaParcial(IngresarVentaParcial:any, ingresarFactura: any){
    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar venta parcial")){
      return;
    }
    this.flgBontongenerico = true;
    this.validarPortafolioCerrado();
    let fila = this.portafolio.filter(tabla => tabla.s118_Codigo == this.contextMenu.menuData.item);
    
    if(fila[0]["s118_Cliente"].toUpperCase().indexOf("CONSUMO MASIVO") >= 0 || this.companiaSelected == 14){
      this.nuevoContrato = new SalesContract();
      this.nuevoPartialContractDownload = new PartialContractDownload();
      this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
      this.txtPrecioFinalVP = 0;
      
      // CAMPOS IFD - FOB - FLETE
    
      this.ifd = 0;
      this.fob = 0;
      this.flete = 0;
      // this.nuevoIngresoFactura.t432_Fob = fila[0]["s118_FOB"];
      // this.nuevoIngresoFactura.t432_Flete = fila[0]["s118_Flete"];

      this.pasarFacturadaVP = false;

      this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
        (response: SalesContract) => {
          this.nuevoContrato = response;
          this.nuevoPartialContractDownload.t229_SalesContract = Number(this.nuevoContrato.t218_ID);
          this.nuevoPartialContractDownload.t229_MetricTons = this.nuevoContrato.t218_MetricTons.toString();
          this.transformarTMXContratos();
          this.portafolioMoliendaService.obtenerPrecioCompletoContratoVenta(Number(this.nuevoContrato.t218_ID)).subscribe(
            (response: string[]) => {
              this.nuevoPartialContractDownload.t229_PriceUSD = response[0];
              this.modalService.open(IngresarVentaParcial,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      if(this.companiaSelected.toString() == "17"){
        this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
        this.portafolioMoliendaService.flgIngresoFactura = true;
        this.modalService.open(ingresarFactura,{windowClass : "my-class-Facturas",centered: true,backdrop : 'static',keyboard : false});
      }else{
        if(this.companiaSelected != 14){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Solo está permitido ingresar ventas parciales para Consumo Masivo',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
        }
      }
    }
  }

  guardarVentaParcial(IngresarVentaParcial:any){
    this.flgBontongenerico = false;
    if(this.pasarFacturadaVP == true){
      let fila = this.portafolio.filter(tabla => tabla.s118_Codigo == Number(this.nuevoContrato.t218_ID));

      // CAMPOS IFD - FOB -FLETE
      this.nuevoIngresoFactura.t429_Ifd = this.ifd;
      this.nuevoIngresoFactura.t429_Fob = this.fob;
      this.nuevoIngresoFactura.t429_Flete = this.flete;
      
      if(fila[0]['s118_Flete'] == 0 && fila[0]['s118_codigo_barco'] != 0){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Es necesario Ingresar un Flete',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
        return;
      }

      if(fila[0]['s118_tipo_precio'] == 'Flat'){
        if(fila[0]['s118_saldo_flattm'] > 1 ){
          this.flgBontongenerico = true
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Existe saldo pendiente por asignar',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }
      }else{
        if(fila[0]['s118_saldo_futuro_caks'] > 1 || fila[0]['s118_saldo_basetm'] > 1){
          this.flgBontongenerico = true
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Existe saldo pendiente por asignar',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }
      }

      if(this.txtPrecioFinalVP == 0 || this.txtPrecioFinalVP == undefined){
        this.flgBontongenerico = true
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Completar el campo Precio Final',
          confirmButtonColor: '#0162e8',
          customClass: {
          container: 'my-swal'
          }
        })
        return;
      } 
    }

      if(this.companiaSelected.toString() == "14"){
        if(this.flete == undefined){
          this.flgBontongenerico = true
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Completar el campo Flete',
            confirmButtonColor: '#0162e8',
            customClass: {
            container: 'my-swal'
            }
          })
          return;
        }
        
          if(this.fob == 0 || this.fob == undefined){
            this.flgBontongenerico = true
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Completar el campo FOB',
              confirmButtonColor: '#0162e8',
              customClass: {
              container: 'my-swal'
              }
            })
            return;
          }

          if(this.ifd == undefined){
            this.flgBontongenerico = true
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'Completar el campo IFD',
              confirmButtonColor: '#0162e8',
              customClass: {
              container: 'my-swal'
              }
            })
            return;
          }
      } else{
        this.fob = 0;
        this.flete = 0;
        this.ifd = 0;
      }
    
      this.portafolioMoliendaService.obtenerNuevoID("T229_PartialContractDownload","T229_ID").subscribe(
        (response: string[]) => {
          this.nuevoPartialContractDownload.t229_ID = Number(response[0]);
          this.nuevoPartialContractDownload.t229_Date = Number(this.dateToString(this.fecha));
          this.nuevoPartialContractDownload.t229_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
          if(this.pasarFacturadaVP == true){
            this.nuevoPartialContractDownload.t229_TypeOfDischarge = 3;
          }else{
            this.nuevoPartialContractDownload.t229_TypeOfDischarge = 1;
          }
          
          // this.txtPrecioFinalVP = this.fob + this.flete;

          this.portafolioMoliendaService.guardarPartialContractDownload(this.nuevoPartialContractDownload).subscribe(
            data=>{
              //"ID" INGRESO FACTURA "IFD"
              if(this.companiaSelected.toString() == "14"){
                this.nuevoIngresoFactura.t429_id = data.t229_ID;
                this.portafolioMoliendaService.guardarIngresoFactura(this.nuevoIngresoFactura).subscribe(data => {
              });
              }
             
              this.objVentaParcialCross.partialContractDownload = this.nuevoPartialContractDownload
              this.objVentaParcialCross.precioFinal = this.txtPrecioFinalVP;
              this.objVentaParcialCross.contrato = this.nuevoContrato;

              if(this.companiaSelected.toString() == "14" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
                this.portafolioMoliendaService.guardarVentaParcialIntercompany(this.objVentaParcialCross).subscribe(
                  data=>{
                    this.portafolioMoliendaService.flgActualizar=true;
                    Swal.fire({
                      icon: 'success',
                      title: 'Descarga Parcial',
                      text: 'Se realizó la descarga parcial con éxito',
                      confirmButtonColor: '#0162e8'
                    });
                    this.flgBontongenerico = true          
                    this.modalService.dismissAll(IngresarVentaParcial);
                  },
                  (error: HttpErrorResponse) => {
                    if(error.error.message.includes('ConstraintViolationException')){
                      this.flgBontongenerico = true;
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
              }else{
                if(this.pasarFacturadaVP){
                  //Actualizar Estado y Precio Final
                  this.objetoPasarFacturada = [];
                  
                  this.objetoPasarFacturada[0]= this.nuevoPartialContractDownload.t229_SalesContract.toString();
                  this.objetoPasarFacturada[1]= this.txtPrecioFinalVP.toString();

                  this.portafolioMoliendaService.actualizarEstado_PrecioFinal_VP(this.objetoPasarFacturada).subscribe(
                    data=>{
                      this.portafolioMoliendaService.flgActualizar=true;
                      Swal.fire({
                        icon: 'success',
                        title: 'Descarga Parcial',
                        text: 'Se realizó la descarga parcial con éxito',
                        confirmButtonColor: '#0162e8'
                      });
                      this.flgBontongenerico = true            
                      this.modalService.dismissAll(IngresarVentaParcial);
                    },
                    (error: HttpErrorResponse) => {
                        alert(error.message);
                    });
                }else{
                  this.portafolioMoliendaService.flgActualizar=true;
                      Swal.fire({
                        icon: 'success',
                        title: 'Descarga Parcial',
                        text: 'Se realizó la descarga parcial con éxito',
                        confirmButtonColor: '#0162e8'
                      });
                      this.flgBontongenerico = true            
                      this.modalService.dismissAll(IngresarVentaParcial);
                }
              }
              
              // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
              //   (response: string) => {
              //     if(response.length > 0){ //INTERCOMPANY
              //     }else{ 
              //     }
              //   },
              //   (error: HttpErrorResponse) => {
              //     alert(error.message);
              //   });
            },
            (error: HttpErrorResponse) => {
              if(error.error.message.includes('ConstraintViolationException')){
                this.flgBontongenerico = true;
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
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });

  }
  
  obtenerPrecioFinal(){
    this.txtPrecioFinalVP = Number(this.nuevoPartialContractDownload.t229_PriceUSD);
    // this.fob = this.nuevoIngresoFactura.t432_Fob;
    // this.flete = this.nuevoIngresoFactura.t432_Flete;
  }

  obtenerDescargasParciales(listaVentaParcial:any, listaDosificada:any){
    // obtenerDescargasParciales(listaVentaParcial:any){

    let fila = this.portafolio.filter(tabla => tabla.s118_Codigo == this.contextMenu.menuData.item);

    this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
    
    if(fila[0]["s118_Cliente"].toUpperCase().indexOf("CONSUMO MASIVO") >= 0){
      this.portafolioMoliendaService.listarDescargasParciales_CM(this.contextMenu.menuData.item).subscribe(
        (response: listaDescargasParciales[]) => {
          this.descargasParciales = response;
          if(response.length == 0){
            this.portafolioMoliendaService.listarDescargasParciales(this.contextMenu.menuData.item).subscribe(
              (response: listaDescargasParciales[]) => {
                this.descargasParciales = response;
                this.modalService.open(listaVentaParcial,{windowClass : "my-class",centered: true,backdrop : 'static',keyboard : false});
                // clearInterval()
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              }); 
          }else{
            // this.modalService.open(listaVentaParcial,{ centered: true,size: 'lg' });
            this.modalService.open(listaVentaParcial,{windowClass : "my-class",centered: true,backdrop : 'static',keyboard : false});
            // clearInterval()
          }
          
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      if(this.companiaSelected.toString() == "17"){

        this.portafolioMoliendaService.codSAP = fila[0]['s118_contrato_externo'];

        this.portafolioMoliendaService.codigoContrato=this.contextMenu.menuData.item;
        this.modalService.open(listaDosificada,{windowClass : "my-class-Dosificadas",centered: true,backdrop : 'static',keyboard : false});
      }else{
        this.portafolioMoliendaService.listarDescargasParciales(this.contextMenu.menuData.item).subscribe(
          (response: listaDescargasParciales[]) => {
            this.descargasParciales = response;
  
            if(response.length == 0){
              this.portafolioMoliendaService.listarDescargasParciales_CM(this.contextMenu.menuData.item).subscribe(
                (response: listaDescargasParciales[]) => {
                  this.descargasParciales = response;
                  this.modalService.open(listaVentaParcial,{windowClass : "my-class",centered: true,backdrop : 'static',keyboard : false});
                  // clearInterval()
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });             
            }else{
              this.modalService.open(listaVentaParcial,{windowClass : "my-class",centered: true,backdrop : 'static',keyboard : false});
              // clearInterval()
            }          
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }); 
      }     
    }
  }

  cerrarModal(modal: any){
    this.flgModal=false;
    modal.close();
    console.log("Modal cerrado 1");
    this.portafolioMoliendaService.flgActualizar = true;
    this.getPortafolioMolienda(this.companiaSelected,this.productoSelected);
  }

  quitarmes(i:number){
    this.planificacionConsumo.splice(i,1);
  }
  agregarmes(){
    this.portafolioMoliendaService.nuevoPlanificacionConsumo(Number(this.planificacionConsumo[this.planificacionConsumo.length -1].s176_CodigoMes)).subscribe(
      (response: listaPlanificacionConsumo) => {
        this.planificacionConsumo[this.planificacionConsumo.length] = new listaPlanificacionConsumo();
        this.planificacionConsumo[this.planificacionConsumo.length - 1].s176_TM = "0";
        this.planificacionConsumo[this.planificacionConsumo.length - 1].s176_Mes = response.s176_Mes;
        this.planificacionConsumo[this.planificacionConsumo.length - 1].s176_CodigoMes = response.s176_CodigoMes;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
   
  }

  guardarCalendario(){
    this.flgGuardarCalendario = true;    
  }

  modalcerrarPortafolio(modalCierres: any){
    if(!this.validarpermisos("Usted no cuenta con permisos para realizar el cierre")){
      return;
    }
    this.flgBontongenerico = true;
    this.seleccionarTodo = false;
    this.flgDeshacerCierre = false;
    this.estadosCierresXSociedad = [];

    this.SociedadString = this.compania.filter(i => i["t033_ID"] == this.companiaSelected)[0]["t033_Name"];

    if(this.companiaSelected == null || typeof this.companiaSelected == 'undefined' || this.companiaSelected == 0)  {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar una Sociedad',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    let cont = 0
    this.listaCierreVentasMolienda = [];
    for (let item of this.productos){
      this.listaCierreVentasMolienda[cont] = new ControlCierresVentasMolienda(item);
      cont += 1;
    }

    this.portafolioMoliendaService.getEstadoPortafolioXSociedad(this.companiaSelected).subscribe(
      (response: ClosingControl[]) => {
        this.estadosCierresXSociedad = response;

      
        for (let item of this.estadosCierresXSociedad){
          for (let itemCierre of this.listaCierreVentasMolienda){
            if(item["t165_Underlying"] == Number(itemCierre.idSubyacente) ){
              itemCierre.flgEstado = false;
              itemCierre.horacierreString = item["t165_Hour"];
              let fechaCierre = (item["t165_Date"]).toString();
              itemCierre.horacierreString = fechaCierre.substring(6,8) + '/' + fechaCierre.substring(4,6) + '/' + fechaCierre.substring(0,4) + '  '
                  + itemCierre.horacierreString.substring(0,2) + ':' + itemCierre.horacierreString.substring(2,4) + ':' + itemCierre.horacierreString.substring(4,6);
            }
          }
        }

        for (let itemCierre of this.listaCierreVentasMolienda){
          itemCierre.usuarioRegistra = this.portafolioMoliendaIFDService.usuario;
          itemCierre.idSociedad = this.companiaSelected.toString();
        }

        // this.modalService.open(listaVentaParcial,{ centered: true,size: 'lg' });
        this.modalService.open(modalCierres,{windowClass : "claseCierre",centered: true,backdrop : 'static',keyboard : false});
        // clearInterval()
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  cerrarPortafolio(){
    this.flgBontongenerico = false;
    this.flgLoadingCierres = true;
    
    this.portafolioMoliendaService.realizarCierreMolienda(this.listaCierreVentasMolienda).subscribe(
          data=>{
            this.flgLoadingCierres = false;
            Swal.fire({
              icon: 'success',
              title: 'Cierre de Portafolios',
              text: 'Se realizó cierre',
              confirmButtonColor: '#0162e8'
            });
            this.flgBontongenerico = false;
            this.modalService.dismissAll();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
  }

  modalDeshacerCierrePortafolio(modalCierres: any){
    if(!this.validarpermisos("Usted no cuenta con permisos para deshacer el cierre")){
      return;
    }
    this.flgBontongenerico = true;
    this.seleccionarTodo = false;
    this.SociedadString = this.compania.filter(i => i["t033_ID"] == this.companiaSelected)[0]["t033_Name"];

    if(this.companiaSelected == null || typeof this.companiaSelected == 'undefined' || this.companiaSelected == 0)  {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar una Sociedad',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    let cont = 0
    this.listaCierreVentasMolienda = [];
    this.flgDeshacerCierre = true;

    for (let item of this.productos){
      this.listaCierreVentasMolienda[cont] = new ControlCierresVentasMolienda(item);
      cont += 1;
    }

    this.portafolioMoliendaService.getEstadoPortafolioXSociedad(this.companiaSelected).subscribe(
      (response: ClosingControl[]) => {
        this.estadosCierresXSociedad = response;

      
        for (let item of this.estadosCierresXSociedad){
          for (let itemCierre of this.listaCierreVentasMolienda){
            if(item["t165_Underlying"] == Number(itemCierre.idSubyacente) ){
              itemCierre.flgEstado = false;
              itemCierre.horacierreString = item["t165_Hour"];
              let fechaCierre = (item["t165_Date"]).toString();
              itemCierre.horacierreString = fechaCierre.substring(6,8) + '/' + fechaCierre.substring(4,6) + '/' + fechaCierre.substring(0,4) + '  '
                       + itemCierre.horacierreString.substring(0,2) + ':' + itemCierre.horacierreString.substring(2,4) + ':' + itemCierre.horacierreString.substring(4,6);
            }
          }
        }

        for (let itemCierre of this.listaCierreVentasMolienda){
          itemCierre.usuarioRegistra = this.portafolioMoliendaIFDService.usuario;
          itemCierre.idSociedad = this.companiaSelected.toString();
        }

        // this.modalService.open(listaVentaParcial,{ centered: true,size: 'lg' });
        this.modalService.open(modalCierres,{windowClass : "claseCierre",centered: true,backdrop : 'static',keyboard : false});
        // clearInterval()
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

    
  }
  
  deshacerPortafolio(){
    this.flgBontongenerico = false;
    this.flgLoadingCierres = true;
    this.portafolioMoliendaService.deshacerCierrePortafolioMolienda(this.listaCierreVentasMolienda).subscribe(
      data=>{
        this.flgLoadingCierres = false;
        Swal.fire({
          icon: 'success',
          title: 'Cierre de Portafolios',
          text: 'Se deshizo el cierre',
          confirmButtonColor: '#0162e8'
        });
        this.flgBontongenerico = true;
        this.modalService.dismissAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  exportarCierreComercial(){
    
    let datosCierre: DatosCierreComercial;   
    let caracteristicaCierre: string[][]; 
    let y = 0;
    let numero = 1;

    this.portafolioMoliendaService.getContrato(this.contextMenu.menuData.item).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        if(this.nuevoContrato.t218_GrindingProduct.toString() !== '1' && this.nuevoContrato.t218_GrindingProduct.toString() !== '2' && this.nuevoContrato.t218_GrindingProduct.toString() !== '3' && 
        this.nuevoContrato.t218_GrindingProduct.toString() !== '4' && this.nuevoContrato.t218_GrindingProduct.toString() !== '5' && this.nuevoContrato.t218_GrindingProduct.toString() !== '9' && 
        this.nuevoContrato.t218_GrindingProduct.toString() !== '10' && this.nuevoContrato.t218_GrindingProduct.toString() !== '11' && this.nuevoContrato.t218_GrindingProduct.toString() !== '13'){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No se encuentra disponible el cierre comercial para el producto seleccionado',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }

        this.portafolioMoliendaService.obtenerDatosCierreComercial(this.contextMenu.menuData.item).subscribe(
          (response: DatosCierreComercial) => {
            datosCierre = response; 
    
            this.portafolioMoliendaService.obtenerCaracteristicasCierreComercial(this.contextMenu.menuData.item).subscribe(
              (response: string[][]) => {
                caracteristicaCierre = response; 
    
                let PDF = new jsPDF('p', 'mm', 'a4', true);
          
                let fechaString = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date(datosCierre.fecha));
                let fechaInicioString = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date(datosCierre.fecInicio));
                let fechaFinString = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date(datosCierre.fechFin));
        
                PDF.setFont('times',"italic").setFontSize(11);
                PDF.text('Fecha '+ (new Date(datosCierre.fecha).getDate()) +' de '+ fechaString.charAt(0).toUpperCase() + fechaString.slice(1) +' de ' + (new Date(datosCierre.fecha).getFullYear()), 155 ,10);
                
                y = 28;
                PDF.setFont('arial', 'normal','bold').setFontSize(16);
                PDF.text('CONFIRMACION DE VENTA ' + datosCierre.contrato , 60, y);
            
                y = y + 15;
                PDF.setFontSize(14);
                PDF.text('COMPRADOR', 15, y);
                PDF.text(': '+ datosCierre.cliente.toUpperCase() +'.', 80, y);
            
                y = y + 10;
                PDF.text('VENDEDOR ', 15, y);
                PDF.text(': '+ datosCierre.sociedad.toUpperCase(), 80, y);
                     
                y = y + 5;
                PDF.line(10,y,200,y);
            
                y = y + 7;
                PDF.setFont('arial', 'normal').setFontSize(11);
                PDF.text('El Vendedor y el Comprador, han confirmado en la fecha el Contrato de Compra/Venta, de acuerdo a los ', 15, y);
                PDF.text('siguientes términos y condiciones: ', 15, 71);
            
                y = y + 13;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero + '. PRODUCTO: ', 15, y); 

                let partidaArancel="";
            
                PDF.setFont('arial', 'normal').setFontSize(12);
                if(this.nuevoContrato.t218_GrindingProduct.toString() == '3'){
                  datosCierre.producto = 'ACEITE CRUDO DE SOYA DE ORIGEN BOLIVIANO A GRANEL '
                }else if(this.nuevoContrato.t218_GrindingProduct.toString() == '5'){
                  datosCierre.producto = 'Integral de Soya en Sacos '
                  partidaArancel = "1208.10.00.00";
                }else if(this.nuevoContrato.t218_GrindingProduct.toString() == '2'){
                  datosCierre.producto = 'Harina (Torta) de Girasol '
                  partidaArancel = "2306.30.00.00";
                }else if(this.nuevoContrato.t218_GrindingProduct.toString() == '4'){
                  datosCierre.producto = 'Aceite Crudo de Girasol a Granel '
                  partidaArancel = "1512.11.10";
                }else if(this.nuevoContrato.t218_GrindingProduct.toString() == '11' || this.nuevoContrato.t218_GrindingProduct.toString() == '13'){
                  datosCierre.producto = 'Grano de soya '
                  partidaArancel = "1201.90.00.00";
                }else if(this.nuevoContrato.t218_GrindingProduct.toString() == '1' || this.nuevoContrato.t218_GrindingProduct.toString() == '9'){
                  partidaArancel = "2304.00.00.00";
                }

                PDF.text( datosCierre.producto , 55, y);

                if(this.nuevoContrato.t218_GrindingProduct.toString() == '1' || this.nuevoContrato.t218_GrindingProduct.toString() == '11' || this.nuevoContrato.t218_GrindingProduct.toString() == '13'){
                  y = y + 7;
                  numero += 1 ;
                  PDF.setFont('arial', 'normal','bold').setFontSize(12);
                  PDF.text(numero +'. ORIGEN: ', 15, y);

                  PDF.setFont('arial', 'normal').setFontSize(12);
                  PDF.text('Boliviano', 55, y);
                }

                y = y + 7;

                if(this.nuevoContrato.t218_GrindingProduct.toString() !== '3'){
                  PDF.setFont('arial', 'normal','bold').setFontSize(12);
                  PDF.text('PARTIDA ARANCELARIA: ', 110, y);

                  PDF.setFont('arial', 'normal').setFontSize(12);
                  PDF.text(partidaArancel, 165, y);
                }
                
                numero += 1 ;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                if(this.nuevoContrato.t218_GrindingProduct.toString() == '11' || this.nuevoContrato.t218_GrindingProduct.toString() == '13'){
                  PDF.text(numero + '. CARACTERISTICAS: Anec 41 ', 15, y);
                }else{
                  PDF.text(numero + '. CARACTERISTICAS ', 15, y);
                }                
            
                y = y + 6;
                
                for (let item of caracteristicaCierre){
                  if( item[1] == 'SUBTITULO'){
                    PDF.setFont('arial', 'normal','bold').setFontSize(10);
                    PDF.text( item[0] , 20, y);
                  }else if(item[1] == ''){
                    PDF.setFont('arial', 'normal').setFontSize(10);
                    PDF.text( item[0] , 20, y);
                  }else{
                    PDF.setFont('arial', 'normal').setFontSize(10);
                    PDF.text( item[0] + '  :  ' + item[1], 20, y);
                  }
                  y = y + 6;
                }
                if(this.nuevoContrato.t218_GrindingProduct.toString() == '4'){
                  PDF.setFont('arial', 'normal').setFontSize(10);
                  PDF.text('Se permiten los siguientes desvíos/bonificaciones según estas escalas de tolerancias aplicables en base  ', 20, y);
                  y = y + 6;
                  PDF.text('al precio FOB; Ácidos grasos libres como oleico (En peso molecular 282) por encima de 2% hasta 3%', 20, y);
                  y = y + 6;
                  PDF.text('descuentos .1%: .1% en fracciones proporcionales. ', 20, y);
                  y = y + 6;
                }
                
    
                if(this.nuevoContrato.t218_GrindingProduct.toString() == '1' || this.nuevoContrato.t218_GrindingProduct.toString() == '9' ||
                   this.nuevoContrato.t218_GrindingProduct.toString() == '11' || this.nuevoContrato.t218_GrindingProduct.toString() == '13'){
                  y = y + 3;
                  numero += 1 ;        
                  PDF.setFont('arial', 'normal','bold').setFontSize(12);
                  PDF.text(numero+'. TOLERANCIAS ', 15, y);
              
                  y = y + 6;
                  PDF.setFont('arial', 'normal').setFontSize(12);
                  if(this.nuevoContrato.t218_GrindingProduct.toString() == '1' || this.nuevoContrato.t218_GrindingProduct.toString() == '9'){
                    PDF.text('Ambas partes aceptan tolerancias del 1% o fracción por cada un 1% o fracción de exceso o deficiencia de ', 20, y);
                    y = y + 5;
                    PDF.text('proteína, el cual será calculado sobre el valor total del producto (Costo y Flete).  Sin embargo, la Harina ', 20, y);
                    y = y + 5;
                    PDF.text('no podrá tener menos de 46.5% de proteína.', 20, y);
                  }else{
                    PDF.text('De acuerdo a lo establecido en contrato Anec 41 ', 20, y);
                  }
                }

                if(this.nuevoContrato.t218_GrindingProduct.toString() == '4'){
                  y = y + 3;
                  numero += 1 ;        
                  PDF.setFont('arial', 'normal','bold').setFontSize(12);
                  PDF.text(numero+'. REGLAS QUE GOBIERNAN ', 15, y);
              
                  y = y + 6;
                  // PDF.setFont('arial', 'normal').setFontSize(12);
                  // if(this.nuevoContrato.t218_GrindingProduct.toString() == '1' || this.nuevoContrato.t218_GrindingProduct.toString() == '9'){
                  //   PDF.text('Los demás términos y condiciones según FOFSA 54 ', 20, y);
                  //   y = y + 5;
                  //   PDF.text('3 Ultimas cargas limpias/sin plomo/ultima carga que no esté en la lista prohibición de FOSFA 1990 ', 20, y);
                  //   y = y + 5;
                  //   PDF.text('Se aceptan tanques de acero templado recubiertos de Zinc', 20, y);
                  //   y = y + 5;
                  //   PDF.text('Commingling no permitido', 20, y);
                  // }

                  if(this.nuevoContrato.t218_GrindingProduct.toString() == '4'){
                    PDF.setFont('arial', 'normal').setFontSize(12);
                    PDF.text( ' Los demás términos y condiciones según FOFSA 54 ', 20, y);
                    y = y + 5;
                    PDF.text('3 Ultimas cargas limpias/sin plomo/ultima carga que no esté en la lista prohibición de FOSFA 1990 ', 20, y);
                    y = y + 5;
                    PDF.text('Se aceptan tanques de acero templado recubiertos de Zinc', 20, y);
                    y = y + 5;
                    PDF.text('Commingling no permitido.', 20, y);
                  }
                }
                
                y = y + 7;
                numero += 1 ;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero+'. CANTIDAD ', 15, y);
            
                y = y + 6;
                PDF.setFont('arial', 'normal').setFontSize(12);
                PDF.text( datosCierre.tm.toLocaleString('es-MX') + ' Toneladas Métricas, a granel '+ parseFloat((datosCierre.tolerancia * 100).toString()).toFixed(2)+"%" +' más o menos a opción del comprador, al precio del Contrato', 20, y);
            
                y = y + 9;
                numero += 1 ;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero+'. PRECIO :', 15, y);
            
                PDF.setFont('arial', 'normal').setFontSize(12);
                PDF.text( 'US$ '+ datosCierre.precio.toLocaleString('es-MX')+ ' / Tonelada Métrica ' , 52, y);
            
                y = y + 9;
                numero += 1 ;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero+'. PAGO : ', 15, y);
            
                PDF.setFont('arial', 'normal').setFontSize(12);
                if(this.nuevoContrato.t218_GrindingProduct.toString() == '2'){
                  PDF.text( '30 días de la fecha de factura.' , 52, y);
                }else if(this.nuevoContrato.t218_GrindingProduct.toString() == '4'){
                  PDF.text( 'Transferencia Bancaria a 48 horas de recibir la factura comercial.' , 52, y);
                }else{
                  PDF.text( '45 días de emitida la factura comercial.' , 52, y);
                }
    
                if(y > 230){
                  PDF.addPage();
                  y = 20;
                }
                
                y = y + 9;
                numero += 1 ;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero+'. PERÍODO DE DESPACHO :   ', 15, y);
            
                y = y + 6;
                PDF.setFont('arial', 'normal').setFontSize(12);
                PDF.text( ' '+ (new Date(datosCierre.fecInicio).getDate()) + ' '+fechaInicioString.charAt(0).toUpperCase() + fechaInicioString.slice(1) + ' - '+ (new Date(datosCierre.fechFin).getDate()) + ' '+fechaFinString.charAt(0).toUpperCase() + fechaFinString.slice(1), 20, y);
            
                if(y > 230){
                  PDF.addPage();
                  y = 20;
                }
    
                y = y + 9;
                numero += 1 ;
                
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero+'. INCOTERM :   ', 15, y); 
        
                PDF.setFont('arial', 'normal').setFontSize(12);
                PDF.text( datosCierre.ticker + ' ' + datosCierre.puertoDestino, 52, y);

                if(((this.nuevoContrato.t218_GrindingProduct.toString() == '1' || this.nuevoContrato.t218_GrindingProduct.toString() == '11' || this.nuevoContrato.t218_GrindingProduct.toString() == '13' || this.nuevoContrato.t218_GrindingProduct.toString() == '9') &&   (this.nuevoContrato.t218_GrindingCustomer.toString() !== '4')) || (this.nuevoContrato.t218_GrindingProduct.toString() == '11' || this.nuevoContrato.t218_GrindingProduct.toString() == '13')){
                  if(y > 230){
                    PDF.addPage();
                    y = 20;
                  }
      
                  y = y + 9;
                  numero += 1 ;
                  
                  PDF.setFont('arial', 'normal','bold').setFontSize(12);
                  PDF.text(numero+'. PUERTO DE DESCARGA :   ', 15, y); 
          
                  PDF.setFont('arial', 'normal').setFontSize(12);
                  PDF.text( datosCierre.puertoDestino, 74, y);
  
                  if(y > 230){
                    PDF.addPage();
                    y = 20;
                  }
  
                  y = y + 9;
                  numero += 1 ;
                  
                  PDF.setFont('arial', 'normal','bold').setFontSize(12);
                  PDF.text(numero+'. EN TRANSITO FINAL A :   ', 15, y); 
          
                  PDF.setFont('arial', 'normal').setFontSize(12);
                  if((this.nuevoContrato.t218_GrindingProduct.toString() == '11' || this.nuevoContrato.t218_GrindingProduct.toString() == '13')){
                    PDF.text( 'SALAVERRY, PERU ', 72, y); 
                  }else{
                    PDF.text( 'GUAYAQUIL, ECUADOR ', 72, y); 
                  }                  

                }

                if(this.nuevoContrato.t218_GrindingProduct.toString() == '3'){
                  if(y > 230){
                    PDF.addPage();
                    y = 20;
                  }
                  
                  y = y + 9;
                  numero += 1 ;
                  PDF.setFont('arial', 'normal','bold').setFontSize(12);
                  PDF.text(numero+'. TÉRMINOS DE EMBARQUE :   ', 15, y);
          
                  y = y + 6;
                  PDF.setFont('arial', 'normal').setFontSize(12);
                  PDF.text( 'Los términos del contrato son Costo & flete.', 20, y);
                  
                }
                
                if(y > 230){
                  PDF.addPage();
                  y = 20;
                }
                
                y = y + 9;
                numero += 1 ;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero+'. CONDICIONES DE PESO Y CALIDAD :   ', 15, y);
        
                y = y + 6;
                PDF.setFont('arial', 'normal').setFontSize(12);
                PDF.text( 'Son finales al embarque de acuerdo a los certificados emitidos por la empresa verificadora independiente.', 20, y);
                
                if(y > 230){
                  PDF.addPage();
                  y = 20;
                }
    
                y = y + 9;
                numero += 1 ;
                PDF.setFont('arial', 'normal','bold').setFontSize(12);
                PDF.text(numero+'. OTROS TÉRMINOS Y CONDICIONES :   ', 15, y);
        
                y = y + 6;
                PDF.setFont('arial', 'normal').setFontSize(12);
                PDF.text( 'Todos los impuestos fuera de Bolivia no indicados en este Contrato, son por cuenta del Comprador.', 20, y);
                if(this.nuevoContrato.t218_GrindingProduct.toString() == '3'){
                  y = y + 5;
                  PDF.text( 'Reglas Gobernantes FOSFA 40.', 20, y);
                }


                if(this.nuevoContrato.t218_GrindingProduct.toString() == '4'){
                  if(y > 230){
                    PDF.addPage();
                    y = 20;
                  }

                  y = y + 6;
                  PDF.setFont('arial', 'normal').setFontSize(12);
                  PDF.text( 'El Comprador y el Vendedor, expresamente aceptan y acuerdan que los términos aquí señalados, serán ', 20, y);
                  y = y + 5;
                  PDF.text('aquellos que gobiernen el Contrato entre las partes y que todos los términos y condiciones, excepto aquellos ', 20, y);
                  y = y + 5;
                  PDF.text('que entren en conflicto con estos términos, tendrán que ser en concordancia con el Contrato ', 20, y);
                  y = y + 5;
                  PDF.text('Fosfa 51 y arbitraje a través del Gafta 125.', 20, y);
                }else if(this.nuevoContrato.t218_GrindingProduct.toString() == '2'){
                  if(y > 230){
                    PDF.addPage();
                    y = 20;
                  }

                  y = y + 6;
                  PDF.setFont('arial', 'normal').setFontSize(12);
                  PDF.text( 'El Comprador y el Vendedor, expresamente aceptan y acuerdan que los términos aquí señalados, serán ', 20, y);
                  y = y + 5;
                  PDF.text('aquellos que gobiernen el Contrato entre las partes y que todos los términos y condiciones, excepto aquellos ', 20, y);
                  y = y + 5;
                  PDF.text('que entren en conflicto con estos términos, tendrán que ser en concordancia con el Contrato Gafta 100 y', 20, y);
                  y = y + 5;
                  PDF.text('arbitraje a través del Gafta 125.', 20, y);
                }
                
            
                PDF.save('Confirmacion.pdf');
                
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });        
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });

      },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }); 
    

  }
  modalConsultaHistorica(consultaHistorica: any){
    this.campagnasSeleccionadas = [];
    this.ConsultaFactura = null;
    this.ConsultaSociedad = null;
    this.flgFechaConsultaHistorica = false;
    this.codigosConsultaHistorica = "";


    this.portafolioMoliendaService.getComboXTabla('T226_ContractStatus').subscribe(
      (response: cargaCombo[]) => {
        this.comboFactura = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('consultaCampagna').subscribe(
        (response: cargaCombo[]) => {
          this.ConsultaHistoricacampania = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });

    this.modalService.open(consultaHistorica,{windowClass : "claseConsulta",centered: true,backdrop : 'static',keyboard : false});    
  }
  exportarConsulta(consultaHistorica: any){
    let fechaInicio='0';
    let fechaFin='0';

    if((this.ConsultaSociedad == undefined || this.ConsultaSociedad == null) && this.codigosConsultaHistorica == "" ){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar una sociedad',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    if((this.ConsultaSociedad == undefined || this.ConsultaSociedad == null) && (this.ConsultaFactura == undefined || this.ConsultaFactura == null) && 
    (this.campagnasSeleccionadas == undefined || this.campagnasSeleccionadas.length == 0) && this.codigosConsultaHistorica == "" ){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar las opciones',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    if(this.ConsultaSociedad !== undefined && this.ConsultaSociedad !== null){
      let campaniasString = "";
      if(this.campagnasSeleccionadas !== undefined){
        for (let item of this.campagnasSeleccionadas){
          campaniasString = campaniasString +item+","
        }
      }
      if(this.ConsultaFactura  == undefined){
        this.ConsultaFactura = '0'
      }
      if(this.flgFechaConsultaHistorica){
        fechaInicio = this.dateToString(this.fechInicio);
        fechaFin = this.dateToString(this.fechFin);
        if(fechaInicio>fechaFin){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'La fecha de inicio no puede ser mayor a la fecha fin',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }
      }
      
      this.portafolioMoliendaService.obtenerConsultaHistorica(this.ConsultaFactura,fechaInicio,fechaFin,campaniasString,this.ConsultaSociedad).subscribe(
        (response: consultaHistorica[]) => {
          let consultaHistorica = response; 
            const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(consultaHistorica);
    
            ws['A1'].v = 'Código';
            ws['B1'].v = 'Contrato Sociedad';
            ws['C1'].v = 'Contrato Externo';
            ws['D1'].v = 'Código Barco';
            ws['E1'].v = 'Comentario';
            ws['F1'].v = 'Fecha';
            ws['G1'].v = 'Registrado';
            ws['H1'].v = 'Compra/Venta';
            ws['I1'].v = 'Cliente';
            ws['J1'].v = 'Zona';
            ws['K1'].v = 'Producto';
            ws['L1'].v = 'Orígen';
            ws['M1'].v = 'Inicio Carga';
            ws['N1'].v = 'Fin Carga';
            ws['O1'].v = 'Contrato Futuro';
            ws['P1'].v = 'Campaña';
            ws['Q1'].v = 'Puerto Origen';
            ws['R1'].v = 'Puerto Destino';
            ws['S1'].v = 'Incoterm';
            ws['T1'].v = 'Facturado';
            ws['U1'].v = 'Sociedad';
            ws['V1'].v = 'Tipo Precio';
            ws['W1'].v = 'Barco';
            ws['X1'].v = 'Sociedad Nutrición Animal';
            ws['Y1'].v = 'Wash Out';
            ws['Z1'].v = 'TM Total';
            ws['AA1'].v = 'TM Facturada';
            ws['AB1'].v = 'TM Por Facturar';
            ws['AC1'].v = 'Caks';
            ws['AD1'].v = 'Tolerancia';
            ws['AE1'].v = 'Precio Final';
            ws['AF1'].v = 'FOB';
            ws['AG1'].v = 'Flete';
            ws['AH1'].v = 'CFR';
            ws['AI1'].v = 'Flat USD';
            ws['AJ1'].v = 'Fijado Flat TM';
            ws['AK1'].v = 'Saldo Flat TM';
            ws['AL1'].v = 'Fijado Caks';
            ws['AM1'].v = 'Saldo Caks';
            ws['AN1'].v = 'Futuro';
            ws['AO1'].v = 'Fijado Futuro TM';
            ws['AP1'].v = 'Saldo Futuro TM';
            ws['AQ1'].v = 'Fijado Caks';
            ws['AR1'].v = 'Saldo Caks';
            ws['AS1'].v = 'Base';
            ws['AT1'].v = 'Fijado Base TM';
            ws['AU1'].v = 'Saldo Base TM';
            ws['AV1'].v = 'Fijado Base CAKS';
            ws['AW1'].v = 'Saldo Base CAKS';
            ws['AX1'].v = 'ASK';
            ws['AY1'].v = 'BID';
            ws['AZ1'].v = 'MID';
            ws['BA1'].v = 'Bonificación $/tm';
            ws['BB1'].v = 'Comisión Bróker $/tm';
            ws['BC1'].v = 'Comision $/tm';
            ws['BD1'].v = 'Costo ensacado $/tm';
            ws['BE1'].v = 'Descuento $/tm';
            ws['BF1'].v = 'DVA Fijo Negociado $/tm';
            ws['BG1'].v = 'DVA FOB Fijado $/tm';
            ws['BH1'].v = 'DVA FOB Publicado $/tm';
            ws['BI1'].v = 'Extra costos $/tm';
            ws['BJ1'].v = 'Extra Prima $/tm';
            ws['BK1'].v = 'Flete Barcazas $/tm';
            ws['BL1'].v = 'Flete Marítimo $/tm';
            ws['BM1'].v = 'Flete Terrestre $/tm';
            ws['BN1'].v = 'Fobbings $/tm';
            ws['BO1'].v = 'Otros costos logisticos $/tm';
            ws['BP1'].v = 'Pickup Flete $/tm';
            ws['BQ1'].v = 'Premio Calidad $/tm';
            ws['BR1'].v = 'Premio Integral $/tm';
            ws['BS1'].v = 'Premio local $/tm';
            ws['BT1'].v = 'Sustento';
            ws['BU1'].v = 'Fecha Factura';
    
              /* generate workbook and add the worksheet */
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'ConsultaHistorica');
    
              this.modalService.dismissAll(consultaHistorica);
      
              /* save to file */  
              XLSX.writeFile(wb, "ReporteHistorico.xlsx");
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });

    }else{
      this.portafolioMoliendaService.obtenerConsultaHistoricaEspecifico(this.codigosConsultaHistorica).subscribe(
        (response: consultaHistoricaEspecifica) => {
          let consultaHistoricaEspecifica = response; 

          let exportarConsulta:string[][] = [];
          let cont = 0;
      
          for (let item of consultaHistoricaEspecifica.listaFormacionPrecios){
            exportarConsulta[cont] = [];
            exportarConsulta[cont][1] = item.s115_SalesContract;
            exportarConsulta[cont][2] = item.s115_Trayecto;
            exportarConsulta[cont][3] = item.s115_Concepto;
            exportarConsulta[cont][4] = item.s115_SumaResta;
            exportarConsulta[cont][5] = item.s115_Valor;
            // exportarConsulta[cont][5] = (Number(item.s115_Valor) / this.factorMetricTonPrice).toString();
            exportarConsulta[cont][6] = item.s115_DVAValorReferencial;
            exportarConsulta[cont][7] = item.s115_DVAPublicado;
            exportarConsulta[cont][8] = item.s115_DVANegociado;
            exportarConsulta[cont][9] = item.s115_FechaBenchmark;
            exportarConsulta[cont][10] = item.s115_OrigenBenchmark;
            exportarConsulta[cont][11] = item.s115_MesBenchmark;
            exportarConsulta[cont][12] = item.s115_PosturaBenchmark;
            exportarConsulta[cont][13] = item.s115_Benchmark;
            cont += 1;
                
          }

            // delete consultaHistoricaEspecifica.listaBases[0];

            consultaHistoricaEspecifica.listaBases.forEach(object => {
              delete object['t016_Date'];
            });
            consultaHistoricaEspecifica.listaFuturos.forEach(object => {
              delete object['t016_Date'];
            });
            consultaHistoricaEspecifica.listaFlats.forEach(object => {
              delete object['t016_Date'];
            });

            const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(consultaHistoricaEspecifica.consultaBase);
            const ws1: XLSX.WorkSheet =XLSX.utils.json_to_sheet(consultaHistoricaEspecifica.listaBases);
            const ws2: XLSX.WorkSheet =XLSX.utils.json_to_sheet(consultaHistoricaEspecifica.listaFlats);
            const ws3: XLSX.WorkSheet =XLSX.utils.json_to_sheet(consultaHistoricaEspecifica.listaFuturos);
            const ws4: XLSX.WorkSheet =XLSX.utils.json_to_sheet(exportarConsulta);
    
            ws['A1'].v = 'Código';
            ws['B1'].v = 'Contrato Sociedad';
            ws['C1'].v = 'Contrato Externo';
            ws['D1'].v = 'Código Barco';
            ws['E1'].v = 'Comentario';
            ws['F1'].v = 'Fecha';
            ws['G1'].v = 'Registrado';
            ws['H1'].v = 'Compra/Venta';
            ws['I1'].v = 'Cliente';
            ws['J1'].v = 'Zona';
            ws['K1'].v = 'Producto';
            ws['L1'].v = 'Orígen';
            ws['M1'].v = 'Inicio Carga';
            ws['N1'].v = 'Fin Carga';
            ws['O1'].v = 'Contrato Futuro';
            ws['P1'].v = 'Campaña';
            ws['Q1'].v = 'Puerto Origen';
            ws['R1'].v = 'Puerto Destino';
            ws['S1'].v = 'Incoterm';
            ws['T1'].v = 'Facturado';
            ws['U1'].v = 'Sociedad';
            ws['V1'].v = 'Tipo Precio';
            ws['W1'].v = 'Barco';
            ws['X1'].v = 'Sociedad Nutrición Animal';
            ws['Y1'].v = 'Wash Out';
            ws['Z1'].v = 'TM Total';
            ws['AA1'].v = 'TM Facturada';
            ws['AB1'].v = 'TM Por Facturar';
            ws['AC1'].v = 'Caks';
            ws['AD1'].v = 'Tolerancia';
            ws['AE1'].v = 'Precio Final';
            ws['AF1'].v = 'FOB';
            ws['AG1'].v = 'Flete';
            ws['AH1'].v = 'CFR';
            ws['AI1'].v = 'Flat USD';
            ws['AJ1'].v = 'Fijado Flat TM';
            ws['AK1'].v = 'Saldo Flat TM';
            ws['AL1'].v = 'Fijado Caks';
            ws['AM1'].v = 'Saldo Caks';
            ws['AN1'].v = 'Futuro';
            ws['AO1'].v = 'Fijado Futuro TM';
            ws['AP1'].v = 'Saldo Futuro TM';
            ws['AQ1'].v = 'Fijado Caks';
            ws['AR1'].v = 'Saldo Caks';
            ws['AS1'].v = 'Base';
            ws['AT1'].v = 'Fijado Base TM';
            ws['AU1'].v = 'Saldo Base TM';
            ws['AV1'].v = 'Fijado Base CAKS';
            ws['AW1'].v = 'Saldo Base CAKS';
            ws['AX1'].v = 'ASK';
            ws['AY1'].v = 'BID';
            ws['AZ1'].v = 'MID';
            ws['BA1'].v = 'Bonificación $/tm';
            ws['BB1'].v = 'Comisión Bróker $/tm';
            ws['BC1'].v = 'Comision $/tm';
            ws['BD1'].v = 'Costo ensacado $/tm';
            ws['BE1'].v = 'Descuento $/tm';
            ws['BF1'].v = 'DVA Fijo Negociado $/tm';
            ws['BG1'].v = 'DVA FOB Fijado $/tm';
            ws['BH1'].v = 'DVA FOB Publicado $/tm';
            ws['BI1'].v = 'Extra costos $/tm';
            ws['BJ1'].v = 'Extra Prima $/tm';
            ws['BK1'].v = 'Flete Barcazas $/tm';
            ws['BL1'].v = 'Flete Marítimo $/tm';
            ws['BM1'].v = 'Flete Terrestre $/tm';
            ws['BN1'].v = 'Fobbings $/tm';
            ws['BO1'].v = 'Otros costos logisticos $/tm';
            ws['BP1'].v = 'Pickup Flete $/tm';
            ws['BQ1'].v = 'Premio Calidad $/tm';
            ws['BR1'].v = 'Premio Integral $/tm';
            ws['BS1'].v = 'Premio local $/tm';
            ws['BT1'].v = 'Sustento';
            ws['BU1'].v = 'Fecha Factura';
    
            if(consultaHistoricaEspecifica.listaFlats.length > 0){
              //Lista de Flats
              ws2['A1'].v = 'Fecha';
              ws2['B1'].v = 'Operación';
              ws2['C1'].v = 'Precio';
              ws2['D1'].v = 'TM';
              ws2['E1'].v = 'Comentario';
              ws2['F1'].v = 'Caks';
              ws2['G1'].v = 'Contrato Venta';
              ws2['H1'].v = 'Compra/Venta';
              ws2['I1'].v = 'Modificado';
            }

            if(consultaHistoricaEspecifica.listaBases.length > 0){
              //Lista de Bases
              ws1['A1'].v = 'Fecha';
              ws1['B1'].v = 'TM';
              ws1['C1'].v = 'Operación';
              ws1['D1'].v = 'Comentario';
              ws1['E1'].v = 'Precio';
              ws1['F1'].v = 'Contrato Venta';
              ws1['G1'].v = 'Caks';
              ws1['H1'].v = 'Compra/Venta';
              ws1['I1'].v = 'Modificado';

              // ws1['B1'].v = 'Contrato Venta';
              // ws1['C1'].v = 'Caks';
              // ws1['D1'].v = 'Operación';
              // ws1['E1'].v = 'TM';
              // ws1['F1'].v = 'Precio';
              // ws1['G1'].v = 'Compra/Venta';
              // ws1['H1'].v = 'Modificado';
            }
            
            if(consultaHistoricaEspecifica.listaFuturos.length > 0){
              //Lista de Futuros
               ws3['A1'].v = 'Fecha';
               ws3['B1'].v = 'Operación';
               ws3['C1'].v = 'TM';
               ws3['D1'].v = 'Comentario';
               ws3['E1'].v = 'Precio USD';
               ws3['F1'].v = 'Contrato Venta';
               ws3['G1'].v = 'Caks';
               ws3['H1'].v = 'Compra/Venta';
               ws3['I1'].v = 'Modificado';

              //  ws3['A1'].v = 'Fecha';
              //  ws3['B1'].v = 'Contrato Venta';
              //  ws3['C1'].v = 'Caks';
              //  ws3['D1'].v = 'TM';
              //  ws3['E1'].v = 'Operación';
              //  ws3['F1'].v = 'Precio USD';
              //  ws3['G1'].v = 'Compra/Venta';
              //  ws3['H1'].v = 'Modificado';
            }


            if(consultaHistoricaEspecifica.listaFormacionPrecios.length > 0){
              //Lista Formación de precios
              ws4['A1'].v = 'Contrato';
              ws4['B1'].v = 'Destino';
              ws4['C1'].v = 'Concepto';
              ws4['D1'].v = 'Suma/Resta';
              ws4['E1'].v = 'USD/TM';
              // ws4['F1'].v = 'this.ticker';
              ws4['F1'].v = 'DVA - Valor Referencial USD/TM';
              ws4['G1'].v = 'DVA - Publicado %';
              ws4['H1'].v = 'DVA - Negociado %';
              ws4['I1'].v = 'Benchmark - Fecha';
              ws4['J1'].v = 'Benchmark - Orígen';
              ws4['K1'].v = 'Benchmark - Mes';
              ws4['L1'].v = 'Benchmark - Postura';
              ws4['M1'].v = 'Benchmark ';
            }
          
              /* generate workbook and add the worksheet */
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'ConsultaHistorica');
              XLSX.utils.book_append_sheet(wb, ws1, 'ConsultaBase');
              XLSX.utils.book_append_sheet(wb, ws2, 'ConsultaFlat');
              XLSX.utils.book_append_sheet(wb, ws3, 'ConsultaFuturo');
              XLSX.utils.book_append_sheet(wb, ws4, 'ConsultaFormacionPrecios');
    
              this.modalService.dismissAll(consultaHistorica);
      
              /* save to file */  
              XLSX.writeFile(wb, "ReporteHistorico.xlsx");
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
        

    

  }

  reporteDelDia(){
    if(!this.validarpermisos("Usted no cuenta con permisos para enviar reporte diario")){
      return;
    }

    if(this.companiaSelected==0){
      Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Es necesario seleccionar una Sociedad',
      confirmButtonColor: '#0162e8',
      customClass: {
        container: 'my-swal'
      }
      });
      return;
    }

    this.portafolioMoliendaService.reporteDelDia(this.companiaSelected).subscribe(
      (response: number) => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte del día',
          text: 'Se envió el reporte del día mediante correo',
          confirmButtonColor: '#0162e8'
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });  
  }
  seleccionarTodoCierre(){
    if(this.seleccionarTodo){
      for (let itemCierre of this.listaCierreVentasMolienda){
        if(!this.flgDeshacerCierre){
          if(itemCierre.flgEstado){
            itemCierre.flgCerrar = true;
          }
        }else{
          if(!itemCierre.flgEstado){
            itemCierre.flgCerrar = true;
          }
        }
      }
    }else{
      for (let itemCierre of this.listaCierreVentasMolienda){
        itemCierre.flgCerrar = false;
      }
    }
  }
  mostrarIngresoBarco(){
    if(this.flgAgregarBarco){
      this.flgAgregarBarco = false;
    }else{
      this.flgAgregarBarco = true;
    }
  }

  guardarNuevoBarco(){
    if(this.txtNuevoBarco == ""){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar el nombre del barco',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    let nuevoBarco: Shipment = new Shipment;

    nuevoBarco.t051_Description = this.txtNuevoBarco;
    nuevoBarco.t051_Status = 1;
    nuevoBarco.t051_Company = 7;
    nuevoBarco.t051_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    
    Swal.fire({
      icon: 'warning',
      title: 'Consulta',
      html: '¿Desea ingresar nuevo barco con nombre <b>' + this.txtNuevoBarco + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.guardarBarco(nuevoBarco).subscribe(
          (response: Shipment) => {
            nuevoBarco = response;
            this.portafolioMoliendaService.getCombo('barco').subscribe(
              (response: cargaCombo[]) => {
                this.barcos = response;
                this.nuevoContrato.t218_Shipment = nuevoBarco.t051_ID.toString();
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
            });
            Swal.fire({
              title: 'Barco Agregado',
              html: 'Se guardó correctamente el barco <b>' + nuevoBarco.t051_Description + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
          },
          (error: HttpErrorResponse) => {
            if(error.error.message.includes('ConstraintViolationException')){
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
    })

    this.flgAgregarBarco = false;
  }

  validarPortafolioCerrado(){
    if(this.estadoPortafolio.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El Portafolio se encuentra Cerrado, las operaciones ingresadas se reflejarán en el Cálculo de Límites en T+1',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
    }
  }

  validarpermisos(comentario: string): boolean{
    if(!this.usuarioRegistra){
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

  seleccionarFiltro() {
    
      this.filterValue.s118_Cliente = (this.clientefiltrado);
      this.portafolioDS.filter = JSON.stringify(this.filterValue);

      this.filterValue.s118_Producto = (this.productofiltrado);
      this.portafolioDS.filter = JSON.stringify(this.filterValue);

      this.filterValue.s118_puerto_destino = (this.destinofiltrado);
      this.portafolioDS.filter = JSON.stringify(this.filterValue);
  
  this.getFormsValue();
}

  getFormsValue() {

    this.portafolioDS.filterPredicate = (data, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      let isClienteAvailable = false;
      let isProductoAvailable = false;
      let isDestinoAvailable = false;
      let isCodigoAvailable = false;
      if(searchString.s118_Cliente !== undefined){
        if (searchString.s118_Cliente.length) {
          for (const d of searchString.s118_Cliente) {
            if (data.s118_Cliente.trim() === d.trim()) {
              isClienteAvailable = true;
            }
          }
        } else {
          isClienteAvailable = true;
        }
      }else{
        isClienteAvailable = true;
      }
      
      if(searchString.s118_puerto_destino !== undefined){
      if (searchString.s118_puerto_destino.length) {
        for (const d of searchString.s118_puerto_destino) {
          if (data.s118_puerto_destino.trim() === d.trim()) {
            isProductoAvailable = true;
          }
        }
      } else {
        isProductoAvailable = true;
      }}else {
        isProductoAvailable = true;
      }
      if(searchString.s118_Producto !== undefined){
      if (searchString.s118_Producto.length) {
        for (const d of searchString.s118_Producto) {
          if (data["s118_Producto"].trim() === d.trim()) {
            isDestinoAvailable = true;
          }
        }
      } else {
        isDestinoAvailable = true;
      }}else {
        isDestinoAvailable = true;
      }
      if(searchString.s118_Codigo !== undefined && searchString.s118_Codigo !== null){
      if (searchString.s118_Codigo.toString().length) {
        isCodigoAvailable = data.s118_Codigo.toString().trim().toLowerCase().indexOf(searchString.s118_Codigo.toString().toLowerCase()) !== -1
      } else {
        isCodigoAvailable = true;
      }}else {
        isCodigoAvailable = true;
      }
      const resultValue = isClienteAvailable && isProductoAvailable && isDestinoAvailable && isCodigoAvailable  
        // data.s118_puerto_destino.toString().trim().toLowerCase().indexOf(searchString.s118_puerto_destino.toLowerCase()) !== -1 &&
        // data["s118_Producto"].toString().trim().toLowerCase().indexOf(searchString.s118_Producto.toLowerCase()) !== -1;
        
      return resultValue;
    }
    
    this.portafolioDS.filter = JSON.stringify(this.filterValue);
  }

//   guardarContrato(data) {
//     // // alert("Entered Email id : " + data.contrato);
//     // sessionStorage.setItem('id', data.id);
//     // // retrieving from the session//
//     // var data
//     // data = sessionStorage.getItem('id');
//     // // = sessionStorage.getItem('id');
//     // console.log(data) //to see the id in the console
//  }

  // ngAfterViewInit() {
  //   let dataTable1 = new DataTable("#myTable1", {
  //     searchable: true,
  //     fixedHeight: true,
  //   });

  // }


}
