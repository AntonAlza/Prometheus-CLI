import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Companias } from 'src/app/models/Fisico/companias';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { LibroFisicoOpenShipments } from 'src/app/models/Fisico/Consumo Masivo/LibroFisicoOpenShipments';
import { Society } from 'src/app/models/Fisico/Society';
import { Underlying } from 'src/app/models/Fisico/underlying';
import { TokenService } from 'src/app/shared/services/token.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjConsultaPortafolio } from 'src/app/models/Fisico/Consumo Masivo/ObjConsultaPortafolio';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { Item } from 'angular2-multiselect-dropdown';
import { PortafolioInventario } from 'src/app/models/Fisico/Consumo Masivo/PortafolioInventario';
import Swal from 'sweetalert2';
import { PhysicalCancelled } from 'src/app/models/Fisico/Consumo Masivo/PhysicalCancelled';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import { objInitGestionOperacion } from 'src/app/models/Fisico/Consumo Masivo/objInitGestionOperacion';
import { LoadingService } from '../../loading.service';
import { listaBases } from 'src/app/models/Fisico/Consumo Masivo/listaBases';
import { objInitBase } from 'src/app/models/Fisico/Consumo Masivo/objInitBase';
import { objInitListaHijos } from 'src/app/models/Fisico/Consumo Masivo/objInitListaHijos';
import { objInitPasarTransito } from 'src/app/models/Fisico/Consumo Masivo/objInitPasarTransito';
import { PalmGrowersPremium } from 'src/app/models/Fisico/Consumo Masivo/PalmGrowersPremium';
import { ObjInitCierreCM } from 'src/app/models/Fisico/Consumo Masivo/ObjInitCierreCM';
import { Observable } from 'rxjs';
import { ReturnPhysicalState } from 'src/app/models/Fisico/Consumo Masivo/ReturnPhysicalState';
import { Physical } from 'src/app/models/Fisico/Physical';
import { ObjInitCrearFuturo } from 'src/app/models/Fisico/Consumo Masivo/ObjInitCrearFuturo';
import { objComprarFuturo } from 'src/app/models/Fisico/Consumo Masivo/objComprarFuturo';
import { listarFuturos } from 'src/app/models/Fisico/Consumo Masivo/listarFuturos';
import { objVenderFuturo } from 'src/app/models/Fisico/Consumo Masivo/objVenderFuturos';
import { ObjAsignarFuturo } from 'src/app/models/Fisico/Consumo Masivo/ObjAsignarFuturo';
import { ObjInitCargaMTM } from 'src/app/models/Fisico/Consumo Masivo/ObjInitCargaMTM';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ConsultaPortafolio } from 'src/app/models/Fisico/ConsultaPortafolio';
import { portafolioOpenFilter } from 'src/app/models/Fisico/Consumo Masivo/portafolioOpenFilter';

@Component({
  selector: 'app-libroFisico',
  templateUrl: './libroFisico.component.html',
  styleUrls: ['./libroFisico.component.scss']
})
export class libroFisicoComponent implements OnInit {

  public compania: Companias  [] = [];
  public productos: Underlying  [] = [];
  public portafolioOpen: LibroFisicoOpenShipments  [] = [];
  public portafolioTransito: LibroFisicoOpenShipments  [] = [];
  public portafolioInventarios: PortafolioInventario  [] = [];
  public sociedades: Society  [] = [];
  public selectedcompania: Companias[] = [];
  public portafolioOpenDS: MatTableDataSource<LibroFisicoOpenShipments>;
  public portafolioTransitoDS: MatTableDataSource<LibroFisicoOpenShipments>;
  public portafolioInventariosDS: MatTableDataSource<PortafolioInventario>;
  public loading$= this.loader.loading$
  public objetoInitPadre:objInitGestionOperacion;
  public objetoInitIngresoBase:objInitBase;
  public objetoInitListaSplit:objInitListaHijos;
  public objetoInitCierre:ObjInitCierreCM;
  public objetoDescargar:objInitPasarTransito;
  public listabases: listaBases[];
  
  public objetoInitCrearFuturo:ObjInitCrearFuturo;
  public objetoInitCompraFuturo:objComprarFuturo;
  public objetoInitVentaFuturo:objVenderFuturo;
  public objetoInitAsignarFuturo:ObjAsignarFuturo;

  public comboConcepto: cargaCombo[]=[];
  public consultaConcepto: string| null;
  public fechInicio: NgbDateStruct;
  public fechFin: NgbDateStruct;
  public ConsultaConcepto: string| null;
  public flgFechaConsultaPortafolio: boolean = false;
  public listaPortafolioFisico: ConsultaPortafolio;
  public fechaInicio=0;
  public fechaFin=0;
  public flgValidacionConforme: boolean = false;
  public listaPortafolioRespuesta: Object[];
  dsTest: MatTableDataSource<Object>;
  public minDate: NgbDateStruct;
  public maxDate: NgbDateStruct;
  usuarioRegistra: Boolean = false;
  usuarioFO: Boolean = false;
  usuarioMO: Boolean = false;

  filterValue: portafolioOpenFilter = new portafolioOpenFilter();;
  proveedorfiltrado: string[] 
  embarquefiltrado: string[] 
  tipofiltrado: string[] 

  filtroProveedor: string[] = []
  filtroEmbarque: string[] = []
  filtroTipo: string[] = []

  tmFijadasBasesPadre: number;
  contratosFijadasFuturosPadre: number;
  saldoContratosFuturosPadre: number;
  
  public filtro: string;

  public listaFuturos:listarFuturos[];

  estados$!: Observable<string[][]>
  estados: string[][];

  estadoPortafolio: boolean = true;

  columnsOpen: string[] = [
    's021_Parent'
    ,'s021_Codigo'
    ,'s021_Split'
    ,'s021_Proveedor'
    ,'s021_SociedadNA'
    ,'s021_SociedadCH'
    ,'s021_Embarque'
    ,'s021_InicioCarga'
    ,'s021_FinCarga'
    ,'s021_FechaArribo'
    ,'s021_TipoBase'
    ,'s021_Contrato'
    ,'s021_Tipo'
    ,'s021_Proteina'
    ,'s021_Tolerancia'
    ,'s021_TipoPrecio'
    ,'s021_Bolsa'
    ,'s021_Futuro'
    ,'s021_Volumen'
    ,'s021_NumeroContratos'
    ,'s021_Flat'
    ,'s021_PrecioPromedio'
    ,'s021_ContratosCubiertos'
    ,'s021_ContratosNoCubiertos'
    ,'s021_PrecioPromedioBases'
    ,'s021_ContratosCubiertosxBases'
    ,'s021_SaldoBases'
    // ,'s021_Precio'
    ,'s021_OtrosCostos'
    // ,'Futuro'
    ,'s021_Flete'
    ,'s021_FOBFijado'
    ,'s021_PnLAsignado'
    ,'s021_ValorTotalFijado'
    ,'s021_ValorFuturo'
    ,'s021_FechaBase'
    ,'s021_ValorBase'
    ,'s021_FechaFlat'
    ,'s021_ValorFlat'
    ,'s021_MtM'
  ];

