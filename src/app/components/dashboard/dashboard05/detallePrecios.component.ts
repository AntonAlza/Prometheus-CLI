import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { listaFlatMolienda } from 'src/app/models/Fisico/listaFlatMolienda';
import { PortafolioMoliendaService } from 'src/app/models/Fisico/portafolioMolienda.service';
import { Item } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesContract } from 'src/app/models/Fisico/SalesContract';
import { FlatForSale } from 'src/app/models/Fisico/FlatForSale';
import Swal from 'sweetalert2';
import { listaFuturoMolienda } from 'src/app/models/Fisico/listaFuturoMolienda';
import { listaBaseMolienda } from 'src/app/models/Fisico/listaBaseMolienda';
import { FormacionPrecios } from 'src/app/models/Fisico/FormacionPrecios';
import { cargaCombo } from 'src/app/models/Fisico/cargaCombo';
import { PriceFormationAssignment } from 'src/app/models/Fisico/PriceFormationAssignment';
import { CustomsDeclaration } from 'src/app/models/Fisico/CustomsDeclaration';
import { ExtraPremium } from 'src/app/models/Fisico/ExtraPremium';
import { listaGrupoRT } from 'src/app/models/Fisico/listaGrupoRT';
import { listaAvanceSAP } from 'src/app/models/Fisico/listaAvanceSAP';
import { RelationshipBetweenShipAndFuture } from 'src/app/models/Fisico/RelationshipBetweenShipAndFuture';
import { FutureBetweenCompany } from 'src/app/models/Fisico/FutureBetweenCompany';
import { PriceForSale } from 'src/app/models/Fisico/PriceForSale';
import { guardarBaseCross } from 'src/app/models/Fisico/guardarBaseCross';
import { BaseForSale } from 'src/app/models/Fisico/BaseForSale';
import { BaseProfitAndLoss } from 'src/app/models/Fisico/BaseProfitAndLoss';
import { Future } from 'src/app/models/Fisico/Future';
import { ClosingPrice } from 'src/app/models/Fisico/ClosingPrice';
import { ClosingPriceBetweenCompany } from 'src/app/models/Fisico/ClosingPriceBetweenCompany';
import { ClosingBasis } from 'src/app/models/Fisico/ClosingBasis';
import { ClosingBasisBetweenCompany } from 'src/app/models/Fisico/ClosingBasisBetweenCompany';
import * as XLSX from 'xlsx';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';

@Component({
  selector: 'app-detallePrecios',
  templateUrl: './detallePrecios.component.html',
  styleUrls: ['./detallePrecios.component.scss']
})
export class detallePreciosComponent implements OnInit {
  public listaFlats: listaFlatMolienda[] = [];
  public listaFuturos: listaFuturoMolienda[] = [];
  public closingBasis: ClosingBasis  = new ClosingBasis();
  public closingBasisBetweenCompany: ClosingBasisBetweenCompany  = new ClosingBasisBetweenCompany();
  public listaHijos: string[][];
  public listaBases: listaBaseMolienda[] = [];
  public nuevoContrato: SalesContract = new SalesContract();
  public nuevoFlat: FlatForSale  = new FlatForSale();
  public listaFormacionPrecios: FormacionPrecios[];
  public preciosRegistrar: PriceFormationAssignment[];
  public listaPreciosBase: number;
  public listaPreciosFuturo: number;
  public listaPreciosFlat: number;
  public tipo: string;
  public caksInt: number=0;
  public factorMetricTonPrice: number;
  public comboDestino: cargaCombo[]=[];
  public comboConcepto: cargaCombo[]=[];
  public comboSigno: cargaCombo[]=[];
  public comboExtraPrimaFecha: cargaCombo[]=[];
  public comboExtraPrimaOrigen: cargaCombo[]=[];
  public comboExtraPrimaMes: cargaCombo[]=[];
  public comboExtraPrimaPostura: cargaCombo[]=[];
  public comboExpresado: cargaCombo[]=[];
  public ExtraPrimaFecha: string;
  public ExtraPrimaOrigen: string;
  public ExtraPrimaMes: string;
  public ExtraPrimaPostura: string;
  public ExtraPrimaBenchmark: string;
  public destinoSelected: string;
  public conceptoSelected: string;
  public signoSelected: string;
  public ticker: string;
  public contador: number;
  public orden: number;
  public totalUSDTM: number;
  public totalprecio: number;
  public totalDVAValorReferencial: number;
  public flgDVA: boolean;
  public flgExtraPrima: boolean;
  public flgDVAPublico: boolean;
  public ContExtraPrima: number;
  public ContValidacionFormacionPrecio: number;
  public expresadoSelected: string;
  public dvaTotalPublicado: number;
  public dvaTotalNegociado: number;
  public nuevoDVA: CustomsDeclaration[];
  public nuevaExtraPrima: ExtraPremium[];
  public detallePadre: string[][];
  public listarGrupoRT: listaGrupoRT[];
  public listarAvanceSAP: listaAvanceSAP[];
  public interCompany: boolean=false;
  public nuevoFuturo: PriceForSale  = new PriceForSale();
  public compraventa: cargaCombo[]=[];
  public relationshipBetweenShipAndFuture: RelationshipBetweenShipAndFuture  = new RelationshipBetweenShipAndFuture();
  public nuevaBase: BaseForSale  = new BaseForSale();
  public future: Future  = new Future();
  public futureBetweenCompany: FutureBetweenCompany  = new FutureBetweenCompany();
  public closingPrice: ClosingPrice  = new ClosingPrice();
  public closingPriceBetweenCompany: ClosingPriceBetweenCompany  = new ClosingPriceBetweenCompany();

  public BaseCross: guardarBaseCross  = new guardarBaseCross();
  public baseProfitAndLoss: BaseProfitAndLoss  = new BaseProfitAndLoss();
  public premioCalidad_Base: string='0';
  public fleteMaritimo_Base: string='0';
  public saldoFlat: number;
  public washOut_Base: boolean=false;
  usuarioRegistra: Boolean = false;

  public mtoTotal: number;

  fechaModal: NgbDateStruct ;
  fecha: NgbDateStruct;
  public flgIngresar: Boolean = true;
  
  flgBontongenerico: Boolean = true;

  
  // @Input() saldoFuturos: number;
  // @Input() saldoBases: number;

  
  
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

  ngAfterViewInit(){
   
  }