  columnsTransito: string[] = [
    'opciones',
    's021_Codigo'
    ,'s021_Proveedor'
    ,'s021_SociedadNA'
    ,'s021_SociedadCH'
    ,'s021_Embarque'
    ,'s021_InicioCarga'
    ,'s021_FinCarga'
    ,'s021_Agrupador'
    ,'s021_Contrato'
    ,'s021_Tipo'
    ,'s021_Proteina'
    ,'s021_Tolerancia'
    ,'s021_TipoPrecio'
    ,'s021_Bolsa'
    ,'s021_Futuro'
    ,'s021_Volumen'
    ,'s021_NumeroContratos'
    ,'s021_TipoBase'
    // ,'s021_OtrosCostos'
    ,'s021_FOBFijado'
    ,'s021_PnLAsignado'
    ,'s021_Flete'
    ,'s021_ValorTotalFijado'
    ,'ValorTotalUSD'
    ,'s021_Sustento'
  ];

  columnsInventario: string[] = [
    's056_TipoPrecio'
    ,'s056_Sociedad'
    ,'s056_FechaActualizacion'
    ,'s056_CodigoFisico'
    ,'s056_ToneladasMetricas'
    ,'s056_Contratos'
    ,'s056_Producto'
    ,'s056_Proteina'
    ,'s056_Puerto'
    ,'s056_Mercado'
    ,'s056_FOB'
    ,'valorTotal'
  ];

  public productoSelected: number;
  public sociedadSelected: number;
  @ViewChild(MatPaginator, { static: true }) paginadoPortafolio!: MatPaginator;
  @ViewChild(MatSort) sortPortafolio!: MatSort;
  
  @ViewChild('paginatorTransito', { static: true }) paginatorTransito!: MatPaginator;
  @ViewChild('sortPortafolioTransito') sortPortafolioTransito!: MatSort;

  @ViewChild('paginatorInventario', { static: true }) paginatorInventario!: MatPaginator;
  @ViewChild('sortPortafolioInventario') sortPortafolioInventario!: MatSort;

  constructor(private libroFisico: LibroFisicoService,
              private modalService: NgbModal,
              private bnIdle: BnNgIdleService,
              private tokenService: TokenService,
              private router: Router,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private loader:LoadingService,
              private portafolioMoliendaService: PortafolioMoliendaService) {
                // this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
                //   if (isTimedOut) {
                //     this.tokenService.logOut();
                //     this.modalService.dismissAll();
                //     //window.location.reload();
                //      this.router.navigate(['/auth/login']);
                //     //  console.log("sesion cerrada");
                //     //  this.bnIdle.stopTimer();
                //      this.bnIdle.expired$;   
                //   }
                // });
  }
    
  contextMenuPosition = { x: '0px', y: '0px' };

  @ViewChild(MatMenuTrigger)
  contextMenuOpen!: MatMenuTrigger;
            
  @ViewChild(MatMenuTrigger)
  contextMenuTransito!: MatMenuTrigger;
  
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

  onContextMenu(event: MouseEvent, item: Item) {       
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuOpen.menuData = { 'item': item };
    this.contextMenuOpen.menu.focusFirstItem('mouse');
    this.contextMenuOpen.openMenu();
  }

  onContextMenuTransito(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextMenuTransito.menuData = { 'item': item };
    this.contextMenuTransito.menu.focusFirstItem('mouse');
  }
  