  public getListaFlats(contrato: string): void {
    this.portafolioMoliendaService.getListaFlats(contrato).subscribe(
      (response: listaFlatMolienda[]) => {
        this.listaFlats = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getlistaGrupoRT(contrato: number): void {
    this.listarGrupoRT = [];
    this.portafolioMoliendaService.listarGrupoRT(contrato).subscribe(
      (response: listaGrupoRT[]) => {
        this.listarGrupoRT = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getlistaAvanceSAP(contrato: number): void {
    // contrato=1124
    this.listarAvanceSAP = [];
    this.portafolioMoliendaService.mostrarAvanceSAP(contrato).subscribe(
      (response: listaAvanceSAP[]) => {
        this.listarAvanceSAP = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaFuturos(contrato: string): void {
    this.portafolioMoliendaService.getListaFuturos(contrato).subscribe(
      (response: listaFuturoMolienda[]) => {
        this.listaFuturos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getListaBases(contrato: string): void {
    this.portafolioMoliendaService.listaBaseMolienda(contrato).subscribe(
      (response: listaBaseMolienda[]) => {
        this.listaBases = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public listarHijos(contrato: string): void {
    this.nuevoContrato = new SalesContract();
    this.portafolioMoliendaService.getContrato(Number(contrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

    this.portafolioMoliendaService.listarHijos(contrato).subscribe(
      (response: string[][]) => {
        this.listaHijos = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.portafolioMoliendaService.obtenerDetallePadre(contrato).subscribe(
      (response: string[][]) => {
        this.detallePadre = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  
  @ViewChild(MatMenuTrigger)
  contextmenu!: MatMenuTrigger;
  
  onContextMenu(event: MouseEvent, item: Item) {

    // event.preventDefault();
    // // this.contextMenuPosition.x = event.clientX - 354 + 'px';
    // // this.contextMenuPosition.y = event.clientY - 30 + 'px';
    // this.contextMenuPrecios.menuData = { 'item': item };   
    // this.contextMenuPrecios.menu.focusFirstItem('mouse');
    // // this.modalService.open(this.contextMenu ,{ scrollable: true,size: 'lg'});
    // this.contextMenuPrecios.openMenu();

    event.preventDefault();
    // this.contextMenuPosition.x = event.clientX + 'px';
    // this.contextMenuPosition.y = event.clientY + 'px';
    this.contextmenu.menuData = { 'item': item };
    this.contextmenu.menu.focusFirstItem('mouse');
    this.contextmenu.openMenu();
  }


  onContextMenuAction() {
    alert(`Click on Action for ${this.contextmenu.menuData.item}`);//Aquí
 }

 modalIngresarFlat(IngresarFlatForm:any){
  if(!this.validarpermisos("Usted no cuenta con permisos para ingresar flat")){
    return;
  }
  this.flgBontongenerico = true;
  // this.validarPortafolioCerrado();
  this.flgIngresar = true;
  this.fecha = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
  
  this.nuevoContrato = new SalesContract();
  this.nuevoFlat = new FlatForSale();
  this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
    (response: SalesContract) => {
      this.nuevoContrato = response;

      if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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

  modificarFlat(ModificarFlatForm:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para modificar flat")){
      return;
    }

    this.saldoFlat=0;
    this.flgIngresar = false;
    this.nuevoContrato = new SalesContract();
    this.nuevoFlat = new FlatForSale();
    let fechaFlatModificar: Date = new Date();
    let fechaString: string;
    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.validarPortafolioCerrado();
        }

        this.portafolioMoliendaService.obtenerFlat(this.contextmenu.menuData.item).subscribe(
          (response: FlatForSale) => {
            this.nuevoFlat = response;
            this.saldoFlat=0;
            fechaString=this.nuevoFlat.t230_Date.toString().substring(0,4) +'-'+ this.nuevoFlat.t230_Date.toString().substring(4,6) +'-'+ this.nuevoFlat.t230_Date.toString().substring(6,8);
            fechaFlatModificar = new Date(fechaString);
            fechaFlatModificar.setDate( fechaFlatModificar.getDate() + 1 );
            this.nuevoContrato.t218_MetricTons = Number(this.nuevoFlat.t230_MetricTons);
            this.nuevoContrato.t218_VolumeContract = this.nuevoFlat.t230_VolumeContract;            
            this.fecha = {day: fechaFlatModificar.getDate(),month: fechaFlatModificar.getMonth() + 1,year: fechaFlatModificar.getFullYear()};
            this.modalService.open(ModificarFlatForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });    
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
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
  modalModificarFuturo(ComprarFuturo:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para modificar futuro")){
      return;
    }
    if(!this.portafolioMoliendaService.flgEstadoPortafolio) {
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

    this.flgIngresar = false;
    this.nuevoContrato = new SalesContract();
    this.nuevoFuturo  = new PriceForSale();
    let fechaFuturoModificar: Date = new Date();
    let fechaString: string;

    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.validarPortafolioCerrado();
        }

        this.portafolioMoliendaService.obtenerFuturo(this.contextmenu.menuData.item).subscribe(
          (response: PriceForSale) => {
            this.nuevoFuturo = response;
            fechaString=this.nuevoFuturo.t227_Date.toString().substring(0,4) +'-'+ this.nuevoFuturo.t227_Date.toString().substring(4,6) +'-'+ this.nuevoFuturo.t227_Date.toString().substring(6,8);
            fechaFuturoModificar = new Date(fechaString);
            fechaFuturoModificar.setDate( fechaFuturoModificar.getDate() + 1 );

            this.fechaModal = {day: fechaFuturoModificar.getDate(),month: fechaFuturoModificar.getMonth() + 1,year: fechaFuturoModificar.getFullYear()};

            this.nuevoContrato.t218_MetricTons = Number(this.nuevoFuturo.t227_MetricTons);
            this.nuevoContrato.t218_VolumeContract = this.nuevoFuturo.t227_VolumeContract;
            this.modalService.open(ComprarFuturo,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false});  

            this.portafolioMoliendaService.getComboXTabla('T008_SellBuy').subscribe(
              (response: cargaCombo[]) => {
                this.compraventa = response;
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
            this.flgBontongenerico = true;
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: 'La Base comprada excede al Contrato de Venta',
              confirmButtonColor: '#0162e8',
              customClass: {
                container: 'my-swal'
              }});
            return
          }

    // }else{
    //       if( this.mtoTotal < Number(base.t228_MetricTons)){
    //         this.flgBontongenerico = true;
    //         Swal.fire({
    //           icon: 'warning',
    //           title: 'Aviso',
    //           text: 'La Base vendida excede a las Bases compradas',
    //           confirmButtonColor: '#0162e8',
    //           customClass: {
    //             container: 'my-swal'
    //           }});
    //         return
    //       }
    }
      this.portafolioMoliendaService.guardarBaseForSale(base).subscribe(
        data=>{
          this.baseProfitAndLoss.t340_BaseForSale=base.t228_ID

          if(base.t228_SellBuy == 2 ){
            this.baseProfitAndLoss.t340_Price=base.t228_BaseUSD
            this.portafolioMoliendaService.guardarBaseProfitAndLoss(this.baseProfitAndLoss).subscribe(
              data=>{
              },
              (error: HttpErrorResponse) => {
                  alert(error.message);
              });
          }
          if(this.washOut_Base == true){
            this.portafolioMoliendaService.CalculoWashOut(base.t228_SalesContract,this.portafolioMoliendaIFDService.usuario).subscribe(
              data=>{
              },
              (error: HttpErrorResponse) => {
                  alert(error.message);
              });
          }

          if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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

          // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
          //   (response: string) => {
          //     if(response.length > 0){ //INTERCOMPANY
          //     }
          //   },
          //   (error: HttpErrorResponse) => {
          //     alert(error.message);
          //   });
          this.portafolioMoliendaService.flgActualizar=true
          this.flgBontongenerico = true;
          Swal.fire({
            icon: 'success',
            title: 'Base Agregada',
            text: 'Se agregó la base ' + base.t228_ID.toString() + ' con exito!',
            confirmButtonColor: '#0162e8'
          });
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
      this.flgBontongenerico = true;
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

  modificarBases(pactarBase:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para modificar base")){
      return;
    }
    this.flgIngresar = false;
    this.nuevoContrato = new SalesContract();
    this.nuevaBase  = new BaseForSale();

    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
          this.interCompany = true;
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
                    this.mostrarModalModificarBase(pactarBase);
                  }
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
        }else{
          this.interCompany = false;
          this.validarPortafolioCerrado();
              this.mostrarModalModificarBase(pactarBase);
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

  mostrarModalModificarBase(pactarBase:any){
    let fechaString: string;
    let fechaBaseModificar: Date = new Date();

    this.portafolioMoliendaService.obtenerBase(this.contextmenu.menuData.item).subscribe(
      (response: BaseForSale) => {
        this.nuevaBase = response;

        fechaString=this.nuevaBase.t228_Date.toString().substring(0,4) +'-'+ this.nuevaBase.t228_Date.toString().substring(4,6) +'-'+ this.nuevaBase.t228_Date.toString().substring(6,8);
        fechaBaseModificar = new Date(fechaString);
        fechaBaseModificar.setDate( fechaBaseModificar.getDate() + 1 );

        this.fechaModal = {day: fechaBaseModificar.getDate(),month: fechaBaseModificar.getMonth() + 1,year: fechaBaseModificar.getFullYear()};

        this.nuevoContrato.t218_VolumeContract = this.nuevaBase.t228_VolumeContract;
        this.nuevoContrato.t218_MetricTons = Number(this.nuevaBase.t228_MetricTons);

        this.modalService.open(pactarBase,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false});

        this.portafolioMoliendaService.getComboXTabla('T008_SellBuy').subscribe(
          (response: cargaCombo[]) => {
            this.compraventa = response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    
  }

  guardarModificacionBase(pactarBase:any, base:BaseForSale){
    this.flgBontongenerico = false;
    base.t228_MetricTons = this.nuevoContrato.t218_MetricTons.toString();
    base.t228_VolumeContract = this.nuevoContrato.t218_VolumeContract;
    base.t228_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
    // base.t228_MetricTons = this.nuevoContrato.t218_MetricTons;

    // if(Number(this.nuevoContrato.t218_MetricTons) > (this.saldoBases + this.basesInicial)){
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Aviso',
    //     text: 'La Base comprada excede al Contrato de Venta',
    //     confirmButtonColor: '#0162e8',
    //     customClass: {
    //       container: 'my-swal'
    //     }});
    //   this.flgBontongenerico = true;
    //   return;
    // }


    this.portafolioMoliendaService.modificarBaseForSale(base).subscribe(
      data=>{
        this.portafolioMoliendaService.flgActualizar=true;

          Swal.fire({
            icon: 'success',
            title: 'Base Modificada',
            text: 'Se modificó la Base ' + base.t228_ID.toString() + ' con exito!',
            confirmButtonColor: '#0162e8'
          });
          this.flgBontongenerico = true;        
          this.modalService.dismissAll();
          // this.getListaFlats(this.portafolioMoliendaService.codigoContrato);
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      });
  }

  modalIngresarFuturo(IngresarFuturotForm:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar futuro")){
      return;
    }
    // this.validarPortafolioCerrado();
    this.flgBontongenerico = true;
    this.flgIngresar = true;
    this.nuevoContrato = new SalesContract();
    this.nuevoFuturo  = new PriceForSale();
    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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
          this.modalService.open(IngresarFuturotForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false});
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
  gananciaPerdidaBases(){
    if(!this.flgIngresar){
      return;
    }
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
  
  modalpactarBase(BaseForm:any){
    if(!this.validarpermisos("Usted no cuenta con permisos para ingresar base")){
      return;
    }
    this.flgBontongenerico = true;
    // this.validarPortafolioCerrado();
    this.washOut_Base = false;
    this.saldoFlat = 0;
    this.closingBasis = new ClosingBasis();
    this.closingBasisBetweenCompany = new ClosingBasisBetweenCompany();
    this.flgIngresar = true;
    this.BaseCross= new guardarBaseCross();
    this.baseProfitAndLoss= new BaseProfitAndLoss();
    this.nuevoContrato = new SalesContract();
    this.nuevaBase = new BaseForSale();
    this.fechaModal = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;
        this.nuevoContrato.t218_MetricTons = Math.round(this.nuevoContrato.t218_MetricTons)

        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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
            this.modalService.open(BaseForm,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false });
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

  GuardarFlat(modalFlat:any, flat: FlatForSale){
    this.flgBontongenerico = false;
    let flgContinuar = false    
    if(typeof flat.t230_FlatUSD !== 'undefined' && flat.t230_FlatUSD != null && Number(flat.t230_FlatUSD) > 0 &&
    typeof this.nuevoContrato.t218_VolumeContract !== 'undefined' && this.nuevoContrato.t218_VolumeContract != null ){ // && Number(this.nuevoContrato.t218_VolumeContract) > 0
      this.portafolioMoliendaService.precioContratoVenta(parseInt(this.nuevoContrato.t218_ID),9).subscribe(
        (response: string[]) => {

          if(this.flgIngresar){
            if(Number(response[0]) >= this.nuevoContrato.t218_MetricTons){
              flgContinuar = true;
            }else{
              flgContinuar = false;
            }
          }else{
            if((Number(response[0]) + Number(flat.t230_MetricTons)) >= this.nuevoContrato.t218_MetricTons){
              flgContinuar = true;
            }else{
              flgContinuar = false;
            }
          }
          
          if(flgContinuar){
            flat.t230_SellBuy = 1;
            flat.t230_SalesContract = Number(this.nuevoContrato.t218_ID);
            flat.t230_MetricTons = this.nuevoContrato.t218_MetricTons.toString();
            flat.t230_VolumeContract = this.nuevoContrato.t218_VolumeContract.toString();
            flat.t230_Status = 1;
            flat.t230_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
            if(this.flgIngresar){
              flat.t230_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
              flat.t230_Date = Number(this.dateToString(this.fecha));
            }
            
            if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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
            
            if(this.flgIngresar){
              this.portafolioMoliendaService.crearFlat(flat).subscribe(
                data=>{
                  this.portafolioMoliendaService.flgActualizar=true;

                    Swal.fire({
                      icon: 'success',
                      title: 'Flat Agregado',
                      text: 'Se agregó el flat ' + flat.t230_ID.toString() + ' con exito!',
                      confirmButtonColor: '#0162e8'
                    });
                    this.flgBontongenerico = true;                  
                    this.modalService.dismissAll(modalFlat);
                    this.getListaFlats(this.portafolioMoliendaService.codigoContrato);
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
              this.portafolioMoliendaService.modificarFlat(flat).subscribe(
                data=>{
                  this.portafolioMoliendaService.flgActualizar=true;
                  
                    Swal.fire({
                      icon: 'success',
                      title: 'Flat Modificado',
                      text: 'Se modificó el flat ' + flat.t230_ID.toString() + ' con exito!',
                      confirmButtonColor: '#0162e8'
                    });
                    this.flgBontongenerico = true;
                    this.modalService.dismissAll(modalFlat);
                    this.getListaFlats(this.portafolioMoliendaService.codigoContrato);
                },
                (error: HttpErrorResponse) => {
                    alert(error.message);
                });
            }
            
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
        }
      );
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

  calcularCaks(){

    if(this.nuevoContrato.t218_Contract != null && this.nuevoContrato.t218_Contract != "" && this.nuevoContrato.t218_MetricTons!= 0 && this.nuevoContrato.t218_MetricTons!= null){
      this.portafolioMoliendaService.getToneladasContratos(this.nuevoContrato.t218_MetricTons.toString().replace(".", "_"),this.nuevoContrato.t218_Contract.toString()).subscribe(
        (response: string) => {
          this.caksInt = Math.round(Number(response));
          this.nuevoContrato.t218_VolumeContract = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }else{
      this.nuevoContrato.t218_VolumeContract='';
      this.caksInt = 0;
    }      
  }

  guardarDVA(frmDVA:any){
    if(this.totalDVAValorReferencial != undefined && this.dvaTotalPublicado != undefined &&
    this.dvaTotalNegociado != undefined){
      this.listaFormacionPrecios[this.listaFormacionPrecios.length] = new FormacionPrecios();
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Trayecto = this.destinoSelected.split("|")[1];
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Concepto = this.conceptoSelected.split("|")[1];
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_SalesContract = this.portafolioMoliendaService.codigoContrato;
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_LoadingPort = this.destinoSelected.split("|")[0];
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_PriceFormation = this.conceptoSelected.split("|")[0];
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Addressing = this.signoSelected.split("|")[0];
      // this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Order = this.conceptoSelected.split("|")[1];
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_SumaResta = this.signoSelected.split("|")[1];
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_DVAValorReferencial = this.totalDVAValorReferencial.toString();
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_DVANegociado = this.dvaTotalNegociado.toString();
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_DVAPublicado = this.dvaTotalPublicado.toString();
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Valor = (this.totalDVAValorReferencial * this.dvaTotalPublicado * this.dvaTotalNegociado).toString();
      this.calcularTotales();
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario ingresar los datos',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    }  
    
  }
  guardarExtraPrima(PremioCalidad:any){
    if(this.ExtraPrimaBenchmark != undefined && this.ExtraPrimaBenchmark != ''){
      this.listaFormacionPrecios[this.listaFormacionPrecios.length] = new FormacionPrecios();
    this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Trayecto = this.destinoSelected.split(",")[1];
    this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Concepto = this.conceptoSelected.split("|")[1];
    this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_SalesContract = this.portafolioMoliendaService.codigoContrato;
    this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_LoadingPort = this.destinoSelected.split("|")[0];
    this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_PriceFormation = this.conceptoSelected.split("|")[0];
    this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Addressing = "3";
    this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_SumaResta = "()";
    this.portafolioMoliendaService.obtenerValoresExtraPrima(this.ExtraPrimaFecha,this.portafolioMoliendaService.codigoContrato,this.ExtraPrimaMes,this.portafolioMoliendaService.producto,this.ExtraPrimaPostura).subscribe(
      (response: string[]) => {
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_ExtraPrimaBase = response[0].split(",")[1];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Benchmark = response[0].split(",")[0];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].valorUnidadSubyacente = response[0].split(",")[2];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].t290_MonthContract = response[0].split(",")[4];

        this.portafolioMoliendaService.obtenerDescriptionXTabla("T002_MonthContract",response[0].split(",")[4],"T002_Description","T002_ID").subscribe(
          (response: string[]) => {
            this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_MesBenchmark = response[0];// MES
          }, 
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        
        this.portafolioMoliendaService.obtenerDescriptionXTabla("T172_BaseType",response[0].split(",")[3],"T172_Description","T172_ID").subscribe(
          (response: string[]) => {
            this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_PosturaBenchmark = response[0];
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        this.portafolioMoliendaService.obtenerDescriptionXTabla("T016_Date",this.ExtraPrimaFecha,"T016_Date","T016_ID").subscribe(
          (response: string[]) => {
            this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_FechaBenchmark = response[0];
            this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].t290_Date = this.ExtraPrimaFecha;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });

        this.portafolioMoliendaService.obtenerDescriptionXTabla("T018_Country",response[0].split(",")[6],"T018_CodeAlpha3","T018_CodeAlpha2").subscribe(
          (response: string[]) => {
            this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_OrigenBenchmark = response[0];
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });

        this.expresado(PremioCalidad);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });  
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No hay Benchmark para la opción seleccionada',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    }  
  }
    
  constructor(private portafolioMoliendaService: PortafolioMoliendaService,private modalService: NgbModal,private portafolioMoliendaIFDService: PortafolioIFDMoliendaService) {
      // this.alwaysShowCalendars = true;
  }

 

  deshacerSplit(id: number, padre: number){
    if(!this.validarpermisos("Usted no cuenta con permisos para deshacer split")){
      return;
    }

    this.validarPortafolioCerrado();      

    if(padre != 0){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede deshacer un contrato padre',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      return;
    }

    if(this.portafolioMoliendaService.flgIntercompany){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede deshacer un contrato Intercompany',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      return;
    }

    this.portafolioMoliendaService.FlgReversion(this.nuevoContrato.t218_ID.toString(),id.toString()).subscribe(
      (response: number) => {
        
        if(response>0){
          Swal.fire({
            icon: 'question',
            title: 'Revertir Split',
            html: 'No se considerarán las modificaciones del hijo posteriores al split. ¿Seguro que desea revertir el Contrato Venta <b>' + id.toString() + '</b>?',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            reverseButtons: true,
            confirmButtonColor: '#4b822d'
          }).then((result) => {
            if (result.isConfirmed) {
              this.portafolioMoliendaService.revertirSplit(Number(this.nuevoContrato.t218_ID),id).subscribe(
                (response: boolean) => {
                  this.portafolioMoliendaService.flgActualizar=true;
                  this.modalService.dismissAll();
          
                  Swal.fire({
                    icon: 'success',
                    title: 'Reversión de Split',
                    text: 'Se ha revertido el Split con exito!',
                    confirmButtonColor: '#0162e8'
                  });
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });          
              }
            }
          )
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No es posible revertir contratos posteriores al 28/03/2022',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
          return;
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

  }
  
  formacionPrecios(contrato: string){
    this.validarPortafolioCerrado();
    this.portafolioMoliendaService.obtenerFormacionPrecios(Number(contrato)).subscribe(
      (response: FormacionPrecios[]) => {
        this.listaFormacionPrecios = response;
        this.portafolioMoliendaService.listarPreciosContrato(Number(contrato)).subscribe(
          (response: string[]) => {
            this.listaPreciosBase = Number(response[0].split(",")[1]);
            this.listaPreciosFuturo = Number(response[0].split(",")[0]);
            this.listaPreciosFlat = Number(response[0].split(",")[2]);
            this.portafolioMoliendaService.factorMetricTonPrice(Number(contrato)).subscribe(
              (response: string[]) => {
                this.factorMetricTonPrice = Number(response[0]);
                this.calcularTotales();

                // ----------------------------------------

                this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
                  (response: SalesContract) => {
                    this.nuevoContrato = response;
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
                // ----------------------------------------


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
    
    this.portafolioMoliendaService.obtenerTicker(Number(contrato)).subscribe(
      (response: string[]) => {
          this.ticker= response[0];
      },
        (error: HttpErrorResponse) => {
          alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('destino').subscribe(
      (response: cargaCombo[]) => {
        this.comboDestino = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('concepto').subscribe(
      (response: cargaCombo[]) => {
        this.comboConcepto = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    this.portafolioMoliendaService.getCombo('signo').subscribe(
      (response: cargaCombo[]) => {
        this.comboSigno = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  exportarFormacionPrecios(){
    let exportarConsulta:string[][] = [];
    let cont = 0;

    for (let item of this.listaFormacionPrecios){
      exportarConsulta[cont] = [];
      exportarConsulta[cont][1] = item.s115_Trayecto;
      exportarConsulta[cont][2] = item.s115_Concepto;
      exportarConsulta[cont][3] = item.s115_SumaResta;
      exportarConsulta[cont][4] = item.s115_Valor;
      exportarConsulta[cont][5] = (Number(item.s115_Valor) / this.factorMetricTonPrice).toString();
      exportarConsulta[cont][6] = item.s115_DVAValorReferencial;
      exportarConsulta[cont][7] = item.s115_DVAPublicado;
      exportarConsulta[cont][8] = item.s115_DVANegociado;
      exportarConsulta[cont][9] = item.s115_FechaBenchmark;
      exportarConsulta[cont][10] = item.s115_OrigenBenchmark;
      exportarConsulta[cont][11] = item.s115_MesBenchmark;
      exportarConsulta[cont][12] = item.s115_PosturaBenchmark;
      exportarConsulta[cont][13] = item.s115_Benchmark;
      exportarConsulta[cont][14] = "";
      exportarConsulta[cont][15] = "";
      exportarConsulta[cont][16] = "";
      exportarConsulta[cont][17] = "";
      exportarConsulta[cont][18] = "";
      exportarConsulta[cont][19] = "";
      cont += 1;
      if(this.listaFormacionPrecios.length == cont){
        exportarConsulta[cont] = [];
        exportarConsulta[cont][3] = 'Precio';
        exportarConsulta[cont][4] = this.totalUSDTM.toString();
        exportarConsulta[cont][5] = this.totalprecio.toString();   
        if(this.listaFormacionPrecios.length == 1){
          exportarConsulta[cont][14] = "";
          exportarConsulta[cont][15] = "";
          exportarConsulta[cont][16] = "";
          exportarConsulta[cont][17] = "";
          exportarConsulta[cont][18] = "";
          exportarConsulta[cont][19] = "";
        }    
      }      
    }
    
    
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(exportarConsulta);
    ws['A1'].v = 'Destino';
    ws['B1'].v = 'Concepto';
    ws['C1'].v = 'Suma/Resta';
    ws['D1'].v = 'USD/TM';
    ws['E1'].v = this.ticker;
    ws['F1'].v = 'DVA - Valor Referencial USD/TM';
    ws['G1'].v = 'DVA - Publicado %';
    ws['H1'].v = 'DVA - Negociado %';
    ws['I1'].v = 'Benchmark - Fecha';
    ws['J1'].v = 'Benchmark - Orígen';
    ws['K1'].v = 'Benchmark - Mes';
    ws['L1'].v = 'Benchmark - Postura';
    ws['M1'].v = 'Benchmark - ' + this.ticker;

    ws['N1'].v = '';
    ws['O1'].v = '';
    ws['P1'].v = '';

    ws['Q1'].v = 'Concepto';
    ws['R1'].v = 'USD/TM';
    ws['S1'].v = this.ticker;
    
    if(this.nuevoContrato.t218_PriceType == '1'){
      //FLAT
      ws['Q2'].v = 'FLAT';
      ws['R2'].v = this.listaPreciosFlat;
      ws['S2'].v = this.listaPreciosFlat / this.factorMetricTonPrice;
    }else{
      // FUTURO
      ws['Q2'].v = 'FUTURO';
      ws['R2'].v = this.listaPreciosFuturo * this.factorMetricTonPrice;
      ws['S2'].v = this.listaPreciosFuturo;
      //BASE
      ws['Q3'].v = 'BASE';
      ws['R3'].v = this.listaPreciosBase * this.factorMetricTonPrice;
      ws['S3'].v = this.listaPreciosBase;
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detalle');
        
    /* save to file */  
    XLSX.writeFile(wb, "FormacionPrecio_"+this.nuevoContrato.t218_ID.toString()+".xlsx");
  }
  calcularTotales(){
    this.flgDVA = false;
    this.flgExtraPrima = false;
    this.totalUSDTM=0;
    this.totalprecio=0;
    for (let item of this.listaFormacionPrecios){
      if(item.s115_FechaBenchmark == '1900-01-01 00:00:00.0'){
        item.s115_FechaBenchmark = '';
      } 
      if(item.s115_Benchmark == '0.0'){
        item.s115_Benchmark = '';
      }
      if(item.s115_DVAValorReferencial == '0.0'){
        item.s115_DVAValorReferencial = '';
      } 
      if(item.s115_DVAPublicado == '0.0'){
        item.s115_DVAPublicado = '';
      } 
      if(item.s115_DVANegociado == '0.0'){
        item.s115_DVANegociado = '';
      }  
      if(item.s115_SumaResta == "+"){
        this.totalUSDTM = this.totalUSDTM + Number(item.s115_Valor);
        this.totalprecio = this.totalprecio + Number(item.s115_Valor)/ this.factorMetricTonPrice ;
      }else if(item.s115_SumaResta == "-"){
        this.totalUSDTM = this.totalUSDTM - Number(item.s115_Valor);
        this.totalprecio = this.totalprecio - Number(item.s115_Valor) / this.factorMetricTonPrice ;
      }
      if(Number(item.s115_DVAValorReferencial) != 0 && item.s115_DVAValorReferencial != undefined){
        this.flgDVA = true;
      }
      if(Number(item.s115_Benchmark) != 0 && item.s115_Benchmark != undefined){
        this.flgExtraPrima = true;
      }
    }
    this.totalprecio = this.totalprecio + (this.listaPreciosFlat/this.factorMetricTonPrice) + this.listaPreciosFuturo + this.listaPreciosBase;
    this.totalUSDTM = this.totalUSDTM + (this.listaPreciosFlat) + (this.listaPreciosFuturo*this.factorMetricTonPrice) + (this.listaPreciosBase*this.factorMetricTonPrice);
  }

  agregarConcepto(frmExtraPrima:any,frmDVA: any,PremioCalidad: any){
    if(this.conceptoSelected != "" && this.conceptoSelected != undefined && this.destinoSelected != "" && this.destinoSelected != undefined && this.signoSelected != "" && this.signoSelected != undefined){
      this.flgDVAPublico = false;
      if(this.conceptoSelected.split("|")[0] == "22" || this.conceptoSelected.split("|")[0] == "10"){//DVA
        this.totalDVAValorReferencial=0;
        if(this.conceptoSelected.split("|")[0] == "22"){
          this.flgDVAPublico = true;
          for (let item of this.listaFormacionPrecios){
            if(item.s115_PriceFormation != "24"){
              if(item.s115_SumaResta == "+"){
                this.totalDVAValorReferencial = this.totalDVAValorReferencial + Number(item.s115_Valor);
              }else if(item.s115_SumaResta == "-"){
                this.totalDVAValorReferencial = this.totalDVAValorReferencial - Number(item.s115_Valor);
              }
            }
          }
          this.totalDVAValorReferencial = this.totalDVAValorReferencial + (this.listaPreciosFlat) + (this.listaPreciosFuturo*this.factorMetricTonPrice) + (this.listaPreciosBase*this.factorMetricTonPrice);
        }
        if(this.conceptoSelected.split("|")[0] == "10"){
          this.flgDVAPublico = false;
        }
        this.expresado(PremioCalidad);
        this.modalService.open(frmDVA,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false});
      }else if(this.conceptoSelected.split("|")[0] == "25"){ //Extra Prima
        this.portafolioMoliendaService.optionsForCalculation(this.portafolioMoliendaService.producto,"25").subscribe(
          (response: string[]) => {
            if(response[0] == "1"){
              
              this.portafolioMoliendaService.getCombo('mesExtraPrima').subscribe(
                (response: cargaCombo[]) => {
                    this.comboExtraPrimaMes = response;
                    this.ExtraPrimaMes = (response[0]['s204_ID']);

                    this.portafolioMoliendaService.getComboXTabla('T172_BaseType').subscribe(
                      (response: cargaCombo[]) => {
                        this.comboExtraPrimaPostura = response;
                        this.ExtraPrimaPostura = "3";

                        this.portafolioMoliendaService.getCombo('origenExtraPrima').subscribe(
                          (response: cargaCombo[]) => {
                            this.comboExtraPrimaOrigen = response;
                            this.ExtraPrimaOrigen = "AR";

                            this.portafolioMoliendaService.getCombo('fechaExtraPrima').subscribe(
                              (response: cargaCombo[]) => {
                                this.comboExtraPrimaFecha = response;
                                this.ExtraPrimaFecha = (response[0]['s204_ID']);
                                this.calcularBenchmark();
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
                },
                (error: HttpErrorResponse) => {
                    alert(error.message);
                });
                
              this.modalService.open(frmExtraPrima,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false});
            }
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      }else {
        this.expresado(PremioCalidad);
        this.listaFormacionPrecios[this.listaFormacionPrecios.length] = new FormacionPrecios();
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Trayecto = this.destinoSelected.split("|")[1];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Concepto = this.conceptoSelected.split("|")[1];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_SalesContract = this.portafolioMoliendaService.codigoContrato;
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_LoadingPort = this.destinoSelected.split("|")[0];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_PriceFormation = this.conceptoSelected.split("|")[0];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Addressing = this.signoSelected.split("|")[0];
        // this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_Order = this.conceptoSelected.split("|")[1];
        this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].s115_SumaResta = this.signoSelected.split("|")[1];
      }
      
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Es necesario seleccionar concepto, destino y signo',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
    }
  }
  expresado(expresado:any){
    if(this.conceptoSelected.split("|")[2] == "3"){
      this.portafolioMoliendaService.getCombo('expresado').subscribe(
        (response: cargaCombo[]) => {
          this.comboExpresado = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
      this.modalService.open(expresado ,{ centered: true,size: 'lg',backdrop : 'static',keyboard : false});
    }else if(this.conceptoSelected.split("|")[2] == "2"){
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].UnidadSubyacente = "TM";
      this.calcularUnidadSubyacente(this.listaFormacionPrecios.length-1);
    }
  }

  definicionUnidades(){
    if(this.expresadoSelected == "2"){
      this.listaFormacionPrecios[this.listaFormacionPrecios.length-1].UnidadSubyacente = "TM";
    }
  }

  calcularUnidadSubyacente(i:number){
    // this.listaFormacionPrecios[i].s115_Valor = (this.valorUnidadSubyacente * this.factorMetricTonPrice).toString();
    this.listaFormacionPrecios[i].s115_Valor = (Number(this.listaFormacionPrecios[i].valorUnidadSubyacente) * this.factorMetricTonPrice).toString();
    this.calcularTotales();
  }

  calcularBenchmark(){
    this.ExtraPrimaBenchmark = '' ;
    if(this.ExtraPrimaFecha != undefined && this.ExtraPrimaOrigen != undefined && this.ExtraPrimaMes != undefined && this.ExtraPrimaPostura != undefined &&
    this.ExtraPrimaFecha != '' && this.ExtraPrimaOrigen != '' && this.ExtraPrimaMes != '' && this.ExtraPrimaPostura != ''){
      this.portafolioMoliendaService.obtenerBenchmark(this.ExtraPrimaFecha,this.ExtraPrimaOrigen,this.ExtraPrimaMes,this.portafolioMoliendaService.producto,this.ExtraPrimaPostura).subscribe(
        (response: string[]) => {
          if (response.length > 0){
            this.ExtraPrimaBenchmark = response[0];
          }else{
            // Swal.fire({
            //   icon: 'warning',
            //   title: 'Aviso',
            //   text: 'No hay Benchmark para la opción seleccionada',
            //   confirmButtonColor: '#0162e8',
            //   customClass: {
            //     container: 'my-swal'
            //   }
            // });
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }else{
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'Aviso',
      //   text: 'Es necesario seleccionar todos los campos',
      //   confirmButtonColor: '#0162e8',
      //   customClass: {
      //     container: 'my-swal'
      //   }
      // });
    }
  }
  quitarConcepto(i:number){
    this.listaFormacionPrecios.splice(i,1);
    this.calcularTotales();
  }
  guardarConceptos(){
    this.flgBontongenerico = false;
    if(!this.usuarioRegistra){
      Swal.fire({
        icon: 'error',
        title: 'Permiso denegado',
        text: 'Usted no cuenta con permiso de registro',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return;
    }
    this.validarPortafolioCerrado();

    this.preciosRegistrar = [];
    this.contador = 0
    this.orden = 6
    this.ContValidacionFormacionPrecio = 0;
    this.ContExtraPrima = 0;
    for (let x of this.listaFormacionPrecios){
      this.ContValidacionFormacionPrecio = 0;
      for (let y of this.listaFormacionPrecios){
        if(x.s115_LoadingPort == y.s115_LoadingPort && x.s115_Addressing == y.s115_Addressing && x.s115_PriceFormation == y.s115_PriceFormation)
          this.ContValidacionFormacionPrecio += 1;
      }
      if(this.ContValidacionFormacionPrecio > 1){
        this.flgBontongenerico = true;
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'No es posible registrar conceptos duplicados',
          confirmButtonColor: '#0162e8',
          customClass: {
            container: 'my-swal'
          }
        });
        return;
      }
      if(x.s115_PriceFormation == "25"){
        this.ContExtraPrima += 1;
      }
    }
    if(this.ContExtraPrima > 1){
      this.flgBontongenerico = true;
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No es posible registrar más de una Extra Prima',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      return;
    }

    if(this.listaFormacionPrecios.length == 0){
      this.portafolioMoliendaService.eliminarFormacionPrecios(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
        data=>{},
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    }

    for (let item of this.listaFormacionPrecios){
      this.preciosRegistrar[this.contador] = new PriceFormationAssignment();
      this.preciosRegistrar[this.contador].t224_SalesContract = item.s115_SalesContract;
      this.preciosRegistrar[this.contador].t224_LoadingPort = item.s115_LoadingPort;
      this.preciosRegistrar[this.contador].t224_PriceFormation = item.s115_PriceFormation;
      this.preciosRegistrar[this.contador].t224_Addressing = item.s115_Addressing;
      this.preciosRegistrar[this.contador].t224_Order = this.orden.toString();
      this.preciosRegistrar[this.contador].t224_Value = item.s115_Valor.toString();
      this.preciosRegistrar[this.contador].t224_Status = "1";
      this.contador+=1;
      this.orden+=1;
    }
    this.portafolioMoliendaService.guardarFormacionPrecios(this.preciosRegistrar).subscribe(
      data=>{

          // ----------------------------------Hacer Promesa------------------------------------
          if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
            if(this.nuevoContrato.t218_Incoterm == "6"){
              this.portafolioMoliendaService.actualizarOtherCostsOrDiscountsCFR(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
                data=>{
                  this.portafolioMoliendaService.actualizarFreightCFR(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
                    data=>{
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
            }else{
              this.portafolioMoliendaService.actualizarOtherCostsOrDiscounts(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
                data=>{
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
            }
          }
          // this.portafolioMoliendaService.listarComprasEntreCompanias(Number(this.nuevoContrato.t218_GrindingCustomer)).subscribe(
          //   (response: string) => {
          //     if(response.length > 0){ //INTERCOMPANY 
          //     }
          //   },
          //   (error: HttpErrorResponse) => {
          //     alert(error.message);
          //   });
          // --------------------------------------------------------------------------------------------

        if(this.flgDVA){
          this.contador = 0
          this.nuevoDVA = [];
          for (let item of this.listaFormacionPrecios){
            if(item.s115_PriceFormation =="22" || item.s115_PriceFormation =="10"){
              this.nuevoDVA[this.contador] = new CustomsDeclaration();
              this.nuevoDVA[this.contador].t243_SalesContract = item.s115_SalesContract;
              this.nuevoDVA[this.contador].t243_LoadingPort = item.s115_LoadingPort;
              this.nuevoDVA[this.contador].t243_PriceFormation = item.s115_PriceFormation;
              this.nuevoDVA[this.contador].t243_Addressing = item.s115_Addressing;
              this.nuevoDVA[this.contador].t243_Status = "1";
              this.nuevoDVA[this.contador].t243_FreeOnBoard = item.s115_DVAValorReferencial;
              this.nuevoDVA[this.contador].t243_Published = item.s115_DVAPublicado;
              this.nuevoDVA[this.contador].t243_Negotiated = item.s115_DVANegociado;
              this.contador+=1;
            }
          }
          this.portafolioMoliendaService.guardarDVA(this.nuevoDVA).subscribe(
            data=>{
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
        }
        if(this.flgExtraPrima){
          this.contador = 0
          this.nuevaExtraPrima = [];  
          for (let item of this.listaFormacionPrecios){
            if(item.s115_PriceFormation == "25"){
              this.nuevaExtraPrima[this.contador] = new ExtraPremium();
              this.nuevaExtraPrima[this.contador].t290_SalesContract = item.s115_SalesContract;
              this.nuevaExtraPrima[this.contador].t290_LoadingPort = item.s115_LoadingPort;
              this.nuevaExtraPrima[this.contador].t290_PriceFormation = item.s115_PriceFormation;
              this.nuevaExtraPrima[this.contador].t290_Addressing = item.s115_Addressing;
              this.nuevaExtraPrima[this.contador].t290_Country = "AR";
              this.nuevaExtraPrima[this.contador].t290_MonthContract = item.t290_MonthContract;
              this.nuevaExtraPrima[this.contador].t290_BaseType = "3";
              this.nuevaExtraPrima[this.contador].t290_Date = item.t290_Date;
              this.nuevaExtraPrima[this.contador].t290_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
              if(item.s115_ExtraPrimaBase == undefined){
                this.nuevaExtraPrima[this.contador].t290_Base = item.t290_Base;
              }else{
                this.nuevaExtraPrima[this.contador].t290_Base = item.s115_ExtraPrimaBase;
              }
              if(item.valorUnidadSubyacente == undefined){
                this.nuevaExtraPrima[this.contador].t290_Value = item.t290_Value;
              }else{
                this.nuevaExtraPrima[this.contador].t290_Value = item.valorUnidadSubyacente;
              }
              
              this.nuevaExtraPrima[this.contador].t290_Benchmark = item.s115_Benchmark;
              
              this.nuevaExtraPrima[this.contador].t290_Status = "1";
              this.contador+=1;
            }
          }
          this.portafolioMoliendaService.guardarExtraPrima(this.nuevaExtraPrima).subscribe(
            data=>{
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });       
        }
        Swal.fire({
          icon: 'success',
          title: 'Formación de Precios',
          text: 'Se guardó la formación de precios con exito!',
          confirmButtonColor: '#0162e8'
        });
        this.flgBontongenerico = true;
        this.portafolioMoliendaService.flgActualizar=true;
        this.modalService.dismissAll();
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      });
  }

  cancelarFuturo(){
    if(!this.validarpermisos("Usted no cuenta con permisos para cancelar base")){
      return;
    }

    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
          this.interCompany = true;
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
                    this.accionEliminarFuturo();
                  }
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
        }else{
          this.interCompany = false;
          this.validarPortafolioCerrado();
              this.accionEliminarFuturo();
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

  accionEliminarFuturo(){
    Swal.fire({
      icon: 'question',
      title: 'Cancelación de Futuro',
      html: '¿Desea cancelar el Futuro <b>' + this.contextmenu.menuData.item + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.eliminarFuturo(this.portafolioMoliendaIFDService.usuario,Number(this.contextmenu.menuData.item),this.nuevoContrato.t218_GrindingCustomer).subscribe(
          (response: string[]) => {
            this.portafolioMoliendaService.obtenerBarco(Number(this.nuevoContrato.t218_ID)).subscribe(
              (response: string[]) => {
                // if(this.interCompany){
                //   this.ActualizarFuturoBarco(response[0],this.nuevoContrato.t218_ID);
                // }
    
                this.getListaFuturos(this.portafolioMoliendaService.codigoContrato);
                this.portafolioMoliendaService.flgActualizar=true;
                this.portafolioMoliendaService.notificarEliminarFuturo(Number(this.portafolioMoliendaService.producto),Number(this.nuevoContrato.t218_Society),Number(this.contextmenu.menuData.item)).subscribe(
                  (response: string) => {
                    
                  },
                  (error: HttpErrorResponse) => {
                    alert(error.message);
                  });
                Swal.fire({
                  title: 'Cancelación de Futuro!',
                  html: 'Se realizó la cancelación del Futuro <b>' + this.contextmenu.menuData.item.toString() + '</b>',
                  icon: 'success',
                  confirmButtonColor: '#4b822d'
                })
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              });
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });        
        }
      }
    )
  }

  cancelarBase(){
    if(!this.validarpermisos("Usted no cuenta con permisos para cancelar base")){
      return;
    }
    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
          this.interCompany = true;
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
                    this.accionEliminarBase();
                  }
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                });
        }else{
          this.interCompany = false;
          this.validarPortafolioCerrado();
              this.accionEliminarBase();
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

  accionEliminarBase(){
    Swal.fire({
      icon: 'question',
      title: 'Cancelación de Base',
      html: '¿Desea cancelar la Base <b>' + this.contextmenu.menuData.item + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.eliminarBase(this.portafolioMoliendaIFDService.usuario,Number(this.contextmenu.menuData.item),this.nuevoContrato.t218_GrindingCustomer,this.nuevoContrato.t218_ID,Number(this.portafolioMoliendaService.producto)).subscribe(
          (response: string[]) => {
            this.getListaBases(this.portafolioMoliendaService.codigoContrato);
            this.portafolioMoliendaService.flgActualizar=true;
            Swal.fire({
              title: 'Cancelación de Base!',
              html: 'Se realizó la cancelación de la Base <b>' + this.contextmenu.menuData.item.toString() + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });        
        }
      }
    )
  }

  cancelarFlat(){

    if(!this.validarpermisos("Usted no cuenta con permisos para cancelar flat")){
      return;
    }

    this.portafolioMoliendaService.getContrato(Number(this.portafolioMoliendaService.codigoContrato)).subscribe(
      (response: SalesContract) => {
        this.nuevoContrato = response;

        if(this.portafolioMoliendaService.compania.toString() == "22" && this.nuevoContrato.t218_GrindingCustomer == '1' && this.nuevoContrato.t218_SellBuy == '2'){
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
                this.accionEliminarFlat();
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
        }else{
          this.validarPortafolioCerrado();
          this.accionEliminarFlat();
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

  accionEliminarFlat(){
    Swal.fire({
      icon: 'question',
      title: 'Cancelación de Flat',
      html: '¿Desea cancelar el Flat <b>' + this.contextmenu.menuData.item + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.portafolioMoliendaService.eliminarFlat(this.portafolioMoliendaIFDService.usuario,Number(this.contextmenu.menuData.item),this.nuevoContrato.t218_GrindingCustomer,this.nuevoContrato.t218_ID,Number(this.portafolioMoliendaService.producto)).subscribe(
          (response: string[]) => {
            this.getListaFlats(this.portafolioMoliendaService.codigoContrato);
            this.portafolioMoliendaService.flgActualizar=true;
            Swal.fire({
              title: 'Cancelación de Flat!',
              html: 'Se realizó la cancelación del Flat <b>' + this.contextmenu.menuData.item.toString() + '</b>',
              icon: 'success',
              confirmButtonColor: '#4b822d'
            })
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });        
        }
      }
    )
  }

  // ActualizarFuturoBarco(barco: string, contrato: string){
  //   this.relationshipBetweenShipAndFuture = new RelationshipBetweenShipAndFuture;
  //   this.relationshipBetweenShipAndFuture.t147_Physical = Number(barco);
  //   this.portafolioMoliendaService.obtenerFutureBetweenCompanyRepo(Number(contrato)).subscribe(
  //     (response: FutureBetweenCompany[]) => {
  //       this.relationshipBetweenShipAndFuture.t147_Future = response[0].t238_Future;
  //       this.relationshipBetweenShipAndFuture.t147_RegysteredBy = this.portafolioMoliendaIFDService.usuario;
  //       this.portafolioMoliendaService.precioContratoVenta(parseInt(this.nuevoContrato.t218_ID),4).subscribe(
  //         (response: string[]) => {
  //           this.relationshipBetweenShipAndFuture.t147_MetricTons = response[0];
  //           this.portafolioMoliendaService.precioContratoVenta(parseInt(this.nuevoContrato.t218_ID),10).subscribe(
  //             (response: string[]) => {
  //               this.relationshipBetweenShipAndFuture.t147_VolumeContract = response[0];
  //               this.relationshipBetweenShipAndFuture.t147_ModifiedBy = this.portafolioMoliendaIFDService.usuario;
  //               this.relationshipBetweenShipAndFuture.t147_Status = '1';8
  //               this.portafolioMoliendaService.buscarRelationshipBetweenShipAndFutureXFisicoyFuture(Number(barco),Number(this.relationshipBetweenShipAndFuture.t147_Future)).subscribe(
  //                 (response: RelationshipBetweenShipAndFuture[]) => {
  //                   let relacion = new RelationshipBetweenShipAndFuture;
  //                   relacion = response[0];
  //                   if(response.length == 0){
  //                     this.portafolioMoliendaService.guardarRelationshipBetweenShipAndFuture(this.relationshipBetweenShipAndFuture).subscribe( //GUARDAR NUEVO RelationshipBetweenShipAndFuture
  //                       data=>{ },
  //                       (error: HttpErrorResponse) => {
  //                           alert(error.message);
  //                       });
  //                   }else{
  //                     this.relationshipBetweenShipAndFuture.t147_Date = relacion.t147_Date;
  //                     //UPDATE DE RelationshipBetweenShipAndFuture
  //                     this.portafolioMoliendaService.updateRelationshipBetweenShipAndFuture(this.relationshipBetweenShipAndFuture.t147_Date,this.relationshipBetweenShipAndFuture.t147_VolumeContract,this.relationshipBetweenShipAndFuture.t147_MetricTons,this.relationshipBetweenShipAndFuture.t147_ModifiedBy,barco,this.relationshipBetweenShipAndFuture.t147_Future).subscribe( //GUARDAR NUEVO RelationshipBetweenShipAndFuture
  //                       data=>{ },
  //                       (error: HttpErrorResponse) => {
  //                           alert(error.message);
  //                       });
  //                   }
  //                 },
  //                 (error: HttpErrorResponse) => {
  //                   alert(error.message);
  //                 });
  //             },
  //             (error: HttpErrorResponse) => {
  //               alert(error.message);
  //             });
  //         },
  //         (error: HttpErrorResponse) => {
  //           alert(error.message);
  //         });
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     });
  // }
  modificarFuturo(modalFuturo:any, futuro: PriceForSale){
    this.flgBontongenerico = false;

    // if(Number(this.nuevoContrato.t218_VolumeContract) > (this.saldoFuturos + this.futurosInicial)){
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Aviso',
    //     text: 'El saldo Futuro excede al del Contrato de Venta',
    //     confirmButtonColor: '#0162e8',
    //     customClass: {
    //       container: 'my-swal'
    //     }});
    //   this.flgBontongenerico = true;
    //   return;
    // }

      if( futuro.t227_FutureUSD != null && futuro.t227_FutureUSD != ''
       && this.nuevoContrato.t218_VolumeContract != null && this.nuevoContrato.t218_VolumeContract != '' && futuro.t227_SellBuy != null && futuro.t227_SellBuy != ''){
        
        // futuro.t227_SalesContract = this.nuevoContrato.t218_ID
        futuro.t227_ModifiedBy =this.portafolioMoliendaIFDService.usuario
        // futuro.t227_Status = '1'
        // futuro.t227_Date = this.dateToString(this.fechaModal);
        futuro.t227_MetricTons = this.nuevoContrato.t218_MetricTons.toString()
        futuro.t227_VolumeContract = this.nuevoContrato.t218_VolumeContract

        this.guardarmodiciacionFuturo(modalFuturo , futuro);

       }else{
        this.flgBontongenerico = true;
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
  GuardarFuturo(modalFuturo:any, futuro: PriceForSale){
    this.flgBontongenerico = false;
    if( futuro.t227_FutureUSD != null && futuro.t227_FutureUSD != ''
       && this.nuevoContrato.t218_VolumeContract != null && this.nuevoContrato.t218_VolumeContract != '' && futuro.t227_SellBuy != null && futuro.t227_SellBuy != ''){
        this.portafolioMoliendaService.SaldoFuturo(Number(this.nuevoContrato.t218_ID)).subscribe(
          (response: string[]) => {
            if(Number(response[0].split(",")[0]) == 0 && Number(response[0].split(",")[1]) < Number(this.nuevoContrato.t218_VolumeContract) && futuro.t227_SellBuy.toString() == '1' ){
              this.flgBontongenerico = true;
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'El saldo Futuro excede al del Contrato de Venta',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }});
                return;
            }else{
              // if(futuro.t227_SellBuy.toString() == '2'){
              //   Swal.fire({
              //     icon: 'warning',
              //     title: 'Aviso',
              //     text: 'El saldo Futuro que desea vender excede el saldo comprado',
              //     confirmButtonColor: '#0162e8',
              //     customClass: {
              //       container: 'my-swal'
              //     }});
              //     return;
              // }
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
        this.flgBontongenerico = true;
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

  guardarmodiciacionFuturo(modalFuturo:any,futuro: PriceForSale){
    this.portafolioMoliendaService.guardarmodificacionFuturo(futuro).subscribe(
      data=>{
        this.portafolioMoliendaService.flgActualizar=true
        Swal.fire({
          icon: 'success',
          title: 'Modificación de Futuro',
          text: 'Se modificó el Futuro ' + futuro.t227_ID.toString() + ' con exito!',
          confirmButtonColor: '#0162e8'
        });
          this.flgBontongenerico = true;
          this.modalService.dismissAll(modalFuturo);
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      });
    
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
          this.flgBontongenerico = true;
          this.modalService.dismissAll(modalFuturo);
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

  validarPortafolioCerrado(){
    if(!this.portafolioMoliendaService.flgEstadoPortafolio) {
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

  ngOnInit(): void {
    
    this.tipo = this.portafolioMoliendaService.tipo;

    if(this.tipo == "FLAT"){
      this.getListaFlats(this.portafolioMoliendaService.codigoContrato);
    }else if(this.tipo == "FUTURO"){
      this.getListaFuturos(this.portafolioMoliendaService.codigoContrato);
    }
    else if(this.tipo == "BASES"){
      this.getListaBases(this.portafolioMoliendaService.codigoContrato);
    }
    else if(this.tipo == "FORMACIONPRECIOS"){
      this.formacionPrecios(this.portafolioMoliendaService.codigoContrato);
    }
    else if(this.tipo == "HIJOS"){
      this.listarHijos(this.portafolioMoliendaService.codigoContrato);
    }
    else if(this.tipo == "mostrarGrupoRT"){
      this.getlistaGrupoRT(Number(this.portafolioMoliendaService.codigoContrato));
    }
    else if(this.tipo == "mostratAvanceSAP"){
      this.getlistaAvanceSAP(Number(this.portafolioMoliendaService.codigoContrato));
    }

    if(this.portafolioMoliendaIFDService.perfiles.indexOf("Administrador") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("FO_Fisico_RegistroOperacion") > -1 || this.portafolioMoliendaIFDService.perfiles.indexOf("MO_Fisico_Controller") > -1){
      this.usuarioRegistra = true;
    }else{
      this.usuarioRegistra = false;
    }

  }
}