  ngOnInit(){
    this.getProductos(1);
    this.getSociedades();
    this.libroFisico._connect();
    setTimeout(()=>{ this.libroFisico._send() }, 4000)

    this.estados$ = this.libroFisico.obtenerEstados();

    this.obtenerEstadoPortafolio();

    this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.tokenService.logOut();
        this.modalService.dismissAll();
         this.router.navigate(['/auth/login']);
         this.bnIdle.stopTimer();
      }
    });

    if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("FO_Fisico_RegistroOperacion") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_Controller") > -1){
      this.usuarioRegistra = true;
    }else{
      this.usuarioRegistra = false;
    }

    if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("FO_Fisico_RegistroOperacion") > -1){
      this.usuarioFO = true;
    }else{
      this.usuarioFO = false;
    }

    if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_Controller") > -1){
        this.usuarioMO = true;
    }else{
      this.usuarioMO = false;
    }

  }

  ngOnDestroy() {
    this.bnIdle.stopTimer();
  }

  public getSociedades(): void {
    // this.sociedadSelected=compania;
    this.libroFisico.getSociedades().subscribe(
      (response: Society[]) => {
        this.sociedades = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  public getProductos(id:number): void {
    // this.productoSelected=id;
    this.libroFisico.getproductos(id).subscribe(
      (response: Underlying[]) => {
        this.productos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  onSelectSubyacente(id:number):void{
    this.embarquefiltrado = [];
    this.proveedorfiltrado = [];
    this.tipofiltrado = [];

    if (typeof id !== 'undefined' && this.sociedadSelected !== undefined) {
      this.libroFisico.subyacente = this.productoSelected;
      this.productoSelected=id;
      this.portafolioOpen = [];
      this.portafolioOpenDS = new MatTableDataSource(this.portafolioOpen);
      this.portafolioTransito = [];
      this.portafolioTransitoDS = new MatTableDataSource(this.portafolioTransito);
      this.portafolioInventarios = [];
      this.portafolioInventariosDS = new MatTableDataSource(this.portafolioInventarios);
            
      if(this.estados !== undefined){
        for(var i = 0; i < this.estados.length; i++){
          if(Number(this.estados[i][0]) == this.sociedadSelected && Number(this.estados[i][1]) == this.productoSelected){
            this.estadoPortafolio = false;
            break;
          }else{
            this.estadoPortafolio = true;
          }
        }
        if(this.estados.length == 0){
          this.estadoPortafolio = true;
        }
      }

      this.libroFisico.listarPortafolios(id,this.sociedadSelected).subscribe(
      (response: ObjConsultaPortafolio) => {
        this.portafolioOpen = response.portafolioOpen;
        
        this.portafolioOpen.forEach(objeto => {
          objeto.s021_ContratosNoCubiertos = (Math.round(objeto.s021_NumeroContratos) - Math.round(objeto.s021_ContratosCubiertos)).toString();
      });

        this.portafolioOpenDS = new MatTableDataSource(this.portafolioOpen);
        this.portafolioOpenDS.paginator = this.paginadoPortafolio;
        this.portafolioOpenDS.sort = this.sortPortafolio;

        this.portafolioTransito = response.portafolioTransito;
        this.portafolioTransitoDS = new MatTableDataSource(this.portafolioTransito);
        this.portafolioTransitoDS.paginator = this.paginatorTransito;
        this.portafolioTransitoDS.sort = this.sortPortafolioTransito;

        this.portafolioInventarios = response.portafolioInventarios;
        this.portafolioInventariosDS = new MatTableDataSource(this.portafolioInventarios);
        this.portafolioInventariosDS.paginator = this.paginatorInventario;
        this.portafolioInventariosDS.sort = this.sortPortafolioInventario;

        this.getFormsValue();
        
        this.filtroProveedor = Array.from(new Set(this.portafolioOpen.map(x => x.s021_Proveedor)))
        this.filtroEmbarque = Array.from(new Set(this.portafolioOpen.map(x => x.s021_Embarque)))
        this.filtroTipo = Array.from(new Set(this.portafolioOpen.map(x => x.s021_Tipo)))

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }
  }

  public onSelectSociedad(id:number): void {
    this.sociedadSelected=id;
  }

  applyFilterOpen(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.portafolioOpenDS.filter = filterValue.trim().toLowerCase();

    const filterValue = this.filtro;
    // if(this.filtro !== undefined && this.filtro !== null){
    this.filterValue.s021_Codigo = this.filtro;
    this.portafolioOpenDS.filter = JSON.stringify(this.filterValue);
  }

  applyFilterTransito(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portafolioTransitoDS.filter = filterValue.trim().toLowerCase();
  }

  applyFilterInventario(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portafolioInventariosDS.filter = filterValue.trim().toLowerCase();
  }

  cerrarModalOperacion(modal: any){
    modal.close();
    this.onSelectSubyacente(this.productoSelected);
  }

  modificarOperacion(modificarOperacionForm: any){

    if(!this.validarpermisos("Usted no cuenta con permisos para modificar embarque")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }
    
    let fila = this.portafolioOpen.filter(tabla => tabla.s021_Codigo == this.contextMenuOpen.menuData.item);

    
    this.tmFijadasBasesPadre = Number(fila[0]['s021_ContratosCubiertosxBases'])
    this.contratosFijadasFuturosPadre = fila[0]['s021_ContratosCubiertos']

    this.libroFisico.flgIngresoBase = true;
    this.libroFisico.validarCrossCompany(this.contextMenuOpen.menuData.item).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Modificar Embarque',
            html: 'No es posible modificar embarque proveniente de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          return;
        }

        this.loader.show();
        this.libroFisico.subyacente = this.productoSelected;
        this.libroFisico.sociedad = this.sociedadSelected;
        this.libroFisico.fisicoID = this.contextMenuOpen.menuData.item;
        this.libroFisico.flgIngresoOperacion = false;
        this.libroFisico.obtenerobjInitModificacionOperacion(this.libroFisico.fisicoID,this.libroFisico.subyacente).subscribe(
          (response: objInitGestionOperacion) => {
            this.objetoInitPadre = new objInitGestionOperacion();
            this.objetoInitPadre = response;
            this.loader.hide();
            this.modalService.open(modificarOperacionForm,{windowClass : "my-class-Operacion",centered: true,backdrop : 'static',keyboard : false});     
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });

    
  }
  agregarOperacion(modificarOperacionForm: any){

    if(!this.validarpermisos("Usted no cuenta con permisos para agregar embarque")){
      return;
    }

    if(this.sociedadSelected == undefined || this.productoSelected == undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar Sociedad y Subyacente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    this.loader.show();
    this.libroFisico.subyacente = this.productoSelected;
    this.libroFisico.sociedad = this.sociedadSelected;
    this.libroFisico.flgIngresoOperacion = true;
    
    this.libroFisico.obtenerobjInitGestionOperacion(this.libroFisico.subyacente).subscribe(
      (response: objInitGestionOperacion) => {
        // this.nuevoFisico.t039_ID = response.nuevoID.toString();
        this.objetoInitPadre = new objInitGestionOperacion();
        this.objetoInitPadre = response;
        this.loader.hide();
        this.modalService.open(modificarOperacionForm,{windowClass : "my-class-Operacion",centered: true,backdrop : 'static',keyboard : false});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    
  }

  cancelarOperacion(){

    if(!this.validarpermisos("Usted no cuenta con permisos para cancelar embarque")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }
    let fisico_id = this.contextMenuOpen.menuData.item
    this.libroFisico.validarCrossCompany(fisico_id).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Cancelar Embarque',
            html: 'No es posible cancelar Operaciones provenientes de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          return;
        }
          Swal.fire({
          icon: 'question',
          title: 'Cancelar Embarque',
          html: '¿Desea Cancelar la Operación de Físico ' + fisico_id + '?' ,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
          }).then((result) => {
            if (result.isConfirmed) {
              (async () => {
                const {} = await Swal.fire({
                icon: 'question',
                title: 'Cancelar Embarque',
                html: 'Por favor indique el Motivo de la Cancelación del Embarque ' + fisico_id,
                input: 'text',
                inputPlaceholder: 'Sustento',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#4b822d',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                reverseButtons: true,
                inputValidator: (value) => {
                  return new Promise((resolve) => {
                    if (value.length > 400 || value.length === 0) {
                      resolve("Número de caracteres '" + value.length + "', número de caracteres permitido 400.");
                    }else{
                      let fisicoCancelado: PhysicalCancelled = new PhysicalCancelled();
                      fisicoCancelado.t049_Physical = fisico_id;
                      fisicoCancelado.t049_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                      fisicoCancelado.t049_Reason = value;
                      this.libroFisico.cancelarOperacion(fisicoCancelado).subscribe(
                        data=>{
                          this.onSelectSubyacente(this.productoSelected);
                            Swal.fire({
                              icon: 'success',
                              title: 'Cancelar Embarque',
                              text: 'Se Canceló el Embarque ' + fisicoCancelado.t049_Physical ,
                              confirmButtonColor: '#0162e8'
                            });
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
                    }})}})})()}})
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });   
  }

  listarBasesModal(listaBasesForm: any){
    this.loader.show();
    this.libroFisico.tipoPrecioCM = this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_TipoPrecio"];
    this.libroFisico.sociedad = this.sociedadSelected;
    this.libroFisico.subyacente = this.productoSelected;
    this.libroFisico.fisicoID = this.contextMenuOpen.menuData.item;
    this.libroFisico.contrato = this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_Futuro"];
    this.libroFisico.subyacente = this.productoSelected;
    this.libroFisico.usuarioRegistra = this.usuarioRegistra;
    this.libroFisico.listarBases(this.libroFisico.fisicoID).subscribe(
      (response: listaBases[]) => {
        this.listabases = response;
        this.loader.hide();
        this.modalService.open(listaBasesForm,{windowClass : "my-class-lista",centered: true});
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  ingresarBaseModal(ingresarBaseForm: any){

    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar base")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    this.loader.show();
    let fila : string = this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_TipoPrecio"];

    if(fila == 'Flat' || fila == 'Flat/Bases'){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El tipo de precio no debe de ser Flat',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      this.loader.hide();
      return;
    }
    this.objetoInitIngresoBase = new objInitBase();
    this.libroFisico.fisicoID = this.contextMenuOpen.menuData.item;
    this.libroFisico.contrato = this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_Futuro"];
    this.libroFisico.subyacente = this.productoSelected;
    this.libroFisico.flgIngresoBase = true;this.libroFisico.validarCrossCompany(this.libroFisico.fisicoID).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Ingresar Base',
            html: 'No es posible ingresar base a embarcación proveniente de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }

        this.libroFisico.objetosIngresarBase(this.libroFisico.subyacente,this.libroFisico.fisicoID).subscribe(
          (response: objInitBase) => {
            this.objetoInitIngresoBase = response;
            if(this.objetoInitIngresoBase.crossCompany > 0){
              this.loader.hide();
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'No es posible ingresar base a barco Intercompany.',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              });
              return;
            }
            this.objetoInitIngresoBase.codFisico = this.libroFisico.fisicoID;
            this.loader.hide();
            this.modalService.open(ingresarBaseForm,{windowClass : "modal-IngresarBaseCM",centered: true,backdrop : 'static',keyboard : false});
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }); 
  }

  ModaldividirOperacion(){

    if(!this.validarpermisos("Usted no cuenta con permisos para dividir embarque")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    var tm: string;
    let fisico_id = this.contextMenuOpen.menuData.item;
    let fila = this.portafolioOpen.filter(tabla => tabla.s021_Codigo == fisico_id);
    this.libroFisico.validarCrossCompany(fisico_id).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Dividir Operación',
            html: 'No es posible dividir Operaciones provenientes de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          return;
        }
        Swal.fire({
          icon: 'question',
          title: 'Dividir Operación',
          html: 'El barco <b>' + fisico_id + '</b> contiene <b>' + fila[0]["s021_Volumen"] + ' TM</b>, ¿Cuantas TM tendrá el nuevo barco?',
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
            if(fila[0]["s021_Volumen"] < result.value){
              Swal.fire({
                icon: 'error',
                title: 'Dividir Operación',
                text: 'Las TM ingresadas superan al barco seleccionado.',
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false
              })
            }else{
              Swal.fire({
                icon: 'warning',
                title: 'Dividir Operación',
                html: '¿Seguro que desea dividir el barco <b>' + fisico_id + '</b>?',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                reverseButtons: true,
                confirmButtonColor: '#4b822d'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.loader.show();
                  this.libroFisico.dividirOperacion(fisico_id,tm,this.portafolioMoliendaIFDService.usuario).subscribe(
                    (response: Physical) => {
                      Swal.fire({
                        title: 'Dividir Operación!',
                        html: 'Se realizó la división de barco. Nuevo barco <b>' + response.t039_ID + '</b>',
                        icon: 'success',
                        confirmButtonColor: '#4b822d'
                      })
                      this.loader.hide();
                      this.onSelectSubyacente(this.productoSelected);
                    },
                    (error: HttpErrorResponse) => {
                      this.loader.hide();
                      alert(error.message);
                    });
                }
              })
            }
          }
        })
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }); 
  }

  listarHijos(detalleForm:any, codigo: string) {
    // this.flgModal=true;
    // this.portafolioMoliendaService.codigoContrato=codigo;
    // this.portafolioMoliendaService.tipo="HIJOS";
    // this.codigoSeleccionado = codigo;
    this.loader.show();
    
    this.libroFisico.validarCrossCompany(Number(codigo)).subscribe(
      (response: boolean) => {
        this.libroFisico.flgIntercompany = response;
        this.libroFisico.usuarioRegistra = this.usuarioRegistra;
        this.libroFisico.obtenerListaHijos(Number(codigo)).subscribe(
          (response: objInitListaHijos) => {
            this.objetoInitListaSplit = response;
            
            this.libroFisico.fisicoID = Number(codigo);
            this.loader.hide();
            this.modalService.open(detalleForm,{windowClass : "class-modalDetalleHijos-CM",centered: true,backdrop : 'static',keyboard : false});
          },
          (error: HttpErrorResponse) => {
            this.loader.hide();
            alert(error.message);
          });
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }); 
  }

  pasarTransito(DescargarForm:any){

    if(!this.validarpermisos("Usted no cuenta con permisos para pasar embarque a transito")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    this.loader.show();
    let fisico_id = this.contextMenuOpen.menuData.item;
    this.libroFisico.flgDescargaBarcoTransito = true;
    this.libroFisico.obtenerObjetoPasajeTransito(Number(fisico_id)).subscribe(
      (response: objInitPasarTransito) => {
        this.objetoDescargar = response;
        
        this.libroFisico.validarCrossCompany(fisico_id).subscribe(
          (response: boolean) => {
            if(response){
              Swal.fire({
                title: 'Pasar a Transito',
                html: 'No es posible pasar a transito Operaciones provenientes de Ventas Molienda',
                icon: 'warning',
                confirmButtonColor: '#4b822d'
              })
              this.loader.hide();
              return;
            }
    
            this.libroFisico.fobFijado = Number(this.portafolioOpen.filter(x => x.s021_Codigo == fisico_id)[0]["s021_FOBFijado"]);
            this.libroFisico.tmTransito = Number(this.portafolioOpen.filter(x => x.s021_Codigo == fisico_id)[0]["s021_Volumen"]);
    
            this.modalService.open(DescargarForm,{windowClass : "class-modalDescarga-CM",centered: true,backdrop : 'static',keyboard : false});
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }); 

        this.loader.hide();
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  moverInventario(DescargarForm:any){

    if(!this.validarpermisos("Usted no cuenta con permisos para pasar embarque a inventario")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    this.loader.show();
    this.libroFisico.flgDescargaBarcoTransito = false;
    let fisico_id = this.contextMenuOpen.menuData.item;
    
    this.libroFisico.obtenerObjetoPasajeTransito(Number(fisico_id)).subscribe(
      (response: objInitPasarTransito) => {
        this.objetoDescargar = response;

        this.libroFisico.tmTransito = Number(this.portafolioTransito.filter(x => x.s021_Codigo == fisico_id)[0]["s021_Volumen"])
        this.objetoDescargar.tm = this.libroFisico.tmTransito
        this.modalService.open(DescargarForm,{windowClass : "class-modalDescarga-CM",centered: true,backdrop : 'static',keyboard : false});
        this.loader.hide();
        
  },
  (error: HttpErrorResponse) => {
    this.loader.hide();
    alert(error.message);
  });
  }

  cargarPrima(){

    if(!this.validarpermisos("Usted no cuenta con permisos para cargar prima")){
      return;
    }

    let fechaHoy = new Date();
    // (async () => {

    //   const { value: fruit } = await Swal.fire({
    //     icon: 'question',
    //     title: 'Benchmark de Palma',
    //     html: 'Por favor ingrese la Prima de los Palmicultores (USD/TM) al ' + fechaHoy.toLocaleDateString(),
    //     input: 'number',
    //     inputPlaceholder: 'Benchmark de Palma',
    //     showCancelButton: true,
    //     cancelButtonText: 'Cancelar',
    //     confirmButtonColor: '#4b822d',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Continuar',
    //     reverseButtons: true,
        
    //     inputValidator: (value) => {
    //       return new Promise((resolve) => {
    //         if (value.length != 0) {
    //           valorBenchmark = Number(value);
    //           objBenchmark.t258_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
    //           objBenchmark.t258_Value = valorBenchmark;
    //           this.libroFisico.cargarBenchmarck(objBenchmark).subscribe(
    //             data=>{
    //                 Swal.fire({
    //                   icon: 'success',
    //                   title: 'Benchmark de Palma',
    //                   text: 'La Prima de los Palmicultores para el '+ fechaHoy.toLocaleDateString() +' es USD/TM '+ valorBenchmark,
    //                   confirmButtonColor: '#0162e8'
    //                 });
    //             },
    //             (error: HttpErrorResponse) => {
    //               alert(error.message);
    //             }); 
    //         } else {
    //           resolve("Por favor ingrese la Prima de los Palmicultores");
    //         }
    //       })
    //     }
    //   })
    //   })()

      (async () => {

        await Swal.fire({
          icon: 'question',
          title: 'Benchmark de Palma',
          html: 'Por favor ingrese la Prima y Spread de los Palmicultores (USD/TM) al ' + fechaHoy.toLocaleDateString()
                +'<input type="number" id="prima" class="swal2-input" placeholder="Prima de Palma">' +
                '<input type="number" id="spread" class="swal2-input" placeholder="Spread de Palma">',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#4b822d',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          preConfirm: () => {
            const prima = (<HTMLInputElement>document.getElementById('prima')).value;
            const spread = (<HTMLInputElement>document.getElementById('spread')).value;
            if (!prima || !spread) {
              Swal.showValidationMessage('Por favor, complete ambos campos');
            }
            return { prima, spread };
          },
          
          // inputValidator: (value) => {
          //   return new Promise((resolve) => {
          //     if (value.length != 0) {
          //       valorBenchmark = Number(value);
          //       objBenchmark.t258_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
          //       objBenchmark.t258_Value = valorBenchmark;
          //       this.libroFisico.cargarBenchmarck(objBenchmark).subscribe(
          //         data=>{
          //             Swal.fire({
          //               icon: 'success',
          //               title: 'Benchmark de Palma',
          //               text: 'La Prima de los Palmicultores para el '+ fechaHoy.toLocaleDateString() +' es USD/TM '+ valorBenchmark,
          //               confirmButtonColor: '#0162e8'
          //             });
          //         },
          //         (error: HttpErrorResponse) => {
          //           alert(error.message);
          //         }); 
          //     } else {
          //       resolve("Por favor ingrese la Prima de los Palmicultores");
          //     }
          //   })
          // }
        }).then((result) => {
          if (result.isConfirmed) {
            if(result.value){
              const prima = result.value.prima;
              const spread = result.value.spread;
              console.log('prima:', prima);
              console.log('spread:', spread);

              let listBenchmarkPrima: PalmGrowersPremium[] = [];

              let objBenchmarkPrima: PalmGrowersPremium = new PalmGrowersPremium();
              objBenchmarkPrima.t258_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
              objBenchmarkPrima.t258_Value = Number(prima);
              objBenchmarkPrima.t258_TypeOfPremium = 1;
              listBenchmarkPrima.push(objBenchmarkPrima);

              let objBenchmarkSpread: PalmGrowersPremium = new PalmGrowersPremium();
              objBenchmarkSpread.t258_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
              objBenchmarkSpread.t258_Value = Number(spread);
              objBenchmarkSpread.t258_TypeOfPremium = 2;
              listBenchmarkPrima.push(objBenchmarkSpread);


              this.libroFisico.cargarBenchmarck(listBenchmarkPrima).subscribe(
                data=>{
                  Swal.fire({
                    icon: 'success',
                    title: 'Benchmark de Palma',
                    html: 'Los valores para el '+ fechaHoy.toLocaleDateString() +' son:'+ '<br>' +'Prima de Palmicultores: USD/TM '+ prima + '<br>' + 'Spread de Palmicultores: USD/TM ' + spread,
                    confirmButtonColor: '#0162e8'
                  });
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
              
              // let objBenchmarkPrima: PalmGrowersPremium = new PalmGrowersPremium();
              // objBenchmarkPrima.t258_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
              // objBenchmarkPrima.t258_Value = Number(prima);
              // objBenchmarkPrima.t258_TypeOfPremium = 1;
              // this.libroFisico.cargarBenchmarck(objBenchmarkPrima).subscribe(
              //   data=>{
              //     let objBenchmarkSpread: PalmGrowersPremium = new PalmGrowersPremium();
              //     objBenchmarkSpread.t258_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
              //     objBenchmarkSpread.t258_Value = Number(spread);
              //     objBenchmarkSpread.t258_TypeOfPremium = 2;
              //     this.libroFisico.cargarBenchmarck(objBenchmarkSpread).subscribe(
              //       data=>{
              //           Swal.fire({
              //             icon: 'success',
              //             title: 'Benchmark de Palma',
              //             html: 'Los valores para el '+ fechaHoy.toLocaleDateString() +' son:'+ '<br>' +'Prima de Palmicultores: USD/TM '+ prima + '<br>' + 'Spread de Palmicultores: USD/TM ' + spread,
              //             confirmButtonColor: '#0162e8'
              //           });
              //       },
              //       (error: HttpErrorResponse) => {
              //         alert(error.message);
              //       });
              //   },
              //   (error: HttpErrorResponse) => {
              //     alert(error.message);
              //   });
            }
          }
        });
        })()
  }

  cerrarPortafolioModal(cierreForm:any){

    if(this.sociedadSelected == undefined){
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
    this.loader.show();
    this.libroFisico.flgCierre = true;
    this.libroFisico.obtenerDatosCierreCM(this.sociedadSelected,this.portafolioMoliendaIFDService.usuario).subscribe(
      (response: ObjInitCierreCM) => {
        this.objetoInitCierre = response;
        this.modalService.open(cierreForm,{windowClass : "my-class-CierreFisico",centered: true,backdrop : 'static',keyboard : false});
        this.loader.hide();
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  deshacerCierrePortafolioModal(cierreForm:any){
    if(this.sociedadSelected == undefined){
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
    this.loader.show();
    this.libroFisico.flgCierre = false;
    this.libroFisico.obtenerDatosDeshacerCierreCM(this.sociedadSelected).subscribe(
      (response: ObjInitCierreCM) => {
        this.objetoInitCierre = response;
        this.modalService.open(cierreForm,{windowClass : "my-class-CierreFisico",centered: true,backdrop : 'static',keyboard : false});
        this.loader.hide();
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  

  public obtenerEstadoPortafolio(): void {
    this.libroFisico.obtenerEstados().subscribe(
      (response: string[][]) => {
        if(response !== undefined){
          this.estados = response;
          for(var i = 0; i < response.length; i++){
            if(Number(this.estados[i][0]) == this.sociedadSelected && Number(this.estados[i][1]) == this.productoSelected){
              this.estadoPortafolio = false;
              break;
            }else{
              this.estadoPortafolio = true;
            }
          }
          if(response.length == 0){
            this.estadoPortafolio = true;
          }
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  
  validarEstadoPortafolio(): boolean{
    if(!this.estadoPortafolio){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El portafolio se encuentra cerrado',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return this.estadoPortafolio;
    }else{
      return this.estadoPortafolio;
    }
  }

  regresarBarcoOpen(){

    if(!this.validarpermisos("Usted no cuenta con permisos para regresar embarque a Open")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    let solicitud: ReturnPhysicalState = new ReturnPhysicalState();

    this.libroFisico.validarCrossCompany(this.contextMenuOpen.menuData.item).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Regresar a Open',
            html: 'No es posible revertir barcos provenientes de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }

        this.libroFisico.consultarPasajesInventario(this.contextMenuOpen.menuData.item).subscribe(
          (response: number) => {
            if(response > 0){
              Swal.fire({
                title: 'Regresar a Open',
                html: 'No es posible revertir barcos que ya cuenten con pasajes a Inventario',
                icon: 'warning',
                confirmButtonColor: '#4b822d'
              })
              this.loader.hide();
              return;
            }

            solicitud.t435_Physical = Number(this.contextMenuOpen.menuData.item);
            solicitud.t435_User = this.portafolioMoliendaIFDService.usuario;
            Swal.fire({
              icon: 'question',
              title: 'Aviso',
              html: '¿Seguro que desea ingresar una solicitud para revertir el barco número '+ solicitud.t435_Physical + '?',
              showCancelButton: true,
              cancelButtonText: 'Cancelar',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Continuar',
              reverseButtons: true,
              confirmButtonColor: '#4b822d'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.libroFisico.guardarSolicitudDeCambio(solicitud).subscribe(
                    data=>{
                        Swal.fire({
                          icon: 'success',
                          title: 'Regresar a Open',
                          text: 'Se guardó la solicitud de reversión.',
                          confirmButtonColor: '#0162e8'
                        });
                    },
                    (error: HttpErrorResponse) => {
                      alert(error.message);
                    });
                }})
        
            },
            (error: HttpErrorResponse) => {
              this.loader.hide();
              alert(error.message);
            }); 
    },
    (error: HttpErrorResponse) => {
      this.loader.hide();
      alert(error.message);
    });     
  }

  crearFuturoModal(crearPricing:any){

    if(!this.validarpermisos("Usted no cuenta con permisos para crear Futuro")){
      return;
    }

    if(this.sociedadSelected == undefined || this.productoSelected == undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar Sociedad y Subyacente',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }
    this.loader.show();
    this.libroFisico.obtenerDatosCrearFuturo(this.productoSelected).subscribe(
      (response: ObjInitCrearFuturo) => {
        this.objetoInitCrearFuturo = response;
        this.modalService.open(crearPricing,{windowClass : "my-class-CrearFuturo",centered: true,backdrop : 'static',keyboard : false});
        this.loader.hide();
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  asignarFuturoModal(asignarPricing:any){

    if(!this.validarpermisos("Usted no cuenta con permisos para asignar Futuro")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }
    let fila : string = this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_TipoPrecio"];
    let filaSaldoFuturo : string = this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_ContratosNoCubiertos"];

    this.saldoContratosFuturosPadre = Number(filaSaldoFuturo);
    
    if(fila == 'Flat'){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El tipo de precio no debe de ser Flat',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      this.loader.hide();
      return;
    }
    this.loader.show();
    let fisico_id = this.contextMenuOpen.menuData.item;
    this.libroFisico.fisicoID = fisico_id;
    this.libroFisico.validarCrossCompany(fisico_id).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Asignar Futuro',
            html: 'No es posible asignar futuro a Operaciones provenientes de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }
        this.libroFisico.obtenerDatosAsignarFuturo(fisico_id).subscribe(
          (response: ObjAsignarFuturo) => {
            this.objetoInitAsignarFuturo = response;

            this.modalService.open(asignarPricing,{windowClass : "class-modalAsignarFuturo-CM",centered: true,backdrop : 'static',keyboard : false});
            this.loader.hide();
          },
          (error: HttpErrorResponse) => {
            this.loader.hide();
            alert(error.message);
          });
    },
    (error: HttpErrorResponse) => {
      this.loader.hide();
      alert(error.message);
    }); 

    
  }

  comprarFuturoModal(comprarFuturo:any){

    if(!this.validarpermisos("Usted no cuenta con permisos para comprar Futuro")){
      return;
    }
    
    if(!this.validarEstadoPortafolio()){
      return;
    }

    this.loader.show();
    this.libroFisico.fisicoID = this.contextMenuOpen.menuData.item;
    let tickerContrato: string = this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_Futuro"]
    this.libroFisico.futuroTicker = tickerContrato;
    this.libroFisico.subyacente = this.productoSelected;
    this.libroFisico.saldoFuturosComprar = Number(this.portafolioOpen.filter(x => x.s021_Codigo == this.contextMenuOpen.menuData.item)[0]["s021_ContratosNoCubiertos"]);

    this.libroFisico.flgIngresoBase = true;this.libroFisico.validarCrossCompany(this.libroFisico.fisicoID).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Comprar Futuro',
            html: 'No es posible Comprar Futuro a embarcación proveniente de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }

        this.libroFisico.obtenerDatosComprarFuturo(this.productoSelected).subscribe(
          (response: objComprarFuturo) => {
            this.objetoInitCompraFuturo = response;
            this.objetoInitCompraFuturo.underlyingID = this.productoSelected;
            this.libroFisico.flgIngresoOperacion = true;
            this.modalService.open(comprarFuturo,{windowClass : "class-ComprarFuturo-CM",centered: true,backdrop : 'static',keyboard : false});
            this.loader.hide();
          },
          (error: HttpErrorResponse) => {
            this.loader.hide();
            alert(error.message);
          });

       
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }); 

  }

  venderFuturoModal(venderFuturo:any){

    if(!this.validarpermisos("Usted no cuenta con permisos para vender Futuro")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    this.loader.show();
    this.libroFisico.fisicoID = this.contextMenuOpen.menuData.item;
    this.libroFisico.subyacente = this.productoSelected;

    this.libroFisico.flgIngresoBase = true;this.libroFisico.validarCrossCompany(this.libroFisico.fisicoID).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Vender Futuro',
            html: 'No es posible Vender Futuro a embarcación proveniente de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }

        this.libroFisico.obtenerDatosVenderFuturo(this.productoSelected, this.libroFisico.fisicoID).subscribe(
          (response: objVenderFuturo) => {
            this.libroFisico.flgIngresoOperacion = true;
            this.objetoInitVentaFuturo = response;
            this.objetoInitVentaFuturo.underlyingID = this.productoSelected;
            this.modalService.open(venderFuturo,{windowClass : "class-VenderFuturo-CM",centered: true,backdrop : 'static',keyboard : false});
            this.loader.hide();
          },
          (error: HttpErrorResponse) => {
            this.loader.hide();
            alert(error.message);
          });
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }); 

  }

  listarFuturoModal(listarFuturos:any){
    this.loader.show();
    this.libroFisico.fisicoID = this.contextMenuOpen.menuData.item;
    this.libroFisico.sociedad = this.sociedadSelected;
    this.libroFisico.subyacente = this.productoSelected;
    this.libroFisico.usuarioRegistra = this.usuarioRegistra;
    this.libroFisico.obtenerListaFuturosXFisico(this.libroFisico.fisicoID).subscribe(
      (response: listarFuturos[]) => {
        this.listaFuturos = response;
        this.modalService.open(listarFuturos,{windowClass : "class-lista_FuturosCM",centered: true});
        this.loader.hide();
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });
  }

  calcularMTMModal(){
    this.loader.show();
    this.libroFisico.obtenerDatosRecalcularMTM().subscribe(
      (response: ObjInitCargaMTM) => {
        if(!response.flgPortafolioCerrado){
          Swal.fire({
            title: 'Recalculo de MTM',
            html: 'Se encuentra abierto el Open Shipments',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }
        if(!response.flgConsumoCerrado){
          Swal.fire({
            title: 'Recalculo de MTM',
            html: 'El Consumo se encuentra abierto',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }
        if(!response.flgInventarioCerrado){
          Swal.fire({
            title: 'Recalculo de MTM',
            html: 'El Inventario se encuentra abierto',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }

        Swal.fire({
          icon: 'warning',
          title: 'Recalculo de MTM',
          html: '¿Está seguro que desea generar el MtM con bases al '+response.fechaBases+'?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          reverseButtons: true,
          confirmButtonColor: '#4b822d'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loader.show();
            this.libroFisico.recalcularMTM(this.portafolioMoliendaIFDService.usuario).subscribe(
              (response: boolean) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Recalculo de MTM',
                  text: 'Se cargo el MtM para todas las MMPP.',
                  confirmButtonColor: '#0162e8'
                });
                this.loader.hide();
              },
              (error: HttpErrorResponse) => {
                this.loader.hide();
                alert(error.message);
              });        
          }
          this.loader.hide();
        })
        
      },
      (error: HttpErrorResponse) => {
        this.loader.hide();
        alert(error.message);
      });  
  }

  modalConsultarPortafolio(consultaPortafolio: any){
    console.log("minDate: ", this.minDate, " - maxDate: ", this.maxDate);
    this.ConsultaConcepto = null;
    this.flgFechaConsultaPortafolio = false;
    this.fechInicio = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.fechFin = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.maxDate = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() + 10};
    this.minDate = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() - 10};
    this.portafolioMoliendaService.getCombo('conceptoLibroFisico').subscribe(
      (response: cargaCombo[]) => {
        this.comboConcepto = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
      this.modalService.open(consultaPortafolio,{windowClass : "claseConsulta",centered: true,backdrop : 'static',keyboard : false});
  }

  habilitarFechas(){
    this.fechInicio = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.fechFin = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.maxDate = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() + 10};
    this.minDate = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear() - 10};
  }

  cambiarFechaIni(){
    this.maxDate = this.fechFin;
    this.minDate = this.fechInicio;
    if(Number(this.dateToString(this.fechInicio)) > Number(this.dateToString(this.fechFin))){
      this.fechFin = this.fechInicio;
    }
  }

  cambiarFechaFin(){
    this.minDate = this.fechInicio;
    this.maxDate = this.fechFin;
    if(Number(this.dateToString(this.fechInicio)) > Number(this.dateToString(this.fechFin))){
      this.fechInicio = this.fechFin;
    }
  }

  exportarConsulta(consultaPortafolio: any){    
    if (this.validarCampos()){
      this.consultarPortafolio();
    }
    console.log("FecIni: ", this.fechaInicio, " - FecFin: ", this.fechaFin, " - Concepto: ", this.ConsultaConcepto);
  }

  validarCampos(): boolean{
    this.fechaInicio = 0;
    this.fechaFin = 0;

    if(this.ConsultaConcepto == undefined || this.ConsultaConcepto == null ){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar un concepto',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return false;
    }
  
    if(this.flgFechaConsultaPortafolio){
      this.fechaInicio = Number(this.dateToString(this.fechInicio));
      this.fechaFin = Number(this.dateToString(this.fechFin));
      if(this.fechaInicio>this.fechaFin){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'La fecha de inicio no puede ser mayor a la fecha fin',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        })
        return false;
      }
    }
    return true;
  }

  consultarPortafolio(){
    this.libroFisico.getPortafolioFisico(this.fechaInicio, this.fechaFin, Number(this.ConsultaConcepto)).subscribe(
      (response: ConsultaPortafolio) => {
        this.listaPortafolioFisico = response;
        console.log("listaPortafolioFisico: ", this.listaPortafolioFisico);
        switch (Number(this.ConsultaConcepto)){
          case 1:{
            this.listaPortafolioRespuesta = this.listaPortafolioFisico.consultaPortafolioPorEmbarcar;
            break;
          }
          case 2:{
            this.listaPortafolioRespuesta = this.listaPortafolioFisico.consultaPortafolioEnTransito;
            break;
          }
          case 3: case 4:{
            this.listaPortafolioRespuesta = this.listaPortafolioFisico.consultaPortafolioConsumoInventario;
            break;
          }
        }
        if (this.listaPortafolioRespuesta.length == 0){
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No se encontraron registros.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          })
          return;
        }
        this.exportarExcel();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
    });
  }

  exportarExcel(){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listaPortafolioRespuesta);

    switch(Number(this.ConsultaConcepto)){
      case 1:{
        this.formatoExcelPorEmbarcar(ws);
        break;
      }
      case 2:{
        this.formatoExcelEnTransito(ws);
        break;
      }
      case 3: case 4:{
        this.formatoExcelConsumo_Inventario(ws);
        break;
      }
    }
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws,'Reporte');
    XLSX.writeFile(wb, 'Portafolio Físico.xlsx');
  }

  formatoExcelPorEmbarcar(ws:XLSX.WorkSheet){
    ws['A1'].v = 'Fecha';
    ws['B1'].v = 'Código';
    ws['C1'].v = 'Split';
    ws['D1'].v = 'Proveedor';
    ws['E1'].v = 'Sociedad Nutrición Animal';
    ws['F1'].v = 'Embarque';
    ws['G1'].v = 'Desde';
    ws['H1'].v = 'Hasta';
    ws['I1'].v = 'Arribo estimado';
    ws['J1'].v = 'Incoterm';
    ws['K1'].v = 'Contrato';
    ws['L1'].v = 'Tipo';
    ws['M1'].v = 'Prot. %';
    ws['N1'].v = 'Tolerancia';
    ws['O1'].v = 'Tipo de Precio';
    ws['P1'].v = 'Ticker';
    ws['Q1'].v = 'Futuro';
    ws['R1'].v = 'Volumen (MT)';
    ws['S1'].v = '# Contratos';
    ws['T1'].v = 'Fijados';
    ws['U1'].v = 'Saldo';
    ws['V1'].v = 'Fijados';
    ws['W1'].v = 'Saldo';
    ws['X1'].v = 'Precio';
    ws['Y1'].v = 'Futuro (Fijado)';
    ws['Z1'].v = 'Base (Fijado)';
    ws['AA1'].v = 'Otros Costos / Descuentos';
    ws['AB1'].v = 'Futuro ()';
    ws['AC1'].v = 'Flat Price';
    ws['AD1'].v = 'Flete';
    ws['AE1'].v = 'FOB Fijado';
    ws['AF1'].v = 'PnL Asigando';
    ws['AG1'].v = 'Costo Total Fijados (FOB)';
    ws['AH1'].v = 'Futuro (MKT) $c/Bu';
    ws['AI1'].v = 'Fecha Base (Fijado)';
    ws['AJ1'].v = 'Valor Base (Fijado)';
    ws['AK1'].v = 'Fecha Flat Price';
    ws['AL1'].v = 'Valor Flat Price';
    ws['AM1'].v = 'Fecha Flete';
    ws['AN1'].v = 'Valor Flete';
    ws['AO1'].v = 'FOB (U$S/MT)';
    ws['AP1'].v = 'FOB Fijado';
    ws['AQ1'].v = 'Valor Total Fijados (FOB)';
    ws['AR1'].v = 'MTM';
    ws['AS1'].v = 'Sociedad Consumo Humano';
  }

  formatoExcelEnTransito(ws:XLSX.WorkSheet){
    ws['A1'].v = 'Fecha';
    ws['B1'].v = 'Código';
    ws['C1'].v = 'Proveedor';
    ws['D1'].v = 'Sociedad Nutrición Animal';
    ws['E1'].v = 'Embarque';
    ws['F1'].v = 'Desde';
    ws['G1'].v = 'Hasta';
    ws['H1'].v = 'Agrupador';
    ws['I1'].v = 'Contrato';
    ws['J1'].v = 'Tipo';
    ws['K1'].v = 'Prot. %';
    ws['L1'].v = 'Tolerancia';
    ws['M1'].v = 'Tipo de Precio';
    ws['N1'].v = 'Ticker';
    ws['O1'].v = 'Futuro';
    ws['P1'].v = 'Volumen (MT)';
    ws['Q1'].v = '# Contratos';
    ws['R1'].v = 'Incoterm';
    ws['S1'].v = 'Otros Costos / Descuentos';
    ws['T1'].v = 'FOB (U$S/MT)';
    ws['U1'].v = 'PnL Asignado';
    ws['V1'].v = 'Flete';
    ws['W1'].v = 'CFR (U$S/MT)';
    ws['X1'].v = 'Valor Total';
    ws['Y1'].v = 'Sustento';
    ws['Z1'].v = 'Futuro (MKT) $c/Bu';
    ws['AA1'].v = 'Fecha Base (Fijado)';
    ws['AB1'].v = 'Valor Base (Fijado)';
    ws['AC1'].v = 'Fecha Flat Price';
    ws['AD1'].v = 'Valor Flat Price';
    ws['AE1'].v = 'Fecha Flete';
    ws['AF1'].v = 'Valor Flete';
    ws['AG1'].v = 'FOB (U$S/MT)';
    ws['AH1'].v = 'FOB Fijado';
    ws['AI1'].v = 'Valor Total Fijados (FOB)';
    ws['AJ1'].v = 'MTM';
    ws['AK1'].v = 'Sociedad Consumo Humano';
  }

  formatoExcelConsumo_Inventario(ws:XLSX.WorkSheet){
    ws['A1'].v = 'Tipo Precio';
    ws['B1'].v = 'Sociedad';
    ws['C1'].v = 'Fecha Actualización';
    ws['D1'].v = 'Código Físico';
    ws['E1'].v = 'Toneladas Métricas';
    ws['F1'].v = 'Contratos';
    ws['G1'].v = 'Producto';
    ws['H1'].v = 'Proteína';
    ws['I1'].v = 'Puerto';
    ws['J1'].v = 'Mercado';
    ws['K1'].v = 'FOB';
    ws['L1'].v = 'Valor Total';
    ws['M1'].v = 'Futuro (MKT) $c/Bu';
    ws['N1'].v = 'Fecha Base (Fijado)';
    ws['O1'].v = 'Valor Base (Fijado)';
    ws['P1'].v = 'Fecha Flat Price';
    ws['Q1'].v = 'Valor Flat Price';
    ws['R1'].v = 'Fecha Flete';
    ws['S1'].v = 'Valor Flete';
    ws['T1'].v = 'FOB (U$S/MT)';
    ws['U1'].v = 'FOB Fijado';
    ws['V1'].v = 'Valor Total Fijados (FOB)';
    ws['W1'].v = 'MTM';
  }


  seleccionarFiltro() {
    
    this.filterValue.s021_Embarque = (this.embarquefiltrado);
    this.portafolioOpenDS.filter = JSON.stringify(this.filterValue);

    this.filterValue.s021_Proveedor = (this.proveedorfiltrado);
    this.portafolioOpenDS.filter = JSON.stringify(this.filterValue);

    this.filterValue.s021_Tipo = (this.tipofiltrado);
    this.portafolioOpenDS.filter = JSON.stringify(this.filterValue);

    this.getFormsValue();
  }

  getFormsValue() {

    this.portafolioOpenDS.filterPredicate = (data, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      let isEmbarqueAvailable = false;
      let isProveedorAvailable = false;
      let isCodigoAvailable = false;
      let isTipoAvailable = false;
      if(searchString.s021_Proveedor !== undefined){
        if (searchString.s021_Proveedor.length) {
          for (const d of searchString.s021_Proveedor) {
            if (data.s021_Proveedor.trim() === d.trim()) {
              isProveedorAvailable = true;
            }
          }
        } else {
          isProveedorAvailable = true;
        }
      }else{
        isProveedorAvailable = true;
      }

      if(searchString.s021_Tipo !== undefined){
        if (searchString.s021_Tipo.length) {
          for (const d of searchString.s021_Tipo) {
            if (data.s021_Tipo.trim() === d.trim()) {
              isTipoAvailable = true;
            }
          }
        } else {
          isTipoAvailable = true;
        }
      }else{
        isTipoAvailable = true;
      }
      
      if(searchString.s021_Embarque !== undefined){
      if (searchString.s021_Embarque.length) {
        for (const d of searchString.s021_Embarque) {
          if (data.s021_Embarque.trim() === d.trim()) {
            isEmbarqueAvailable = true;
          }
        }
      } else {
        isEmbarqueAvailable = true;
      }}else {
        isEmbarqueAvailable = true;
      }
      
      if(searchString.s021_Codigo !== undefined && searchString.s021_Codigo !== null){
      if (searchString.s021_Codigo.toString().length) {
        isCodigoAvailable = data.s021_Codigo.toString().trim().toLowerCase().indexOf(searchString.s021_Codigo.toString().toLowerCase()) !== -1
      } else {
        isCodigoAvailable = true;
      }}else {
        isCodigoAvailable = true;
      }
      const resultValue = isCodigoAvailable  && isEmbarqueAvailable && isProveedorAvailable && isTipoAvailable
        
      return resultValue;
    }
    
    this.portafolioOpenDS.filter = JSON.stringify(this.filterValue);
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

}